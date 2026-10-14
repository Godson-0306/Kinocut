/** Map scroll progress 0–1 onto a 90-second, 24fps timeline. */
export function formatTimecode(progress: number, fps = 24, duration = 90) {
  const clamped = Math.min(1, Math.max(0, progress));
  const framesTotal = Math.round(clamped * duration * fps);
  const f = framesTotal % fps;
  const totalSeconds = Math.floor(framesTotal / fps);
  const s = totalSeconds % 60;
  const m = Math.floor(totalSeconds / 60) % 60;
  const h = Math.floor(totalSeconds / 3600);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
}
