"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { site } from "@/content/site";
import { ease } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

const spans = {
  lg: "xl:col-span-2 xl:row-span-2",
  md: "xl:col-span-2",
  sm: "xl:col-span-1",
};

export function BenefitsGrid() {
  return (
    <section id="benefits" aria-labelledby="benefits-title" className="section-y bg-surface">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <SectionHeading
          id="benefits-title"
          timecode={site.benefits.timecode}
          title={site.benefits.title}
          accent={site.benefits.accent}
          lede={site.benefits.lede}
        />
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {site.benefits.items.map((item, index) => (
            <BenefitCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitCard({
  item,
  index,
}: {
  item: (typeof site.benefits.items)[number];
  index: number;
}) {
  const card = useRef<HTMLDivElement>(null);

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = card.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = event.clientX - rect.left;
    const py = event.clientY - rect.top;
    el.style.setProperty("--sx", `${px}px`);
    el.style.setProperty("--sy", `${py}px`);
    el.style.setProperty("--rx", `${(py / rect.height - 0.5) * -7}deg`);
    el.style.setProperty("--ry", `${(px / rect.width - 0.5) * 8}deg`);
  };

  const reset = () => {
    const el = card.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <motion.article
      className={cn("tilt-scene", spans[item.span])}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, delay: index * 0.06, ease }}
    >
      <div
        ref={card}
        onMouseMove={onMove}
        onMouseLeave={reset}
        className={cn(
          "tilt-card group flex h-full min-h-[220px] flex-col justify-between overflow-hidden rounded-card border border-line p-6 shadow-soft",
          item.tint === "blue" ? "bg-blue-50" : "bg-green-50",
          item.span === "lg" && "min-h-[360px]",
        )}
      >
        <Illustration name={item.visual} />
        <div className="relative z-10 mt-8">
          <h3 className="type-sub text-ink">{item.title}</h3>
          <p className="type-body mt-3 text-ink-600">{item.body}</p>
        </div>
      </div>
    </motion.article>
  );
}

function Illustration({ name }: { name: (typeof site.benefits.items)[number]["visual"] }) {
  if (name === "board") {
    return (
      <div className="relative h-28" aria-hidden="true">
        <span className="illu-shift illu-a absolute left-2 top-4 h-16 w-24 rounded-2xl border border-line bg-white shadow-soft" />
        <span className="illu-shift illu-b absolute left-16 top-8 h-16 w-28 rounded-2xl border border-line bg-blue-100 shadow-soft" />
        <span className="illu-shift illu-c absolute left-8 top-2 h-16 w-32 rounded-2xl border border-blue-200 bg-white shadow-card" />
      </div>
    );
  }
  if (name === "rate") {
    return (
      <div className="flex items-end gap-3" aria-hidden="true">
        <span className="rounded-2xl bg-ink px-4 py-3 text-3xl text-white" style={{ fontWeight: 740 }}>
          1
        </span>
        <span className="text-ink-600 line-through">× hours</span>
      </div>
    );
  }
  if (name === "clock") {
    return (
      <svg viewBox="0 0 64 64" className="h-16 w-16 text-blue-700" aria-hidden="true">
        <circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" strokeWidth="2" />
        <path className="clock-hand" d="M32 32 V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M32 32 H44" stroke="var(--green-500-hex)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (name === "trophy") {
    return (
      <svg viewBox="0 0 80 64" className="h-16 w-20 text-green-700" aria-hidden="true">
        <path d="M28 14 h24 v10 a12 12 0 0 1-24 0z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M28 18 H18 a10 10 0 0 0 10 12" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M52 18 h10 a10 10 0 0 1-10 12" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M40 36 v8 M32 50 h16" stroke="currentColor" strokeWidth="2" />
        <circle className="spark" cx="62" cy="12" r="3" fill="var(--amber-hex)" />
        <circle className="spark" cx="14" cy="10" r="2" fill="var(--blue-400-hex)" />
      </svg>
    );
  }
  if (name === "cancel") {
    return (
      <div className="flex h-12 w-24 items-center justify-end rounded-pill bg-ink px-2" aria-hidden="true">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white">
          <span className="block h-3 w-3 rounded-[3px] bg-ink" />
        </span>
      </div>
    );
  }
  return (
    <div className="relative h-16 w-28" aria-hidden="true">
      <span className="absolute left-4 top-3 h-12 w-16 rounded-xl border border-line bg-white" />
      <span className="absolute left-2 top-1 h-12 w-16 rounded-xl border border-line bg-blue-100" />
      <span className="file-lock absolute left-0 top-0 grid h-12 w-16 place-items-center rounded-xl bg-ink text-white">
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <rect x="5" y="11" width="14" height="9" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 11 V8 a4 4 0 0 1 8 0 v3" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </span>
    </div>
  );
}
