# Changelog

All notable changes to SLASHED are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

**Versioning note:** This project uses a four-part version scheme `0.MAJOR.MINOR.PATCH` while in pre-1.0 phase. The leading `0.` signals that the API is not yet considered stable for production. Once the framework graduates to production-ready, versioning will shift to standard semver `MAJOR.MINOR.PATCH`. Previously the 1.x scheme was used — see the migration note in the 0.1.1.0 entry.

**Blueprints library strategy:** Blueprints are content, not framework API. Adding blueprint variants does not trigger a framework version bump.

---

## [unreleased]

### Fixed (review pass on PR #4)

- `css/tokens-default.css` — `--color-text-on-primary` in dark mode
  changed from `#ffffff` to `#111827`. White on dark-mode primary
  (`#5b8def`) was 3.24:1, failing WCAG AA. Dark text is 5.48:1.
- `css/slashed-core.css` `prefers-reduced-data` selector tightened from
  `[class*="cs-"]` / `[class*="bg-"]` (substring match, false-positives
  on names like `btn-cs-primary`) to whole-token matching with
  `[class^="cs-"], [class*=" cs-"]`.
- `css/slashed-core.css` `.bento` `@container` queries — `(max-width:
  48em)` tightened to `(max-width: 47.99em)` on both occurrences (medium
  bento layout and span-collapse override). Aligns with the
  `47.99em` convention used elsewhere in the framework and prevents
  the medium rule from leaking into the `48em` breakpoint.
- `css/slashed-core.css` `dialog` element — width now derives from
  `--container-dialog` (20rem) via a new `--dialog-max-width` instance
  custom property. The previous default routed through
  `--container-prose` (65ch), which made the new `--container-dialog`
  token meaningless for the very element it was named for. Consumers
  who want wider dialogs can override per-instance:
  `<dialog style="--dialog-max-width: var(--container-prose)">…</dialog>`.
  This shrinks the default `<dialog>` width from ~40rem to 20rem; if
  your app has substantive dialogs, set `--dialog-max-width` (per
  instance or globally on `:root`) to your preferred token.
- `docs/COMPONENTS.md` `.cs-nav-link` paragraph rewritten — no longer
  claims the rule is authored as `a.cs-nav-link` with specificity
  0,1,1; documents the class-only authoring and the cascade-layer
  mechanism.

## [0.4.6.0] — 2026-04-30 — Container token rename, width utility refactor, docs audit

Resolves issue #3 sections 6 and 7. Two breaking changes shipped without
deprecation aliases (pre-1.0 caveat — see `docs/DEPRECATION-POLICY.md`).
Migration is a search-and-replace on consumer wireframes; the maps below
are exhaustive.

### Breaking

- Container tokens — `--container-xs`, `--container-sm`, `--container-narrow`
  removed. `--container-prose` (already 65ch) replaces `--container-narrow`
  semantically. New tokens `--container-dialog` (20rem) and
  `--container-form` (24rem) replace `xs` / `sm`.

  | Old | New |
  |---|---|
  | `--container-xs` (20rem) | `--container-dialog` (20rem) |
  | `--container-sm` (24rem) | `--container-form` (24rem) |
  | `--container-narrow` (40rem) | `--container-prose` (65ch — already in tokens) |

- Container modifier classes — `.container--xs`, `.container--sm`,
  `.container--narrow` removed.

  | Old | New |
  |---|---|
  | `.container--xs` | `.container--dialog` |
  | `.container--sm` | `.container--form` |
  | `.container--narrow` | `.container--prose` |

- Width utilities — fractional `.w-*` and `.w-content-*` reorganised into
  three explicit axes with prefix-based names. Old numeric variants
  removed.

  | Old | New |
  |---|---|
  | `.w-25` | `.w-1/4` |
  | `.w-33` | `.w-1/3` |
  | `.w-50` | `.w-1/2` |
  | `.w-66` | `.w-2/3` |
  | `.w-75` | `.w-3/4` |
  | `.w-content-25` | `.w-content-1/4` |
  | `.w-content-33` | `.w-content-1/3` |
  | `.w-content-50` | `.w-content-1/2` |
  | `.w-content-66` | `.w-content-2/3` |
  | `.w-content-75` | `.w-content-3/4` |
  | _(no equivalent)_ | `.w-vw-10` … `.w-vw-100` (steps of 10) |

  The slash is escaped in CSS source (`.w-1\/2 { … }`) and unescaped in
  HTML (`class="w-1/2"`) — the same convention used by Tailwind. Three
  axes are now distinct: parent-relative (fractions), viewport-relative
  (`.w-vw-*`), content-width-relative (`.w-content-*`).

### Changed

- `css/slashed-core.css` — `dialog` base width changed from
  `var(--container-narrow, 40rem)` to `var(--container-prose, 65ch)`.
  Visual width shifts a few rem either way depending on body font size;
  the `ch` unit follows readable line-length more correctly than a fixed
  rem value.
- `css/slashed-components.css` — `.cs-section-header` default
  `--section-header-max` changed from `--container-narrow` to
  `--container-prose`. Same reasoning.

### Added

- `css/slashed-utilities.css` — `.w-vw-10` … `.w-vw-100` viewport-width
  scale in 10% steps.

### Documentation

- `cheatsheet.html` — Width section expanded to show all three axes.
  Container variants list updated (`dialog/form/prose/wide/full`).
- `docs/UTILITIES.md` — Width table replaces single-line percentage
  entry with the three-axis table; intro note explains the distinction.

### Regenerated

- `css/slashed-full.css` regenerated at v0.4.6.0 state.

---

## [0.4.5.0] — 2026-04-30 — Cleanup pass: layered selectors, dark contrast, native `<dialog>` semantics, `.grid-N` container queries

Resolves issue #3 sections 1, 3, 4, 5, and the layout-half of section 2.
Section 6 (container token rename) and section 7 (utility audit + width
scale) ship in 0.4.6.0.

### Breaking

- `css/slashed-core.css` — fixed grids (`.grid-1` … `.grid-12`,
  `.grid-sidebar`, `.grid-1-1`, `.grid-1-2`, `.grid-1-3`, `.grid-2-1`)
  now establish their own `container-type: inline-size` and use
  `@container (min-width: …)` instead of `@media`. Layouts inside narrow
  parents (Bricks columns, sidebars, modal bodies) collapse to fewer
  columns based on their actual width, not the viewport. This is the
  intended behaviour and aligns with the framework's "intrinsic layout"
  pillar — but consumers who relied on the previous viewport-based
  collapse will see different breakpoints on nested usage. Standard
  remedy: none required if the grid is direct child of a full-width
  container; otherwise widen the parent or pick a smaller grid.
- `js/slashed-ui.js` — `initModals` no longer closes the modal on clicks
  outside the dialog's DOM tree. The browser already routes backdrop
  clicks to `event.target === <dialog>`; that is now the sole signal.
  Portal-rendered popovers (autocomplete, tooltips, Select-style menus)
  attached to `document.body` from inside a modal will no longer
  accidentally close the modal.

### Changed

- `css/slashed-components.css` — `.cs-nav-link`, `.cs-nav-link:hover`,
  `.cs-nav-link:visited`, `.cs-nav-link:visited:hover` lost the `a.`
  prefix. Same for `.cs-nav-dropdown__parent` and its variants. Cascade
  layer order is sufficient to beat base `a` / `a:visited` styles —
  the tag prefix was redundant.
- `css/slashed-components.css` — `textarea.cs-form-group__input,
  select.cs-form-group__input` rule consolidated into
  `.cs-form-group__input:is(textarea, select)` and joined into the
  shared selector list with the `[type="…"]` variants. No tag prefix.
- `css/slashed-components.css` — `.cs-input-group > input,
  .cs-input-group > select` no longer strip `border-inline-end` or
  squash trailing radii. The negative `margin-inline-start: -1px` on
  `.cs-input-group > * + *` (already in the addons block) is the only
  joining mechanism, so all permutations (`input|btn`, `btn|input`,
  `input|input|btn`, `btn|btn|input`) collapse to a single 1px seam,
  the trailing element keeps its full border, and `:focus-visible`
  draws a complete outline.
- `css/tokens-default.css` — dark mode (`@media (prefers-color-scheme:
  dark) :root:not([data-theme="light"])` and `[data-theme="dark"]`) now
  hardcodes `--color-text-on-primary`, `--color-text-on-secondary`, and
  `--color-text-on-accent`. Without these the light-mode values
  (`var(--neutral-900)` etc.) would cascade into dark mode where
  `--neutral-900` flips to a near-white value, producing light-on-yellow
  contrast failures. T9 in 0.5.0 will replace these constants with
  `oklch(from …)` auto-pairing on engines that support Relative Color
  Syntax; the constants serve as the universal fallback.
- `js/slashed-ui.js` — `initModals` is now a four-line handler around
  `document.querySelector('dialog.cs-modal:modal')` and
  `event.target === dialog`. The previous mix of bounding-rect math
  and tree-containment checks is removed.
- `js/slashed-ui.js` — `initRangeFill`'s inner `update()` extracted to a
  module-scope `updateRange(input)` so it can be invoked directly. The
  auto-attach behaviour on `input[type="range"]` is unchanged.

### Added

- `css/slashed-components.css` — `.cs-table--responsive` modifier:
  `display: block; overflow-x: auto; max-width: 100%;`. Same horizontal-
  scroll pattern already used by `.prose table`. Apply alongside
  existing `.cs-table--*` modifiers when a table needs to scroll on
  narrow viewports.
- `css/slashed-components.css` — `.cs-nav-dropdown::details-content`
  rule for browsers that support the pseudo-element (Chrome 131+,
  Firefox 133+, Safari 18.2+). Animates the height transition on
  mobile (≤47.99em) so the dropdown expands smoothly instead of
  snapping. The rule is intentionally scoped to mobile because
  `overflow: hidden` on `::details-content` would clip the desktop
  popover, which uses `position: absolute`. A future major may
  reimplement the desktop dropdown on Popover API + anchor
  positioning, at which point the rule can lift the media query.
- `js/slashed-ui.js` — `slashedUI.updateRange(input)` and
  `slashedUI.closeModal(dialog)` exposed on `window.slashedUI` for
  programmatic invocation from dynamic content (form re-render,
  programmatic dismiss, etc.).

### Documentation

- `docs/DEPRECATION-POLICY.md` filled in (was a TBD skeleton). Defines the framework's three-phase policy — Announce → Alias → Remove — for renames and removals on the public surface (tokens, `.cs-*` classes, layout primitives, utilities, instance custom properties, cascade-layer order). Pragmatic, buildless-friendly: aliases live as in-source CSS rules with a `/* Deprecated since vX.Y.Z, removed in vA.B.C */` comment, no new cascade layer, no `console.warn`. Minimum aliasing window is one full minor release. Pre-1.0 reserves the right to break outside this process; post-1.0 it becomes binding.
- `docs/SPEC.md` § "Path to 1.0" — added a 10th bullet, "Cheatsheet content audit." Every entry in `cheatsheet.html` must map to a real selector or `--*` declaration in `css/*.css`, verified by a CI grep script before 1.0. Protects against silent documentation drift as the cheatsheet grows.
- Acronym expansion updated to reflect the framework's evolved philosophy.
  **Old:** Structured Lightweight Agnostic Speedy Hybrid Essential
  Dependency-free. **New:** Standalone Lean Agnostic Structured Hybrid
  Edgeless Deterministic. All public API (class names, tokens, file names)
  is unchanged — this is a documentation/philosophy update only.

### Regenerated

- `css/slashed-full.css` regenerated at v0.4.5.0 state.

## [0.4.4.0] — 2026-04-28 — `.cs-banner` and `.cs-marquee` components

New `.cs-banner` and `.cs-marquee` components. No breaking changes.

### Added

- `css/slashed-components.css` — `.cs-banner`: full-width sticky notification
  strip. Modifiers: `--info`, `--warning`, `--error`, `--bottom` (viewport
  bottom anchor). Elements: `__message`, `__actions`, `__close`. Instance
  tokens: `--banner-bg`, `--banner-color`, `--banner-border`,
  `--banner-padding-block`, `--banner-padding-inline`. Uses existing
  `--z-banner: 1200` token (above sticky header at 1100).
- `css/slashed-components.css` — `.cs-marquee` / `.cs-marquee__track`:
  horizontally scrolling strip for logo bars, tag clouds, tickers. Instance
  tokens: `--marquee-speed` (default `40s`), `--marquee-gap` (default
  `var(--space-l)`). Seamless loop requires items duplicated in HTML.
- `css/slashed-core.css` — `prefers-reduced-motion` override for
  `.cs-marquee__track` in `@layer slashed.a11y`: stops animation and wraps
  items so content remains accessible.

### Changed

- All CSS file headers — version bumped `v0.4.3.0` → `v0.4.4.0`.

### Regenerated

- `css/slashed-full.css` regenerated at v0.4.4.0 state.

---

## [0.4.3.0] — 2026-04-27 — Bugfixes & housekeeping

Zero new API. Fixes long-standing documentation, RTL, and a11y bugs that
accumulated through 0.4.x. No breaking changes; no migration required.

### Fixed

- `cheatsheet.html` — corrected stale token display values: durations
  `150 / 300 / 500ms` → `150 / 250 / 400ms`; z-index summary
  `0/1/10/100/400/500/1800` → `0/1/10/1100/1300/1400/1800`; `.z-sticky`,
  `.z-overlay`, `.z-modal` class display values updated to `1100/1300/1400`
  to match `tokens-default.css`.
- `cheatsheet.html` — span utility display now lists `.col-span-2/3/4/5/6/full`
  (was missing 4 and 5) and `.row-span-2/3/4` (was missing 3 and 4).
- `docs/UTILITIES.md` — z-index utility table updated to `1100/1300/1400`;
  added missing `.col-span-5`, `.row-span-3`, `.row-span-4` rows.
- `css/tokens-default.css` — replaced misleading white-label comment that
  suggested find-replacing `--cs-` across files. `--cs-` is a class prefix
  only (`.cs-btn`, `.cs-card`); tokens use a flat namespace
  (`--primary`, `--space-m`). The new comment shows the correct override
  pattern: redeclare individual tokens on `:root` in a consumer stylesheet.
- `css/slashed-utilities.css` — empty `Background colors` section header
  replaced with a one-line redirect comment pointing to
  `slashed-utilities-visual.css`. The section had been gutted in 0.3.x
  when bg utilities moved to the visual file but the empty header was
  never cleaned up.
- `css/slashed-utilities.css` — `.scheme--dark` and `.scheme--light` had
  drifted to an orphaned position between the (empty) bg section and the
  borders section. Moved to a properly-headed `Scheme / Theme` section
  with documentation comment.
- `css/slashed-utilities-visual.css` — `.bg-light` now sets
  `color-scheme: light` to mirror `.bg-dark`. Without it, `light-dark()`
  tokens inside a `.bg-light` subtree resolved against the page-level
  scheme instead of the requested light scheme — e.g. a card themed
  light inside a dark hero would show dark text colors.
- `css/slashed-utilities-visual.css` — normalised one-off extra spacing
  before `{` on `.bg-secondary` and `.bg-accent` to match adjacent rules.
- `css/slashed-core.css` — select element custom chevron now flips
  correctly under `[dir="rtl"]`. The previous `background-position: right
  var(--space-s) center` looks logical but `background-position`
  percentages are physical, not logical — RTL did not flip automatically.
  Replaced with explicit `calc(100% - var(--space-s)) center` for LTR and
  added a `:is([dir="rtl"], [dir="rtl"] *) select` override that flips the
  chevron to inline-end (visually left).

### Changed

- `docs/COMPONENTS.md` — full rewrite. Document organisation switched from
  per-version sections to functional areas (Buttons & controls, Form
  patterns, Navigation, Layout & containers, Data display, Media & brand,
  Loading states). Every `.cs-*` component currently in
  `slashed-components.css` is now documented, including everything added
  in 0.3.x and 0.4.x that was previously missing: `.cs-tabs`,
  `.cs-pagination`, `.cs-dropdown`, `.cs-message`, `.cs-header`,
  `.cs-footer`, `.cs-navbar`, `.cs-level`, `.cs-menu`, `.cs-toast-stack`,
  `.cs-toast`, `.cs-delete`, `.cs-tags`, `.cs-icon-text`, segmented
  `.cs-card`, `.cs-modal--card`, `.cs-form-group--horizontal`,
  `.cs-input-wrap`, `.cs-checkbox`, `.cs-radio`, `.cs-file`,
  `.cs-btn--loading`, `.cs-progress` color/indeterminate modifiers,
  `.cs-breadcrumb` separator modifiers. Version header bumped from
  `v0.2.0` to `v0.4.3.0`.

### Removed

- `docs/RECIPES.md` — deleted. The file was a TBD stub from the early
  documentation plan; the blueprint library has fully superseded its
  scope and RECIPES.md never accumulated content. Removed the
  corresponding line from `README.md`.

### Corrections to prior changelog entries

- `.cs-tabs` was documented as supporting "up to 6 tabs" without JS in the
  0.3.3.0 release notes. The actual implementation has supported up to
  10 tabs since that release — the `:has(.cs-tabs__tab:nth-child(N))`
  selector list goes through `:nth-child(10)`. Cheatsheet and
  `COMPONENTS.md` have been updated to reflect the correct ceiling.
- Duration tokens were inconsistently described in pre-0.4 docs as
  `300ms` (normal) and `500ms` (slow). The canonical values in
  `tokens-default.css` are and have always been `--duration-normal:
  250ms` and `--duration-slow: 400ms`. The `300ms / 500ms` figures were
  documentation drift, not a token change. All affected docs are now
  consistent.

### Regenerated at v0.4.3.0 state

- `css/slashed-full.css` — bundle regenerated via `bin/build-bundle.sh`
  to pick up the `slashed-core.css` and `slashed-utilities.css` changes
  above.

### Migration

None. No class names, token names, layer order, or component contracts
changed. The RTL select chevron and `.bg-light` color-scheme fixes are
silent improvements visible only when those specific contexts are
exercised.

## [0.4.2.1] — 2026-04-26 — Motion utility refinements

### Fixed

- `docs/DEPRECATION-POLICY.md` link to `SPEC.md` corrected (was `docs/SPEC.md`, which resolved to `docs/docs/SPEC.md` from this file's location).
- `.motion-safe:transition` extended to include `outline-color` and `rotate` in the transition-property list. The framework uses both — `outline-color` for focus states across components, `rotate` for chevron animations on `<details>`/`<summary>` and `.cs-dropdown__trigger`. Without these in the list, transitions on those properties were instant under motion-safe.
- `.motion-safe:hover-lift` now uses `--hover-lift-shadow` and `--hover-lift-y` tokens (matching the unprefixed `.hover-lift` rule). Was hardcoded to `var(--shadow-m)` and `0 -2px`.
- `.motion-reduce:animate-fade-in` now declares `!important` for symmetry with `.motion-reduce:animate-none` and `.motion-reduce:transition-none`. Preserves the a11y guarantee that user motion preference wins over unlayered BEM in user code.

### Changed

- `docs/SPEC.md` § "Path to 1.0" — `Experimental graduation policy` bullet now references the concrete promotion rule defined in § "Stable vs experimental" (added in 0.4.2.0). Was previously marked "Not yet defined", contradicting the new rule.
- `docs/COMPONENTS.md` § `.cs-accordion` — added a sentence noting that `::details-content` smooth animation requires Chrome 131+ / Firefox 133+ / Safari 18.2+ and degrades to instant open/close on older browsers.
- `docs/UTILITIES-VISUAL.md` PHP example `$ver` updated from stale `'0.2.0'` to `'0.4.2.1'`.
- `cheatsheet.html` motion utilities section heading annotated `(a11y layer — respect prefers-reduced-motion)` to mirror the layer relocation in 0.4.2.0.
- `[0.4.0]` "Breaking — JS global" entry restored to use a code-block diff (old/new) for the `codeslashUI` → `slashedUI` rename, improving grep-ability for migration searches.
- `css/slashed-components.css` inline comment above `::details-content` enhanced with a clearer "falls back to instant open/close" note.

### Migration

Zero markup changes for users. Class names, token names, layer order unchanged. The new `transition-property` entries (`rotate`, `outline-color`) make existing transitions smoother where the framework already used these properties — no user code needs to change.

## [0.4.2.0] — 2026-04-26 — Motion utilities relocated to a11y layer + maintenance

### Added

- `docs/DEPRECATION-POLICY.md` (TBD skeleton). Will define the framework's three-phase deprecation process for token names, component classes, modifiers, and instance custom properties on the path to 1.0.
- `docs/RECIPES.md` (TBD skeleton). Cookbook of common multi-component patterns built from SLASHED primitives.
- `docs/SPEC.md` § "Stable vs experimental" subsection documenting `slashed-experimental.css` as a separate opt-in file and stating the promotion rule from experimental into core.

### Changed

- Motion-preference utilities (`.motion-safe:transition`, `.motion-safe:animate-{fade-in,slide-up,scale-in,spin}`, `.motion-safe:hover-lift`, `.motion-reduce:animate-none`, `.motion-reduce:transition-none`, `.motion-reduce:animate-fade-in`) moved from `@layer slashed.utilities` to `@layer slashed.a11y`. Class names unchanged; markup in user code requires no edits. Effect: motion-preference rules now beat decorative layers in the cascade, matching every other `prefers-*` override. Resolves the asymmetry documented in `[0.1.2.1]`.
- CSS source headers (`slashed-core.css`, regenerated `slashed-full.css`) corrected to declare the actual baseline `Chrome 123+, Firefox 120+, Safari 17.5+, Edge 123+`, matching `README.md` and `docs/SPEC.md`. The previous `Chrome 131+/Firefox 133+/Safari 18.2+` declaration was driven by a single optional feature (`::details-content` smooth-accordion) that degrades gracefully.
- `CHANGELOG.md` condensed to strict Keep a Changelog format. Cut Wave development notes, archival framework-comparison roadmap section, "Statistics" tables, and "Files changed" lists. Every release's user-facing Added/Changed/Fixed/Removed bullets and migration notes preserved.

### Removed

- "Why X" rationale sections from `docs/SPEC.md`, `docs/TOKENS.md`, `docs/UTILITIES.md`, `docs/UTILITIES-VISUAL.md` ("Living document" callout, "Why aliases exist", "What does NOT belong here", "Why the split", "When to reach for this file", "When NOT to load this file"). API-doc surface preserved.
- Framework-comparison passages from `README.md`, `docs/SPEC.md`, `docs/UTILITIES.md`, `docs/UTILITIES-VISUAL.md`, and `css/slashed-utilities*.css` comment headers.

### Migration

Zero markup changes for users. Class names identical, token names identical, layer order unchanged. The motion-* relayer is internal cascade hygiene — no consumer-visible behaviour change unless you authored project styles into `slashed.utilities` that intentionally tried to override `motion-safe:*`/`motion-reduce:*` (a11y now wins, as it does for every other `prefers-*` override).

## [0.4.1.0] — 2026-04-26 — CSS audit fixes + token-system documentation

### Fixed

- `.cs-pagination__link--current`, `.cs-tabs--pill`, `.cs-checkbox`, `.cs-radio`, `.cs-file__cta`, `.cs-menu__link--active`, and 2 other sites now reference the defined `--color-text-on-primary` token instead of an undefined `--primary-contrast`. The previous `, white` fallback meant text on the dark-mode primary fill was unreadable. (8 sites in `slashed-components.css`.)
- `.cs-header--glass` now drops `backdrop-filter` when a child dropdown opens, allowing the dropdown menu to escape the stacking context that the filter creates. The pre-existing 0.3.8.2 z-index escape rule alone was insufficient.
- `.cs-input-group > *:focus` no longer raises the focused element on mouse click. Replaced with `:focus-visible`-only so the raise applies to keyboard focus only.
- `.cs-radio-card__input` and `.cs-check-card__input` migrated from deprecated `clip: rect(0,0,0,0)` to `clip-path: inset(50%)`, matching `.sr-only` and every other hidden-input pattern in the framework.

### Changed

- `.cs-btn--primary/--outline/--ghost` and the `.text-box-trim` utility wrap `text-box: trim-both cap alphabetic` in `@supports (text-box: trim-both cap alphabetic) { … }` so the declaration only applies in browsers that implement it (currently Chrome 135+). Avoids cross-browser optical-centering drift.
- Nine component focus rings now reference `var(--focus-ring-offset, 2px)` instead of a literal `2px`.
- `slashed-utilities-visual.css` `currentColor` lowercased to `currentcolor`, completing the 0.3.8.2 sweep.

### Documented

- New top-level section in `docs/TOKENS.md` documenting the token taxonomy (primitive ↔ semantic alias ↔ component instance), with full tables of the semantic alias surface (`--color-*`, `--space-section/-content/-gap`, `--hN`, `--font-heading`, `--content-width`, `--focus-ring-*`).
- Inline `tokens-default.css` comments at the alias definitions cross-reference `docs/TOKENS.md`.

## [0.4.0] — 2026-04-25 — Rebrand to SLASHED + MIT license

The framework, previously **CODE/**, is now **SLASHED** — **S**tructured **L**ightweight **A**gnostic **S**peedy **H**ybrid **E**ssential **D**ependency-free. Released under the MIT license, which the cheatsheet footer had been declaring aspirationally for several versions; this release ships the actual `LICENSE` file.

### Breaking — file renames

All framework CSS and JS source files renamed from `codeslash-*` to `slashed-*`:

| Old | New |
|---|---|
| `css/codeslash-core.css` | `css/slashed-core.css` |
| `css/codeslash-components.css` | `css/slashed-components.css` |
| `css/codeslash-utilities.css` | `css/slashed-utilities.css` |
| `css/codeslash-utilities-visual.css` | `css/slashed-utilities-visual.css` |
| `css/codeslash-experimental.css` | `css/slashed-experimental.css` |
| `css/codeslash-full.css` | `css/slashed-full.css` |
| `js/codeslash-ui.js` | `js/slashed-ui.js` |

Update every `<link href="...">` and `<script src="...">` in your project. `tokens-default.css` keeps its name.

### Breaking — cascade layers

The eight layered names changed from `codeslash.*` to `slashed.*`:

```css
@layer slashed.reset, slashed.base, slashed.layout,
       slashed.components, slashed.utilities, slashed.visual,
       slashed.a11y, slashed.overrides;
```

If you author project-specific overrides into the framework's override layer, rename `@layer codeslash.overrides` → `@layer slashed.overrides`.

### Breaking — JS global

The optional UI-enhancement script's global object renamed:

```js
// Old
codeslashUI.toast({ title: 'Saved' });
codeslashUI.initStagger(container);

// New
slashedUI.toast({ title: 'Saved' });
slashedUI.initStagger(container);
```

### Breaking — repository moved

GitHub repo renamed from `codeslash-net/codeslash-css-framework` to `codeslash-net/slashed`. GitHub serves automatic redirects for the old URL, but pinned jsDelivr URLs and pinned GitHub release URLs should be updated to the new path.

### Added

- `LICENSE` (MIT) at repo root. Copyright (c) 2026 Jacek Granatowski (codeslash.net).
- `package.json` declares `"license": "MIT"` and an `author` field.
- README opens with the SLASHED acronym expansion and a real `## License` section.

### Unchanged — *not* breaking

- Every `.cs-*` component class is preserved (291 unique classes). The prefix is now re-interpreted as **c**omponent **s**tyle. A full rename to `.sl-*` was rejected to spare consumers a global find/replace.
- All design tokens (`--primary`, `--space-m`, `--color-surface`, `--text-xl`, ...).
- All public utility classes and layout-primitive classes (`.flex`, `.gap-m`, `.container`, `.section`, `.stack`, `.cluster`, `.grid-cols`, `.auto-grid`, ...).
- All component-instance custom properties (`--btn-bg`, `--card-padding`, `--bento-cols`, ...).

## [0.3.8.4] — 2026-04-24 — `.cs-feature-list__item` inline-element fix

### Fixed

- `.cs-feature-list__item` previously laid out as a flex container, which made plain text mixed with inline elements (`<strong>`, `<em>`, `<a>`, `<code>`) split into separate flex items with visible gaps between fragments. Switched to a hanging-indent absolute-marker model: the item is `display: block; position: relative; padding-inline-start: calc(1.1em + var(--space-xs))`, and the `::before` is `position: absolute`. The marker is out of flow, inline elements embed correctly, and multi-line content hangs-indents under the first line. All `--arrow`/`--bullet`/`--cross`/`--star` and item-level `__item--cross`/`__item--muted` modifiers continue to work unchanged.

### Added

- `CLAUDE.md` at repo root — repo-specific working notes (gotchas like `--cols` vs `--grid-cols`, `.grid-1-2` direction).

## [0.3.8.3] — 2026-04-24 — Bricks rem-protection hardened to `:root:root`

### Fixed

- `.text-*` utilities rendered at ~10–12px instead of 17–20px in Bricks installations because several Bricks child themes and popular WordPress themes (Astra, OceanWP) declare their own `:root { font-size: 62.5% }` at the same specificity (0,1,0) and win on source order. Pulled `font-size: max(16px, 1em)` out of the main `:root { }` block and into a standalone `:root:root { font-size: max(16px, 1em) }` rule. `:root:root` has specificity (0,2,0), which beats every plausible `:root` or `html` rule a theme can author without `!important`. The rule is kept **separate** from the token block so user overrides on a plain `:root` (e.g. theming `--primary`) still work at (0,1,0).

### Changed

- `docs/INSTALLATION.md` § Bricks Builder now documents the admin-side root-cause fix: **Theme Styles → Typography → HTML font size → 100%**. The `:root:root` defense remains as complementary defense-in-depth.

## [0.3.8.2] — 2026-04-24 — `.cs-header--glass` split + dropdown stacking

### Fixed

- `.cs-header--sticky` no longer traps child dropdowns. Splits the concern: `.cs-header--sticky` uses a plain background (no `backdrop-filter`, no stacking context); the new `.cs-header--glass` modifier opt-in adds the frosted-surface effect for headers without descendant dropdowns; and a `:has()` rule on `.cs-header--sticky` bumps its z-index to `--z-dropdown` whenever a `.cs-nav-dropdown[open]`/`.cs-dropdown[open]`/`[data-state="open"]` descendant is present.
- `.cs-header--bordered` now uses header-specific tokens: `var(--header-border-width, var(--border-width)) solid var(--header-border-color, var(--color-border))`. Instance-level theming respected; fallback chain preserves prior behaviour.
- Five `currentColor` → `currentcolor` lowercasings in `slashed-core.css` and `slashed-utilities.css` (stylelint `value-keyword-case`).

### Migration

- Glass-effect sticky headers (users who adopted `.cs-header--sticky` in 0.3.8.0 and relied on the default blur): add `.cs-header--glass` alongside `--sticky` to restore the backdrop-filter appearance.

## [0.3.8.1] — 2026-04-24 — Loading-state polish + warning contrast

### Fixed

- `.cs-input-wrap--loading` now sets `pointer-events: none` (was missing; users could keep typing while the spinner ran).
- `.cs-input-wrap--loading > input` now sets `caret-color: transparent` (the blinking caret was visible over the spinner despite `color: transparent`).
- `.cs-message--warning` header contrast raised to AA. `--message-color` changed from `var(--warning)` (~2.8:1 on `--warning-100`) to `var(--warning-600)` (~5.2:1).
- `.cs-tabs` doc example updated to recommend ARIA roles (`role="tablist"`, `role="tab"`, `role="tabpanel"`).
- 0.3.4.0 CHANGELOG entry corrected — the loading class is `.cs-input-wrap--loading` (on the wrapper), not `.cs-input--loading`.

## [0.3.8.0] — 2026-04-24 — `.cs-header` component, dropdown stacking fix

### Added

- `.cs-header` — dedicated masthead block, distinct from `.cs-navbar`. Provides surface + bottom border. Sub-elements: `.cs-header__bar`. Modifiers: `.cs-header--sticky` (pins to top, opt-in), `.cs-header--transparent` (overlay style), `.cs-header--bordered` (explicit hairline). Instance tokens: `--header-bg`, `--header-border-*`, `--header-color`, `--header-bar-padding-*`, `--header-top`, `--header-bg-sticky`, `--header-blur`.

### Fixed

- `--z-dropdown` raised from `1000` to `1150` (above `--z-sticky: 1100`, below banner/overlay). Dropdown menus opened from inside a sticky header now overlay sibling sticky sections correctly.

### Migration

- Adopting `.cs-header`/`--sticky` is opt-in; existing header markup is unaffected.
- The `--z-dropdown` value change (1000 → 1150) only affects pages that layered other elements explicitly between 1000 and 1150.

## [0.3.7.0] — 2026-04-24 — Utility cleanup + experimental layer

### Added

- New file `css/slashed-experimental.css` — opt-in stylesheet for CSS features without stable cross-browser support. Includes its own `@layer` declaration. **Not** bundled into `slashed-full.css`; load alongside the bundle when needed.
- Container-query text-align utilities matching the existing `cq-*:grid-*` family: `.cq-xs:text-{left,center,right}`, `.cq-sm:text-*`, `.cq-md:text-*`, `.cq-lg:text-*`. Viewport-scoped variants (`.sm:text-*`, etc.) were already present.

### Changed

- `.masonry` (guarded by `@supports (grid-template-rows: masonry)`) moved out of `slashed-core.css` and into `slashed-experimental.css`. CSS Grid masonry remains Chrome-flag + Safari-TP as of 2026.

### Migration

- If you previously relied on `.masonry` from the core bundle, load `css/slashed-experimental.css` to restore identical behaviour.

## [0.3.6.0] — 2026-04-24 — Micro-components + toast system

### Added

- **Toast system** — `.cs-toast-stack` (fixed-position container with corner modifiers `--top-start`/`--top-end`/`--bottom-start`/`--bottom-end`) plus `.cs-toast` (two-section grid with `__icon`, `__body`, `__title`, `__close`). Status modifiers `--success`/`--warning`/`--error` via `--toast-color`. Entrance animation respects `prefers-reduced-motion`. Stack uses `pointer-events: none`; individual toasts re-enable.
- `.cs-delete` — universal round × button drawn via two rotated pseudo-elements. Size modifiers `--s`/`--l`.
- `.cs-tags` + `--addons` — wrapper for groups of `.cs-badge`. `--addons` strips gap and inner rounding so adjacent badges join (`build:passing` style).
- `.cs-progress` color modifiers (`--success`/`--warning`/`--error`) and `:indeterminate` support — animates `::-webkit-progress-value` for native `<progress>` without a value attribute; div-pattern fallback uses `.cs-progress--indeterminate > .cs-progress__fill`.
- `.cs-breadcrumb` separator modifiers `--arrow` (→), `--dot` (•), `--slash` (/), `--chevron` (›). Auto-generates separator via `::before` on sibling items; explicit `.cs-breadcrumb__sep` inside a modified scope is hidden so both markup styles work.
- `.cs-icon-text` — guaranteed-centered icon + text wrapper. Alignment modifiers `--top`, `--bottom`.
- `slashedUI.toast(opts)` — programmatically append a toast. Accepts a string (body only) or `{ title, body, variant, duration }`. Auto-creates `.cs-toast-stack` in `document.body` if none exists.

### Migration

- Existing `.cs-breadcrumb` markup with explicit `__sep` elements continues to render unchanged — separator modifiers are opt-in.

## [0.3.5.0] — 2026-04-24 — Layout + structural components

### Added

- `.cs-navbar` + sub-elements (`__brand`, `__toggle`, `__burger`, `__menu`, `__item`, `__end`). Below 48em the burger toggles via `:has(.cs-navbar__toggle:checked)` — zero JS. Modifiers `--fixed-top`, `--fixed-bottom`. `aria-current="page"` highlights the active item.
- `.cs-level` — toolbar layout with `__left`, `__right`, `__item` and a `--mobile-stack` modifier for vertical stacking below 40em.
- Segmented `.cs-card` — adds `__header`, `__image` (flush-to-edge), `__content`, `__footer`, `__footer-item` (equal-width divided cells with hover). A `.cs-card` containing any segmented sub-element auto-strips its own padding via `:has()`.
- Segmented `.cs-modal--card` — pinned head + scrollable body + pinned foot via `__head`/`__body`/`__foot`. Max block size `min(90vh, 50rem)`.
- Advanced table modifiers: `.cs-table--narrow` and cell- or row-level `.is-success`/`.is-warning`/`.is-error`/`.is-primary` (tints rows via `color-mix()` at 12% alpha for legibility, scoped under `.cs-table`).
- `.cs-menu` — sidebar menu with `__label`, `__list`, `__link`, `__link--active`. Tree-style with auto-indent via `--menu-indent`.

## [0.3.4.0] — 2026-04-24 — Form enhancements

### Added

- `.cs-input--s`/`--l` (also accepts `.cs-form-group__input--s/--l`) — input size modifiers parallel to `.cs-btn--s/--l`.
- `.cs-input-wrap` + `--has-icon-left`/`--has-icon-right` — wrap `<input>` with a sibling `<svg class="cs-input-wrap__icon">` to get auto padding so text doesn't run under the icon.
- `.cs-select-wrap--s`/`--l` size modifiers.
- `.cs-checkbox` / `.cs-radio` — applied directly to native `<input type="checkbox">` / `<input type="radio">`. `appearance: none` plus token-driven square/circle, CSS-drawn tick and dot, focus/hover/checked/disabled states, dark-mode handled via surface tokens.
- `.cs-input-group` extended for permutations of inputs + buttons (input-button, button-input-button, etc.). Siblings after the first strip leading rounding and pull back 1px for a visually joined group.
- `.cs-file` (+ `--boxed`) — custom file upload. Hides native `<input type="file">`; `__cta` is the clickable button, `__name` shows the selected filename. `--boxed` produces the dashed drop-zone variant.
- `.cs-form-group--horizontal` — grid-based label-on-inline-start, input-on-inline-end at ≥40em; stacks below. Instance token `--form-label-width`.
- `.cs-btn--loading` / `.cs-input-wrap--loading` — spinner replaces content while the original keeps intrinsic width. `prefers-reduced-motion` slows the spin instead of removing it. Note: input loading lives on the wrapper, not the native `<input>` (replaced element can't render `::after`).

## [0.3.3.0] — 2026-04-24 — Missing core components (tabs, pagination, dropdown, message, footer)

### Added

- `.cs-tabs` — CSS-only tabs via radio inputs + `:has(input:checked)`. Sub-elements `__list`, `__tab`, `__panels`, `__panel`. Modifiers `--vertical`, `--boxed`, `--pill`. Instance tokens `--tabs-gap`, `--tab-padding`. Supports up to 6 panels. Requires `:has()` (Chrome 105+, Firefox 121+, Safari 15.4+).
- `.cs-pagination` — numbered page navigation with `__link`, `__link--current` (also matches `aria-current="page"`), `__prev`, `__next`, `__ellipsis`. Size modifiers `--s`/`--l` via `--pagination-size`.
- `.cs-dropdown` — generic dropdown distinct from `.cs-nav-dropdown`. Uses `<details>`/`<summary>` for zero-JS toggle. Sub-elements `__trigger`, `__menu`, `__item`, `__divider`. Modifiers `--up` (lifts upward), `--end` (aligns to inline-end).
- `.cs-message` — two-section block with tinted header + body. Sub-elements `__header`, `__body`, `__close`. Status modifiers `--success`/`--warning`/`--error`.
- `.cs-footer` — dedicated page-footer block with wider default paddings and `--color-surface-2` background. Sub-element `.cs-footer__bottom` for the canonical copyright + social-links strip.

## [0.3.2] — 2026-04-23 — Bug fixes + component improvements

### Fixed

- `prefers-reduced-motion` token name mismatch — reduced-motion block was setting `--transition-fast/normal/slow` while components use `--duration-fast/normal/slow`. Reduced motion had no effect on any transition. Corrected.
- Accordion chevron now uses a pure-CSS border chevron (two rotated border edges) consistent with the nav-dropdown pattern.
- Legacy fallback completeness — the static `:root` block was missing `--secondary-50`, `--secondary-200`–`950`, `--secondary-a10/a25/a50`, and all `--accent-*` shade/alpha tokens. Added.

### Added

- `.cs-badge--s`/`--l` size variants.
- `.cs-stat--left` and `.cs-stat--inline` layout modifiers.
- `.cs-notice--dismissible` + `.cs-notice__close` — close-button pattern. Wire up JS `element.closest('.cs-notice').remove()` to dismiss.
- `--switch-size` instance token — scales the entire switch from a single value via `calc()`.
- `--btn-font-size` instance token — default `var(--text-m)`, override per button.
- Line-clamp utilities filled to `.line-clamp-1`–`-5`. `.divide-x` complements `.divide-y`. `col-span-5` and `row-span-3`/`row-span-4` fill gaps in their families.

## [0.3.1] — 2026-04-23 — Font scale recalibration + Bricks rem protection

### Fixed

- `font-size: max(16px, 1em)` on `:root` defends against WordPress/Bricks themes that set `html { font-size: 62.5% }`. `:root` (specificity 0,1,0) beats `html` (0,0,1). `max(16px, 1em)` preserves user browser font-size preferences above 16px while preventing rem collapse. (Hardened further to `:root:root` in 0.3.8.3.)

### Changed

- Typography scale recalibrated for the 375→1600px viewport range with raised minimums. `text-m` body now clamps `17px` → `20px` (was `16px` → `18px`); `text-3xl`/`h2` now `40px` → `54px` (was `39px` → `48px`); `text-fluid-hero` max raised from `10rem` to `12rem`. Spacing tokens unchanged. Purely visual change — no migration required.

## [0.3.0] — 2026-04-23 — Dark mode hybrid, shadow tokens, native progress, optional JS, select wrap

### Added

- `--shadow-strength` and `--shadow-strength-2` multiplier tokens. All `--shadow-*` rewritten to use `calc()` against these. Dark mode now overrides only these two tokens instead of redeclaring every shadow.
- `--avatar-stack-overlap` instance token on `.cs-avatar-stack` (default `0.33`).
- `.cs-select-wrap` — wraps `<select>` and replaces the hardcoded-color SVG chevron with a token-driven `mask-image` that follows `--color-text-muted` and flips automatically in dark mode.
- `js/slashed-ui.js` — optional, zero-dependency JS file: (1) `.cs-nav-dropdown` `aria-expanded` sync + Escape + click-outside; (2) `.cs-modal` click-outside close; (3) `.stagger` `--_i` index setter; (4) `input[type="range"]` `--_fill` track fill. Not bundled in `slashed-full.css`.
- `docs/TOKENS.md` — component instance token reference.

### Changed

- **Dark mode hybrid refactor.** `light-dark()` is now restricted to exactly 6 brand color tokens (`--primary`, `--secondary`, `--accent`, `--success`, `--warning`, `--error`). All other tokens that previously used `light-dark()` carry their light-mode value only; dark values live in `@media (prefers-color-scheme: dark)` and `[data-theme="dark"]` blocks. Token names unchanged; computed dark values consistent with what `light-dark()` was producing. Projects overriding via `[data-theme="dark"]` are unaffected.
- `.cs-progress` primary pattern — native `<progress value="65" max="100">` is now the recommended markup. The component CSS adds full styling for `::-webkit-progress-bar`, `::-webkit-progress-value`, and `::-moz-progress-bar`. The div pattern continues to work as a documented fallback.

### Migration

- Replace `<div class="cs-progress" style="--progress: 65%"><div class="cs-progress__fill"></div></div>` with `<progress class="cs-progress" value="65" max="100"></progress>`. The div fallback continues to work unchanged.
- WCAG color contrast note for `--warning` (2.8:1 on white — fails AA for text). For warning text use `--warning-600`; for warning messages pair `--warning-100` background with `--warning-600` text.

## [0.2.0] — 2026-04-20 — Battle-tested component additions; e-commerce & transactional patterns

First minor-version bump. Ships 15 components/extensions plus 3 extensions to existing components, derived from a systematic audit of the blueprint library. Zero breaking changes — additive only.

### Added — components

- `.cs-summary-card` (`__heading`, `__row`, `__total`) — aggregate totals aside for cart/checkout/order. Element-only; compose with `.cs-card` for surface. Instance tokens `--summary-heading-size`, `--summary-total-size`.
- `.cs-brand-tile` (`--s`, `--l`, `--xl`) — colored container for single-letter brand marks, SVG logomarks, integration icons. Instance tokens `--tile-bg`, `--tile-color`, `--tile-radius`, `--tile-size`.
- `.cs-stepper` (`--vertical`, `__step`, `__step--active`, `__step--complete`, `__dot`, `__label`, `__content`) — horizontal progress stepper, vertical timeline with `--vertical`. Connector line auto-colored via sibling selector.
- `.cs-price` (`--s`, `--l`, `--xl`, `__row`, `__original`, `__save`) — main price number with size modifiers, composable with strikethrough original price and save-amount pill. Instance token `--price-color`.
- `.cs-line-item` (`__thumb`, `__info`, `__name`, `__variant`, `__price`) — canonical three-column row for cart/checkout/order/product-detail line items.
- `.cs-radio-card` / `.cs-check-card` (`__input`, `__surface`) — full-card selectable input with hidden native radio/checkbox styled via `:has(input:checked)`. Selected-state tokens `--radio-card-bg-selected`, `--radio-card-border-selected`.
- `.cs-quantity-input` (`__btn`, `__value`, `--s`) — inline ±/value control. Hides native `<input type="number">` spinners.
- `.cs-progress` (`__fill`, `--s`, `--l`) — track/fill progress bar. Set `--progress: Npct` on the root for fill width.
- `.cs-breadcrumb` (`__item`, `__sep`, `__current`) — hierarchical navigation trail. Works on `<ol>` or `<ul>` via `display: contents`.
- `.cs-option-group` (`__option`, `__option--selected`) — row of pill/rectangle mutually-exclusive options. Stateless or form-backed via `:has(input:checked)`.
- `.cs-data-list` (`__row`, `__label`, `__value`) — label/value pairs with underline separators. Instance token `--data-list-label-width`.
- `.cs-swatches` + `.cs-swatch` (`--l`, `--xl`, `--selected`) — color-circle selector row. Each swatch driven by `--swatch-color`.

### Added — extensions to existing components

- `.cs-badge--pill` + `.cs-badge__dot` — pill-shaped status badge with semi-transparent `color-mix()` background and optional leading dot. Combines with `--success`/`--warning`/`--error`/`--neutral`.
- `.cs-divider__text` + `.cs-divider--s` — text-inside styling (uppercase, tracking-widest, weight 600) and smaller-gap variant for the existing `.cs-divider` line-text-line layout.
- `.cs-rating__count` + `.cs-rating--with-count` — stars + review count on the same baseline (`(127 reviews)` trailing the star glyphs).

### Added — documentation

- `docs/COMPONENTS.md` — comprehensive component reference grouped by purpose, with usage snippets, prop tables, instance-token lists, and pairing notes (`cs-line-item` + `cs-summary-card` in e-commerce flows; `cs-option-group` vs `cs-radio-card` decision guide).

### Migration

- Zero action required for existing markup. Additive release. To use new components, add them to your markup — no existing class is modified.
- If you previously implemented any of the 15 patterns locally, consider migrating to the framework classes during your next refactor.

### Known caveats

- `.cs-radio-card`, `.cs-check-card`, and `.cs-option-group` selected-state styling uses `:has()`. Modern evergreen support (Chrome 105+, Firefox 121+, Safari 15.4+); on older browsers state-driven styling degrades to un-selected visual but the form itself continues to work.

## [0.1.2.1] — 2026-04-20 — Utility philosophy formalized; decorative utilities split into opt-in layer

98 decorative utility classes are removed from core and re-shipped in a new opt-in file, `slashed-utilities-visual.css`. Zero breaking changes for the blueprint library (no blueprints used cut classes). External adopters who relied on any cut class can restore identical behaviour by loading the new file.

### Added

- New file `css/slashed-utilities-visual.css` (9 KB, 223 lines) — opt-in decorative utilities layer. Contains the exact 98 classes cut from core, 1:1. Wrapped in `@layer slashed.visual`. Also contains a `@layer slashed.a11y` block with `prefers-reduced-data` overrides for `.bg-gradient` and `.text-gradient`.
- New file `docs/SPEC.md` — framework identity document with the five pillars and file architecture.
- New file `docs/UTILITIES-VISUAL.md` — reference for the opt-in visual layer with installation instructions and the full class catalog.

### Changed

- Removed 98 classes from `css/slashed-utilities.css` across 12 families: border width/style (11), border color (4), border radius (8), background palette (19), background semantic (17), shadow (10), opacity (4), animation (4), transition (6), filter / effects (4), fill / stroke non-currentColor (9), text decorative — `.text-gradient`, `.text-box-trim` (2). All classes preserved 1:1 in `slashed-utilities-visual.css`.
- Cascade-layer declaration updated across all CSS files to include `slashed.visual`. Visual layer ranks after utilities and before a11y. Unlayered BEM still wins over every layer.

### Migration

- Blueprint library users: no action required. Embedded CSS in the blueprint HTML files continues to work unchanged.
- External adopters using any of the 98 cut classes: add one additional stylesheet link `<link rel="stylesheet" href="css/slashed-utilities-visual.css">`. All 98 cut classes exist identically in the visual layer — no renames, no signature changes, only the file changed.

### Known asymmetry

- Prefix variants `.motion-safe:*` and `.motion-reduce:*` stayed in `slashed-utilities.css` even though their base classes (`.animate-fade-in`, `.transition`, etc.) moved to the visual layer. **Resolved in [0.4.2.0]** — the prefix variants relocated to `@layer slashed.a11y` where they conceptually belong.

## [0.1.2.0] — 2026-04-17 — Icon component + nav polish

### Added

- `.cs-icon` — SVG icon sizing wrapper with size variants (`--xs`, `--s`, `--m`, `--l`, `--xl`, `--2xl`) and stroke-width variants (`--thin`, `--regular`, `--bold`). Framework does not bundle an icon library — choose one (Lucide, Tabler, Phosphor, Heroicons, Iconoir) and copy-paste SVGs with the `cs-icon` class.
- `.cs-nav-link` — shared styling for plain nav links alongside `.cs-nav-dropdown__parent`. Uses `a.cs-nav-link` selector (specificity 0,1,1) to reliably override base `a:link`/`a:visited`.

### Changed

- `.cs-nav-dropdown > summary` gap raised from `var(--space-2xs)` to `var(--space-xs)` and explicit `font-weight: inherit` resets the implicit bold that Chrome/Android applies to `<summary>`.
- `.cs-nav-dropdown__parent` color changed from `inherit` to explicit `var(--color-text-muted)` to match `.cs-nav-link` and avoid white text in dark mode via `<body>` inheritance.
- Primary nav parent links follow a tap-twice pattern below 48em: first tap opens the dropdown without navigating; second tap navigates. Desktop unchanged.

### Fixed

- Mobile overlay menu plain links now use `.cs-nav-link` for visual parity with parent links (previously rendered as default-blue underlined `<a>`).

## [0.1.1.0] — 2026-04-17 — Alpha/beta test release

**Versioning change:** Version numbers now use `0.MAJOR.MINOR.PATCH` instead of `MAJOR.MINOR.PATCH`. What was previously called `1.0.0` is now `0.1.0.0`; `1.1.0` is now `0.1.1.0`. No code changes accompany this rename — it signals the framework is still in pre-production. When the API is stable the version will become `1.0.0`.

### Added

- `.cs-feature-list` + `__item` with variants `--arrow`, `--star`, `--bullet`, `--cross` and item-level modifiers `__item--cross`, `__item--muted`.
- `.cs-avatar` + `--xs`, `--s`, `--l`, `--xl`, `--2xl`, `--square`, `--bordered`. Configurable via `--avatar-size`.
- `.cs-avatar-stack` — overlapping-avatars pattern.
- `.cs-quote` + `--s`, `--lead`, `--xl`.
- `.cs-rating` + `--l`, `--xl` — unicode-based star rating.
- `.cs-logo` + `--s`, `--l`, `--xl` — SVG logo styling with `--logo-color`.
- `.cs-form-group__label`/`__input`/`__hint`/`__error` BEM elements (replacing earlier `.cs-form-label` etc.). New `__input` is opinionated with focus ring, `:user-invalid` border, and token-based padding.
- `.cs-stat__value`/`__label` and `.cs-accordion__summary`/`__body` explicit BEM elements (previous implicit `>` selectors retained as fallback).
- New utilities: `.stack--m`, full margin family (`.m-0`–`.m-4xl`, `.my-*`, `.mx-0`), `.md:sticky` with `--sticky-top` token, `.section--m`, `.section--alt`.
- New token `--card-overflow` (default `hidden`, set to `visible` for floating badges).

### Changed

- `.bento` `grid-auto-rows` changed from fixed `var(--bento-row, 14rem)` to `minmax(var(--bento-row, 14rem), auto)`. Eliminates content clipping on featured (`row-span-2`) cards.
- Hover styles removed from `@media (hover: hover)` wrappers across the framework — fixes missing hover on touch-emulated devices and Chrome DevTools device mode. Hover contrast raised; `:active` shares hover styles for touch press feedback.
- **Dark mode token architecture (BREAKING for custom themes).** `[data-theme="dark"]` + `@media (prefers-color-scheme: dark)` blocks are now active and required (`light-dark()` alone does not work for `--color-bg`, `--color-surface`, etc., because the `var(--neutral-900)` values inside flip in dark mode too). Color-shade tokens (`-50`, `-100`, `-200`) for primary/secondary/accent/success/warning/error now use `color-mix(color, N%, var(--color-surface))` in dark mode instead of `color-mix(color, N%, black)` — restores the expected elevation hierarchy (tinted surfaces lighter than body).
- `scrollbar-gutter: stable` added to `html`. Chrome 94+, Firefox 97+, Safari 16+.
- `.cs-card` `overflow: hidden` → `overflow: var(--card-overflow, hidden)`. Default unchanged.
- `.cs-eyebrow` gained `display: inline-block` so it works on `<span>`/`<p>`/`<div>`.
- `.sticky` utility offset changed from `top: 0` to `inset-block-start: var(--sticky-top, 0)` — RTL-safe, configurable per instance.

### Fixed

- Footer variants with dark backgrounds use `data-theme="dark"` to force dark palette independent of the global theme mode.
- `.bento` featured-card content clipping in 2-column layout fixed via `minmax()` auto-rows.
- `TOKENS.md` reorganised into 14 semantic sections (was alphabetical); all `xs→4xl` scales grouped and ordered.

## [0.1.0.0] — 2026-04-16 — First stable release

### Added

- **Design tokens** — complete scale for spacing, typography, colors, radii, shadows, z-index, durations, easings.
- **Light/dark mode** — via `light-dark()` with legacy HEX fallbacks for Safari 16.2–17.4.
- **Cascade layers** architecture — `reset`, `base`, `layout`, `components`, `utilities`, `a11y`, `overrides`.
- **Layout primitives** (unprefixed) — `.section`, `.container`, `.stack`, `.cluster`, `.auto-grid`, `.bento`, `.cover`, `.center`, `.flow`, `.frame`.
- **Grid utilities** — `.grid-cols`, `.grid-1` through `.grid-12`, `.col-span-*`, `.row-span-*`.
- **UI components** (`.cs-*` prefixed): `.cs-btn` (`--primary`, `--outline`, `--ghost`, `--l`), `.cs-card` (`--bordered`, `--interactive`), `.cs-badge` (`--outline`), `.cs-eyebrow`, `.cs-section-header`, `.cs-stat`, `.cs-divider`, `.cs-accordion-group` + `.cs-accordion`, `.cs-form-group`, `.cs-notice`, `.cs-spinner`, `.cs-progress`, switch inputs, icon component.
- **Utility classes** (647 unique) — spacing, typography, color, layout, display, position, sizing.
- **Responsive variants** — sm/md/lg/xl breakpoints with layout + spacing + alignment overrides.
- **Accessibility** — focus rings, `prefers-reduced-motion`, `prefers-reduced-data`, skip links, sr-only helpers.
- **View transitions**, **Print stylesheet**.
- **Documentation** — README, cheatsheet, component/utility references.

### Browser support

- Chrome/Edge 111+, Firefox 113+, Safari 16.4+ (with fallbacks for 16.2–17.4), iOS Safari 16.4+.

---

> Forward-looking work has moved to [`ROADMAP.md`](ROADMAP.md). This file remains an append-only record of what shipped, per [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
