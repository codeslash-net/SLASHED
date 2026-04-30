# Contributing to SLASHED

> Working notes for maintainers and contributors.
> See `docs/SPEC.md` for the framework's architectural principles.

## What this repo is

SLASHED is a buildless CSS framework (BEM + tokens + cascade layers).
Four core CSS source files + one optional visual-utility file + one optional JS file.
Source files are hand-authored; `slashed-full.css` is a generated bundle
(see `bin/build-bundle.sh`) and must never be edited directly.

The name stands for: Standalone, Lean, Agnostic, Structured, Hybrid,
Edgeless, Deterministic. See `docs/SPEC.md` § Identity & Philosophy for
the full explanation of each word. When making any change to the framework,
verify that it is consistent with all seven of these properties — especially
Lean (does this class earn its place?), Edgeless (does this block the
consumer from doing something they need?), and Deterministic (does this
produce a predictable, consistent result?).

Current version: 0.4.5.0 (pre-1.0).

## Layout of the repo

```text
css/                   Framework CSS (hand-authored, no build)
  tokens-default.css     Design tokens on :root
  slashed-core.css     Reset + base + layout + a11y + print
  slashed-components.css   .cs-* components
  slashed-utilities.css    Core utilities (layout, function, typography — no decoration)
  slashed-utilities-visual.css   Opt-in visual utilities (bg, border, radius, shadow, ...)
  slashed-full.css     Bundle of the 4 core files (NOT visual)
js/
  slashed-ui.js        Optional a11y enhancements + CSS platform-gap polyfills
docs/                  SPEC, INSTALLATION, TOKENS, COMPONENTS, UTILITIES, UTILITIES-VISUAL
cheatsheet.html        Interactive quick-reference page
```

## Blueprints library

The wireframe/blueprint library lives in a separate repository
(`slashed-blueprints`). It has its own versioning, CI, and class-discipline
rules.

## Framework gotchas

- **`slashed-full.css` is a deterministic concatenation** of the four
  source files (`tokens-default.css` + `slashed-core.css` +
  `slashed-components.css` + `slashed-utilities.css`). After editing any
  of those four sources, regenerate the bundle:

  ```sh
  bin/build-bundle.sh
  ```

  The script is the only intended way to update the bundle — do not edit
  `slashed-full.css` by hand. CI (`.github/workflows/bundle-check.yml`)
  re-runs the script on every PR and fails if the committed bundle differs
  from what the sources produce, which catches forgotten regenerations
  before they reach `main`.
- **`:root:root { font-size: max(16px, 1em) }` is defensive.** In
  `tokens-default.css` around line 146, this standalone rule exists *specifically*
  to defeat WordPress/Bricks themes that set `font-size: 62.5%` on `html`
  or `:root`. The doubled `:root:root` lifts specificity to (0,2,0). Keep
  the rule **separate** from the main tokens block. Don't "simplify" this.
- **The `slashed.overrides` layer is intentionally empty** and reserved
  for *user* styles that must beat every framework layer. Framework source
  must not author into it.
- **Breakpoints are not tokenizable.** CSS forbids custom properties inside
  `@media` queries, so `sm/md/lg/xl` (30em / 48em / 64em / 80em) are
  hardcoded in `slashed-utilities.css`.
- **`--warning` on white is ~2.8:1 — fails WCAG AA for text.** For warning
  *text*, use `var(--warning-600)`. For warning *messages*, pair
  `--warning-100` background with `--warning-600` text.
- **`prefers-reduced-motion` sets durations to `0.01ms`, not `0`** (core.css:73).
  Intentional — non-zero keeps transitioned properties resolving.
- **`hanging-punctuation: first last` is set globally on `html`** (core.css
  ~line 40), not scoped to `.prose`.
- **`.grid-cols` reads `--cols`, not `--grid-cols`.** Setting `--grid-cols: N`
  does nothing — use `--cols: N`.
- **`.grid-1-2` is 1fr 2fr** (narrow left, wide right). For content + sidebar
  where sidebar is narrow, use `.grid-2-1`.
- **Developer BEM sits unlayered** and wins over every framework layer by
  default. Don't use `!important`.
- **a11y layer beats visual.** `prefers-reduced-motion` overrides live in
  `slashed.a11y`, which ranks above decorative layers.
- **Navigation on WordPress/Bricks: use the native Bricks Nav element,
  not `.cs-nav-dropdown` reconstructed out of Block/Div.**
- **`css/slashed-experimental.css` exists** as a separate opt-in file for
  features without stable cross-browser support.

## Versioning & commits

- Pre-1.0 scheme: `MAJOR.MINOR.PATCH.REVIEW` (e.g. `0.3.8.2`). Only CSS/JS
  framework changes bump the version.
- `CHANGELOG.md` is authoritative and verbose — add an entry for any
  framework-surface change. **Append-only** (Keep-a-Changelog format).
- Forward-looking plans live in `ROADMAP.md`. At every version bump, verify
  `ROADMAP.md` against shipped state and update its **Last reviewed** line.
- Commit messages follow the existing style: short subject, optional longer
  body describing *why*.
- Run `bin/bump-version.sh NEW_VERSION` to update all version strings and
  regenerate the bundle in one step.

## Testing & verification

Visual verification is still manual. Open `cheatsheet.html` in a browser
and skim for regressions after framework CSS changes.

Automated checks that run (locally and in CI on every PR):

- `bin/build-bundle.sh` regenerated and `git diff --exit-code` —
  catches drift between `slashed-full.css` and its four sources.
- `npx stylelint css/*.css` — basic CSS syntax / hygiene.

Run before pushing:

```sh
bin/build-bundle.sh && git diff --exit-code -- css/slashed-full.css
npx --yes -p stylelint@16 -p stylelint-config-standard@36 stylelint "css/*.css"
```

Or via npm:

```sh
npm run verify
```

## When editing

- Prefer **editing existing files** over creating new ones.
- Don't add decorative classes to core utilities — that's what
  `slashed-utilities-visual.css` is for.
- When a pattern appears 3+ times across unrelated use cases,
  consider promoting it to `slashed-components.css` or a layout primitive.
- Keep the `Lean` pillar in mind: every class must earn its place.
