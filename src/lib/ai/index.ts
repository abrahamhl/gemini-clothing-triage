import type { AIProvider } from "./provider";
import { MockProvider } from "./mock";
import { GeminiProvider } from "./gemini";
import { OllamaProvider } from "./ollama";
import { GoogleVisionProvider } from "./vision";

let cached: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (cached) return cached;
  
  // ALWAYS USE CLOUD VISION B2B IN PROD TO BYPASS GEMINI BLOCKS
  cached = new GoogleVisionProvider();
  return cached;
}

export function getLocalAIProvider(): AIProvider {
  return new GoogleVisionProvider();
}

export type { AIProvider, ImageInput } from "./provider";
export type { ItemAnalysis } from "./schema";
