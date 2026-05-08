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

This is an **Astro 4 static site** for Dutch artist Ton Lamper, deployed on Netlify. It uses:

- **Astro** for pages and static rendering
- **Vue 3** for interactive islands (`client:idle`) — navigation menu and portfolio filter
- **Tailwind CSS v4** via the `@tailwindcss/vite` plugin (not the Astro integration)
- **Astro's `ClientRouter`** for client-side page transitions with a 300ms fade

### Path aliases (tsconfig.json)

| Alias           | Resolves to            |
| --------------- | ---------------------- |
| `@components/*` | `src/components/*`     |
| `@data/*`       | `src/data/*`           |
| `@layouts/*`    | `src/layouts/*`        |
| `@/types`       | `src/types/index.ts`   |
| `@utils/*`      | `src/utils/*`          |

### Data layer

All content is static — no CMS or API. Data lives in two JSON files:

- **`src/data/artworks.json`** — keyed object (`"1"`, `"2"`, …) of `Artwork` records with `name`, `slug`, `images[]`, `category[]`, and `text`. The portfolio page reverses insertion order for display.
- **`src/data/media.json`** — array of press/media items.

The `Artwork` / `Artworks` types are in `src/types/index.ts`. Artwork categories (`uitgelicht`, `ets`, `lino`, `ruimtelijk`) are the single source of truth in `src/utils/constants.ts`.

### Portfolio routing

`src/pages/portfolio/[...slug].astro` calls `getStaticPaths()` to generate one page per artwork from `artworks.json`. The slug field on each artwork record determines the URL.

### Styling

**Always use Tailwind utility classes for CSS.** Do not write plain CSS, scoped `<style>` blocks, or inline `style` attributes unless Tailwind genuinely cannot express the rule (e.g. complex keyframes). When extending the design system, add tokens/utilities to `tailwind.config.mjs` or `style/base.css` rather than writing one-off CSS in components.

Global base styles are in `style/base.css` (at repo root, not `src/`), imported from `src/layouts/Layout.astro`. Tailwind is configured in `tailwind.config.mjs`. Component-scoped styles use `@reference "tailwindcss"` to access utilities without re-importing the full stylesheet.

Custom utility classes defined in `style/base.css`:

- `.container` — responsive max-width wrapper
- `.container-narrow` — narrow centred content block (max-w-3xl)
- `.btn` — outlined button with hover state

### Prettier

Uses tabs, single quotes, no semicolons, no trailing commas, 100-char line width. Plugins: `prettier-plugin-astro` and `prettier-plugin-tailwindcss`.
