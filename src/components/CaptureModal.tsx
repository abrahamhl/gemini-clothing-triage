"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, ImagePlus, UploadCloud, X } from "lucide-react";
import { api } from "@/lib/client";
import { Button, Spinner } from "@/components/ui";
import { cn } from "@/lib/cn";

type Phase = "idle" | "uploading" | "analyzing" | "done";
type CaptureMode = "single" | "bulk";

const ACCEPTED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const ERROR_LABELS: Record<string, string> = {
  too_many_views: "Una prenda admite hasta 8 vistas.",
  too_many: "Puedes subir hasta 24 fotos por tanda.",
  payload_too_large: "La tanda supera 48 MB. Divide la subida en dos.",
  too_large: "Hay una foto de más de 8 MB.",
  bad_type: "Usa fotos JPEG, PNG, WebP o HEIC.",
};

export function CaptureModal({
  source,
  onClose,
  onChange,
}: {
  source: "mobile" | "desktop";
  onClose: () => void;
  onChange: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [mode, setMode] = useState<CaptureMode>("single");
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  );

  useEffect(
    () => () => previews.forEach((preview) => URL.revokeObjectURL(preview.url)),
    [previews],
  );

  function select(fileList: FileList | null) {
    const selected = Array.from(fileList ?? []).filter((file) =>
      ACCEPTED.has(file.type.toLowerCase()),
    );
    if (selected.length === 0) {
      setError("Usa fotos JPEG, PNG, WebP o HEIC.");
      return;
    }
    setError(null);
    setFiles((current) => {
      const maximum = mode === "single" ? 8 : 24;
      return [...current, ...selected].slice(0, maximum);
    });
  }

  async function run() {
    if (files.length === 0) return;
    
    const attempts = parseInt(localStorage.getItem('demo_attempts') || '0', 10);
    if (attempts >= 10) {
      setError("Has superado el límite de 10 intentos gratuitos de demo. Contáctanos para adquirir la versión ilimitada.");
      return;
    }
    localStorage.setItem('demo_attempts', (attempts + 1).toString());
    
    setError(null);
    try {
      setPhase("uploading");
      const created = await api.uploadImages(files, source, mode);
      onChange();

      setPhase("analyzing");
      setProgress({ done: 0, total: created.length });
      for (let i = 0; i < created.length; i++) {
        try {
          await api.analyze(created[i].id);
        } catch {
          // El artículo queda marcado para revisión; continuamos con el resto.
        }
        setProgress({ done: i + 1, total: created.length });
        onChange();
      }
      setPhase("done");
    } catch (caught) {
      const code = caught instanceof Error ? caught.message : "upload_failed";
      setError(ERROR_LABELS[code] ?? "No se pudo completar la subida. Inténtalo de nuevo.");
      setPhase("idle");
    }
  }

  const busy = phase === "uploading" || phase === "analyzing";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
      <div className="card max-h-[92vh] w-full max-w-xl overflow-y-auto p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Añadir fotos al catálogo</h2>
            <p className="text-xs text-muted">El original siempre se conserva sin cambios.</p>
          </div>
          <button
            onClick={onClose}
            disabled={busy}
            className="rounded-lg p-1 text-muted hover:bg-surface-2 disabled:opacity-40"
            aria-label="Cerrar"
          >
            <X className="size-5" />
          </button>
        </div>

        {phase === "idle" && (
          <>
            <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-surface-2 p-1">
              <ModeButton
                active={mode === "single"}
                title="Una prenda"
                detail="Varias vistas"
                onClick={() => {
                  setMode("single");
                  setFiles((current) => current.slice(0, 8));
                }}
              />
              <ModeButton
                active={mode === "bulk"}
                title="Carga masiva"
                detail="Una foto por artículo"
                onClick={() => setMode("bulk")}
              />
            </div>

            <div
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                select(event.dataTransfer.files);
              }}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "mt-4 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition",
                dragging
                  ? "border-primary bg-primary-soft"
                  : "border-border hover:border-primary/50 hover:bg-surface-2",
              )}
            >
              <span className="brand-gradient flex size-12 items-center justify-center rounded-2xl text-white">
                <UploadCloud className="size-6" />
              </span>
              <p className="font-medium">Arrastra o selecciona tus fotos</p>
              <p className="max-w-sm text-sm text-muted">
                {mode === "single"
                  ? "Sube frontal, trasera, etiqueta, composición y defectos de la misma prenda."
                  : "Cada foto creará una ficha independiente."}
              </p>
            </div>

            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => inputRef.current?.click()}
              >
                <ImagePlus className="size-4" /> Elegir fotos
              </Button>
              <Button
                variant="soft"
                className="flex-1"
                onClick={() => cameraRef.current?.click()}
              >
                <Camera className="size-4" /> Cámara
              </Button>
            </div>

            {previews.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-xs text-muted">
                  <span>{previews.length} fotos preparadas</span>
                  <button onClick={() => setFiles([])} className="font-medium text-primary">
                    Limpiar
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {previews.map((preview, index) => (
                    <div key={`${preview.file.name}-${index}`} className="group relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={preview.url}
                        alt={`Vista ${index + 1}`}
                        className="aspect-square w-full rounded-lg border border-border object-cover"
                      />
                      <button
                        onClick={() => setFiles((current) => current.filter((_, i) => i !== index))}
                        className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-text text-white shadow"
                        aria-label={`Quitar vista ${index + 1}`}
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <Button className="mt-4 w-full" onClick={run}>
                  Subir y analizar {mode === "single" ? "esta prenda" : "los artículos"}
                </Button>
              </div>
            )}

            {error && (
              <p className="mt-3 rounded-lg bg-[#fdecec] p-3 text-sm text-danger">{error}</p>
            )}
          </>
        )}

        {busy && (
          <div className="mt-8 flex flex-col items-center gap-3 py-8 text-center">
            <Spinner className="size-8 text-primary" />
            <p className="font-medium">
              {phase === "uploading"
                ? "Guardando originales…"
                : `Analizando con IA · ${progress.done}/${progress.total}`}
            </p>
            <p className="text-sm text-muted">
              Extraemos marca, estado, talla, valor y señales útiles para packs.
            </p>
          </div>
        )}

        {phase === "done" && (
          <div className="mt-8 flex flex-col items-center gap-3 py-6 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-accent-soft text-2xl">✓</span>
            <p className="font-medium">
              {progress.total === 1 ? "Artículo listo" : `${progress.total} artículos listos`}
            </p>
            <p className="text-sm text-muted">Ya están valorados y añadidos al inventario.</p>
            <Button className="mt-2" onClick={onClose}>Ver inventario</Button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          multiple
          hidden
          onChange={(event) => {
            select(event.target.files);
            event.target.value = "";
          }}
        />
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          hidden
          onChange={(event) => {
            select(event.target.files);
            event.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

function ModeButton({
  active,
  title,
  detail,
  onClick,
}: {
  active: boolean;
  title: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-lg px-3 py-2 text-left transition",
        active ? "bg-surface text-primary shadow-sm" : "text-muted",
      )}
    >
      <span className="block text-sm font-semibold">{title}</span>
      <span className="block text-[11px]">{detail}</span>
    </button>
  );
}
