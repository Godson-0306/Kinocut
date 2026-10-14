import { cn } from "@/lib/utils";

export function FilmHoles({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  return <div className={cn("film-holes", tone === "dark" && "on-dark", className)} aria-hidden="true" />;
}
