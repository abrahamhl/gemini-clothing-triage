import type { Item, Listing, Platform } from "@/lib/types";

async function json<T>(req: Promise<Response>): Promise<T> {
  const res = await req;
  if (!res.ok) {
    const payload = await res.json().catch(() => null) as { error?: string } | null;
    throw new Error(payload?.error ?? `http_${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  listItems: () =>
    json<{ items: Item[] }>(fetch("/api/items", { cache: "no-store" })).then(
      (d) => d.items,
    ),

  uploadImages: (files: File[], source: "mobile" | "desktop", mode = "bulk") => {
    const form = new FormData();
    files.forEach((f) => form.append("images", f));
    form.append("source", source);
    form.append("mode", mode);
    return json<{ items: Item[] }>(
      fetch("/api/items", { method: "POST", body: form }),
    ).then((d) => d.items);
  },

  analyze: (id: string) =>
    json<{ item: Item }>(
      fetch(`/api/items/${id}/analyze`, { method: "POST" }),
    ).then((d) => d.item),

  enhance: (id: string) =>
    json<{ item: Item }>(
      fetch(`/api/items/${id}/enhance`, { method: "POST" }),
    ).then((d) => d.item),

  research: (id: string, refresh = false) =>
    json<{ item: Item }>(
      fetch(`/api/items/${id}/research${refresh ? "?refresh=1" : ""}`, {
        method: "POST",
      }),
    ).then((d) => d.item),

  patch: (id: string, patch: Partial<Item>) =>
    json<{ item: Item }>(
      fetch(`/api/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      }),
    ).then((d) => d.item),

  listing: (id: string, platform: Platform) =>
    json<{ listing: Listing }>(
      fetch(`/api/items/${id}/listing?platform=${platform}`, {
        cache: "no-store",
      }),
    ).then((d) => d.listing),

  lotListing: (
    itemIds: string[],
    platform: Platform,
    lotName: string,
    targetPrice: number,
  ) =>
    json<{ listing: Listing }>(
      fetch("/api/lots/listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemIds, platform, lotName, targetPrice }),
      }),
    ).then((d) => d.listing),
};
