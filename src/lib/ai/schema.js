"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listingSchema = exports.marketResearchSchema = exports.analysisSchema = void 0;
var zod_1 = require("zod");
exports.analysisSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    brand: zod_1.z.string().nullable(),
    model: zod_1.z.string().nullable(),
    category: zod_1.z.enum([
        "ropa",
        "calzado",
        "accesorio",
        "audio_vintage",
        "hifi",
        "electronica",
        "otro",
    ]),
    size: zod_1.z.string().nullable(),
    material: zod_1.z.string().nullable(),
    color: zod_1.z.string().nullable(),
    style: zod_1.z.string().nullable(),
    condition: zod_1.z.enum([
        "nuevo_etiqueta",
        "como_nuevo",
        "muy_bueno",
        "bueno",
        "aceptable",
    ]),
    rarity: zod_1.z.number().min(0).max(100),
    market: zod_1.z.string().nullable(),
    demand: zod_1.z.enum(["baja", "media", "alta", "muy_alta"]),
    confidence: zod_1.z.number().min(0).max(100),
    description: zod_1.z.string(),
});
exports.marketResearchSchema = zod_1.z.object({
    query: zod_1.z.string().min(1).max(300),
    summary: zod_1.z.string().min(1).max(1200),
    demand: zod_1.z.enum(["baja", "media", "alta", "muy_alta"]),
    comparableMin: zod_1.z.number().min(0).max(100000),
    comparableMedian: zod_1.z.number().min(0).max(100000),
    comparableMax: zod_1.z.number().min(0).max(100000),
    recommendedPrice: zod_1.z.number().min(0).max(100000),
    quickPrice: zod_1.z.number().min(0).max(100000),
    premiumPrice: zod_1.z.number().min(0).max(100000),
    confidence: zod_1.z.number().min(0).max(100),
    caveat: zod_1.z.string().min(1).max(600),
});
exports.listingSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(100),
    body: zod_1.z.string().min(1).max(4000),
    keywords: zod_1.z.array(zod_1.z.string().min(1).max(50)).max(12),
    price: zod_1.z.number().min(0).max(100000),
    notes: zod_1.z.string().min(1).max(800),
});
