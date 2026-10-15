"use client";

import { useEffect, useRef, useState } from "react";
import { formatNaira, formatPrice, site } from "@/content/site";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";
import { MagneticButton } from "./MagneticButton";
import { Waveform } from "./Waveform";

const CURRENCY_KEY = "kinocut-currency";
const RATE_URL = "https://open.er-api.com/v6/latest/USD";

type Currency = "USD" | "NGN";

export function Pricing() {
  const root = useRef<HTMLElement>(null);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [rate, setRate] = useState<number | null>(null);
  const [rateFailed, setRateFailed] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(CURRENCY_KEY) === "NGN") setCurrency("NGN");
    } catch {
      /* private mode */
    }
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

  const nairaPerDollar = rate != null && rate > 0 ? Math.round(rate) : null;
  const showNaira = currency === "NGN" && nairaPerDollar != null;

  const choose = (next: Currency) => {
    if (next === "NGN" && nairaPerDollar == null) return;
    setCurrency(next);
    try {
      sessionStorage.setItem(CURRENCY_KEY, next);
    } catch {
      /* private mode */
    }
  };

  const priceLabel = (usd: number) =>
    showNaira && nairaPerDollar != null ? formatNaira(usd * nairaPerDollar) : formatPrice(usd);

  return (
    <section ref={root} id="pricing" aria-labelledby="pricing-title" className="section-y relative overflow-hidden bg-ink-900 text-white">
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

        <div role="radiogroup" aria-label="Currency" className="mx-auto mt-6 inline-flex w-full justify-center">
          <div className="inline-flex rounded-pill border border-white/15 bg-white/5 p-1">
            <CurrencyOption pressed={!showNaira} onClick={() => choose("USD")}>
              Dollar
            </CurrencyOption>
            <CurrencyOption pressed={showNaira} disabled={nairaPerDollar == null} onClick={() => choose("NGN")}>
              Naira
            </CurrencyOption>
          </div>
        </div>
        {showNaira && nairaPerDollar != null ? (
          <p className="type-micro mt-3 text-center text-blue-300">{formatNaira(nairaPerDollar)} per $1</p>
        ) : rateFailed ? (
          <p className="type-micro mt-3 text-center text-ink-300">Naira rate unavailable. Prices shown in dollars.</p>
        ) : null}

        <div className="mt-10 grid items-stretch gap-4 lg:grid-cols-3">
          {site.pricing.plans.map((plan) => (
            <PlanCard key={plan.id} name={plan.name} price={priceLabel(plan.price)} features={plan.features} featured={plan.featured} sticker={"sticker" in plan ? plan.sticker : undefined} />
          ))}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {site.pricing.notes.map((card) => (
            <article key={card.title} className="rounded-card border border-white/10 bg-white/5 p-6">
              <h3 className="type-sub text-white">{card.title}</h3>
              <p className="type-body mt-3 text-ink-300">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CurrencyOption({
  pressed,
  disabled,
  onClick,
  children,
}: {
  pressed: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={pressed}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "type-micro rounded-pill px-4 py-2 transition-colors duration-base disabled:cursor-not-allowed disabled:opacity-40",
        pressed ? "bg-white text-ink" : "text-white",
      )}
    >
      {children}
    </button>
  );
}

function PlanCard({
  name,
  price,
  features,
  featured,
  sticker,
}: {
  name: string;
  price: string;
  features: readonly string[];
  featured: boolean;
  sticker?: string;
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
          <p className="mb-1 text-ink-300">{site.pricing.cadence}</p>
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
      <MagneticButton href={site.links.join} shine={featured ? "loop" : undefined} className="mt-8 w-full">
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

function DrawCheck() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-green-300" aria-hidden="true">
      <circle className="check-ring" cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path className="check-mark" d="M7.5 12.2 l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
