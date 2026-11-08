"use client";
import { useActionState } from "react";
import { updateProfile, changePassword } from "@/lib/account/actions";

const box = "mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2";
function Msg({ s }: { s: { error?: string; message?: string } }) {
  return <>{s.error && <p role="alert" className="text-sm text-red-400">{s.error}</p>}{s.message && <p role="status" className="text-sm text-accent">{s.message}</p>}</>;
}

export function SettingsForms({ name, email }: { name: string; email: string }) {
  const [ps, pRun, pPending] = useActionState(updateProfile, {});
  const [ws, wRun, wPending] = useActionState(changePassword, {});
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form action={pRun} className="panel space-y-4 p-6">
        <h2 className="font-medium">Profile</h2>
        <label className="block text-sm">Email<input value={email} disabled className={`${box} opacity-70`} /></label>
        <label className="block text-sm">Name<input name="name" defaultValue={name} required maxLength={80} className={box} /></label>
        <Msg s={ps} />
        <button disabled={pPending} className="btn-primary disabled:opacity-60">{pPending ? "Saving…" : "Save"}</button>
      </form>
      <form action={wRun} className="panel space-y-4 p-6">
        <h2 className="font-medium">Change password</h2>
        <label className="block text-sm">New password (8+ characters)<input name="password" type="password" autoComplete="new-password" required className={box} /></label>
        <label className="block text-sm">Repeat new password<input name="confirm" type="password" autoComplete="new-password" required className={box} /></label>
        <Msg s={ws} />
        <button disabled={wPending} className="btn-primary disabled:opacity-60">{wPending ? "Saving…" : "Change password"}</button>
      </form>
    </div>
  );
}
