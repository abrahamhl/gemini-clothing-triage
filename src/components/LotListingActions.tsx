"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, Share2 } from "lucide-react";
import { api } from "@/lib/client";
import type { Listing, Platform } from "@/lib/types";
import { Button, Spinner } from "@/components/ui";
import { euro } from "@/lib/ui";
import { cn } from "@/lib/cn";

const PLATFORM_URL: Record<Platform, string> = {
  marktplaats: "https://www.marktplaats.nl/plaats",
  vinted: "https://www.vinted.nl/items/new",
};

export function LotListingActions({
  itemIds,
  name,
  targetPrice,
}: {
  itemIds: string[];
  name: string;
  targetPrice: number;
}) {
  const [platform, setPlatform] = useState<Platform>("marktplaats");
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  async function generate(nextPlatform: Platform) {
    setPlatform(nextPlatform);
    setLoading(true);
    setListing(null);
    setCopied(false);
    setError(false);
    try {
      setListing(await api.lotListing(itemIds, nextPlatform, name, targetPrice));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function text(): string {
    if (!listing) return "";
    return `${listing.title}\n\n${listing.body}\n\nPrijs: ${euro(listing.price)}\n\n${listing.keywords.map((keyword) => `#${keyword}`).join(" ")}`;
  }

  async function copy() {
    if (!listing) return;
    await navigator.clipboard.writeText(text());
    setCopied(true);
  }

  async function share() {
    if (!listing) return;
    if (navigator.share) {
      await navigator.share({ title: listing.title, text: text() });
    } else {
      await copy();
    }
  }

  function open() {
    window.open(PLATFORM_URL[platform], "_blank", "noopener,noreferrer");
    void copy();
  }

  return (
    <div className="mt-4 border-t border-border pt-3">
      <p className="text-xs font-medium">Crear anuncio del pack</p>
      <div className="mt-2 flex gap-2">
        {(["marktplaats", "vinted"] as Platform[]).map((nextPlatform) => (
          <button
            key={nextPlatform}
            disabled={loading}
            onClick={() => generate(nextPlatform)}
            className={cn(
              "rounded-lg bg-surface-2 px-3 py-1.5 text-xs font-medium capitalize text-muted transition hover:text-text disabled:opacity-50",
              listing && platform === nextPlatform && "bg-primary-soft text-primary",
            )}
          >
            {nextPlatform}
          </button>
        ))}
        {loading && <Spinner className="my-auto text-primary" />}
      </div>

      {error && <p className="mt-2 text-xs text-danger">No se pudo generar el anuncio.</p>}

      {listing && (
        <div className="mt-3 rounded-xl bg-surface-2/70 p-3">
          <p className="text-sm font-semibold">{listing.title}</p>
          <p className="mt-2 line-clamp-5 whitespace-pre-wrap text-xs leading-relaxed text-text/90">{listing.body}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-semibold">{euro(listing.price)}</span>
            <div className="flex gap-1.5">
              <Button variant="outline" className="px-2.5 py-1.5" onClick={share} title="Compartir">
                <Share2 className="size-4" />
              </Button>
              <Button variant="soft" className="px-2.5 py-1.5" onClick={copy}>
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              </Button>
              <Button className="px-2.5 py-1.5" onClick={open} title={`Abrir ${platform}`}>
                <ExternalLink className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
