import { z } from "zod";

export const analysisSchema = z.object({
  name: z.string().min(1),
  brand: z.string().nullable(),
  model: z.string().nullable(),
  category: z.enum([
    "ropa",
    "calzado",
    "accesorio",
    "audio_vintage",
    "hifi",
    "electronica",
    "otro",
  ]),
  size: z.string().nullable(),
  material: z.string().nullable(),
  color: z.string().nullable(),
  style: z.string().nullable(),
  condition: z.enum([
    "nuevo_etiqueta",
    "como_nuevo",
    "muy_bueno",
    "bueno",
    "aceptable",
  ]),
  rarity: z.number().min(0).max(100),
  market: z.string().nullable(),
  demand: z.enum(["baja", "media", "alta", "muy_alta"]),
  confidence: z.number().min(0).max(100),
  description: z.string(),
});

export type ItemAnalysis = z.infer<typeof analysisSchema>;

export const marketResearchSchema = z.object({
  query: z.string().min(1).max(300),
  summary: z.string().min(1).max(1200),
  demand: z.enum(["baja", "media", "alta", "muy_alta"]),
  comparableMin: z.number().min(0).max(100000),
  comparableMedian: z.number().min(0).max(100000),
  comparableMax: z.number().min(0).max(100000),
  recommendedPrice: z.number().min(0).max(100000),
  quickPrice: z.number().min(0).max(100000),
  premiumPrice: z.number().min(0).max(100000),
  confidence: z.number().min(0).max(100),
  caveat: z.string().min(1).max(600),
});

export const listingSchema = z.object({
  title: z.string().min(1).max(100),
  body: z.string().min(1).max(4000),
  keywords: z.array(z.string().min(1).max(50)).max(12),
  price: z.number().min(0).max(100000),
  notes: z.string().min(1).max(800),
});

export type MarketResearchDraft = z.infer<typeof marketResearchSchema>;
export type ListingDraft = z.infer<typeof listingSchema>;
