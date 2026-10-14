"use client";

import { useLayoutEffect, useRef } from "react";
import { registerGsap } from "@/lib/gsap";

type SplitResult = { words: HTMLElement[] | null; revert: () => void };

/**
 * Wraps each SplitType word so a masked yPercent reveal does not spill.
 * Reverts on unmount so React keeps ownership of the text.
 */
export function SplitText({
  text,
  className,
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  as?: "p" | "h2" | "span";
}) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    if (!el || reduce) return;

    let cancelled = false;
    let split: SplitResult | null = null;
    let ctx: { revert: () => void } | null = null;

    (async () => {
      const { default: SplitType } = await import("split-type");
      const { gsap } = registerGsap();
      if (cancelled || !ref.current) return;
      split = new SplitType(ref.current, { types: "words" }) as SplitResult;
      split.words?.forEach((word) => {
        const wrap = document.createElement("span");
        wrap.style.display = "inline-block";
        wrap.style.overflow = "hidden";
        wrap.style.verticalAlign = "bottom";
        word.parentNode?.insertBefore(wrap, word);
        wrap.appendChild(word);
        word.style.display = "inline-block";
      });
      ctx = gsap.context(() => {
        gsap.from(split?.words ?? [], {
          yPercent: 110,
          duration: 0.6,
          stagger: 0.02,
          ease: "signature",
          scrollTrigger: { trigger: ref.current, start: "top 86%" },
        });
      });
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
      split?.revert();
    };
  }, [text]);

  return (
    <Tag ref={ref as never} className={className}>
      {text}
    </Tag>
  );
}
