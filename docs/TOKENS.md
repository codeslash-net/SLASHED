# Tokens

SLASHED has three layers of tokens. Lower layers are *primitives* (raw
values); higher layers are *semantic aliases* that point at primitives.
Override the layer that matches the *meaning* of the change you want:

```text
┌─────────────────────────────────────────────────────────────────┐
│ Component instance tokens — per-element overrides               │
│   --btn-bg, --card-padding, --header-blur, --notice-color, …    │
│   Set inline (style="--btn-bg: red") or in BEM rules.           │
├─────────────────────────────────────────────────────────────────┤
│ Semantic alias tokens — system-wide design intent               │
│   --color-text, --color-border, --color-link,                   │
│   --space-section, --space-content, --space-gap,                │
│   --h1 … --h6, --font-heading, --content-width,                 │
│   --focus-ring-color, …                                         │
│   These are the design system. Override to retheme.             │
├─────────────────────────────────────────────────────────────────┤
│ Primitive tokens — raw scales                                   │
│   --primary, --neutral-100…900, --space-2xs…4xl, --text-2xs…9xl,│
│   --container-default, --radius-s…2xl, --shadow-s…float,        │
│   --duration-fast, --ease-out, …                                │
│   Override to redesign the underlying scale.                    │
└─────────────────────────────────────────────────────────────────┘
```

## Semantic alias tokens

### Color — surface and chrome

| Alias | Default | Role |
|---|---|---|
| `--color-bg` | `#f9fafb` (light) / dark equivalent | Page background |
| `--color-surface` | `#ffffff` / dark | Card / panel surface |
| `--color-surface-2` | `var(--neutral-100)` | Subtle alternate surface |
| `--color-surface-elevated` | `#ffffff` / dark | Modal / popover surface |
| `--color-surface-overlay` | `rgba(255,255,255,0.9)` / dark | Translucent overlay surface |
| `--color-border` | `var(--neutral-200)` | Default border |
| `--color-border-subtle` | `var(--neutral-100)` | Quieter border (e.g. dividers) |
| `--color-border-strong` | `var(--neutral-400)` | Emphasised border |
| `--color-backdrop` | `rgba(0,0,0,0.5)` | Modal backdrop |

### Color — text

| Alias | Default | Role |
|---|---|---|
| `--color-text` | `var(--neutral-900)` | Primary body text |
| `--color-text-secondary` | `var(--neutral-700)` | Secondary text |
| `--color-text-muted` | `var(--neutral-600)` | Muted / helper text |
| `--color-text-faint` | `var(--neutral-400)` | Decorative only — fails WCAG AA on bg |
| `--color-text-disabled` | `var(--neutral-400)` | Disabled controls |
| `--color-text-on-primary` | `#ffffff` | Text over `--primary` fills |
| `--color-text-on-secondary` | `#ffffff` | Text over `--secondary` fills |
| `--color-text-on-accent` | `var(--neutral-900)` | Text over `--accent` fills |
| `--color-text-on-dark` | `#f3f4f6` | Text on hand-set dark surfaces |
| `--color-selection` | `var(--primary-a25)` | Native selection background |
| `--color-link` | `var(--primary)` | Default link color |
| `--color-link-visited` | `var(--primary-800)` | Visited link |
| `--color-link-hover` | `var(--primary-700)` | Link hover |

### Spacing — semantic rhythm

| Alias | Default | Role |
|---|---|---|
| `--space-section` | `var(--space-3xl)` | Vertical rhythm between full sections (`.section` padding-block) |
| `--space-content` | `var(--space-l)` | Rhythm between blocks within a section (`.flow`, `.stack`, `.alternate`, `.prose`) |
| `--space-gap` | `var(--space-m)` | Default gap inside layout primitives (`.cluster`, `.grid-*`, `.sidebar-layout`, `.reel`, `.bento`) |
| `--space-gutter` | `clamp(1rem, 0.5rem + 2vw, 2rem)` | Page-edge gutter on `.section` (its own `clamp()`, not an alias) |

These four control the spatial language of the framework. Tighten the
whole system by lowering `--space-gap` once.

### Typography

| Alias | Default | Role |
|---|---|---|
| `--h1` | `var(--text-4xl)` | Heading-1 size — semantic shorthand in BEM |
| `--h2` | `var(--text-3xl)` | Heading-2 size |
| `--h3` | `var(--text-2xl)` | Heading-3 size |
| `--h4` | `var(--text-xl)` | Heading-4 size |
| `--h5` | `var(--text-l)` | Heading-5 size |
| `--h6` | `var(--text-m)` | Heading-6 size |
| `--font-heading` | `var(--font-body)` | Heading font stack — set independently to use a display face |

### Layout / containers

| Alias | Default | Role |
|---|---|---|
| `--content-width` | `var(--container-default)` | Width of the readable content column. `.container` and `.section` content track use this; `.w-content-*` utilities use this. Override to widen / narrow site-wide content. |

### Focus

| Alias | Default | Role |
|---|---|---|
| `--focus-ring-color` | `var(--primary)` | Color of `:focus-visible` outlines |
| `--focus-ring-width` | `2px` | Outline width (a primitive-style token, but conceptually the same hook) |
| `--focus-ring-offset` | `2px` | Outline offset (same) |

---

# Component Instance Tokens

Set these via inline `style` on the component element or in your own
BEM rules to customize without writing new CSS.

## Buttons

| Token | Default | Description |
|---|---|---|
| `--btn-bg` | `var(--primary)` | Button background and border color |
| `--btn-text` | `var(--color-text-on-primary)` | Button text color |
| `--btn-px` | `var(--space-m)` | Horizontal padding |
| `--btn-py` | `var(--space-xs)` | Vertical padding |
| `--btn-radius` | `var(--radius-s)` | Border radius (fallback used in `.cs-btn--ghost`) |

## Cards

| Token | Default | Description |
|---|---|---|
| `--card-bg` | `var(--color-surface)` | Card background |
| `--card-padding` | `var(--space-l)` | Internal padding |
| `--card-radius` | `var(--radius-l)` | Border radius |
| `--card-shadow` | `var(--shadow-s)` | Default shadow |
| `--card-gap` | `var(--space-m)` | Gap between children |
| `--card-media-width` | `10rem` | Width of media in --horizontal variant |
| `--card-hover-shadow` | `var(--shadow-l)` | Shadow on hover (--interactive) |
| `--card-hover-lift` | `-3px` | Translate-Y on hover (--interactive) |

## Brand Tile

| Token | Default | Description |
|---|---|---|
| `--tile-size` | `2.5rem` | Width and height |
| `--tile-bg` | `var(--primary)` | Background color |
| `--tile-color` | `#fff` | Foreground/text color |
| `--tile-radius` | `var(--radius-s)` | Border radius |

## Badges

| Token | Default | Description |
|---|---|---|
| `--badge-bg` | `var(--primary-100)` | Badge background |
| `--badge-text` | `var(--primary)` | Badge text color |

## Notices

| Token | Default | Description |
|---|---|---|
| `--notice-color` | `var(--primary)` | Accent border + tint source |
| `--notice-bg` | `var(--primary-100)` | Background |
| `--notice-border-width` | `3px` | Inline-start border width |

## Progress

| Token | Default | Description |
|---|---|---|
| `--progress-color` | `var(--primary)` | Fill color |
| `--progress-size` | `6px` | Track height |

## Stepper

| Token | Default | Description |
|---|---|---|
| `--stepper-dot-size` | `2rem` | Dot diameter |
| `--stepper-line-width` | `2px` | Connector line thickness |
| `--stepper-line-active` | `var(--primary)` | Connector color when active/complete |
| `--stepper-vertical-gap` | `var(--space-l)` | Gap between steps in --vertical |

## Summary Card

| Token | Default | Description |
|---|---|---|
| `--summary-heading-size` | `var(--text-m)` | Heading font size |
| `--summary-total-size` | `var(--text-xl)` | Total row font size |

## Line Item

| Token | Default | Description |
|---|---|---|
| `--line-item-thumb-size` | `4rem` | Thumbnail width and height |
| `--line-item-padding` | `var(--space-s)` | Row vertical padding |

## Quantity Input

| Token | Default | Description |
|---|---|---|
| `--qty-btn-size` | `2rem` | Button width and height |

## Radio Card / Check Card

| Token | Default | Description |
|---|---|---|
| `--radio-card-padding` | `var(--space-m)` | Surface padding |
| `--radio-card-border-selected` | `var(--primary)` | Border color when checked |
| `--radio-card-bg-selected` | `var(--primary-50)` | Background when checked |

## Option Group

| Token | Default | Description |
|---|---|---|
| `--option-radius` | `var(--radius-m)` | Option pill border radius |

## Swatches

| Token | Default | Description |
|---|---|---|
| `--swatch-size` | `1.25rem` | Swatch diameter |
| `--swatch-color` | `var(--primary)` | Swatch color (set per instance) |

## Price

| Token | Default | Description |
|---|---|---|
| `--price-size` | `var(--text-l)` | Price font size |
| `--price-color` | `var(--color-text)` | Price color |

## Rating

| Token | Default | Description |
|---|---|---|
| `--rating-color` | `var(--warning)` | Star color |
| `--rating-size` | `1rem` | Star font size |

## Avatar

| Token | Default | Description |
|---|---|---|
| `--avatar-size` | `3rem` | Avatar width and height |
| `--avatar-stack-overlap` | `0.33` | Overlap ratio in .cs-avatar-stack |
| `--avatar-stack-bg` | `var(--color-bg)` | Ring color between stacked avatars |

## Stat

| Token | Default | Description |
|---|---|---|
| `--stat-size` | `var(--text-3xl)` | Value font size |
| `--stat-color` | `var(--primary)` | Value color |

## Quote

| Token | Default | Description |
|---|---|---|
| `--quote-size` | `var(--text-l)` | Quote font size |
| `--quote-color` | `var(--color-text)` | Quote text color |

## Icon

| Token | Default | Description |
|---|---|---|
| `--icon-size` | `1.5em` | SVG width and height |
| `--icon-color` | `currentColor` | SVG color |

## Logo

| Token | Default | Description |
|---|---|---|
| `--logo-size` | `2rem` | SVG height |
| `--logo-color` | `var(--color-text-muted)` | SVG fill/stroke color |

## Nav Dropdown

| Token | Default | Description |
|---|---|---|
| `--nav-gap` | `var(--space-m)` | Gap between nav items |

## Divider

| Token | Default | Description |
|---|---|---|
| (none — uses gap from .cs-divider base, configurable via --space-gap) | | |

## Spinner

| Token | Default | Description |
|---|---|---|
| `--spinner-color` | `var(--primary)` | Spinner arc color |
| `--spinner-size` | `1.5rem` | Spinner width and height |