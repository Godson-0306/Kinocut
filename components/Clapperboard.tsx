import { cn } from "@/lib/utils";

export function Clapperboard({ shut = false, className }: { shut?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 180 148" className={cn("h-auto w-full", className)} aria-hidden="true">
      <g className={cn("clapper-stick", shut && "is-shut")}>
        <rect x="14" y="16" width="152" height="26" rx="5" fill="var(--ink-800-hex)" />
        <path d="M28 16 l16 26" stroke="var(--blue-300-hex)" strokeWidth="8" />
        <path d="M58 16 l16 26" stroke="var(--green-300-hex)" strokeWidth="8" />
        <path d="M88 16 l16 26" stroke="var(--white-hex)" strokeWidth="8" />
        <path d="M118 16 l16 26" stroke="var(--blue-400-hex)" strokeWidth="8" />
      </g>
      <rect x="18" y="46" width="144" height="88" rx="12" fill="var(--ink-950-hex)" />
      <circle cx="42" cy="112" r="5" fill="var(--amber-hex)" />
      <text x="56" y="116" fill="var(--blue-300-hex)" fontSize="11" letterSpacing="1.5">
        CUT
      </text>
    </svg>
  );
}
