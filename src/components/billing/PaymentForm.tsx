"use client";
import { useActionState } from "react";
import { submitPayment } from "@/lib/billing/actions";

const box = "mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2";
export function PaymentForm({ plans }: { plans: { id: string; label: string }[] }) {
  const [state, run, pending] = useActionState(submitPayment, {});
  return (
    <form action={run} className="panel space-y-4 p-6">
      <label className="block text-sm">Plan
        <select name="plan" className={box} required>{plans.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</select>
      </label>
      <label className="block text-sm">Number you paid from
        <input name="sender_number" inputMode="tel" className={box} required placeholder="03XX XXXXXXX" />
      </label>
      <label className="block text-sm">Transaction ID (from JazzCash)
        <input name="txn_ref" className={box} required />
      </label>
      <label className="block text-sm">Note (optional)
        <input name="note" maxLength={200} className={box} />
      </label>
      {state.error && <p role="alert" className="text-sm text-red-400">{state.error}</p>}
      {state.message && <p role="status" className="text-sm text-accent">{state.message}</p>}
      <button disabled={pending} className="btn-primary w-full disabled:opacity-60">{pending ? "Please wait…" : "I have paid, submit for review"}</button>
    </form>
  );
}
