import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getRepository } from "@/lib/db";

const patchSchema = z.object({
  status: z
    .enum([
      "pending",
      "analyzing",
      "ready",
      "needs_review",
      "listed",
      "kept",
      "discarded",
    ])
    .optional(),
  strategy: z
    .enum(["conservar", "publicar", "agrupar", "subir_precio", "liquidar"])
    .optional(),
  name: z.string().min(1).max(120).optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const item = await getRepository().get(id);
  if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ item });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const parsed = patchSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  try {
    const item = await getRepository().update(id, parsed.data);
    return NextResponse.json({ item });
  } catch {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
}
