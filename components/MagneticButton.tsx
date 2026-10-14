"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "green" | "ghost" | "inverted" | "glass";

const variants: Record<Variant, string> = {
  primary: "btn-primary",
  green: "btn-green",
  ghost: "btn-ghost",
  inverted: "btn-inverted",
  glass: "btn-glass",
};

type Props = {
  children: React.ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
  shine?: boolean | "loop";
  onClick?: () => void;
  type?: "button" | "submit";
  external?: boolean;
  ariaLabel?: string;
};

export function MagneticButton({
  children,
  href,
  variant = "primary",
  className,
  shine = false,
  onClick,
  type = "button",
  external,
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const fine = useRef(false);

  useEffect(() => {
    fine.current = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
  }, []);

  const onMove = (event: React.MouseEvent) => {
    const el = ref.current;
    if (!el || !fine.current) return;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate3d(${x * 0.22}px, ${y * 0.28}px, 0)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate3d(0,0,0)";
  };

  const classes = cn("btn magnetic", variants[variant], className);
  const content = (
    <>
      {shine ? <span className={cn("btn-shine", shine === "loop" && "is-loop")} aria-hidden="true" /> : null}
      <span className="relative z-10 inline-flex items-center gap-3">{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        ref={ref}
        href={href}
        className={classes}
        data-cursor="hover"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={onClick}
        aria-label={ariaLabel}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      data-cursor="hover"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}
