"use client";

import { useEffect } from "react";
import { registerGsap } from "@/lib/gsap";
import { INTRO_EVENT } from "@/lib/intro";
import { emitScroll, setScrollController } from "@/lib/scroll";

export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let destroyed = false;
    let cleanup = () => {};

    (async () => {
      const Lenis = (await import("lenis")).default;
      await import("lenis/dist/lenis.css");
      if (destroyed) return;

      const { gsap, ScrollTrigger } = registerGsap();
      const lenis = new Lenis({
        lerp: reduce ? 1 : 0.2,
        smoothWheel: !reduce,
        anchors: true,
      });

      const onScroll = () => {
        emitScroll({
          y: lenis.scroll,
          velocity: lenis.velocity,
          direction: lenis.direction,
        });
        ScrollTrigger.update();
      };
      lenis.on("scroll", onScroll);

      const raf = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(raf);

      setScrollController({
        to: (target) => lenis.scrollTo(target, { duration: reduce ? 0 : 1.1 }),
        stop: () => lenis.stop(),
        start: () => lenis.start(),
      });

      const isHome = window.location.pathname === "/";
      const waiting = isHome && document.documentElement.dataset.intro === "play";
      const start = () => lenis.start();
      if (waiting) {
        lenis.stop();
        window.addEventListener(INTRO_EVENT, start, { once: true });
      }

      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      cleanup = () => {
        window.removeEventListener(INTRO_EVENT, start);
        gsap.ticker.remove(raf);
        lenis.destroy();
      };
    })();

    return () => {
      destroyed = true;
      cleanup();
    };
  }, []);

  return null;
}
