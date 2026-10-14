"use client";

import { useState } from "react";
import { site } from "@/content/site";
import { MagneticButton } from "./MagneticButton";

export function LoginForm() {
  const [sent, setSent] = useState(false);

  return (
    <main id="main" className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-ink px-5 py-32 text-white">
      <div className="bg-aurora pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full opacity-40 blur-3xl" />
      <div className="relative w-full max-w-md rounded-panel bg-white p-8 text-ink shadow-card">
        <p className="type-micro text-blue-700">Client bay</p>
        <h1 className="type-sub mt-3">{site.login.title}</h1>
        <p className="type-body mt-3 text-ink-600">{sent ? site.login.success : site.login.lede}</p>
        {sent ? (
          <MagneticButton href={site.links.email} className="mt-8">
            Email the bay
          </MagneticButton>
        ) : (
          <form
            className="mt-8 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            <label className="block">
              <span className="type-micro text-blue-700">Email</span>
              <input className="field mt-2" type="email" name="email" autoComplete="email" required placeholder="you@studio.com" />
            </label>
            <MagneticButton type="submit" className="w-full">
              Request a link
            </MagneticButton>
          </form>
        )}
      </div>
    </main>
  );
}
