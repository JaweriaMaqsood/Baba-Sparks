"use client";
import { useActionState } from "react";
import type { FormState } from "@/lib/auth/actions";

type Field = { name: string; label: string; type: string; autoComplete?: string };
const input = "mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2";

export function AuthForm({ action, fields, button }: { action: (s: FormState, fd: FormData) => Promise<FormState>; fields: Field[]; button: string }) {
  const [state, run, pending] = useActionState(action, {});
  return (
    <form action={run} className="panel space-y-4 p-6" noValidate>
      {fields.map((f) => (
        <label key={f.name} className="block text-sm">{f.label}
          <input name={f.name} type={f.type} autoComplete={f.autoComplete} required className={input} />
        </label>
      ))}
      {state.error && <p role="alert" className="text-sm text-red-400">{state.error}</p>}
      {state.message && <p role="status" className="text-sm text-accent">{state.message}</p>}
      <button disabled={pending} className="btn-primary w-full disabled:opacity-60">{pending ? "Please wait…" : button}</button>
    </form>
  );
}
