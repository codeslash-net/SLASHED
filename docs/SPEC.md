# SLASHED CSS Framework — Specification

This spec describes the architecture, principles, and patterns of SLASHED. It does not freeze specific counts, metrics, or implementation details — those live in the CSS source files.

---

## 1. Identity & Philosophy

SLASHED is a portable, buildless CSS design system for multi-section visual
websites: landing pages, marketing sites, blogs, portfolios, Shopify
storefronts, WooCommerce stores, and static pages.

The name is an acronym:

| Letter | Word | What it means |
|--------|------|---------------|
| S | Structured | Cascade layers, BEM, and design tokens — every rule has a named, predictable home and nothing collides by accident. |
| L | Lean | Every class earns its place across real use cases; decoration ships in a separate opt-in file rather than bloating the core. |
| A | Agnostic | The same stylesheet runs unchanged in WordPress, Bricks, Astro, plain HTML, or anything else without modification. |
| S | Standalone | Zero build step, zero npm, zero bundler: one `<link>` tag and the framework is fully operational. |
| H | Hybrid | Layout primitives, components, and utilities coexist because real UIs need all three, and the boundary between them is explicit, not blurry. |
| E | Edgeless | The framework never blocks the consumer from doing what they need — there is always a clean path around or through it, by design. |
| D | Deterministic | Given the same token inputs and included files, the same markup produces the same visual result across environments and load order. |

### Seven pillars

**1. Structured.** Cascade layers (`@layer`) enforce specificity order across
eight explicitly ranked layers: `reset → base → layout → components →
utilities → visual → a11y → overrides`. BEM naming is enforced in components.
Token hierarchy is documented. Everything has a place and a reason. No
specificity wars, no hacks, no `!important`.

**2. Lean.** No class exists speculatively. Every framework class was promoted
from a pattern that appeared 3+ times across unrelated use cases and could
not be reasonably composed from existing classes. Decorative utilities live
in an opt-in file (`slashed-utilities-visual.css`) and are never loaded by
default. Target bundle size: 25 KB gzip for the full bundle.

**3. Agnostic.** SLASHED works on WordPress, Bricks Builder, Astro, 11ty,
plain HTML, or any platform that can load a CSS file. It is not locked to
any tool, plugin, host, or ecosystem. Framework integrations (Bricks override
layer, WP plugin) are additive and opt-in — the core works without any of
them.

**4. Standalone.** No build step. No Node.js. No npm. No runtime dependencies.
The consumer downloads CSS files and links them. That is the entire install
process. This is a deliberate architectural decision, not a limitation — it
is what makes SLASHED work anywhere and stay working indefinitely.

**5. Hybrid.** Three authoring layers combine into one coherent system: layout
primitives (`.stack`, `.cover`, `.bento`), BEM components (`.cs-card`,
`.cs-btn--primary`), and utility classes (`.flex`, `.gap-m`, `.text-l`). Every
interactive component ships two paths: a pure-CSS baseline using native HTML
semantics (`<details>`, `<dialog>`, `:has()`, radio inputs), and an optional
WCAG-AAA JavaScript enhancement layer (`js/slashed-ui.js`) that adds
`aria-expanded`, focus management, and keyboard navigation on top.

**6. Edgeless.** The framework has no hard walls. Unlayered BEM always beats
framework `@layer` rules — a consumer can override any framework default with
a plain BEM rule and no `!important`. Instance tokens (`--card-padding`,
`--btn-bg`) allow single-line component modifications without new CSS.
Consumers never fight the framework to get what they need.

**7. Deterministic.** Design tokens drive the entire system. Set `--primary`
and the framework deterministically generates 11 shades, alpha variants,
dark mode values, and contrast-safe text colors via `color-mix()` and
`light-dark()`. Same token input always produces the same output. Rebrand
a site by changing six values. Dark mode is automatic — no separate
stylesheet, no class toggling required.

### What SLASHED is not

- Not a component library. Section starters are copy-paste snippets, not managed components.
- Not for application UI. It targets multi-section visual sites — landing pages, marketing, blogs, storefronts — not dashboards or SaaS interfaces. (Decorative utility ergonomics are available via the opt-in `slashed-utilities-visual.css` if a specific project needs them.)
- Not WordPress-only. WordPress/Bricks is the primary platform, but the framework is portable by design — it works anywhere CSS works.
- Not a JavaScript framework. Interactive behaviors use native HTML elements (`<details>`, `<dialog>`, `[popover]`). Zero JS ships in core CSS files. An optional `js/slashed-ui.js` is available for accessibility enhancements and CSS platform gaps (aria-expanded sync, stagger initializer, range fill, modal click-outside). Load it only if you need these enhancements.

---

## 2. File architecture

```
css/
├── tokens-default.css              Design tokens (colors, spacing, typography, radii, shadows, etc.)
├── slashed-core.css              Reset + base + layout primitives + a11y + print
├── slashed-components.css        Interactive UI components (.cs-* prefixed)
├── slashed-utilities.css         Layout + functional + inline typographic utilities
├── slashed-utilities-visual.css  OPT-IN: decorative utilities (bg, border, radius, shadow, ...)
└── slashed-full.css              Bundle of 4 core files. Does NOT include visual layer.
```

### Load order

**Default (most projects):**
```html
<link rel="stylesheet" href="css/slashed-full.css">
```

**With opt-in visual utilities:**
```html
<link rel="stylesheet" href="css/slashed-full.css">
<link rel="stylesheet" href="css/slashed-utilities-visual.css">
```

**Modular:**
```html
<link rel="stylesheet" href="css/tokens-default.css">
<link rel="stylesheet" href="css/slashed-core.css">
<link rel="stylesheet" href="css/slashed-components.css">
<link rel="stylesheet" href="css/slashed-utilities.css">
<!-- Optional: -->
<link rel="stylesheet" href="css/slashed-utilities-visual.css">
```

### Cascade layer order

All CSS files declare the same `@layer` order upfront:

```css
@layer slashed.reset,
       slashed.base,
       slashed.layout,
       slashed.components,
       slashed.utilities,
       slashed.visual,
       slashed.a11y,
       slashed.overrides;
```

Rules are then wrapped in the appropriate layer with `@layer slashed.X { ... }`. A11y overrides (`prefers-reduced-motion`, `prefers-reduced-data`, `forced-colors`) rank higher than decorative layers so accessibility concerns always win. Developer BEM classes sit unlayered and beat every layer by default.

### Stable vs experimental

`css/slashed-experimental.css` is a separate opt-in file for features without stable cross-browser support. It is **not** bundled into `slashed-full.css`. Load it alongside the bundle when needed:

```html
<link rel="stylesheet" href="css/slashed-full.css">
<link rel="stylesheet" href="css/slashed-experimental.css">
```

Promotion rule: a feature graduates from `slashed-experimental.css` into a core file once it lands in stable releases of all evergreen browsers (Chrome, Firefox, Safari, Edge).

---

## 3. Naming conventions

- **Component classes:** `.cs-*` prefix, BEM structure (`.cs-block__element--modifier`).
- **Layout primitives:** no prefix, semantic names (`.stack`, `.cluster`, `.grid-sidebar`, `.auto-grid`).
- **Utilities:** no prefix, short names (`.flex`, `.gap-m`, `.text-muted`, `.sr-only`).
- **Visual utilities (opt-in):** no prefix (same as utilities), names match the core utility convention (`.bg-primary`, `.rounded-m`, `.shadow-s`).
- **Design tokens:** CSS custom properties, flat namespace (`--primary`, `--space-m`, `--text-l`), no SASS variables.

---

## 4. Evolution policy

- Pre-1.0 (`0.x.x.x`): API may change across minor versions. Patch-level (`0.1.2.1`) changes aim to be additive or non-breaking cleanup, but until 1.0 ships and semver applies, **even a patch bump can carry a breaking change** if the framework's growth requires it (a token rename, a removed modifier, a layer-order tweak). Treat every pre-1.0 bump as potentially breaking, read `CHANGELOG.md`, and pin to the exact version in production — see `docs/INSTALLATION.md`. Minor (`0.2.0`) changes introduce new components or restructure surface.
- Breaking changes during pre-1.0 are acknowledged in `CHANGELOG.md` with migration notes; users are warned that version bumps may require small refactors.
- The blueprint library lives in a separate repository (`slashed-blueprints`). It is content, not API; adding variants there does not bump the framework version.
- Components get promoted to the framework only after appearing 3+ times across unrelated files in the library. Single-use patterns stay in the variant's local BEM.
- Once the framework reaches `1.0.0`, semver applies strictly.

### Path to 1.0

1.0 is the point at which the public surface — token names, component
class names, instance custom-properties, cascade-layer order, and
browser-baseline statement — becomes a stable contract that semver
will protect. The framework is not at 1.0 because some of those
surfaces are still being settled in real-world use.

What needs to be true before 1.0:

- **Token names frozen.** Every `--*` exported by `tokens-default.css`
  (spacing scale, color roles, type scale, radii, shadow strengths,
  motion durations) is locked. No more renames after 1.0; only
  additions, deprecated aliases for at least one minor version, and
  value tweaks.
- **Component surface frozen.** Every `.cs-*` class and every
  `--<component>-<prop>` instance variable becomes a stable contract.
  No silent renames, no removed modifiers. New components may still
  land in minor versions; existing ones are locked.
- **Cascade-layer order frozen.** The eight-layer order
  (`reset → base → layout → components → utilities → visual → a11y → overrides`)
  becomes part of the contract — overrides written against this order
  must keep working.
- **Bundle build deterministic and CI-checked.** Already implemented
  (`bin/build-bundle.sh`, `.github/workflows/bundle-check.yml`).
- **Cheatsheet content audit.** Every entry in `cheatsheet.html` —
  every utility class, component class, modifier, layout primitive,
  and token name — maps to a real selector or `--*` declaration in
  `css/*.css`. Verified by a CI grep script so documentation cannot
  silently drift from sources.
- **Browser baseline pinned in writing.** Today: Chrome 123+,
  Firefox 120+, Safari 17.5+, Edge 123+ (see `README.md`). Pre-1.0
  this can shift; 1.0 sets it explicitly with a deprecation policy
  for moving it forward.
- **Visual-utilities split decision.** Whether
  `slashed-utilities-visual.css` stays as an opt-in companion or
  gets reshaped (e.g. folded into core, or split further). Not yet
  decided.
- **Experimental graduation policy.** Defined in § "Stable vs
  experimental" (a feature graduates from
  `slashed-experimental.css` into core once it lands in stable
  releases of all evergreen browsers). 1.0 locks this policy.
- **Migration guide drafted.** A `docs/MIGRATING-0.3-TO-1.0.md`
  capturing every rename, removal, and behavior change that lands
  on the way to 1.0, so consumers can move in one pass.

Items that are explicitly **not** blockers for 1.0:

- Blueprint library breadth (already broad and growing — content, not
  API; the count drifts with every commit).
- Headless screenshot testing (manual visual review remains the
  contract; if patterns of regression appear, revisit then).
- A package-manager release outside jsDelivr / npm tarball
  (the framework is files; distribution is incidental).
