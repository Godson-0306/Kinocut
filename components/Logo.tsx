import { cn } from "@/lib/utils";

export function Logo({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <a href="/" className={cn("group inline-flex items-center gap-2.5", className)} aria-label="Kinocut, home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500 text-white transition-colors duration-base group-hover:bg-blue-600">
        <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-px transition-transform duration-base group-hover:translate-x-1" aria-hidden="true">
          <path d="M7 5.5v13l12-6.5L7 5.5z" fill="currentColor" />
        </svg>
      </span>
      <span className={cn("text-lg tracking-[-0.04em]", tone === "light" ? "text-white" : "text-ink")} style={{ fontWeight: 740 }}>
        Kinocut
      </span>
    </a>
  );
}
