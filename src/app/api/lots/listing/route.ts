import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getAIProvider, getLocalAIProvider } from "@/lib/ai";
import { getRepository } from "@/lib/db";
import { composeLotListing } from "@/lib/listing";

const requestSchema = z.object({
  itemIds: z.array(z.string().uuid()).min(2).max(24),
  platform: z.enum(["marktplaats", "vinted"]),
  lotName: z.string().min(1).max(100),
  targetPrice: z.number().min(0).max(100000),
});

export async function POST(request: NextRequest) {
  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const repo = getRepository();
  const loaded = await Promise.all(parsed.data.itemIds.map((id) => repo.get(id)));
  if (loaded.some((item) => !item)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  const items = loaded.filter((item): item is NonNullable<typeof item> => Boolean(item));

  try {
    const listing = await getAIProvider().generateLotListing(
      items,
      parsed.data.platform,
      parsed.data.lotName,
      parsed.data.targetPrice,
    );
    return NextResponse.json({ listing });
  } catch (error) {
    console.error("[lot-listing] proveedor principal no disponible:", error instanceof Error ? error.message : error);
    try {
      const listing = await getLocalAIProvider().generateLotListing(
        items,
        parsed.data.platform,
        parsed.data.lotName,
        parsed.data.targetPrice,
      );
      return NextResponse.json({ listing, fallback: true });
    } catch {
      return NextResponse.json({
        listing: composeLotListing(
          items,
          parsed.data.platform,
          parsed.data.lotName,
          parsed.data.targetPrice,
        ),
        fallback: true,
      });
    }
  }
}
