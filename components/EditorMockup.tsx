"use client";

import { useLayoutEffect, useRef } from "react";
import { registerGsap } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { Waveform } from "./Waveform";

const clips = [
  { label: "A-roll", className: "w-[28%] bg-blue-500" },
  { label: "B-roll", className: "w-[18%] bg-green-500" },
  { label: "Titles", className: "w-[22%] bg-blue-300 text-ink" },
  { label: "End card", className: "w-[16%] bg-white/25" },
];

export function EditorMockup() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const { gsap } = registerGsap();
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ paused: true });
      timeline
        .from(".clip", { x: -28, opacity: 0, stagger: 0.06, duration: 0.6, ease: "signature" })
        .from(".float-card", { y: 18, opacity: 0, stagger: 0.08, duration: 0.55, ease: "signature" }, 0.15)
        .from(".program-monitor", { opacity: 0, duration: 0.45 }, 0);
      const stop = onIntroDone(() => timeline.play());
      return () => stop();
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="relative" style={{ perspective: "1100px" }}>
      <div className="float-y absolute left-3 top-20 hidden lg:block">
        <div className="parallax-1">
          <article className="float-card w-44 rounded-card border border-white/20 bg-white/10 p-3 text-white shadow-card backdrop-blur-md">
            <p className="type-micro text-blue-300">Captions</p>
            <p className="mt-2 text-sm leading-snug">and that is the line people replay</p>
          </article>
        </div>
      </div>
      <div className="float-y absolute right-3 top-24 hidden lg:block" style={{ animationDelay: "-2s" }}>
        <div className="parallax-2">
          <article className="float-card w-40 rounded-card border border-white/20 bg-white/10 p-3 text-white shadow-card backdrop-blur-md">
            <p className="type-micro text-green-300">Grade</p>
            <div className="mt-3 flex gap-2">
              <span className="h-8 flex-1 rounded-lg bg-ink-600" />
              <span className="h-8 flex-1 rounded-lg bg-aurora" />
            </div>
          </article>
        </div>
      </div>
      <div className="float-y absolute bottom-48 left-4 hidden xl:block" style={{ animationDelay: "-3.4s" }}>
        <div className="parallax-3">
          <article className="float-card w-40 rounded-card border border-white/20 bg-white/10 p-3 text-white shadow-card backdrop-blur-md">
            <p className="type-micro text-blue-300">Master</p>
            <p className="mt-2 text-sm">Ready · 4K</p>
          </article>
        </div>
      </div>

      <div className="hero-tilt rounded-panel border border-white/20 bg-white/10 p-3 shadow-glow backdrop-blur-xl">
        <header className="flex items-center justify-between px-2 py-1.5">
          <div className="flex items-center gap-2">
            <span className="rec-dot" />
            <span className="type-micro text-white/80">Seq 01 · Bay</span>
          </div>
          <span className="type-micro text-blue-300">00:00:04:12</span>
        </header>
        <div className="program-monitor relative mt-2 aspect-video overflow-hidden rounded-[20px] bg-ink-950/70">
          <div className="absolute inset-0 bg-aurora opacity-50" />
          <p className="type-micro absolute left-3 top-3 text-white">Program</p>
          <Waveform bars={36} className="absolute bottom-3 left-3 right-3 text-white/85" />
        </div>
        <div className="timeline-track relative mt-3 px-1 pb-2">
          <div className="mb-2 flex justify-between text-blue-100">
            {["00:00", "00:15", "00:30", "00:45"].map((mark) => (
              <span key={mark} className="type-micro">
                {mark}
              </span>
            ))}
          </div>
          <div className="mb-1.5 flex h-8 gap-1">
            {clips.map((clip) => (
              <div
                key={clip.label}
                className={`clip flex items-center overflow-hidden rounded-lg px-2 text-[10px] uppercase tracking-[0.08em] text-white ${clip.className}`}
              >
                {clip.label}
              </div>
            ))}
          </div>
          <Waveform bars={42} className="h-7 text-green-300" />
          <div className="playhead-loop pointer-events-none absolute bottom-2 top-7 w-px bg-white">
            <span className="absolute -left-1 -top-1 h-2.5 w-2.5 rounded-full bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
