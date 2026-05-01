# SLASHED + Bricks Builder

Practical notes for using SLASHED inside Bricks Builder.

---

## Synchronising breakpoints

SLASHED's responsive utility classes (`sm:`, `md:`, `lg:`, `xl:`) are
hardcoded in `slashed-utilities.css` because CSS does not allow custom
properties inside `@media` queries. Before starting a project, align
them with your Bricks breakpoints:

1. Open `slashed-utilities.css`.
2. Find-replace each breakpoint value:
   ```text
   sm:  30em  →  find: (min-width: 30em)
   md:  48em  →  find: (min-width: 48em)
   lg:  64em  →  find: (min-width: 64em)
   xl:  80em  →  find: (min-width: 80em)
   ```
3. Run `bin/build-bundle.sh` if you are using `slashed-full.css`.

**Only `slashed-utilities.css` needs updating.** Layout primitives
(`.stack`, `.bento`, `.grid-sidebar`, etc.) use `@container` queries
and are breakpoint-independent — they respond to their own width, not
the viewport.

---

## Use `cq-*` utilities inside Bricks

Inside a Bricks element that is a container, prefer container-query
utilities over viewport-breakpoint utilities:

| Prefer | Instead of |
|--------|-----------|
| `.cq-md:flex-col` | `.md:flex-col` |
| `.cq-lg:gap-l` | `.lg:gap-l` |

Container-query variants fire when the **element's own width** crosses
the threshold, not the viewport width. This makes components portable
across different layout positions (sidebar, main, full-width) without
needing separate breakpoint overrides.

All `sm:` / `md:` / `lg:` / `xl:` utilities have a `cq-*` counterpart
in `slashed-utilities.css`.

---

## Layout primitives are container-aware

`.stack`, `.cluster`, `.bento`, `.grid-sidebar`, `.auto-grid`, `.cover`,
and `.reel` all use `@container` queries internally. They adapt to their
own width regardless of where they sit in the Bricks canvas.

You do **not** need to configure breakpoints for these primitives — they
work correctly out of the box at any nesting level.

---

## Native Bricks Nav vs `.cs-nav-dropdown`

Use the native **Bricks Nav** element for site navigation. Bricks Nav
integrates with the Bricks mobile menu toggle, the sticky header, and
the accessibility tree out of the box.

`.cs-nav-dropdown` is designed for hand-coded HTML outside Bricks. Using
it inside Bricks requires manually wiring the mobile toggle and can
conflict with Bricks's own nav accessibility handling.
