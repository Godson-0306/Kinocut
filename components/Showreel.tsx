"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { site } from "@/content/site";
import { registerGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { SectionHeading } from "./SectionHeading";

export function Showreel() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;
    const { gsap } = registerGsap();
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const tween = gsap.to(track, {
          x: () => -(track.scrollWidth - pin.clientWidth + 48),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${Math.max(track.scrollWidth - pin.clientWidth, 1)}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              progress.current = self.progress;
            },
          },
        });

        let dragging = false;
        let startX = 0;
        let startScroll = 0;
        const onDown = (event: PointerEvent) => {
          const trigger = tween.scrollTrigger;
          if (!trigger) return;
          dragging = true;
          startX = event.clientX;
          startScroll = trigger.scroll();
          pin.setPointerCapture(event.pointerId);
        };
        const onMove = (event: PointerEvent) => {
          const trigger = tween.scrollTrigger;
          if (!dragging || !trigger) return;
          const width = Math.max(track.scrollWidth - pin.clientWidth, 1);
          const span = trigger.end - trigger.start;
          trigger.scroll(startScroll - ((event.clientX - startX) / width) * span);
        };
        const onUp = () => {
          dragging = false;
        };
        pin.addEventListener("pointerdown", onDown);
        pin.addEventListener("pointermove", onMove);
        pin.addEventListener("pointerup", onUp);
        return () => {
          pin.removeEventListener("pointerdown", onDown);
          pin.removeEventListener("pointermove", onMove);
          pin.removeEventListener("pointerup", onUp);
        };
      });
    }, pin);
    return () => ctx.revert();
  }, []);

  const nudge = (direction: number) => {
    const scroller = document.getElementById("reel-scroller");
    if (window.innerWidth < 1024 && scroller) {
      scroller.scrollBy({ left: direction * scroller.clientWidth * 0.8, behavior: "smooth" });
      return;
    }
    window.scrollBy({ top: direction * window.innerHeight * 0.45, behavior: "smooth" });
  };

  return (
    <section id="work" aria-labelledby="work-title" className="dot-grid bg-paper">
      <div ref={pinRef} className="flex min-h-[100svh] flex-col justify-center overflow-x-hidden py-20 lg:h-[100svh] lg:overflow-hidden lg:py-0">
        <div className="mx-auto mb-8 flex w-full max-w-[1400px] items-end justify-between gap-6 px-5 md:px-8">
          <SectionHeading
            id="work-title"
            timecode={site.showreel.timecode}
            title={site.showreel.title}
            accent={site.showreel.accent}
            lede={site.showreel.lede}
          />
          <div className="hidden gap-2 sm:flex">
            <button type="button" className="grid h-12 w-12 place-items-center rounded-full border border-line bg-white" aria-label="Previous cut" onClick={() => nudge(-1)}>
              <ArrowLeft />
            </button>
            <button type="button" className="grid h-12 w-12 place-items-center rounded-full border border-line bg-white" aria-label="Next cut" onClick={() => nudge(1)}>
              <ArrowRight />
            </button>
          </div>
        </div>
        <p className="type-micro mx-auto mb-4 w-full max-w-[1400px] px-5 text-blue-700 md:px-8">{site.showreel.note}</p>
        <div id="reel-scroller" className="overflow-x-auto lg:overflow-hidden" data-cursor="drag">
          <div ref={trackRef} className="flex w-max items-center gap-5 px-5 pb-4 md:px-8">
            {site.showreel.reels.map((reel) => (
              <ReelCard key={reel.id} reel={reel} />
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1100px] px-5 pb-24 md:px-8">
        <BeforeAfterSlider />
      </div>
    </section>
  );
}

function ReelCard({ reel }: { reel: (typeof site.showreel.reels)[number] }) {
  const video = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  return (
    <article
      data-cursor="play"
      className={cn(
        "group relative shrink-0 overflow-hidden rounded-card bg-ink shadow-soft",
        reel.aspect === "tall" ? "h-[460px] w-[260px]" : "h-[320px] w-[520px]",
      )}
      onMouseEnter={() => video.current?.play().catch(() => undefined)}
      onMouseLeave={() => {
        if (!video.current) return;
        video.current.pause();
        video.current.currentTime = 0;
      }}
    >
      <Image src={reel.poster} alt="" fill className="object-cover transition-transform duration-slow group-hover:scale-[1.04]" sizes={reel.aspect === "tall" ? "260px" : "520px"} />
      {failed ? null : (
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-base group-hover:opacity-100"
          muted
          loop
          playsInline
          preload="none"
          poster={reel.poster}
          onError={() => setFailed(true)}
        >
          <source src={reel.src} type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-ink-950/20" />
      <p className="type-micro absolute left-4 top-4 text-blue-100">{reel.timecode}</p>
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <p className="type-micro text-green-100">{reel.category}</p>
        <h3 className="mt-1 text-2xl tracking-[-0.03em]" style={{ fontWeight: 680 }}>
          {reel.client}
        </h3>
        <p className="text-sm text-white/80">{reel.title}</p>
      </div>
    </article>
  );
}
