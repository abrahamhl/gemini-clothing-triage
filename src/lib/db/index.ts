import { LocalStore } from "./local-store";
import { SupabaseStore } from "./supabase-store";
import type { ItemRepository } from "./repository";

let cached: ItemRepository | null = null;

export function getRepository(): ItemRepository {
  if (cached) return cached;
  
  const hasSupabase = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) && 
                      (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY);

  if (hasSupabase) {
    cached = new SupabaseStore();
  } else {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Production execution blocked: Supabase configuration is missing. No silent LocalStore fallback permitted.");
    }
    cached = new LocalStore();
  }
  return cached;
}

export type {
  AddImageInput,
  CreateItemInput,
  ItemRepository,
  NewImage,
  StoredImage,
} from "./repository";
