"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleVisionProvider = void 0;
var crypto_1 = require("crypto");
function getServiceAccount() {
    var raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!raw)
        throw new Error("google_service_account_not_configured");
    var parsed;
    try {
        parsed = JSON.parse(raw);
    }
    catch (_a) {
        throw new Error("google_service_account_json_invalid");
    }
    if (!parsed || typeof parsed !== "object") {
        throw new Error("google_service_account_json_invalid");
    }
    var candidate = parsed;
    if (typeof candidate.client_email !== "string" ||
        typeof candidate.private_key !== "string" ||
        typeof candidate.token_uri !== "string") {
        throw new Error("google_service_account_json_missing_fields");
    }
    return {
        client_email: candidate.client_email,
        private_key: candidate.private_key,
        token_uri: candidate.token_uri,
    };
}
function signJwt(saPayload) {
    var header = { alg: "RS256", typ: "JWT" };
    var now = Math.floor(Date.now() / 1000);
    var claim = {
        iss: saPayload.client_email,
        scope: "https://www.googleapis.com/auth/cloud-platform",
        aud: saPayload.token_uri,
        exp: now + 3600,
        iat: now,
    };
    var b64Url = function (str) {
        return Buffer.from(str)
            .toString("base64")
            .replace(/=/g, "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_");
    };
    var h = b64Url(JSON.stringify(header));
    var c = b64Url(JSON.stringify(claim));
    var sign = crypto_1.default.createSign("RSA-SHA256");
    sign.update("".concat(h, ".").concat(c));
    var signature = sign
        .sign(saPayload.private_key, "base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
    return "".concat(h, ".").concat(c, ".").concat(signature);
}
function getAccessToken() {
    return __awaiter(this, void 0, void 0, function () {
        var serviceAccount, jwt, res, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    serviceAccount = getServiceAccount();
                    jwt = signJwt(serviceAccount);
                    return [4 /*yield*/, fetch(serviceAccount.token_uri, {
                            method: "POST",
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            body: "grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=" +
                                jwt,
                        })];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = (_a.sent());
                    if (!res.ok || !data.access_token) {
                        throw new Error(data.error_description || data.error || "google_oauth_token_failed");
                    }
                    return [2 /*return*/, data.access_token];
            }
        });
    });
}
var GoogleVisionProvider = /** @class */ (function () {
    function GoogleVisionProvider() {
        this.name = "google-vision-b2b";
    }
    GoogleVisionProvider.prototype.analyzeItem = function (images) {
        return __awaiter(this, void 0, void 0, function () {
            var token, visionUrl, requests, visionRes, visionData, allLabels, allLogos, allObjects, allText, _i, _a, annotations, detectedText, isMoto, isDesigner, isVintage, nombre, marca, translateMap, basePrice, category;
            var _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0: return [4 /*yield*/, getAccessToken()];
                    case 1:
                        token = _h.sent();
                        visionUrl = "https://vision.googleapis.com/v1/images:annotate";
                        requests = images.map(function (img) { return ({
                            image: { content: img.base64 },
                            features: [
                                { type: "LABEL_DETECTION", maxResults: 15 },
                                { type: "LOGO_DETECTION", maxResults: 3 },
                                { type: "OBJECT_LOCALIZATION", maxResults: 5 },
                                { type: "TEXT_DETECTION", maxResults: 3 },
                            ],
                        }); });
                        return [4 /*yield*/, fetch(visionUrl, {
                                method: "POST",
                                headers: {
                                    Authorization: "Bearer " + token,
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ requests: requests }),
                            })];
                    case 2:
                        visionRes = _h.sent();
                        return [4 /*yield*/, visionRes.json()];
                    case 3:
                        visionData = (_h.sent());
                        if (!visionRes.ok)
                            throw new Error("vision_processing_error_".concat(visionRes.status));
                        allLabels = [];
                        allLogos = [];
                        allObjects = [];
                        allText = "";
                        for (_i = 0, _a = (_b = visionData.responses) !== null && _b !== void 0 ? _b : []; _i < _a.length; _i++) {
                            annotations = _a[_i];
                            allLabels.push.apply(allLabels, ((_c = annotations.labelAnnotations) !== null && _c !== void 0 ? _c : [])
                                .map(function (entry) { return entry.description; })
                                .filter(function (value) { return Boolean(value); }));
                            allLogos.push.apply(allLogos, ((_d = annotations.logoAnnotations) !== null && _d !== void 0 ? _d : [])
                                .map(function (entry) { return entry.description; })
                                .filter(function (value) { return Boolean(value); }));
                            allObjects.push.apply(allObjects, ((_e = annotations.localizedObjectAnnotations) !== null && _e !== void 0 ? _e : [])
                                .map(function (entry) { return entry.name; })
                                .filter(function (value) { return Boolean(value); }));
                            detectedText = (_g = (_f = annotations.textAnnotations) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.description;
                            if (detectedText)
                                allText += " ".concat(detectedText);
                        }
                        allLabels = __spreadArray([], new Set(allLabels), true);
                        allLogos = __spreadArray([], new Set(allLogos), true);
                        allObjects = __spreadArray([], new Set(allObjects), true);
                        isMoto = allLabels.some(function (label) {
                            return [
                                "Motorcycle",
                                "Motocross",
                                "Motorcycle helmet",
                                "Motorcycle boot",
                                "Leather",
                                "Racing",
                                "Rider",
                            ].includes(label);
                        });
                        isDesigner = allLabels.some(function (label) {
                            return ["Fashion", "Designer", "Luxury", "Haute couture"].includes(label);
                        });
                        isVintage = allLabels.some(function (label) {
                            return ["Vintage", "Retro", "Classic"].includes(label);
                        });
                        nombre = allObjects[0] ||
                            allLabels.find(function (label) { return !["Clothing", "Apparel", "Fashion", "Sleeve", "Pattern"].includes(label); }) ||
                            "Prenda/Accesorio";
                        marca = allLogos[0] ||
                            (allText.length > 3
                                ? allText.substring(0, 15).replace(/\n/g, " ").trim()
                                : "Genérica");
                        translateMap = {
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
                        if (translateMap[nombre])
                            nombre = translateMap[nombre];
                        basePrice = 20;
                        if (["Chaqueta", "Abrigo", "Traje", "Suit"].includes(nombre))
                            basePrice = 50;
                        if (["Zapato", "Calzado"].includes(nombre))
                            basePrice = 35;
                        category = "ropa";
                        if (isMoto) {
                            nombre = "Traje/Equipación de Moto";
                            basePrice = 120;
                            category = "accesorio";
                        }
                        else if (isDesigner) {
                            basePrice *= 2.5;
                        }
                        else if (isVintage) {
                            basePrice *= 1.4;
                        }
                        if (marca !== "Genérica" && !isMoto)
                            basePrice *= 1.6;
                        return [2 /*return*/, {
                                name: nombre,
                                brand: marca !== "Genérica" ? marca : null,
                                model: null,
                                category: category,
                                size: "S/M/L",
                                material: allLabels.find(function (label) { return ["Leather", "Denim", "Cotton", "Wool", "Silk"].includes(label); }) ||
                                    "Desconocido",
                                color: "Múltiple",
                                style: isVintage ? "Vintage" : isDesigner ? "Designer" : "Casual",
                                condition: "bueno",
                                rarity: isVintage || isDesigner ? 85 : 40,
                                market: "Marktplaats / Vinted",
                                demand: isMoto ? "muy_alta" : "media",
                                confidence: Math.round(75 + Math.random() * 20),
                                description: "Analizado mediante Google Cloud Vision. Etiquetas detectadas: " +
                                    allLabels.slice(0, 5).join(", "),
                            }];
                }
            });
        });
    };
    GoogleVisionProvider.prototype.enhanceListingImage = function (image, _item) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, image];
            });
        });
    };
    GoogleVisionProvider.prototype.researchMarket = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var minPrice, maxPrice, quickPrice, premiumPrice;
            return __generator(this, function (_a) {
                minPrice = 15;
                maxPrice = 150;
                quickPrice = 30;
                premiumPrice = 90;
                return [2 /*return*/, {
                        query: "Estimaci\u00F3n heur\u00EDstica local para ".concat(item.name),
                        summary: "Estimación orientativa sin investigación web en tiempo real. Debe validarse con comparables actuales antes de utilizarse como recomendación comercial.",
                        demand: "media",
                        comparableMin: minPrice,
                        comparableMedian: 45,
                        comparableMax: maxPrice,
                        recommendedPrice: 65,
                        quickPrice: quickPrice,
                        premiumPrice: premiumPrice,
                        confidence: 25,
                        caveat: "Google Vision no realiza investigación de mercado. Estos importes son una heurística de fallback, no comparables verificados.",
                        sources: [],
                        researchedAt: new Date().toISOString(),
                    }];
            });
        });
    };
    GoogleVisionProvider.prototype.generateListing = function (item, platform) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        platform: platform,
                        title: "".concat(item.name, " ").concat(item.brand || "").trim(),
                        body: "Excelente ".concat(item.name, " en venta. ").concat(item.aiDescription || "").trim(),
                        keywords: ["ropa", "vintage", "moda"],
                        price: 50,
                        notes: "Generado automáticamente; revisar datos antes de publicar.",
                    }];
            });
        });
    };
    GoogleVisionProvider.prototype.generateLotListing = function (items, platform, lotName, targetPrice) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        platform: platform,
                        title: "Lote: ".concat(lotName),
                        body: "Lote de ".concat(items.length, " art\u00EDculos."),
                        keywords: ["lote", "vintage"],
                        price: targetPrice,
                        notes: "Generado automáticamente; revisar datos antes de publicar.",
                    }];
            });
        });
    };
    return GoogleVisionProvider;
}());
exports.GoogleVisionProvider = GoogleVisionProvider;
