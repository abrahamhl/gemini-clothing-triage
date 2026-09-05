"use client";

import { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { useItems } from "@/components/useItems";
import { CaptureModal } from "@/components/CaptureModal";
import { CompetitorOnboarding } from "@/components/CompetitorOnboarding";
import { Badge } from "@/components/ui";
import { STATUS, euro } from "@/lib/ui";

export default function CapturarPage() {
  const { items, refresh } = useItems(3000);
  const [open, setOpen] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const recent = items.slice(0, 12);

  const handleCaptureClick = () => {
    if (!localStorage.getItem("storeName")) {
      setNeedsOnboarding(true);
    } else {
      setOpen(true);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight">Market Intelligence</h1>
      <p className="text-sm text-muted">
        Fotografía una prenda y nuestra IA te dirá a qué precio la está vendiendo tu competencia real.
      </p>

      <button
        onClick={handleCaptureClick}
        className="brand-gradient mt-5 flex w-full flex-col items-center gap-3 rounded-2xl px-6 py-12 text-white shadow-sm transition hover:opacity-95"
      >
        <span className="flex size-16 items-center justify-center rounded-2xl bg-white/20">
          <Camera className="size-8" />
        </span>
        <span className="text-lg font-semibold">Capturar e Investigar</span>
        <span className="text-sm text-white/80">
          Escaneo omnicanal de precios en tu área local
        </span>
      </button>

      {recent.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 text-sm font-medium">Investigado recientemente</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {recent.map((item) => {
              const primary = item.images.find((i) => i.isPrimary) ?? item.images[0];
              return (
                <div key={item.id} className="card overflow-hidden p-0">
                  {primary && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/api/images/${primary.id}`}
                      alt={item.name}
                      className="aspect-square w-full object-cover"
                    />
                  )}
                  <div className="p-2.5">
                    <p className="line-clamp-1 text-xs font-medium">{item.name}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <Badge tone={STATUS[item.status].tone}>
                        {STATUS[item.status].label}
                      </Badge>
                      <span className="text-xs font-semibold">
                        {euro(item.prices?.recommended)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {needsOnboarding && (
        <CompetitorOnboarding 
          onComplete={() => {
            setNeedsOnboarding(false);
            setOpen(true);
          }} 
        />
      )}

      {open && (
        <CaptureModal
          source="mobile"
          onClose={() => setOpen(false)}
          onChange={refresh}
        />
      )}
    </div>
  );
}
