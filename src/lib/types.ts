export type ItemStatus =
  | "pending"
  | "analyzing"
  | "ready"
  | "needs_review"
  | "listed"
  | "kept"
  | "discarded";

export type ItemCategory =
  | "ropa"
  | "calzado"
  | "accesorio"
  | "audio_vintage"
  | "hifi"
  | "electronica"
  | "otro";

export type Condition =
  | "nuevo_etiqueta"
  | "como_nuevo"
  | "muy_bueno"
  | "bueno"
  | "aceptable";

export type Demand = "baja" | "media" | "alta" | "muy_alta";

export type Strategy =
  | "conservar"
  | "publicar"
  | "agrupar"
  | "subir_precio"
  | "liquidar";

export type UploadSource = "mobile" | "desktop";

export type ImageKind = "original" | "enhanced";

export interface ItemImage {
  id: string;
  ordinal: number;
  isPrimary: boolean;
  uploadedFrom: UploadSource;
  kind?: ImageKind;
  generatedBy?: string;
  storagePath?: string;
}

export interface Prices {
  liquidation: number;
  quick: number;
  recommended: number;
  premium: number;
}

export interface MarketSource {
  title: string;
  url: string;
}

export interface MarketResearch {
  query: string;
  summary: string;
  demand: Demand;
  comparableMin: number;
  comparableMedian: number;
  comparableMax: number;
  recommendedPrice: number;
  quickPrice: number;
  premiumPrice: number;
  confidence: number;
  caveat: string;
  sources: MarketSource[];
  researchedAt: string;
}

export interface Item {
  id: string;
  status: ItemStatus;
  name: string;
  brand: string | null;
  model: string | null;
  category: ItemCategory | null;
  size: string | null;
  material: string | null;
  color: string | null;
  style: string | null;
  condition: Condition | null;
  rarity: number | null;
  market: string | null;
  demand: Demand | null;
  prices: Prices | null;
  aiConfidence: number | null;
  analysisProvider?: string | null;
  aiDescription: string | null;
  opportunityIndex: number | null;
  strategy: Strategy | null;
  marketResearch?: MarketResearch | null;
  images: ItemImage[];
  createdAt: string;
  updatedAt: string;
}

export type Platform = "marktplaats" | "vinted";

export interface Listing {
  platform: Platform;
  title: string;
  body: string;
  keywords: string[];
  price: number;
  notes: string;
}
