import { cn } from "@/lib/utils";

export function StepArt({ name, auto = false, className }: { name: "subscribe" | "send" | "receive"; auto?: boolean; className?: string }) {
  return (
    <div className={cn("relative h-full w-full", auto && "art-auto", className)} aria-hidden="true">
      <svg viewBox="0 0 520 420" className="h-full w-full">
        <rect x="28" y="28" width="464" height="364" rx="32" fill="rgb(255 255 255 / 0.04)" stroke="rgb(255 255 255 / 0.16)" />
        {name === "subscribe" ? <SubscribeArt /> : null}
        {name === "send" ? <SendArt /> : null}
        {name === "receive" ? <ReceiveArt /> : null}
      </svg>
    </div>
  );
}

function SubscribeArt() {
  return (
    <>
      <rect className="art-card" x="78" y="72" width="364" height="250" rx="24" fill="rgb(255 255 255 / 0.05)" stroke="var(--blue-300-hex)" />
      <text x="108" y="124" fill="var(--blue-300-hex)" fontSize="14" letterSpacing="2">
        BAY PASS
      </text>
      <text x="108" y="188" fill="var(--white-hex)" fontSize="48">
        One fee
      </text>
      <text x="108" y="230" fill="var(--ink-300-hex)" fontSize="18">
        Cancel anytime
      </text>
      <circle className="art-check" cx="390" cy="250" r="26" fill="none" stroke="var(--green-300-hex)" strokeWidth="3" strokeDasharray="180" strokeDashoffset="180" />
      <path className="art-check" d="M376 250 l10 11 22-24" fill="none" stroke="var(--green-300-hex)" strokeWidth="3" strokeLinecap="round" strokeDasharray="80" strokeDashoffset="80" />
    </>
  );
}

function SendArt() {
  return (
    <>
      {[
        { y: 86, label: "Interview.mp4", width: "72%" },
        { y: 168, label: "Roomtone.wav", width: "54%" },
        { y: 250, label: "Drive link", width: "84%" },
      ].map((file) => (
        <g key={file.label} className="art-file" opacity="0.95">
          <rect x="86" y={file.y} width="348" height="64" rx="16" fill="rgb(255 255 255 / 0.06)" stroke="rgb(255 255 255 / 0.16)" />
          <text x="110" y={file.y + 28} fill="var(--white-hex)" fontSize="16">
            {file.label}
          </text>
          <rect x="110" y={file.y + 40} width="220" height="6" rx="3" fill="rgb(255 255 255 / 0.12)" />
          <rect className="art-bar" x="110" y={file.y + 40} width="220" height="6" rx="3" fill="var(--blue-300-hex)" />
        </g>
      ))}
    </>
  );
}

function ReceiveArt() {
  return (
    <>
      <rect x="78" y="78" width="280" height="168" rx="18" fill="var(--blue-800-hex)" />
      <polygon points="198,132 198,192 250,162" fill="var(--white-hex)" />
      <g className="art-spark">
        <circle cx="390" cy="96" r="5" fill="var(--green-300-hex)" />
        <circle cx="420" cy="140" r="3" fill="var(--blue-300-hex)" />
        <circle cx="360" cy="150" r="4" fill="var(--amber-hex)" />
      </g>
      <g className="art-stamp">
        <rect x="250" y="270" width="196" height="64" rx="12" fill="var(--amber-hex)" />
        <text x="276" y="308" fill="var(--ink-800-hex)" fontSize="16">
          Delivered ~48h
        </text>
      </g>
    </>
  );
}
