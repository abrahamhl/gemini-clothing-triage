import type { AIProvider, ImageInput } from "./provider";
import type { ItemAnalysis } from "./schema";
import type { Item, Listing, MarketResearch, Platform } from "@/lib/types";
import { composeListing, composeLotListing } from "@/lib/listing";

const SAMPLES: ItemAnalysis[] = [
  {
    name: "Chaqueta Carhartt Detroit",
    brand: "Carhartt",
    model: "Detroit Jacket",
    category: "ropa",
    size: "L",
    material: "Lona de algodón encerado",
    color: "Marrón",
    style: "Workwear",
    condition: "muy_bueno",
    rarity: 64,
    market: "Streetwear / Workwear",
    demand: "alta",
    confidence: 92,
    description:
      "Chaqueta de trabajo en lona resistente con forro de borreguillo. Pieza icónica muy buscada en streetwear, con desgaste honesto que aporta carácter.",
  },
  {
    name: "Sudadera Stone Island",
    brand: "Stone Island",
    model: "Crewneck",
    category: "ropa",
    size: "M",
    material: "Algodón",
    color: "Verde militar",
    style: "Premium casual",
    condition: "como_nuevo",
    rarity: 78,
    market: "Premium streetwear",
    demand: "muy_alta",
    confidence: 88,
    description:
      "Sudadera con parche característico. Demanda muy alta y reventa sólida; estado casi impecable que justifica precio premium.",
  },
  {
    name: "Altavoz vintage JBL L100",
    brand: "JBL",
    model: "L100 Century",
    category: "audio_vintage",
    size: null,
    material: "Madera de nogal",
    color: "Nogal",
    style: "HiFi clásico",
    condition: "bueno",
    rarity: 83,
    market: "Audio vintage / coleccionismo",
    demand: "alta",
    confidence: 81,
    description:
      "Monitor doméstico legendario de los 70 con rejilla Quadrex. Muy cotizado entre coleccionistas; revisar conos y crossover antes de fijar premium.",
  },
  {
    name: "Zapatillas New Balance 990v3",
    brand: "New Balance",
    model: "990v3 Made in USA",
    category: "calzado",
    size: "43",
    material: "Ante y malla",
    color: "Gris",
    style: "Sneakers",
    condition: "muy_bueno",
    rarity: 58,
    market: "Sneakers",
    demand: "alta",
    confidence: 90,
    description:
      "Clásico gris fabricado en USA. Talla muy comercial y demanda constante; suela con vida útil amplia.",
  },
  {
    name: "Amplificador Marantz 2238",
    brand: "Marantz",
    model: "2238",
    category: "hifi",
    size: null,
    material: "Metal y aluminio cepillado",
    color: "Plata",
    style: "HiFi vintage",
    condition: "bueno",
    rarity: 75,
    market: "HiFi vintage",
    demand: "media",
    confidence: 79,
    description:
      "Receptor estéreo de los 70 con dial iluminado azul. Sonido cálido apreciado; verificar lámparas del dial y potenciómetros.",
  },
  {
    name: "Bolso Eastpak negro",
    brand: "Eastpak",
    model: "Padded Pak'r",
    category: "accesorio",
    size: null,
    material: "Nylon",
    color: "Negro",
    style: "Casual",
    condition: "aceptable",
    rarity: 22,
    market: "Accesorios cotidianos",
    demand: "baja",
    confidence: 85,
    description:
      "Mochila resistente de uso diario. Margen bajo unitario; candidata ideal a lote o liquidación rápida.",
  },
];

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export class MockProvider implements AIProvider {
  readonly name = "mock";

  async analyzeItem(images: ImageInput[]): Promise<ItemAnalysis> {
    const seed = images[0]?.base64.slice(0, 256) ?? String(images.length);
    const sample = SAMPLES[hash(seed) % SAMPLES.length];
    await new Promise((r) => setTimeout(r, 600));
    return { ...sample };
  }

  async enhanceListingImage(): Promise<ImageInput> {
    throw new Error("gemini_required_for_image_enhancement");
  }

  async researchMarket(item: Item): Promise<MarketResearch> {
    const recommendedPrice = item.prices?.recommended ?? 0;
    return {
      query: [item.brand, item.model, item.name].filter(Boolean).join(" "),
      summary: "Estimación de demostración basada en la valoración interna; no se consultó el mercado web.",
      demand: item.demand ?? "media",
      comparableMin: item.prices?.liquidation ?? 0,
      comparableMedian: recommendedPrice,
      comparableMax: item.prices?.premium ?? recommendedPrice,
      recommendedPrice,
      quickPrice: item.prices?.quick ?? recommendedPrice,
      premiumPrice: item.prices?.premium ?? recommendedPrice,
      confidence: 25,
      caveat: "Activa Gemini para obtener una auditoría con búsquedas y fuentes actuales.",
      sources: [],
      researchedAt: new Date().toISOString(),
    };
  }

  async generateListing(item: Item, platform: Platform): Promise<Listing> {
    return composeListing(item, platform);
  }

  async generateLotListing(
    items: Item[],
    platform: Platform,
    lotName: string,
    targetPrice: number,
  ): Promise<Listing> {
    return composeLotListing(items, platform, lotName, targetPrice);
  }
}
