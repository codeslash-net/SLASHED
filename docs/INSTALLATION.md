# Installation

Three ways to install SLASHED Framework.

---

## Option 1: Download

1. Download the latest release from [GitHub Releases](https://github.com/codeslash-net/slashed/releases)
2. Extract the archive
3. Copy the `css/` folder to your project
4. Link in your HTML:

```html
<link rel="stylesheet" href="path/to/slashed/css/slashed-full.css">
```

**Optional — add visual utilities layer** (see [UTILITIES-VISUAL.md](UTILITIES-VISUAL.md)):

```html
<link rel="stylesheet" href="path/to/slashed/css/slashed-full.css">
<link rel="stylesheet" href="path/to/slashed/css/slashed-utilities-visual.css">
```

---

## Option 2: CDN (via jsDelivr)

For quick prototypes and CodePen-style work:

```html
<!-- Pinned to exact version (REQUIRED for production until 1.0) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/codeslash-net/slashed@0.4.4.0/css/slashed-full.css">

<!-- Individual files (also pinned) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/codeslash-net/slashed@0.4.4.0/css/tokens-default.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/codeslash-net/slashed@0.4.4.0/css/slashed-core.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/codeslash-net/slashed@0.4.4.0/css/slashed-components.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/codeslash-net/slashed@0.4.4.0/css/slashed-utilities.css">

<!-- Optional: visual utilities layer -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/codeslash-net/slashed@0.4.4.0/css/slashed-utilities-visual.css">
```

> **Why exact-version pinning matters during pre-1.0.** The framework
> uses a `MAJOR.MINOR.PATCH[.REVIEW]` scheme — `REVIEW` is optional
> and only appears for in-version review/wireframe round-ups (e.g.
> `0.4.0`, `0.3.8.4`). Until
> `1.0.0` ships and semver applies strictly, **a breaking change can
> land in any version bump** — including patches and minors — and is
> only flagged in `CHANGELOG.md`. Floating tags like `@latest` or
> partial pins like `@0.3` will silently pick those up and can break
> a deployed site without warning. Pin to the full version
> (`@0.4.4.0`) and bump deliberately after reading the changelog.

```html
<!-- DO NOT USE in production until 1.0 — automatically picks up
     breaking changes from any future release. -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/codeslash-net/slashed@latest/css/slashed-full.css">
```

See [SPEC.md § Path to 1.0](./SPEC.md#path-to-10) for what needs to
stabilize before floating-tag usage becomes safe.

---

## Option 3: npm (planned)

> **Not yet published.** SLASHED will land on npm in a future release.
> For now, use Option 1 (Download) or Option 2 (CDN). The intended npm
> usage once published will be:

```bash
npm install slashed   # not yet available
```

```css
@import 'slashed/css/slashed-full.css';
```

```js
import 'slashed/css/slashed-full.css';
```

---

## WordPress installation

### Classic themes / custom themes

Place the `slashed/` folder in your child theme's root directory (or in your theme's root if you are not using a child theme). The `functions.php` that contains the enqueue call must be in the same theme, so `get_stylesheet_directory()` resolves to the right path.

```php
// functions.php
add_action('wp_enqueue_scripts', function() {
  $file = get_stylesheet_directory() . '/slashed/css/slashed-full.css';
  wp_enqueue_style('slashed', get_stylesheet_directory_uri() . '/slashed/css/slashed-full.css', [], filemtime($file));
});
```

### Modular (better caching)

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

### Bricks Builder

**Enqueue.** Use the WPCodeBox / Code Snippets path below, or add a
`wp_enqueue_style` call in your child theme's `functions.php` pointing
at `slashed-full.css` (same pattern as the "Classic themes" block
above).

**Fix the default 62.5% root font-size (recommended).** Bricks emits
`html { font-size: 62.5% }` by default, which shrinks every rem-based
value on the page — including every `.text-*` utility, `.container`
max-width, and spacing token. In Bricks admin:

> **Theme Styles → Typography → HTML font size → set to `100%`**

Then regenerate your typography and spacing scales as prompted by
Bricks. Note: the adjacent **Style Manager → HTML font-size** setting
only drives Bricks' internal scale calculator and does NOT affect
the emitted frontend CSS — the Theme Styles setting is the one that
matters.

**Defense-in-depth.** Even without the Theme Styles change, the
framework ships `:root:root { font-size: max(16px, 1em) }` in
`tokens-default.css` to keep the root font-size at ≥16px when
`html { font-size: 62.5% }` or a same-specificity `:root { font-size: 62.5% }`
rule is loaded after the framework. The Theme Styles fix is still
preferred because it removes the root cause.

**Navigation.** On Bricks, use the native Bricks Nav element rather
than reconstructing `.cs-nav-dropdown` out of Block/Div — the
`.cs-nav-dropdown` component is intended for static sites (HTML,
Astro, Eleventy). On Bricks you keep the WordPress menu admin
integration and built-in ARIA handling by using the native element.

### Via plugin (WPCodeBox / Code Snippets)

1. Create new snippet
2. Paste the enqueue code above
3. Set to run on frontend
4. Activate

---

## Static sites (Astro / Next.js / Eleventy)

### Astro

```astro
---
import '../css/slashed-full.css';
---

<html>
  …
</html>
```

### Next.js (App Router)

```js
// app/layout.js
import '../public/slashed/css/slashed-full.css';
```

### Next.js (Pages Router)

```js
// pages/_app.js
import '../public/slashed/css/slashed-full.css';
```

### Eleventy

Add to `.eleventy.js`:

```js
eleventyConfig.addPassthroughCopy({ "slashed/css": "assets/slashed" });
```

Then in your layout:

```html
<link rel="stylesheet" href="/assets/slashed/slashed-full.css">
```

---

## File structure

```text
slashed/
├── css/
│   ├── tokens-default.css               30 KB — Design tokens
│   ├── slashed-core.css               52 KB — Reset, base, layout, a11y, print
│   ├── slashed-components.css         56 KB — UI components (.cs-*)
│   ├── slashed-utilities.css          34 KB — Layout + functional + inline typographic
│   ├── slashed-utilities-visual.css    9 KB — Opt-in: bg, border, radius, shadow, ...
│   └── slashed-full.css              176 KB — Bundle of core 4 (NOT visual)
└── docs/
```

---

## Loading strategies

### Single file (simplest)

```html
<link rel="stylesheet" href="slashed/css/slashed-full.css">
```

Pros: one HTTP request, works everywhere.
Cons: user downloads all CSS even if only using components.

### Modular (better caching)

```html
<link rel="stylesheet" href="slashed/css/tokens-default.css">
<link rel="stylesheet" href="slashed/css/slashed-core.css">
<link rel="stylesheet" href="slashed/css/slashed-components.css">
<link rel="stylesheet" href="slashed/css/slashed-utilities.css">
```

Pros: update one file without cache-busting others, smaller initial load if you drop a module.
Cons: 4 HTTP requests.

### Core only (minimal)

```html
<link rel="stylesheet" href="slashed/css/tokens-default.css">
<link rel="stylesheet" href="slashed/css/slashed-core.css">
```

Skip components and utilities — use framework just for tokens + layout primitives. You write your own BEM classes on top.

### Your own custom build

Edit the files directly or concatenate only the parts you want:

```bash
cat css/tokens-default.css css/slashed-core.css > my-slim-slashed.css
```

No build step required.

---

## Verification

After installation, verify SLASHED is loaded by inspecting an element in DevTools:

- A `.container` should have `max-width: var(--container-default)`
- A `.cs-btn--primary` should have visible styling
- `getComputedStyle(document.documentElement).getPropertyValue('--primary')` should return a color

---

## Troubleshooting

**Styles not applying** → Check that CSS file path is correct in Network tab. 404 = wrong path.

**Only some styles applying** → Cascade order issue. Make sure SLASHED loads before your overrides.

**Text from `.text-*` / any rem-based class looks tiny in Bricks** → Bricks ships `html { font-size: 62.5% }` by default, which shrinks every rem-based value (including the framework's design tokens). Fix in Bricks admin: **Theme Styles → Typography → HTML font size → set to 100%**, then regenerate your typography/spacing scales. The framework also defends against this via `:root:root { font-size: max(16px, 1em) }` in `tokens-default.css`; if that defense isn't taking effect, verify `slashed-full.css` (or `tokens-default.css`) is actually being enqueued on the frontend.

**Bricks/Oxygen elements styled weird** → Expected; builders may override framework styles on their own elements. See the "Navigation: which approach for which context" section in the project README for builder-specific guidance.

**light-dark() not working in Safari 16** → Fallbacks should activate automatically. Check browser console for parse errors.

---

## Next steps

- [`README.md`](../README.md) — Framework overview
- [`TOKENS.md`](TOKENS.md) — Full design tokens reference
- [`COMPONENTS.md`](COMPONENTS.md) — UI components API
- [`UTILITIES.md`](UTILITIES.md) — Utility classes catalog
- [`examples/cheatsheet.html`](../examples/cheatsheet.html) — Searchable reference