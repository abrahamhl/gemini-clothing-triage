"use client";

import { useMemo } from "react";
import { Layers, TrendingUp } from "lucide-react";
import { useItems } from "@/components/useItems";
import { Card } from "@/components/ui";
import { LotListingActions } from "@/components/LotListingActions";
import { detectLots } from "@/lib/lots";
import { euro } from "@/lib/ui";

export default function LotesPage() {
  const { items, loading } = useItems();
  const lots = useMemo(() => detectLots(items), [items]);
  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Lotes Inteligentes</h1>
        <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-medium text-primary">
          {lots.length} detectados
        </span>
      </div>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        La IA agrupa tu stock en packs que rinden más vendidos juntos.
      </p>

      {loading ? (
        <div className="card mt-5 py-16 text-center text-sm text-muted">Analizando stock…</div>
      ) : lots.length === 0 ? (
        <div className="card mt-5 flex flex-col items-center gap-2 py-16 text-center">
          <Layers className="size-7 text-muted" />
          <p className="font-medium">Aún no hay lotes rentables</p>
          <p className="max-w-sm text-sm text-muted">
            Analiza más artículos: cuando haya 2+ piezas afines (categoría, estilo,
            talla o temporada), aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {lots.map((lot) => {
            const members = lot.itemIds
              .map((id) => byId.get(id))
              .filter((i): i is NonNullable<typeof i> => Boolean(i));
            return (
              <Card key={lot.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{lot.name}</p>
                    <p className="text-xs text-muted">{lot.count} artículos</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-accent-soft px-2 py-1 text-xs font-medium text-[#0b8c79]">
                    <TrendingUp className="size-3.5" /> {lot.probSale}% venta
                  </span>
                </div>

                <div className="mt-3 flex gap-1.5">
                  {members.slice(0, 5).map((item) => {
                    const primary = item.images.find((i) => i.isPrimary) ?? item.images[0];
                    return primary ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={item.id}
                        src={`/api/images/${primary.id}`}
                        alt={item.name}
                        className="size-12 rounded-lg border border-border object-cover"
                      />
                    ) : (
                      <div key={item.id} className="size-12 rounded-lg bg-surface-2" />
                    );
                  })}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-xl border border-border p-3">
                    <p className="text-xs text-muted">Suelto</p>
                    <p className="font-semibold">{euro(lot.valueIndividual)}</p>
                  </div>
                  <div className="rounded-xl border border-primary/40 bg-primary-soft/40 p-3">
                    <p className="text-xs text-muted">En lote</p>
                    <p className="font-semibold">{euro(lot.valueBundled)}</p>
                  </div>
                </div>

                <p className="mt-3 text-xs text-muted">
                  <span className="font-semibold text-[#0b8c79]">
                    +{euro(lot.extraVsLiquidation)}
                  </span>{" "}
                  frente a malvenderlos sueltos a precio de liquidación.
                </p>
                <LotListingActions
                  itemIds={lot.itemIds}
                  name={lot.name}
                  targetPrice={lot.valueBundled}
                />
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
