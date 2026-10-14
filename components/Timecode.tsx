"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

export function Timecode({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    setText(value);
    if (reduce) return;
    const el = ref.current;
    if (!el) return;

    let timer = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const glyphs = "0123456789";
        let frame = 0;
        timer = window.setInterval(() => {
          frame += 1;
          setText(
            value
              .split("")
              .map((char, index) => {
                if (char === ":" || frame > 6 + index * 1.4) return char;
                return glyphs[Math.floor(Math.random() * glyphs.length)];
              })
              .join(""),
          );
          if (frame > 6 + value.length * 1.4) window.clearInterval(timer);
        }, 32);
      },
      { threshold: 0.7 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [reduce, value]);

  return (
    <span ref={ref} className={cn("type-micro", className)}>
      {text}
    </span>
  );
}
