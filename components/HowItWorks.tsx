"use client";

import { useLayoutEffect, useRef } from "react";
import { site } from "@/content/site";
import { registerGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { FilmHoles } from "./FilmHoles";
import { Marquee } from "./Marquee";
import { SectionHeading } from "./SectionHeading";
import { SplitText } from "./SplitText";
import { StepArt } from "./StepArt";

export function HowItWorks() {
  const pinRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = pinRef.current;
    if (!root) return;
    const { gsap, ScrollTrigger } = registerGsap();

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray<HTMLElement>(".bay-panel");
        const steps = gsap.utils.toArray<HTMLElement>(".bay-step");
        const progress = root.querySelector<HTMLElement>(".bay-progress");
        const knob = root.querySelector<HTMLElement>(".bay-knob");
        let current = 0;

        const setStep = (index: number) => {
          panels.forEach((panel, i) => panel.classList.toggle("is-active", i === index));
          steps.forEach((step, i) => step.classList.toggle("is-active", i === index));
        };
        setStep(0);

        // Pin the bay and let scroll progress both the aurora rail and the active step.
        ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: "+=1700",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: (self) => {
            const amount = Math.max(0.12, self.progress);
            if (progress) gsap.set(progress, { scaleY: amount });
            if (knob) gsap.set(knob, { top: `${amount * 100}%` });
            const next = self.progress < 0.34 ? 0 : self.progress < 0.67 ? 1 : 2;
            if (next !== current) {
              current = next;
              setStep(next);
            }
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="how" aria-labelledby="how-title" className="bg-ink text-white">
      <div ref={pinRef} className="lg:flex lg:h-[100svh] lg:flex-col lg:justify-center">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-20 md:px-8 lg:py-0">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <SectionHeading
                id="how-title"
                timecode={site.how.timecode}
                title={site.how.title}
                accent={site.how.accent}
                lede={site.how.lede}
                tone="dark"
              />
              <ol className="relative mt-10 space-y-6 pl-8">
                <span className="bay-rail" aria-hidden="true" />
                <span className="bay-progress" />
                <span className="bay-knob" aria-hidden="true" />
                {site.how.steps.map((step, index) => (
                  <li key={step.id} className={cn("bay-step", index === 0 && "is-active")}>
                    <p className="type-micro text-blue-300">{step.index}</p>
                    <h3 className="type-sub mt-1 text-white">{step.title}</h3>
                    <p className="type-body mt-2 max-w-md text-ink-300">{step.body}</p>
                    <div className="mt-5 h-56 lg:hidden">
                      <StepArt name={step.id} auto />
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <div className="relative hidden h-[460px] lg:block">
              {site.how.steps.map((step, index) => (
                <div key={step.id} className={cn("bay-panel absolute inset-0", index === 0 && "is-active")}>
                  <StepArt name={step.id} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 pb-8">
        <Marquee label="Formats we cut">
          {site.how.pills.map((pill, index) => (
            <span key={pill} className="inline-flex items-center gap-2 rounded-pill border border-white/15 bg-white/10 px-4 py-2 text-white">
              <span className={cn("h-2 w-2 rounded-sm", index % 2 ? "bg-green-300" : "bg-blue-300")} />
              <span className="type-micro">{pill}</span>
            </span>
          ))}
        </Marquee>
        <Marquee reverse label="Formats we cut, continued">
          {[...site.how.pills].reverse().map((pill, index) => (
            <span key={pill} className="inline-flex items-center gap-2 rounded-pill border border-white/15 bg-white/5 px-4 py-2 text-white">
              <span className={cn("h-2 w-2 rounded-sm", index % 2 ? "bg-blue-300" : "bg-green-300")} />
              <span className="type-micro">{pill}</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-5 pb-20 md:flex-row md:items-center md:px-8">
        <div className="flex -space-x-3">
          {site.how.founder.seats.map((seat) => (
            <span
              key={seat.label}
              title={seat.label}
              className={cn("grid h-12 w-12 place-items-center rounded-full text-xs ring-2 ring-ink", seat.className)}
              style={{ fontWeight: 680 }}
            >
              {seat.initials}
            </span>
          ))}
        </div>
        <div>
          <p className="type-micro text-green-300">{site.how.founder.kicker}</p>
          <SplitText as="p" className="type-body mt-2 max-w-2xl text-ink-300" text={site.how.founder.body} />
        </div>
      </div>
      <FilmHoles tone="dark" />
    </section>
  );
}
