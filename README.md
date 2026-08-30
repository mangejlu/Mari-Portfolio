# mari-portfolio

Astro site rebuilt from `mari-final-prototype.html`.

## Why Astro

Ships zero JS by default, so the only script on the page is the interaction
code we actually wrote. Content collections will let case studies live as
Markdown (edit a file, not a component). `ClientRouter` gives real cross-route
animated transitions, which is what the prototype was faking with smooth-scroll.

```bash
npm run dev      # http://localhost:4321
npm run build
npm run preview
```

## Structure

```
src/
  data/site.ts          identity, links, chapter list  ← edit here first
  styles/tokens.css     palette, accents, motion durations
  styles/global.css     reset + shared primitives
  scripts/env.ts        motion tier + capability detection (see below)
  scripts/reveal.ts     one shared IntersectionObserver
  components/           AuraBackground, CustomCursor, ColorWash, SiteNav,
                        Toast, DesignerNote, Reveal, Hero
  layouts/BaseLayout    the shell every page uses
  pages/                index, work, about, mural
```

## The accent system

`--accent` is one variable. Chapters set it via `data-chapter` on `<body>`;
projects will set it per-page. Everything accented — nav dot, chapter number,
cursor ring, wash colour, path dots — reads that single variable, so a new
project only has to declare its colour once.

## Performance: the aura

The aura is the heaviest thing here, so it's built to degrade:

- **No `filter: blur()`.** Blurring a 52vmax element re-blurs a huge surface
  every frame. Each blob is instead a flat colour behind a static
  radial-gradient *mask* — same soft edge, and moving it is a pure transform.
- **Colour on `background-color`**, so retinting a chapter is cheap and
  smoothly transitionable.
- **Three tiers** (`scripts/env.ts`):
  | tier | when | behaviour |
  |---|---|---|
  | `full` | capable device, normal motion | rAF loop, follows the pointer, 4 layers |
  | `lite` | ≤4 cores, ≤4GB RAM, or ≤640px wide | slow CSS keyframe drift, 3 layers, no rAF |
  | `static` | `prefers-reduced-motion`, or no viewport yet | painted once, never moves |

  `static` is the HTML default, so the cheapest option is what renders before
  any JS decides otherwise. The tier is re-evaluated live via `matchMedia`
  listeners — plug in a mouse or resize past the breakpoint and it adapts.

- The rAF loop **pauses when the tab is hidden**.

## Reduced motion

- `tokens.css` collapses every `--dur-*` to ~0, so component transitions stop
  without each component knowing about it.
- `global.css` additionally kills all animation/transition/scroll-behaviour.
- Aura → `static`. Sparkles → `display: none`. Colour wash → disabled.
  Scroll reveals → rendered visible immediately.
- The hero stops its idle chapter cycling and parks on chapter 01.

## Gotchas worth remembering

- `transition:persist` **must go on an HTML element**, not on a component tag —
  on a component it silently emits nothing. The four global singletons (aura,
  cursor, wash, toast) each carry a named persist on their root element.
- Module scripts run **before first layout**, where `innerWidth` is `0` and
  `(max-width: 640px)` matches. Anything branching on viewport size must go
  through `afterFirstLayout()`.
- `requestAnimationFrame` **does not fire in a hidden tab**. Anything that must
  resolve (like lifting the colour wash) needs a timer, not a frame.

## Media pipeline

Source photos and video live outside the repo. Two scripts turn them into what
ships:

```bash
node scripts/convert-images.mjs   # -> public/media/*.webp + src/data/media.ts
node scripts/convert-gif.mjs      # the BloomWatch demo
```

`src/data/media.ts` is generated and records the width each variant was really
written at, so a srcset can never advertise a file that was skipped as an
upscale. Don't edit it by hand.

HEIC photos have to be staged through macOS `sips` first: sharp's HEIF decoder
fails on Apple's variant.

## Content gotchas

- **Colons in YAML.** An unquoted list item containing `": "` parses as a map
  and the build fails with a confusing type error. Run
  `node scripts/fix-yaml-colons.mjs` after editing case study frontmatter.
- **Photo focal points.** `focus` in `src/data/about.ts` is a CSS
  `object-position`. A *lower* percentage pans the view *up* the photo. The crop
  is much harsher in wide tiles than tall ones, so check a narrow and a wide
  window after changing one.
- **`[hidden]`.** Any class that sets `display` outranks the browser's
  `[hidden]` rule. `global.css` forces it, so don't fight that.
- **Scoped styles and `<Reveal>`.** Astro scopes styles at compile time and
  can't stamp a component with a dynamic root tag, so a page rule targeting a
  Reveal wrapper needs `:global(...)`.

## Still to do

- [ ] Connect the guestbook (see `SETUP.md`)
- [ ] Real domain in `astro.config.mjs`
- [ ] Interview counts and outcomes for HAWK once it ships
