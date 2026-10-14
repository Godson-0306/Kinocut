"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./SectionHeading";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-labelledby="faq-title" className="section-y bg-surface">
      <div className="mx-auto grid max-w-[1100px] gap-12 px-5 md:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading
          id="faq-title"
          timecode={site.faq.timecode}
          title={site.faq.title}
          accent={site.faq.accent}
          lede={site.faq.lede}
        />
        <div className="divide-y divide-line border-y border-line">
          {site.faq.items.map((item, index) => {
            const expanded = open === index;
            const panelId = `faq-panel-${index}`;
            const buttonId = `faq-button-${index}`;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => setOpen(expanded ? null : index)}
                  >
                    <span className="text-lg text-ink" style={{ fontWeight: 620 }}>
                      {item.q}
                    </span>
                    <Plus className={cn("h-5 w-5 shrink-0 text-blue-500 transition-transform duration-base ease-signature", expanded && "rotate-45")} aria-hidden="true" />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!expanded}
                  className={cn("grid transition-all duration-base ease-signature", expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="type-body measure pb-5 text-ink-600">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
