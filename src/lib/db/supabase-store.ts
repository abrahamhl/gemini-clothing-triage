import type { AddImageInput, CreateItemInput, ItemRepository, StoredImage } from "./repository";
import type { ImageInput } from "@/lib/ai";
import type { Item } from "@/lib/types";
import crypto from "crypto";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export class SupabaseStore implements ItemRepository {
  private headers = {
    "apikey": SUPABASE_ANON_KEY || "",
    "Authorization": `Bearer ${SUPABASE_ANON_KEY || ""}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  };

  private async fetchDb(path: string, options: RequestInit = {}) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new Error("database_not_configured");
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      ...options,
      headers: { ...this.headers, ...options.headers }
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Supabase API error: ${res.status} ${err}`);
    }
    return res;
  }

  private async fetchStorage(path: string, options: RequestInit = {}) {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new Error("database_not_configured");
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/items/${path}`, {
      ...options,
      headers: {
        "Authorization": `Bearer ${SUPABASE_ANON_KEY || ""}`,
        ...options.headers
      }
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Supabase Storage API error: ${res.status} ${err}`);
    }
    return res;
  }

  async list(): Promise<Item[]> {
    const res = await this.fetchDb("items?select=*&order=createdAt.desc");
    return res.json();
  }

  async get(id: string): Promise<Item | null> {
    const res = await this.fetchDb(`items?id=eq.${id}&select=*`);
    const data = await res.json();
    return data.length ? data[0] : null;
  }

  async create(input: CreateItemInput): Promise<Item> {
    const images = [];
    const now = new Date().toISOString();
    let ordinal = 0;

    for (const img of input.images) {
      const id = crypto.randomUUID();
      const ext = img.mimeType.split('/')[1] || 'jpeg';
      const path = `${id}.${ext}`;
      
      const buffer = Buffer.from(img.base64, 'base64');
      await this.fetchStorage(path, {
        method: "POST",
        headers: { "Content-Type": img.mimeType },
        body: buffer
      });

      images.push({
        id,
        ordinal,
        isPrimary: ordinal === 0,
        uploadedFrom: input.source,
        kind: "original" as const,
        storagePath: path
      });
      ordinal++;
    }

    const item: Item = {
      id: crypto.randomUUID(),
      status: "pending",
      name: "Artículo sin analizar",
      brand: null,
      model: null,
      category: null,
      size: null,
      material: null,
      color: null,
      style: null,
      condition: null,
      rarity: null,
      market: null,
      demand: null,
      prices: null,
      aiConfidence: null,
      aiDescription: null,
      opportunityIndex: null,
      strategy: null,
      images,
      createdAt: now,
      updatedAt: now,
    };

    const res = await this.fetchDb("items", {
      method: "POST",
      body: JSON.stringify(item)
    });
    const data = await res.json();
    return data[0];
  }

  async update(id: string, patch: Partial<Item>): Promise<Item> {
    const patchWithDate = { ...patch, updatedAt: new Date().toISOString() };
    const res = await this.fetchDb(`items?id=eq.${id}`, {
      method: "PATCH",
      body: JSON.stringify(patchWithDate)
    });
    const data = await res.json();
    return data[0];
  }

  async addImage(itemId: string, image: AddImageInput): Promise<Item> {
    const item = await this.get(itemId);
    if (!item) throw new Error("not_found");

    const id = crypto.randomUUID();
    const ext = image.mimeType.split('/')[1] || 'jpeg';
    const path = `${id}.${ext}`;
    
    const buffer = Buffer.from(image.base64, 'base64');
    await this.fetchStorage(path, {
      method: "POST",
      headers: { "Content-Type": image.mimeType },
      body: buffer
    });

    const existing = image.makePrimary
      ? item.images.map((entry) => ({ ...entry, isPrimary: false }))
      : item.images;

    const updatedImages = [
      ...existing,
      {
        id,
        ordinal: existing.length,
        isPrimary: image.makePrimary ?? false,
        uploadedFrom: image.source,
        kind: image.kind,
        generatedBy: image.generatedBy,
        storagePath: path
      },
    ];

    return this.update(itemId, { images: updatedImages });
  }

  async getImage(imageId: string): Promise<StoredImage | null> {
    const resItems = await this.fetchDb("items?select=id,images");
    const items = await resItems.json();
    let foundImg: any = null;
    let itemId = "";
    for (const item of items) {
      foundImg = item.images.find((img: any) => img.id === imageId);
      if (foundImg) {
        itemId = item.id;
        break;
      }
    }
    if (!foundImg || !foundImg.storagePath) return null;

    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/items/${foundImg.storagePath}`, {
      headers: { "Authorization": `Bearer ${SUPABASE_ANON_KEY || ""}` }
    });
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = res.headers.get("content-type") || "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;

    return {
      id: foundImg.id,
      itemId,
      dataUrl,
      isPrimary: foundImg.isPrimary,
      ordinal: foundImg.ordinal,
      uploadedFrom: foundImg.uploadedFrom,
      kind: foundImg.kind || "original"
    };
  }

  async getItemImages(itemId: string): Promise<ImageInput[]> {
    const item = await this.get(itemId);
    if (!item) return [];
    
    const originalImages = item.images.filter((img: any) => !img.kind || img.kind === "original");
    const result: ImageInput[] = [];

    for (const img of originalImages) {
      if (!(img as any).storagePath) continue;
      const res = await fetch(`${SUPABASE_URL}/storage/v1/object/items/${(img as any).storagePath}`, {
        headers: { "Authorization": `Bearer ${SUPABASE_ANON_KEY || ""}` }
      });
      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = res.headers.get("content-type") || "image/jpeg";
        result.push({ mimeType, base64: buffer.toString("base64") });
      }
    }

    return result;
  }
}
