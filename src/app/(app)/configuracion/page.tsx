import { Card } from "@/components/ui";

function Row({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 py-2.5 text-sm last:border-0">
      <span className="text-muted">{label}</span>
      <span className="inline-flex items-center gap-2 font-medium">
        <span
          className={`size-2 rounded-full ${ok ? "bg-accent" : "bg-warn"}`}
        />
        {value}
      </span>
    </div>
  );
}

export default function ConfiguracionPage() {
  const wantsGemini =
    (process.env.AI_PROVIDER ?? "").toLowerCase() === "gemini" &&
    Boolean(process.env.GEMINI_API_KEY || process.env.GEMINI_MODE === "vertex");
  const mode = process.env.GEMINI_MODE ?? "studio";

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight">Configuración</h1>
      <p className="text-sm text-muted">
        Estado de los servicios. Las claves nunca se muestran ni salen del
        servidor.
      </p>

      <Card className="mt-5">
        <p className="text-sm font-medium">Motor de IA</p>
        <div className="mt-2">
          <Row
            label="Proveedor activo"
            value={wantsGemini ? `Gemini (${mode})` : "Simulado (mock)"}
            ok={wantsGemini}
          />
          <Row
            label="Calidad de análisis"
            value={wantsGemini ? "Real" : "Demo realista"}
            ok={wantsGemini}
          />
          <Row
            label="Mejora fotográfica"
            value={wantsGemini ? "Gemini Image activo" : "Requiere Gemini"}
            ok={wantsGemini}
          />
          <Row
            label="Auditoría de mercado"
            value={wantsGemini ? "Google Search bajo demanda" : "Estimación demo"}
            ok={wantsGemini}
          />
          <Row
            label="Respaldo de visión"
            value="Ollama · Gemma 3 4B · RTX 3060"
            ok
          />
        </div>
        {!wantsGemini && (
          <p className="mt-3 rounded-lg bg-surface-2 p-3 text-xs text-muted">
            Para activar Gemini real: añade <code>AI_PROVIDER=gemini</code> y{" "}
            <code>GEMINI_API_KEY</code> en <code>.env.local</code> y reinicia.
            Para usar tus créditos de Vertex, cambia a{" "}
            <code>GEMINI_MODE=vertex</code> con tu proyecto de Google Cloud.
          </p>
        )}
        {wantsGemini && (
          <p className="mt-3 rounded-lg bg-surface-2 p-3 text-xs text-muted">
            Gemini necesita saldo o cuota disponible. Si falla, el análisis continúa en la GPU local y la corrección fotográfica usa el modo local; las búsquedas web muestran una valoración sin fuentes hasta recuperar el acceso.
          </p>
        )}
      </Card>

      <Card className="mt-4">
        <p className="text-sm font-medium">Datos y almacenamiento</p>
        <div className="mt-2">
          <Row label="Adaptador" value="Local (este equipo)" ok />
          <Row label="Sincronización en la nube" value="Pendiente (Supabase)" />
        </div>
        <p className="mt-3 rounded-lg bg-surface-2 p-3 text-xs text-muted">
          El loop funciona 100% en local. Al conectar Supabase obtienes
          sincronización móvil en tiempo real y backup, sin cambiar el resto de
          la app.
        </p>
      </Card>
    </div>
  );
}
