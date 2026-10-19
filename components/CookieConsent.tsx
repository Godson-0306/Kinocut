"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

export const CONSENT_KEY = "kinocut-consent";

function grantAnalytics() {
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("consent", "update", { analytics_storage: "granted" });
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [managing, setManaging] = useState(false);

  useEffect(() => {
    try {
      const choice = localStorage.getItem(CONSENT_KEY);
      if (choice === "granted") grantAnalytics();
      else setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(CONSENT_KEY, "granted");
    } catch {
      /* Private browsing can block storage. The choice still applies to this page. */
    }
    grantAnalytics();
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
        {managing ? (
          <div className="space-y-2 text-sm text-ink-300">
            <p>Visit measurement stays off until you accept.</p>
            <p>The login cookie is set only after sign-in and is not part of this choice.</p>
          </div>
        ) : (
          <p className="text-sm text-ink-300">
            Cookies measure visits on this site. They stay off until you accept.{" "}
            <a className="text-blue-300 underline underline-offset-4" href={site.links.privacy}>
              Privacy
            </a>
          </p>
        )}
        <div className="flex shrink-0 gap-2">
          {managing ? (
            <button type="button" className="btn btn-ghost" onClick={() => setManaging(false)}>
              Back
            </button>
          ) : (
            <button type="button" className="btn btn-ghost" onClick={() => setManaging(true)}>
              Manage cookies
            </button>
          )}
          <button type="button" className="btn btn-primary" onClick={accept}>
            Accept cookies
          </button>
        </div>
      </div>
    </div>
  );
}
