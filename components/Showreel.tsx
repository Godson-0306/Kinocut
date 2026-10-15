"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { site } from "@/content/site";
import { registerGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { SectionHeading } from "./SectionHeading";

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

export function Showreel() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [canPlay, setCanPlay] = useState(false);
  const [hoverCapable, setHoverCapable] = useState(false);
  const [watching, setWatching] = useState<(typeof site.showreel.reels)[number] | null>(null);

  useEffect(() => {
    if (!watching) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setWatching(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [watching]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    const saveData = Boolean(connection?.saveData || connection?.effectiveType === "2g" || connection?.effectiveType === "slow-2g");
    setHoverCapable(hover);
    setCanPlay(!reduce && !saveData);
  }, []);

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
              <ReelCard
                key={reel.id}
                reel={reel}
                active={activeId === reel.id}
                canPlay={canPlay}
                hoverCapable={hoverCapable}
                onPlay={() => setActiveId(reel.id)}
                onStop={() => setActiveId((current) => (current === reel.id ? null : current))}
                onWatch={() => {
                  setActiveId(null);
                  setWatching(reel);
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[1100px] px-5 pb-24 md:px-8">
        <BeforeAfterSlider />
      </div>
      {watching ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink-950/85 p-4 md:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={`${watching.client}, ${watching.title}`}
          onClick={() => setWatching(null)}
        >
          <div className="w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between gap-4 text-white">
              <p className="type-micro">
                {watching.client} · {watching.title}
              </p>
              <button type="button" className="grid h-11 w-11 place-items-center rounded-full border border-white/20" aria-label="Close video" onClick={() => setWatching(null)}>
                <X />
              </button>
            </div>
            <video className="max-h-[78svh] w-full rounded-card bg-black" src={watching.full} poster={watching.poster} controls autoPlay playsInline preload="auto" />
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ReelCard({
  reel,
  active,
  canPlay,
  hoverCapable,
  onPlay,
  onStop,
  onWatch,
}: {
  reel: (typeof site.showreel.reels)[number];
  active: boolean;
  canPlay: boolean;
  hoverCapable: boolean;
  onPlay: () => void;
  onStop: () => void;
  onWatch: () => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const src = "src" in reel ? reel.src : "";
  const playable = Boolean(src) && canPlay && !failed;

  useEffect(() => {
    const el = video.current;
    if (!el || !active) return;
    el.play().catch(() => setFailed(true));
  }, [active]);

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`Watch ${reel.client}, ${reel.title}`}
      data-cursor={playable ? "play" : "hover"}
      className={cn(
        "group relative shrink-0 cursor-pointer overflow-hidden rounded-card bg-ink shadow-soft",
        reel.aspect === "tall" ? "h-[460px] w-[260px]" : "h-[320px] w-[520px]",
      )}
      onPointerDown={(event) => event.stopPropagation()}
      onMouseEnter={() => {
        if (playable && hoverCapable) onPlay();
      }}
      onMouseLeave={() => {
        if (hoverCapable) onStop();
      }}
      onClick={onWatch}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onWatch();
        }
      }}
    >
      <Image src={reel.poster} alt="" fill className="object-cover transition-transform duration-slow group-hover:scale-[1.04]" sizes={reel.aspect === "tall" ? "260px" : "520px"} />
      {playable && active ? (
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          muted
          loop
          playsInline
          preload="none"
          autoPlay
          onError={() => setFailed(true)}
        />
      ) : null}
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
