"use client";

import { useEffect, useRef } from "react";
import { formatPrice, site } from "@/content/site";
import { SectionHeading } from "./SectionHeading";
import { MagneticButton } from "./MagneticButton";
import { Waveform } from "./Waveform";

export function Pricing() {
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = list.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        el.classList.add("is-drawn");
        observer.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="section-y relative overflow-hidden bg-ink-900 text-white">
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

        <div className="relative mx-auto mt-12 max-w-3xl">
          <div className="pricing-glow bg-aurora pointer-events-none absolute -inset-8 -z-10 rounded-full blur-3xl" />
          <div className="relative overflow-hidden rounded-panel p-[2px]">
            <div className="spin-slow bg-aurora absolute left-1/2 top-1/2 h-[220%] w-[220%]" aria-hidden="true" />
            <article className="relative rounded-[38px] bg-ink-900 px-6 py-8 md:px-10 md:py-12">
              <span className="sticker type-micro absolute right-4 top-6 bg-amber px-3 py-2 text-ink shadow-soft md:right-8 md:top-8">
                {site.pricing.sticker}
              </span>
              <p className="type-micro text-blue-300">{site.pricing.slots}</p>
              <div className="mt-6 flex flex-wrap items-end gap-4">
                <p className="type-display text-white">{formatPrice(site.pricing.price)}</p>
                <p className="mb-3 text-ink-300 line-through">{formatPrice(site.pricing.compareAt)}</p>
                <p className="mb-3 text-ink-300">{site.pricing.cadence}</p>
              </div>
              <ul ref={list} className="mt-8 grid gap-3 sm:grid-cols-2">
                {site.pricing.features.map((feature, index) => (
                  <li key={feature} className="flex items-start gap-3 text-white" style={{ ["--d" as string]: `${index * 0.06}s` }}>
                    <DrawCheck />
                    <span className="pt-0.5">{feature}</span>
                  </li>
                ))}
              </ul>
              <MagneticButton href={site.links.join} shine="loop" className="mt-10 w-full sm:w-auto">
                {site.pricing.cta}
              </MagneticButton>
            </article>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {site.pricing.reassurances.map((card) => (
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

function DrawCheck() {
  return (
    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 shrink-0 text-green-300" aria-hidden="true">
      <circle className="check-ring" cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path className="check-mark" d="M7.5 12.2 l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
