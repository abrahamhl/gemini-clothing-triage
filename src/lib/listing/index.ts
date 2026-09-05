import type { Item, Listing, Platform } from "@/lib/types";

const CONDITION_NL: Record<string, string> = {
  nuevo_etiqueta: "Nieuw met label",
  como_nuevo: "Zo goed als nieuw",
  muy_bueno: "Zeer goede staat",
  bueno: "Goede staat",
  aceptable: "Redelijke staat",
};

const CONDITION_NOTE_ES: Record<string, string> = {
  nuevo_etiqueta: "Nuevo con etiqueta",
  como_nuevo: "Como nuevo",
  muy_bueno: "Muy buen estado",
  bueno: "Buen estado",
  aceptable: "Estado aceptable",
};

const COLOR_NL: Record<string, string> = {
  "azul oscuro": "donkerblauw",
  "verde militar": "legergroen",
  negro: "zwart",
  blanco: "wit",
  gris: "grijs",
  rojo: "rood",
  azul: "blauw",
  verde: "groen",
  marrón: "bruin",
  marron: "bruin",
  naranja: "oranje",
  amarillo: "geel",
  rosa: "roze",
  morado: "paars",
  beige: "beige",
};

function colorNL(color: string | null): string | null {
  if (!color) return null;
  const low = color.toLowerCase();
  for (const [es, nl] of Object.entries(COLOR_NL)) {
    if (low.includes(es)) return nl;
  }
  return color;
}

function keywordsFor(item: Item): string[] {
  return [item.brand, item.category, item.style, item.model, item.color]
    .filter((v): v is string => Boolean(v))
    .map((v) => v.toLowerCase());
}

function priceFor(item: Item, platform: Platform): number {
  if (item.marketResearch) return item.marketResearch.recommendedPrice;
  const p = item.prices;
  if (!p) return 0;
  return platform === "marktplaats" ? p.quick : p.recommended;
}

function lotKeywords(items: Item[]): string[] {
  return [...new Set(items.flatMap(keywordsFor))].slice(0, 10);
}

function bodyNL(item: Item, platform: Platform): string {
  const condition = item.condition ? CONDITION_NL[item.condition] : "Gecontroleerd";
  const opener = [item.brand, item.model].filter(Boolean).join(" ").trim() || item.name;

  const lines = [
    `${opener} — ${condition.toLowerCase()}.`,
    "",
    `Staat: ${condition}.`,
    item.size ? `Maat: ${item.size}.` : null,
    item.material ? `Materiaal: ${item.material}.` : null,
    item.color ? `Kleur: ${colorNL(item.color)}.` : null,
    "",
    platform === "marktplaats"
      ? "Ophalen of verzenden mogelijk. Geen reserveringen: wie het eerst betaalt."
      : "Snelle verzending, netjes verpakt. Vraag gerust naar bundelkorting.",
  ];

  return lines.filter((l): l is string => l !== null).join("\n");
}

export function composeListing(item: Item, platform: Platform): Listing {
  const conditionNL = item.condition ? CONDITION_NL[item.condition] : "Gecontroleerd";
  const conditionES = item.condition ? CONDITION_NOTE_ES[item.condition] : "Revisado";
  const parts = [item.brand, item.model].filter(Boolean).join(" ").trim();
  const sizeTag = item.size ? ` · Maat ${item.size}` : "";
  const title = `${parts || item.name}${sizeTag} · ${conditionNL}`;

  return {
    platform,
    title,
    body: bodyNL(item, platform),
    keywords: keywordsFor(item),
    price: priceFor(item, platform),
    notes:
      `Anuncio en neerlandés (${conditionES}). ` +
      (item.strategy === "subir_precio"
        ? "Pieza con demanda alta: empieza por encima del recomendado y deja margen."
        : item.strategy === "agrupar"
          ? "Valor unitario bajo: rinde más en lote temático."
          : "Publica al recomendado; baja al precio rápido si no hay interés en una semana."),
  };
}

export function composeLotListing(
  items: Item[],
  platform: Platform,
  lotName: string,
  targetPrice: number,
): Listing {
  const details = items.map((item) => {
    const bits = [item.brand, item.model || item.name, item.size ? `maat ${item.size}` : null]
      .filter(Boolean)
      .join(" · ");
    const condition = item.condition ? CONDITION_NL[item.condition] : "Gecontroleerd";
    return `• ${bits} — ${condition.toLowerCase()}`;
  });

  return {
    platform,
    title: `${lotName} · ${items.length} stuks als voordelige bundel`.slice(0, 100),
    body: [
      `${items.length} bij elkaar passende items, samen aangeboden als voordelige bundel.`,
      "",
      ...details,
      "",
      platform === "marktplaats"
        ? "Ophalen of verzenden mogelijk. De bundel heeft de voorkeur."
        : "Snelle verzending en netjes verpakt. Alleen als complete bundel aangeboden.",
    ].join("\n"),
    keywords: lotKeywords(items),
    price: targetPrice,
    notes: "Anuncio de respaldo generado sin IA. Revisa medidas y defectos antes de publicar.",
  };
}
