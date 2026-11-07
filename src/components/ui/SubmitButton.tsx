"use client";
import { useFormStatus } from "react-dom";

export function SubmitButton({ children, className = "", pendingText = "Please wait…" }: { children: React.ReactNode; className?: string; pendingText?: string }) {
  const { pending } = useFormStatus();
  return <button disabled={pending} aria-busy={pending} className={`${className} disabled:opacity-60`}>{pending ? pendingText : children}</button>;
}
