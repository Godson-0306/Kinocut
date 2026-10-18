import { cn } from "@/lib/utils";

export function Logo({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <a href="/" className={cn("group inline-flex items-center gap-2.5", className)} aria-label="Kinocut, home">
      <img
        src="/logo-mark.png"
        alt=""
        width={939}
        height={734}
        className={cn("h-8 w-auto transition-transform duration-base group-hover:scale-105", tone === "light" && "logo-on-dark")}
      />
    </a>
  );
}
