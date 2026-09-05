import { NextResponse, type NextRequest } from "next/server";
import { getAIProvider, getLocalAIProvider, type ItemAnalysis } from "@/lib/ai";
import { getRepository } from "@/lib/db";
import { valuate } from "@/lib/valuation";

async function saveAnalysis(id: string, analysis: ItemAnalysis, provider: string) {
  const v = valuate(analysis);
  return getRepository().update(id, {
    status: "ready",
    name: analysis.name,
    brand: analysis.brand,
    model: analysis.model,
    category: analysis.category,
    size: analysis.size,
    material: analysis.material,
    color: analysis.color,
    style: analysis.style,
    condition: analysis.condition,
    rarity: analysis.rarity,
    market: analysis.market,
    demand: analysis.demand,
    aiConfidence: analysis.confidence,
    analysisProvider: provider,
    aiDescription: analysis.description,
    prices: v.prices,
    opportunityIndex: v.opportunityIndex,
    strategy: v.strategy,
  });
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const repo = getRepository();
  const item = await repo.get(id);
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const images = await repo.getItemImages(id);
  if (images.length === 0) {
    return NextResponse.json({ error: "no_images" }, { status: 422 });
  }

  await repo.update(id, { status: "analyzing" });

  const provider = getAIProvider();
  try {
    const analysis = await provider.analyzeItem(images);
    const updated = await saveAnalysis(id, analysis, provider.name);
    return NextResponse.json({ item: updated });
  } catch (e) {
    console.error("[analyze] proveedor principal no disponible:", e instanceof Error ? e.message : e);
  }

  if (provider.name !== "ollama-gpu") {
    try {
      const local = getLocalAIProvider();
      const analysis = await local.analyzeItem(images);
      const updated = await saveAnalysis(id, analysis, local.name);
      return NextResponse.json({ item: updated, fallback: true });
    } catch (error) {
      console.error("[analyze] fallback local no disponible:", error instanceof Error ? error.message : error);
    }
  }

  try {
    const updated = await repo.update(id, { status: "needs_review" });
    return NextResponse.json({ item: updated, error: "analysis_failed" }, {
      status: 200,
    });
  } catch {
    return NextResponse.json({ error: "analysis_failed" }, { status: 500 });
  }
}
