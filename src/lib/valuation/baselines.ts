import type { Condition, Demand, ItemCategory } from "@/lib/types";

// Anclas calibradas con mercado NL (Marktplaats/Vinted, jun-2026), incluyendo
// las marcas reales del stock. En audio el modelo pesa más que la marca: estos
// valores son medianas de uso común y la rareza/demanda amplifican los hero.
export const BRAND_BASE: Record<string, number> = {
  // Moda
  "stone island": 200,
  gucci: 380,
  "the north face": 85,
  carhartt: 75,
  patagonia: 80,
  "new balance": 100,
  "dr martens": 70,
  "state of art": 25,
  geisha: 22,
  "jack & jones": 20,
  mcgregor: 12,
  adidas: 28,
  puma: 18,
  nike: 50,
  zara: 15,
  "h&m": 12,
  eastpak: 18,
  // Audio / HiFi
  "bowers & wilkins": 160,
  marantz: 260,
  technics: 270,
  sansui: 230,
  klipsch: 220,
  jbl: 200,
  pioneer: 150,
  bose: 130,
  magnat: 55,
  philips: 60,
  sony: 90,
};

export const CATEGORY_BASE: Record<ItemCategory, number> = {
  ropa: 35,
  calzado: 50,
  accesorio: 20,
  audio_vintage: 200,
  hifi: 220,
  electronica: 60,
  otro: 25,
};

export const CONDITION_FACTOR: Record<Condition, number> = {
  nuevo_etiqueta: 1.25,
  como_nuevo: 1.1,
  muy_bueno: 1.0,
  bueno: 0.85,
  aceptable: 0.65,
};

export const DEMAND_FACTOR: Record<Demand, number> = {
  baja: 0.8,
  media: 1.0,
  alta: 1.2,
  muy_alta: 1.4,
};

export const DEMAND_VELOCITY_DAYS: Record<Demand, number> = {
  baja: 45,
  media: 25,
  alta: 12,
  muy_alta: 6,
};

const SEASONAL_COLORS: Record<number, string[]> = {
  3: ["naranja", "orange"],
  11: ["rojo", "verde", "navidad"],
};

export function seasonalBoost(color: string | null, month: number): number {
  if (!color) return 1;
  const hits = SEASONAL_COLORS[month] ?? [];
  return hits.some((c) => color.toLowerCase().includes(c)) ? 1.15 : 1;
}
