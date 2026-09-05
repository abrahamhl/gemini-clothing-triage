import { LocalStore } from "./local-store";
import type { ItemRepository } from "./repository";

let cached: ItemRepository | null = null;

export function getRepository(): ItemRepository {
  if (cached) return cached;
  // Único adaptador activo hoy. El adaptador Supabase se enchufa aquí
  // sin tocar el resto de la app cuando lleguen las credenciales.
  cached = new LocalStore();
  return cached;
}

export type {
  AddImageInput,
  CreateItemInput,
  ItemRepository,
  NewImage,
  StoredImage,
} from "./repository";
