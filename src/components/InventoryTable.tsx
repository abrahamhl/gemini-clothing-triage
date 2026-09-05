"use client";

import { Sparkles } from "lucide-react";
import type { Item } from "@/lib/types";
import { Badge, Spinner } from "@/components/ui";
import {
  CATEGORY_LABEL,
  DEMAND_LABEL,
  STATUS,
  STRATEGY,
  euro,
  opportunityTone,
} from "@/lib/ui";
import { cn } from "@/lib/cn";

export function InventoryTable({
  items,
  selectedId,
  onSelect,
}: {
  items: Item[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="card overflow-hidden p-0">
      <div className="scroll-area overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted">
              <th className="px-4 py-3 font-medium">Foto</th>
              <th className="px-4 py-3 font-medium">Artículo</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Valor IA</th>
              <th className="px-4 py-3 font-medium">Demanda</th>
              <th className="px-4 py-3 font-medium">Estrategia</th>
              <th className="px-4 py-3 text-right font-medium">Oportunidad</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const primary = item.images.find((i) => i.isPrimary) ?? item.images[0];
              const discarded = item.status === "discarded";
              const premium = (item.opportunityIndex ?? 0) >= 70;
              return (
                <tr
                  key={item.id}
                  onClick={() => onSelect(item.id)}
                  className={cn(
                    "cursor-pointer border-b border-border/60 transition last:border-0 hover:bg-surface-2/60",
                    selectedId === item.id && "bg-primary-soft/40",
                    discarded && "opacity-45",
                    premium && "bg-accent-soft/30",
                  )}
                >
                  <td className="px-4 py-2.5">
                    {primary ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`/api/images/${primary.id}`}
                        alt={item.name}
                        className="size-11 rounded-lg border border-border object-cover"
                      />
                    ) : (
                      <div className="size-11 rounded-lg bg-surface-2" />
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5 font-medium">
                      {premium && <Sparkles className="size-3.5 text-primary" />}
                      <span className="line-clamp-1">{item.name}</span>
                    </div>
                    <p className="text-xs text-muted">{item.brand ?? "—"}</p>
                  </td>
                  <td className="px-4 py-2.5 text-muted">
                    {item.category ? CATEGORY_LABEL[item.category] : "—"}
                  </td>
                  <td className="px-4 py-2.5">
                    {item.status === "analyzing" ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-primary">
                        <Spinner /> Analizando
                      </span>
                    ) : (
                      <Badge tone={STATUS[item.status].tone}>
                        {STATUS[item.status].label}
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-2.5 font-medium">
                    {euro(item.prices?.recommended)}
                  </td>
                  <td className="px-4 py-2.5 text-muted">
                    {item.demand ? DEMAND_LABEL[item.demand] : "—"}
                  </td>
                  <td className="px-4 py-2.5">
                    {item.strategy ? (
                      <Badge tone={STRATEGY[item.strategy].tone}>
                        {STRATEGY[item.strategy].label}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <span
                      className={cn(
                        "font-semibold",
                        opportunityTone(item.opportunityIndex ?? 0),
                      )}
                    >
                      {item.opportunityIndex ?? "—"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
