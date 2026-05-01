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
- The CHANGELOG entry is the canonical migration record. A line is
  added to `docs/MIGRATING-0.3-TO-1.0.md` once that document exists;
  it will be written at `0.8.0.0` — see the pre-0.8.0.0 note below.

## Pre-0.8.0.0: policy suspended

Before `0.8.0.0` this policy **does not apply**. Anything on the public
surface — tokens, classes, utilities, instance properties, layer order —
can be renamed, removed, or restructured in a single commit with no
deprecation alias, no migration guide, and no advance notice. The only
obligation is a `### Breaking` subsection in `CHANGELOG.md` with a
one-line rename/removal map.

The policy activates at `0.8.0.0` as a pre-condition for the 1.0 API
freeze. From that point the Announce → Alias → Remove process is binding
with no exceptions, and the alias window is at least one full minor
version.

See `SPEC.md` § "Path to 1.0" and `ROADMAP.md` § Versioning for the
broader stability roadmap.
