# SLASHED — Roadmap

> Forward-looking only. Shipped work lives in [`CHANGELOG.md`](CHANGELOG.md).
> Reviewed at every framework version bump.
>
> **Last reviewed:** v0.4.6.0 (2026-04-30).

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

**Lean.** Every class earns its place. No class is added speculatively — a
pattern must appear 3+ times across unrelated blueprint categories (in the
`slashed-blueprints` repo) before it becomes a framework class. Decorative
utilities stay in
the opt-in `slashed-utilities-visual.css`. The target bundle size is 25 KB
gzip for the full bundle. When evaluating a new addition: does it earn its
bytes?

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

#### Required first: battle-test pass #2 audit

Conduct a full re-audit of all categories in `slashed-blueprints`.
For each category, produce a table with three columns:

1. **Local BEM class** — every class defined in the blueprint's own
   `<style>` block that is not a framework class.
2. **Frequency** — how many unrelated categories use this same structural
   pattern (not the same class name — the same CSS pattern).
3. **Framework coverage** — can this pattern be reasonably composed from
   existing framework classes? If yes, which ones?

A local BEM pattern qualifies for promotion to the framework only if it:
- Appears **3 or more times across unrelated categories**, AND
- Cannot be reasonably composed from existing framework classes.

The audit output document lives in the slashed-blueprints repo and must
be reviewed before any conditional item below ships.

---

#### Competitive coverage audit

As part of pass #2, compare slashed-blueprints coverage against:

**Bricks wireframe library** (`templates.bricksbuilder.io/wireframes/wireframes-library/`)
Categories present in Bricks but absent or thin in SLASHED: Profile (15
templates vs. SLASHED's team-only coverage), WooCommerce depth (30
templates covering account/view-order/thank-you/pay-confirmation that
SLASHED's 6 e-commerce categories do not reach), Intros (5 templates —
short above-fold text blocks distinct from full hero sections).

**Frames layout library** (`getframes.io/layouts/`)
Categories present in Frames but absent from SLASHED: Backgrounds,
Devices, Image Groups, Schedules, Social Icons, Style Guide, Squeeze Pages,
Switches, Tables, Taxonomy, Woo Dashboard. Of these, **Style Guide** and
**Image Groups** are the highest-value additions. Style Guide (a page
showing token colors, typography scale, spacing scale, and component states
in context) doubles as a framework marketing asset. Image Groups (creative
image arrangements: overlapping, masked, collaged) demonstrate `.frame`,
`.overlay`, and `.bento` in a context consumers often build locally.

**Frames component library** (`getframes.io/components/`)
Frames ships: Modal, Trigger, Slider & Carousel, Table of Contents,
Accordion & Toggle, Tabs, Switch, Color Scheme Toggle. SLASHED covers all
of these except Slider & Carousel (deliberately out of scope — see Out of
scope section) and Table of Contents (partially covered by the
`article` category in slashed-blueprints).

**Gaps to evaluate in the audit:**

- Whether `team.html` should be extended or a separate `profile.html`
  category added for individual profile pages (user profile, author bio
  page, speaker page, member card).
- Whether SLASHED's 6 e-commerce categories need a `woocommerce.html`
  supplement covering the WP-specific Woo account/order/receipt pages.
- Whether a `style-guide.html` single-variant page is worth adding as a
  framework showcase.

---

#### Conditional component: `.cs-btn--icon`

**Condition:** audit confirms the icon-only button pattern (equal x/y
padding, square aspect ratio, no visible text label) appears 3+ times
across unrelated blueprints categories.

**Spec if confirmed:**

```css
.cs-btn--icon {
  padding: var(--btn-icon-padding, var(--space-xs));
  aspect-ratio: 1;
  justify-content: center;
}
```

Applied in combination with `--primary`, `--outline`, or `--ghost`:
`<button class="cs-btn--outline cs-btn--icon">`. No new HTML structure —
just a size/shape modifier on the existing button base.

---

#### Conditional layout extension: `.section--soft` / `.section--bold`

**Condition:** audit confirms tinted brand-colored section backgrounds appear
3+ times as local BEM across unrelated categories.

**Spec if confirmed:**

```css
.section--soft {
  background: var(--primary-50);
  color: var(--color-text);
}
.section--bold {
  background: var(--primary);
  color: var(--color-text-on-primary);
}
```

These are brand-colored companions to the existing `.section--alt`
(which uses `--color-surface-2`, a neutral tint). `--soft` encodes "subtle
brand presence"; `--bold` encodes "emphatic brand fill". Dark mode works
automatically — `--primary-50` and `--primary` are both redefined in the
dark mode blocks of `tokens-default.css`.

---

#### Conditional shared wrapper: brand-tile grid

**Condition:** audit confirms `logos.html` and `integration.html` share an
identical or near-identical local BEM wrapper for their brand-tile grids
(beyond the `.cs-brand-tile` component itself). Exact spec depends on
audit findings.

---

#### Cheatsheet / docs vs. CSS parity audit

No audit dependency. Fix in the same pass as battle-test pass #2.

`cheatsheet.html` and `docs/UTILITIES.md` document classes that do not
exist in `slashed-utilities.css`. For each phantom class, decide:
implement it (if the pattern is genuinely useful and fits the framework
philosophy) or remove the documentation entry. Classes that require
implementation become additive utilities — document them in CHANGELOG.
Classes that are simply deleted from docs need no CHANGELOG entry.

Known phantom classes to evaluate:

| Class | Documented in | Disposition |
|---|---|---|
| `.border-4` | cheatsheet | Evaluate: only `-0` and `-2` exist |
| `.border-default` | cheatsheet | Evaluate |
| `.self-stretch` | cheatsheet + docs | Implement or remove |
| `.self-auto` | cheatsheet | Implement or remove |
| `.justify-around` | docs | Implement or remove |
| `.justify-evenly` | docs | Implement or remove |
| `.inline` | docs | Implement (`display: inline`) |
| `.inline-grid` | docs | Implement |
| `.contents` | docs | Implement (`display: contents`) |
| `.static` | docs | Implement (`position: static`) |
| `.shrink` | docs | Implement (`.shrink-0` already exists) |
| `.start-0` / `.end-0` | docs + cheatsheet | Implement (inset logical aliases) |
| `.h-min` / `.h-max` | docs | Implement |
| `.min-w-full` | docs | Implement |
| `.max-w-prose` / `.max-w-none` / `.max-w-full` | docs | Evaluate |
| `.w-screen` | docs | Implement |
| `.masonry--l` | cheatsheet | Remove (`.bento` has `--tall`; masonry has no `-l` variant) |

After the audit, add a CI step or note to the cheatsheet content audit
(Path to 1.0) to prevent future doc/CSS drift.

---

#### Component rename: `cs-skeleton-line` → `cs-skeleton__line`

**File:** `css/slashed-components.css`.

**Problem:** `.cs-skeleton-line` violates SLASHED's BEM convention. It is an
element of `.cs-skeleton` (a visual loading placeholder), not a standalone
component. The correct BEM name is `.cs-skeleton__line`.

**This is a breaking change** (pre-0.8 — no migration doc required).

**Fix:**
1. Rename `.cs-skeleton-line` to `.cs-skeleton__line` in
   `slashed-components.css`.
2. Update `cheatsheet.html` if it references the old name.
3. Update slashed-blueprints to follow the rename.

---

#### `initTabsAccessible()` — WAI-ARIA Tabs keyboard pattern

**File:** `js/slashed-ui.js` — add as a new exported function.

Add as a separate opt-in function. Does not replace `initTabs()` (which
syncs `.is-active` for SSR / no-`:has()` environments and stays in place).

**Behaviour to implement:**

- Arrow Left / Arrow Right move focus between tab inputs within the same
  `.cs-tabs__list`.
- Home moves focus to the first tab; End moves to the last.
- Focused tab is auto-selected (activates its panel) — recommended pattern
  per WAI-ARIA Authoring Practices Guide for tabs.
- `aria-selected="true"` on the active tab's label; `aria-selected="false"`
  on all others.
- Roving tabindex: `tabindex="0"` on the active tab; `tabindex="-1"` on
  all others.

**Usage:** `slashedUI.initTabsAccessible()` — call instead of or alongside
`initTabs()`.

---

#### `initModalFocusRestore()` — focus restoration on dialog close

**File:** `js/slashed-ui.js` — add as a new exported function.

Native `<dialog showModal()>` already traps focus inside the dialog and
handles the Escape key natively. The remaining gap is returning focus to
the element that triggered `showModal()` when the dialog closes.

**Behaviour:**

- On `[data-modal-trigger]` click (or equivalent), record
  `document.activeElement` as the restore target.
- On the `dialog` `close` event, call `restoreTarget.focus()`.
- Guard: if `restoreTarget` no longer exists in the DOM (e.g. a dynamic
  list item that was removed), fall back to `document.body`.

**Usage:** `slashedUI.initModalFocusRestore()` — call once on page load.

---

#### Nav-dropdown keyboard navigation

**File:** `js/slashed-ui.js` — extend `initNavDropdowns()`.

Current behaviour: Escape closes, click-outside closes, `aria-expanded`
is synced on toggle. Add:

- Arrow Down on `summary` → opens the dropdown and moves focus to the
  first `.cs-nav-dropdown__link` item.
- Arrow Down / Arrow Up → cycle focus between `__link` items within the
  open menu.
- Home → first `__link`; End → last `__link`.
- First-letter navigation: pressing a printable character moves focus to
  the next `__link` whose visible text starts with that character
  (case-insensitive).
- Escape → close dropdown, return focus to `summary`.
- Tab (forward or back) → close dropdown (focus leaves naturally via
  browser default).

---

#### Toast assertive urgency

**File:** `js/slashed-ui.js` — extend `toast()`.

Add `urgency` option to the existing `toast(opts)` API:

```js
slashedUI.toast({ body: 'Upload failed.', variant: 'error', urgency: 'assertive' })
```

When `urgency: 'assertive'` is set, the toast element receives
`role="alert"` instead of `role="status"`. Screen readers using `alert`
role interrupt the current announcement to read the message immediately.
Use only for errors and critical failures — never for informational toasts.

Default remains `role="status"` (polite). No existing usage is affected.
The `urgency` key is ignored if absent.

---

#### Form-group error `aria-live` wiring

**File:** `js/slashed-ui.js` — add `initFormGroups()`.

`.cs-form-group__error` is visually hidden until `:user-invalid` triggers.
Once it becomes visible, screen readers do not announce it because the
visibility change is CSS-only with no DOM mutation.

**Behaviour:**

- On init, add `aria-live="polite"` and `aria-atomic="true"` to every
  `.cs-form-group__error` element in the document.
- Add a unique `id` to each `__error` and a corresponding
  `aria-describedby` on its sibling `__input`, linking them for screen
  readers that do not implement `aria-live` reliably on initially-hidden
  elements.

**Call in `init()`** alongside the other `init*` functions.

---

#### CSS modernization: `sibling-index()` native stagger

**Files:** `css/slashed-core.css` (stagger behavioral pattern),
`js/slashed-ui.js` (`initStagger`).

`sibling-index()` is Baseline Newly Available (Chrome 130+, Firefox 131+,
Safari 18+). It replaces `slashedUI.initStagger()` which manually sets
`--_i` on each `.stagger` child to polyfill native sibling indexing.

**Plan:**

1. In `slashed-core.css`, add native CSS stagger alongside the existing
   `--_i` pattern:
   ```css
   @supports (animation-delay: calc(sibling-index() * 1ms)) {
     @media (prefers-reduced-motion: no-preference) {
       .stagger > * {
         animation-delay: calc(
           (sibling-index() - 1) * var(--stagger-delay, var(--duration-stagger, 80ms))
         );
       }
     }
   }
   ```
2. Keep `initStagger()` in `js/slashed-ui.js` as a polyfill for browsers
   below the Baseline Newly Available threshold. Add a comment noting it
   is scheduled for deprecation when SLASHED's baseline advances past
   Chrome 130 / Firefox 131 / Safari 18.
3. No change to the public API or HTML markup — consumers using
   `slashedUI.initStagger()` continue to work; browsers that support
   `sibling-index()` use the CSS path automatically.

---

#### CSS modernization: extend `text-box` trim to more components

**File:** `css/slashed-components.css`

`text-box: trim-both cap alphabetic` is already used in `.cs-btn` behind
`@supports (text-box: trim-both cap alphabetic)`. Extend the same
`@supports` block to components where tight optical vertical centering
matters:

- `.cs-badge` — inline labels where pixel-perfect baseline alignment is
  visible next to other inline elements.
- `.cs-nav-link` — navigation items where cap-height centering improves
  visual rhythm.
- `.cs-chip` — compact interactive tags where glyph whitespace is
  visually prominent.
- `.cs-eyebrow` — all-caps label above headings where leading whitespace
  creates unwanted gap.

Implementation: add each selector to the existing `@supports` block in
`.cs-btn`, or create a shared `@supports` block covering all affected
components if that is cleaner.

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

### `0.5.0.0` — Token cleanup and API rationalisation

**Theme:** remaining token API cleanup and JS accessibility gap-close.
T4/C1/C2/C3/K3 shipped early in 0.4.5–0.4.6 as part of the issue #3
cleanup pass; the items below are what remains. Breaking changes to token
names are intentional — the scope justifies the MAJOR bump to `0.5`.

**Implementation order:**

1. `tokens-default.css` — T1, T2, T3, T5, T6, T7, T8, T9
   (T4 shipped in 0.4.6.0)
2. `slashed-components.css` — K1, K2
   (C1, C2, C3, K3 shipped in 0.4.5.0 / 0.4.6.0)
3. `slashed-utilities.css` — U1, U2
4. `docs/BRICKS.md` — D1
5. Rebuild `slashed-full.css` via `bin/build-bundle.sh`
6. Audit wireframes for removed token names (`.text-7xl`,
   `--font-weight-bold`, etc.) — fix or record as migration notes in
   CHANGELOG.

**Summary of remaining changes:**

| Action | Remaining | Already shipped |
|---|---|---|
| Tokens removed | 19 (T1–T3, T5) | 4 (T4 — container renames, 0.4.6.0) |
| Tokens added | 4 (`--z-above`, `--duration-enter`, `--duration-exit`, `--font-weight-heading`) | 2 (`--container-wide`, `--container-full`, 0.4.6.0) |
| Tokens renamed | 1 (`--font-weight-bold` → `--font-weight-heading`) | 3 (container tokens, 0.4.6.0) |
| Utility classes removed | 4 (`.text-6xl` through `.text-9xl`) | — |
| Modifier classes removed/added/renamed | — | All 7 (0.4.6.0) |
| CSS files to update | 2 (`tokens-default.css`, `slashed-components.css`) | 2 (`slashed-core.css`, `slashed-utilities.css`) |
| Docs files new | 1 (`docs/BRICKS.md`) | — |

---

#### T1 — Remove `--font-weight-*` (8 tokens), rename 1

**File:** `css/tokens-default.css`

Remove:

```text
--font-weight-thin, --font-weight-extralight, --font-weight-light,
--font-weight-normal, --font-weight-medium, --font-weight-semibold,
--font-weight-extrabold, --font-weight-black
```

Rename:

```text
--font-weight-bold: 700  →  --font-weight-heading: 700
```

---

#### T2 — Trim alpha variants to 3 steps

**File:** `css/tokens-default.css`

Remove for `--primary`, `--secondary`, and `--accent` in the light block, dark
block, and legacy fallback block:

```text
--primary-a10, --primary-a90
--secondary-a10, --secondary-a90
--accent-a10, --accent-a90
```

Keep: `a25`, `a50`, `a75`. The legacy-fallback block must align with the modern
block — 3 steps, consistently.

---

#### T3 — Remove `--text-6xl` through `--text-9xl`

**File:** `css/tokens-default.css`

Remove:

```text
--text-6xl, --text-7xl, --text-8xl, --text-9xl
```

Scale ends at `--text-5xl` (64–96 px). `--text-fluid-hero` serves hero
sections.

---

#### T5 — Differentiate `--color-text-faint` and `--color-text-disabled`

**File:** `css/tokens-default.css`

Light mode:

```text
--color-text-faint:    var(--neutral-400)  (unchanged)
--color-text-disabled: var(--neutral-300)  (was: --neutral-400)
```

Add a comment at `--color-text-disabled` explaining the intent: WCAG exempts
disabled elements from contrast requirements; this value is intentionally below
AA.

---

#### T6 — Fix `--shadow-inner`

**File:** `css/tokens-default.css`

```css
/* BEFORE: */
--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);

/* AFTER: */
--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, calc(var(--shadow-strength) * 1.5));
```

---

#### T7 — Add `--duration-enter` and `--duration-exit`

**File:** `css/tokens-default.css`

Add after the existing duration token block:

```css
--duration-enter: var(--duration-normal);
--duration-exit:  var(--duration-fast);
```

---

#### T8 — Add `--z-above`

**File:** `css/tokens-default.css`

Insert between `--z-docked` and `--z-sticky`:

```css
--z-above: 100;
```

Update the comment on the z-index scale to clarify that `--z-sticky` and above
intentionally do not beat the WP admin bar (99999) — only `--z-max` does.

---

#### T9 — Auto-pairing `--color-text-on-*`

**File:** `css/tokens-default.css`

Add after the `@supports` block:

```css
@supports (color: oklch(from red 0 0 0)) {
  :root {
    --color-text-on-primary:
      oklch(from var(--primary) clamp(0.1, (0.6 - l) * 999, 1) 0 0);
    --color-text-on-secondary:
      oklch(from var(--secondary) clamp(0.1, (0.6 - l) * 999, 1) 0 0);
    --color-text-on-accent:
      oklch(from var(--accent) clamp(0.1, (0.6 - l) * 999, 1) 0 0);
  }
}
```

Existing `white` / `var(--neutral-900)` fallbacks remain for older browsers.
(This item was also planned in `0.4.5.0` — it ships here together with the
rest of the token rationalisation pass.)

---

#### K1 — Replace `--font-weight-bold` and derivatives in components

**File:** `css/slashed-components.css`

Replace every `var(--font-weight-bold)` with `var(--font-weight-heading, 700)`
and every `var(--font-weight-semibold)` with the literal `600`.

---

#### K2 — Use `--duration-enter` / `--duration-exit` on component animations

**File:** `css/slashed-components.css`

Audit all enter/exit animations: modal open/close, tooltip show/hide, dropdown
open/close, popover. Replace:

- Entry animations → `var(--duration-enter)`
- Exit animations → `var(--duration-exit)`

---

#### U1 — Remove utility classes for removed typography tokens

**File:** `css/slashed-utilities.css`

Remove:

```text
.text-6xl, .text-7xl, .text-8xl, .text-9xl
```

These correspond to the tokens removed in T3.

---

#### U2 — Update breakpoints comment

**File:** `css/slashed-utilities.css`

The current comment states that breakpoints exist in this file only and that
`slashed-core.css` breakpoints are separate. After C2 that is no longer true.
Replace with:

```css
/* BREAKPOINTS — configure once per project before use.
   This is the ONLY file with hardcoded breakpoint values.
   slashed-core.css layout primitives use @container queries
   and do not need to be updated when changing breakpoints. */
```

---

#### D1 — Add `docs/BRICKS.md` (new file)

**File:** `docs/BRICKS.md` (new)

Sections to include:

- Synchronising breakpoints with the Bricks GUI (when and how to
  find-replace in `slashed-utilities.css`)
- Prefer `cq-*` utility classes over `md:` / `lg:` when styling inside Bricks
- Layout primitives after C2 are container-aware and do not require
  breakpoint synchronisation

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
