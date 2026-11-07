"use client";
import { useState } from "react";

// Removes Markdown symbols so pasted text looks clean in Word, WhatsApp, etc.
export const toPlain = (t: string) =>
  t.replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/(?<![\w*])\*(\S[^*\n]*?)\*(?![\w*])/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/`{1,3}/g, "");

export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return <button className="btn-ghost px-3 py-1 text-xs" onClick={async () => { await navigator.clipboard.writeText(toPlain(text)); setDone(true); }}>{done ? "Copied" : "Copy"}</button>;
}
