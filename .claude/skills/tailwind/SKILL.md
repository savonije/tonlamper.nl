---
name: tailwind
description: >-
    Use whenever writing or editing Tailwind utility classes in this repo's .astro,
    .vue, or .css files. This is a Tailwind v4 project (config lives in CSS, not
    tailwind.config.mjs) — the theme is defined in an `@theme` block in
    src/style/base.css. Enforces using the project's EXISTING theme tokens (the
    paper/ink palette, accent, custom text sizes, tracking) and the standard utility
    scale instead of inventing arbitrary values or hardcoding hex. Don't assume or
    make up tokens: look them up in src/style/base.css or add them to the `@theme`
    block.
---

# Tailwind conventions for this project

**Golden rule: use the theme tokens and the utility scale. Don't invent, assume, or
hardcode values.** The point of the scale and the `@theme` tokens is consistency —
reach for them first, every time.

## Setup facts (don't re-derive)

- **Tailwind v4**, integrated via the `@tailwindcss/vite` plugin (see `astro.config.mjs`),
  **not** the Astro Tailwind integration.
- **The config lives in CSS, not JS.** `tailwind.config.mjs` exists but is essentially
  empty (`theme: { extend: {} }`) — ignore it. Tailwind is imported with
  `@import 'tailwindcss'` at the top of **`src/style/base.css`**, and the theme lives in
  an **`@theme { … }`** block in that same file.
- **No class prefix.** Use plain utilities (`flex`, `text-sm`, `bg-paper`).
- **Astro static site + one Vue island.** Templates are `.astro` pages/components plus
  `src/components/Portfolio.vue` (the portfolio filter, `client:idle`). There is **no
  PrimeVue, no CMS, no dark mode**.
- **Alias:** `@styles/*` → `src/style/*` (note: alias is plural, the folder is singular
  `style/`). Component `<style>` blocks that need utilities pull them in with
  `@reference '@styles/base.css'` (see `Menu.astro`, `Portfolio.vue`).
- **Prettier** uses **tabs**, single quotes, no semicolons, no trailing commas, 80-char
  width, with `prettier-plugin-astro` + `prettier-plugin-tailwindcss`. The tailwind
  plugin **sorts class lists automatically** — don't hand-order classes.
- **There is no `format` or `type-check` npm script.** Run `npx prettier --write <files>`
  to sort/format, and `npm run build` (which runs `astro check` then builds) to
  type-check and confirm the CSS compiles.

## 1. Use scale utilities, not arbitrary px

Prefer the scale step over an arbitrary bracket value:

```html
<!-- ✅ use the scale -->
class="px-6 py-3.5 gap-3 text-2xl rounded-full mb-9"

<!-- ❌ don't invent magic numbers -->
class="px-[24px] py-[14px] text-[26px] rounded-[999px] mb-[36px]"
```

This applies to spacing (`p/m/gap/space`), sizing (`w/h/size/min/max`), `text-*`,
`rounded-*`, `leading-*`, `tracking-*`, insets, etc. Arbitrary `[…]` values are a
genuine last resort — the codebase uses only a handful (`h-[1.5px]`, `max-w-[40ch]`,
fluid `clamp()` type) and only where no scale step fits.

**Watch for arbitrary values that just re-spell an existing token or scale step:**
`text-[2.625rem]` is the `text-display` token; `scale-[1.04]` should be one consistent
zoom value, not three near-identical guesses.

## 2. Use the project's theme tokens, not raw hex / one-off values

Custom tokens are defined in the `@theme` block of `src/style/base.css`. Always use
the named utility they generate — and **never fall back to the default palette's
`white`/`black`/`gray-*` when a paper/ink token is the intended color:**

```html
<!-- ✅ -->
class="bg-paper text-ink border-line-2 text-accent font-mono text-2xs tracking-label"
<!-- ❌ -->
class="bg-white text-[#16161a] border-black text-[#002fa7]"
```

Currently defined custom tokens (confirm against `src/style/base.css` before use):

- **Fonts:** `font-serif` (EB Garamond, body), `font-display` (Cormorant Garamond,
  headings), `font-mono` (IBM Plex Mono, labels/CTAs). Use the `font-*` utility —
  **never write `font-family: var(--font-*)` in raw CSS.**
- **Paper & ink palette:** `paper` (#f5f3ec), `ink` (#16161a), `ink-2`, `ink-3`,
  `accent` (Klein blue #002fa7), `line` / `line-2` (hairline borders). Generates
  `bg-/text-/border-*` etc. `border` with no color defaults to `line` (set in
  `@layer base`).
- **Type extras:** `text-2xs` (11.5px), `text-3xs` (10.5px), `text-display` (42px,
  sits between `text-3xl` and `text-5xl`).
- **Tracking:** `tracking-label` (0.13em), `tracking-label-wide` (0.22em) for uppercase
  mono labels.

The default Tailwind palette and scale (`text-3xl`, `gap-2.5`, `max-w-3xl`, …) is also
available and preferred for everything the custom tokens don't cover.

## 3. Need a value that isn't in the system? Add it to `@theme` — don't inline it

If you genuinely need a new recurring token (a color, text size, tracking, etc.),
**add it to the `@theme` block in `src/style/base.css`** using the v4 naming convention
(`--color-*`, `--text-*`, `--tracking-*`, `--font-*`), so it becomes a reusable utility.
Don't scatter one-off arbitrary values the next person has to guess at.

## 4. Component styling: utilities first, `<style>` only when necessary

Per `CLAUDE.md`, **use Tailwind utility classes in the template.** Do not write plain
CSS, inline `style` attributes, or `<style>` blocks unless Tailwind genuinely cannot
express the rule. Legitimate exceptions actually used here:

- **Pseudo-elements and parent-state/descendant selectors** — e.g. the menu underline
  `a::after`, or `.is-active .menu-label`. These live in `<style>` blocks in
  `Menu.astro` / `Portfolio.vue`, opened with `@reference '@styles/base.css'` so
  `@apply` can reach the tokens.
- **Keyframe-style transforms & multi-easing transitions** — the `.btn` growing accent
  circle and the `[data-reveal]` scroll reveal (see §5 caveat).

Even inside a `<style>` block, express everything you can with `@apply` + tokens
(`@apply font-mono text-2xs tracking-label`), not raw declarations.

- **Static inline `style` is a smell:** `style="transition-delay: 100ms"` → `delay-100`.
  Inline `style` is only justified for genuinely **dynamic** values (e.g.
  `style={\`transition-delay: ${i * 70}ms\`}` for a per-item stagger).

## 5. base.css: prefer `@apply`, but keep transform-driven animation raw

`src/style/base.css` holds element base styles and helper classes (`.container`, `.btn`,
`.eyebrow`, `.mono-label`, …). **Express rules with `@apply` and the theme tokens
wherever a utility exists** — including `antialiased`, `mix-blend-multiply`,
`content-['']`, `pointer-events-none`, etc.

**The one deliberate exception — leave these as raw CSS:**

- `transform` + its `transition` on `.btn::before`, `.btn:hover::before`, and
  `[data-reveal]`. These animate the **`transform` shorthand**, and Tailwind v4's
  `translate-*` / `scale-*` can compile to the separate `translate:` / `scale:`
  properties — which `transition-transform` would **not** animate, silently breaking the
  button hover circle and the scroll reveal. Keep the transform/transition lines raw
  (they carry an inline comment saying so).
- The `body::after` paper-grain `background-image` (SVG data URI), `text-rendering`, and
  `::view-transition-*` rules — no utility equivalents.

Note that maximizing `@apply` in base.css does introduce a few arbitrary-bracket
utilities for off-scale base values (`text-[19px]`, `z-[90]`, `opacity-[0.055]`). That's
an accepted trade-off there since those values pre-existed as raw CSS — but in
**templates**, §1 still applies: reach for the scale first.

## 6. Dark mode

**Dark mode is not used.** No `@theme` dark tokens, no `dark:` variants anywhere.
**Don't add `dark:` classes** — they have no effect and no design has been defined for
them.

## Workflow before writing/editing classes

1. Open `src/style/base.css` (`@theme` block) → is there already a token / scale step
   for this? (fonts, `paper`/`ink`/`accent`/`line`, `text-2xs`/`text-display`,
   `tracking-label`.)
2. Grep a sibling for how the same thing is expressed — e.g. `ExpositionCard.astro` /
   `Portfolio.vue` for cards & image-hover zoom, `.btn` / `.eyebrow` / `.mono-label` in
   `base.css` for the label and CTA patterns — and match it.
3. Reach for the scale utility or theme token. Only fall back to `[arbitrary]` when
   nothing fits; prefer adding a token to `@theme` for anything recurring.
4. Use Tailwind responsive breakpoints (`sm/md/lg/xl`) for layout.
5. Run `npx prettier --write <files>` (sorts classes) and `npm run build` after edits.
