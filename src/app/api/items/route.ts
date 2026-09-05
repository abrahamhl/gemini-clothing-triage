import { NextResponse, type NextRequest } from "next/server";
import { getRepository } from "@/lib/db";
import type { NewImage } from "@/lib/db";
import type { UploadSource } from "@/lib/types";

const MAX_FILES = 24;
const MAX_SINGLE_ITEM_FILES = 8;
const MAX_BYTES = 8 * 1024 * 1024;
const MAX_TOTAL_BYTES = 48 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

export async function GET() {
  const items = await getRepository().list();
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const files = form.getAll("images").filter((f): f is File => f instanceof File);
  const requestedSource = form.get("source");
  const source: UploadSource = requestedSource === "mobile" ? "mobile" : "desktop";
  const mode = (form.get("mode") as string) ?? "bulk";

  if (files.length === 0) {
    return NextResponse.json({ error: "no_images" }, { status: 400 });
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: "too_many" }, { status: 413 });
  }
  if (mode === "single" && files.length > MAX_SINGLE_ITEM_FILES) {
    return NextResponse.json({ error: "too_many_views" }, { status: 413 });
  }
  if (files.reduce((total, file) => total + file.size, 0) > MAX_TOTAL_BYTES) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  const decoded: NewImage[] = [];
  for (const file of files) {
    if (!ALLOWED_TYPES.has(file.type.toLowerCase())) {
      return NextResponse.json({ error: "bad_type" }, { status: 415 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "too_large" }, { status: 413 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    decoded.push({ mimeType: file.type, base64: buffer.toString("base64") });
  }

  const repo = getRepository();
  const groups =
    mode === "single" ? [decoded] : decoded.map((img) => [img]);
  const items = [];
  for (const images of groups) {
    items.push(await repo.create({ source, images }));
  }

  return NextResponse.json({ items }, { status: 201 });
}
