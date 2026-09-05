"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useItems } from "@/components/useItems";
import { CaptureModal } from "@/components/CaptureModal";
import { InventoryTable } from "@/components/InventoryTable";
import { ItemPanel } from "@/components/ItemPanel";
import { Button } from "@/components/ui";
import type { ItemStatus } from "@/lib/types";

const FILTERS: { key: ItemStatus | "all"; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "ready", label: "Listos" },
  { key: "listed", label: "Publicados" },
  { key: "pending", label: "Pendientes" },
  { key: "discarded", label: "Descartados" },
];

export default function InventarioPage() {
  const { items, loading, refresh } = useItems();
  const [capture, setCapture] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ItemStatus | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (filter !== "all" && i.status !== filter) return false;
      if (!q) return true;
      return `${i.name} ${i.brand ?? ""} ${i.category ?? ""}`
        .toLowerCase()
        .includes(q);
    });
  }, [items, query, filter]);

  const selected = items.find((i) => i.id === selectedId) ?? null;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Inventario</h1>
          <p className="text-sm text-muted">
            {items.length} artículos · la IA propone, tú validas.
          </p>
        </div>
        <Button onClick={() => setCapture(true)}>
          <Plus className="size-4" /> Analizar artículos
        </Button>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 md:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar marca, categoría…"
            className="w-full rounded-xl border border-border bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-primary/50"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                filter === f.key
                  ? "bg-primary-soft text-primary"
                  : "text-muted hover:bg-surface-2 hover:text-text"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="card py-16 text-center text-sm text-muted">
            Cargando inventario…
          </div>
        ) : filtered.length === 0 ? (
          <div className="card flex flex-col items-center gap-3 py-16 text-center">
            <p className="font-medium">Aún no hay artículos aquí</p>
            <p className="max-w-sm text-sm text-muted">
              Sube tus fotos y la IA las convierte en artículos valorados,
              listos para vender.
            </p>
            <Button onClick={() => setCapture(true)}>
              <Plus className="size-4" /> Analizar artículos
            </Button>
          </div>
        ) : (
          <InventoryTable
            items={filtered}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        )}
      </div>

      {capture && (
        <CaptureModal
          source="desktop"
          onClose={() => setCapture(false)}
          onChange={refresh}
        />
      )}
      {selected && (
        <ItemPanel
          item={selected}
          onClose={() => setSelectedId(null)}
          onChange={refresh}
        />
      )}
    </div>
  );
}
