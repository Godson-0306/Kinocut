"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "default" | "hover" | "play" | "drag";

/**
 * One playhead, written on pointermove. No trailing ring and no animation
 * frame loop, so the cursor stays locked to the pointer.
 */
export function Cursor() {
  const head = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("default");

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (hover: hover)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const on = fine.matches && !reduce.matches;
      setEnabled(on);
      document.documentElement.classList.toggle("has-custom-cursor", on);
    };
    update();
    fine.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const el = head.current;
    if (!el) return;

    const onMove = (event: PointerEvent) => {
      el.style.opacity = "1";
      el.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest) return;
      const marked = target.closest("[data-cursor]");
      const next = (marked?.getAttribute("data-cursor") as Mode | null) || (target.closest("a, button") ? "hover" : "default");
      setMode((current) => (current === next ? current : next));
    };

    const hide = () => {
      el.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", hide);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", hide);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={head} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[80] opacity-0">
      <span className="absolute left-0 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-white mix-blend-difference" />
      <span
        className="absolute left-0 top-1 w-px -translate-x-1/2 bg-white mix-blend-difference"
        style={{ height: mode === "default" ? 22 : 34 }}
      />
      {mode === "play" || mode === "drag" ? (
        <span className="type-micro absolute left-3 top-3 whitespace-nowrap text-white mix-blend-difference">
          {mode === "play" ? "Play" : "Drag"}
        </span>
      ) : null}
    </div>
  );
}
