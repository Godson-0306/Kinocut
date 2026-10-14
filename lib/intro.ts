export const INTRO_EVENT = "kinocut:intro-done";
export const INTRO_KEY = "kinocut-intro-seen";

export function introIsDone() {
  return document.documentElement.dataset.intro === "done";
}

export function markIntroDone() {
  document.documentElement.dataset.intro = "done";
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    /* private mode */
  }
  window.dispatchEvent(new Event(INTRO_EVENT));
}

export function onIntroDone(cb: () => void) {
  if (typeof document !== "undefined" && introIsDone()) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(INTRO_EVENT, handler, { once: true });
  return () => window.removeEventListener(INTRO_EVENT, handler);
}
