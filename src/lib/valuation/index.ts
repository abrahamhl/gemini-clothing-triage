import type { ItemAnalysis } from "@/lib/ai";
import type { Prices, Strategy } from "@/lib/types";
import {
  BRAND_BASE,
  CATEGORY_BASE,
  CONDITION_FACTOR,
  DEMAND_FACTOR,
  DEMAND_VELOCITY_DAYS,
  seasonalBoost,
} from "./baselines";

export interface Valuation {
  prices: Prices;
  opportunityIndex: number;
  estSaleDays: number;
  strategy: Strategy;
}

function round(n: number): number {
  return Math.max(1, Math.round(n));
}

function rarityFactor(rarity: number): number {
  return 0.8 + (rarity / 100) * 0.6;
}

export function valuate(a: ItemAnalysis, now = new Date()): Valuation {
  const base =
    BRAND_BASE[(a.brand ?? "").toLowerCase()] ?? CATEGORY_BASE[a.category];
  const season = seasonalBoost(a.color, now.getMonth());

  const recommended =
    base *
    CONDITION_FACTOR[a.condition] *
    rarityFactor(a.rarity) *
    DEMAND_FACTOR[a.demand] *
    season;

  const prices: Prices = {
    liquidation: round(recommended * 0.6),
    quick: round(recommended * 0.8),
    recommended: round(recommended),
    premium: round(recommended * 1.25),
  };

  const estSaleDays = Math.round(
    DEMAND_VELOCITY_DAYS[a.demand] * (1 + a.rarity / 400),
  );

  const valueScore = Math.min(1, recommended / 200);
  const demandScore = DEMAND_FACTOR[a.demand] / 1.4;
  const velocityScore = 1 - estSaleDays / 60;
  const opportunityIndex = Math.round(
    100 *
      (0.4 * demandScore +
        0.35 * valueScore +
        0.25 * Math.max(0, velocityScore)) *
      season,
  );

  return {
    prices,
    opportunityIndex: Math.min(100, opportunityIndex),
    estSaleDays,
    strategy: deriveStrategy({
      opportunityIndex,
      recommended,
      rarity: a.rarity,
      demand: a.demand,
    }),
  };
}

function deriveStrategy(input: {
  opportunityIndex: number;
  recommended: number;
  rarity: number;
  demand: ItemAnalysis["demand"];
}): Strategy {
  const { opportunityIndex, recommended, rarity, demand } = input;
  if (rarity >= 80 && (demand === "muy_alta" || demand === "alta")) {
    return "subir_precio";
  }
  if (recommended < 25 && opportunityIndex < 45) return "liquidar";
  if (recommended < 40) return "agrupar";
  if (opportunityIndex >= 65) return "publicar";
  if (rarity >= 70) return "conservar";
  return "publicar";
}
