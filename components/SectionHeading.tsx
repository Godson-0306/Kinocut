import { Timecode } from "./Timecode";
import { cn } from "@/lib/utils";

function Accent({ text, accent, tone }: { text: string; accent?: string; tone: "light" | "dark" | "green" | "blue" }) {
  if (!accent || !text.includes(accent)) return <>{text}</>;
  const [before, after] = text.split(accent);
  const accentClass =
    tone === "green" || tone === "blue" ? "aurora-text on-field" : tone === "dark" ? "aurora-text on-dark" : "aurora-text";
  return (
    <>
      {before}
      <span className={accentClass}>{accent}</span>
      {after}
    </>
  );
}

export function SectionHeading({
  id,
  timecode,
  title,
  accent,
  lede,
  tone = "light",
  className,
}: {
  id: string;
  timecode: string;
  title: string;
  accent?: string;
  lede?: string;
  tone?: "light" | "dark" | "green" | "blue";
  className?: string;
}) {
  const titleColor = tone === "light" ? "text-ink" : "text-white";
  const bodyColor = tone === "light" ? "text-ink-600" : tone === "green" || tone === "blue" ? "text-white/85" : "text-ink-300";
  const codeColor = tone === "light" ? "text-blue-700" : tone === "green" ? "text-green-50" : "text-blue-300";

  return (
    <div className={cn("max-w-3xl", className)}>
      <Timecode value={timecode} className={codeColor} />
      <h2 id={id} className={cn("type-display-sm mt-4", titleColor)}>
        <Accent text={title} accent={accent} tone={tone} />
      </h2>
      {lede ? <p className={cn("type-body measure mt-5", bodyColor)}>{lede}</p> : null}
    </div>
  );
}
