import { MagneticButton } from "@/components/MagneticButton";

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-[80svh] place-items-center bg-ink px-5 py-32 text-white">
      <div className="max-w-xl">
        <p className="type-micro text-blue-300">00:00:00:00 · Missing scene</p>
        <h1 className="type-display-sm mt-4">This cut is not in the timeline.</h1>
        <p className="type-body mt-4 text-ink-300">The page you asked for is not in this bay.</p>
        <MagneticButton href="/" variant="inverted" className="mt-8">
          Back to the bay
        </MagneticButton>
      </div>
    </main>
  );
}
