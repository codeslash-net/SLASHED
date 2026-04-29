# Visual Utilities — Opt-in Layer

These utilities are **not** part of SLASHED core. They live in `css/slashed-utilities-visual.css` and are loaded separately. See [SPEC.md](SPEC.md) pillar #2 for the BEM-vs-utility boundary.

---

## Installation

### Static sites

```html
<link rel="stylesheet" href="css/slashed-full.css">
<link rel="stylesheet" href="css/slashed-utilities-visual.css"> <!-- opt-in -->
```

### WordPress / Bricks Builder

```php
add_action('wp_enqueue_scripts', function() {
  $dir = get_stylesheet_directory() . '/slashed/css';
  $uri = get_stylesheet_directory_uri() . '/slashed/css';

  wp_enqueue_style('slashed',        "$uri/slashed-full.css",                [], filemtime("$dir/slashed-full.css"));
  wp_enqueue_style('slashed-visual', "$uri/slashed-utilities-visual.css", ['slashed'], filemtime("$dir/slashed-utilities-visual.css"));
});
```

### Cascade layer

All rules in this file are wrapped in `@layer slashed.visual`, ranked **after** `slashed.utilities` and **before** `slashed.a11y` in the framework's layer order. This means:

- A BEM rule (unlayered) on `.cs-card` that sets `background: var(--color-surface)` **beats** `.bg-primary` from this file. Visual utilities cannot accidentally override component styling.
- An a11y override in `slashed.a11y` (e.g. `prefers-reduced-data` for gradients) beats visual utilities. Accessibility preferences always win.

---

## Catalog — 98 classes

### Border width / style (11)

| Class | Value |
|-------|-------|
| `.border` | `1px solid var(--color-border)` all sides |
| `.border-0` | `border: 0` |
| `.border-2` | `border-width: 2px` (color inherited) |
| `.border-b` | `border-block-end: 1px solid var(--color-border)` |
| `.border-t` | `border-block-start: 1px solid var(--color-border)` |
| `.border-l` | `border-inline-start: 1px solid var(--color-border)` |
| `.border-r` | `border-inline-end: 1px solid var(--color-border)` |
| `.border-x` | `border-inline: 1px solid ...; border-block: 0` |
| `.border-y` | `border-block: 1px solid ...; border-inline: 0` |
| `.border-dashed` | `border-style: dashed` |
| `.border-dotted` | `border-style: dotted` |

### Border color (4)

| Class | Value |
|-------|-------|
| `.border-primary` | `border-color: var(--primary)` |
| `.border-strong` | Full shorthand with `var(--color-border-strong)` |
| `.border-subtle` | Full shorthand with `var(--color-border-subtle)` |
| `.accent-primary` | `accent-color: var(--primary)` (for native form controls) |

### Border radius (8)

| Class | Value |
|-------|-------|
| `.rounded-none` | `0` |
| `.rounded-xs` | `var(--radius-xs)` |
| `.rounded-s` | `var(--radius-s)` |
| `.rounded-m` | `var(--radius-m)` |
| `.rounded-l` | `var(--radius-l)` |
| `.rounded-xl` | `var(--radius-xl)` |
| `.rounded-2xl` | `var(--radius-2xl)` |
| `.rounded-full` | `var(--radius-full)` (9999px) |

### Background — semantic (17)

Surface tones:

| Class | Value |
|-------|-------|
| `.bg-surface` | `var(--color-surface)` |
| `.bg-surface-2` | `var(--color-surface-2)` |
| `.bg-surface-elevated` | `var(--color-surface-elevated)` |
| `.bg-surface-overlay` | `var(--color-surface-overlay)` |
| `.bg-transparent` | `transparent` |
| `.bg-inherit` | `inherit` |
| `.bg-gradient` | Theme gradient (primary → accent by default) |
| `.bg-light`, `.bg-ultra-light` | Forced light-mode surfaces |
| `.bg-dark`, `.bg-ultra-dark` | Forced dark-mode surfaces |

Brand and status:

| Class | Value |
|-------|-------|
| `.bg-primary`, `.bg-secondary`, `.bg-accent` | Brand color |
| `.bg-success`, `.bg-warning`, `.bg-error` | Status color |

### Background — palette access (19)

Scale-level access to brand / status / neutral palettes:

- `.bg-primary-50`, `-100`, `-200`, `-700`, `-800`, `-900`, `-950`
- `.bg-secondary-100`, `-800`, `-900`
- `.bg-accent-100`, `-800`, `-900`
- `.bg-neutral-100`, `-800`, `-900`
- `.bg-success-100`, `.bg-warning-100`, `.bg-error-100`

### Shadow (10)

| Class | Value |
|-------|-------|
| `.shadow-none` | `none` |
| `.shadow-xs`, `.shadow-s`, `.shadow-m`, `.shadow-l`, `.shadow-xl` | Scale tokens |
| `.shadow-float` | Larger, softer elevation |
| `.shadow-glow` | Colored halo (uses `--primary`) |
| `.shadow-colored` | Configurable via `--shadow-color` custom property |
| `.shadow-inner` | `inset` shadow |

### Opacity (4)

| Class | Value |
|-------|-------|
| `.opacity-0` | `0` |
| `.opacity-50` | `0.5` |
| `.opacity-80` | `0.8` |
| `.opacity-100` | `1` |

### Animation (4)

Keyframe-based entry animations. Keyframes themselves (`fade-in`, `slide-up`, `scale-in`, `spin`) are defined in `slashed-core.css`.

| Class | Animation |
|-------|-----------|
| `.animate-fade-in` | Opacity 0 → 1 |
| `.animate-slide-up` | Translate up + fade in |
| `.animate-scale-in` | Scale up + fade in |
| `.animate-spin` | Infinite 360° rotation |

### Transition (6)

| Class | Effect |
|-------|--------|
| `.transition` | Default: color, bg, border, shadow, opacity, transform, translate, scale |
| `.transition-colors` | Only color/bg/border-color |
| `.transition-shadow` | Only box-shadow |
| `.transition-transform` | Only transform/translate/scale |
| `.transition-fast` | Uses `var(--duration-fast)` |
| `.transition-none` | `transition: none` |

### Filter / effects (4)

| Class | Effect |
|-------|--------|
| `.backdrop-blur` | `backdrop-filter: blur(8px)` |
| `.grayscale` | `filter: grayscale(1)` |
| `.grayscale-0` | `filter: grayscale(0)` |
| `.isolation-isolate` | `isolation: isolate` (creates new stacking context) |

### Fill / stroke — non-currentColor (9)

SVG color utilities. `.fill-current` and `.stroke-current` remain in core (they're currentColor passthroughs, functionally necessary). This file adds explicit color values:

| Class | Value |
|-------|-------|
| `.fill-primary`, `.fill-success`, `.fill-warning`, `.fill-error`, `.fill-white`, `.fill-none` | SVG fill |
| `.stroke-none` | `stroke: none` |
| `.stroke-width-1`, `.stroke-width-2` | SVG stroke-width |

### Text decorative (2)

| Class | Effect |
|-------|--------|
| `.text-gradient` | Gradient-filled text (uses `--text-gradient` or primary → accent) |
| `.text-box-trim` | Tight text-box trimming (Chrome 135+, fallback: normal) |

---

## Comparison: BEM-first vs visual-utilities usage

### Without `slashed-utilities-visual.css` (recommended)

```html
<div class="my-card">
  <h3 class="my-card__title">Heading</h3>
  <p class="my-card__body">Text</p>
</div>

<style>
  .my-card {
    background: var(--color-surface-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-m);
    box-shadow: var(--shadow-s);
    padding: var(--space-l);
  }
  .my-card__title { font-weight: 600; margin: 0 0 var(--space-s); }
  .my-card__body  { color: var(--color-text-muted); margin: 0; }
</style>
```

### With `slashed-utilities-visual.css`

```html
<div class="bg-surface-2 border border-subtle rounded-m shadow-s p-l">
  <h3 class="font-semi mb-s">Heading</h3>
  <p class="text-muted">Text</p>
</div>
```

Both produce identical output. The first scales to teams and long-lived codebases better; the second ships faster in a one-day project. Both are valid — choose per project, not per element.
