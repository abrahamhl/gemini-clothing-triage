import { NextResponse, type NextRequest } from "next/server";
import { getAIProvider, getLocalAIProvider } from "@/lib/ai";
import { getRepository } from "@/lib/db";
import type { MarketResearch } from "@/lib/types";

const CACHE_MS = 12 * 60 * 60 * 1000;

function rounded(value: number): number {
  return Math.max(0, Math.round(value));
}

async function saveResearch(id: string, research: MarketResearch) {
  const quick = rounded(research.quickPrice);
  const recommended = Math.max(quick, rounded(research.recommendedPrice));
  const premium = Math.max(recommended, rounded(research.premiumPrice));
  return getRepository().update(id, {
    marketResearch: {
      ...research,
      quickPrice: quick,
      recommendedPrice: recommended,
      premiumPrice: premium,
    },
    market: research.summary,
    demand: research.demand,
    prices: {
      liquidation: Math.min(quick, rounded(quick * 0.75)),
      quick,
      recommended,
      premium,
    },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const repo = getRepository();
  const item = await repo.get(id);
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!item.prices) {
    return NextResponse.json({ error: "not_analyzed" }, { status: 409 });
  }

  const force = request.nextUrl.searchParams.get("refresh") === "1";
  const age = item.marketResearch
    ? Date.now() - new Date(item.marketResearch.researchedAt).getTime()
    : Number.POSITIVE_INFINITY;
  if (!force && item.marketResearch && age < CACHE_MS) {
    return NextResponse.json({ item, cached: true });
  }

  try {
    const research = await getAIProvider().researchMarket(item);
    const updated = await saveResearch(id, research);
    return NextResponse.json({ item: updated, cached: false });
  } catch (error) {
    console.error("[research] búsqueda web no disponible:", error instanceof Error ? error.message : error);
    const fallback = await getLocalAIProvider().researchMarket(item);
    const updated = await saveResearch(id, fallback);
    return NextResponse.json({ item: updated, cached: false, fallback: true });
  }
}
