"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { formatNaira, formatPrice, site } from "@/content/site";
import { startScroll, stopScroll } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";
import { MagneticButton } from "./MagneticButton";
import { Waveform } from "./Waveform";

const RATE_URL = "https://open.er-api.com/v6/latest/USD";

export function Pricing() {
  const root = useRef<HTMLElement>(null);
  const [inNigeria, setInNigeria] = useState(false);
  const [rate, setRate] = useState<number | null>(null);
  const [rateFailed, setRateFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/currency")
      .then((response) => {
        if (!response.ok) throw new Error("currency");
        return response.json();
      })
      .then((data: { currency?: string }) => {
        if (!cancelled && data.currency === "NGN") setInNigeria(true);
      })
      .catch(() => {
        /* stay on dollars */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(RATE_URL)
      .then((response) => {
        if (!response.ok) throw new Error("rate");
        return response.json();
      })
      .then((data: { rates?: { NGN?: number } }) => {
        const next = data.rates?.NGN;
        if (cancelled) return;
        if (typeof next === "number" && next > 0) setRate(next);
        else setRateFailed(true);
      })
      .catch(() => {
        if (!cancelled) setRateFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        el.querySelectorAll(".plan-features").forEach((list) => list.classList.add("is-drawn"));
        observer.disconnect();
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [openPlan, setOpenPlan] = useState<(typeof site.pricing.plans)[number]["id"] | null>(null);
  const nairaPerDollar = rate != null && rate > 0 ? Math.round(rate) : null;
  const showNaira = inNigeria && nairaPerDollar != null;
  const rateBlocked = inNigeria && rateFailed;

  const priceLabel = (usd: number) =>
    showNaira && nairaPerDollar != null ? formatNaira(usd * nairaPerDollar) : formatPrice(usd);

  const selected = openPlan ? site.pricing.plans.find((plan) => plan.id === openPlan) : undefined;

  return (
    <section ref={root} id="pricing" aria-labelledby="pricing-title" className="section-y relative scroll-mt-28 overflow-hidden bg-ink-900 text-white">
      <Waveform bars={64} className="pointer-events-none absolute left-0 right-0 top-1/2 h-24 -translate-y-1/2 text-blue-300/30" />
      <div className="relative mx-auto max-w-[1100px] px-5 md:px-8">
        <SectionHeading
          id="pricing-title"
          timecode={site.pricing.timecode}
          title={site.pricing.title}
          accent={site.pricing.accent}
          lede={site.pricing.lede}
          tone="dark"
          className="mx-auto text-center"
        />
        <p className="type-micro mt-6 text-center text-blue-300">{site.pricing.slots}</p>

        {showNaira && nairaPerDollar != null ? (
          <p className="type-micro mt-6 text-center text-blue-300">{formatNaira(nairaPerDollar)} per $1</p>
        ) : inNigeria && rateFailed ? (
          <p className="type-micro mt-6 text-center text-ink-300">Naira rate unavailable. Prices shown in dollars.</p>
        ) : null}

        <div className="mt-10 grid items-stretch gap-4 lg:grid-cols-3">
          {site.pricing.plans.map((plan) => (
            <PlanCard
              key={plan.id}
              name={plan.name}
              price={priceLabel(plan.price)}
              cadence={site.pricing.cadence}
              features={plan.features}
              featured={plan.featured}
              sticker={"sticker" in plan ? plan.sticker : undefined}
              onJoin={() => setOpenPlan(plan.id)}
            />
          ))}
        </div>

        <div className="mt-8 grid items-stretch gap-4 md:grid-cols-2">
          {site.pricing.notes.map((card) => (
            <article key={card.title} className="flex h-full flex-col rounded-card border border-white/10 bg-white/5 p-6">
              <h3 className="type-sub text-white">{card.title}</h3>
              <ul className="mt-5 grid gap-3.5">
                {card.points.map((point, index) => (
                  <li key={point} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-[0.45rem] h-2 w-2 shrink-0 rotate-45 ring-4",
                        index % 2 === 0 ? "bg-blue-500 ring-blue-500/25" : "bg-green-300 ring-green-300/20",
                      )}
                    />
                    <span className="text-sm leading-relaxed text-ink-300">{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
      {selected ? (
        <JoinDialog
          planId={selected.id}
          name={selected.name}
          price={priceLabel(selected.price)}
          blocked={rateBlocked}
          onClose={() => setOpenPlan(null)}
        />
      ) : null}
    </section>
  );
}

function PlanCard({
  name,
  price,
  cadence,
  features,
  featured,
  sticker,
  onJoin,
}: {
  name: string;
  price: string;
  cadence?: string;
  features: readonly string[];
  featured: boolean;
  sticker?: string;
  onJoin: () => void;
}) {
  const article = (
    <article className={cn("relative flex h-full flex-col px-6 py-8", featured ? "rounded-[38px] bg-ink-900" : "rounded-panel border border-white/10 bg-white/5")}>
      {sticker ? (
        <span className="sticker type-micro absolute right-4 top-6 bg-amber px-3 py-2 text-ink shadow-soft">{sticker}</span>
      ) : null}
      <p className={cn("type-micro text-blue-300", sticker && "pr-24")}>{name}</p>
      <div className="mt-4 min-w-0 [container-type:inline-size]">
        <div className={cn("flex flex-wrap items-end gap-x-2 gap-y-1", sticker && "pr-24")}>
          <p
            className={cn(
              "min-w-0 max-w-full font-display font-[740] leading-[0.94] tracking-[-0.04em] text-white",
              price.startsWith("₦")
                ? "text-[clamp(1.15rem,10.5cqi,2.05rem)] [font-variation-settings:'opsz'_96,'wdth'_90,'wght'_740]"
                : "text-[clamp(2rem,15cqi,3.25rem)] [font-variation-settings:'opsz'_96,'wdth'_100,'wght'_740]",
            )}
          >
            {price}
          </p>
          {cadence ? <p className="mb-1 text-ink-300">{cadence}</p> : null}
        </div>
      </div>
      <ul className="plan-features mt-6 grid flex-1 gap-3">
        {features.map((feature, index) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-white" style={{ ["--d" as string]: `${index * 0.06}s` }}>
            <DrawCheck />
            <span className="pt-0.5">{feature}</span>
          </li>
        ))}
      </ul>
      <MagneticButton onClick={onJoin} shine={featured ? "loop" : undefined} className="mt-8 w-full">
        {site.pricing.cta}
      </MagneticButton>
    </article>
  );

  if (!featured) return article;

  return (
    <div className="relative h-full">
      <div className="pricing-glow bg-aurora pointer-events-none absolute -inset-6 -z-10 rounded-full blur-3xl" />
      <div className="relative h-full overflow-hidden rounded-panel p-[2px]">
        <div className="spin-slow bg-aurora absolute left-1/2 top-1/2 h-[220%] w-[220%]" aria-hidden="true" />
        {article}
      </div>
    </div>
  );
}

function JoinDialog({
  planId,
  name,
  price,
  blocked,
  onClose,
}: {
  planId: (typeof site.pricing.plans)[number]["id"];
  name: string;
  price: string;
  blocked: boolean;
  onClose: () => void;
}) {
  const nameRef = useRef<HTMLInputElement>(null);
  const onCloseRef = useRef(onClose);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  onCloseRef.current = onClose;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    stopScroll();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    nameRef.current?.focus();
    return () => {
      startScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [mounted]);

  if (!mounted) return null;

  const dialog = (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink-950/85 p-4 md:p-10" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="join-title"
        data-native-cursor=""
        className="w-full max-w-md rounded-panel bg-white p-8 text-ink shadow-card"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="type-micro text-blue-700">{name}</p>
        <h2 id="join-title" className="type-sub mt-3">
          {site.pricing.cta}
        </h2>
        <p className="type-body mt-3 text-ink-600">
          {price} {site.pricing.cadence}. The charge renews each month until you cancel it in Flutterwave.
        </p>
        {blocked ? (
          <p className="type-body mt-6 text-ink-600">Naira rate unavailable. Prices shown in dollars.</p>
        ) : (
          <form
            className="mt-8 space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              if (pending) return;
              const form = new FormData(event.currentTarget);
              setPending(true);
              setError("");
              try {
                const response = await fetch("/api/checkout", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    plan: planId,
                    name: form.get("name"),
                    email: form.get("email"),
                  }),
                });
                const data = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;
                if (response.ok && data?.url) {
                  window.location.assign(data.url);
                  return;
                }
                setError(data?.error === "rate" ? "Naira rate unavailable. Prices shown in dollars." : "Checkout could not start. Try again in a moment.");
              } catch {
                setError("Checkout could not start. Try again in a moment.");
              }
              setPending(false);
            }}
          >
            <label className="block">
              <span className="type-micro text-blue-700">Name</span>
              <input ref={nameRef} className="field mt-2" name="name" autoComplete="name" required maxLength={80} placeholder="Your name" />
            </label>
            <label className="block">
              <span className="type-micro text-blue-700">Email</span>
              <input className="field mt-2" type="email" name="email" autoComplete="email" required maxLength={120} placeholder="you@studio.com" />
            </label>
            {error ? <p className="text-sm text-ink-600">{error}</p> : null}
            <MagneticButton type="submit" className={cn("w-full", pending && "pointer-events-none opacity-70")}>
              {pending ? "Starting checkout" : "Continue"}
            </MagneticButton>
          </form>
        )}
        <button type="button" className="type-micro mt-4 text-blue-700" data-cursor="hover" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}

function DrawCheck() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-green-300" aria-hidden="true">
      <circle className="check-ring" cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path className="check-mark" d="M7.5 12.2 l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
