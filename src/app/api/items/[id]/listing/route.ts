import { NextResponse, type NextRequest } from "next/server";
import { getRepository } from "@/lib/db";
import { getAIProvider, getLocalAIProvider } from "@/lib/ai";
import { composeListing } from "@/lib/listing";
import { z } from "zod";

const platformSchema = z.enum(["marktplaats", "vinted"]);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const parsedPlatform = platformSchema.safeParse(
    request.nextUrl.searchParams.get("platform") ?? "marktplaats",
  );
  if (!parsedPlatform.success) {
    return NextResponse.json({ error: "invalid_platform" }, { status: 400 });
  }
  const platform = parsedPlatform.data;

  const item = await getRepository().get(id);
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!item.prices) {
    return NextResponse.json({ error: "not_analyzed" }, { status: 409 });
  }

  try {
    const listing = await getAIProvider().generateListing(item, platform);
    return NextResponse.json({ listing });
  } catch (error) {
    console.error("[listing] proveedor principal no disponible:", error instanceof Error ? error.message : error);
    try {
      const listing = await getLocalAIProvider().generateListing(item, platform);
      return NextResponse.json({ listing, fallback: true });
    } catch {
      return NextResponse.json({ listing: composeListing(item, platform), fallback: true });
    }
  }
}
