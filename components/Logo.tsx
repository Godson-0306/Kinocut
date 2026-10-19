import { cn } from "@/lib/utils";

export function Logo({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <a href="/" className={cn("group inline-flex items-center gap-2.5", className)} aria-label="Kinocut, home">
      <img
        src="/logo.svg"
        alt=""
        width={42}
        height={32}
        className={cn("h-8 w-auto transition-transform duration-base group-hover:scale-105", tone === "light" && "logo-on-dark")}
      />
      <span
        className={cn("text-lg font-black tracking-[-0.04em]", tone === "light" ? "text-white" : "text-ink")}
        style={{ fontFamily: "var(--font-inter), Inter, sans-serif", fontVariationSettings: '"wght" 900' }}
      >
        Kinocut
      </span>
    </a>
  );
}
