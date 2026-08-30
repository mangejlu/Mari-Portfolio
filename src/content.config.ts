import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * One case study per file in src/content/work/.
 *
 * Structured frontmatter rather than long prose, because the page renders
 * these as interactive pieces — stat bands, before/after toggles, expandable
 * insight cards. Zod validates on build, so a typo fails loudly instead of
 * rendering an empty section.
 */

/**
 * Every number on the site carries how it was obtained. This is the whole
 * point: `measured` is a result, `target` is a goal that was set, `scale`
 * describes the size of the work, and `benchmark` is somebody else's research
 * (and must cite a source). Nothing renders without a claim about its own
 * provenance — that's what keeps a portfolio honest under questioning.
 */
const stat = z.object({
  value: z.string(),
  label: z.string(),
  note: z.string().optional(),
  kind: z.enum(['measured', 'target', 'scale', 'benchmark']),
  source: z.string().optional(),
  sourceUrl: z.string().url().optional(),
}).refine((s) => s.kind !== 'benchmark' || !!s.source, {
  message: 'A benchmark stat must name its source.',
});

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    /** The one-line hook shown on the work card and hero. */
    tagline: z.string(),
    /** Two sentences max — this is the card blurb. */
    summary: z.string(),

    /** Curation order on the work grid (lower first). */
    order: z.number(),
    /** Explicit next-study slug. Curated, not positional. */
    next: z.string().optional(),

    /** Hex. Drives --accent for this whole route. */
    accent: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    /** Three soft hexes for the aura on this route. */
    aura: z.tuple([z.string(), z.string(), z.string()]),

    /** Facts strip. */
    meta: z.object({
      type: z.string(),
      client: z.string(),
      year: z.string(),
      team: z.string(),
      role: z.array(z.string()),
      tools: z.array(z.string()),
    }),

    tags: z.array(z.string()),
    /** Optional: only include numbers that actually carry meaning. */
    stats: z.array(stat).max(4).optional(),

    /** Product screenshots, rendered after the "what changed" section. */
    gallery: z.array(z.object({
      name: z.string(),
      alt: z.string(),
      caption: z.string().optional(),
    })).optional(),

    /** A click-to-play demo video living in public/media. */
    demo: z.object({
      name: z.string(),
      label: z.string(),
      caption: z.string().optional(),
    }).optional(),

    problem: z.object({
      hmw: z.string(),
      /** The sharp line. Used big, on its own. */
      thesis: z.string(),
      /** Questions that were hard to answer — rendered as a reveal list. */
      questions: z.array(z.string()).optional(),
    }),

    research: z.object({
      methods: z.array(z.object({ label: z.string(), count: z.string().optional() })),
      insights: z.array(z.object({ title: z.string(), body: z.string() })),
      quotes: z.array(z.string()).optional(),
    }),

    /** The before → after pairs. The spine of the story. */
    shifts: z.array(
      z.object({
        before: z.string(),
        after: z.string(),
        detail: z.string(),
        where: z.string().optional(),
      }),
    ).optional(),

    personas: z.array(
      z.object({
        role: z.string(),
        tag: z.string(),
        initials: z.string(),
        needs: z.array(z.string()),
        pains: z.array(z.string()),
      }),
    ).optional(),

    principles: z.array(z.object({ title: z.string(), body: z.string() })).optional(),

    screens: z.array(
      z.object({
        title: z.string(),
        purpose: z.string(),
        notes: z.array(z.string()),
        solves: z.string().optional(),
      }),
    ).optional(),

    /** Optional: a project still being built doesn't have outcomes yet. */
    outcome: z.object({
      wentWell: z.array(z.string()),
      improve: z.array(z.string()),
      next: z.array(z.string()),
    }).optional(),

    /** Shown in place of outcomes while a project is still in progress. */
    status: z.object({
      label: z.string(),
      body: z.string(),
    }).optional(),

    /** Overrides the research section heading. */
    researchHeading: z.string().optional(),

    reflection: z.string(),

    links: z.array(z.object({ label: z.string(), href: z.string(), cursor: z.string().optional() })).optional(),

    /** Anything still owed. Renders as a visible note in dev, hidden in prod. */
    todo: z.array(z.string()).optional(),
  }),
});

export const collections = { work };
