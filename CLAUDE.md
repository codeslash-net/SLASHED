# CLAUDE.md

Current version: **0.4.7.0** (pre-1.0).

See **`CONTRIBUTING.md`** for repo layout, full gotchas list, versioning
policy, and testing procedures. See **`ROADMAP.md`** for pending work.

---

## Framework philosophy — evaluate every change against these

SLASHED = **S**tandalone · **L**ean · **A**gnostic · **S**tructured · **H**ybrid · **E**dgeless · **D**eterministic.

**Standalone** — No build step, no Node, no npm, no runtime dependencies.
The consumer links a CSS file. Full stop. Any change that introduces a
preprocessor, build tool, or runtime dependency on the consumer side is
permanently out of scope — not "not yet", permanently.

**Lean** — Every class earns its place. A pattern must appear 3+ times
across unrelated blueprint categories before becoming a framework class.
Target bundle size: 25 KB gzip. When evaluating an addition: does it earn
its bytes? Decorative utilities belong in `slashed-utilities-visual.css`,
not core.

**Agnostic** — Works on any platform that can load a CSS file. Framework
integrations (Bricks, WordPress) are additive and opt-in, never a
dependency. A change that ties core CSS to a specific platform violates
this principle.

**Structured** — Cascade layers enforce specificity order. BEM naming is
consistent across all components. Token hierarchy is explicit. Nothing is
ad hoc. New components follow the same layer, naming, and token conventions
as existing ones.

**Hybrid** — Three authoring layers (layout primitives + BEM components +
utility classes) with two interactivity paths (pure-CSS baseline + optional
WCAG-AAA JS). Every interactive component must ship a meaningful pure-CSS
path first. JS is always optional. HTML-first: reach for `<details>`,
`<dialog>`, `:has()`, and native form elements before writing JavaScript.

**Edgeless** — The framework never blocks the consumer. Unlayered BEM
always beats framework layers — no `!important` needed. Instance tokens
allow single-line component modifications. If a consumer needs
`!important` to override something, that is a framework bug.

**Deterministic** — Tokens drive the system. A given token input always
produces the same output. New tokens must follow existing derivation
patterns (`color-mix()`, `light-dark()`, `clamp()`). Magic numbers in
framework CSS are bugs — every value a consumer might want to change must
be a custom property.

---

## Mandatory actions — do these every time

**On every change:**
- Verify the change is consistent with all seven SLASHED pillars:
  Standalone, Lean, Agnostic, Structured, Hybrid, Edgeless, Deterministic.

**After editing any CSS source file**
(`tokens-default.css`, `slashed-core.css`, `slashed-components.css`,
`slashed-utilities.css`):
- Run `bin/build-bundle.sh` to regenerate `slashed-full.css`.
- Never edit `slashed-full.css` directly — it is a generated artifact.

**For every framework-surface change** (new/renamed/removed class, token,
or JS API):
- Add an entry to `CHANGELOG.md` (append-only, Keep-a-Changelog format).
- Breaking changes go under `### Breaking` with a one-line rename map.
  No migration guide required before `0.8.0.0`.

**When implementing any item tracked in `ROADMAP.md`:**
- In the same commit: move it out of the "Pending work" section and add a
  one-liner to the "Explicitly NOT on the roadmap" section that says what
  shipped and in which version. Do not leave a completed item in
  "Pending work" — a stale roadmap is worse than no roadmap.

---

## Critical gotchas

- **`slashed.overrides` is intentionally empty.** Framework source must
  never author rules into it. It exists so consumers can beat every
  framework layer without `!important`. If you find yourself writing
  into `slashed.overrides`, you are in the wrong layer.

- **`slashed-full.css` is generated.** `bin/build-bundle.sh` concatenates
  the four source files in order. CI fails the PR if the committed bundle
  differs from what the sources produce. Never edit the bundle by hand.

- **`.grid-cols` reads `--cols`, not `--grid-cols`.** Setting
  `--grid-cols: N` does nothing.

- **Breakpoints are hardcoded in `slashed-utilities.css` only.** CSS
  forbids custom properties inside `@media`. The four values
  (`sm: 30em / md: 48em / lg: 64em / xl: 80em`) live in that file and
  nowhere else. Layout primitives in `slashed-core.css` use `@container`
  and are unaffected by breakpoint changes.

- **Pre-`0.8.0.0`: no migration overhead.** Anything on the public surface
  can be renamed, removed, or restructured in a single commit — no
  deprecation alias, no migration guide, no advance notice required. The
  full deprecation process in `docs/DEPRECATION-POLICY.md` activates at
  `0.8.0.0`.

- **`--warning` on white fails WCAG AA (~2.8:1).** Use `--warning-600`
  for warning text. Pair `--warning-100` background with `--warning-600`
  text for warning messages.

- **`:root:root { font-size: max(16px, 1em) }` is defensive** — defeats
  WordPress/Bricks themes that set `62.5%` on `:root`. The doubled
  selector lifts specificity to (0,2,0). Keep it separate from the main
  token block. Do not "simplify" it.
