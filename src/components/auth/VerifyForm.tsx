"use client";
import { useActionState } from "react";
import { verifyCode, resendCode } from "@/lib/auth/actions";

const box = "mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2";
export function VerifyForm({ email }: { email: string }) {
  const [vs, vRun, vPending] = useActionState(verifyCode, {});
  const [rs, rRun, rPending] = useActionState(resendCode, {});
  return (
    <div className="space-y-4">
      <form action={vRun} className="panel space-y-4 p-6">
        <label className="block text-sm">Email
          <input name="email" type="email" defaultValue={email} required autoComplete="email" className={box} />
        </label>
        <label className="block text-sm">6-digit code
          <input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required placeholder="123456"
            className={`${box} text-center font-mono text-xl tracking-[0.5em]`} />
        </label>
        {vs.error && <p role="alert" className="text-sm text-red-400">{vs.error}</p>}
        <button disabled={vPending} className="btn-primary w-full disabled:opacity-60">{vPending ? "Checking…" : "Verify and continue"}</button>
      </form>
      <form action={rRun} className="text-sm text-muted">
        <input type="hidden" name="email" value={email} />
        <button disabled={rPending || !email} className="underline disabled:opacity-60">{rPending ? "Sending…" : "Send a new code"}</button>
        {rs.error && <p role="alert" className="mt-2 text-red-400">{rs.error}</p>}
        {rs.message && <p role="status" className="mt-2 text-accent">{rs.message}</p>}
      </form>
    </div>
  );
}
