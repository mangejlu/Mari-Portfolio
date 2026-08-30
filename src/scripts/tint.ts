/**
 * Pointing at something floods the page aura with its colour.
 *
 * One delegated handler for the whole site: any element carrying
 * `data-aura="colourA|colourB|colourC"` tints on hover or keyboard focus and
 * releases on the way out. Hero chapters and work rows both use it, so colour
 * means exactly one thing everywhere — "this is what you're pointing at".
 */

const VARS = ['--aura-1', '--aura-2', '--aura-3'] as const;

/** The page's own palette, restored whenever nothing is being pointed at. */
let base: string[] = [];

function captureBase() {
  // Read the inline values the layout set for this route, not the computed
  // ones — computed would bake in whatever tint happens to be active.
  base = VARS.map((v) => document.body.style.getPropertyValue(v));
}

function tint(colors: string[]) {
  VARS.forEach((v, i) => {
    const c = colors[i];
    if (c) document.body.style.setProperty(v, c);
    else document.body.style.removeProperty(v);
  });
}

export function releaseTint() {
  tint(base);
  document.body.style.removeProperty('--accent');
}

let wired = false;

export function initTint() {
  captureBase();
  if (wired) return;
  wired = true;

  const enter = (target: Element | null) => {
    const hit = target?.closest?.<HTMLElement>('[data-aura]');
    if (!hit) return;
    tint((hit.dataset.aura ?? '').split('|'));
    const accent = hit.style.getPropertyValue('--accent');
    if (accent) document.body.style.setProperty('--accent', accent);
  };

  const leave = (target: Element | null, related: EventTarget | null) => {
    const hit = target?.closest?.('[data-aura]');
    if (!hit) return;
    // Ignore moves between the element's own descendants.
    if (related instanceof Node && hit.contains(related)) return;
    releaseTint();
  };

  document.addEventListener('pointerover', (e) => enter(e.target as Element), { passive: true });
  document.addEventListener('pointerout', (e) => leave(e.target as Element, e.relatedTarget), { passive: true });
  document.addEventListener('focusin', (e) => enter(e.target as Element));
  document.addEventListener('focusout', (e) => leave(e.target as Element, e.relatedTarget));
}
