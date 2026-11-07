"use client";
import { useState } from "react";
export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return <button className="btn-ghost px-3 py-1 text-xs" onClick={async () => { await navigator.clipboard.writeText(text); setDone(true); }}>{done ? "Copied" : "Copy"}</button>;
}
