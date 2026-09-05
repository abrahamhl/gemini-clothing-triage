"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Target } from "lucide-react";
import { useItems } from "@/components/useItems";
import { Card, StatCard } from "@/components/ui";
import { CATEGORY_LABEL, euro } from "@/lib/ui";
import type { Item, ItemCategory } from "@/lib/types";

function sum(items: Item[], pick: (i: Item) => number | null | undefined): number {
  return items.reduce((acc, i) => acc + (pick(i) ?? 0), 0);
}

function missions(items: Item[]): { text: string; value?: string }[] {
  const ready = items.filter((i) => i.status === "ready");
  const groupable = items.filter((i) => i.strategy === "agrupar");
  const premium = items.filter((i) => (i.opportunityIndex ?? 0) >= 70 && i.status === "ready");
  const out: { text: string; value?: string }[] = [];
  if (ready.length)
    out.push({
      text: `Tienes ${ready.length} artículos valorados sin publicar.`,
      value: euro(sum(ready, (i) => i.prices?.quick)),
    });
  if (groupable.length >= 2)
    out.push({ text: `${groupable.length} artículos rinden más agrupados en lote.` });
  if (premium.length)
    out.push({
      text: `${premium.length} piezas premium con alta oportunidad: priorízalas.`,
    });
  if (!out.length)
    out.push({ text: "Sube tus primeras fotos para recibir misiones de venta." });
  return out;
}

export default function DashboardPage() {
  const { items } = useItems();
  const ready = items.filter((i) => i.status === "ready");
  const byCategory = new Map<ItemCategory, { count: number; value: number }>();
  for (const i of items) {
    if (!i.category) continue;
    const cur = byCategory.get(i.category) ?? { count: 0, value: 0 };
    cur.count += 1;
    cur.value += i.prices?.recommended ?? 0;
    byCategory.set(i.category, cur);
  }
  const cats = [...byCategory.entries()].sort((a, b) => b[1].value - a[1].value);
  const maxValue = Math.max(1, ...cats.map(([, c]) => c.value));

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-sm text-muted">Convierte fotos en decisiones rentables.</p>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Valor total estimado"
          value={euro(sum(items, (i) => i.prices?.recommended))}
          hint={`${items.length} artículos`}
          accent
        />
        <StatCard
          label="Valor venta rápida"
          value={euro(sum(items, (i) => i.prices?.quick))}
          hint="liquidez inmediata"
        />
        <StatCard
          label="Listos para vender"
          value={String(ready.length)}
          hint="sin publicar"
        />
        <StatCard
          label="Publicados"
          value={String(items.filter((i) => i.status === "listed").length)}
          hint={`${items.filter((i) => i.status === "discarded").length} descartados`}
        />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <p className="text-sm font-medium">Distribución por categoría</p>
          {cats.length === 0 ? (
            <p className="mt-6 text-sm text-muted">
              Aún sin datos. Analiza artículos para ver tu mix de stock.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {cats.map(([cat, c]) => (
                <div key={cat}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-medium">{CATEGORY_LABEL[cat]}</span>
                    <span className="text-muted">
                      {c.count} · {euro(c.value)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="brand-gradient h-full rounded-full"
                      style={{ width: `${(c.value / maxValue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <span className="brand-gradient flex size-7 items-center justify-center rounded-lg text-white">
              <Target className="size-4" />
            </span>
            <p className="text-sm font-medium">Misiones recomendadas</p>
          </div>
          <ul className="mt-4 space-y-3">
            {missions(items).map((m, idx) => (
              <li key={idx} className="flex gap-2 text-sm">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>
                  {m.text}
                  {m.value && (
                    <span className="ml-1 font-semibold text-primary">
                      {m.value}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/inventario"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5"
          >
            Ir al inventario <ArrowRight className="size-4" />
          </Link>
        </Card>
      </div>
    </div>
  );
}
