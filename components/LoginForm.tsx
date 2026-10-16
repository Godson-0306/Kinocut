"use client";

import { useActionState } from "react";
import { login, setupStaff, type FormState } from "@/lib/auth-actions";
import { site } from "@/content/site";
import { MagneticButton } from "./MagneticButton";

const initial: FormState = { error: "" };

export function LoginForm() {
  const [signIn, signInAction, signingIn] = useActionState(login, initial);
  const [setup, setupAction, settingUp] = useActionState(setupStaff, initial);

  return (
    <main id="main" className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-ink px-5 py-32 text-white">
      <div className="bg-aurora pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full opacity-40 blur-3xl" />
      <div className="relative grid w-full max-w-md gap-4">
        <div className="rounded-panel bg-white p-8 text-ink shadow-card">
          <p className="type-micro text-blue-700">Client bay</p>
          <h1 className="type-sub mt-3">{site.login.title}</h1>
          <p className="type-body mt-3 text-ink-600">{site.login.lede}</p>
          <form action={signInAction} className="mt-8 space-y-4">
            <label className="block">
              <span className="type-micro text-blue-700">Email</span>
              <input className="field mt-2" type="email" name="email" autoComplete="email" required placeholder="you@studio.com" />
            </label>
            <label className="block">
              <span className="type-micro text-blue-700">Password</span>
              <input className="field mt-2" type="password" name="password" autoComplete="current-password" required />
            </label>
            {signIn.error ? <p className="text-sm text-ink-600">{signIn.error}</p> : null}
            <MagneticButton type="submit" className={`w-full ${signingIn ? "pointer-events-none opacity-70" : ""}`}>
              {signingIn ? "Opening the door" : "Sign in"}
            </MagneticButton>
          </form>
        </div>
        <details className="rounded-panel bg-white p-8 text-ink shadow-card">
          <summary className="type-micro text-blue-700" data-cursor="hover">
            Kinocut staff setup
          </summary>
          <form action={setupAction} className="mt-6 space-y-4">
            <label className="block">
              <span className="type-micro text-blue-700">Email</span>
              <input className="field mt-2" type="email" name="email" autoComplete="username" required />
            </label>
            <label className="block">
              <span className="type-micro text-blue-700">Setup code</span>
              <input className="field mt-2" name="code" autoComplete="one-time-code" required />
            </label>
            <label className="block">
              <span className="type-micro text-blue-700">Password</span>
              <input className="field mt-2" type="password" name="password" autoComplete="new-password" required minLength={8} />
            </label>
            <label className="block">
              <span className="type-micro text-blue-700">Confirm password</span>
              <input className="field mt-2" type="password" name="confirm" autoComplete="new-password" required minLength={8} />
            </label>
            {setup.error ? <p className="text-sm text-ink-600">{setup.error}</p> : null}
            <MagneticButton type="submit" className={`w-full ${settingUp ? "pointer-events-none opacity-70" : ""}`}>
              {settingUp ? "Setting the password" : "Set staff password"}
            </MagneticButton>
          </form>
        </details>
      </div>
    </main>
  );
}
