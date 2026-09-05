import type {
  Condition,
  Demand,
  ItemCategory,
  ItemStatus,
  Strategy,
} from "@/lib/types";

export const euro = (n: number | null | undefined): string =>
  n == null ? "—" : new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);

export const STATUS: Record<ItemStatus, { label: string; tone: string }> = {
  pending: { label: "Pendiente", tone: "bg-surface-2 text-muted" },
  analyzing: { label: "Analizando", tone: "bg-primary-soft text-primary" },
  ready: { label: "Listo", tone: "bg-accent-soft text-[#0b8c79]" },
  needs_review: { label: "Revisar", tone: "bg-[#fff3d6] text-[#9a6a00]" },
  listed: { label: "Publicado", tone: "bg-primary-soft text-primary" },
  kept: { label: "Conservar", tone: "bg-surface-2 text-text" },
  discarded: { label: "Descartado", tone: "bg-surface-2 text-muted" },
};

export const STRATEGY: Record<Strategy, { label: string; tone: string }> = {
  conservar: { label: "Conservar", tone: "bg-surface-2 text-text" },
  publicar: { label: "Publicar", tone: "bg-accent-soft text-[#0b8c79]" },
  agrupar: { label: "Agrupar en lote", tone: "bg-primary-soft text-primary" },
  subir_precio: { label: "Subir precio", tone: "bg-pink-soft text-[#c2186e]" },
  liquidar: { label: "Liquidar", tone: "bg-[#fff3d6] text-[#9a6a00]" },
};

export const CONDITION_LABEL: Record<Condition, string> = {
  nuevo_etiqueta: "Nuevo con etiqueta",
  como_nuevo: "Como nuevo",
  muy_bueno: "Muy bueno",
  bueno: "Bueno",
  aceptable: "Aceptable",
};

export const DEMAND_LABEL: Record<Demand, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
  muy_alta: "Muy alta",
};

export const CATEGORY_LABEL: Record<ItemCategory, string> = {
  ropa: "Ropa",
  calzado: "Calzado",
  accesorio: "Accesorio",
  audio_vintage: "Audio vintage",
  hifi: "HiFi",
  electronica: "Electrónica",
  otro: "Otro",
};

export function opportunityTone(score: number): string {
  if (score >= 70) return "text-[#0b8c79]";
  if (score >= 45) return "text-primary";
  return "text-muted";
}
