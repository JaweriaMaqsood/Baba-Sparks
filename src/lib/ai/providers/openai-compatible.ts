import { ProviderError } from "./gemini";

// Works with any service that speaks the OpenAI chat-completions format (Groq, OpenRouter, Together, Cerebras, ...).
export async function compatGenerate(opts: { system: string; prompt: string }) {
  const base = (process.env.AI_BASE_URL ?? "").replace(/\/+$/, "");
  const key = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  if (!base || !key || !model) throw new Error("AI provider env missing");
  const body = JSON.stringify({
    model,
    messages: [{ role: "system", content: opts.system }, { role: "user", content: opts.prompt }],
    max_tokens: 1500,
    temperature: 0.7,
  });

  for (let attempt = 0; attempt < 2; attempt++) {
    let res: Response;
    try {
      res = await fetch(`${base}/chat/completions`, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${key}` }, body, signal: AbortSignal.timeout(30_000) });
    } catch {
      throw new ProviderError("timeout");
    }
    if (res.ok) {
      const j = await res.json();
      const text: string = j.choices?.[0]?.message?.content ?? "";
      if (!text.trim()) throw new ProviderError("empty");
      return { text: text.trim(), model, tokensIn: j.usage?.prompt_tokens as number | undefined, tokensOut: j.usage?.completion_tokens as number | undefined };
    }
    if (attempt === 0 && (res.status === 429 || res.status >= 500)) { await new Promise((r) => setTimeout(r, 800)); continue; }
    throw new ProviderError("provider_error", res.status);
  }
  throw new ProviderError("provider_error");
}
