# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Dev server at localhost:4321
npm run build     # astro check (type-check) then build to ./dist/
npm run preview   # Preview the production build
```

There are no tests, and **no `format` or `type-check` script**. To type-check, run `npm run build` — `astro check` is the first half of it. To format, run `npx prettier --write <files>`.

Node v24 (`.nvmrc`). `.npmrc` sets `engine-strict=true` and `min-release-age=3`, so freshly published packages are refused by design.

## Architecture

A fully static **Astro 7** site for Dutch graphic artist Ton Lamper, deployed on Netlify (no `netlify.toml`; the site is wired up in the Netlify UI). All content is Dutch.

**There is no UI framework** — no Vue, React, or Svelte, and no `client:*` islands. Every interactive piece is a small vanilla-TS `<script>` in the `.astro` file that owns it. An earlier `Portfolio.vue` island was removed in `8dff4a5`; if you find docs or comments mentioning it, they are stale.

### Client scripts must bind on `astro:page-load`

`ClientRouter` (Astro view transitions) is enabled in `Layout.astro`, so pages swap without a full document load. Every script therefore registers its init on `astro:page-load`, never `DOMContentLoaded`, and inits must be idempotent — see `ExpositionCard.astro`, which guards with a `data-init` flag because a carousel can be re-initialised on re-entry. Follow this pattern for any new interactivity.

### Scroll reveal

Any element given `data-reveal` starts hidden (`opacity-0` + `translateY`) and animates in when it enters the viewport. The `IntersectionObserver` lives once in `Layout.astro` and adds `.is-rev`; the CSS is in `src/style/base.css`, including a `prefers-reduced-motion` bail-out. Stagger is done with a dynamic inline `transition-delay` (the one sanctioned use of inline `style` — see the Tailwind skill).

### Data layer

The four JSON files in `src/data/` are exposed as Astro **content collections** (Content Layer `file()` loader + Zod schemas in `src/content.config.ts`). Consume them with `getCollection('<name>')`, not by importing the JSON.

- **`artworks`** — a _keyed object_ (`"1"`, `"2"`, …), so the JSON key becomes the entry `id`. Keys are sparse (81 records, highest key `85`). Fields: `name`, `slug`, `images[]`, `category[]`, `text` (raw HTML, injected with `set:html`), and an optional `featured` boolean that Zod defaults to `false`.
- **`expositions`**, **`media`**, **`biografie`** — plain arrays. A `withIndexIds` parser assigns each entry a stable index-based `id`.

`getCollection` does not guarantee order, so **every page sorts by `Number(id)`** to reproduce the original JSON order. The homepage sorts _descending_ so newest work comes first; the other pages sort ascending. `biografie.astro` additionally groups consecutive entries sharing a `year`, then reverses.

Techniques live in `src/utils/constants.ts` as `categories = ['ets', 'lino', 'ruimtelijk']` — the single source of truth for the homepage filter. Note it does **not** include a "featured" pseudo-category; highlighting is the separate `featured` boolean on artwork records.

### Images: JSON paths are indirect

JSON data stores web-ish paths like `/images/portfolio/atlas.jpg`, but the files actually live in `src/assets/` so Astro's build pipeline can optimise them. Two helpers bridge the gap using eager `import.meta.glob` maps, and **throw at build time** on a miss (a typo in JSON fails the build rather than shipping a broken image):

- `@utils/portfolioImages` → `getPortfolioImage()`, rewrites `/images/portfolio/` → `/src/assets/portfolio/`
- `@utils/assetImages` → `getAssetImage()`, rewrites `/images/` → `/src/assets/` (covers `exposities/` and `in-de-media/`)

Watch the inconsistency: `expositions.json` stores a **full path** (`/images/exposities/foo.webp`), while `media.json` stores a **bare filename** (`beatfm.avif`) that `in-de-media.astro` prefixes with `/images/in-de-media/` at the call site.

`astro.config.mjs` sets `image.layout: 'constrained'` globally, so `<Image>` auto-generates srcset/sizes. Individual images opt out with `layout="fixed"` (contact, profile photo) or `layout="none"` (artwork detail, which sizes itself via `max-h`). Prefetch is `prefetchAll` on `viewport`.

### Routing

Pages are conventional `src/pages/*.astro`. The only dynamic route is `src/pages/portfolio/[...slug].astro`, whose `getStaticPaths()` maps over `getCollection('artworks')` using each record's `slug`.

**The portfolio grid is on the homepage (`/`), not `/portfolio`.** `index.astro` renders the hero, the `featured` grid, and the full filterable grid. Two consequences to know:

- There is no `src/pages/portfolio/index.astro`, so **`/portfolio` 404s** — yet the breadcrumb on every artwork detail page links to it. Pre-existing; fix it if you touch that navigation.
- The detail page sets `transition:name={`art-${slug}`}` on its first image, but `WorkCard.astro` renders a plain `<img>` with no matching name, so that morph currently has no counterpart and only the 300ms root fade runs.

### Homepage filter

Pure DOM, no state library: `WorkCard.astro` writes the techniques into a `data-cats` attribute (space-separated, only when `withCats` is set), and the script in `index.astro` toggles the `hidden` class per card, updates the `[data-count]` label, and syncs `aria-pressed` plus `.is-active` on the `.filter-btn`s. Filtered-in cards get `.is-rev` forced on so they don't sit invisible waiting for a scroll reveal that already fired.

Because `getImage()` is called at build time in `index.astro`, thumbnails are pre-generated at fixed widths (900px featured / 600px grid) and rendered as plain `<img>`, deliberately bypassing `<Image>`.

## Styling

**Tailwind v4, configured in CSS — not JS.** Read `.claude/skills/tailwind/SKILL.md` before writing classes; it documents the tokens and conventions in detail. The essentials:

- Tailwind is wired via the `@tailwindcss/vite` plugin in `astro.config.mjs`, **not** the Astro Tailwind integration.
- The theme is an `@theme { … }` block in **`src/style/base.css`** (imported by `Layout.astro` as `@styles/base.css`). `tailwind.config.mjs` exists but is vestigial and empty — **do not add tokens there**; add them to `@theme`.
- Design tokens: a paper/ink palette (`paper`, `ink`, `ink-2`, `ink-3`, `line`, `line-2`), Klein-blue `accent`; fonts `font-serif` (EB Garamond body), `font-display` (Cormorant Garamond headings), `font-mono` (IBM Plex Mono labels); extra type steps `text-2xs`, `text-3xs`, `text-display`; `tracking-label`, `tracking-label-wide`.
- A base-layer rule sets the **default border colour to `line`**, so a bare `border` utility draws the design's hairline instead of `currentColor`.
- Helper classes in `base.css`: `.container`, `.container-narrow`, `.btn`, `.eyebrow`, `.mono-label`, `.filter-btn`, `.body-font`.
- **Use utility classes.** `<style>` blocks are only for what Tailwind cannot express — pseudo-elements, descendant/parent-state selectors, the SVG paper-grain data URI, and `transform`-shorthand animations (which must stay raw CSS, since v4's `translate-*`/`scale-*` compile to separate properties that `transition-transform` would not animate). Component `<style>` blocks reach the tokens with `@reference '@styles/base.css'`.
- **No dark mode** — no `dark:` variants anywhere, and none are defined.

## Path aliases (tsconfig.json)

| Alias           | Resolves to        |
| --------------- | ------------------ |
| `@assets/*`     | `src/assets/*`     |
| `@components/*` | `src/components/*` |
| `@data/*`       | `src/data/*`       |
| `@layouts/*`    | `src/layouts/*`    |
| `@styles/*`     | `src/style/*`      |
| `@utils/*`      | `src/utils/*`      |

Note `@styles` is plural but the folder `src/style/` is singular.

## Prettier

Tabs, single quotes, no semicolons, no trailing commas, **80-char** width. Plugins: `prettier-plugin-astro` and `prettier-plugin-tailwindcss` — the latter sorts class lists automatically, so don't hand-order classes.
