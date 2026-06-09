# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at localhost:4321
npm run build     # Type-check (astro check) then build to ./dist/
npm run preview   # Preview the production build locally
```

There are no tests in this project.

## Architecture

This is an **Astro 6 static site** for Dutch artist Ton Lamper, deployed on Netlify. It uses:

- **Astro** for pages and static rendering
- **Vue 3** for the portfolio filter island (`client:idle`). The navigation menu is plain Astro + a small vanilla script (`src/components/Menu.astro`) — Vue only loads on the portfolio page
- **Tailwind CSS v4** via the `@tailwindcss/vite` plugin (not the Astro integration)
- **Astro's `ClientRouter`** for client-side page transitions with a 300ms fade, plus a `transition:name` morph from the portfolio grid thumbnail to the detail image
- **Viewport prefetch** and **responsive images** (`image.layout: 'constrained'`) configured in `astro.config.mjs`; fixed-size images opt out with `layout="fixed"`

### Path aliases (tsconfig.json)

| Alias           | Resolves to        |
| --------------- | ------------------ |
| `@assets/*`     | `src/assets/*`     |
| `@components/*` | `src/components/*` |
| `@data/*`       | `src/data/*`       |
| `@layouts/*`    | `src/layouts/*`    |
| `@utils/*`      | `src/utils/*`      |

### Data layer

All content is static — no CMS or API. The four JSON files in `src/data/` are exposed as **Astro content collections** defined in `src/content.config.ts` (Content Layer `file()` loader + Zod schemas), so consume them with `getCollection('<name>')` rather than importing the JSON directly:

- **`artworks`** (`src/data/artworks.json`) — a keyed object (`"1"`, `"2"`, …), so the entry `id` is the JSON key. Records have `name`, `slug`, `images[]`, `category[]`, and `text`.
- **`media`**, **`expositions`**, **`biografie`** — plain arrays; a parser assigns each entry a stable index-based `id`.

`getCollection` does not guarantee order, so pages sort by numeric `id` to reproduce the original JSON order (the portfolio additionally reverses it so newest is first). Artwork categories (`uitgelicht`, `ets`, `lino`, `ruimtelijk`) are the single source of truth in `src/utils/constants.ts`.

### Portfolio routing

`src/pages/portfolio/[...slug].astro` calls `getStaticPaths()` over `getCollection('artworks')` to generate one page per artwork. The slug field on each artwork record determines the URL.

### Styling

**Always use Tailwind utility classes for CSS.** Do not write plain CSS, scoped `<style>` blocks, or inline `style` attributes unless Tailwind genuinely cannot express the rule (e.g. complex keyframes). When extending the design system, add tokens/utilities to `tailwind.config.mjs` or `style/base.css` rather than writing one-off CSS in components.

Global base styles are in `style/base.css` (at repo root, not `src/`), imported from `src/layouts/Layout.astro`. Tailwind is configured in `tailwind.config.mjs`. Component-scoped styles use `@reference "tailwindcss"` to access utilities without re-importing the full stylesheet.

Custom utility classes defined in `style/base.css`:

- `.container` — responsive max-width wrapper
- `.container-narrow` — narrow centred content block (max-w-3xl)
- `.btn` — outlined button with hover state

### Prettier

Uses tabs, single quotes, no semicolons, no trailing commas, 100-char line width. Plugins: `prettier-plugin-astro` and `prettier-plugin-tailwindcss`.
