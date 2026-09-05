import { NextResponse, type NextRequest } from "next/server";
import { getAIProvider } from "@/lib/ai";
import { getRepository } from "@/lib/db";
import { enhanceImageLocally } from "@/lib/images/local-enhance";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const repo = getRepository();
  const item = await repo.get(id);
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const original = item.images.find((image) =>
    !image.kind || image.kind === "original",
  );
  if (!original) {
    return NextResponse.json({ error: "no_original_image" }, { status: 422 });
  }
  const stored = await repo.getImage(original.id);
  if (!stored) {
    return NextResponse.json({ error: "image_not_found" }, { status: 404 });
  }

  try {
    const provider = getAIProvider();
    const generated = await provider.enhanceListingImage(stored, item);
    const updated = await repo.addImage(id, {
      ...generated,
      source: original.uploadedFrom,
      kind: "enhanced",
      makePrimary: true,
      generatedBy: provider.name,
    });
    return NextResponse.json({ item: updated });
  } catch (error) {
    console.error("[enhance] IA no disponible; aplicando corrección local:", error instanceof Error ? error.message : error);
    try {
      const generated = await enhanceImageLocally(stored);
      const updated = await repo.addImage(id, {
        ...generated,
        source: original.uploadedFrom,
        kind: "enhanced",
        makePrimary: true,
        generatedBy: "local-sharp",
      });
      return NextResponse.json({ item: updated, fallback: true });
    } catch (fallbackError) {
      console.error("[enhance] fallo local:", fallbackError instanceof Error ? fallbackError.message : fallbackError);
      return NextResponse.json({ error: "enhancement_failed" }, { status: 502 });
    }
  }
}
