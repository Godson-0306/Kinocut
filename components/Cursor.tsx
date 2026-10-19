"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isDeskPath } from "@/lib/desk-frame";

type Mode = "default" | "hover" | "play" | "drag";

/**
 * One playhead, written on pointermove. No trailing ring and no animation
 * frame loop, so the cursor stays locked to the pointer.
 */
function nativeCursorPage(pathname: string) {
  return pathname === "/login" || pathname.startsWith("/checkout/return") || isDeskPath(pathname);
}

export function Cursor() {
  const pathname = usePathname();
  const head = useRef<HTMLDivElement>(null);
  const scale = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  useEffect(() => {
    const sync = () => setSignupOpen(document.querySelector("[data-native-cursor]") != null);
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine) and (hover: hover)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const on = fine.matches && !reduce.matches && !nativeCursorPage(pathname) && !signupOpen;
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
  }, [pathname, signupOpen]);

  useEffect(() => {
    if (!enabled) return;
    const el = head.current;
    if (!el) return;

    let mode: Mode = "default";
    let shown = false;
    const applyMode = (next: Mode) => {
      if (next === mode) return;
      mode = next;
      const scaleEl = scale.current;
      const labelEl = label.current;
      if (scaleEl) scaleEl.style.transform = next === "hover" ? "scale(1.2)" : "scale(1)";
      if (labelEl) {
        const text = next === "play" ? "Play" : next === "drag" ? "Drag" : "";
        labelEl.textContent = text;
        labelEl.style.opacity = text ? "1" : "0";
      }
    };

    const onMove = (event: PointerEvent) => {
      if (!shown) {
        shown = true;
        el.style.opacity = "1";
      }
      el.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest) return;
      const marked = target.closest("[data-cursor]");
      const next = (marked?.getAttribute("data-cursor") as Mode | null) || (target.closest("a, button, [role='button']") ? "hover" : "default");
      applyMode(next);
    };

    const hide = () => {
      shown = false;
      el.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
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
      <div ref={scale} className="origin-top-left transition-transform duration-150 ease-out" style={{ transform: "scale(1)" }}>
        <span className="cursor-diamond" />
        <span className="cursor-stem" style={{ height: 22 }} />
        <span ref={label} className="cursor-label type-micro absolute left-3 top-3 whitespace-nowrap opacity-0" />
      </div>
    </div>
  );
}
