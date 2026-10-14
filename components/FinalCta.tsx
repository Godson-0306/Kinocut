"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { AuroraBlob } from "./AuroraBlob";
import { Clapperboard } from "./Clapperboard";
import { MagneticButton } from "./MagneticButton";
import { Timecode } from "./Timecode";

export function FinalCta() {
  const frame = useRef<HTMLDivElement>(null);
  const [shut, setShut] = useState(false);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShut(true);
        observer.disconnect();
      },
      { threshold: 0.45 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="book" aria-labelledby="book-title" className="relative overflow-hidden bg-blue-500 text-white">
      <AuroraBlob />
      <div className="mesh-grid pointer-events-none absolute inset-0" />
      <div className="section-y relative mx-auto grid max-w-[1200px] items-center gap-12 px-5 md:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Timecode value={site.final.timecode} className="text-white" />
          <div ref={frame} className="mt-6 w-36">
            <Clapperboard shut={shut} />
          </div>
          <h2 id="book-title" className="type-display mt-6">
            <span className="block">{site.final.line1}</span>
            <span className="block">
              We&apos;ll bring the <span className="aurora-text on-field axis-hover">{site.final.accent}</span>.
            </span>
          </h2>
          <p className="type-body measure mt-6 text-white/90">{site.final.lede}</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <MagneticButton href={site.links.calendar} variant="inverted" shine external>
              {site.final.cta}
            </MagneticButton>
            <a href={site.links.email} className="type-micro text-blue-50 underline-offset-4 hover:underline">
              {site.final.emailLabel}
            </a>
          </div>
        </div>
        <div className="rounded-panel border border-white/20 bg-white/10 p-5 backdrop-blur-md md:p-7">
          <p className="type-micro text-blue-50">Calendar</p>
          <p className="mt-3 text-white/85">{site.final.calendarNote}</p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {site.final.slots.map((slot) => (
              <a
                key={slot}
                href={site.links.calendar}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-white px-3 py-4 text-center text-ink"
              >
                {slot}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
