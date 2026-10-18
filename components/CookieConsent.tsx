"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

export const CONSENT_KEY = "kinocut-consent";

type Choice = "granted" | "denied";

function grantAnalytics() {
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("consent", "update", { analytics_storage: "granted" });
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const choice = localStorage.getItem(CONSENT_KEY);
      if (choice === "granted") grantAnalytics();
      else if (choice !== "denied") setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function choose(choice: Choice) {
    try {
      localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      /* Private browsing can block storage. The choice still applies to this page. */
    }
    if (choice === "granted") grantAnalytics();
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[75] px-4 pb-4 md:px-8 md:pb-6">
      <div
        role="region"
        aria-label="Cookie notice"
        className="mx-auto flex max-w-[760px] flex-col gap-4 rounded-[24px] bg-ink px-5 py-4 text-white shadow-soft md:flex-row md:items-center md:justify-between"
      >
        <p className="text-sm text-ink-300">
          Cookies measure visits on this site. Accept to allow them, or reject to leave them off.{" "}
          <a className="text-blue-300 underline underline-offset-4" href={site.links.privacy}>
            Privacy
          </a>
        </p>
        <div className="flex shrink-0 gap-2">
          <button type="button" className="btn btn-ghost" onClick={() => choose("denied")}>
            Reject
          </button>
          <button type="button" className="btn btn-primary" onClick={() => choose("granted")}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
