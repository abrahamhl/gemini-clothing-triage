import { NextResponse, type NextRequest } from "next/server";
import { getRepository } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const image = await getRepository().getImage(id);
  if (!image) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const bytes = Buffer.from(image.base64, "base64");
  return new Response(new Uint8Array(bytes), {
    status: 200,
    headers: {
      "Content-Type": image.mimeType,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
