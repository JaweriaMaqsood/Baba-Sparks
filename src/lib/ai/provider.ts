import { geminiGenerate } from "./providers/gemini";
import { compatGenerate } from "./providers/openai-compatible";

type Gen = (o: { system: string; prompt: string }) => Promise<{ text: string; model: string; tokensIn?: number; tokensOut?: number }>;

// Picks the provider from environment variables. Generic (OpenAI-compatible) wins if fully configured.
export function getProvider(): { name: string; generate: Gen } | null {
  if (process.env.AI_BASE_URL && process.env.AI_API_KEY && process.env.AI_MODEL) return { name: "openai-compatible", generate: compatGenerate };
  if (process.env.GEMINI_API_KEY) return { name: "gemini", generate: geminiGenerate };
  return null;
}
