import type { Item } from "@/lib/types";
import { CATEGORY_LABEL } from "@/lib/ui";

export interface LotSuggestion {
  id: string;
  name: string;
  theme: string;
  itemIds: string[];
  count: number;
  valueIndividual: number;
  valueBundled: number;
  extraVsLiquidation: number;
  probSale: number;
}

const BUNDLE_DISCOUNT = 0.85;
const APPAREL = new Set(["ropa", "calzado", "accesorio"]);

function sum(items: Item[], pick: (i: Item) => number): number {
  return items.reduce((acc, i) => acc + pick(i), 0);
}

function avg(items: Item[], pick: (i: Item) => number): number {
  return items.length ? sum(items, pick) / items.length : 0;
}

function build(name: string, theme: string, members: Item[]): LotSuggestion {
  const valueIndividual = Math.round(sum(members, (i) => i.prices!.recommended));
  const valueBundled = Math.round(valueIndividual * BUNDLE_DISCOUNT);
  const extraVsLiquidation =
    valueBundled - Math.round(sum(members, (i) => i.prices!.liquidation));
  const probSale = Math.round(
    Math.min(95, Math.max(40, avg(members, (i) => i.opportunityIndex ?? 50) + 8)),
  );
  return {
    id: theme,
    name,
    theme,
    itemIds: members.map((i) => i.id),
    count: members.length,
    valueIndividual,
    valueBundled,
    extraVsLiquidation,
    probSale,
  };
}

export function detectLots(items: Item[]): LotSuggestion[] {
  const eligible = items.filter((i) => i.prices && i.status !== "discarded");
  const groups = new Map<string, { name: string; members: Item[] }>();

  const add = (key: string, name: string, item: Item) => {
    const g = groups.get(key) ?? { name, members: [] };
    g.members.push(item);
    groups.set(key, g);
  };

  for (const item of eligible) {
    if (item.category) add(`cat:${item.category}`, CATEGORY_LABEL[item.category], item);
    if (item.style) add(`style:${item.style.toLowerCase()}`, item.style, item);
    if (item.size && item.category && APPAREL.has(item.category)) {
      add(`size:${item.size.toLowerCase()}`, `Talla ${item.size}`, item);
    }
    if (item.color && /naranja|orange/i.test(item.color)) {
      add("season:koningsdag", "Pack Koningsdag (naranja)", item);
    }
  }

  const seen = new Set<string>();
  const out: LotSuggestion[] = [];
  for (const [theme, g] of groups) {
    if (g.members.length < 2) continue;
    const signature = [...g.members.map((m) => m.id)].sort().join("|");
    if (seen.has(signature)) continue;
    seen.add(signature);
    out.push(build(g.name, theme, g.members));
  }

  return out.sort((a, b) => b.extraVsLiquidation - a.extraVsLiquidation).slice(0, 8);
}
