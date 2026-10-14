"use client";

import { useEffect, useRef } from "react";
import { scrollState } from "@/lib/scroll";
import { cn } from "@/lib/utils";

/**
 * A rAF loop keeps direction changes seamless. Scroll velocity speeds the
 * track up; scroll direction flips it. The loop pauses offscreen.
 */
export function Marquee({
  children,
  reverse = false,
  className,
  label,
}: {
  children: React.ReactNode;
  reverse?: boolean;
  className?: string;
  label?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const trackEl = track.current;
    const firstEl = first.current;
    if (!trackEl || !firstEl || reduce) return;

    let offset = 0;
    let frame = 0;
    let last = performance.now();
    let visible = true;
    let running = true;

    const tick = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (visible) {
        const gap = Number.parseFloat(getComputedStyle(trackEl).columnGap || "0") || 0;
        const loopWidth = firstEl.offsetWidth + gap;
        if (loopWidth > 0) {
          const boost = Math.min(Math.abs(scrollState.velocity) * 0.9, 420);
          const sign = (reverse ? -1 : 1) * (scrollState.direction >= 0 ? 1 : -1);
          offset -= (70 + boost) * sign * dt;
          while (offset <= -loopWidth) offset += loopWidth;
          while (offset > 0) offset -= loopWidth;
          trackEl.style.transform = `translate3d(${offset}px,0,0)`;
        }
      }
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
    });
    observer.observe(trackEl);
    frame = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [reverse]);

  return (
    <div className={cn("overflow-hidden", className)} aria-label={label}>
      <div ref={track} className="flex w-max gap-3 will-change-transform">
        <div ref={first} className="flex gap-3 pr-3">
          {children}
        </div>
        <div className="flex gap-3 pr-3" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
