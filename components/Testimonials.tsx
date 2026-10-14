"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/content/site";
import { ease } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { SectionHeading } from "./SectionHeading";

const DWELL = 6400;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = usePrefersReducedMotion();
  const quote = site.proof.quotes[index];

  useEffect(() => {
    if (reduce || paused) return;
    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % site.proof.quotes.length);
    }, DWELL);
    return () => window.clearTimeout(timer);
  }, [index, paused, reduce]);

  return (
    <section id="proof" aria-labelledby="proof-title" className="section-y bg-green-500 text-white">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <SectionHeading
          id="proof-title"
          timecode={site.proof.timecode}
          title={site.proof.title}
          accent={site.proof.accent}
          lede={site.proof.lede}
          tone="green"
        />

        <div
          className="mt-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="mb-6 h-px overflow-hidden bg-white/25">
            {reduce || paused ? (
              <span className="block h-full w-full origin-left bg-white" style={{ transform: `scaleX(${(index + 1) / site.proof.quotes.length})` }} />
            ) : (
              <span key={index} className="quote-progress block h-full w-full bg-white" style={{ animationDuration: `${DWELL}ms` }} />
            )}
          </div>
          <div className="relative min-h-[280px] md:min-h-[240px]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={quote.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease }}
              >
                <p className="type-display-sm max-w-4xl">
                  {quote.quote.split(" ").map((word, wordIndex) => (
                    <span key={`${quote.name}-${wordIndex}`} className="inline-block overflow-hidden align-bottom">
                      <motion.span
                        className="inline-block pr-[0.28em]"
                        initial={{ y: "110%" }}
                        animate={{ y: "0%" }}
                        transition={{ duration: 0.55, delay: wordIndex * 0.025, ease }}
                      >
                        {word}
                      </motion.span>
                    </span>
                  ))}
                </p>
                <footer className="mt-8">
                  <p className="text-xl" style={{ fontWeight: 650 }}>
                    {quote.name}
                  </p>
                  <p className="type-micro mt-2 text-green-50">{quote.role}</p>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>
          <div className="mt-6 flex gap-2" role="tablist" aria-label="Quotes">
            {site.proof.quotes.map((item, itemIndex) => (
              <button
                key={item.name}
                type="button"
                role="tab"
                aria-selected={itemIndex === index}
                aria-label={`Show quote from ${item.name}`}
                className={`h-2.5 rounded-full transition-all duration-base ${itemIndex === index ? "w-8 bg-white" : "w-2.5 bg-white/40"}`}
                onClick={() => setIndex(itemIndex)}
              />
            ))}
          </div>
        </div>

        <dl className="mt-16 grid gap-8 border-t border-white/20 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {site.proof.stats.map((stat) => (
            <div key={stat.label}>
              <dt className="type-micro text-green-50">{stat.label}</dt>
              <dd className="type-display-sm mt-2">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </dd>
            </div>
          ))}
        </dl>
        <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-5 md:grid-cols-5">
          {site.logos.brands.map((brand) => (
            <li key={brand.name} className="group relative text-xl tracking-[-0.04em] text-white/90" style={{ fontWeight: 680 }}>
              {"href" in brand ? (
                <a href={brand.href} target="_blank" rel="noreferrer" className="transition-colors duration-base hover:text-white">
                  {brand.name}
                </a>
              ) : (
                brand.name
              )}
              <span className="bg-aurora-light absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-base group-hover:scale-x-100" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const [node, setNode] = useState<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!node) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1100);
          const eased = 1 - Math.pow(1 - t, 4);
          setDisplay(Math.round(value * eased));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [node, value]);

  return (
    <span ref={setNode}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
