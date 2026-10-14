"use client";

import { useEffect, useRef } from "react";
import { site } from "@/content/site";

/**
 * The handle eases toward the pointer instead of sticking to it,
 * which is what makes the divider feel magnetic.
 */
export function BeforeAfterSlider() {
  const frame = useRef<HTMLDivElement>(null);
  const before = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLDivElement>(null);
  const videoA = useRef<HTMLVideoElement>(null);
  const videoB = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const frameEl = frame.current;
    const beforeEl = before.current;
    const handleEl = handle.current;
    if (!frameEl || !beforeEl || !handleEl) return;

    let current = 46;
    let target = 46;
    let frameId = 0;
    let running = true;

    const paint = () => {
      beforeEl.style.clipPath = `inset(0 ${100 - current}% 0 0)`;
      handleEl.style.left = `${current}%`;
      handleEl.setAttribute("aria-valuenow", String(Math.round(current)));
    };

    const loop = () => {
      if (!running) return;
      current += (target - current) * 0.22;
      if (Math.abs(target - current) < 0.05) current = target;
      paint();
      frameId = requestAnimationFrame(loop);
    };
    paint();
    frameId = requestAnimationFrame(loop);

    const point = (clientX: number) => {
      const rect = frameEl.getBoundingClientRect();
      const next = ((clientX - rect.left) / rect.width) * 100;
      target = Math.min(92, Math.max(8, next));
    };

    const onDown = (event: PointerEvent) => {
      frameEl.setPointerCapture(event.pointerId);
      point(event.clientX);
    };
    const onMove = (event: PointerEvent) => {
      if (!frameEl.hasPointerCapture(event.pointerId)) return;
      point(event.clientX);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") target = Math.max(8, target - 4);
      if (event.key === "ArrowRight") target = Math.min(92, target + 4);
    };

    frameEl.addEventListener("pointerdown", onDown);
    frameEl.addEventListener("pointermove", onMove);
    handleEl.addEventListener("keydown", onKey);

    [videoA.current, videoB.current].forEach((video) => {
      video?.play().catch(() => undefined);
    });

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      frameEl.removeEventListener("pointerdown", onDown);
      frameEl.removeEventListener("pointermove", onMove);
      handleEl.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="mt-16">
      <div className="mb-6 flex items-end justify-between gap-6">
        <div>
          <h3 className="type-sub text-ink">
            Raw against the <span className="aurora-text">grade</span>.
          </h3>
          <p className="type-body mt-3 text-ink-600">{site.showreel.compareLede}</p>
        </div>
        <p className="type-micro hidden text-blue-700 sm:block">Drag or use arrow keys</p>
      </div>
      <div
        ref={frame}
        className="relative aspect-video overflow-hidden rounded-panel bg-ink shadow-card"
        data-cursor="drag"
        style={{ touchAction: "none" }}
      >
        <Layer videoRef={videoB} graded />
        <div ref={before} className="absolute inset-0">
          <Layer videoRef={videoA} />
        </div>
        <div
          ref={handle}
          role="slider"
          tabIndex={0}
          aria-label="Compare raw and edited"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={46}
          className="absolute bottom-0 top-0 z-10 w-10 -translate-x-1/2"
        >
          <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white" />
          <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink shadow-card">
            <span className="type-micro">Cut</span>
          </span>
        </div>
        <span className="type-micro pointer-events-none absolute left-4 top-4 rounded-pill bg-ink/70 px-3 py-1 text-white">Raw</span>
        <span className="type-micro pointer-events-none absolute right-4 top-4 rounded-pill bg-white px-3 py-1 text-ink">Edited</span>
      </div>
    </div>
  );
}

function Layer({ videoRef, graded = false }: { videoRef: React.RefObject<HTMLVideoElement | null>; graded?: boolean }) {
  return (
    <div className="absolute inset-0">
      <div className={cnSafe(graded)} />
      <video
        ref={videoRef}
        className={graded ? "h-full w-full object-cover saturate-125" : "h-full w-full object-cover grayscale contrast-75 brightness-75"}
        muted
        loop
        playsInline
        preload="metadata"
        poster="/videos/hero-poster.jpg"
        aria-hidden="true"
      >
        <source src="/videos/hero-mobile.mp4" type="video/mp4" />
      </video>
      {graded ? (
        <>
          <div className="bg-aurora pointer-events-none absolute inset-0 opacity-30 mix-blend-soft-light" />
          <div className="absolute bottom-6 left-6 right-24 rounded-2xl bg-ink/75 px-4 py-3 text-white backdrop-blur-md">
            <p className="type-micro text-blue-300">Lower third</p>
            <p className="mt-1 text-sm">The part everyone replays.</p>
          </div>
        </>
      ) : (
        <span className="type-micro absolute bottom-6 left-6 text-white/80">Log · no captions</span>
      )}
    </div>
  );
}

function cnSafe(graded: boolean) {
  return graded
    ? "absolute inset-0 bg-gradient-to-br from-blue-700 via-ink-800 to-green-700"
    : "absolute inset-0 bg-gradient-to-br from-ink-700 via-ink-800 to-ink-950";
}
