import { cn } from "@/lib/utils";

export function Waveform({
  bars = 28,
  className,
}: {
  bars?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex h-10 items-center gap-[3px]", className)} aria-hidden="true">
      {Array.from({ length: bars }, (_, index) => (
        <span
          key={index}
          className="wave-bar"
          style={{
            height: `${28 + ((index * 37) % 72)}%`,
            animationDelay: `${(index % 9) * 0.08}s`,
            animationDuration: `${0.85 + (index % 5) * 0.12}s`,
          }}
        />
      ))}
    </div>
  );
}
