import { z } from "zod";
import type { Item, Listing, MarketResearch, Platform } from "@/lib/types";
import { composeListing, composeLotListing } from "@/lib/listing";
import { ANALYSIS_INSTRUCTION, type AIProvider, type ImageInput } from "./provider";
import {
  analysisSchema,
  listingSchema,
  type ItemAnalysis,
  type ListingDraft,
} from "./schema";

type ChatResponse = { message?: { content?: string } };

export class OllamaProvider implements AIProvider {
  readonly name = "ollama-gpu";
  private baseUrl = process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434";
  private model = process.env.OLLAMA_VISION_MODEL ?? "gemma3:4b";

  private async chatJson<T>(
    prompt: string,
    schema: z.ZodType<T>,
    images: ImageInput[] = [],
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.model,
        stream: false,
        format: z.toJSONSchema(schema),
        messages: [
          { role: "system", content: ANALYSIS_INSTRUCTION },
          {
            role: "user",
            content: prompt,
            images: images.map((image) => image.base64),
          },
        ],
        options: { temperature: 0.1 },
      }),
      signal: AbortSignal.timeout(180_000),
    });
    if (!response.ok) throw new Error(`ollama_${response.status}`);
    const payload = await response.json() as ChatResponse;
    if (!payload.message?.content) throw new Error("ollama_empty_response");
    return schema.parse(JSON.parse(payload.message.content));
  }

  async analyzeItem(images: ImageInput[]): Promise<ItemAnalysis> {
    const analysis = await this.chatJson(
      `Estas imágenes son distintas vistas de un único artículo. Identifica solo lo realmente visible y devuelve la ficha comercial solicitada. Usa null si no puedes leer un dato. Rarity y confidence deben ser porcentajes en escala 0-100, no valores 0-1.`,
      analysisSchema,
      images,
    );
    return {
      ...analysis,
      rarity: analysis.rarity <= 1 ? Math.round(analysis.rarity * 100) : analysis.rarity,
      confidence: analysis.confidence <= 1
        ? Math.round(analysis.confidence * 100)
        : analysis.confidence,
    };
  }

  async enhanceListingImage(): Promise<ImageInput> {
    throw new Error("ollama_image_generation_unavailable");
  }

  async researchMarket(item: Item): Promise<MarketResearch> {
    const recommendedPrice = item.prices?.recommended ?? 0;
    return {
      query: [item.brand, item.model, item.name].filter(Boolean).join(" "),
      summary: "Valoración local sin búsqueda web, conservada como referencia mientras Gemini Search no está disponible.",
      demand: item.demand ?? "media",
      comparableMin: item.prices?.liquidation ?? 0,
      comparableMedian: recommendedPrice,
      comparableMax: item.prices?.premium ?? recommendedPrice,
      recommendedPrice,
      quickPrice: item.prices?.quick ?? recommendedPrice,
      premiumPrice: item.prices?.premium ?? recommendedPrice,
      confidence: 25,
      caveat: "Sin comparables web actuales: revisa manualmente los enlaces de búsqueda antes de publicar.",
      sources: [],
      researchedAt: new Date().toISOString(),
    };
  }

  private async listingDraft(
    items: Item[],
    platform: Platform,
    targetPrice: number,
    lotName?: string,
  ): Promise<ListingDraft> {
    return this.chatJson(
      `Redacta un anuncio honesto en neerlandés natural para ${platform}. ${items.length > 1 ? `Es el pack "${lotName}".` : "Es un artículo individual."}
Título máximo 100 caracteres, cuerpo breve y escaneable, hasta 10 keywords sin #, nota interna en español y precio exacto ${targetPrice}.
No inventes defectos, autenticidad, medidas ni accesorios. Datos: ${JSON.stringify(items.map((item) => ({
        name: item.name,
        brand: item.brand,
        model: item.model,
        size: item.size,
        material: item.material,
        color: item.color,
        condition: item.condition,
        description: item.aiDescription,
      })))}`,
      listingSchema,
    );
  }

  async generateListing(item: Item, platform: Platform): Promise<Listing> {
    const target = item.marketResearch?.recommendedPrice ?? item.prices?.recommended ?? 0;
    try {
      const draft = await this.listingDraft([item], platform, target);
      return { ...draft, platform, price: target };
    } catch {
      return composeListing(item, platform);
    }
  }

  async generateLotListing(
    items: Item[],
    platform: Platform,
    lotName: string,
    targetPrice: number,
  ): Promise<Listing> {
    try {
      const draft = await this.listingDraft(items, platform, targetPrice, lotName);
      return { ...draft, platform, price: targetPrice };
    } catch {
      return composeLotListing(items, platform, lotName, targetPrice);
    }
  }
}
