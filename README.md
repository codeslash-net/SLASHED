# SLASHED

**S**tandalone · **L**ean · **A**gnostic · **S**tructured · **H**ybrid · **E**dgeless · **D**eterministic

A buildless CSS framework for WordPress, Bricks Builder, and static sites. BEM-first, token-driven, cascade-layered, zero-dependency.

| | |
|---|---|
| **Standalone** | Zero build step, zero npm, zero bundler: one `<link>` tag and the framework is fully operational. |
| **Lean** | Every class earns its place across real use cases; decoration ships in a separate opt-in file rather than bloating the core. |
| **Agnostic** | The same stylesheet runs unchanged in WordPress, Bricks, Astro, plain HTML, or anything else without modification. |
| **Structured** | Cascade layers, BEM, and design tokens — every rule has a named, predictable home and nothing collides by accident. |
| **Hybrid** | Layout primitives, components, and utilities coexist because real UIs need all three, and the boundary between them is explicit, not blurry. |
| **Edgeless** | The framework never blocks the consumer from doing what they need — there is always a clean path around or through it, by design. |
| **Deterministic** | The same markup always produces the same visual result, regardless of load order, environment, or which subset of files you include. |

**Version:** 0.4.4.0 (pre-1.0, API still evolving — see [Path to 1.0](docs/SPEC.md#path-to-10) for what needs to settle before semver kicks in). [`ROADMAP.md`](ROADMAP.md) lists what's not yet shipped.

---

## Quick start

### Static sites (HTML, Astro, 11ty, etc.)

```html
<link rel="stylesheet" href="css/slashed-full.css">
```

Or modular:

```html
<link rel="stylesheet" href="css/tokens-default.css">
<link rel="stylesheet" href="css/slashed-core.css">
<link rel="stylesheet" href="css/slashed-components.css">
<link rel="stylesheet" href="css/slashed-utilities.css">
```

**Optional visual utilities layer** (decorative utility classes for backgrounds, borders, radii, shadows, etc. — see [`docs/UTILITIES-VISUAL.md`](docs/UTILITIES-VISUAL.md)):

```html
<link rel="stylesheet" href="css/slashed-full.css">
<link rel="stylesheet" href="css/slashed-utilities-visual.css">
```

Not loaded by default. SLASHED core intentionally ships without decorative utilities — decoration belongs in BEM rules with tokens ([SPEC.md](docs/SPEC.md) pillar #2). Opt in per project if utility-first ergonomics help you ship faster.

### WordPress + Bricks Builder

Enqueue from theme `functions.php`:

```php
add_action('wp_enqueue_scripts', function() {
  $dir = get_stylesheet_directory() . '/slashed/css';
  $uri = get_stylesheet_directory_uri() . '/slashed/css';

  wp_enqueue_style('slashed-tokens',     "$uri/tokens-default.css",     [], filemtime("$dir/tokens-default.css"));
  wp_enqueue_style('slashed-core',       "$uri/slashed-core.css",       ['slashed-tokens'], filemtime("$dir/slashed-core.css"));
  wp_enqueue_style('slashed-components', "$uri/slashed-components.css", ['slashed-core'], filemtime("$dir/slashed-components.css"));
  wp_enqueue_style('slashed-utilities',  "$uri/slashed-utilities.css",  ['slashed-components'], filemtime("$dir/slashed-utilities.css"));

  // Optional: visual utilities layer (see docs/UTILITIES-VISUAL.md)
  // wp_enqueue_style('slashed-visual', "$uri/slashed-utilities-visual.css", ['slashed-utilities'], filemtime("$dir/slashed-utilities-visual.css"));
});
```

Or as a single file:

```php
add_action('wp_enqueue_scripts', function() {
  $file = get_stylesheet_directory() . '/slashed/css/slashed-full.css';
  wp_enqueue_style('slashed', get_stylesheet_directory_uri() . '/slashed/css/slashed-full.css', [], filemtime($file));
});
```

Place the `css/` folder in `wp-content/themes/your-theme/slashed/`.

---

## Using SLASHED in Bricks Builder

### Referencing SLASHED tokens in Bricks GUI

SLASHED tokens are CSS custom properties on `:root`. In any Bricks GUI control (color picker, spacing, font size, etc.), reference them directly:

```text
var(--primary)
var(--color-text-muted)
var(--space-m)
var(--text-xl)
```

To make tokens appear in Bricks Variable Picker with autocomplete, manually define the ones you use in **Bricks → Style Manager → Variable Manager**. (JSON import manifests for bulk-populating the Variable Manager may ship in a future release.)

### Using component and utility classes

Select element → **Style tab** → **Classes** → type any SLASHED class:

```text
cs-card cs-card--bordered
flex items-center gap-m
section container
text-xl font-bold text-center
```

### Per-instance overrides via component tokens

Many components expose customization tokens. Set them via element **Attributes** → `style`:

```text
--btn-bg: var(--accent)
--card-padding: var(--space-xl)
--bento-cols: 4
```

---

## Navigation: which approach for which context

Navigation is an area where the right pattern depends on context. SLASHED supports both approaches, doesn't try to be everything to everyone.

### Static sites → `.cs-nav-dropdown` (included)

For static HTML, single-page sites, landing pages, Astro/11ty builds: use the built-in `.cs-nav-dropdown` component. Based on native `<details>`/`<summary>` — zero JavaScript required, works before hydration, graceful degradation when JS is disabled.

See the slashed-blueprints library for copy-paste blueprint sections including header-with-nav examples.

**Trade-off:** this is a **disclosure pattern**, not a full ARIA menu. It doesn't provide arrow-key navigation between items or auto-focus on open. Adequate for marketing sites; insufficient for application-grade menus.

### WordPress + Bricks → native Nav / Nav Nestable element

For Bricks-built sites, use Bricks' native **Nav** or **Nav Nestable** element. You get:

- Integration with WP admin **Appearance → Menus** (non-technical users can edit nav without touching code)
- Proper ARIA roles, keyboard handling, focus management — handled by Bricks
- Server-side rendering (SEO-friendly, no collapsed state in crawler view)
- Multi-level submenus, mega-menus, mobile hamburger animations

**Two ways to style the Bricks Nav with SLASHED:**

**Option 1 — Single custom class on the Nav element**
Select Nav element → Style → Classes → add a class (e.g. `my-nav`) → style it in the Bricks GUI using SLASHED variables. Works like any other Bricks class.

**Option 2 — Style Nav parts directly through Bricks GUI with SLASHED variables**
Expand Nav element controls and style menu items, submenus, hover states individually. Reference `var(--primary)`, `var(--space-m)`, etc. in every control that accepts a value.

Both approaches keep Bricks in charge of markup and behavior; SLASHED provides the design tokens.

**Do not** try to manually recreate nav with Block/Div elements and apply `.cs-nav-dropdown` classes on Bricks-rendered sites — you'd lose WP menu integration for no benefit.

### Optional Bricks override layer (planned, opt-in)

A future release may include `slashed-bricks.css` — an **opt-in** override layer that applies `.cs-nav-dropdown` (and other component) styling automatically to `.brxe-*` markup. It would be loaded separately from core:

```php
// Only for users who want framework styling applied globally to Bricks elements
wp_enqueue_style('slashed-bricks', "$base/slashed-bricks.css", ['slashed-components'], $ver);
```

**Not loaded by default.** Most users prefer per-project GUI styling (the two options above) over a global override — keeps Bricks predictable and lets each project diverge from framework defaults where needed.

---

## File reference

```text
index.html                        Repo hub with links to everything below
README.md                         This file — framework overview + quick start
CONTRIBUTING.md                   Maintainer notes: gotchas, build commands, versioning
CHANGELOG.md                      Append-only release history (what shipped)
ROADMAP.md                        Forward-looking list (what hasn't shipped yet)
cheatsheet.html                   Interactive tokens/utilities/components quick reference

css/
├── tokens-default.css            Design tokens (colors, spacing, typography, radii, shadows, etc.)
├── slashed-core.css            Reset + base + layout primitives + a11y + print
├── slashed-components.css     Interactive UI components (.cs-* prefixed)
├── slashed-utilities.css       Layout + functional + inline typographic utilities
├── slashed-utilities-visual.css  Optional: decorative utilities (bg, border, radius, shadow, ...)
└── slashed-full.css            Bundle of core 4 files (NOT visual). Drop-in convenience.

docs/
├── SPEC.md                       Framework identity, 7 pillars, architecture
├── INSTALLATION.md               Setup for static sites, WordPress, and Bricks
├── TOKENS.md                     All CSS custom properties reference
├── COMPONENTS.md                 All .cs-* components reference
├── UTILITIES.md                  Core utility classes reference
├── UTILITIES-VISUAL.md           Opt-in visual utilities reference
└── DEPRECATION-POLICY.md         Three-phase deprecation process (Announce → Alias → Remove)
```

**Open `index.html` in a browser** as the main entry point. It links to the cheatsheet and docs.

---

## WordPress / Bricks: rem protection

All spacing, typography, and container tokens are `rem`-based. If anything in your WordPress theme or Bricks template sets `html { font-size: 62.5% }` (the old 10px shorthand trick), every `rem` value collapses: `--container-default: 75rem` → 750px instead of 1200px, body text → 11px instead of 18px.

The framework defends against this with a `:root:root { font-size: max(16px, 1em) }` declaration. The doubled `:root:root` selector has specificity (0,2,0), which beats both `html { font-size: 62.5% }` (emitted by Bricks itself, specificity 0,0,1) and same-specificity `:root { font-size: 62.5% }` declarations from WP themes loaded after the framework. `max(16px, 1em)` preserves user browser font-size preferences above 16px (accessibility) while preventing shrinkage below.

**If you still see narrow content or tiny text in Bricks**, the cleanest root-cause fix is in Bricks admin: **Theme Styles → Typography → HTML font size → 100%**, then regenerate typography/spacing scales. See `docs/INSTALLATION.md` § Bricks Builder for details. As a sanity check, open DevTools → Computed tab on `<html>` and verify `font-size` is `16px`.

---

## Browser support

Modern evergreen browsers (Chrome 123+, Firefox 120+, Safari 17.5+, Edge 123+). Graceful fallbacks for Safari 16.2–17.4 (`light-dark()` resolves to the light value; `color-mix()` has hardcoded backups).

---

## Optional JavaScript enhancements

`js/slashed-ui.js` is an optional, zero-dependency script that
covers accessibility gaps and CSS platform gaps:

- **Nav dropdown**: `aria-expanded` sync, `Escape` to close,
  click-outside to close
- **Modal**: click-outside to close (Escape is native to `<dialog>`)
- **Stagger**: auto-sets `--_i` index on `.stagger` children
  (CSS `sibling-index()` will replace this when cross-browser)
- **Range fill**: sets `--_fill` for CSS-driven track fill

Load it only if you need these enhancements:

```html
<script src="js/slashed-ui.js" defer></script>
```

For dynamic content, re-run the stagger initializer after render:

```js
slashedUI.initStagger(containerElement);
```

Core framework remains CSS-only. This file does not ship in
`slashed-full.css` and is never required.

---

## License

MIT — see [LICENSE](./LICENSE).

Copyright (c) 2026 Jacek Granatowski (codeslash.net).
