"use client";
import { useActionState } from "react";
import { createTicket } from "@/lib/support/actions";

const box = "mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2";
export function TicketForm() {
  const [s, run, pending] = useActionState(createTicket, {});
  return (
    <form action={run} className="panel space-y-4 p-6">
      <h2 className="font-medium">Contact support</h2>
      <label className="block text-sm">Subject<input name="subject" required maxLength={100} className={box} /></label>
      <label className="block text-sm">What happened?<textarea name="message" required rows={5} maxLength={2000} className={box} /></label>
      {s.error && <p role="alert" className="text-sm text-red-400">{s.error}</p>}
      {s.message && <p role="status" className="text-sm text-accent">{s.message}</p>}
      <button disabled={pending} className="btn-primary w-full disabled:opacity-60">{pending ? "Sending…" : "Send"}</button>
    </form>
  );
}
