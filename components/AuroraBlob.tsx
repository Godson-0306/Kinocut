import { cn } from "@/lib/utils";

export function AuroraBlob({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <div className="aurora-blob absolute -left-[12%] top-[8%] h-[48vw] w-[48vw] rounded-full bg-blue-400/45 blur-[90px]" />
      <div className="aurora-blob aurora-blob-b absolute -right-[8%] bottom-[-10%] h-[42vw] w-[42vw] rounded-full bg-green-300/40 blur-[100px]" />
    </div>
  );
}
