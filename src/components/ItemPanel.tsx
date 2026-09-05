"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Search,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import { api } from "@/lib/client";
import type { Item, Listing, Platform } from "@/lib/types";
import { Badge, Button, Spinner } from "@/components/ui";
import {
  CONDITION_LABEL,
  DEMAND_LABEL,
  STATUS,
  STRATEGY,
  euro,
  opportunityTone,
} from "@/lib/ui";
import { cn } from "@/lib/cn";

const PRICE_TIERS = [
  { key: "liquidation", label: "Liquidación" },
  { key: "quick", label: "Venta rápida" },
  { key: "recommended", label: "Recomendado" },
  { key: "premium", label: "Premium" },
] as const;

const PLATFORM_URL: Record<Platform, string> = {
  marktplaats: "https://www.marktplaats.nl/plaats",
  vinted: "https://www.vinted.nl/items/new",
};

type BusyAction = "enhance" | "research" | "listing" | null;

export function ItemPanel({
  item,
  onClose,
  onChange,
}: {
  item: Item;
  onClose: () => void;
  onChange: () => void;
}) {
  const primary = item.images.find((image) => image.isPrimary) ?? item.images[0];
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const shown = item.images.find((image) => image.id === selectedImageId) ?? primary;
  const [platform, setPlatform] = useState<Platform>("marktplaats");
  const [listing, setListing] = useState<Listing | null>(null);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<BusyAction>(null);
  const [error, setError] = useState<string | null>(null);

  async function act(patch: Partial<Item>) {
    await api.patch(item.id, patch);
    onChange();
  }

  async function enhance() {
    setBusy("enhance");
    setError(null);
    try {
      await api.enhance(item.id);
      setSelectedImageId(null);
      await onChange();
    } catch {
      setError("No se pudo generar la foto mejorada. Comprueba Gemini y prueba con JPEG, PNG o WebP.");
    } finally {
      setBusy(null);
    }
  }

  async function research() {
    setBusy("research");
    setError(null);
    try {
      await api.research(item.id, Boolean(item.marketResearch));
      await onChange();
    } catch {
      setError("La auditoría de mercado no ha terminado. Conservamos la valoración anterior.");
    } finally {
      setBusy(null);
    }
  }

  async function generate(nextPlatform: Platform) {
    setPlatform(nextPlatform);
    setListing(null);
    setCopied(false);
    setBusy("listing");
    setError(null);
    try {
      setListing(await api.listing(item.id, nextPlatform));
    } catch {
      setError("No se pudo generar el anuncio. Revisa primero el análisis del artículo.");
    } finally {
      setBusy(null);
    }
  }

  function listingText(): string {
    if (!listing) return "";
    return `${listing.title}\n\n${listing.body}\n\nPrijs: ${euro(listing.price)}\n\n${listing.keywords.map((keyword) => `#${keyword}`).join(" ")}`;
  }

  async function copyAll() {
    if (!listing) return;
    await navigator.clipboard.writeText(listingText());
    setCopied(true);
  }

  async function shareAll() {
    if (!listing) return;
    if (navigator.share) {
      await navigator.share({ title: listing.title, text: listingText() });
      return;
    }
    await copyAll();
  }

  function openPlatform() {
    window.open(PLATFORM_URL[platform], "_blank", "noopener,noreferrer");
    void copyAll();
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/20 backdrop-blur-sm">
      <div className="scroll-area h-full w-full max-w-lg overflow-y-auto border-l border-border bg-surface p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold leading-tight">{item.name}</h2>
            <p className="text-sm text-muted">
              {[item.brand, item.model].filter(Boolean).join(" · ") || "Sin marca"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted hover:bg-surface-2"
            aria-label="Cerrar"
          >
            <X className="size-5" />
          </button>
        </div>

        {shown && (
          <div className="relative mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/images/${shown.id}`}
              alt={item.name}
              className="aspect-square w-full rounded-xl border border-border object-cover"
            />
            <span className={cn(
              "absolute left-3 top-3 rounded-full px-2 py-1 text-[11px] font-semibold shadow-sm",
              shown.kind === "enhanced"
                ? "bg-primary text-white"
                : "bg-white/90 text-text",
            )}>
              {shown.kind === "enhanced"
                ? shown.generatedBy === "local-sharp"
                  ? "Corrección local"
                  : "Mejorada con IA"
                : "Original"}
            </span>
          </div>
        )}

        {item.images.length > 1 && (
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {item.images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImageId(image.id)}
                className={cn(
                  "relative shrink-0 rounded-lg border-2",
                  shown?.id === image.id ? "border-primary" : "border-transparent",
                )}
                title={image.kind === "enhanced"
                  ? image.generatedBy === "local-sharp" ? "Corrección local" : "Foto mejorada con IA"
                  : `Vista original ${index + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/images/${image.id}`}
                  alt={`Vista ${index + 1}`}
                  className="size-14 rounded-md object-cover"
                />
                {image.kind === "enhanced" && (
                  <Sparkles className="absolute bottom-1 right-1 size-3 rounded-full bg-primary p-0.5 text-white" />
                )}
              </button>
            ))}
          </div>
        )}

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button variant="soft" disabled={busy !== null} onClick={enhance}>
            {busy === "enhance" ? <Spinner /> : <Sparkles className="size-4" />}
            Mejorar foto stock
          </Button>
          {shown && (
            <a
              href={`/api/images/${shown.id}`}
              download={`${item.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.jpg`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium transition hover:bg-surface-2"
            >
              <Download className="size-4" /> Descargar
            </a>
          )}
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-muted">
          Corrige fondo, luz, balance y arrugas de presentación. No debe ocultar desgaste ni defectos reales; revisa siempre el resultado antes de publicar.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge tone={STATUS[item.status].tone}>{STATUS[item.status].label}</Badge>
          {item.strategy && (
            <Badge tone={STRATEGY[item.strategy].tone}>{STRATEGY[item.strategy].label}</Badge>
          )}
          {item.aiConfidence != null && (
            <span className="text-xs text-muted">
              Confianza IA {item.aiConfidence}%
              {item.analysisProvider === "ollama-gpu" ? " · GPU local" : ""}
            </span>
          )}
        </div>

        {item.aiDescription && (
          <p className="mt-4 text-sm leading-relaxed text-text/90">{item.aiDescription}</p>
        )}

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <Field label="Talla" value={item.size} />
          <Field label="Material" value={item.material} />
          <Field label="Color" value={item.color} />
          <Field label="Estilo" value={item.style} />
          <Field label="Estado" value={item.condition ? CONDITION_LABEL[item.condition] : null} />
          <Field label="Demanda" value={item.demand ? DEMAND_LABEL[item.demand] : null} />
        </dl>

        {item.prices && (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium">Valoración</p>
              {item.opportunityIndex != null && (
                <p className="text-xs text-muted">
                  Oportunidad{" "}
                  <span className={cn("font-semibold", opportunityTone(item.opportunityIndex))}>
                    {item.opportunityIndex}/100
                  </span>
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PRICE_TIERS.map((tier) => (
                <div
                  key={tier.key}
                  className={cn(
                    "rounded-xl border border-border p-3",
                    tier.key === "recommended" && "border-primary/40 bg-primary-soft/40",
                  )}
                >
                  <p className="text-xs text-muted">{tier.label}</p>
                  <p className="text-lg font-semibold">{euro(item.prices![tier.key])}</p>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="mt-3 w-full"
              disabled={busy !== null}
              onClick={research}
            >
              {busy === "research" ? <Spinner /> : <Search className="size-4" />}
              {item.marketResearch ? "Actualizar auditoría de mercado" : "Auditar mercado y precios"}
            </Button>
          </div>
        )}

        {item.marketResearch && (
          <div className="mt-3 rounded-xl border border-accent/40 bg-accent-soft/40 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">Mercado auditado</p>
              <span className="text-[11px] text-muted">Confianza {item.marketResearch.confidence}%</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-text/90">{item.marketResearch.summary}</p>
            <p className="mt-2 text-[11px] text-muted">{item.marketResearch.caveat}</p>
            {item.marketResearch.sources.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {item.marketResearch.sources.slice(0, 4).map((source, index) => (
                  <a
                    key={source.url}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                  >
                    Fuente {index + 1} <ExternalLink className="size-3" />
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button variant="soft" onClick={() => act({ status: "listed" })}>Marcar publicado</Button>
          <Button variant="outline" onClick={() => act({ status: "kept" })}>Conservar</Button>
          <Button variant="outline" onClick={() => act({ strategy: "agrupar" })}>Agrupar</Button>
          <Button variant="danger" onClick={() => act({ status: "discarded" })}>Descartar</Button>
        </div>

        {item.prices && (
          <div className="mt-6 border-t border-border pt-5">
            <p className="text-sm font-medium">Anuncio optimizado</p>
            <p className="mt-1 text-xs text-muted">Genera en neerlandés con el precio de la última auditoría.</p>
            <div className="mt-2 flex gap-2">
              {(["marktplaats", "vinted"] as Platform[]).map((nextPlatform) => (
                <button
                  key={nextPlatform}
                  onClick={() => generate(nextPlatform)}
                  disabled={busy !== null}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition disabled:opacity-50",
                    platform === nextPlatform && listing
                      ? "bg-primary-soft text-primary"
                      : "bg-surface-2 text-muted hover:text-text",
                  )}
                >
                  {nextPlatform}
                </button>
              ))}
              {busy === "listing" && <Spinner className="my-auto text-primary" />}
            </div>

            {listing && (
              <div className="mt-3 rounded-xl border border-border bg-surface-2/50 p-3">
                <p className="text-sm font-semibold">{listing.title}</p>
                <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-text/90">{listing.body}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {listing.keywords.map((keyword) => (
                    <span key={keyword} className="rounded-md bg-surface px-1.5 py-0.5 text-[11px] text-muted">
                      #{keyword}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted">{listing.notes}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-semibold">{euro(listing.price)}</span>
                  <div className="flex gap-1.5">
                    <Button variant="outline" className="px-3" onClick={shareAll} title="Compartir">
                      <Share2 className="size-4" />
                    </Button>
                    <Button variant="soft" className="px-3" onClick={copyAll}>
                      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                      {copied ? "Copiado" : "Copiar"}
                    </Button>
                  </div>
                </div>
                <Button className="mt-2 w-full" onClick={openPlatform}>
                  Abrir {platform} <ExternalLink className="size-4" />
                </Button>
                <p className="mt-2 text-[11px] text-muted">
                  Se copia el texto y se abre el formulario oficial. La publicación final queda bajo tu revisión.
                </p>
              </div>
            )}
          </div>
        )}

        {error && <p className="mt-4 rounded-lg bg-[#fdecec] p-3 text-sm text-danger">{error}</p>}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="font-medium">{value ?? "—"}</dd>
    </div>
  );
}
