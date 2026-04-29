# Deprecation policy

The framework moves through three phases when a public-surface name
changes between minor versions: **Announce → Alias → Remove**. The
mechanism is intentionally low-overhead — no runtime warnings, no new
cascade layer — to fit the buildless, no-runtime-cost philosophy.

## What's in scope

A change is a *deprecation* (subject to this policy) when it renames or
removes anything on the public surface:

- **Design tokens** — any `--*` exported by `tokens-default.css`
  (e.g. `--space-m`, `--primary`, `--text-l`).
- **Component classes** — any `.cs-*` block, element, or modifier
  (e.g. `.cs-card`, `.cs-card__body`, `.cs-card--ghost`).
- **Layout primitive classes** — `.stack`, `.cluster`, `.grid-*`,
  `.auto-grid`, `.frame`, `.bento`, `.flow`, `.switcher`,
  `.sidebar-layout`, `.subgrid`.
- **Utility classes** — anything in `slashed-utilities.css` or
  `slashed-utilities-visual.css`.
- **Instance custom properties** — `--<component>-<prop>` API
  consumed via inline `style` (e.g. `--card-padding`, `--cols`).
- **Cascade-layer order** — the eight-layer order documented in
  `SPEC.md` § "File architecture".

Out of scope (treated as ordinary non-breaking changes):

- Token *value* tweaks that don't change the name (e.g. adjusting
  `--space-m` from `1rem` to `0.95rem`).
- Visual property tweaks inside components (border color, shadow
  strength) when no class or token name changes.
- New classes / tokens / utilities — additions are always non-breaking.
- Bug fixes that align behavior with documented intent.

## Phases

### 1. Announce

When a deprecation lands:

- A `### Deprecated` subsection in the next `CHANGELOG.md` entry lists
  the affected symbol, its replacement, and the removal version.
- The deprecation ships **together with** the replacement — never
  announced standalone with no migration path.
- No `console.warn`, no runtime side effects. The optional JS
  (`js/slashed-ui.js`) does not emit deprecation warnings; the
  framework has no required JS, so a runtime channel would only reach
  some users.

### 2. Alias

The deprecated symbol keeps working for at least **one full minor
version** after the announce. During this window:

- For tokens, the alias is a single declaration on `:root` in
  `tokens-default.css` mapping the old name to the new one
  (`--old: var(--new);`).
- For classes, the alias is a selector chain on the new rule that also
  matches the old name (e.g. `.cs-card, .cs-old-card { ... }`) — or a
  single rule mapping old to new where the structures permit it.
- The alias rule lives in the same source file as its replacement, with
  an inline comment in the form
  `/* Deprecated since vX.Y.Z.W, removed in vA.B.C.D — use <new-name>. */`.
  No new cascade layer is introduced; aliases sit alongside the
  canonical rule.

The minimum window is one minor. If a rename is high-impact (touches
many wireframes, common token), the window can extend across multiple
minors at the maintainer's discretion. The window is recorded in the
deprecation comment.

### 3. Remove

In the minor release that ends the alias window:

- The alias rule and its comment are deleted.
- The release's `CHANGELOG.md` entry includes a `### Removed`
  subsection citing the announce version and confirming the alias
  period elapsed.
- A line is added to (or referenced in) `docs/MIGRATING-0.3-TO-1.0.md`
  if the migration guide already exists; otherwise the CHANGELOG
  remains the canonical migration record.

## Pre-1.0 caveat

This policy is the **target contract**. Pre-1.0 (current state), the
project tries to follow it but reserves the right to make breaking
changes outside this process when a name turns out to be wrong before
it sees significant adoption — that's the whole point of pre-1.0.
Each such break is recorded in `CHANGELOG.md` under `### Breaking`
with a manual migration note.

After 1.0, this policy becomes binding: every public-surface rename or
removal goes through Announce → Alias → Remove with no exceptions, and
the alias window starts at one full minor version.

See `SPEC.md` § "Path to 1.0" for the broader stability roadmap.
