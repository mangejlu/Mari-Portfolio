/**
 * One place that decides how much motion this device gets.
 *
 * Three tiers, because the aura is by far the most expensive thing on the
 * page and a mid-range phone should not be asked to composite three
 * large soft-edged layers at 60fps:
 *
 *   'full'   — rAF-driven aura that follows the pointer
 *   'lite'   — aura renders, drifts on a slow CSS keyframe, ignores pointer
 *   'static' — aura is painted once and never moves
 */
export type MotionTier = 'full' | 'lite' | 'static';

/**
 * The three signals the tier depends on, held as live MediaQueryLists.
 *
 * These are queried lazily rather than read once at import time: scripts run
 * before the viewport has settled (a preview pane opening, a phone browser
 * collapsing its toolbar, a restored window animating to size), and a tier
 * computed in that first instant sticks for the rest of the visit.
 */
const QUERIES = {
  reduce: '(prefers-reduced-motion: reduce)',
  fine: '(pointer: fine)',
  narrow: '(max-width: 640px)',
} as const;

const mq: Partial<Record<keyof typeof QUERIES, MediaQueryList>> = {};

function query(key: keyof typeof QUERIES): MediaQueryList | null {
  if (typeof window === 'undefined') return null;
  return (mq[key] ??= window.matchMedia(QUERIES[key]));
}

export function prefersReducedMotion(): boolean {
  return query('reduce')?.matches ?? false;
}

export function hasFinePointer(): boolean {
  return query('fine')?.matches ?? true;
}

/**
 * Rough proxy for "can this device afford the full aura?".
 * deviceMemory is Chromium-only, so treat its absence as unknown rather
 * than as a failure — Safari on a recent iPhone is plenty capable.
 */
function isLowPowered(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number };
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4) return true;
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4) return true;
  // A narrow viewport is a phone, and phones pay the most for large
  // composited layers relative to their screen area. innerWidth is 0 before
  // first layout, which would read as the narrowest possible phone — so only
  // trust this once the document actually has a width.
  if (window.innerWidth > 0 && query('narrow')?.matches) return true;
  return false;
}

export function motionTier(): MotionTier {
  if (prefersReducedMotion()) return 'static';
  if (isLowPowered()) return 'lite';
  if (!hasFinePointer()) return 'lite';
  return 'full';
}

/**
 * Re-run `cb` whenever anything the tier depends on changes — the user flips
 * reduced motion, plugs in a mouse, or crosses the phone breakpoint.
 */
export function onCapabilityChange(cb: () => void): () => void {
  const lists = (Object.keys(QUERIES) as Array<keyof typeof QUERIES>)
    .map(query)
    .filter((l): l is MediaQueryList => l !== null);

  for (const list of lists) list.addEventListener('change', cb);
  return () => {
    for (const list of lists) list.removeEventListener('change', cb);
  };
}

/**
 * Pauses a rAF loop while the tab is hidden. Astro's ClientRouter keeps the
 * document alive across navigations, so loops that never stop really never
 * stop.
 */
export function rafLoop(step: (dt: number) => void): () => void {
  let handle = 0;
  let last = performance.now();
  let running = true;

  const frame = (now: number) => {
    if (!running) return;
    const dt = Math.min(now - last, 50); // clamp after a background stall
    last = now;
    step(dt);
    handle = requestAnimationFrame(frame);
  };
  handle = requestAnimationFrame(frame);

  const onVisibility = () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(handle);
    } else if (!running) {
      running = true;
      last = performance.now();
      handle = requestAnimationFrame(frame);
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  return () => {
    running = false;
    cancelAnimationFrame(handle);
    document.removeEventListener('visibilitychange', onVisibility);
  };
}

/**
 * Runs `cb` once the document has a real viewport.
 *
 * Module scripts execute before first layout, where `innerWidth` is 0 and
 * width-based media queries answer as if the screen were zero pixels wide.
 * Anything that branches on viewport size has to wait for this.
 *
 * requestAnimationFrame alone isn't enough: a page opened in a background tab
 * (or a hidden preview pane) doesn't get frames at all, so the callback would
 * never fire and the caller would sit on its conservative default forever.
 * Hence the belt of signals, with a slow interval as the last resort.
 */
export function afterFirstLayout(cb: () => void): void {
  if (typeof window === 'undefined') return;
  if (window.innerWidth > 0) {
    cb();
    return;
  }

  let settled = false;
  let raf = 0;
  let poll = 0;
  let observer: ResizeObserver | null = null;

  const cleanup = () => {
    observer?.disconnect();
    window.removeEventListener('resize', run);
    window.removeEventListener('load', run);
    cancelAnimationFrame(raf);
    clearInterval(poll);
  };

  function run() {
    if (settled || window.innerWidth === 0) return;
    settled = true;
    cleanup();
    cb();
  }

  if ('ResizeObserver' in window) {
    observer = new ResizeObserver(run);
    observer.observe(document.documentElement);
  }
  window.addEventListener('resize', run);
  window.addEventListener('load', run);
  raf = requestAnimationFrame(() => requestAnimationFrame(run));
  poll = window.setInterval(run, 250);
}
