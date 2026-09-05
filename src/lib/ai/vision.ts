import type { AIProvider, ImageInput } from "./provider";
import type { ItemAnalysis } from "./schema";
import type { Item, Listing, MarketResearch, Platform } from "@/lib/types";
import crypto from "crypto";

type ServiceAccountCredentials = {
  client_email: string;
  private_key: string;
  token_uri: string;
};

type VisionTextAnnotation = { description?: string };
type VisionObjectAnnotation = { name?: string };
type VisionResponse = {
  labelAnnotations?: VisionTextAnnotation[];
  logoAnnotations?: VisionTextAnnotation[];
  localizedObjectAnnotations?: VisionObjectAnnotation[];
  textAnnotations?: VisionTextAnnotation[];
};
type VisionApiResponse = { responses?: VisionResponse[] };
type OAuthTokenResponse = { access_token?: string; error?: string; error_description?: string };

function getServiceAccount(): ServiceAccountCredentials {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("google_service_account_not_configured");

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("google_service_account_json_invalid");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("google_service_account_json_invalid");
  }

  const candidate = parsed as Record<string, unknown>;
  if (
    typeof candidate.client_email !== "string" ||
    typeof candidate.private_key !== "string" ||
    typeof candidate.token_uri !== "string"
  ) {
    throw new Error("google_service_account_json_missing_fields");
  }

  return {
    client_email: candidate.client_email,
    private_key: candidate.private_key,
    token_uri: candidate.token_uri,
  };
}

function signJwt(saPayload: ServiceAccountCredentials) {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const claim = {
    iss: saPayload.client_email,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: saPayload.token_uri,
    exp: now + 3600,
    iat: now,
  };

  const b64Url = (str: string) =>
    Buffer.from(str)
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  const h = b64Url(JSON.stringify(header));
  const c = b64Url(JSON.stringify(claim));

  const sign = crypto.createSign("RSA-SHA256");
  sign.update(`${h}.${c}`);
  const signature = sign
    .sign(saPayload.private_key, "base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return `${h}.${c}.${signature}`;
}

async function getAccessToken() {
  const serviceAccount = getServiceAccount();
  const jwt = signJwt(serviceAccount);
  const res = await fetch(serviceAccount.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:
      "grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=" +
      jwt,
  });
  const data = (await res.json()) as OAuthTokenResponse;
  if (!res.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "google_oauth_token_failed");
  }
  return data.access_token;
}

export class GoogleVisionProvider implements AIProvider {
  name = "google-vision-b2b";

  async analyzeItem(images: ImageInput[]): Promise<ItemAnalysis> {
    const token = await getAccessToken();
    const visionUrl = "https://vision.googleapis.com/v1/images:annotate";

    const requests = images.map((img) => ({
      image: { content: img.base64 },
      features: [
        { type: "LABEL_DETECTION", maxResults: 15 },
        { type: "LOGO_DETECTION", maxResults: 3 },
        { type: "OBJECT_LOCALIZATION", maxResults: 5 },
        { type: "TEXT_DETECTION", maxResults: 3 },
      ],
    }));

    const visionRes = await fetch(visionUrl, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requests }),
    });

    const visionData = (await visionRes.json()) as VisionApiResponse;
    if (!visionRes.ok) throw new Error(`vision_processing_error_${visionRes.status}`);

    let allLabels: string[] = [];
    let allLogos: string[] = [];
    let allObjects: string[] = [];
    let allText = "";

    for (const annotations of visionData.responses ?? []) {
      allLabels.push(
        ...(annotations.labelAnnotations ?? [])
          .map((entry) => entry.description)
          .filter((value): value is string => Boolean(value)),
      );
      allLogos.push(
        ...(annotations.logoAnnotations ?? [])
          .map((entry) => entry.description)
          .filter((value): value is string => Boolean(value)),
      );
      allObjects.push(
        ...(annotations.localizedObjectAnnotations ?? [])
          .map((entry) => entry.name)
          .filter((value): value is string => Boolean(value)),
      );
      const detectedText = annotations.textAnnotations?.[0]?.description;
      if (detectedText) allText += ` ${detectedText}`;
    }

    allLabels = [...new Set(allLabels)];
    allLogos = [...new Set(allLogos)];
    allObjects = [...new Set(allObjects)];

    const isMoto = allLabels.some((label) =>
      [
        "Motorcycle",
        "Motocross",
        "Motorcycle helmet",
        "Motorcycle boot",
        "Leather",
        "Racing",
        "Rider",
      ].includes(label),
    );
    const isDesigner = allLabels.some((label) =>
      ["Fashion", "Designer", "Luxury", "Haute couture"].includes(label),
    );
    const isVintage = allLabels.some((label) =>
      ["Vintage", "Retro", "Classic"].includes(label),
    );

    let nombre =
      allObjects[0] ||
      allLabels.find(
        (label) => !["Clothing", "Apparel", "Fashion", "Sleeve", "Pattern"].includes(label),
      ) ||
      "Prenda/Accesorio";
    const marca =
      allLogos[0] ||
      (allText.length > 3
        ? allText.substring(0, 15).replace(/\n/g, " ").trim()
        : "Genérica");

    const translateMap: Record<string, string> = {
      Jeans: "Vaqueros",
      Trousers: "Pantalón",
      Shirt: "Camisa",
      "T-shirt": "Camiseta",
      Jacket: "Chaqueta",
      Dress: "Vestido",
      Shoe: "Zapato",
      Footwear: "Calzado",
      Coat: "Abrigo",
      Sweater: "Jersey",
      Shorts: "Pantalones Cortos",
      Skirt: "Falda",
      Hat: "Sombrero",
      Outerwear: "Prenda Exterior",
      Top: "Top",
      Suit: "Traje",
      Motorcycle: "Equipo de Moto",
      "Motorcycle helmet": "Casco de Moto",
      Leather: "Cuero",
    };
    if (translateMap[nombre]) nombre = translateMap[nombre];

    let basePrice = 20;
    if (["Chaqueta", "Abrigo", "Traje", "Suit"].includes(nombre)) basePrice = 50;
    if (["Zapato", "Calzado"].includes(nombre)) basePrice = 35;

    let category: "ropa" | "accesorio" = "ropa";
    if (isMoto) {
      nombre = "Traje/Equipación de Moto";
      basePrice = 120;
      category = "accesorio";
    } else if (isDesigner) {
      basePrice *= 2.5;
    } else if (isVintage) {
      basePrice *= 1.4;
    }
    if (marca !== "Genérica" && !isMoto) basePrice *= 1.6;

    return {
      name: nombre,
      brand: marca !== "Genérica" ? marca : null,
      model: null,
      category,
      size: "S/M/L",
      material:
        allLabels.find((label) => ["Leather", "Denim", "Cotton", "Wool", "Silk"].includes(label)) ||
        "Desconocido",
      color: "Múltiple",
      style: isVintage ? "Vintage" : isDesigner ? "Designer" : "Casual",
      condition: "bueno",
      rarity: isVintage || isDesigner ? 85 : 40,
      market: "Marktplaats / Vinted",
      demand: isMoto ? "muy_alta" : "media",
      confidence: Math.round(75 + Math.random() * 20),
      description:
        "Analizado mediante Google Cloud Vision. Etiquetas detectadas: " +
        allLabels.slice(0, 5).join(", "),
    };
  }

  async enhanceListingImage(image: ImageInput, _item: Item): Promise<ImageInput> {
    return image;
  }

  async researchMarket(item: Item): Promise<MarketResearch> {
    const minPrice = 15;
    const maxPrice = 150;
    const quickPrice = 30;
    const premiumPrice = 90;

    return {
      query: `Estimación heurística local para ${item.name}`,
      summary:
        "Estimación orientativa sin investigación web en tiempo real. Debe validarse con comparables actuales antes de utilizarse como recomendación comercial.",
      demand: "media",
      comparableMin: minPrice,
      comparableMedian: 45,
      comparableMax: maxPrice,
      recommendedPrice: 65,
      quickPrice,
      premiumPrice,
      confidence: 25,
      caveat:
        "Google Vision no realiza investigación de mercado. Estos importes son una heurística de fallback, no comparables verificados.",
      sources: [],
      researchedAt: new Date().toISOString(),
    };
  }

  async generateListing(item: Item, platform: Platform): Promise<Listing> {
    return {
      platform,
      title: `${item.name} ${item.brand || ""}`.trim(),
      body: `Excelente ${item.name} en venta. ${item.aiDescription || ""}`.trim(),
      keywords: ["ropa", "vintage", "moda"],
      price: 50,
      notes: "Generado automáticamente; revisar datos antes de publicar.",
    };
  }

  async generateLotListing(
    items: Item[],
    platform: Platform,
    lotName: string,
    targetPrice: number,
  ): Promise<Listing> {
    return {
      platform,
      title: `Lote: ${lotName}`,
      body: `Lote de ${items.length} artículos.`,
      keywords: ["lote", "vintage"],
      price: targetPrice,
      notes: "Generado automáticamente; revisar datos antes de publicar.",
    };
  }
}
