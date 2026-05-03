# Utilities Reference

Complete catalog of SLASHED utility classes. Utilities are unprefixed, short, and composable.

## What belongs here

Utilities in `slashed-utilities.css` serve three roles:

1. **Layout engine configuration** — display, flex, grid, gap, sizing, position, col-span, aspect ratios, container queries.
2. **Functional and a11y helpers** — `.hidden`, `.sr-only`, `.cursor-*`, `.overflow-*`, `.scroll-*`, `.pointer-events-*`, `.z-*`.
3. **Inline typographic composition** — `.text-muted`, `.font-semi`, `.italic`, `.uppercase`, `.line-through` on short inline elements where spinning up a new BEM class for one span would be overkill.

---

## Spacing

### Padding

| Class | Value |
|-------|-------|
| `.p-0` | `padding: 0` |
| `.p-px` | `padding: var(--space-px)` |
| `.p-0-5` | `padding: var(--space-0-5)` |
| `.p-2xs` | `padding: var(--space-2xs)` |
| `.p-xs` | `padding: var(--space-xs)` |
| `.p-s` | `padding: var(--space-s)` |
| `.p-m` | `padding: var(--space-m)` |
| `.p-l` | `padding: var(--space-l)` |
| `.p-xl` | `padding: var(--space-xl)` |
| `.p-2xl` | `padding: var(--space-2xl)` |
| `.p-3xl` | `padding: var(--space-3xl)` |
| `.p-4xl` | `padding: var(--space-4xl)` |

**Directional variants** — `.px-*` (inline), `.py-*` (block), `.pt-*` (block-start), `.pb-*` (block-end):

```html
<div class="px-l py-m">Horizontal l, vertical m</div>
<div class="pt-xl pb-s">Top xl, bottom s</div>
```

**Special:** `.px-gutter` applies `var(--space-gutter)` — aligned with page grid.

### Margin

| Class | Value |
|-------|-------|
| `.m-auto` | `margin: auto` (flex/grid centering) |
| `.mx-auto` | `margin-inline: auto` |
| `.mt-auto` | `margin-block-start: auto` (push to bottom in flex col) |
| `.mb-auto` | `margin-block-end: auto` |
| `.ms-auto` | `margin-inline-start: auto` (push to right in LTR) |
| `.me-auto` | `margin-inline-end: auto` |
| `.mt-0` through `.mt-4xl` | Top margin scale |
| `.mb-0` through `.mb-4xl` | Bottom margin scale |
| `.mx-2xs` through `.mx-xl` | Horizontal margin scale |

### Gap

```html
<div class="flex gap-m">…</div>
<div class="grid gap-l">…</div>
```

| Class | Value |
|-------|-------|
| `.gap-0` | `gap: 0` |
| `.gap-2xs` through `.gap-4xl` | Gap scale |
| `.gap-x-*` | Column gap only |
| `.gap-y-*` | Row gap only |

---

## Typography

### Font size

| Class | Value (from tokens) |
|-------|---------------------|
| `.text-2xs` | `var(--text-2xs)` |
| `.text-xs` | `var(--text-xs)` |
| `.text-s` | `var(--text-s)` |
| `.text-m` | `var(--text-m)` |
| `.text-l` | `var(--text-l)` |
| `.text-xl` | `var(--text-xl)` |
| `.text-2xl` through `.text-5xl` | Progressive scale |
| `.text-fluid-hero` | Extra-fluid for hero titles |

### Semantic heading scale

When visual size needs to differ from semantic HTML level:

```html
<p class="h2">Large display text (but not an h2 in DOM)</p>
<h1 class="h3">Small h1 for sidebar</h1>
```

Classes: `.h1`, `.h2`, `.h3`, `.h4`, `.h5`, `.h6`

### Font weight

| Class | Weight |
|-------|--------|
| `.font-light` | 300 |
| `.font-normal` | 400 |
| `.font-medium` | 500 |
| `.font-semi` | 600 |
| `.font-bold` | 700 |
| `.font-extrabold` | 800 |
| `.font-black` | 900 |

### Style, transform, decoration

| Class | Effect |
|-------|--------|
| `.italic` | `font-style: italic` |
| `.uppercase` | `text-transform: uppercase` |
| `.lowercase` | `text-transform: lowercase` |
| `.capitalize` | `text-transform: capitalize` |
| `.underline` | `text-decoration: underline` |
| `.line-through` | `text-decoration: line-through` |
| `.no-underline` | `text-decoration: none` |
| `.link-reset` | `color: var(--color-text); text-decoration: none` (links inside surfaces that already imply clickability) |
| `.text-eyebrow` | `font-weight: 700` + `letter-spacing: var(--tracking-widest)` + `text-transform: uppercase` (consolidated eyebrow primitive) |

### Line height

| Class | Value |
|-------|-------|
| `.leading-none` | `1` (stat / number displays) |
| `.leading-tight` | `var(--leading-tight)` (~1.15) |
| `.leading-snug` | `var(--leading-snug)` (~1.3) |
| `.leading-normal` | `var(--leading-normal)` (~1.5) |
| `.leading-loose` | `var(--leading-loose)` (~1.8) |

### Letter spacing

| Class | Value |
|-------|-------|
| `.tracking-tighter` | `-0.05em` |
| `.tracking-tight` | `-0.02em` |
| `.tracking-wide` | `0.05em` |
| `.tracking-wider` | `0.08em` |
| `.tracking-widest` | `0.14em` |

### Alignment & wrapping

```html
<p class="text-left">Left-aligned</p>
<p class="text-center">Center</p>
<p class="text-right">Right (end in LTR)</p>
<h1 class="text-balance">Balanced wrapping (better for headings)</h1>
<p class="text-pretty">Pretty wrapping (better for paragraphs)</p>
```

---

## Colors

### Text color

| Class | Color |
|-------|-------|
| `.text-primary`, `.text-secondary`, `.text-accent` | Brand |
| `.text-muted` | Secondary text |
| `.text-subdued` | Tertiary text |
| `.text-faint` | Quaternary / placeholder text |
| `.text-success`, `.text-warning`, `.text-error` | Status |
| `.text-on-primary`, `.text-on-dark` | Contrast text |

> **Note:** Background color utilities (`.bg-primary`, `.bg-surface-2`, etc.), border color utilities (`.border-primary`, etc.), and SVG fill/stroke color utilities are in the opt-in `slashed-utilities-visual.css`. See [UTILITIES-VISUAL.md](UTILITIES-VISUAL.md).

---

## Layout — Display

```html
<div class="flex">…</div>
<div class="grid">…</div>
<div class="block">…</div>
<div class="inline-block">…</div>
<div class="inline-flex">…</div>
<div class="hidden">…</div>
```

| Class | Value |
|-------|-------|
| `.block` | `display: block` |
| `.inline-block` | `display: inline-block` |
| `.inline` | `display: inline` |
| `.flex` | `display: flex` |
| `.inline-flex` | `display: inline-flex` |
| `.grid` | `display: grid` |
| `.inline-grid` | `display: inline-grid` |
| `.contents` | `display: contents` |
| `.hidden` | `display: none` |

---

## Layout — Flex

| Class | Value |
|-------|-------|
| `.flex-row` | `flex-direction: row` |
| `.flex-row-reverse` | `flex-direction: row-reverse` |
| `.flex-col` | `flex-direction: column` |
| `.flex-wrap` | `flex-wrap: wrap` |
| `.flex-nowrap` | `flex-wrap: nowrap` |
| `.flex-1` | `flex: 1 1 0%` |
| `.flex-auto` | `flex: 1 1 auto` |
| `.flex-none` | `flex: none` |
| `.grow` / `.grow-0` | `flex-grow: 1 / 0` |
| `.shrink` / `.shrink-0` | `flex-shrink: 1 / 0` |

---

## Layout — Grid

```html
<div class="grid md:grid-3 gap-m">…</div>
```

### Responsive grids (mobile-first)

| Class | Behavior |
|-------|----------|
| `.grid-1` through `.grid-12` | Stacked on xs, 2-col at ≥30em for `.grid-4` and wider, N-col at ≥48em |

### Variable-column grid

Single primitive driven by an inline instance token:

```html
<div class="grid-cols" style="--cols: 3">…</div>
```

| Class | Instance token | Default |
|-------|----------------|---------|
| `.grid-cols` | `--cols` | `1` |
| `.grid-cols` | `--grid-gap` | `var(--space-gap)` |

### Span utilities (grid children)

| Class | Value |
|-------|-------|
| `.col-span-2`, `.col-span-3`, `.col-span-4`, `.col-span-5`, `.col-span-6` | `grid-column: span N` |
| `.col-span-full` | `grid-column: 1 / -1` |
| `.row-span-2` | `grid-row: span 2` |
| `.row-span-3` | `grid-row: span 3` |
| `.row-span-4` | `grid-row: span 4` |

---

## Layout — Alignment

### Align items

| Class | Value |
|-------|-------|
| `.items-start` | `align-items: flex-start` |
| `.items-center` | `align-items: center` |
| `.items-end` | `align-items: flex-end` |
| `.items-baseline` | `align-items: baseline` |
| `.items-stretch` | `align-items: stretch` |

### Justify content

| Class | Value |
|-------|-------|
| `.justify-start` | `justify-content: flex-start` |
| `.justify-center` | `justify-content: center` |
| `.justify-end` | `justify-content: flex-end` |
| `.justify-between` | `justify-content: space-between` |
| `.justify-around` | `justify-content: space-around` |
| `.justify-evenly` | `justify-content: space-evenly` |

### Self-alignment (grid/flex children)

| Class | Value |
|-------|-------|
| `.self-start` | `align-self: flex-start` |
| `.self-center` | `align-self: center` |
| `.self-end` | `align-self: flex-end` |
| `.self-stretch` | `align-self: stretch` |
| `.self-auto` | `align-self: auto` (inherits container `align-items`) |

---

## Position

| Class | Value |
|-------|-------|
| `.static` | `position: static` (resets any position) |
| `.relative` | `position: relative` |
| `.absolute` | `position: absolute` |
| `.fixed` | `position: fixed` |
| `.sticky` | `position: sticky; top: 0` |

### Inset

| Class | Value |
|-------|-------|
| `.inset-0` | `inset: 0` |
| `.inset-x-0` | `inset-inline: 0` |
| `.inset-y-0` | `inset-block: 0` |
| `.top-0`, `.right-0`, `.bottom-0`, `.left-0` | Physical offsets |
| `.start-0`, `.end-0` | Logical (LTR/RTL aware) |

### Z-index

| Class | Value |
|-------|-------|
| `.z-below` | `z-index: var(--z-below)` (−1) — behind page flow |
| `.z-base` | `z-index: var(--z-base)` (0) |
| `.z-raised` | `z-index: var(--z-raised)` (1) |
| `.z-docked` | `z-index: var(--z-docked)` (10) |
| `.z-above` | `z-index: var(--z-above)` (100) |
| `.z-sticky` | `z-index: var(--z-sticky)` (1100) |
| `.z-dropdown` | `z-index: var(--z-dropdown)` (1150) |
| `.z-banner` | `z-index: var(--z-banner)` (1200) |
| `.z-overlay` | `z-index: var(--z-overlay)` (1300) |
| `.z-modal` | `z-index: var(--z-modal)` (1400) |
| `.z-popover` | `z-index: var(--z-popover)` (1500) |
| `.z-toast` | `z-index: var(--z-toast)` (1700) |
| `.z-tooltip` | `z-index: var(--z-tooltip)` (1800) |
| `.z-max` | `z-index: var(--z-max)` (999999) — emergency override |

---

## Sizing

### Width

Three axes with explicit prefix:

- **Parent-relative fractions** — share of the parent box.
- **Viewport-relative** — share of the viewport width.
- **Content-width-relative** — share of `--content-width`, auto-centered.

| Class | Value |
|-------|-------|
| `.w-full` | `width: 100%` |
| `.w-auto` | `width: auto` |
| `.w-fit` | `width: fit-content` |
| `.w-min` | `width: min-content` |
| `.w-max` | `width: max-content` |
| `.w-1/2`, `.w-1/3`, `.w-2/3`, `.w-1/4`, `.w-3/4` | Parent-relative fractions |
| `.w-vw-10` … `.w-vw-100` | Viewport width in 10% steps |
| `.w-content-1/4`, `.w-content-1/3`, `.w-content-1/2`, `.w-content-2/3`, `.w-content-3/4`, `.w-content-full` | Content-track fractions, centered |

### Height

| Class | Value |
|-------|-------|
| `.h-full` | `height: 100%` |
| `.h-screen` | `height: 100vh / 100dvh` |
| `.h-svh` | `height: 100svh` (mobile-safe) |
| `.h-auto` | `height: auto` |
| `.h-fit` | `height: fit-content` |
| `.h-min` | `height: min-content` |
| `.h-max` | `height: max-content` |

### Min / max

| Class | Value |
|-------|-------|
| `.min-w-0` | `min-width: 0` (allows flex/grid children to shrink past content width) |
| `.min-w-full` | `min-width: 100%` |
| `.min-h-0` | `min-height: 0` |
| `.min-h-screen` | `min-height: 100vh / 100dvh` |
| `.max-w-full` | `max-width: 100%` |
| `.max-w-none` | `max-width: none` (reset) |
| `.max-w-prose` | `max-width: var(--container-prose)` (~65ch for reading) |
| `.max-h-full` | `max-height: 100%` |
| `.max-h-screen` | `max-height: 100vh / 100dvh` |

### Measure (centred reading widths)

Pair `margin-inline: auto` with `max-inline-size`. Use for centred text
columns with explicit rem widths (sourced from blueprints audit pass #2).
Distinct from `.max-w-prose`, which uses the `--container-prose` token at
65ch — `.measure-*` preserves the explicit rem values measured in
wireframes.

| Class | Value |
|-------|-------|
| `.measure-xs` | `40rem` |
| `.measure-s` | `42rem` |
| `.measure-m` | `44rem` |
| `.measure-l` | `48rem` |
| `.measure-xl` | `56rem` |
| `.measure-2xl` | `64rem` |

### Aspect ratio

| Class | Value |
|-------|-------|
| `.aspect-square` | `1 / 1` |
| `.aspect-video` | `16 / 9` |
| `.aspect-4-3` | `4 / 3` |
| `.aspect-3-2` | `3 / 2` |

---

## Borders, radii, shadows

**Moved to opt-in visual layer.** Border width/style/color utilities (`.border`, `.border-t`, `.border-primary`, `.border-subtle`, etc.), border-radius utilities (`.rounded-xs` … `.rounded-full`), and shadow utilities (`.shadow-xs` … `.shadow-xl`, `.shadow-float`, `.shadow-glow`, `.shadow-colored`, `.shadow-inner`) live in `slashed-utilities-visual.css`. See [UTILITIES-VISUAL.md](UTILITIES-VISUAL.md).

For in-core use, set these properties directly in a BEM rule using design tokens:

```css
.my-block__card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-m);
  box-shadow: var(--shadow-s);
}
```

---

## Overflow

`.overflow-hidden`, `.overflow-auto`, `.overflow-scroll`, `.overflow-visible`
`.overflow-x-auto`, `.overflow-y-auto`, etc.

---

## Object fit / position

`.object-cover`, `.object-contain`, `.object-fill`, `.object-scale-down`
`.object-center`, `.object-top`, `.object-bottom`, `.object-left`, `.object-right`

---

## Cursor

`.cursor-pointer`, `.cursor-default`, `.cursor-not-allowed`, `.cursor-wait`, `.cursor-text`, `.cursor-grab`, `.cursor-grabbing`

---

## Transitions & animations

`.transition*` and `.animate-*` classes are in the opt-in [visual layer](UTILITIES-VISUAL.md). Duration and easing are exposed as design tokens (`--duration-fast`, `--duration-normal`, `--ease-out`, etc.) for use in BEM rules — they are not shipped as standalone utility classes.

### Motion-safe animations

Only run when user hasn't opted for reduced motion. These retain their declarations even though the un-prefixed base classes moved to visual — they reference keyframes still defined in `slashed-core.css`:

| Class | Animation |
|-------|-----------|
| `.motion-safe:transition` | Smooth transition |
| `.motion-safe:animate-fade-in` | Fade in on load |
| `.motion-safe:animate-slide-up` | Slide up on load |
| `.motion-safe:animate-scale-in` | Scale in on load |
| `.motion-safe:animate-spin` | Infinite spin |
| `.motion-safe:hover-lift` | Hover: lift + shadow |

### Motion-reduce overrides

| Class | Effect |
|-------|--------|
| `.motion-reduce:animate-none` | Disable animations |
| `.motion-reduce:transition-none` | Disable transitions |
| `.motion-reduce:animate-fade-in` | Skip animation, show immediately |

---

## Responsive variants

Prefix any layout utility with a breakpoint to apply it only at that viewport and up:

| Breakpoint | Min width | Prefix |
|------------|-----------|--------|
| `sm` | 30em (480px) | `.sm:*` |
| `md` | 48em (768px) | `.md:*` |
| `lg` | 64em (1024px) | `.lg:*` |
| `xl` | 80em (1280px) | `.xl:*` |

```html
<!-- Stacked on mobile, 3-column on md+, 4-column on lg+ -->
<div class="grid md:grid-3 lg:grid-4 gap-m md:gap-l">
  …
</div>

<!-- Hidden on mobile, visible on md+ -->
<nav class="hidden md:flex items-center gap-l">…</nav>

<!-- Centered on mobile, left-aligned on md+ -->
<div class="text-center md:text-left">…</div>
```

**Responsive classes available:**
- `display`: flex, block, grid, hidden
- `flex-direction`: flex-row, flex-col
- `grid`: grid-2, grid-3, grid-4
- `alignment`: items-*, justify-*
- `gap`: gap-m, gap-l, gap-xl
- `text-align`: text-left, text-center, text-right
- `spacing zero resets`: p-0, pt-0, pb-0, mt-0, mb-0, gap-0
- `col-span`: col-span-2, col-span-full
- `order`: order-first, order-last, order-none

---

## Print utilities

| Class | Effect |
|-------|--------|
| `.print:hidden` | Hide when printing |
| `.print:block` | Show as block when printing |
| `.print:text-black` | Force black text for print |
| `.print:bg-white` | Force white background |
| `.print:shadow-none` | Remove shadows for print |
| `.print:p-0`, `.print:m-0` | Zero spacing for print |

---

## Dark mode variants

When the user's system is in dark mode AND `data-theme` is not set to `light`:

| Class | Effect |
|-------|--------|
| `.dark:hidden` | Hide in dark mode |
| `.dark:block` | Show in dark mode |
| `.dark:bg-surface` | Dark-specific background |
| `.dark:text-white` | Dark-specific text color |

---

## Accessibility utilities

| Class | Purpose |
|-------|---------|
| `.sr-only` | Screen reader only (visually hidden) |
| `.not-sr-only` | Undo `.sr-only` |

---

## Composition example

> **Note:** Classes like `rounded-l`, `bg-surface`, `shadow-s`, `border`, `border-subtle`, `transition`, and `motion-safe:hover-lift` in the example below come from the opt-in `slashed-utilities-visual.css`. Load that file alongside core utilities to use them.

```html
<article class="flex items-center gap-m p-l rounded-l bg-surface shadow-s border border-subtle transition motion-safe:hover-lift">
  <img src="…" class="w-16 h-16 rounded-full object-cover shrink-0" alt="">
  <div class="flex-1 min-w-0">
    <h3 class="text-l font-semi leading-tight text-balance">Title</h3>
    <p class="text-s text-muted leading-normal mt-2xs">Subtitle or description.</p>
  </div>
  <a href="#" class="cs-btn--ghost shrink-0">View →</a>
</article>
```

---

## When to use utilities vs BEM

### Use utilities for:

- **Layout configuration** — `.flex`, `.grid`, `.items-center`, `.justify-between`, `.gap-m`, `.col-span-2`
- **Spacing** — `.p-m`, `.mx-auto`, `.mt-xl`, `.pt-2xl`
- **Sizing, position, overflow, aspect** — `.w-full`, `.sticky`, `.overflow-hidden`, `.aspect-video`
- **Functional / a11y** — `.sr-only`, `.hidden`, `.cursor-pointer`, `.pointer-events-none`
- **Inline typographic composition** on short text nodes — `.text-muted` on a `<span>` timestamp, `.font-semi` on emphasized words, `.italic` on a book title, `.line-through` on a completed item

### Use BEM + tokens for:

- **Decoration of the block itself** — background, border, border-radius, shadow, opacity, transition, animation, filter
- **Repeated named components** — `.cs-card`, `.cs-btn`, etc. (or your own `.project-block__element` if the pattern is variant-specific)
- **Multi-property styling** where semantic naming aids readability
- **Everything that sets a value that would otherwise require a utility that doesn't exist in core** — write the BEM rule with `var(--token)`

### When prototyping with utility-first ergonomics

Load [`slashed-utilities-visual.css`](UTILITIES-VISUAL.md) as an additional stylesheet. It ships the 98 decorative utility classes that the core intentionally excludes (`.bg-primary`, `.rounded-m`, `.shadow-s`, etc.). Opt in per project.

### The guiding rule

Every element you write already has (or will have) a BEM class for its role. If the style you're about to apply is decoration of that block, put it in the block's CSS rule with a design token. Utilities in SLASHED core never duplicate what a tokens-driven BEM rule can already express on the main block.
