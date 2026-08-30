/**
 * Everything about Mari that isn't a case study. Edit here, not in markup.
 */
export const site = {
  name: 'Mariangel',
  short: 'Mari',
  /** Lowercase wordmark — the whole visual identity runs lowercase. */
  wordmark: 'mari',
  logo: 'mari.',
  title: 'Mariangel, designer',
  description:
    'designer studying CS and pursuing product design. Case studies, a bit about me, and a mural you can add to.',
  email: 'loaurbmariangel@gmail.com',

  /**
   * The one-line "what I'm up to" strip under the hero.
   * TODO: this is the one thing on the site that goes stale on its own.
   * Change it whenever what you're working on changes.
   */
  now: {
    text: 'currently designing audit tooling for FEMSA',
    updated: 'Aug 2026',
  },

} as const;

/** The three chapters, in order. Drives the nav, the washes and the "next" flow. */
export const chapters = [
  { id: 'work',  num: '01', label: 'work',  href: '/work/',  cursor: 'view', accent: 'var(--sprout)' },
  { id: 'about', num: '02', label: 'about', href: '/about/', cursor: 'hi',   accent: 'var(--blush)' },
  { id: 'mural', num: '03', label: 'mural', href: '/mural/', cursor: 'sign', accent: 'var(--peach)' },
] as const;

export type ChapterId = (typeof chapters)[number]['id'];

export function chapterAfter(id: ChapterId) {
  const i = chapters.findIndex((c) => c.id === id);
  return chapters[i + 1] ?? null;
}
