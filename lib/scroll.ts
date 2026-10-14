export const scrollState = {
  y: 0,
  velocity: 0,
  direction: 1,
};

type ScrollListener = (state: typeof scrollState) => void;
const listeners = new Set<ScrollListener>();

let toImpl: (target: string | number | HTMLElement) => void = (target) => {
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  el?.scrollIntoView({ behavior: "smooth" });
};

let stopImpl = () => {};
let startImpl = () => {};

export function emitScroll(next: { y: number; velocity: number; direction: number }) {
  scrollState.y = next.y;
  scrollState.velocity = next.velocity;
  scrollState.direction = next.direction || 1;
  listeners.forEach((listener) => listener(scrollState));
}

export function subscribeScroll(listener: ScrollListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function scrollTo(target: string | number | HTMLElement) {
  toImpl(target);
}

export function stopScroll() {
  stopImpl();
}

export function startScroll() {
  startImpl();
}

export function setScrollController(ctrl: {
  to: typeof toImpl;
  stop: () => void;
  start: () => void;
}) {
  toImpl = ctrl.to;
  stopImpl = ctrl.stop;
  startImpl = ctrl.start;
}
