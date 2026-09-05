import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ImageInput } from "@/lib/ai";
import type { Item } from "@/lib/types";
import type {
  AddImageInput,
  CreateItemInput,
  ItemRepository,
  StoredImage,
} from "./repository";

const DATA_DIR_ENV = "TRIAJE_DATA_DIR";
const configuredDataDir = process.env[DATA_DIR_ENV];
const DATA_DIR = configuredDataDir
  ? path.resolve(configuredDataDir)
  : path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const IMG_FILE = path.join(DATA_DIR, "images.json");

type Db = { items: Item[] };
type ImageBank = Record<string, StoredImage>;

let queue: Promise<unknown> = Promise.resolve();

function serialize<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw error;
  }
}

async function writeJson(file: string, data: unknown): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  const temp = `${file}.${randomUUID()}.tmp`;
  await writeFile(temp, JSON.stringify(data, null, 2), "utf8");
  await rename(temp, file);
}

export class LocalStore implements ItemRepository {
  async list(): Promise<Item[]> {
    const db = await readJson<Db>(DB_FILE, { items: [] });
    return [...db.items].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }

  async get(id: string): Promise<Item | null> {
    const db = await readJson<Db>(DB_FILE, { items: [] });
    return db.items.find((i) => i.id === id) ?? null;
  }

  create(input: CreateItemInput): Promise<Item> {
    return serialize(async () => {
      const db = await readJson<Db>(DB_FILE, { items: [] });
      const bank = await readJson<ImageBank>(IMG_FILE, {});

      const now = new Date().toISOString();
      const images = input.images.map((img, ordinal) => {
        const id = randomUUID();
        bank[id] = { mimeType: img.mimeType, base64: img.base64 };
        return {
          id,
          ordinal,
          isPrimary: ordinal === 0,
          uploadedFrom: input.source,
          kind: "original" as const,
        };
      });

      const item: Item = {
        id: randomUUID(),
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

      db.items.push(item);
      await writeJson(IMG_FILE, bank);
      await writeJson(DB_FILE, db);
      return item;
    });
  }

  update(id: string, patch: Partial<Item>): Promise<Item> {
    return serialize(async () => {
      const db = await readJson<Db>(DB_FILE, { items: [] });
      const idx = db.items.findIndex((i) => i.id === id);
      if (idx === -1) throw new Error("not_found");
      const updated: Item = {
        ...db.items[idx],
        ...patch,
        id,
        updatedAt: new Date().toISOString(),
      };
      db.items[idx] = updated;
      await writeJson(DB_FILE, db);
      return updated;
    });
  }

  addImage(itemId: string, image: AddImageInput): Promise<Item> {
    return serialize(async () => {
      const db = await readJson<Db>(DB_FILE, { items: [] });
      const bank = await readJson<ImageBank>(IMG_FILE, {});
      const idx = db.items.findIndex((item) => item.id === itemId);
      if (idx === -1) throw new Error("not_found");

      const id = randomUUID();
      bank[id] = { mimeType: image.mimeType, base64: image.base64 };
      const current = db.items[idx];
      const existing = image.makePrimary
        ? current.images.map((entry) => ({ ...entry, isPrimary: false }))
        : current.images;
      const updated: Item = {
        ...current,
        images: [
          ...existing,
          {
            id,
            ordinal: existing.length,
            isPrimary: image.makePrimary ?? false,
            uploadedFrom: image.source,
            kind: image.kind,
            generatedBy: image.generatedBy,
          },
        ],
        updatedAt: new Date().toISOString(),
      };
      db.items[idx] = updated;
      await writeJson(IMG_FILE, bank);
      await writeJson(DB_FILE, db);
      return updated;
    });
  }

  async getImage(imageId: string): Promise<StoredImage | null> {
    const bank = await readJson<ImageBank>(IMG_FILE, {});
    return bank[imageId] ?? null;
  }

  async getItemImages(itemId: string): Promise<ImageInput[]> {
    const item = await this.get(itemId);
    if (!item) return [];
    const bank = await readJson<ImageBank>(IMG_FILE, {});
    return item.images
      .filter((image) => !image.kind || image.kind === "original")
      .map((img) => bank[img.id])
      .filter(Boolean)
      .map((img) => ({ mimeType: img.mimeType, base64: img.base64 }));
  }
}
