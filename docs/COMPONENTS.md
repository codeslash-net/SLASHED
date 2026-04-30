# Components Reference

Complete catalog of every `.cs-*` component in `css/slashed-components.css`. All components live under `@layer slashed.components`. Every component is BEM-structured (`.cs-block__element--modifier`), exposes per-instance CSS custom properties for customization, and composes with layout primitives from `slashed-core.css`.

## Philosophy

Components in SLASHED follow a consistent contract:

1. **BEM structure.** Block (`.cs-card`), element (`.cs-card__header`), modifier (`.cs-card--elevated`). No nested descendant selectors for sub-elements.
2. **Instance tokens.** Every component exposes `var(--comp-prop, default)` hooks so consumers can override per-instance via inline `style="--card-padding: var(--space-xl)"` without writing new CSS.
3. **Composition over configuration.** Modifiers are small and orthogonal — use `.cs-card.cs-card--bordered.cs-card--interactive` rather than `.cs-card--bordered-interactive-flat`.
4. **Tag-agnostic where possible.** `.cs-quote` works on `<blockquote>`, `<p>`, or `<div>`. `.cs-price` works on `<span>` or `<strong>`.

See [SPEC.md](SPEC.md) pillar #2 for the BEM-vs-utility boundary.

This reference is organised by **functional area** rather than by version. For per-version provenance, see [CHANGELOG.md](../CHANGELOG.md).

---

## Buttons & controls

### `.cs-btn--primary` / `--outline` / `--ghost`

Three button variants. All share padding, focus, and hover transitions. Combine with `.cs-icon` for icon+text.

```html
<button class="cs-btn--primary">Save</button>
<button class="cs-btn--outline">Cancel</button>
<a class="cs-btn--ghost" href="/">Back</a>
```

| Class | Purpose |
|-------|---------|
| `.cs-btn--primary` | Filled with `var(--primary)` |
| `.cs-btn--outline` | Bordered, transparent fill |
| `.cs-btn--ghost` | Transparent, no border |
| `.cs-btn--s` | Compact size |
| `.cs-btn--l` | Larger size |
| `.cs-btn--loading` | Replaces content with a spinner; preserves intrinsic width |

**Tokens:** `--btn-bg`, `--btn-text`, `--btn-py`, `--btn-px`, `--btn-radius`, `--btn-font-size`.

Hover/focus uses `color-mix(in oklch, ...)` for perceptually uniform dimming with no hue shift. Touch devices get `:active` feedback.

### `.cs-chip`

Clickable tag / removable filter pill.

```html
<button class="cs-chip">Filter</button>
<button class="cs-chip cs-chip--active">Active <span class="cs-chip__remove" aria-label="Remove">×</span></button>
```

Modifiers: `.cs-chip--active`. Element: `.cs-chip__remove`.

### `.cs-delete`

Standalone circular × button for dismissing notifications, modals, tags. Drawn with two rotated pseudo-elements — no font dependency.

```html
<button class="cs-delete" aria-label="Dismiss"></button>
<button class="cs-delete cs-delete--s" aria-label="Remove tag"></button>
```

| Class | Size |
|-------|------|
| `.cs-delete` | 1.25rem |
| `.cs-delete--s` | 1rem |
| `.cs-delete--l` | 1.75rem |

**Tokens:** `--delete-size`. Inherits `currentcolor` for foreground/background — drop it inside any colored block and it follows.

### `.cs-option-group`

Row of pill/rectangle options (size, variant, material). Stateless — drive selection via JS (`--selected` modifier) OR combine with hidden radios for form-backed selection.

```html
<div class="cs-option-group">
  <button class="cs-option-group__option cs-option-group__option--selected">S</button>
  <button class="cs-option-group__option">M</button>
  <button class="cs-option-group__option">L</button>
</div>
```

**Tokens:** `--option-radius` (default `var(--radius-m)`; set to `var(--radius-full)` for pills).

**When to use vs `.cs-radio-card`:** option-group is for short-label mutually-exclusive choices (sizes, color names). radio-card is for richer content (payment methods, plan tiers).

### `.cs-radio-card` / `.cs-check-card`

Full-card selectable input — hidden native radio/checkbox with styled surface responding to `:has(input:checked)`.

```html
<label class="cs-radio-card">
  <input class="cs-radio-card__input" type="radio" name="payment" value="card">
  <span class="cs-radio-card__surface">
    <strong>Credit card</strong>
    <p class="text-muted">Visa, Mastercard, Amex</p>
  </span>
</label>
```

Identical contract for `.cs-check-card` (use `type="checkbox"`).

**Tokens:** `--radio-card-padding`, `--radio-card-border-selected`, `--radio-card-bg-selected`.

Requires `:has()` (Chrome 105+, Firefox 121+, Safari 15.4+).

### `.cs-quantity-input`

Compact ±/value control. Native spinners are hidden.

```html
<div class="cs-quantity-input">
  <button class="cs-quantity-input__btn" aria-label="Decrease">−</button>
  <input class="cs-quantity-input__value" type="number" value="1" min="1">
  <button class="cs-quantity-input__btn" aria-label="Increase">+</button>
</div>
```

Modifier: `.cs-quantity-input--s` (compact 1.75rem). **Tokens:** `--qty-btn-size`.

### `.cs-swatches` / `.cs-swatch`

Color-circle selector row. Each swatch driven by `--swatch-color`.

```html
<div class="cs-swatches">
  <button class="cs-swatch cs-swatch--selected" style="--swatch-color: #1e293b"></button>
  <button class="cs-swatch" style="--swatch-color: #dc2626"></button>
</div>
```

| Class | Size |
|-------|------|
| `.cs-swatch` | 1.25rem (default) |
| `.cs-swatch--l` | 1.75rem |
| `.cs-swatch--xl` | 2.25rem |
| `.cs-swatch--selected` | 2px primary ring |

---

## Form patterns

### `.cs-form-group`

Label-above-input group with built-in CSS-only validation cascade via `:has(:user-invalid)`.

```html
<div class="cs-form-group">
  <label class="cs-form-group__label" for="email">Email</label>
  <input class="cs-form-group__input" id="email" type="email" required>
  <p class="cs-form-group__hint">We'll never share it.</p>
  <p class="cs-form-group__error">Enter a valid email.</p>
</div>
```

| Element | Purpose |
|---------|---------|
| `__label` | Label text |
| `__input` | Input/select/textarea |
| `__hint` | Help text (always visible) |
| `__error` | Validation message (revealed when input is `:user-invalid` after blur) |

Size modifiers: `.cs-input--s` / `.cs-input--l` on the input element (or `__input--s/--l`).

### `.cs-form-group--horizontal`

Layout modifier — label inline-start, input inline-end, stacked on small screens (<40em).

```html
<div class="cs-form-group cs-form-group--horizontal">
  <label class="cs-form-group__label" for="x">Plan</label>
  <select class="cs-form-group__input" id="x">…</select>
</div>
```

**Tokens:** `--form-label-width` (default `12rem`).

### `.cs-input-group`

Inline row of inputs/buttons (search bar, subscribe form). Joining edges have rounding stripped automatically.

```html
<div class="cs-input-group">
  <input type="search" placeholder="Search…">
  <button class="cs-btn--primary">Go</button>
</div>
```

Supports any permutation: `input|btn|btn`, `btn|input|btn`, etc. `:focus-visible` raises stacking via `--z-raised`.

### `.cs-input-wrap`

Wrap an input alongside an SVG icon. Padding is added to the input automatically so text never overruns.

```html
<div class="cs-input-wrap cs-input-wrap--has-icon-left">
  <svg class="cs-input-wrap__icon">…</svg>
  <input type="search" placeholder="Search">
</div>
```

| Class | Purpose |
|-------|---------|
| `.cs-input-wrap--has-icon-left` | Icon at inline-start |
| `.cs-input-wrap--has-icon-right` | Icon at inline-end |
| `.cs-input-wrap--loading` | Replaces native input content with a spinner; pointer-events disabled |

### `.cs-select-wrap`

Wrap any `<select>` to upgrade the chevron from a hardcoded-color SVG to a `mask-image` chevron that follows `--color-text-muted` and dark mode automatically.

```html
<div class="cs-select-wrap">
  <select><option>Option 1</option></select>
</div>
```

Size modifiers: `.cs-select-wrap--s` / `.cs-select-wrap--l`.

### `.cs-checkbox` / `.cs-radio`

Apply to native `<input type="checkbox">` / `<input type="radio">`. Replaces the UA style with a token-driven square/circle that flips cleanly in dark mode.

```html
<label><input type="checkbox" class="cs-checkbox"> Subscribe</label>
<label><input type="radio" name="size" class="cs-radio"> Medium</label>
```

**Tokens:** `--control-size` (default `1.15em`). Tick and dot scale with `em` so they follow the parent font-size.

### `.cs-file`

Custom file upload — hides native `<input type="file">` and styles surrounding label as a branded button + filename slot.

```html
<label class="cs-file">
  <input type="file">
  <span class="cs-file__cta">Choose file</span>
  <span class="cs-file__name">No file selected</span>
</label>
```

Modifier: `.cs-file--boxed` (drag-and-drop dropzone — dashed border, vertical stack, padded).

### `.cs-disclosure`

Bordered single-toggle disclosure built on `<details>`.

```html
<details class="cs-disclosure">
  <summary>Read more</summary>
  <p>Body…</p>
</details>
```

### `.cs-accordion` / `.cs-accordion-group`

List of disclosures with shared borders. Smooth open/close animation requires `::details-content` (Chrome 131+, Firefox 143+, Safari 18.2+); older browsers show instant transitions.

```html
<div class="cs-accordion-group">
  <details class="cs-accordion">
    <summary class="cs-accordion__summary">Question 1</summary>
    <div class="cs-accordion__body">Answer 1</div>
  </details>
  <details class="cs-accordion">…</details>
</div>
```

---

## Navigation

### `.cs-nav-link`

Plain nav link styled to match dropdown anchors. Authored as `a.cs-nav-link` (specificity 0,1,1) to override base `a` and `a:visited`.

```html
<a class="cs-nav-link" href="/products">Products</a>
```

### `.cs-nav-dropdown`

Native `<details>`-based primary-nav submenu for static sites (HTML, Astro, 11ty). On WordPress/Bricks, use the native Bricks Nav element instead — see [README.md § Navigation](../README.md#navigation-which-approach-for-which-context).

```html
<details class="cs-nav-dropdown">
  <summary>
    <a class="cs-nav-dropdown__parent" href="/shop">Shop</a>
  </summary>
  <ul class="cs-nav-dropdown__menu">
    <li><a class="cs-nav-dropdown__link" href="/shop/new">
      <span class="cs-nav-dropdown__link-label">New arrivals</span>
      <span class="cs-nav-dropdown__link-desc">Just landed this week</span>
    </a></li>
  </ul>
</details>
```

Modifier: `.cs-nav-dropdown--wide` (mega-menu width).

The component is hard-wired to `<details>/<summary>` — don't swap in `<button aria-expanded>` markup unless you also replace the component. Click-outside close requires `js/slashed-ui.js`.

### `.cs-dropdown`

General-purpose dropdown for action menus, filters, user menus. Distinct from `.cs-nav-dropdown`: trigger is button-styled, menu aligns to inline-start, supports dividers and right-aligned keyboard hints.

```html
<details class="cs-dropdown">
  <summary class="cs-dropdown__trigger">Actions</summary>
  <div class="cs-dropdown__menu">
    <button class="cs-dropdown__item">Edit</button>
    <button class="cs-dropdown__item">Duplicate</button>
    <hr class="cs-dropdown__divider">
    <button class="cs-dropdown__item">Delete</button>
  </div>
</details>
```

Modifier: `.cs-dropdown--up` (opens upward for bottom-anchored triggers).

### `.cs-navbar`

Full-width primary navigation bar with brand + collapsible menu + end slot. CSS-only burger toggle via `<input type="checkbox">` + `:has()`. At ≥48em the menu stays inline; below that, the burger reveals/hides the menu.

```html
<nav class="cs-navbar">
  <a class="cs-navbar__brand" href="/">Brand</a>
  <input class="cs-navbar__toggle" type="checkbox" id="nav-t" aria-label="Toggle menu">
  <label class="cs-navbar__burger" for="nav-t"><span></span><span></span><span></span></label>
  <ul class="cs-navbar__menu">
    <li><a class="cs-navbar__item" href="#">Features</a></li>
  </ul>
  <div class="cs-navbar__end">
    <a class="cs-btn--primary" href="#">Sign up</a>
  </div>
</nav>
```

Modifiers: `.cs-navbar--fixed-top` / `.cs-navbar--fixed-bottom` (uses `--z-sticky`).

**Tokens:** `--navbar-padding`, `--navbar-bg`, `--navbar-height`.

### `.cs-breadcrumb`

Hierarchical navigation trail.

```html
<nav class="cs-breadcrumb cs-breadcrumb--chevron" aria-label="Breadcrumb">
  <ol>
    <li class="cs-breadcrumb__item"><a href="/">Home</a></li>
    <li class="cs-breadcrumb__item"><a href="/shop">Shop</a></li>
    <li class="cs-breadcrumb__item cs-breadcrumb__current">Runners</li>
  </ol>
</nav>
```

| Modifier | Separator |
|----------|-----------|
| `.cs-breadcrumb--arrow` | → |
| `.cs-breadcrumb--dot` | • |
| `.cs-breadcrumb--slash` | / |
| `.cs-breadcrumb--chevron` | › |

When a separator modifier is active, separators are auto-generated via `::before`. Any explicit `.cs-breadcrumb__sep` markup is hidden so existing markup keeps working.

**Tokens:** `--breadcrumb-sep` (override the separator glyph).

### `.cs-pagination`

Numbered page navigation.

```html
<nav class="cs-pagination" aria-label="Pagination">
  <a class="cs-pagination__prev" href="?p=2" rel="prev">Previous</a>
  <ul>
    <li><a class="cs-pagination__link" href="?p=1">1</a></li>
    <li><a class="cs-pagination__link cs-pagination__link--current" aria-current="page">2</a></li>
    <li><span class="cs-pagination__ellipsis">…</span></li>
    <li><a class="cs-pagination__link" href="?p=10">10</a></li>
  </ul>
  <a class="cs-pagination__next" href="?p=3" rel="next">Next</a>
</nav>
```

Size modifiers: `.cs-pagination--s` / `.cs-pagination--l`.

**Tokens:** `--pagination-size` (default `2.25rem`), `--pagination-gap`.

### `.cs-menu`

Sidebar tree-style menu for admin panels. Indent on nested `__list` is automatic.

```html
<nav class="cs-menu">
  <span class="cs-menu__label">Dashboard</span>
  <ul class="cs-menu__list">
    <li><a class="cs-menu__link" href="/">Overview</a></li>
    <li><a class="cs-menu__link cs-menu__link--active" href="/orders">Orders</a></li>
    <li>
      <a class="cs-menu__link" href="/products">Products</a>
      <ul class="cs-menu__list">
        <li><a class="cs-menu__link" href="/products/new">Add new</a></li>
      </ul>
    </li>
  </ul>
</nav>
```

`__link--active` and `[aria-current="page"]` apply the active style.

**Tokens:** `--menu-indent` (default `var(--space-m)`).

### `.cs-tabs`

CSS-only tab panels via `:has()` — supports up to 10 panels without JS.

```html
<div class="cs-tabs">
  <div class="cs-tabs__list" role="tablist">
    <label class="cs-tabs__tab"><input type="radio" name="t" checked> First</label>
    <label class="cs-tabs__tab"><input type="radio" name="t"> Second</label>
    <label class="cs-tabs__tab"><input type="radio" name="t"> Third</label>
  </div>
  <div class="cs-tabs__panels">
    <div class="cs-tabs__panel">First panel</div>
    <div class="cs-tabs__panel">Second panel</div>
    <div class="cs-tabs__panel">Third panel</div>
  </div>
</div>
```

| Modifier | Style |
|----------|-------|
| `.cs-tabs--vertical` | Tab list inline-start, panels alongside |
| `.cs-tabs--boxed` | Connected rectangular tabs (active is filled surface) |
| `.cs-tabs--pill` | Rounded capsule tabs |

The `.is-active` class on a panel also activates it — useful for SSR or JS-controlled state.

**Tokens:** `--tabs-gap`, `--tab-padding`.

---

## Layout & containers

### `.cs-header`

Page-top masthead block. Distinct from `.cs-navbar` (the nav bar inside the header). `.cs-header` provides masthead surface + bottom border + optional sticky/blur. Sticky is opt-in.

```html
<header class="cs-header cs-header--sticky">
  <div class="cs-header__bar">
    <nav class="cs-navbar">…</nav>
  </div>
</header>
```

| Modifier | Purpose |
|----------|---------|
| `.cs-header--sticky` | Pins on scroll. Uses `--z-sticky` |
| `.cs-header--glass` | Frosted surface with `backdrop-filter` blur (auto-removed when descendant dropdown is open) |
| `.cs-header--transparent` | No background or border (sits on top of a hero) |
| `.cs-header--bordered` | Explicit bottom hairline without sticky surface |

**Auto-escape:** when a sticky header contains an open `.cs-nav-dropdown`, `.cs-dropdown`, or `[data-state="open"]`, the header raises to `--z-dropdown` so its menu outpaints following sticky siblings. On `--glass` it also drops `backdrop-filter` while the dropdown is open (backdrop-filter creates a stacking context that traps descendant z-index).

**Tokens:** `--header-bg`, `--header-bg-sticky`, `--header-color`, `--header-bar-padding-block`, `--header-bar-padding-inline`, `--header-border-width`, `--header-border-color`, `--header-blur`, `--header-top`.

### `.cs-footer`

Page-bottom block with wider default paddings and `--color-surface-2` background. Intentionally minimal — most content composes via `grid`, `stack`, `cluster`, `cs-nav-link`, `cs-divider`.

```html
<footer class="cs-footer">
  <div class="grid grid-cols" style="--cols: 4">…</div>
  <div class="cs-footer__bottom">
    <small>© 2026 ACME</small>
    <nav class="cluster">…</nav>
  </div>
</footer>
```

**Tokens:** `--footer-bg`, `--footer-color`, `--footer-padding-block`, `--footer-padding-inline`.

### `.cs-card`

Surface block with padding, radius, shadow.

```html
<article class="cs-card cs-card--bordered cs-card--interactive">…</article>
```

| Modifier | Effect |
|----------|--------|
| `.cs-card--bordered` | Adds border |
| `.cs-card--flat` | Removes shadow |
| `.cs-card--elevated` | Larger shadow |
| `.cs-card--horizontal` | Side-by-side media + content |
| `.cs-card--interactive` | Hover/focus elevation |

**Tokens:** `--card-bg`, `--card-padding`, `--card-radius`, `--card-shadow`, `--card-gap`, `--card-media-width`.

#### Segmented card (`__header` / `__image` / `__content` / `__footer`)

Adding any segmented sub-element converts the card into an unpadded shell. Children provide their own padding. Detection is automatic via `:has()`.

```html
<article class="cs-card cs-card--bordered">
  <div class="cs-card__header">
    <strong>Order #1024</strong>
    <span class="cs-badge cs-badge--success">Paid</span>
  </div>
  <img class="cs-card__image" src="…" alt="">
  <div class="cs-card__content">
    <p>Body text…</p>
  </div>
  <div class="cs-card__footer">
    <a class="cs-card__footer-item" href="#">Edit</a>
    <a class="cs-card__footer-item" href="#">Refund</a>
  </div>
</article>
```

### `.cs-modal`

Overlay dialog with backdrop animation. Uses native `<dialog>`.

```html
<dialog class="cs-modal" id="confirm">
  <p>Are you sure?</p>
  <form method="dialog">
    <button class="cs-btn--primary">Confirm</button>
  </form>
</dialog>
```

#### Segmented modal (`.cs-modal--card` with `__head` / `__body` / `__foot`)

Head pinned to top, body scrolls, foot pinned to bottom. Inherits transition/backdrop styling from `.cs-modal`.

```html
<dialog class="cs-modal cs-modal--card" id="x" aria-labelledby="x-h">
  <div class="cs-modal__head">
    <strong id="x-h">Edit profile</strong>
    <button class="cs-delete" aria-label="Close" formmethod="dialog"></button>
  </div>
  <div class="cs-modal__body">…long content…</div>
  <div class="cs-modal__foot">
    <button class="cs-btn--ghost">Cancel</button>
    <button class="cs-btn--primary">Save</button>
  </div>
</dialog>
```

`max-block-size: min(90vh, 50rem)` prevents oversized modals on tall viewports.

### `.cs-level`

Toolbar layout — items pushed to inline-start and inline-end with center alignment. Wraps on narrow viewports.

```html
<div class="cs-level">
  <div class="cs-level__left">
    <strong>Filters</strong>
    <span class="cs-badge">3 active</span>
  </div>
  <div class="cs-level__right">
    <button class="cs-btn--ghost">Clear</button>
    <button class="cs-btn--primary">Apply</button>
  </div>
</div>
```

Modifier: `.cs-level--mobile-stack` (column on <40em, row above).

### `.cs-section-header`

Marketing section intro: eyebrow + heading + lead + CTAs.

```html
<header class="cs-section-header">
  <span class="cs-eyebrow">Why us</span>
  <h2 class="cs-section-header__heading">Built for speed</h2>
  <p class="cs-section-header__lead">…lead copy…</p>
  <div class="cs-section-header__cta">
    <a class="cs-btn--primary" href="#">Get started</a>
  </div>
</header>
```

Modifier: `.cs-section-header--left` (left-align instead of center).

### `.cs-eyebrow`

Small uppercase label above headings.

```html
<span class="cs-eyebrow">New release</span>
```

### `.cs-divider`

Line-text-line horizontal divider.

```html
<div class="cs-divider">
  <span class="cs-divider__text">Or continue with email</span>
</div>
```

Modifier: `.cs-divider--s` (smaller variant for denser UIs).

### `.cs-media`

Media object pattern — image + content side by side.

```html
<div class="cs-media">
  <img src="…" alt="">
  <div>
    <strong>Heading</strong>
    <p>Body</p>
  </div>
</div>
```

The first child is fixed-width and shrink-0; the last child takes remaining space.

---

## Data display

### `.cs-badge`

Inline status label.

```html
<span class="cs-badge cs-badge--success">Paid</span>
<span class="cs-badge cs-badge--pill cs-badge--warning">
  <span class="cs-badge__dot"></span>
  In transit
</span>
```

| Modifier | Style |
|----------|-------|
| `.cs-badge--success` / `--warning` / `--error` / `--neutral` | Status colors |
| `.cs-badge--outline` | Outlined variant |
| `.cs-badge--pill` | Semi-transparent `color-mix()` background, full radius |
| `.cs-badge__dot` | 0.5em leading circle (currentColor) |

**Color contrast:** `.cs-badge--warning` uses `var(--warning-600)` for text (AA-compliant on `--warning-100`). Don't override with bare `var(--warning)` — that fails AA on white.

### `.cs-notice`

Block-level status message with colored inline border.

```html
<div class="cs-notice cs-notice--success">
  <p>Saved successfully.</p>
</div>
```

Modifiers: `--success`, `--warning`, `--error`, `--bordered`.

### `.cs-message`

Surface message with colored header bar + body. Use for in-page alerts that require a heading.

```html
<aside class="cs-message cs-message--warning">
  <div class="cs-message__header">
    <strong>Heads up</strong>
    <button class="cs-message__close" aria-label="Dismiss">×</button>
  </div>
  <div class="cs-message__body">
    <p>Your trial expires in 3 days.</p>
  </div>
</aside>
```

Modifiers: `.cs-message--success` / `--warning` / `--error`.

**Tokens:** `--message-color`, `--message-bg`. `--warning` uses `--warning-600` for header text (AA-compliant on `--warning-100`).

### `.cs-stat`

Big-number + small-label pair (hero stats, metric cards).

```html
<div class="cs-stat">
  <strong>12.4k</strong>
  <span>Active subscribers</span>
</div>
```

### `.cs-table`

Table styling layered onto native `<table>`.

```html
<table class="cs-table cs-table--bordered cs-table--striped cs-table--hoverable">
  <thead><tr><th>Name</th><th>Role</th></tr></thead>
  <tbody>
    <tr><td>Ada</td><td>Engineer</td></tr>
    <tr class="is-success"><td>Grace</td><td>Lead</td></tr>
  </tbody>
</table>
```

| Modifier | Effect |
|----------|--------|
| `.cs-table--bordered` | All cells bordered, rounded corners |
| `.cs-table--striped` | Alternate row backgrounds |
| `.cs-table--hoverable` | Row hover highlight |
| `.cs-table--narrow` | Compact cell padding |

Cell-level status: add `.is-primary`, `.is-success`, `.is-warning`, or `.is-error` to a `<tr>` or `<td>` for tinted backgrounds.

### `.cs-feature-list`

Prefixed list (product benefits, checklists). Tag-agnostic — works on `<ul>`, `<ol>`, or `<div>`. Override `--feature-list-marker` for custom icons.

```html
<ul class="cs-feature-list cs-feature-list--star">
  <li class="cs-feature-list__item">Fast deploys</li>
  <li class="cs-feature-list__item cs-feature-list__item--cross">No usage limits</li>
  <li class="cs-feature-list__item cs-feature-list__item--muted">Coming soon</li>
</ul>
```

Modifiers: `--arrow`, `--bullet`, `--cross`, `--star`. Item modifiers: `__item--cross`, `__item--muted`.

### `.cs-rating`

Star rating block.

```html
<div class="cs-rating cs-rating--with-count">
  <span aria-label="4 out of 5 stars">★★★★☆</span>
  <span class="cs-rating__count">(127 reviews)</span>
</div>
```

Size modifiers: `.cs-rating--s` / `--l` / `--xl`. Extension: `.cs-rating--with-count` + `.cs-rating__count` for "stars + (123)" patterns.

### `.cs-progress`

Progress bar component. Primary pattern: native `<progress>` for built-in screen-reader announcements.

```html
<progress class="cs-progress" value="65" max="100"></progress>
<progress class="cs-progress cs-progress--success" value="80" max="100"></progress>
<progress class="cs-progress" max="100"></progress> <!-- indeterminate (no value) -->
```

| Class | Purpose |
|-------|---------|
| `.cs-progress` | 6px track |
| `.cs-progress--s` / `--l` | Thinner / thicker (3px / 10px) |
| `.cs-progress--success` / `--warning` / `--error` | Color modifiers |
| `.cs-progress--indeterminate` | Animated stripe (div fallback only) |

**Tokens:** `--progress-color`, `--progress-size`.

**Fallback div pattern** (when CSS-driven fill is needed):

```html
<div class="cs-progress" style="--progress: 65%">
  <div class="cs-progress__fill"></div>
</div>
```

Native `<progress>` without a `value` attribute is `:indeterminate` automatically — WebKit animates it via `::-webkit-progress-value`; Firefox needs the fallback div.

### `.cs-stepper`

Numbered-dot progress indicator. Connector lines between dots are pseudo-elements; they color when the preceding step is `--complete` or `--active`.

```html
<ol class="cs-stepper">
  <li class="cs-stepper__step cs-stepper__step--complete">
    <span class="cs-stepper__dot">1</span>
    <span class="cs-stepper__label">Shipping</span>
  </li>
  <li class="cs-stepper__step cs-stepper__step--active">
    <span class="cs-stepper__dot">2</span>
    <span class="cs-stepper__label">Payment</span>
  </li>
  <li class="cs-stepper__step">
    <span class="cs-stepper__dot">3</span>
    <span class="cs-stepper__label">Review</span>
  </li>
</ol>
```

Modifier: `.cs-stepper--vertical` (stacked column with `__content` wrapper for label + time + detail).

**Tokens:** `--stepper-dot-size`, `--stepper-line-width`, `--stepper-line-active`, `--stepper-vertical-gap`.

### `.cs-price`

Pricing display. Combine `__row`, `__original`, `__save` for rich pricing.

```html
<div class="cs-price__row">
  <span class="cs-price cs-price--l">$79</span>
  <span class="cs-price__original">$99</span>
  <span class="cs-price__save">Save 20%</span>
</div>
```

Size modifiers: `.cs-price--s` / `--l` / `--xl`.

**Tokens:** `--price-size`, `--price-color` (set to `var(--primary)` for featured tiers).

### `.cs-summary-card`

Order/cart/checkout totals aside. Element-only — wrap with `.cs-card` for surface styling.

```html
<aside class="cs-card cs-summary-card">
  <h3 class="cs-summary-card__heading">Order summary</h3>
  <div class="cs-summary-card__row"><span>Subtotal</span><span>$120.00</span></div>
  <div class="cs-summary-card__row"><span>Shipping</span><span>$8.00</span></div>
  <div class="cs-summary-card__total"><span>Total</span><span>$128.00</span></div>
</aside>
```

**Tokens:** `--summary-heading-size`, `--summary-total-size`.

### `.cs-line-item`

Cart/checkout/order row: thumbnail + info stack + price.

```html
<article class="cs-line-item">
  <img class="cs-line-item__thumb" src="/shoes.jpg" alt="">
  <div class="cs-line-item__info">
    <h3 class="cs-line-item__name">Runner MX</h3>
    <p class="cs-line-item__variant">Size: 42 · Color: Black</p>
  </div>
  <span class="cs-line-item__price">$120.00</span>
</article>
```

**Tokens:** `--line-item-thumb-size` (default `4rem`), `--line-item-padding`.

### `.cs-data-list`

Label/value pairs with underline separators. Works on `<dl>` with nested `<div>` rows or any structure.

```html
<dl class="cs-data-list">
  <div class="cs-data-list__row">
    <dt class="cs-data-list__label">Material</dt>
    <dd class="cs-data-list__value">Organic cotton</dd>
  </div>
</dl>
```

**Tokens:** `--data-list-label-width` (default `auto` — set to `8rem` to align all values).

### `.cs-tags`

Wrapper that groups adjacent badges. `--addons` joins them seamlessly (GitHub/NPM `build:passing` style).

```html
<div class="cs-tags cs-tags--addons">
  <span class="cs-badge cs-badge--neutral">build</span>
  <span class="cs-badge cs-badge--success">passing</span>
</div>
```

### `.cs-separated-list`

Horizontal list with `·` or `|` separators (footer links, taxonomy strips).

```html
<ul class="cs-separated-list">
  <li><a href="/about">About</a></li>
  <li><a href="/jobs">Jobs</a></li>
  <li><a href="/legal">Legal</a></li>
</ul>
```

---

## Media & brand

### `.cs-avatar` / `.cs-avatar-stack`

Circular/square portrait, with overlapping stack option.

```html
<img class="cs-avatar cs-avatar--l" src="/u.jpg" alt="Alice">

<div class="cs-avatar-stack">
  <img class="cs-avatar" src="/u1.jpg" alt="">
  <img class="cs-avatar" src="/u2.jpg" alt="">
  <img class="cs-avatar" src="/u3.jpg" alt="">
</div>
```

Size modifiers: `xs/s/l/xl/2xl`. Modifiers: `--bordered`, `--square`.

### `.cs-icon`

SVG icon sizing wrapper. em-based by default — scales with font-size.

```html
<svg class="cs-icon cs-icon--l">…</svg>
```

Size modifiers: `xs/s/m/l/xl/2xl`. Weight modifiers: `--bold/--regular/--thin`. For colored logomark containers, use `.cs-brand-tile` instead.

### `.cs-icon-text`

Icon + text wrapper that guarantees vertical centering without per-use `line-height` fiddling. The text side flexes to multiple lines while the icon stays aligned to the first line.

```html
<span class="cs-icon-text">
  <svg class="cs-icon-text__icon" aria-hidden="true">…</svg>
  <span class="cs-icon-text__text">Free shipping over $50</span>
</span>
```

Direct `<svg>` and `<span>` children also work without explicit element classes.

Modifiers: `.cs-icon-text--top` / `.cs-icon-text--bottom` for non-center alignment.

### `.cs-logo`

SVG logo sizing for logo strips.

```html
<svg class="cs-logo cs-logo--l">…</svg>
```

Sizes: `s/l/xl`.

### `.cs-brand-tile`

Colored container for single-letter brand marks, SVG logomarks, or integration icons. Distinct from `.cs-icon` — `.cs-brand-tile` is a standalone block with explicit background and foreground.

```html
<div class="cs-brand-tile">A</div>
<div class="cs-brand-tile cs-brand-tile--l" style="--tile-bg: var(--accent)">
  <svg class="cs-icon" aria-hidden="true">…</svg>
</div>
```

| Class | Size |
|-------|------|
| `.cs-brand-tile` | 2.5rem (default) |
| `.cs-brand-tile--s` | 2rem |
| `.cs-brand-tile--l` | 3rem |
| `.cs-brand-tile--xl` | 4rem |

**Tokens:** `--tile-size`, `--tile-bg`, `--tile-color`, `--tile-radius`.

### `.cs-quote`

Italicized testimonial / pull-quote.

```html
<blockquote class="cs-quote cs-quote--lead">
  Best investment we've made all year.
</blockquote>
```

Size modifiers: `--s` / `--lead` / `--xl`.

---

## Loading states

### `.cs-skeleton` / `.cs-skeleton-line`

Animated placeholder for content loading. `.cs-skeleton` masks all descendants (`visibility: hidden` on `*`); `.cs-skeleton-line` is a standalone shimmering line.

```html
<article class="cs-card cs-skeleton">
  <h3>Hidden during load</h3>
  <p>Hidden too — only the card surface shimmers.</p>
</article>

<div class="stack stack--xs">
  <span class="cs-skeleton-line"></span>
  <span class="cs-skeleton-line" style="inline-size: 70%"></span>
</div>
```

### `.cs-spinner`

Rotating indicator.

```html
<span class="cs-spinner" aria-label="Loading"></span>
<span class="cs-spinner cs-spinner--l" aria-label="Loading"></span>
```

Sizes: `--s` / `--l`.

### `.cs-toast-stack` / `.cs-toast`

Notification stack (top-right by default). Toasts slide in with opacity + translate. Use JS to append `<aside class="cs-toast">` into `<div class="cs-toast-stack">` (helper in `js/slashed-ui.js`).

```html
<div class="cs-toast-stack">
  <aside class="cs-toast cs-toast--success" role="status">
    <svg class="cs-toast__icon" aria-hidden="true">…</svg>
    <div class="cs-toast__body">
      <strong class="cs-toast__title">Saved</strong>
      Your changes are live.
    </div>
    <button class="cs-toast__close" aria-label="Dismiss">×</button>
  </aside>
</div>
```

Position modifiers on the stack: `.cs-toast-stack--top-start` / `--bottom-end` / `--bottom-start` (default is top-end).

Color modifiers on the toast: `.cs-toast--success` / `--warning` / `--error`.

**Tokens:** `--toast-color`, `--toast-bg`, `--toast-inset-top/-bottom/-end/-start`.

`prefers-reduced-motion` disables the slide-in animation automatically.

---

## Interaction patterns

### Component + layout primitive

Components compose with layout primitives from `slashed-core.css`. A `.cs-card` inside `.auto-grid` becomes a card grid. A `.cs-btn--primary` inside `.cluster` becomes a button row.

```html
<div class="auto-grid auto-grid--m">
  <article class="cs-card cs-card--elevated">…</article>
  <article class="cs-card cs-card--elevated">…</article>
  <article class="cs-card cs-card--elevated">…</article>
</div>
```

### Per-instance tokens via inline style

For one-off variations, set tokens inline rather than writing new modifiers:

```html
<button class="cs-btn--primary" style="--btn-bg: var(--accent)">Accent CTA</button>
<div class="cs-card" style="--card-padding: var(--space-xl); --card-radius: var(--radius-2xl)">
  Extra-roomy hero card
</div>
```

This is a supported pattern — see [SPEC.md](SPEC.md) for why tokens-first is SLASHED's primary customization path.

### `:has()` dependencies

These components rely on `:has()` for state-driven styling without JS:

- `.cs-radio-card` / `.cs-check-card` — `:has(input:checked)` drives selected state
- `.cs-option-group` — `:has(input:checked)` drives selected state for form-backed options
- `.cs-tabs` — `:has(input:checked)` drives panel reveal (up to 10 tabs)
- `.cs-card` segmented detection — `:has(> .cs-card__header, ...)` strips the wrapper's padding
- `.cs-navbar` burger toggle — `:has(.cs-navbar__toggle:checked)` reveals the menu
- `.cs-header` auto-escape — `:has(.cs-nav-dropdown[open], .cs-dropdown[open])` raises z-index and clears `backdrop-filter`
- `.cs-form-group` — `:has(:user-invalid)` drives error message reveal (interaction-aware: fires only after the user has touched the field)

Browser support: Chrome 105+, Firefox 121+, Safari 15.4+ (universal in modern evergreen browsers).

### Sticky headers and dropdowns

`.cs-header--sticky` raises to `--z-dropdown` automatically when a descendant dropdown is open. On `--glass`, `backdrop-filter` is cleared while the dropdown is open — the filter creates a stacking context that traps descendant z-index, so the menu would otherwise paint inside the filtered layer.

For custom dropdown components, opt into the same auto-escape by setting `[data-state="open"]` on the open element.



## Version

This reference reflects framework **v0.4.5.0**. Changelog per component in [CHANGELOG.md](../CHANGELOG.md).
