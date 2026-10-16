"use client";

import { useActionState } from "react";
import { setPasswordFromPayment, type FormState } from "@/lib/auth-actions";
import { MagneticButton } from "./MagneticButton";

const initial: FormState = { error: "" };

export function SetPasswordForm({ transactionId }: { transactionId: string }) {
  const [state, action, pending] = useActionState(setPasswordFromPayment, initial);

  return (
    <form action={action} className="mt-8 space-y-4">
      <input type="hidden" name="transactionId" value={transactionId} />
      <label className="block">
        <span className="type-micro text-blue-700">Password</span>
        <input className="field mt-2" type="password" name="password" autoComplete="new-password" required minLength={8} />
      </label>
      <label className="block">
        <span className="type-micro text-blue-700">Confirm password</span>
        <input className="field mt-2" type="password" name="confirm" autoComplete="new-password" required minLength={8} />
      </label>
      {state.error ? <p className="text-sm text-ink-600">{state.error}</p> : null}
      <MagneticButton type="submit" className={`w-full ${pending ? "pointer-events-none opacity-70" : ""}`}>
        {pending ? "Opening the bay" : "Set password and open the bay"}
      </MagneticButton>
    </form>
  );
}
