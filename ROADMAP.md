# SLASHED — Roadmap

> Forward-looking only. Shipped work lives in [`CHANGELOG.md`](CHANGELOG.md).
> Reviewed at every framework version bump.
>
> **Last reviewed:** v0.5.0.0 (2026-05-02). Pending work below describes what ships in the 0.5.0.0 cut.

This file is the single authoritative list of what is *not yet shipped*. If
something is here and has since shipped, move it to the corresponding
`CHANGELOG.md` entry and delete it from this file. If something has shipped
but is being misremembered as pending, add it to the "Explicitly NOT on the
roadmap" section below with a one-line note pointing at where it actually
landed — that is what keeps this file honest across releases.

---

## For the implementor

SLASHED is a buildless CSS framework. All source files are plain CSS and
vanilla JS — no preprocessor, no build step, no package manager required to
work on the framework itself.

**File layout relevant to this roadmap:**

- `css/tokens-default.css` — design tokens on `:root`. All custom properties
  (`--primary`, `--space-m`, `--radius-s`, etc.). The only file consumers
  are expected to customise directly.
- `css/slashed-core.css` — CSS reset, base element styles, layout primitives
  (`.section`, `.container`, `.stack`, `.cover`, `.bento`, etc.), behavioral
  patterns, accessibility layer, print styles.
- `css/slashed-components.css` — UI components, all prefixed `.cs-*`.
- `css/slashed-utilities.css` — utility classes for layout, spacing,
  typography, positioning.
- `css/slashed-utilities-visual.css` — opt-in decorative utilities (border,
  shadow, radius, background, animation). Not included in `slashed-full.css`.
- `css/slashed-experimental.css` — features behind browser flags (currently
  only `.masonry`). Not included in `slashed-full.css`.
- `css/slashed-full.css` — concatenation of the four core files (tokens +
  core + components + utilities). Rebuilt by `bin/build-bundle.sh`.
- `js/slashed-ui.js` — ~500B optional IIFE. Public API:
  `window.slashedUI = { initStagger, toast }`. Adds ARIA states, focus
  management, keyboard navigation, and programmatic toast on top of the
  pure-CSS baseline. Zero dependencies.
- `bin/build-bundle.sh` — rebuilds `slashed-full.css` from the four source
  files in the correct order.

The blueprint library lives in a separate repository (`slashed-blueprints`).
Battle-testing patterns and audit-driven additions operate against that
repo's contents.

**Cascade layers (in order):**
`reset → base → layout → components → utilities → visual → a11y → overrides`

All eight layers are declared at the top of every CSS source file. The
`slashed.overrides` layer is intentionally empty — it is reserved for
consumer code that needs to beat everything else without `!important`. BEM
code written *outside* any `@layer` automatically beats all layered rules by
specificity — this is why SLASHED consumers can override any framework style
with a plain BEM rule and no `!important`.

**The `slashed.overrides` layer is intentionally empty and reserved for
consumer code.** Framework source files must never author rules into
`slashed.overrides`. It exists so that consumers can write rules that beat
every framework layer without `!important`. If you are adding CSS to the
framework and find yourself writing into `slashed.overrides`, you are
working in the wrong layer.

**Before making framework changes, read `CLAUDE.md` in full.** It documents
architecture gotchas that have repeatedly caused bugs — including the
`.grid-cols` / `--cols` naming trap, the `--warning` contrast failure on
white backgrounds (use `--warning-600` for warning text), the `:root:root`
rem protection, and other non-obvious rules that are not repeated here.

**"Baseline Widely Available"** means a feature has been in stable Chrome,
Firefox, and Safari for at least 30 months and can be used without any
`@supports` guard. **"Baseline Newly Available"** means all three engines
just shipped it — safe to use with a `@supports` guard for older browsers
still in the field.

---

## Philosophy — what this framework is and what it is not

Every item on this roadmap must be evaluated against these seven principles
before it ships. The principles map directly to the SLASHED acronym.
If a proposed change conflicts with any of them, it does not ship regardless
of how useful it seems in isolation.

**Standalone.** No build step. No Node.js. No npm. No runtime dependencies.
The consumer links a CSS file. That is the full install. Any proposed change
that introduces a build step, a preprocessor, or a runtime dependency on the
consumer side is permanently out of scope — not "not yet", permanently.

**Lean.** Every class earns its place. Additions are at the maintainer's
discretion — evaluated against utility, composability from existing classes,
and fit with the framework's philosophy. Frequency across unrelated blueprint
categories is a useful signal, not a hard threshold. Decorative utilities
stay in the opt-in `slashed-utilities-visual.css`. Target bundle size: 25 KB
gzip. When evaluating a new addition: does it earn its bytes?

**Agnostic.** SLASHED works on any platform that can load a CSS file.
Framework integrations (Bricks, WordPress) are additive and opt-in — never
a dependency. A change that ties core CSS to a specific platform, plugin, or
build tool violates this principle. In five years, the platform landscape
will be different; the core framework must still work unchanged.

**Structured.** Cascade layers enforce specificity order. BEM naming is
consistent across all components. Token hierarchy is explicit. New components
follow the same layer, naming, and token conventions as existing ones.
Nothing is ad hoc.

**Hybrid.** The framework combines three authoring layers (layout primitives,
BEM components, utility classes) with two interactivity paths (pure-CSS
baseline, optional WCAG-AAA JS). Every new interactive component must ship
a meaningful pure-CSS path first. The JS enhancement layer is always
optional. HTML-first: reach for `<details>`, `<dialog>`, `:has()`, and
native form elements before writing JavaScript.

**Edgeless.** The framework never blocks the consumer. Unlayered BEM always
beats framework layers — no `!important` needed. Instance tokens allow
single-line component modifications. New CSS must not introduce specificity
traps, `!important` usage, or patterns that require consumers to fight the
framework to get what they need. If a consumer needs to write `!important`
to override something, that is a framework bug.

**Deterministic.** Tokens drive the system. A given token input always
produces the same output. New tokens must follow the existing derivation
patterns (`color-mix()`, `light-dark()`, `clamp()`). Magic numbers in
framework CSS are bugs — every value that a consumer might want to change
must be a custom property. Dark mode, fluid scale, and brand-cohesive grays
must continue to work automatically from a single token change.

---

**What SLASHED is not:**
- Not a component library with managed releases and breaking API changes.
- Not for application UI, SaaS dashboards, or heavily JavaScript-driven interfaces.
- Not a paid product. MIT license, everything in the open repo, forever.
- Not opinionated about which platform you use. Bricks is popular now;
  something else will be popular in five years. SLASHED will work with that too.

---

## Versioning

Four-part scheme `0.MAJOR.MINOR.PATCH` while in pre-1.0 phase. (`CLAUDE.md` calls the fourth position `REVIEW` — same digit, different name.)

- **MAJOR** (second digit: `0.X`) — reserved for genuinely large milestones:
  a complete new subsystem, a meaningful API surface change that affects
  real consumers, or a pre-1.0 feature-complete gate. Day-to-day additions
  do *not* trigger a MAJOR bump — the second digit can stay at `4` for a
  long time while `0.4.5.0 → 0.4.6.0 → … → 0.4.55.0` accumulates work.
- **MINOR** (third digit: `0.x.Y`) — new components, new layout primitives,
  any additive change to the public CSS API surface. This is the normal
  release cadence.
- **PATCH / REVIEW** (fourth digit: `0.x.y.Z`) — bugfixes with no API
  change, documentation corrections.

The blueprint library (in `slashed-blueprints`) is content, not API.
Changes there do not trigger a framework version bump.

**Compatibility promise (post-1.0):** token names, `.cs-*` class names, and
instance custom-property names (`--card-padding`, `--btn-bg`, etc.) are
stable API. New tokens and classes are additive only. Consumers who write
unlayered BEM with framework tokens will not see their layouts break on
updates — their BEM always wins over framework layers. Visual defaults
(shadow values, transition curves, spacing scale sizes) may shift slightly
between MINOR versions as the design matures; consumers who want to freeze
a specific value override it with a local token.

**Pre-0.8.0.0 breaking-change policy: none.** Before `0.8.0.0`, anything
can be renamed, removed, or restructured without a deprecation alias,
migration guide, or advance notice. No `docs/MIGRATING-*.md`, no
compatibility shims, no changelog hand-holding for consumers. The API is
not stable; treat every update as potentially breaking and diff the source.
Migration guides, deprecation aliases, and consumer upgrade tooling become
obligations at `0.8.0.0` as a pre-condition for the 1.0 freeze.

---

## Pending work

---

#### Tokens: `--info` color system

Add `--info: #0ea5e9` (sky-500) to the status color system.
Required changes to `css/tokens-default.css`:

- Static legacy fallback added to the top-of-file block
- `@property` removed for `--success`, `--warning`, `--error` — status
  colors, not brand colors; CSS transition registration unneeded
- `light-dark()` replaced with fixed light-mode values in `:root`;
  dark-mode values moved to the `@media (prefers-color-scheme: dark)`
  and `[data-theme="dark"]` blocks explicitly
- `--info`, `--info-100`, `--info-600` defined in `:root` and both
  dark-mode blocks

---

#### Tokens: new system tokens

Add to `css/tokens-default.css`:

- `--border-width: 1px`, `--border-width-2: 2px`, `--border-width-4: 4px`,
  `--border-style: solid`
- `--font-weight-body: 400`, `--font-weight-medium: 500`,
  `--font-weight-semi: 600` (complement to the existing `--font-weight-heading: 700`)
- `--shadow-2xs` — half-strength shadow between `none` and `--shadow-xs`

---

#### Tokens: new semantic aliases

Add to the `--color-*` alias block in `css/tokens-default.css`:

- `--color-text-body` (alias → `--color-text`)
- `--color-placeholder` (alias → `--color-text-faint`)
- `--color-link-active` (alias → `--primary-700`)
- `--color-text-on-success`, `--color-text-on-warning`,
  `--color-text-on-error`, `--color-text-on-info`

---

#### Utilities: new classes (`slashed-utilities.css`)

- **Text:** `.text-body`, `.text-info`, `.break-all`, `.break-keep`,
  `.hyphens-auto`, `.hyphens-none`, `.tabular-nums`
- **Lists:** `.list-disc`, `.list-decimal`
- **Sizing:** `.max-w-content`, `.size-full`, `.size-fit`, `.min-h-svh`
- **Overflow:** `.overflow-clip`, `.overflow-x-clip`, `.overflow-y-clip`
- **Interaction:** `.pointer-events-auto`, `.select-text`, `.select-all`,
  `.isolate`, `.isolation-auto`
- **CSS Columns:** `.cols-2`, `.cols-3`, `.cols-4`, `.cols-auto-xs`,
  `.cols-auto-s`, `.cols-auto-m`, `.col-gap-m`, `.col-gap-l`,
  `.col-span-all`, `.col-break-before`, `.col-break-after`, `.col-break-avoid`

---

#### Visual utilities: opacity, shadow, borders, contextual colors (`slashed-utilities-visual.css`)

- Opacity scale expanded to 14 stops: 0, 5, 10, 20, 25, 30, 40, 50,
  60, 70, 75, 80, 90, 100
- `.shadow-2xs`
- `.border-2` and `.border-4` — replace hardcoded `px` values with
  `var(--border-width-2)` and `var(--border-width-4)` tokens
- `.isolation-isolate` — remove entirely; replaced by `.isolate` in
  `slashed-utilities.css`
- Contextual color cascading: `.bg-primary`, `.bg-secondary`, `.bg-accent`
  cascade `--color-text`, `--color-link`, and `--color-border` to children
  so nested text and UI components automatically use correct contrast values

---

#### Components: `--info` variants (`slashed-components.css`)

Add info-tinted modifiers to four existing component families:

- `.cs-notice--info` — `--notice-color: var(--info); --notice-bg: var(--info-100)`
- `.cs-badge--info` — `--badge-bg: var(--info-100); --badge-text: var(--info-600)`
- `.cs-toast--info` — `--toast-color: var(--info)`
- `.cs-message--info` — `--message-color: var(--info-600); --message-bg: var(--info-100)`

---

#### Components: `.cs-modal--drawer-start` / `.cs-modal--drawer-end`

Offcanvas / drawer pattern built on native `<dialog>`. Slides in from the
inline-start or inline-end edge. Uses `@starting-style` + `transition:
translate allow-discrete` — no JavaScript required for animation.
Instance token: `--drawer-width` (default 20rem). Combines with existing
`initModalFocusRestore()` for full a11y support.

---

#### Components: `@media (hover: hover)` guards

Wrap in `@media (hover: hover)` to prevent stuck hover states on touch
devices:

- `.cs-card--interactive:hover`
- `.cs-chip:hover`
- `[data-tooltip]:hover::after`
- `.cs-table--hoverable tbody tr:hover`

---

#### Core: `::placeholder` token (`slashed-core.css`)

Replace hardcoded reference with a token:

```css
/* before */ color: var(--color-text-faint, #9ca3af);
/* after  */ color: var(--color-placeholder, var(--color-text-faint, #9ca3af));
```

---

#### JS: new public API (`slashed-ui.js`)

- `slashedUI.openModal(dialog)` — calls `dialog.showModal()` programmatically
- `slashedUI.toggleModal(dialog)` — opens if closed, closes if open
- `slashedUI.dismissToast(el)` — public alias for the internal `dismiss()`
  function

Update `window.slashedUI` export to include all three.

---

#### Ecosystem: new files

- `ecosystem/slashed-bricks.css` — opt-in Bricks Builder integration layer.
  Includes `:root:root` rem fix (in case tokens file is not loaded
  separately), focus ring reset for Bricks wrapper elements, and section
  padding zeroing for `.section.brxe-section`.
- `ecosystem/bricks-theme-styles.json` — Bricks Variable Manager import file
  with all SLASHED tokens pre-mapped (brand, status, spacing, typography,
  radius).

---

#### Pending: `.cs-btn--icon`

Icon-only button modifier: equal x/y padding, square aspect ratio.
Combines with existing variants: `<button class="cs-btn--outline cs-btn--icon">`.

```css
.cs-btn--icon {
  padding: var(--btn-icon-padding, var(--space-xs));
  aspect-ratio: 1;
  justify-content: center;
}
```

---

#### Pending: `.section--soft` / `.section--bold`

Brand-colored section backgrounds alongside existing `.section--alt`.

```css
.section--soft { background: var(--primary-50);  color: var(--color-text); }
.section--bold { background: var(--primary);      color: var(--color-text-on-primary); }
```

---

#### Pending: Brand-tile grid wrapper

Shared container for `.cs-brand-tile` grid patterns in logo bars and
integration sections. Exact spec TBD based on blueprint patterns.

---


### CSS modernization track — ongoing

Items in this track do not have a fixed version assignment. They should
be evaluated and landed in whichever minor version is current when
browser support is confirmed. Each item includes the current support
status and the condition for shipping.

---

#### Already Baseline — audit and remove redundant guards

- **Container queries** — Baseline Widely Available 2025. Remove any
  `@supports (container-type: inline-size)` guards that may exist.
- **`@starting-style`** — Baseline Newly Available (Chrome 117+,
  Firefox 129+, Safari 17.5+). Already used in `.cs-modal` and
  `[popover]`. Audit all entry animations in `slashed-components.css`
  to confirm `@starting-style` is applied consistently wherever a
  component transitions from hidden to visible. No `@supports` guard
  needed at SLASHED's baseline.
- **Scroll-driven animations (`animation-timeline: view()`)** — Baseline
  Newly Available 2026 (Firefox and Safari shipped full support).
  Already used in `.scroll-reveal` and `.scroll-reveal-up` in
  `slashed-core.css`. Confirm no `@supports` guard wraps these rules —
  if one exists, remove it.

---

#### Plan for 2026 — implement when cross-browser

**`@container scroll-state(stuck)`** — Chrome 133+ only; Interop 2026
target. When cross-browser, replace any JS-based "sticky header received
shadow" pattern with:

```css
@container scroll-state(stuck) {
  .cs-header--sticky { box-shadow: var(--shadow-s); }
}
```

The container needs `container-type: scroll-state` on a wrapper. Reduces
JS surface in `slashed-ui.js`.

**Customizable `<select>` (`appearance: base-select`)** — Chrome 135+
(partial), standardization in progress. When cross-browser, replace the
entire select chevron implementation (SVG `background-image`, manual
`padding-inline-end`, dark mode background-image variant, the RTL
`calc()` fix from `0.4.3.0`) with native `::picker(select)` styling.
Simpler code, better accessibility, no SVG data URI. Until then, the
`0.4.3.0` fix stands.

**CSS Carousel API (`::scroll-button()` / `::scroll-marker()`)** —
Chrome-only, Interop 2026 target. When cross-browser, evaluate whether
`.reel` layout primitive can offer a `--with-nav` modifier providing
native scroll buttons and position markers without JS.

**Cross-document view transitions** — `@view-transition { navigation:
auto }` for MPA page transitions. SLASHED already has `vt-*` utility
classes for same-document transitions. When cross-browser, extend with
cross-document support so consumers get page transitions between WP
template pages by loading one CSS snippet.

**CSS `@mixin` / `@apply`** — spec still in flux, no stable browser
support. If this ships cross-browser before 1.0, evaluate whether any
repeated declaration blocks in `slashed-core.css` (hover patterns,
focus-visible patterns) can be extracted to mixins. Does not replace
design tokens.

**Configurable breakpoints via `@custom-media`** —
Media Queries Level 5 `@custom-media` is at WD stage; no stable browser
support. When cross-browser, SLASHED's four hardcoded breakpoints
(`sm: 30em / md: 48em / lg: 64em / xl: 80em` in `slashed-utilities.css`)
can be expressed as named custom media queries, allowing consumers to
configure them without a find-replace across the file. Until then the
documented workaround (find-replace in that file only) stands. Do not
add a PostCSS simulation step — buildless is a hard constraint.

**Scope note (updated `0.4.5.0`):** `slashed-core.css` layout primitives now
use `@container` queries (see C2) and no longer contain hardcoded breakpoints.
The `@custom-media` problem is therefore limited to `slashed-utilities.css`
only — reduced scope compared to previous description.

---

## Path to 1.0

These items are not assigned to a specific version — they are conditions
that must all be true before 1.0 ships. Track progress against this list
when planning the version that will become 1.0.

- **Token names frozen.** No renames after 1.0; only additions and
  deprecated aliases with at least one minor version of overlap.
- **Component surface frozen.** Every `.cs-*` class and every
  `--<component>-<prop>` instance variable becomes a stable API contract.
- **Cascade-layer order frozen.**
  `reset → base → layout → components → utilities → visual → a11y → overrides`
- **Browser baseline pinned in writing with deprecation policy.** Currently
  stated only in README. Needs a dedicated section in `docs/SPEC.md` with
  an explicit policy for how and when the minimum version advances.
- **Visual-utilities split decision.** Whether `slashed-utilities-visual.css`
  stays as an opt-in companion, gets folded into core, or is reshaped.
  Not yet decided — decision must be locked before 1.0.
- **Experimental graduation policy locked.** A feature graduates from
  `slashed-experimental.css` into core once it lands in stable releases of
  all evergreen browsers in SLASHED's baseline. Formalise this policy in
  `docs/SPEC.md`.
- **Cheatsheet content audit (CI grep).** Every entry in `cheatsheet.html`
  must map to a real selector or `--*` declaration in `css/*.css`. Script
  in `bin/` + GitHub Action. Already named in `docs/SPEC.md` § Path to 1.0;
  not yet implemented.
- **`docs/MIGRATING-0.3-TO-1.0.md` drafted** (not before `0.8.0.0`).
  Captures every rename, removal, and behaviour change between 0.3.x and
  1.0 so consumers can migrate in one pass. Write this at `0.8.0.0` once
  the API is nearing freeze — not incrementally.
- **Battle-test pass #2 complete** (see Pending work).
- **API freeze review complete.** Specific audits to perform before sign-off:
  - `--color-text-faint` (~3.4:1 contrast ratio — fails WCAG AA for body
    text): deprecate with a replacement name, keep with a prominent
    warning, or document as intentionally decorative-only?
  - z-index alias distinctiveness: `--z-sticky` (1100), `--z-dropdown`
    (1150), `--z-banner` (1200), `--z-overlay` (1300), `--z-modal` (1400)
    — are the names and values clear enough that consumers will pick the
    right one?
  - `--neutral-tint` default of `0%` makes the feature invisible to most
    consumers. Consider changing default to `2%` so brand-cohesive grays
    are on by default.
  - Confirm final layer placement of `.text-gradient`
    `prefers-reduced-data` fallback — currently in `slashed-utilities-visual.css`
    contributing to `@layer slashed.a11y`. Correct and intentional?
- **`CONTRIBUTING.md` and `CODE_OF_CONDUCT.md` written.** Pre-1.0 these
  can be minimal; post-1.0 the repo should be contributor-ready.

---

## Out of scope — permanent decisions

- **Sass / Less / PostCSS preprocessing.** Buildless is a feature, not a
  workaround.
- **JIT class scanning, attributify mode, or any build-time class
  generator.** Same reason.
- **A JS component framework (React / Vue / Svelte component library).**
  SLASHED is a CSS framework. HTML-first interactivity is the
  differentiator.
- **A paid / "Pro" tier.** MIT, all features in the open repo, forever.
- **Storybook.** Duplicates `cheatsheet.html`'s function with a heavier
  toolchain. Replaced by cheatsheet interactive controls (post-0.6 tooling
  work).
- **Round-trip Figma → SLASHED tokens.** Export is one-way; importing from
  Figma requires parsing a moving target.
- **`-soft` / `-bold` token aliases.** SLASHED's shade scale already handles
  dark-mode swapping automatically via `@media` / `[data-theme="dark"]`
  redefinitions. The Bulma naming convention solves a problem SLASHED does
  not have.
- **21-shade-per-color scale.** 11 stops plus alpha variants are sufficient.
  Tailwind muscle-memory is not a design goal.
- **`slashed-mini.css` as a new bundle file.** The minimal load path
  (tokens + core, ~82 KB raw) already exists by loading only those two
  files. This needs documentation in README, not a new bundle.
- **Page composition demo (`page-landing.html`).** A canonical page order
  would incorrectly imply there is a "correct" composition. How sections
  combine is a project-specific decision.
- **`docs/RECIPES.md`.** Deleted in `0.4.3.0`. Patterns it planned to
  document belong in slashed-blueprints (`article` category) or are simple
  enough to compose from `cheatsheet.html` examples.
- **Combobox / dropdown-with-search.** Requires JS beyond the `slashed-ui.js`
  scope. Revisit only with a concrete consumer issue filed.
- **Striped / multi-segment progress bars.** Deferred until consumers request
  them after Bricks and WP integrations ship.
- **Slider & Carousel component.** `.reel` layout primitive covers horizontal
  scroll. Full carousel (with markers, prev/next buttons, autoplay, touch
  swipe) requires JS beyond current scope. Re-evaluate when CSS Carousel
  API (`::scroll-button()`) is cross-browser.

---

## Explicitly NOT on the roadmap (resolved or stale)

Items that have been proposed in the past but are not pending. Documented
here to prevent re-addition.

- **BEM fix: `.cs-skeleton-line` → `.cs-skeleton__line`** — shipped in `0.4.8.0`. Breaking rename in `slashed-components.css`; cheatsheet updated.
- **`sibling-index()` native stagger** — shipped in `0.4.8.0`. `@supports` block added in `slashed-core.css`; `initStagger()` in `slashed-ui.js` remains as polyfill for `Chrome <130` / `Firefox <131` / `Safari <18`.
- **`text-box` trim extended to `.cs-badge`, `.cs-nav-link`, `.cs-chip`, `.cs-eyebrow`** — shipped in `0.4.8.0`. Added to the existing `@supports (text-box: trim-both cap alphabetic)` block in `slashed-components.css`.
- **Cheatsheet / docs vs. CSS parity audit + phantom class sweep** — shipped in `0.4.7.0`. All documented-but-missing utility classes implemented (`.inline`, `.inline-grid`, `.contents`, `.static`, `.shrink`, `.justify-around`, `.justify-evenly`, `.self-stretch`, `.self-auto`, `.start-0`, `.end-0`, `.h-min`, `.h-max`, `.max-w-full`, `.max-w-none`, `.max-w-prose`, `.overflow-scroll`, `.overflow-visible`, `.overflow-y-auto`, `.object-fill`, `.object-scale-down`, `.object-left`, `.object-right`, `.cursor-wait`, `.cursor-grab`, `.cursor-grabbing`, `.border-4`). Phantom `.masonry--l` and `.border-default` removed from docs. `.max-prose` renamed to `.max-w-prose`. `--ease-inout` renamed to `--ease-in-out`. Cheatsheet updated with per-class/token justification pass.
- **Container token rename (T4)** — shipped in `0.4.6.0`.
  `--container-xs/sm/narrow` → `--container-dialog/form/prose`; added
  `--container-wide` (90rem) and `--container-full` (none).
- **Container modifier class rename (C1)** — shipped in `0.4.6.0`.
  `.container--xs/sm/narrow` → `.container--dialog/form/prose/wide/full`.
- **Grid `@container` queries (C2)** — shipped in `0.4.5.0`. `.grid-N`
  layout primitives now set `container-type: inline-size` and respond to
  their own width, not the viewport. `slashed-core.css` is now breakpoint-
  free; `slashed-utilities.css` is the only file with hardcoded values.
- **`--container-narrow` → `--container-prose` references (C3, K3)** —
  shipped in `0.4.6.0`. All in-source `var(--container-narrow)` calls
  updated in both `slashed-core.css` and `slashed-components.css`.
- **Width utility refactor** — shipped in `0.4.6.0`. Fractional `.w-*`
  renamed to slash notation (`.w-1/2`, `.w-1/3`, etc.); `.w-content-*`
  same; `.w-vw-10` … `.w-vw-100` added as the viewport-relative scale
  (the pre-ship name in this roadmap was `.w-10`/`-20`/…/`-90` — landed
  as `.w-vw-*` to avoid axis ambiguity).
- **`.cs-table--responsive`** — shipped in `0.4.5.0`. `display: block;
  overflow-x: auto;` modifier for horizontal-scroll tables.
- **`initModals` click-outside fix** — shipped in `0.4.5.0`. Handler now
  checks `event.target === dialog` exclusively.
- **`slashedUI.updateRange(input)` public API** — shipped in `0.4.5.0`.
  Extracted from the private `update()` closure inside `initRangeFill`.
- **`.cs-nav-dropdown::details-content`** — shipped in `0.4.5.0`. Smooth
  height animation on mobile (≤47.99em) for the mobile accordion path.
- **Auto-pairing `--color-text-on-*`** — shipped in `0.5.0.0` (T9).
  `oklch(from var(--primary) …)` formula inside `@supports` guard; static
  `white` / `var(--neutral-900)` fallbacks remain for Firefox 120–127.
- **Tooltip full CSS Anchor Positioning** — already shipped in
  `css/slashed-components.css` (`@supports (anchor-name: --a) { … }`
  block). This is the complete implementation behind a progressive
  enhancement guard. Nothing further to do until the position-absolute
  fallback can be removed (depends on baseline advancing past
  Firefox 132).
- **`@property` for brand colors** — already shipped in `tokens-default.css`
  (six `@property --primary / --secondary / --accent / --success /
  --warning / --error` registrations). Enables CSS transitions between
  theme switches.
- **`.cs-tabs` panel selector chain extension to 10** — already shipped.
  Source has `nth-child(1)` through `nth-child(10)` selectors. CHANGELOG
  entry for 0.3.3.0 says "up to 6" — this is corrected in `0.4.3.0`.
- **`.hero` layout primitive** — does not exist and will not be added.
  `.cover` is the hero replacement in `slashed-core.css`. Cheatsheet entry
  "Full-height hero section" already points at `.cover`.
- **"Playground / theme builder web app" as a separate item** — this is
  post-0.6 tooling work.
- **Bricks Builder JSON template exports** — superseded by Bricks 2.3
  "HTML & CSS to Bricks" native conversion (paste blueprint HTML → Bricks
  converts to native elements automatically).
- **Filling in `docs/RECIPES.md`** — the file is deleted in
  `0.4.3.0`. The patterns it planned to document (hero with stat row,
  pricing card, sticky TOC, cart line item, two-column form, article with
  prose) belong in the slashed-blueprints library (`article`, `onboarding`
  categories) or are composable from `cheatsheet.html` examples without
  a dedicated guide.
- **Removing components or utility classes** — contradicts the
  "additive by default" principle. Pre-1.0 the API surface is not frozen,
  but the framework's growth direction is addition, not subtraction.
  If battle-test pass #2 surfaces genuinely useless patterns, they can be
  deprecated with a one-version notice rather than silently removed.
- **`slashed-full-notokens.css` separate bundle** — consumers
  who need to substitute tokens already have the option to load the four
  source files individually (`tokens-default.css` + `slashed-core.css` +
  `slashed-components.css` + `slashed-utilities.css`). Adding a second
  bundle file multiplies maintenance surface (two files to keep in sync,
  two CI checks) for a workflow that is already possible. Document the
  multi-file load path in README more visibly instead.
- **`initTabsAccessible()`** — shipped in `0.5.0.0`. WAI-ARIA Tabs keyboard pattern: arrow navigation, roving tabindex, auto-select, `aria-selected` wiring.
- **`initModalFocusRestore()`** — shipped in `0.5.0.0`. Returns focus to the trigger element when `<dialog>` closes; if the trigger is unavailable or removed, focus restoration is skipped (no `document.body` fallback).
- **Nav-dropdown keyboard navigation** — shipped in `0.5.0.0`. Arrow Up/Down, Home/End, first-letter jump, Escape closes, Tab closes via browser default.
- **Toast `urgency: 'assertive'` option** — shipped in `0.5.0.0`. Sets `role="alert"` for immediate screen-reader interruption on errors; default `role="status"` unchanged.
- **`initFormGroups()` aria-live wiring** — shipped in `0.5.0.0`. Adds `aria-live="polite"` / `aria-atomic="true"` to `.cs-form-group__error` and sets `aria-errormessage` on the associated input pointing to the error element's id.
- **T1 (font-weight token cleanup)** — shipped in `0.5.0.0`. Removed 8 `--font-weight-*` tokens; renamed `--font-weight-bold` → `--font-weight-heading`.
- **T2 (alpha variant trim)** — shipped in `0.5.0.0`. Alpha variants reduced to 3 steps (`a25`, `a50`, `a75`) for `--primary`, `--secondary`, `--accent`.
- **T3 (`--text-6xl` through `--text-9xl` removal)** — shipped in `0.5.0.0`. Scale ends at `--text-5xl`; `--text-fluid-hero` covers hero-scale type.
- **T5 (`--color-text-faint` vs. `--color-text-disabled` split)** — shipped in `0.5.0.0`. `--color-text-disabled` is now `--neutral-300` with a WCAG-exemption comment.
- **T6 (`--shadow-inner` fix)** — shipped in `0.5.0.0`. Now uses `calc(var(--shadow-strength) * 1.5)` instead of a hardcoded opacity value.
- **T7 (`--duration-enter` / `--duration-exit`)** — shipped in `0.5.0.0`. Semantic enter/exit duration tokens added after the existing duration block.
- **T8 (`--z-above`)** — shipped in `0.5.0.0`. New z-index tier (`100`) inserted between `--z-docked` and `--z-sticky`.
- **K1 (component font-weight token)** — shipped in `0.5.0.0`. `var(--font-weight-bold)` → `var(--font-weight-heading, 700)` in all components.
- **K2 (component animation duration tokens)** — shipped in `0.5.0.0`. Entry/exit animations updated to `var(--duration-enter)` / `var(--duration-exit)`.
- **U1 (remove oversized typography utility classes)** — shipped in `0.5.0.0`. `.text-6xl` through `.text-9xl` removed from `slashed-utilities.css`.
- **U2 (breakpoints comment update)** — shipped in `0.5.0.0`. Comment in `slashed-utilities.css` updated to reflect container-query layout in `slashed-core.css`.
- **D1 (`docs/BRICKS.md`)** — shipped in `0.5.0.0`. Bricks Builder integration guide added covering breakpoint sync, `cq-*` utilities, and container-aware layout primitives.
