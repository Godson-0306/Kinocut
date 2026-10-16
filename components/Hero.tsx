"use client";

import { useLayoutEffect, useRef } from "react";
import { site } from "@/content/site";
import { registerGsap } from "@/lib/gsap";
import { AuroraBlob } from "./AuroraBlob";
import { EditorMockup } from "./EditorMockup";
import { HeroVideo } from "./HeroVideo";
import { MagneticButton } from "./MagneticButton";
import { Clapperboard } from "./Clapperboard";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const moveFrame = useRef(0);

  useLayoutEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
    moveFrame.current = finePointer ? 0 : -1;
    const { gsap } = registerGsap();
    const ctx = gsap.context(() => {
      // Headline reveal is CSS. This timeline only shrinks the video frame into a card.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const scroll = {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        };
        gsap.to(frameRef.current, {
          scale: 0.93,
          borderRadius: 40,
          ease: "none",
          scrollTrigger: scroll,
        });
        gsap.to(contentRef.current, {
          y: -36,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: scroll,
        });
      });
    }, sectionRef);

    return () => {
      if (moveFrame.current > 0) cancelAnimationFrame(moveFrame.current);
      ctx.revert();
    };
  }, []);

  const onMove = (event: React.MouseEvent<HTMLElement>) => {
    if (moveFrame.current) return;
    const target = event.currentTarget;
    const point = { x: event.clientX, y: event.clientY };
    moveFrame.current = requestAnimationFrame(() => {
      moveFrame.current = 0;
      const rect = target.getBoundingClientRect();
      const x = (point.x - rect.left) / rect.width - 0.5;
      const y = (point.y - rect.top) / rect.height - 0.5;
      target.style.setProperty("--mx", x.toFixed(3));
      target.style.setProperty("--my", y.toFixed(3));
    });
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative min-h-[100svh] bg-surface md:h-[140vh]"
      onMouseMove={onMove}
      onMouseLeave={(event) => {
        event.currentTarget.style.setProperty("--mx", "0");
        event.currentTarget.style.setProperty("--my", "0");
      }}
    >
      <div className="md:sticky md:top-0 md:h-[100svh] md:overflow-hidden">
        <div ref={frameRef} className="relative min-h-[100svh] w-full bg-ink md:h-full md:overflow-hidden">
          <AuroraBlob />
          <HeroVideo />
          {/* Overlay stack: ink, bottom vignette, blue-to-green duotone. Grain is global. */}
          <div className="pointer-events-none absolute inset-0 bg-ink/60" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/90 to-transparent" />
          <div className="bg-aurora pointer-events-none absolute inset-0 opacity-25 mix-blend-soft-light" />

          <div
            ref={contentRef}
            className="pointer-events-none relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1240px] flex-col px-5 pb-16 pt-24 max-md:justify-start md:h-full md:min-h-0 md:px-8 md:pb-8 md:pt-28 md:[justify-content:safe_center]"
          >
            <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1.05fr)_minmax(240px,0.82fr)] md:gap-8">
              <div className="pointer-events-auto">
                <div className="rise rise-4 mb-5 inline-flex items-center gap-2 rounded-pill border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md">
                  <span className="rec-dot" />
                  <span className="type-micro text-white">{site.hero.badge}</span>
                </div>
                <h1 className="type-display weight-in text-white">
                  <span className="line-mask">
                    <span className="hero-line block">{site.hero.line1}</span>
                  </span>
                  <span className="line-mask">
                    <span className="hero-line hero-line-delay block">
                      {site.hero.line2Before}
                      <span className="aurora-text on-dark axis-hover">{site.hero.accent}</span>.
                    </span>
                  </span>
                </h1>
                <p className="rise rise-2 type-body mt-5 max-w-md text-white/90 md:mt-6">{site.hero.support}</p>
                <p className="rise rise-2 mt-2 text-blue-100">{site.hero.subline}</p>
                <div className="rise rise-3 mt-6 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-8">
                  <MagneticButton href={site.links.start} shine>
                    {site.hero.primary}
                  </MagneticButton>
                  <MagneticButton href={site.links.book} variant="glass">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15">
                      <Clapperboard className="w-8" />
                    </span>
                    <span>
                      <span className="block text-sm">{site.hero.secondaryTitle}</span>
                      <span className="mt-1 block text-xs text-blue-100">{site.hero.secondaryMeta}</span>
                    </span>
                  </MagneticButton>
                </div>
              </div>
              <div className="pointer-events-none mt-2 md:mt-0">
                <EditorMockup />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
