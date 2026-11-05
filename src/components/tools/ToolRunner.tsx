"use client";
import { useState } from "react";
import type { PublicTool } from "@/lib/ai/tools";

const box = "mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2";

export function ToolRunner({ tool }: { tool: PublicTool }) {
  const init = Object.fromEntries(tool.fields.map((f) => [f.name, f.type === "select" ? f.options?.[0] ?? "" : ""]));
  const [values, setValues] = useState<Record<string, string>>(init);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [output, setOutput] = useState("");
  const [left, setLeft] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(""); setOutput(""); setCopied(false);
    try {
      const res = await fetch("/api/ai/generate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ tool: tool.slug, input: values }) });
      const j = await res.json();
      if (!res.ok) setError(j.error ?? "Something went wrong.");
      else { setOutput(j.output); setLeft(j.creditsLeft); }
    } catch { setError("Network problem. Check your connection and try again."); }
    setBusy(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={run} className="panel space-y-4 p-6">
        {tool.fields.map((f) => (
          <label key={f.name} className="block text-sm">{f.label}
            {f.type === "textarea" ? (
              <textarea className={box} rows={5} maxLength={f.max} required={f.required} placeholder={f.placeholder} value={values[f.name]} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} />
            ) : f.type === "select" ? (
              <select className={box} value={values[f.name]} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}>
                {f.options?.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <input className={box} maxLength={f.max} required={f.required} placeholder={f.placeholder} value={values[f.name]} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} />
            )}
          </label>
        ))}
        <button disabled={busy} className="btn-primary w-full disabled:opacity-60">{busy ? "Generating…" : `Generate (${tool.cost} ${tool.cost === 1 ? "credit" : "credits"})`}</button>
        {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
      </form>
      <div className="panel p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Result</h2>
          {output && <button className="btn-ghost px-3 py-1 text-xs" onClick={async () => { await navigator.clipboard.writeText(output); setCopied(true); }}>{copied ? "Copied" : "Copy"}</button>}
        </div>
        {output ? <p dir="auto" className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{output}</p> : <p className="mt-4 text-sm text-muted">{busy ? "Working on it…" : "Your result will appear here."}</p>}
        {left !== null && <p className="mt-4 text-xs text-muted">Credits left: {left}</p>}
        {output && <p className="mt-2 text-xs text-muted">AI can make mistakes. Check important details.</p>}
      </div>
    </div>
  );
}
