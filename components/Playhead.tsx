"use client";

import { useEffect, useRef } from "react";
import { subscribeScroll } from "@/lib/scroll";
import { formatTimecode } from "@/lib/timecode";

/**
 * Scroll progress is written straight to the DOM so the playhead
 * does not re-render the page on every frame.
 */
export function Playhead() {
  const fill = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const apply = (y: number) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      const top = `${progress * 100}%`;
      if (fill.current) fill.current.style.transform = `scaleY(${progress})`;
      if (knob.current) knob.current.style.top = top;
      if (tag.current) tag.current.style.top = top;
      if (label.current) {
        const next = formatTimecode(progress);
        if (label.current.textContent !== next) label.current.textContent = next;
      }
    };

    apply(window.scrollY);
    return subscribeScroll((state) => apply(state.y));
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-12 right-3 top-12 z-30 hidden lg:block" aria-hidden="true">
      <div className="relative h-full w-28">
        <div className="absolute inset-y-0 right-2 w-px bg-white/40 mix-blend-difference" />
        <div ref={fill} className="absolute inset-y-0 right-2 w-px origin-top bg-aurora" />
        <div ref={knob} className="absolute right-2 top-0 -translate-y-1/2 translate-x-1/2">
          <span className="block h-3 w-3 rotate-45 bg-white mix-blend-difference" />
        </div>
        <div ref={tag} className="absolute right-6 top-0 -translate-y-1/2">
          <span ref={label} className="type-micro block rounded-pill bg-ink px-2 py-1 text-white shadow-soft">
            00:00:00:00
          </span>
        </div>
      </div>
    </div>
  );
}
