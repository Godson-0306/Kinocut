"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { registerGsap } from "@/lib/gsap";
import { markIntroDone } from "@/lib/intro";
import { Clapperboard } from "./Clapperboard";

export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(true);
  const [shut, setShut] = useState(false);

  useLayoutEffect(() => {
    if (document.documentElement.dataset.skipIntro === "1" || document.documentElement.dataset.intro === "done") {
      setShow(false);
      return;
    }

    const { gsap } = registerGsap();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const swap = (value: string) => {
      const el = num.current;
      if (!el) return;
      el.textContent = value;
      gsap.fromTo(el, { yPercent: 80, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.22, ease: "signature" });
    };

    const timeline = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = previous;
        setShow(false);
      },
    });

    timeline
      .call(() => swap("3"), undefined, 0)
      .call(() => swap("2"), undefined, 0.38)
      .call(() => swap("1"), undefined, 0.76)
      .call(() => {
        swap("Cut");
        setShut(true);
      }, undefined, 1.12)
      .call(() => markIntroDone(), undefined, 1.38)
      .to(root.current, { yPercent: -100, duration: 0.36, ease: "signature" }, 1.38);

    return () => {
      timeline.kill();
      document.body.style.overflow = previous;
    };
  }, []);

  if (!show) return null;

  return (
    <div ref={root} className="preloader fixed inset-0 z-[80] grid place-items-center bg-ink text-white" aria-hidden="true">
      <div className="text-center">
        <p className="type-micro text-blue-300">Kinocut · slate</p>
        <div className="line-mask mx-auto mt-3">
          <div ref={num} className="type-display text-[22vw] leading-none md:text-[9rem]">
            3
          </div>
        </div>
        <div className="mx-auto mt-4 w-28">
          <Clapperboard shut={shut} />
        </div>
      </div>
    </div>
  );
}
