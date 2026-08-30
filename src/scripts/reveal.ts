import { prefersReducedMotion } from './env';

let observer: IntersectionObserver | null = null;

/** Idempotent: safe to call on every page load and after every swap. */
export function initReveals() {
  const els = document.querySelectorAll<HTMLElement>('.reveal:not(.in-view)');

  if (prefersReducedMotion()) {
    els.forEach((el) => el.classList.add('in-view'));
    return;
  }

  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('in-view');
        observer?.unobserve(entry.target);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -5% 0px' },
  );

  els.forEach((el) => observer!.observe(el));
}
