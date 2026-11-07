import { geminiGenerate, ProviderError } from "./providers/gemini";
import { getProvider } from "./provider";

export const CHAT_COST = 1;
export type ChatMsg = { role: "user" | "assistant"; content: string };
export const CHAT_SYSTEM = "You are a helpful, honest assistant. Answer clearly and concisely. Use Markdown for lists and code blocks. If you are not sure about something, say so instead of guessing. Reply in the language the user writes in.";

async function* compatStream(messages: ChatMsg[]): AsyncGenerator<string> {
  const base = (process.env.AI_BASE_URL ?? "").replace(/\/+$/, "");
  let res: Response;
  try {
    res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${process.env.AI_API_KEY}` },
      body: JSON.stringify({ model: process.env.AI_MODEL, stream: true, max_tokens: 2000, temperature: 0.7, messages: [{ role: "system", content: CHAT_SYSTEM }, ...messages] }),
      signal: AbortSignal.timeout(60_000),
    });
  } catch { throw new ProviderError("timeout"); }
  if (!res.ok || !res.body) throw new ProviderError("provider_error", res.status);

  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      const l = line.trim();
      if (!l.startsWith("data:")) continue;
      const data = l.slice(5).trim();
      if (data === "[DONE]") return;
      try {
        const piece = JSON.parse(data).choices?.[0]?.delta?.content;
        if (typeof piece === "string" && piece) yield piece;
      } catch { /* ignore keep-alive or partial lines */ }
    }
  }
}

export function streamChat(messages: ChatMsg[]): AsyncGenerator<string> {
  const p = getProvider();
  if (p?.name === "openai-compatible") return compatStream(messages);
  return (async function* () {
    const transcript = messages.map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n\n");
    const r = await geminiGenerate({ system: CHAT_SYSTEM, prompt: `${transcript}\n\nAssistant:` });
    yield r.text;
  })();
}
