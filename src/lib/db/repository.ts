import type { ImageInput } from "@/lib/ai";
import type { ImageKind, Item, UploadSource } from "@/lib/types";

export interface NewImage {
  mimeType: string;
  base64: string;
}

export interface CreateItemInput {
  source: UploadSource;
  images: NewImage[];
}

export interface StoredImage {
  mimeType: string;
  base64: string;
}

export interface AddImageInput extends StoredImage {
  source: UploadSource;
  kind: ImageKind;
  makePrimary?: boolean;
  generatedBy?: string;
}

export interface ItemRepository {
  list(): Promise<Item[]>;
  get(id: string): Promise<Item | null>;
  create(input: CreateItemInput): Promise<Item>;
  update(id: string, patch: Partial<Item>): Promise<Item>;
  addImage(itemId: string, image: AddImageInput): Promise<Item>;
  getImage(imageId: string): Promise<StoredImage | null>;
  getItemImages(itemId: string): Promise<ImageInput[]>;
}
