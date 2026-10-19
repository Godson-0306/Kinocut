"use client";

import { X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export const CONSENT_KEY = "kinocut-consent";
export const OPEN_PREFERENCES_EVENT = "kinocut-cookie-preferences";

type Choice = "granted" | "denied";

function applyAnalytics(granted: boolean) {
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("consent", "update", { analytics_storage: granted ? "granted" : "denied" });
}

function readChoice(): Choice | null {
  try {
    const choice = localStorage.getItem(CONSENT_KEY);
    if (choice === "granted" || choice === "denied") return choice;
  } catch {
    /* Private browsing can block storage. */
  }
  return null;
}

function storeChoice(choice: Choice) {
  try {
    localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    /* The choice still applies to this page. */
  }
  applyAnalytics(choice === "granted");
}

function Switch({
  on,
  label,
  disabled,
  onToggle,
}: {
  on: boolean;
  label: string;
  disabled?: boolean;
  onToggle?: () => void;
}) {
  const classes = cn(
    "relative h-7 w-12 shrink-0 rounded-pill transition-colors",
    on ? "bg-blue-500" : "bg-ink-300",
  );
  const knob = (
    <span
      aria-hidden="true"
      className={cn(
        "absolute left-0 top-0.5 h-6 w-6 rounded-full bg-white shadow-soft transition-transform",
        on ? "translate-x-5" : "translate-x-0.5",
      )}
    />
  );
  if (disabled) {
    return (
      <span role="switch" aria-checked={on} aria-disabled="true" aria-label={label} className={classes}>
        {knob}
      </span>
    );
  }
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      className={classes}
    >
      {knob}
    </button>
  );
}

export function CookieConsent() {
  const titleId = useId();
  const [visible, setVisible] = useState(false);
  const [managing, setManaging] = useState(false);
  const [analyticsOn, setAnalyticsOn] = useState(false);

  useEffect(() => {
    const choice = readChoice();
    if (choice === "granted") applyAnalytics(true);
    else if (choice !== "denied") setVisible(true);
  }, []);

  useEffect(() => {
    function open() {
      setAnalyticsOn(readChoice() === "granted");
      setManaging(true);
    }
    window.addEventListener(OPEN_PREFERENCES_EVENT, open);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, open);
  }, []);

  useEffect(() => {
    if (!managing) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setManaging(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [managing]);

  function finish(choice: Choice) {
    storeChoice(choice);
    setAnalyticsOn(choice === "granted");
    setManaging(false);
    setVisible(false);
  }

  return (
    <>
      {visible && (
        <div className="fixed inset-x-0 bottom-0 z-[75] px-4 pb-4 md:px-8 md:pb-6">
          <div
            role="region"
            aria-label="Cookie notice"
            className="mx-auto flex max-w-[760px] flex-col gap-4 rounded-[24px] bg-ink px-5 py-4 text-white shadow-soft md:flex-row md:items-center md:justify-between"
          >
            <p className="text-sm text-ink-300">
              Cookies measure visits on this site. They stay off until you accept.{" "}
              <a className="text-blue-300 underline underline-offset-4" href={site.links.privacy}>
                Privacy
              </a>
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setAnalyticsOn(readChoice() === "granted");
                  setManaging(true);
                }}
              >
                Manage cookies
              </button>
              <button type="button" className="btn btn-primary" onClick={() => finish("granted")}>
                Accept cookies
              </button>
            </div>
          </div>
        </div>
      )}

      {managing && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/60 p-4 sm:items-center" data-native-cursor="">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="w-full max-w-md rounded-[24px] bg-white p-6 text-ink shadow-soft"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id={titleId} className="text-lg font-semibold tracking-tight">
                Cookie preferences
              </h2>
              <button
                type="button"
                className="rounded-full p-1 text-ink-600 hover:bg-ink/5"
                aria-label="Close cookie preferences"
                onClick={() => setManaging(false)}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <p className="mt-2 text-sm text-ink-600">
              Choose which cookies Kinocut may use. You can change this anytime from the footer.
            </p>

            <div className="mt-6 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">Strictly necessary</p>
                  <p className="mt-1 text-sm text-ink-600">Required for sign-in. Always on.</p>
                </div>
                <Switch on label="Strictly necessary" disabled />
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">Analytics</p>
                  <p className="mt-1 text-sm text-ink-600">Measures visits with Google Analytics.</p>
                </div>
                <Switch
                  on={analyticsOn}
                  label="Analytics"
                  onToggle={() => setAnalyticsOn((on) => !on)}
                />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="btn border border-ink/15 bg-white text-ink"
                onClick={() => finish("denied")}
              >
                Reject all
              </button>
              <button
                type="button"
                className="btn border border-ink/15 bg-white text-ink"
                onClick={() => finish("granted")}
              >
                Accept all
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => finish(analyticsOn ? "granted" : "denied")}
              >
                Save preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
