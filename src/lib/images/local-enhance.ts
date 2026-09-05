import "server-only";

import sharp from "sharp";
import type { ImageInput } from "@/lib/ai";

export async function enhanceImageLocally(image: ImageInput): Promise<ImageInput> {
  const output = await sharp(Buffer.from(image.base64, "base64"), {
    failOn: "none",
  })
    .rotate()
    .resize({
      width: 1600,
      height: 1600,
      fit: "contain",
      background: { r: 244, g: 244, b: 242 },
      withoutEnlargement: false,
    })
    .normalise({ lower: 1, upper: 99 })
    .modulate({ brightness: 1.03, saturation: 1.02 })
    .sharpen({ sigma: 0.65 })
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toBuffer();

  return { mimeType: "image/jpeg", base64: output.toString("base64") };
}
