export class ProviderError extends Error {
  constructor(public code: "provider_error" | "empty" | "timeout", public status?: number) { super(code); }
}

export async function geminiGenerate(opts: { system: string; prompt: string }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY missing");
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: opts.system }] },
    contents: [{ role: "user", parts: [{ text: opts.prompt }] }],
    generationConfig: { maxOutputTokens: 1500, temperature: 0.7 },
  });

  for (let attempt = 0; attempt < 2; attempt++) {
    let res: Response;
    try {
      res = await fetch(url, { method: "POST", headers: { "content-type": "application/json", "x-goog-api-key": key }, body, signal: AbortSignal.timeout(30_000) });
    } catch {
      throw new ProviderError("timeout");
    }
    if (res.ok) {
      const j = await res.json();
      const text: string = (j.candidates?.[0]?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? "").join("");
      if (!text.trim()) throw new ProviderError("empty");
      return { text: text.trim(), model, tokensIn: j.usageMetadata?.promptTokenCount as number | undefined, tokensOut: j.usageMetadata?.candidatesTokenCount as number | undefined };
    }
    if (attempt === 0 && (res.status === 429 || res.status >= 500)) { await new Promise((r) => setTimeout(r, 800)); continue; }
    throw new ProviderError("provider_error", res.status);
  }
  throw new ProviderError("provider_error");
}
