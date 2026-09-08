---
title: 'Eagami UI: React Integration'
version: 5.39.0
source: '@eagami/ui@5.39.0 (https://github.com/mwiraszka/eagami)'
last-synced: 2026-09-08
audience: human developers and AI coding agents
purpose: >
  Single-file specification for applying the Eagami UI design tokens and
  component conventions to a React/TypeScript codebase without depending on
  the upstream Angular library. Copy this file into the consuming project's
  docs/ directory. When building or modifying UI in that project, follow
  every rule below and use only the tokens listed here.
---

# Eagami UI: React Integration

This document is the complete, self-contained specification for porting Eagami UI to a React project. It contains:

1. Mandatory design rules
2. Full token set (values)
3. Ready-to-paste setup (CSS custom properties + TypeScript constants)
4. Usage patterns (do / don't)
5. Component API conventions
6. Internationalization (i18n) parity
7. Accessibility requirements
8. Sync checklist

**For AI agents:** When building or modifying UI in this project, follow every rule in section 1 and use only the tokens in section 2 (accessed via the CSS file in section 3.1 or the TypeScript module in section 3.2). Do not introduce arbitrary color, spacing, or typography values. If a required token is missing, request an upstream addition rather than hard-coding. The `RULE:` markers below identify invariants that must always hold.

---

## Table of contents

1. [Design rules](#1-design-rules)
2. [Tokens](#2-tokens)
3. [Setup](#3-setup)
4. [Usage patterns](#4-usage-patterns)
5. [Component API conventions](#5-component-api-conventions)
6. [Internationalization](#6-internationalization)
7. [Accessibility requirements](#7-accessibility-requirements)
8. [Sync checklist](#8-sync-checklist)

---

## 1. Design rules

### 1.1 Spacing scale

**RULE:** All padding, margin, and gap values must be drawn from this scale:

`1, 2, 4, 8, 12, 16, 24, 32, 48, 64` (pixels)

Arbitrary values (5, 10, 20, 100, etc.) are forbidden. Prefer the CSS custom properties (`var(--space-1)`, `var(--stack-md)`) or the TypeScript constants (`spacing.s4`, `spacing.stack.md`) over numeric literals.

### 1.2 Colors

**RULE:** Never hard-code color literals (hex, `rgb()`, `rgba()`, `hsl()`, named colors) in component styles. All colors come from CSS custom properties.

- Use **semantic tokens** (`var(--color-text-primary)`, `var(--color-bg-base)`, `var(--color-border-default)`), not primitives (`var(--color-neutral-900)`).
- Tokens adapt automatically via the `prefers-color-scheme` media query. The library also honors an explicit `<html data-theme="light">` or `<html data-theme="dark">` override (see section 3.4).
- Never call `rgba()` on raw palette colors. Use the provided subtle/muted tokens for translucent fills.
- If a required semantic token is missing, add it upstream rather than falling back to primitives.

### 1.3 Focus indicators

**RULE:** Every focusable element must render a visible keyboard focus indicator.

- Use `box-shadow: var(--shadow-focus-ring);` on `:focus-visible`.
- Never set `outline: none` without replacing the indicator.
- Custom interactive components must handle focus state explicitly.

### 1.4 Motion and reduced motion

**RULE:** Use the provided motion tokens for all transitions and animations. The motion tokens automatically respect `prefers-reduced-motion`.

- Durations: `var(--duration-fast)`, `var(--duration-normal)`, `var(--duration-slow)`, `var(--duration-slower)`
- Easings: `var(--ease-in)`, `var(--ease-out)`, `var(--ease-in-out)`, `var(--ease-spring)`
- Composite transitions: `var(--transition-colors)`, `var(--transition-shadow)`, `var(--transition-transform)`, `var(--transition-opacity)`

Never use literal `200ms` / `ease-in-out` in CSS.

### 1.5 Typography

**RULE:** Use the composite text-style tokens (`--text-body-md-*`, `--text-h1-*`) rather than ad-hoc combinations of `font-size` + `font-weight`.

Do not compose styles from raw `--font-size-*` / `--font-weight-*` tokens unless creating a new composite. If a role is missing, add a composite token upstream.

### 1.6 Interactive element sizing

**RULE:** All tappable targets must be at least 44x44 pixels. Use the component size tokens (`sm` / `md` / `lg`), which are calibrated to meet this (except `sm`, which is reserved for non-tappable or secondary contexts).

### 1.7 Component API shape

**RULE:** React components that mirror Eagami components must preserve these prop shapes so behavior is predictable across Angular and React:

| Prop                 | Type                              | Notes                                                                                  |
| -------------------- | --------------------------------- | -------------------------------------------------------------------------------------- |
| `variant`            | union literal                     | Matches the Angular variant (e.g. `'primary' \| 'secondary' \| 'ghost' \| 'danger'`).  |
| `size`               | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | Default `'md'`. Panel components (Dialog, Drawer) add `'full'`.                    |
| `disabled`           | `boolean`                         | Default `false`.                                                                       |
| `readOnly`           | `boolean`                         | Where applicable (form controls).                                                      |
| `required`           | `boolean`                         | Where applicable (form controls).                                                      |
| `loading`            | `boolean`                         | Where applicable.                                                                      |
| `fullWidth`          | `boolean`                         | Where applicable.                                                                      |
| `hint` / `errorMsg`  | `string`                          | Form-field helper and error text. `errorMsg` drives the error visual state.            |
| `value` / `onChange` | controlled pattern                | Pair `value: T` with `onChange: (value: T) => void`.                                   |
| event outputs        | past-tense names                  | Mirror Angular: `clicked`, `changed`, `selected`, `dismissed`, `removed`, `sorted`.    |

See section 5 for per-component specifics.

---

## 2. Tokens

<!-- eagami:generated:react-tokens start -->

All values below mirror the CSS custom properties in `packages/ui/src/styles/tokens/*.scss` in the upstream Angular library. This whole section is generated by `scripts/sync-integration-guides.mjs`; never edit it by hand, regenerate it with `pnpm ui sync-guides` when upstream tokens change (see section 8). Values in any older copy of this document are superseded by this version; do not trust cached palettes.

### 2.1 Colors, primitive palette

Use these only if a semantic token is not available. Adding a new semantic is almost always the right move.

#### Primary (brand)

The primary ramp is a single hue (H=205, S=50) varying only by lightness.

| Token                 | Hex       |
| --------------------- | --------- |
| `--color-primary-50`  | `#ECF3F9` |
| `--color-primary-100` | `#D1E3F0` |
| `--color-primary-200` | `#ABCBE3` |
| `--color-primary-300` | `#7DAFD4` |
| `--color-primary-400` | `#4B91C3` |
| `--color-primary-500` | `#3674A1` |
| `--color-primary-600` | `#2A5B7E` |
| `--color-primary-700` | `#204560` |
| `--color-primary-800` | `#162F41` |
| `--color-primary-900` | `#0D1C26` |

#### Secondary

The secondary ramp is a single hue (H=222, S=25) varying only by lightness.

| Token                   | Hex       |
| ----------------------- | --------- |
| `--color-secondary-50`  | `#F3F5FA` |
| `--color-secondary-100` | `#DCE1EC` |
| `--color-secondary-200` | `#BBC4D8` |
| `--color-secondary-300` | `#93A1BF` |
| `--color-secondary-400` | `#687AA5` |
| `--color-secondary-500` | `#506086` |
| `--color-secondary-600` | `#404C6A` |
| `--color-secondary-700` | `#313B51` |
| `--color-secondary-800` | `#232938` |
| `--color-secondary-900` | `#151922` |

#### Neutral

| Token                 | Hex       |
| --------------------- | --------- |
| `--color-neutral-0`   | `#FFFFFF` |
| `--color-neutral-50`  | `#F9FAFB` |
| `--color-neutral-100` | `#F3F4F6` |
| `--color-neutral-200` | `#E5E7EB` |
| `--color-neutral-300` | `#D1D5DB` |
| `--color-neutral-400` | `#9CA3AF` |
| `--color-neutral-500` | `#6B7280` |
| `--color-neutral-600` | `#4B5563` |
| `--color-neutral-700` | `#374151` |
| `--color-neutral-800` | `#1F2937` |
| `--color-neutral-900` | `#111827` |
| `--color-neutral-950` | `#030712` |

#### Feedback

| Token                 | Hex       |     | Token                 | Hex       |
| --------------------- | --------- | --- | --------------------- | --------- |
| `--color-success-50`  | `#F0FDF4` |     | `--color-warning-50`  | `#FFFBEB` |
| `--color-success-100` | `#DCFCE7` |     | `--color-warning-100` | `#FEF3C7` |
| `--color-success-200` | `#BBF7D0` |     | `--color-warning-200` | `#FDE68A` |
| `--color-success-500` | `#22C55E` |     | `--color-warning-500` | `#F59E0B` |
| `--color-success-600` | `#16A34A` |     | `--color-warning-600` | `#D97706` |
| `--color-success-700` | `#15803D` |     | `--color-warning-700` | `#B45309` |
| `--color-error-50`    | `#FEF2F2` |     | `--color-info-50`     | `#ECFEFF` |
| `--color-error-100`   | `#FEE2E2` |     | `--color-info-100`    | `#CFFAFE` |
| `--color-error-200`   | `#FECACA` |     | `--color-info-200`    | `#A5F3FC` |
| `--color-error-500`   | `#EF4444` |     | `--color-info-500`    | `#06B6D4` |
| `--color-error-600`   | `#DC2626` |     | `--color-info-600`    | `#0891B2` |
| `--color-error-700`   | `#B91C1C` |     | `--color-info-700`    | `#0E7490` |

#### Color-picker intrinsics

Pure RGB primaries for the color picker's hue wheel and saturation/value gradient. Intrinsic to the picker, not themeable, and identical in light and dark mode. Only the picker consumes them.

| Token                        | Value                 |
| ---------------------------- | --------------------- |
| `--color-picker-hue-red`     | `#FF0000`             |
| `--color-picker-hue-yellow`  | `#FFFF00`             |
| `--color-picker-hue-green`   | `#00FF00`             |
| `--color-picker-hue-cyan`    | `#00FFFF`             |
| `--color-picker-hue-blue`    | `#0000FF`             |
| `--color-picker-hue-magenta` | `#FF00FF`             |
| `--color-picker-sv-white`    | `#FFFFFF`             |
| `--color-picker-sv-black`    | `#000000`             |
| `--color-picker-thumb-halo`  | `rgba(0, 0, 0, 0.25)` |

### 2.2 Colors, semantic (light / dark)

In light mode (default) and dark mode (`@media (prefers-color-scheme: dark)`, or `<html data-theme="dark">`):

| Semantic token                    | Light ref                                                              | Dark ref                                                                 |
| --------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `--color-text-primary`            | `--color-neutral-900`                                                  | `--color-neutral-50`                                                     |
| `--color-text-secondary`          | `--color-neutral-600`                                                  | `--color-neutral-300`                                                    |
| `--color-text-tertiary`           | `--color-neutral-400`                                                  | `--color-neutral-500`                                                    |
| `--color-text-disabled`           | `--color-neutral-400`                                                  | `--color-neutral-500`                                                    |
| `--color-text-inverse`            | `--color-neutral-0`                                                    | `--color-neutral-900`                                                    |
| `--color-text-link`               | `--color-primary-600`                                                  | `--color-primary-300`                                                    |
| `--color-text-link-hover`         | `--color-primary-800`                                                  | `--color-primary-100`                                                    |
| `--color-bg-canvas`               | `--color-neutral-0`                                                    | `--color-neutral-950`                                                    |
| `--color-bg-base`                 | `--color-neutral-0`                                                    | `--color-neutral-800`                                                    |
| `--color-bg-subtle`               | `--color-neutral-50`                                                   | `--color-neutral-700`                                                    |
| `--color-bg-stripe`               | `--color-neutral-50`                                                   | `--color-neutral-900`                                                    |
| `--color-bg-stripe-subtle`        | `color-mix(in srgb, var(--color-bg-base) 30%, var(--color-bg-stripe))` | `color-mix(in srgb, var(--color-bg-base) 62.5%, var(--color-bg-stripe))` |
| `--color-bg-muted`                | `--color-neutral-100`                                                  | `--color-neutral-700`                                                    |
| `--color-bg-emphasis`             | `--color-neutral-100`                                                  | `--color-neutral-600`                                                    |
| `--color-bg-elevated`             | `--color-neutral-0`                                                    | `--color-neutral-700`                                                    |
| `--color-bg-overlay`              | `rgba(0, 0, 0, 0.5)`                                                   | `rgba(0, 0, 0, 0.5)`                                                     |
| `--color-tooltip-surface`         | `#1A1B21`                                                              | `#1A1B21`                                                                |
| `--color-tooltip-border`          | `rgba(255, 255, 255, 0.15)`                                            | `rgba(255, 255, 255, 0.15)`                                              |
| `--color-state-hover`             | `--color-neutral-100`                                                  | `rgba(255, 255, 255, 0.08)`                                              |
| `--color-state-active`            | `--color-neutral-200`                                                  | `rgba(255, 255, 255, 0.14)`                                              |
| `--color-border-subtle`           | `--color-neutral-200`                                                  | `color-mix(in srgb, var(--color-neutral-700), var(--color-neutral-800))` |
| `--color-border-default`          | `--color-neutral-200`                                                  | `--color-neutral-400`                                                    |
| `--color-border-strong`           | `--color-neutral-400`                                                  | `--color-neutral-300`                                                    |
| `--color-divider`                 | `rgba(0, 0, 0, 0.1)`                                                   | `rgba(255, 255, 255, 0.12)`                                              |
| `--color-border-focus`            | `--color-primary-500`                                                  | `--color-primary-500`                                                    |
| `--color-brand-default`           | `--color-primary-600`                                                  | `--color-primary-500`                                                    |
| `--color-brand-hover`             | `--color-primary-700`                                                  | `--color-primary-600`                                                    |
| `--color-brand-active`            | `--color-primary-800`                                                  | `--color-primary-700`                                                    |
| `--color-brand-text`              | `--color-primary-700`                                                  | `--color-primary-300`                                                    |
| `--color-brand-subtle`            | `--color-primary-50`                                                   | `rgba(75, 145, 195, 0.1)`                                                |
| `--color-brand-muted`             | `--color-primary-100`                                                  | `rgba(75, 145, 195, 0.2)`                                                |
| `--color-brand-secondary-default` | `--color-secondary-500`                                                | `--color-secondary-500`                                                  |
| `--color-brand-secondary-hover`   | `--color-secondary-600`                                                | `--color-secondary-600`                                                  |
| `--color-brand-secondary-active`  | `--color-secondary-700`                                                | `--color-secondary-700`                                                  |
| `--color-brand-secondary-text`    | `--color-secondary-700`                                                | `--color-secondary-200`                                                  |
| `--color-brand-secondary-subtle`  | `--color-secondary-50`                                                 | `rgba(104, 122, 165, 0.1)`                                               |
| `--color-brand-secondary-muted`   | `--color-secondary-100`                                                | `rgba(104, 122, 165, 0.2)`                                               |
| `--color-success-default`         | `--color-success-600`                                                  | `--color-success-600`                                                    |
| `--color-success-subtle`          | `--color-success-50`                                                   | `rgba(34, 197, 94, 0.15)`                                                |
| `--color-success-muted`           | `--color-success-100`                                                  | `rgba(34, 197, 94, 0.25)`                                                |
| `--color-success-text`            | `--color-success-700`                                                  | `--color-success-200`                                                    |
| `--color-warning-default`         | `--color-warning-600`                                                  | `--color-warning-600`                                                    |
| `--color-warning-subtle`          | `--color-warning-50`                                                   | `rgba(245, 158, 11, 0.15)`                                               |
| `--color-warning-muted`           | `--color-warning-100`                                                  | `rgba(245, 158, 11, 0.25)`                                               |
| `--color-warning-text`            | `--color-warning-700`                                                  | `--color-warning-200`                                                    |
| `--color-error-default`           | `--color-error-600`                                                    | `--color-error-600`                                                      |
| `--color-error-subtle`            | `--color-error-50`                                                     | `rgba(239, 68, 68, 0.15)`                                                |
| `--color-error-muted`             | `--color-error-100`                                                    | `rgba(239, 68, 68, 0.25)`                                                |
| `--color-error-text`              | `--color-error-700`                                                    | `--color-error-200`                                                      |
| `--color-info-default`            | `--color-info-600`                                                     | `--color-info-600`                                                       |
| `--color-info-subtle`             | `--color-info-50`                                                      | `rgba(6, 182, 212, 0.15)`                                                |
| `--color-info-muted`              | `--color-info-100`                                                     | `rgba(6, 182, 212, 0.25)`                                                |
| `--color-info-text`               | `--color-info-700`                                                     | `--color-info-200`                                                       |

In dark mode the surface model splits the page (`bg-canvas`, deepest) from the surfaces that sit on it (`bg-base`, `bg-subtle`, `bg-elevated`, `bg-muted`). Canvas stays at the deepest neutral while every component surface lifts above it so inputs, cards, accordion items, and popover panels read above the page instead of disappearing into it. `bg-stripe` is the alternating-row tone for tables; it sits *below* `bg-base` to keep odd rows darker than the surrounding card, and `bg-stripe-subtle` mixes it toward `bg-base` for a quieter zebra fill. `bg-muted` is the opaque static fill for disabled fields, tracks, and skeletons; `bg-emphasis` is the soft placeholder fill (e.g. avatar initials).

Hover and active/selected fills route through `--color-state-hover` / `--color-state-active`, not through `bg-*`. Light mode uses solid neutral tones; dark mode swaps to translucent white washes so a lift still reads on any dark surface, including the tier where several `bg-*` roles coincide.

`--color-brand-text` is the brand colour used as a **foreground** on a non-brand surface (selected dropdown row, today marker, sorted column header, spinner, active paginator page). It needs a 4.5:1 contrast against `--color-bg-base`, so it flips to a lighter shade in dark mode. `--color-brand-default` stays free to be optimized as a surface (button background, badge background) without dragging the text-on-surface contrast along with it. The status `*-text` tokens mirror this split: each is the status hue as a foreground on its own `*-subtle` / `*-muted` wash (badge, tag, toast), flipping from a dark shade in light mode to a light pastel in dark mode to keep 4.5:1 on the translucent dark washes.

### 2.3 Spacing, base scale

| Token        | Value (px) |
| ------------ | ---------- |
| `--space-0`  | 0          |
| `--space-1`  | 4          |
| `--space-2`  | 8          |
| `--space-3`  | 12         |
| `--space-4`  | 16         |
| `--space-6`  | 24         |
| `--space-8`  | 32         |
| `--space-12` | 48         |
| `--space-16` | 64         |

Only these values are permitted (see section 1.1). The upstream SCSS defines additional values (`--space-px`, `--space-0-5`, `--space-1-5`, `--space-2-5`, `--space-3-5`, `--space-5`, `--space-7`, `--space-9`, `--space-10`, `--space-11`, `--space-14`, `--space-20`, `--space-24`, `--space-32`, plus negative variants) for internal library use; consumers should not use them.

### 2.4 Spacing, semantic

**Inset (component padding, vertical horizontal):**

| Token        | Value                           | px        |
| ------------ | ------------------------------- | --------- |
| `--inset-xs` | `var(--space-1) var(--space-2)` | 4px 8px   |
| `--inset-sm` | `0.375rem 0.75rem`              | 6px 12px  |
| `--inset-md` | `var(--space-2) var(--space-4)` | 8px 16px  |
| `--inset-lg` | `var(--space-3) var(--space-6)` | 12px 24px |
| `--inset-xl` | `var(--space-4) var(--space-8)` | 16px 32px |

**Stack (vertical gap):**

| Token         | Value |
| ------------- | ----- |
| `--stack-2xs` | 4px   |
| `--stack-xs`  | 8px   |
| `--stack-sm`  | 12px  |
| `--stack-md`  | 16px  |
| `--stack-lg`  | 24px  |
| `--stack-xl`  | 32px  |
| `--stack-2xl` | 48px  |

**Inline (horizontal gap):**

| Token          | Value |
| -------------- | ----- |
| `--inline-2xs` | 4px   |
| `--inline-xs`  | 8px   |
| `--inline-sm`  | 12px  |
| `--inline-md`  | 16px  |
| `--inline-lg`  | 24px  |

### 2.5 Typography

**Font families:**

| Token                 | Stack                                                                     |
| --------------------- | ------------------------------------------------------------------------- |
| `--font-family-sans`  | DM Sans, DM Sans Fallback, Segoe UI, system-ui, -apple-system, sans-serif |
| `--font-family-brand` | Syne, Syne Fallback, DM Sans, DM Sans Fallback, system-ui, sans-serif     |
| `--font-family-serif` | Georgia, Times New Roman, serif                                           |
| `--font-family-mono`  | ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace          |

Load the web fonts (DM Sans, Syne) via `<link>` to Google Fonts or self-hosted via `@font-face`. The `* Fallback` faces are Arial tuned with metric overrides to match each web font, so they must sit immediately after the web font in the stack: text laid out before the font loads then shares the same metrics and `font-display: swap` causes no layout shift when the real font arrives. The mono stack is system-only (no web font). Set up the fallback `@font-face` metric-override declarations upstream, or drop the `* Fallback` entries if not replicating them.

**Font sizes (rem, base 16px):**

| Token             | rem   | px  |
| ----------------- | ----- | --- |
| `--font-size-2xs` | 0.625 | 10  |
| `--font-size-xs`  | 0.75  | 12  |
| `--font-size-sm`  | 0.875 | 14  |
| `--font-size-md`  | 1     | 16  |
| `--font-size-lg`  | 1.125 | 18  |
| `--font-size-xl`  | 1.25  | 20  |
| `--font-size-2xl` | 1.5   | 24  |
| `--font-size-3xl` | 1.875 | 30  |
| `--font-size-4xl` | 2.25  | 36  |
| `--font-size-5xl` | 3     | 48  |

**Font weights:** `regular` 400, `medium` 500, `semibold` 600, `bold` 700, `extrabold` 800.

**Line heights:** `none` 1, `tight` 1.25, `snug` 1.375, `normal` 1.5, `relaxed` 1.625, `loose` 2.

**Letter spacing:** `tighter` -0.05em, `tight` -0.025em, `normal` 0em, `wide` 0.025em, `wider` 0.05em, `widest` 0.1em.

**Composite text styles** (use these in components):

Each role exposes `size`, `weight`, and (for most roles) `lh` custom properties; roles with a pinned font family also expose `family`.

| Role              | Size      | Weight   | Line height | Family |
| ----------------- | --------- | -------- | ----------- | ------ |
| `display`         | 5xl       | bold     | tight       | -      |
| `h1`              | 4xl       | bold     | tight       | -      |
| `h2`              | 3xl       | semibold | snug        | -      |
| `h3`              | 2xl       | semibold | snug        | -      |
| `h4`              | xl        | semibold | snug        | -      |
| `section-heading` | 1.375rem  | semibold | snug        | brand  |
| `body-lg`         | lg        | regular  | relaxed     | -      |
| `body-md`         | md        | regular  | normal      | -      |
| `body-sm`         | sm        | regular  | normal      | -      |
| `label-lg`        | md        | medium   | tight       | -      |
| `label-md`        | sm        | medium   | tight       | -      |
| `label-sm`        | xs        | medium   | tight       | -      |
| `helper`          | 0.8125rem | regular  | normal      | -      |
| `code`            | 0.875em   | regular  | -           | mono   |
| `kbd`             | 0.8125em  | medium   | -           | mono   |

`helper` uses a fixed 13px size, between `xs` and `sm`, for field hint/error text and short metadata. `code` and `kbd` size in `em` so they track the surrounding text; both also expose color, background, padding, and radius tokens (`--text-code-*`, `--text-kbd-*`) for inline code chips and keyboard-key glyphs.

Usage example:

```css
.title {
  font-size: var(--text-h2-size);
  font-weight: var(--text-h2-weight);
  line-height: var(--text-h2-lh);
}
```

### 2.6 Shape

**Border radius:**

| Token           | Value  |
| --------------- | ------ |
| `--radius-none` | 0px    |
| `--radius-xs`   | 2px    |
| `--radius-sm`   | 4px    |
| `--radius-md`   | 6px    |
| `--radius-lg`   | 8px    |
| `--radius-xl`   | 12px   |
| `--radius-2xl`  | 16px   |
| `--radius-3xl`  | 24px   |
| `--radius-full` | 9999px |

**Border width:**

| Token                   | Value |
| ----------------------- | ----- |
| `--border-width-none`   | 0     |
| `--border-width-thin`   | 1px   |
| `--border-width-medium` | 2px   |
| `--border-width-thick`  | 4px   |

### 2.7 Elevation

**Shadows (light mode):**

| Token                         | Value                                                                     |
| ----------------------------- | ------------------------------------------------------------------------- |
| `--shadow-none`               | `none`                                                                    |
| `--shadow-xs`                 | `0 1px 2px 0 rgba(0, 0, 0, 0.05)`                                         |
| `--shadow-sm`                 | `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)`       |
| `--shadow-md`                 | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)`    |
| `--shadow-lg`                 | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)`  |
| `--shadow-xl`                 | `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)` |
| `--shadow-2xl`                | `0 25px 50px -12px rgba(0, 0, 0, 0.25)`                                   |
| `--shadow-inner`              | `inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)`                                   |
| `--shadow-focus-ring`         | `0 0 0 3px rgba(59, 130, 246, 0.45)`                                      |
| `--shadow-focus-ring-error`   | `0 0 0 3px var(--color-error-200)`                                        |
| `--shadow-focus-ring-success` | `0 0 0 3px var(--color-success-200)`                                      |

**Shadows (dark mode):** a drop shadow is the absence of light, so dark mode keeps the shadows **black** (and deeper than light mode); a white "shadow" reads as a glow and looks wrong. Elevation is instead carried by the lifted surface tone plus a hairline top highlight (`--shadow-edge-highlight`, a no-op in light mode) appended to every level so the surface catches light along its top edge.

| Token                     | Dark value                                                                                               |
| ------------------------- | -------------------------------------------------------------------------------------------------------- |
| `--shadow-edge-highlight` | `inset 0 1px 0 0 rgba(255, 255, 255, 0.06)`                                                              |
| `--shadow-xs`             | `0 1px 2px 0 rgba(0, 0, 0, 0.4), var(--shadow-edge-highlight)`                                           |
| `--shadow-sm`             | `0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px -1px rgba(0, 0, 0, 0.4), var(--shadow-edge-highlight)`        |
| `--shadow-md`             | `0 4px 8px -2px rgba(0, 0, 0, 0.55), 0 2px 4px -2px rgba(0, 0, 0, 0.4), var(--shadow-edge-highlight)`    |
| `--shadow-lg`             | `0 12px 20px -4px rgba(0, 0, 0, 0.6), 0 4px 8px -4px rgba(0, 0, 0, 0.45), var(--shadow-edge-highlight)`  |
| `--shadow-xl`             | `0 20px 28px -6px rgba(0, 0, 0, 0.65), 0 8px 12px -6px rgba(0, 0, 0, 0.5), var(--shadow-edge-highlight)` |
| `--shadow-2xl`            | `0 28px 50px -12px rgba(0, 0, 0, 0.75), var(--shadow-edge-highlight)`                                    |

**Bevel and well (relief):** paired inset shadows for surfaces that should read as raised or recessed. Compose with `--shadow-*` for an ambient drop, e.g. `box-shadow: var(--shadow-bevel), var(--shadow-sm);`. Dark-mode variants drop the highlight alpha and raise the shadow alpha so the relief still reads against the lifted `bg-base`.

| Token                   | Light value                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------- |
| `--shadow-bevel`        | `inset 0 1px 1px rgba(255, 255, 255, 0.85), inset 0 -1px 1.5px rgba(0, 0, 0, 0.25)` |
| `--shadow-bevel-strong` | `inset 0 1.5px 2px rgba(255, 255, 255, 0.9), inset 0 -2px 3px rgba(0, 0, 0, 0.3)`   |
| `--shadow-well`         | `inset 0 1px 1.5px rgba(0, 0, 0, 0.3), inset 0 -1px 0.5px rgba(255, 255, 255, 0.5)` |
| `--shadow-well-strong`  | `inset 0 2px 3px rgba(0, 0, 0, 0.4), inset 0 -1.5px 1px rgba(255, 255, 255, 0.55)`  |

| Token                   | Dark value                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------- |
| `--shadow-bevel`        | `inset 0 1px 1px rgba(255, 255, 255, 0.18), inset 0 -1px 1.5px rgba(0, 0, 0, 0.6)`    |
| `--shadow-bevel-strong` | `inset 0 1.5px 2px rgba(255, 255, 255, 0.22), inset 0 -2px 3px rgba(0, 0, 0, 0.7)`    |
| `--shadow-well`         | `inset 0 1px 1.5px rgba(0, 0, 0, 0.55), inset 0 -1px 0.5px rgba(255, 255, 255, 0.08)` |
| `--shadow-well-strong`  | `inset 0 2px 3px rgba(0, 0, 0, 0.7), inset 0 -1.5px 1px rgba(255, 255, 255, 0.12)`    |

**Z-index:**

| Token                | Value |
| -------------------- | ----- |
| `--z-index-base`     | 0     |
| `--z-index-raised`   | 10    |
| `--z-index-dropdown` | 100   |
| `--z-index-sticky`   | 200   |
| `--z-index-overlay`  | 300   |
| `--z-index-modal`    | 400   |
| `--z-index-popover`  | 500   |
| `--z-index-toast`    | 600   |
| `--z-index-tooltip`  | 700   |

### 2.8 Motion

**Durations:**

| Token                | Value |
| -------------------- | ----- |
| `--duration-instant` | 0ms   |
| `--duration-fast`    | 100ms |
| `--duration-normal`  | 200ms |
| `--duration-slow`    | 300ms |
| `--duration-slower`  | 500ms |

Under `@media (prefers-reduced-motion: reduce)`, all non-instant durations collapse to 0ms automatically.

**Easings:**

| Token           | Value                               |
| --------------- | ----------------------------------- |
| `--ease-linear` | `linear`                            |
| `--ease-in`     | `cubic-bezier(0.4, 0, 1, 1)`        |
| `--ease-out`    | `cubic-bezier(0, 0, 0.2, 1)`        |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)`      |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |

**Composite transitions:**

| Token                    | Value                                                                                                                                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--transition-colors`    | `color var(--duration-fast) var(--ease-out), background-color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out), fill var(--duration-fast) var(--ease-out)` |
| `--transition-shadow`    | `box-shadow var(--duration-fast) var(--ease-out)`                                                                                                                                                 |
| `--transition-transform` | `transform var(--duration-normal) var(--ease-spring)`                                                                                                                                             |
| `--transition-opacity`   | `opacity var(--duration-normal) var(--ease-out)`                                                                                                                                                  |
| `--transition-all`       | `all var(--duration-normal) var(--ease-in-out)`                                                                                                                                                   |

<!-- eagami:generated:react-tokens end -->

---

## 3. Setup

### 3.1 CSS custom properties

Copy the block below to `src/styles/eagami-tokens.css` in the consuming project and import it once from your root (`main.tsx` / `_app.tsx` / `layout.tsx`).

<!-- eagami:generated:react-css start -->

```css
/* ---------------------------------------------------------------------------
 * Eagami UI: CSS tokens
 * Generated from @eagami/ui@5.39.0 (packages/ui/src/styles/tokens/*.scss)
 * by scripts/sync-integration-guides.mjs. Do not edit by hand.
 * ------------------------------------------------------------------------- */

:root {
  /* Primitive palette: primary (H=205, S=50) */
  --color-primary-50: #ecf3f9;
  --color-primary-100: #d1e3f0;
  --color-primary-200: #abcbe3;
  --color-primary-300: #7dafd4;
  --color-primary-400: #4b91c3;
  --color-primary-500: #3674a1;
  --color-primary-600: #2a5b7e;
  --color-primary-700: #204560;
  --color-primary-800: #162f41;
  --color-primary-900: #0d1c26;

  /* Primitive palette: secondary (H=222, S=25) */
  --color-secondary-50: #f3f5fa;
  --color-secondary-100: #dce1ec;
  --color-secondary-200: #bbc4d8;
  --color-secondary-300: #93a1bf;
  --color-secondary-400: #687aa5;
  --color-secondary-500: #506086;
  --color-secondary-600: #404c6a;
  --color-secondary-700: #313b51;
  --color-secondary-800: #232938;
  --color-secondary-900: #151922;

  /* Primitive palette: neutral */
  --color-neutral-0: #ffffff;
  --color-neutral-50: #f9fafb;
  --color-neutral-100: #f3f4f6;
  --color-neutral-200: #e5e7eb;
  --color-neutral-300: #d1d5db;
  --color-neutral-400: #9ca3af;
  --color-neutral-500: #6b7280;
  --color-neutral-600: #4b5563;
  --color-neutral-700: #374151;
  --color-neutral-800: #1f2937;
  --color-neutral-900: #111827;
  --color-neutral-950: #030712;

  /* Primitive palette: feedback */
  --color-success-50: #f0fdf4;
  --color-success-100: #dcfce7;
  --color-success-200: #bbf7d0;
  --color-success-500: #22c55e;
  --color-success-600: #16a34a;
  --color-success-700: #15803d;
  --color-warning-50: #fffbeb;
  --color-warning-100: #fef3c7;
  --color-warning-200: #fde68a;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  --color-warning-700: #b45309;
  --color-error-50: #fef2f2;
  --color-error-100: #fee2e2;
  --color-error-200: #fecaca;
  --color-error-500: #ef4444;
  --color-error-600: #dc2626;
  --color-error-700: #b91c1c;
  --color-info-50: #ecfeff;
  --color-info-100: #cffafe;
  --color-info-200: #a5f3fc;
  --color-info-500: #06b6d4;
  --color-info-600: #0891b2;
  --color-info-700: #0e7490;

  /* Color picker intrinsics (not themeable) */
  --color-picker-hue-red: #ff0000;
  --color-picker-hue-yellow: #ffff00;
  --color-picker-hue-green: #00ff00;
  --color-picker-hue-cyan: #00ffff;
  --color-picker-hue-blue: #0000ff;
  --color-picker-hue-magenta: #ff00ff;
  --color-picker-sv-white: #ffffff;
  --color-picker-sv-black: #000000;
  --color-picker-thumb-halo: rgba(0, 0, 0, 0.25);

  /* Semantic: text */
  --color-text-primary: var(--color-neutral-900);
  --color-text-secondary: var(--color-neutral-600);
  --color-text-tertiary: var(--color-neutral-400);
  --color-text-disabled: var(--color-neutral-400);
  --color-text-inverse: var(--color-neutral-0);
  --color-text-link: var(--color-primary-600);
  --color-text-link-hover: var(--color-primary-800);

  /* Semantic: background */
  --color-bg-canvas: var(--color-neutral-0);
  --color-bg-base: var(--color-neutral-0);
  --color-bg-subtle: var(--color-neutral-50);
  --color-bg-stripe: var(--color-neutral-50);
  --color-bg-stripe-subtle: color-mix(in srgb, var(--color-bg-base) 30%, var(--color-bg-stripe));
  --color-bg-muted: var(--color-neutral-100);
  --color-bg-emphasis: var(--color-neutral-100);
  --color-bg-elevated: var(--color-neutral-0);
  --color-bg-overlay: rgba(0, 0, 0, 0.5);

  /* Semantic: tooltip surface */
  --color-tooltip-surface: #1a1b21;
  --color-tooltip-border: rgba(255, 255, 255, 0.15);

  /* Semantic: interactive state fills */
  --color-state-hover: var(--color-neutral-100);
  --color-state-active: var(--color-neutral-200);

  /* Semantic: border */
  --color-border-subtle: var(--color-neutral-200);
  --color-border-default: var(--color-neutral-200);
  --color-border-strong: var(--color-neutral-400);
  --color-divider: rgba(0, 0, 0, 0.1);
  --color-border-focus: var(--color-primary-500);

  /* Semantic: brand */
  --color-brand-default: var(--color-primary-600);
  --color-brand-hover: var(--color-primary-700);
  --color-brand-active: var(--color-primary-800);
  --color-brand-text: var(--color-primary-700);
  --color-brand-subtle: var(--color-primary-50);
  --color-brand-muted: var(--color-primary-100);
  --color-brand-secondary-default: var(--color-secondary-500);
  --color-brand-secondary-hover: var(--color-secondary-600);
  --color-brand-secondary-active: var(--color-secondary-700);
  --color-brand-secondary-text: var(--color-secondary-700);
  --color-brand-secondary-subtle: var(--color-secondary-50);
  --color-brand-secondary-muted: var(--color-secondary-100);

  /* Semantic: feedback roles */
  --color-success-default: var(--color-success-600);
  --color-success-subtle: var(--color-success-50);
  --color-success-muted: var(--color-success-100);
  --color-success-text: var(--color-success-700);
  --color-warning-default: var(--color-warning-600);
  --color-warning-subtle: var(--color-warning-50);
  --color-warning-muted: var(--color-warning-100);
  --color-warning-text: var(--color-warning-700);
  --color-error-default: var(--color-error-600);
  --color-error-subtle: var(--color-error-50);
  --color-error-muted: var(--color-error-100);
  --color-error-text: var(--color-error-700);
  --color-info-default: var(--color-info-600);
  --color-info-subtle: var(--color-info-50);
  --color-info-muted: var(--color-info-100);
  --color-info-text: var(--color-info-700);

  /* Spacing: base scale (whitelist only) */
  --space-0: 0;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Spacing: semantic insets */
  --inset-xs: var(--space-1) var(--space-2);
  --inset-sm: 0.375rem 0.75rem;
  --inset-md: var(--space-2) var(--space-4);
  --inset-lg: var(--space-3) var(--space-6);
  --inset-xl: var(--space-4) var(--space-8);

  /* Spacing: stack (vertical gap) */
  --stack-2xs: var(--space-1);
  --stack-xs: var(--space-2);
  --stack-sm: var(--space-3);
  --stack-md: var(--space-4);
  --stack-lg: var(--space-6);
  --stack-xl: var(--space-8);
  --stack-2xl: var(--space-12);

  /* Spacing: inline (horizontal gap) */
  --inline-2xs: var(--space-1);
  --inline-xs: var(--space-2);
  --inline-sm: var(--space-3);
  --inline-md: var(--space-4);
  --inline-lg: var(--space-6);

  /* Typography: families */
  --font-family-sans:
    'DM Sans', 'DM Sans Fallback', 'Segoe UI', system-ui, -apple-system, sans-serif;
  --font-family-brand:
    'Syne', 'Syne Fallback', 'DM Sans', 'DM Sans Fallback', system-ui, sans-serif;
  --font-family-serif: 'Georgia', 'Times New Roman', serif;
  --font-family-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Typography: sizes */
  --font-size-2xs: 0.625rem;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;

  /* Typography: weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Typography: line heights */
  --line-height-none: 1;
  --line-height-tight: 1.25;
  --line-height-snug: 1.375;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 2;

  /* Typography: letter spacing */
  --letter-spacing-tighter: -0.05em;
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0em;
  --letter-spacing-wide: 0.025em;
  --letter-spacing-wider: 0.05em;
  --letter-spacing-widest: 0.1em;

  /* Typography: inline icon sizing */
  --icon-inline-size: 1.5em;

  /* Typography: composite text styles */
  --text-display-size: var(--font-size-5xl);
  --text-display-weight: var(--font-weight-bold);
  --text-display-lh: var(--line-height-tight);
  --text-h1-size: var(--font-size-4xl);
  --text-h1-weight: var(--font-weight-bold);
  --text-h1-lh: var(--line-height-tight);
  --text-h2-size: var(--font-size-3xl);
  --text-h2-weight: var(--font-weight-semibold);
  --text-h2-lh: var(--line-height-snug);
  --text-h3-size: var(--font-size-2xl);
  --text-h3-weight: var(--font-weight-semibold);
  --text-h3-lh: var(--line-height-snug);
  --text-h4-size: var(--font-size-xl);
  --text-h4-weight: var(--font-weight-semibold);
  --text-h4-lh: var(--line-height-snug);
  --text-section-heading-size: 1.375rem;
  --text-section-heading-weight: var(--font-weight-semibold);
  --text-section-heading-lh: var(--line-height-snug);
  --text-section-heading-family: var(--font-family-brand);
  --text-body-lg-size: var(--font-size-lg);
  --text-body-lg-weight: var(--font-weight-regular);
  --text-body-lg-lh: var(--line-height-relaxed);
  --text-body-md-size: var(--font-size-md);
  --text-body-md-weight: var(--font-weight-regular);
  --text-body-md-lh: var(--line-height-normal);
  --text-body-sm-size: var(--font-size-sm);
  --text-body-sm-weight: var(--font-weight-regular);
  --text-body-sm-lh: var(--line-height-normal);
  --text-label-lg-size: var(--font-size-md);
  --text-label-lg-weight: var(--font-weight-medium);
  --text-label-lg-lh: var(--line-height-tight);
  --text-label-md-size: var(--font-size-sm);
  --text-label-md-weight: var(--font-weight-medium);
  --text-label-md-lh: var(--line-height-tight);
  --text-label-sm-size: var(--font-size-xs);
  --text-label-sm-weight: var(--font-weight-medium);
  --text-label-sm-lh: var(--line-height-tight);
  --text-helper-size: 0.8125rem;
  --text-helper-weight: var(--font-weight-regular);
  --text-helper-lh: var(--line-height-normal);
  --text-code-size: 0.875em;
  --text-code-weight: var(--font-weight-regular);
  --text-code-family: var(--font-family-mono);
  --text-code-color: var(--color-text-primary);
  --text-code-bg: var(--color-bg-muted);
  --text-code-padding: 0.125rem 0.375rem;
  --text-code-radius: var(--radius-sm);
  --text-kbd-size: 0.8125em;
  --text-kbd-weight: var(--font-weight-medium);
  --text-kbd-family: var(--font-family-mono);
  --text-kbd-color: var(--color-text-primary);
  --text-kbd-bg: var(--color-bg-base);
  --text-kbd-border: var(--border-width-thin) solid var(--color-border-default);
  --text-kbd-padding: 0.125rem 0.375rem;
  --text-kbd-radius: var(--radius-sm);
  --text-kbd-shadow: 0 1px 0 var(--color-border-default);

  /* Shape: radius */
  --radius-none: 0;
  --radius-xs: 0.125rem;
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  --radius-full: 9999px;

  /* Shape: border widths */
  --border-width-none: 0;
  --border-width-thin: 1px;
  --border-width-medium: 2px;
  --border-width-thick: 4px;

  /* Elevation: shadows */
  --shadow-none: none;
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  --shadow-edge-highlight: 0 0 #0000;

  /* Elevation: relief (bevel and well) */
  --shadow-bevel:
    inset 0 1px 1px rgba(255, 255, 255, 0.85), inset 0 -1px 1.5px rgba(0, 0, 0, 0.25);
  --shadow-bevel-strong:
    inset 0 1.5px 2px rgba(255, 255, 255, 0.9), inset 0 -2px 3px rgba(0, 0, 0, 0.3);
  --shadow-well:
    inset 0 1px 1.5px rgba(0, 0, 0, 0.3), inset 0 -1px 0.5px rgba(255, 255, 255, 0.5);
  --shadow-well-strong:
    inset 0 2px 3px rgba(0, 0, 0, 0.4), inset 0 -1.5px 1px rgba(255, 255, 255, 0.55);

  /* Elevation: focus rings */
  --shadow-focus-ring: 0 0 0 3px rgba(59, 130, 246, 0.45);
  --shadow-focus-ring-error: 0 0 0 3px var(--color-error-200);
  --shadow-focus-ring-success: 0 0 0 3px var(--color-success-200);

  /* Elevation: z-index */
  --z-index-base: 0;
  --z-index-raised: 10;
  --z-index-dropdown: 100;
  --z-index-sticky: 200;
  --z-index-overlay: 300;
  --z-index-modal: 400;
  --z-index-popover: 500;
  --z-index-toast: 600;
  --z-index-tooltip: 700;

  /* Motion: durations */
  --duration-instant: 0ms;
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;

  /* Motion: easings */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Motion: composite transitions */
  --transition-colors:
    color var(--duration-fast) var(--ease-out),
    background-color var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out),
    fill var(--duration-fast) var(--ease-out);
  --transition-shadow: box-shadow var(--duration-fast) var(--ease-out);
  --transition-transform: transform var(--duration-normal) var(--ease-spring);
  --transition-opacity: opacity var(--duration-normal) var(--ease-out);
  --transition-all: all var(--duration-normal) var(--ease-in-out);
}

/* Dark mode: applied when the OS prefers dark, unless forced light via
 * <html data-theme="light">. <html data-theme="dark"> forces dark. The
 * declarations are duplicated across the two selectors below to match the
 * upstream SCSS, which shares them via a mixin; keep the two lists identical. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    --color-text-primary: var(--color-neutral-50);
    --color-text-secondary: var(--color-neutral-300);
    --color-text-tertiary: var(--color-neutral-500);
    --color-text-disabled: var(--color-neutral-500);
    --color-text-inverse: var(--color-neutral-900);
    --color-text-link: var(--color-primary-300);
    --color-text-link-hover: var(--color-primary-100);

    --color-bg-canvas: var(--color-neutral-950);
    --color-bg-base: var(--color-neutral-800);
    --color-bg-subtle: var(--color-neutral-700);
    --color-bg-stripe: var(--color-neutral-900);
    --color-bg-stripe-subtle: color-mix(in srgb, var(--color-bg-base) 62.5%, var(--color-bg-stripe));
    --color-bg-muted: var(--color-neutral-700);
    --color-bg-emphasis: var(--color-neutral-600);
    --color-bg-elevated: var(--color-neutral-700);

    --color-state-hover: rgba(255, 255, 255, 0.08);
    --color-state-active: rgba(255, 255, 255, 0.14);

    --color-border-subtle: color-mix(in srgb, var(--color-neutral-700), var(--color-neutral-800));
    --color-border-default: var(--color-neutral-400);
    --color-border-strong: var(--color-neutral-300);
    --color-divider: rgba(255, 255, 255, 0.12);

    --color-brand-default: var(--color-primary-500);
    --color-brand-hover: var(--color-primary-600);
    --color-brand-active: var(--color-primary-700);
    --color-brand-text: var(--color-primary-300);
    --color-brand-subtle: rgba(75, 145, 195, 0.1);
    --color-brand-muted: rgba(75, 145, 195, 0.2);
    --color-brand-secondary-text: var(--color-secondary-200);
    --color-brand-secondary-subtle: rgba(104, 122, 165, 0.1);
    --color-brand-secondary-muted: rgba(104, 122, 165, 0.2);

    --color-success-subtle: rgba(34, 197, 94, 0.15);
    --color-success-muted: rgba(34, 197, 94, 0.25);
    --color-success-text: var(--color-success-200);
    --color-warning-subtle: rgba(245, 158, 11, 0.15);
    --color-warning-muted: rgba(245, 158, 11, 0.25);
    --color-warning-text: var(--color-warning-200);
    --color-error-subtle: rgba(239, 68, 68, 0.15);
    --color-error-muted: rgba(239, 68, 68, 0.25);
    --color-error-text: var(--color-error-200);
    --color-info-subtle: rgba(6, 182, 212, 0.15);
    --color-info-muted: rgba(6, 182, 212, 0.25);
    --color-info-text: var(--color-info-200);

    --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.4), var(--shadow-edge-highlight);
    --shadow-sm:
      0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px -1px rgba(0, 0, 0, 0.4),
      var(--shadow-edge-highlight);
    --shadow-md:
      0 4px 8px -2px rgba(0, 0, 0, 0.55), 0 2px 4px -2px rgba(0, 0, 0, 0.4),
      var(--shadow-edge-highlight);
    --shadow-lg:
      0 12px 20px -4px rgba(0, 0, 0, 0.6), 0 4px 8px -4px rgba(0, 0, 0, 0.45),
      var(--shadow-edge-highlight);
    --shadow-xl:
      0 20px 28px -6px rgba(0, 0, 0, 0.65), 0 8px 12px -6px rgba(0, 0, 0, 0.5),
      var(--shadow-edge-highlight);
    --shadow-2xl: 0 28px 50px -12px rgba(0, 0, 0, 0.75), var(--shadow-edge-highlight);
    --shadow-edge-highlight: inset 0 1px 0 0 rgba(255, 255, 255, 0.06);

    --shadow-bevel:
      inset 0 1px 1px rgba(255, 255, 255, 0.18), inset 0 -1px 1.5px rgba(0, 0, 0, 0.6);
    --shadow-bevel-strong:
      inset 0 1.5px 2px rgba(255, 255, 255, 0.22), inset 0 -2px 3px rgba(0, 0, 0, 0.7);
    --shadow-well:
      inset 0 1px 1.5px rgba(0, 0, 0, 0.55),
      inset 0 -1px 0.5px rgba(255, 255, 255, 0.08);
    --shadow-well-strong:
      inset 0 2px 3px rgba(0, 0, 0, 0.7), inset 0 -1.5px 1px rgba(255, 255, 255, 0.12);
  }
}

:root[data-theme='dark'] {
  color-scheme: dark;

  --color-text-primary: var(--color-neutral-50);
  --color-text-secondary: var(--color-neutral-300);
  --color-text-tertiary: var(--color-neutral-500);
  --color-text-disabled: var(--color-neutral-500);
  --color-text-inverse: var(--color-neutral-900);
  --color-text-link: var(--color-primary-300);
  --color-text-link-hover: var(--color-primary-100);

  --color-bg-canvas: var(--color-neutral-950);
  --color-bg-base: var(--color-neutral-800);
  --color-bg-subtle: var(--color-neutral-700);
  --color-bg-stripe: var(--color-neutral-900);
  --color-bg-stripe-subtle: color-mix(in srgb, var(--color-bg-base) 62.5%, var(--color-bg-stripe));
  --color-bg-muted: var(--color-neutral-700);
  --color-bg-emphasis: var(--color-neutral-600);
  --color-bg-elevated: var(--color-neutral-700);

  --color-state-hover: rgba(255, 255, 255, 0.08);
  --color-state-active: rgba(255, 255, 255, 0.14);

  --color-border-subtle: color-mix(in srgb, var(--color-neutral-700), var(--color-neutral-800));
  --color-border-default: var(--color-neutral-400);
  --color-border-strong: var(--color-neutral-300);
  --color-divider: rgba(255, 255, 255, 0.12);

  --color-brand-default: var(--color-primary-500);
  --color-brand-hover: var(--color-primary-600);
  --color-brand-active: var(--color-primary-700);
  --color-brand-text: var(--color-primary-300);
  --color-brand-subtle: rgba(75, 145, 195, 0.1);
  --color-brand-muted: rgba(75, 145, 195, 0.2);
  --color-brand-secondary-text: var(--color-secondary-200);
  --color-brand-secondary-subtle: rgba(104, 122, 165, 0.1);
  --color-brand-secondary-muted: rgba(104, 122, 165, 0.2);

  --color-success-subtle: rgba(34, 197, 94, 0.15);
  --color-success-muted: rgba(34, 197, 94, 0.25);
  --color-success-text: var(--color-success-200);
  --color-warning-subtle: rgba(245, 158, 11, 0.15);
  --color-warning-muted: rgba(245, 158, 11, 0.25);
  --color-warning-text: var(--color-warning-200);
  --color-error-subtle: rgba(239, 68, 68, 0.15);
  --color-error-muted: rgba(239, 68, 68, 0.25);
  --color-error-text: var(--color-error-200);
  --color-info-subtle: rgba(6, 182, 212, 0.15);
  --color-info-muted: rgba(6, 182, 212, 0.25);
  --color-info-text: var(--color-info-200);

  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.4), var(--shadow-edge-highlight);
  --shadow-sm:
    0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px -1px rgba(0, 0, 0, 0.4),
    var(--shadow-edge-highlight);
  --shadow-md:
    0 4px 8px -2px rgba(0, 0, 0, 0.55), 0 2px 4px -2px rgba(0, 0, 0, 0.4),
    var(--shadow-edge-highlight);
  --shadow-lg:
    0 12px 20px -4px rgba(0, 0, 0, 0.6), 0 4px 8px -4px rgba(0, 0, 0, 0.45),
    var(--shadow-edge-highlight);
  --shadow-xl:
    0 20px 28px -6px rgba(0, 0, 0, 0.65), 0 8px 12px -6px rgba(0, 0, 0, 0.5),
    var(--shadow-edge-highlight);
  --shadow-2xl: 0 28px 50px -12px rgba(0, 0, 0, 0.75), var(--shadow-edge-highlight);
  --shadow-edge-highlight: inset 0 1px 0 0 rgba(255, 255, 255, 0.06);

  --shadow-bevel:
    inset 0 1px 1px rgba(255, 255, 255, 0.18), inset 0 -1px 1.5px rgba(0, 0, 0, 0.6);
  --shadow-bevel-strong:
    inset 0 1.5px 2px rgba(255, 255, 255, 0.22), inset 0 -2px 3px rgba(0, 0, 0, 0.7);
  --shadow-well:
    inset 0 1px 1.5px rgba(0, 0, 0, 0.55), inset 0 -1px 0.5px rgba(255, 255, 255, 0.08);
  --shadow-well-strong:
    inset 0 2px 3px rgba(0, 0, 0, 0.7), inset 0 -1.5px 1px rgba(255, 255, 255, 0.12);
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0ms;
    --duration-normal: 0ms;
    --duration-slow: 0ms;
    --duration-slower: 0ms;
  }
}
```

<!-- eagami:generated:react-css end -->

> The block above duplicates the dark-mode declarations across the `@media` and `[data-theme='dark']` selectors to match the upstream SCSS, which uses a `@mixin` to share them. Keep the two lists identical when you edit.

### 3.2 TypeScript constants module

For JS access (CSS-in-JS, Tailwind config, runtime theming), create `src/theme/eagami-tokens.ts`. This mirrors the primitive palette; prefer reading CSS vars at runtime via `getComputedStyle` for semantic tokens (which change with theme).

<!-- eagami:generated:react-ts start -->

```ts
/**
 * Eagami UI: TypeScript tokens
 * Generated from @eagami/ui@5.39.0 by scripts/sync-integration-guides.mjs.
 * Do not edit by hand.
 */

export const palette = {
  primary: {
    50: '#ecf3f9', 100: '#d1e3f0', 200: '#abcbe3', 300: '#7dafd4', 400: '#4b91c3',
    500: '#3674a1', 600: '#2a5b7e', 700: '#204560', 800: '#162f41', 900: '#0d1c26',
  },
  secondary: {
    50: '#f3f5fa', 100: '#dce1ec', 200: '#bbc4d8', 300: '#93a1bf', 400: '#687aa5',
    500: '#506086', 600: '#404c6a', 700: '#313b51', 800: '#232938', 900: '#151922',
  },
  neutral: {
    0: '#ffffff', 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db',
    400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937',
    900: '#111827', 950: '#030712',
  },
  success: {
    50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 500: '#22c55e', 600: '#16a34a',
    700: '#15803d',
  },
  warning: {
    50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 500: '#f59e0b', 600: '#d97706',
    700: '#b45309',
  },
  error: {
    50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 500: '#ef4444', 600: '#dc2626',
    700: '#b91c1c',
  },
  info: {
    50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 500: '#06b6d4', 600: '#0891b2',
    700: '#0e7490',
  },
} as const;

export const spacing = {
  s0: 0, s1: 4, s2: 8, s3: 12, s4: 16, s6: 24, s8: 32, s12: 48, s16: 64,
  stack: { xxs: 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 48 },
  inline: { xxs: 4, xs: 8, sm: 12, md: 16, lg: 24 },
} as const;

export const radius = {
  none: 0, xs: 2, sm: 4, md: 6, lg: 8, xl: 12, xxl: 16, xxxl: 24, full: 9999,
} as const;

export const borderWidth = { none: 0, thin: 1, medium: 2, thick: 4 } as const;

export const duration = {
  instant: 0, fast: 100, normal: 200, slow: 300, slower: 500,
} as const;

export const easing = {
  linear: 'linear', in: 'cubic-bezier(0.4, 0, 1, 1)', out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)', spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export const zIndex = {
  base: 0, raised: 10, dropdown: 100, sticky: 200, overlay: 300, modal: 400,
  popover: 500, toast: 600, tooltip: 700,
} as const;

/**
 * Read a semantic color token at runtime. Use this when you need the current
 * resolved value in JS (e.g. for Canvas rendering). For everything else, prefer
 * CSS `var(--color-...)` references.
 */
export function readCssToken(name: string): string {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
```

<!-- eagami:generated:react-ts end -->

### 3.3 Importing tokens in the root

```tsx
// app/layout.tsx (Next.js) or main.tsx (Vite) or _app.tsx (pages router)
import './styles/eagami-tokens.css';

// then import your app entry as usual
```

### 3.4 Manual dark mode override

The token block in section 3.1 already supports both `@media (prefers-color-scheme: dark)` and an explicit `<html data-theme="...">` override. Apply the override at runtime:

```ts
type Theme = 'light' | 'dark' | 'auto';

export function setTheme(theme: Theme): void {
  if (theme === 'auto') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
```

`data-theme="light"` forces light mode even when the OS prefers dark. `data-theme="dark"` forces dark regardless of OS. Removing the attribute defers to `prefers-color-scheme`.

### 3.5 Brand palette derivation

The upstream Angular library accepts a single brand hex via `provideEagamiUi({ palette: { primary: { base: '#…' } } })` and derives a full ten-shade scale in [OKLCH](https://www.w3.org/TR/css-color-4/#ok-lab) space, holding hue and chroma steady while stepping lightness. Every brand-role pairing (text-on-surface, surface-on-canvas) is asserted against WCAG 2.1 AA at bootstrap; a contrast violation throws before the app loads.

The React integration uses static CSS tokens, so the same workflow is offline: pick a base hex, derive the ten shades, paste them into the `--color-primary-*` block of `eagami-tokens.css`. A small TypeScript helper (mirroring `packages/ui/src/lib/palette/derive-palette.ts` in the upstream repo) can do the OKLCH derivation at build time:

```ts
import { converter, formatHex } from 'culori';

const toOklch = converter('oklch');
const toHex = formatHex;

const TARGET_L: Record<string, number> = {
  '50': 0.96,  '100': 0.90, '200': 0.82, '300': 0.72, '400': 0.62,
  '500': 0.52, '600': 0.42, '700': 0.34, '800': 0.26, '900': 0.18,
};

export function derivePrimaryScale(baseHex: string): Record<string, string> {
  const anchor = toOklch(baseHex);
  if (!anchor) throw new Error(`Invalid hex: ${baseHex}`);
  const out: Record<string, string> = {};
  for (const [shade, L] of Object.entries(TARGET_L)) {
    out[shade] = toHex({ mode: 'oklch', l: L, c: anchor.c, h: anchor.h ?? 0 });
  }
  return out;
}
```

Run the helper in a one-off script when picking a new brand colour and copy the result into `eagami-tokens.css`. For brand books that pin specific hexes, override individual shades after derivation. After regenerating, verify in dev tools that text-on-surface and surface-on-canvas pairs still meet AA; the Angular library does this assertion at bootstrap; with static tokens you assert manually.

---

## 4. Usage patterns

### 4.1 Do

```tsx
// Button.tsx
import styles from './Button.module.css';

export function Button({ children, variant = 'primary', size = 'md', ...rest }: Props) {
  return (
    <button
      className={`${styles.root} ${styles[variant]} ${styles[size]}`}
      {...rest}
    >
      {children}
    </button>
  );
}
```

```css
/* Button.module.css */
.root {
  padding: var(--inset-md);
  font-size: var(--text-label-md-size);
  font-weight: var(--text-label-md-weight);
  line-height: var(--text-label-md-lh);
  border: var(--border-width-thin) solid transparent;
  border-radius: var(--radius-md);
  transition: var(--transition-colors), var(--transition-shadow);
  cursor: pointer;
}
.root:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus-ring);
}
.primary {
  background: var(--color-brand-default);
  color: var(--color-text-inverse);
}
.primary:hover {
  background: var(--color-brand-hover);
}
.primary:active {
  background: var(--color-brand-active);
}
.sm { padding: var(--inset-sm); font-size: var(--text-label-sm-size); }
.lg { padding: var(--inset-lg); font-size: var(--text-label-lg-size); }
```

### 4.2 Don't

```css
/* WRONG: hard-coded colors, spacing, typography, transition */
.root {
  padding: 10px 15px;                    /* not on the scale, use --inset-md */
  background: #2a5b7e;                   /* use var(--color-brand-default) */
  color: white;                          /* use var(--color-text-inverse) */
  border-radius: 5px;                    /* not a radius token */
  font-size: 15px;                       /* use --text-label-md-size */
  transition: all 200ms ease-in-out;     /* use var(--transition-colors) */
}
.root:focus {
  outline: 2px solid blue;               /* use box-shadow: var(--shadow-focus-ring) on :focus-visible */
}
```

### 4.3 With CSS-in-JS (styled-components / emotion)

CSS variables work transparently:

```tsx
import styled from 'styled-components';

const Card = styled.article`
  padding: var(--inset-lg);
  background: var(--color-bg-elevated);
  border: var(--border-width-thin) solid var(--color-border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
`;
```

For JS-side values (e.g. prop-derived), import from `eagami-tokens.ts`:

```tsx
import { spacing } from '@/theme/eagami-tokens';

const Stack = styled.div<{ gap?: keyof typeof spacing.stack }>`
  display: flex;
  flex-direction: column;
  gap: ${({ gap = 'md' }) => spacing.stack[gap]}px;
`;
```

### 4.4 With Tailwind

Extend `tailwind.config.js` using the CSS variables:

```js
// tailwind.config.js
import { palette, spacing, radius } from './src/theme/eagami-tokens';

export default {
  theme: {
    colors: {
      ...palette,
      text: {
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        tertiary: 'var(--color-text-tertiary)',
        disabled: 'var(--color-text-disabled)',
        inverse: 'var(--color-text-inverse)',
        link: 'var(--color-text-link)',
      },
      bg: {
        base: 'var(--color-bg-base)',
        subtle: 'var(--color-bg-subtle)',
        elevated: 'var(--color-bg-elevated)',
        muted: 'var(--color-bg-muted)',
      },
      border: {
        DEFAULT: 'var(--color-border-default)',
        strong: 'var(--color-border-strong)',
      },
      brand: {
        DEFAULT: 'var(--color-brand-default)',
        hover: 'var(--color-brand-hover)',
        active: 'var(--color-brand-active)',
        subtle: 'var(--color-brand-subtle)',
        muted: 'var(--color-brand-muted)',
      },
    },
    spacing: {
      0: '0', 1: '4px', 2: '8px', 3: '12px', 4: '16px',
      6: '24px', 8: '32px', 12: '48px', 16: '64px',
    },
    borderRadius: {
      none: '0', xs: '2px', sm: '4px', md: '6px', lg: '8px',
      xl: '12px', '2xl': '16px', '3xl': '24px', full: '9999px',
    },
    boxShadow: {
      xs: 'var(--shadow-xs)',
      sm: 'var(--shadow-sm)',
      md: 'var(--shadow-md)',
      lg: 'var(--shadow-lg)',
      xl: 'var(--shadow-xl)',
      '2xl': 'var(--shadow-2xl)',
      focus: 'var(--shadow-focus-ring)',
    },
    extend: {
      darkMode: ['class', '[data-theme="dark"]'],
    },
  },
};
```

**Keep the Tailwind config's spacing table in sync with section 2.3.** Tailwind's default scale includes values (5, 7, 9, 10, 11, 14, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96) that violate the Eagami scale. Either override the entire `spacing` key (as above) or configure a lint rule to prevent forbidden keys.

---

## 5. Component API conventions

When building React components that mirror Eagami components, preserve the prop names, variant literals, defaults, and past-tense event names below. Inputs default to `undefined` unless noted.

### 5.1 Button

```ts
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
// Shared t-shirt scale used by every sized component (mirrors upstream EaSize).
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type ButtonType = 'button' | 'submit' | 'reset';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: ButtonVariant;        // default 'primary'
  size?: Size;                    // default 'md'
  type?: ButtonType;              // default 'button'
  disabled?: boolean;             // default false
  loading?: boolean;              // default false
  fullWidth?: boolean;            // default false
  icon?: React.ComponentType;     // optional icon rendered to the left of the label
  'aria-label'?: string;          // when the content is not descriptive enough
  'aria-current'?: string;        // marks the button as the current item in a set
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // 'clicked' upstream
}
```

**Behavior:**
- `loading` shows a spinner and disables the button but preserves width (`visibility: hidden` on the children, spinner positioned absolutely).
- `fullWidth` sets `width: 100%`.
- Hover: background shifts to `--color-brand-hover` / `--color-brand-active`.
- Native `disabled` is authoritative; do not add `aria-disabled`.

### 5.2 Input

```ts
type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'prefix'> {
  label?: string;
  placeholder?: string;           // default ''
  hint?: string;
  errorMsg?: string;              // setting this puts the input in the error visual state
  type?: InputType;               // default 'text'
  size?: Size;                    // default 'md'
  disabled?: boolean;
  readOnly?: boolean;             // 'readonly' upstream
  required?: boolean;
  clearable?: boolean;            // default false; shows a clear button when non-empty
  showPasswordToggle?: boolean;   // default true; only relevant when type === 'password'
  autofocus?: boolean;            // default false
  autocomplete?: string;          // native autocomplete attribute
  list?: string;                  // native <datalist> id
  min?: number;                   // for type 'number'
  max?: number;                   // for type 'number'
  step?: number;                  // for type 'number'
  minLength?: number;
  maxLength?: number;
  icon?: React.ComponentType;     // leading icon rendered inside the input
  value?: string;                 // default ''
  onChange?: (value: string) => void;          // emits string, not the event
  onFocus?: (e: React.FocusEvent) => void;     // mirrors `focused`
  onBlur?: (e: React.FocusEvent) => void;      // mirrors `blurred`
}
```

Note: there is no `status` prop and no `success` visual state. The error state is driven solely by `errorMsg`. There is a single leading `icon` slot (no separate `prefix` / `suffix`). The password-visibility toggle (shown for `type === 'password'` unless `showPasswordToggle` is `false`) must be keyboard-reachable, with an accessible name driven by the `input.showPassword` / `input.hidePassword` i18n strings (see section 6). A `clearable` input renders a keyboard-reachable clear button named from `input.clear`.

### 5.3 Textarea

Mirrors `Input` but renders a `<textarea>`. Same `label` / `hint` / `errorMsg` / `size` / `disabled` / `readOnly` / `required` / `placeholder` / `value` / `onChange(value: string)` / `onFocus` / `onBlur` props. Instead of `rows` / `autoResize`, it exposes:

```ts
type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

interface TextareaExtraProps {
  resize?: TextareaResize;        // default 'vertical'
  minHeight?: number;             // px; lower bound for auto-grow
  maxHeight?: number;             // px; upper bound for auto-grow (scrolls past it)
  maxLength?: number;             // 'maxlength' upstream
}
```

The textarea auto-grows with its content between `minHeight` and `maxHeight`.

### 5.4 Checkbox

```ts
interface CheckboxProps {
  checked: boolean;               // default false; mirrors two-way [(checked)]
  onChange: (checked: boolean) => void; // mirrors `changed`
  label?: string;
  count?: string | number;        // supplementary value shown dimmed after the label
  hint?: string;
  errorMsg?: string;
  size?: Size;
  disabled?: boolean;
  required?: boolean;
  indeterminate?: boolean;        // default false
  id?: string;
  'aria-label'?: string;          // accessible name when label is omitted
}
```

### 5.5 Switch

```ts
interface SwitchProps {
  checked: boolean;               // default false; mirrors two-way [(checked)]
  onChange: (checked: boolean) => void; // mirrors `changed`
  label?: string;
  hint?: string;
  errorMsg?: string;
  size?: Size;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  'aria-label'?: string;          // required when label is omitted
}
```

### 5.6 Radio group

```ts
interface RadioGroupProps<T extends string> {
  value: T;                       // mirrors two-way [(value)]
  onChange: (value: T) => void;   // mirrors `changed`
  name?: string;                  // auto-generated when omitted
  label?: string;
  hint?: string;
  errorMsg?: string;
  size?: Size;
  orientation?: 'vertical' | 'horizontal'; // default 'vertical'
  disabled?: boolean;
  required?: boolean;
  id?: string;
  'aria-label'?: string;          // accessible name when label is omitted
  children: React.ReactNode;      // expects <Radio> children
}

interface RadioProps<T extends string> {
  value: T;                       // required
  label?: string;
  disabled?: boolean;
  id?: string;
}
```

Vertically centre the label against the radio circle.

### 5.7 Card

```ts
type CardVariant = 'elevated' | 'outlined' | 'filled';
type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';
type CardHeaderAlign = 'start' | 'center' | 'end';

interface CardProps {
  variant?: CardVariant;          // default 'elevated'
  padding?: CardPadding;          // default 'md'
  headerAlign?: CardHeaderAlign;  // default 'center'; horizontal alignment of header content
  fullWidth?: boolean;
  headerDivider?: boolean;        // renders a divider between header and body
  header?: React.ReactNode;       // slotted via a `header` prop, not children
  footer?: React.ReactNode;       // slotted via a `footer` prop, not children
  children: React.ReactNode;
}
```

The `elevated` variant uses `--color-bg-elevated` for the surface and adds a hairline border. Shadows alone cannot define elevation in dark mode, so the border carries the edge while the shadow plus the `bg-elevated` step convey depth.

### 5.8 Dialog

```ts
type DialogWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface DialogProps {
  open: boolean;                  // mirrors two-way [(open)]
  onOpenChange: (open: boolean) => void;
  width?: DialogWidth;            // default 'md'; width preset for the panel
  closeOnBackdrop?: boolean;      // default true
  closeOnEscape?: boolean;        // default true
  showClose?: boolean;            // default true
  id?: string;                    // exposed for external aria-labelledby/aria-controls
  'aria-label'?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  onOpened?: () => void;          // mirrors `opened`
  onClosed?: () => void;          // mirrors `closed`
}
```

Build on the native `<dialog>` element with `showModal()` to inherit focus trap and inert backdrop. When the dialog closes, return focus to the element that opened it. When no `aria-label` is provided, derive `aria-labelledby` from the slotted header.

### 5.9 Drawer

```ts
// 'start' / 'end' are direction-aware (map to left/right per the active `dir`).
type DrawerPosition = 'left' | 'right' | 'top' | 'bottom' | 'start' | 'end';
type DrawerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
type DrawerMode = 'overlay' | 'push';
type DrawerAnimation = 'none' | 'linear' | 'eased';

interface DrawerProps {
  open: boolean;                  // mirrors two-way [(open)]
  onOpenChange: (open: boolean) => void;
  position?: DrawerPosition;      // default 'right'; edge the drawer slides in from
  size?: DrawerSize;              // default 'md'; extent along the main axis (width for side, height for top/bottom)
  mode?: DrawerMode;              // default 'overlay'; 'push' opens non-modally and reflows page content aside
  pushTarget?: string | HTMLElement | null; // default null; element pushed aside in push mode (CSS selector or ref), defaults to document body
  animation?: DrawerAnimation;    // default 'eased'; 'none' is instant, 'linear' constant speed, 'eased' an ease-out curve
  closeOnBackdrop?: boolean;      // default true
  closeOnEscape?: boolean;        // default true
  showClose?: boolean;            // default true
  id?: string;
  'aria-label'?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  onOpened?: () => void;          // mirrors `opened`
  onClosed?: () => void;          // mirrors `closed`
}
```

There is no `width` prop (the axis extent is the single `size` input) and no boolean `animated` prop (use `animation`). In `overlay` mode the drawer floats over a dimmed, focus-trapped page with the same `<dialog>`-based construction and focus-restore behavior as Dialog; in `push` mode it opens non-modally and shifts the `pushTarget` content aside instead of trapping focus.

### 5.10 SelectOption

The same `SelectOption` shape is reused by every single-select control in the system (Dropdown, Autocomplete, Segmented). Define it once and import it.

```ts
interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}
```

### 5.11 Dropdown

```ts
interface DropdownProps<T extends string> {
  options: SelectOption<T>[];
  value: T | '';
  onChange: (value: T) => void;   // mirrors `changed`
  label?: string;
  placeholder?: string;
  hint?: string;
  errorMsg?: string;
  size?: Size;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  id?: string;
}
```

**Keyboard:** ArrowUp/Down to navigate, Enter/Space to select, Escape to close. The trigger must expose `aria-controls`, `aria-activedescendant`, `aria-haspopup="listbox"`, and `aria-invalid` / `aria-describedby` when error/hint are set. Position the listbox with `position: fixed` anchored to the trigger so it escapes overflow-hidden ancestors, and allow it to grow wider than the trigger.

### 5.12 Autocomplete

```ts
interface AutocompleteProps {
  value: string;
  onChange: (value: string) => void;      // text changes, mirrors `changed`
  onSelected?: (option: SelectOption) => void; // mirrors `selected`
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  hint?: string;
  errorMsg?: string;
  emptyMessage?: string;                  // default uses i18n autocomplete.empty
  minLength?: number;                     // default 0
  maxResults?: number;                    // default 10
  size?: Size;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  id?: string;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
}
```

The input must declare `aria-haspopup="listbox"` and `aria-autocomplete="list"`.

### 5.13 Segmented

```ts
interface SegmentedProps<T extends string> {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  hint?: string;
  errorMsg?: string;
  size?: Size;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  'aria-label'?: string;
  id?: string;
}
```

Arrow-key navigation across segments. Selected segment uses an elevated "pill" with `--shadow-sm`.

### 5.14 Slider

```ts
interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;                   // default 0
  max?: number;                   // default 100
  step?: number;                  // default 1
  label?: string;
  hint?: string;
  errorMsg?: string;
  size?: Size;
  disabled?: boolean;
  required?: boolean;
  showValue?: boolean;            // default false
  showMinMaxLabels?: boolean;     // default false
  formatValue?: (value: number) => string;
  'aria-label'?: string;
  id?: string;
}
```

Keyboard: arrows, PageUp/PageDown, Home/End. Pointer drag.

### 5.15 DatePicker

```ts
type DatePickerFormat = 'short' | 'medium' | 'long';
type DatePickerWeekStart = 0 | 1;

interface DatePickerProps {
  value: Date | null;
  onChange: (value: Date | null) => void;
  label?: string;
  placeholder?: string;
  hint?: string;
  errorMsg?: string;
  size?: Size;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  minDate?: Date | null;
  maxDate?: Date | null;
  format?: DatePickerFormat;      // default 'medium'
  weekStartsOn?: DatePickerWeekStart; // default 1 (Monday)
  locale?: string;                // overrides the EagamiI18nProvider locale
  id?: string;
}
```

Calendar grid receives focus on open. Keyboard: arrows, PageUp/PageDown, Home/End, Enter, Escape. The clear button must be a sibling of the trigger, not nested inside it.

### 5.16 CodeInput

```ts
interface CodeInputProps {
  value: string;                  // default ''; mirrors two-way [(value)]
  onChange: (value: string) => void;
  onCompleted?: (value: string) => void; // mirrors `completed`
  length?: number;                // default 6
  allowAllChars?: boolean;        // default false; when off only digits are accepted
  label?: string;
  placeholder?: string;
  hint?: string;
  errorMsg?: string;
  size?: Size;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  id?: string;
}
```

Each digit slot is an individual `<input>`. The group needs an accessible name derived from `codeInput.groupLabel(length)` (see section 6); each digit gets `codeInput.digitLabel(index, length)` and reflects `aria-invalid` when the group has an error.

### 5.17 DataTable

```ts
type DataTableDensity = 'compact' | 'comfortable' | 'spacious';
type DataTableSortDirection = 'asc' | 'desc' | null;

interface DataTableColumn<T = Record<string, unknown>> {
  key: string;
  label: string;                  // header text ('label' upstream, not 'header')
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  format?: (value: unknown) => string;   // format a raw cell value to a string
  cell?: (row: T) => React.ReactNode;    // full custom cell render (mirrors cellTemplate)
}

interface DataTableSortState {
  column: string;                 // sorted column key ('' when none)
  direction: DataTableSortDirection;
}

interface DataTableProps<T = Record<string, unknown>> {
  columns: DataTableColumn<T>[];  // required
  data: T[];                      // required
  trackBy?: keyof T;
  density?: DataTableDensity;     // default 'comfortable'
  stickyHeader?: boolean;         // default false
  striped?: boolean;              // default false
  hoverable?: boolean;            // default true
  bordered?: boolean;             // default false
  clickable?: boolean;            // default false; pointer cursor + emits rowActivate on click/Enter/Space
  navigable?: boolean;            // default false; keyboard-navigable grid with roving focus and arrow-key cell movement
  noDataText?: string;            // default uses i18n dataTable.noData
  sort?: DataTableSortState;      // default { column: '', direction: null }; mirrors two-way [(sort)]
  onSortChange?: (sort: DataTableSortState) => void; // mirrors `sorted`
  onRowActivate?: (row: T) => void;      // mirrors `rowActivate`; fires when a clickable row is activated
  children?: React.ReactNode;     // optional <Paginator/> footer slot
}
```

Use native `<table>` semantics with `scope="col"` headers; sortable headers use the implicit `<th>` role plus `aria-sort`. Horizontal scrolling must wrap only the table itself so a slotted paginator stays outside the scrolled coordinate space.

### 5.18 Paginator

```ts
type PaginatorAlign = 'left' | 'center' | 'right';

interface PaginatorState {
  page: number;
  pageSize: number;
}

interface PaginatorProps {
  totalItems: number;                     // required; total item count used to compute the page count
  page: number;                           // mirrors two-way [(page)]; default 1
  pageSize: number;                       // mirrors two-way [(pageSize)]; default 10
  onChange: (state: PaginatorState) => void; // mirrors `changed`
  pageSizeOptions?: number[];             // default [10, 25, 50, 100]
  showPageSizeSelector?: boolean;         // default true
  showRangeLabel?: boolean;               // default true
  groupThousands?: boolean;               // default true; comma-group thousands in range/page numbers
  size?: Size;                            // default 'md'
  align?: PaginatorAlign;                 // default 'right'
  disabled?: boolean;
}
```

### 5.19 Tabs

```ts
type TabsVariant = 'underline' | 'filled';

interface TabsProps {
  activeTab: string;
  onChange: (id: string) => void;
  variant?: TabsVariant;          // default 'underline'
  size?: Size;
  children: React.ReactNode;      // <Tab id="..." label="..."> children
}

interface TabProps {
  id: string;
  label: string;
  disabled?: boolean;
  children?: React.ReactNode;     // panel content
}
```

Each panel is linked to its tab button via `aria-controls` / `aria-labelledby` and is keyboard-focusable.

### 5.20 Accordion

```ts
interface AccordionProps {
  allowMultiple?: boolean;        // default false
  children: React.ReactNode;      // <AccordionItem> children
}

interface AccordionItemProps {
  id: string;
  title: React.ReactNode;
  expanded?: boolean;             // controlled
  onChange?: (expanded: boolean) => void;
  disabled?: boolean;
  children: React.ReactNode;
}
```

Trigger and panel must be linked via `aria-controls` / `aria-labelledby`.

### 5.21 Breadcrumbs

```ts
type BreadcrumbsSeparator = 'chevron' | 'slash';

interface BreadcrumbItem {
  label: string;
  href?: string;
  disabled?: boolean;
}

interface BreadcrumbClickEvent {
  item: BreadcrumbItem;
  index: number;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: BreadcrumbsSeparator; // default 'chevron'
  onClick?: (event: BreadcrumbClickEvent) => void; // mirrors `clicked`
  'aria-label'?: string;          // default uses i18n breadcrumbs.label
}
```

The last item is rendered as the current page automatically.

### 5.22 Menu (with MenuTrigger)

Unlike most components, the menu trigger is a separate concern. Apply a `MenuTrigger` wrapper / hook to your own button rather than passing it via children. The trigger receives `aria-haspopup`, `aria-expanded`, `aria-controls`. The popup uses `position: fixed` so it escapes overflow-clipping ancestors.

```ts
type MenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

interface MenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  placement?: MenuPlacement;      // default 'bottom-start'
  disabled?: boolean;
  id?: string;
  'aria-label'?: string;
  children: React.ReactNode;      // <MenuItem> children
}

interface MenuItemProps {
  disabled?: boolean;
  onClick?: () => void;           // mirrors `clicked`
  children: React.ReactNode;
}
```

Roving keyboard navigation across items: arrow keys, Home/End, focus the first item on open.

### 5.23 Alert

```ts
type AlertVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface AlertProps {
  variant?: AlertVariant;         // default 'default'
  size?: Size;                    // default 'md'
  dismissible?: boolean;          // default false
  visible?: boolean;              // controlled visibility; default true
  icon?: React.ComponentType;     // overrides the default per-variant status icon
  onDismiss?: () => void;         // mirrors `dismissed`
  children: React.ReactNode;
}
```

The decorative status icon is hidden from assistive technology. `error` and `warning` variants use `role="alert"`; the others use `role="status"` with a polite live region.

### 5.24 Toast

```ts
type ToastVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
type ToastPosition =
  | 'top-left' | 'top' | 'top-right'
  | 'bottom-left' | 'bottom' | 'bottom-right';

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
  duration: number;
}

interface ToastOptions {
  variant?: ToastVariant;
  duration?: number;              // default 4000 ms; pass 0 to disable auto-dismiss
}

// One <ToastOutlet /> must be mounted somewhere in the tree.
interface ToastOutletProps {
  position?: ToastPosition;       // default 'bottom-right'; corner or edge the stack is pinned to
  clearable?: boolean;            // default true; shows a dismiss button on each toast
}

interface ToastApi {
  show(message: string, options?: ToastOptions): number;
  success(message: string, duration?: number): number;
  error(message: string, duration?: number): number;
  warning(message: string, duration?: number): number;
  info(message: string, duration?: number): number;
  dismiss(id: number): void;
  clear(): void;                  // dismisses every active toast
}

// Recommended API:
//   const toast = useToast();
//   toast.success('Saved');
```

The slide-in animation degrades to an opacity-only fade under `prefers-reduced-motion`. In dark mode, the colored variants must stack the tint over an opaque `--color-bg-elevated` base so they do not bleed through underlying page content. Use the lighter `*-200` text shade in dark mode for legibility.

### 5.25 Tooltip

```ts
type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  content: React.ReactNode;       // required; 'eaTooltip' upstream
  position?: TooltipPosition;     // default 'top'; 'tooltipPosition' upstream
  maxWidth?: number;              // px; default 200
  children: React.ReactElement;   // the trigger element
}
```

The popover uses `role="tooltip"` and dismisses on Escape. Append to (do not overwrite) the trigger's `aria-describedby`. Suppress hover-triggered tooltips on touch devices via a `(hover: hover)` media query subscription; keep focus/blur listeners always attached.

### 5.26 Tag

```ts
type TagVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface TagProps {
  variant?: TagVariant;           // default 'default'
  size?: Size;
  removable?: boolean;            // default false
  disabled?: boolean;
  removeLabel?: string;           // per-tag override for the remove-button accessible name
  onRemove?: () => void;          // mirrors `removed`
  children: React.ReactNode;
}
```

There is no `primary` variant; tags are reserved for semantic statuses. For brand-coloured chips, use `Badge` or a styled element.

### 5.27 Badge

```ts
type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
type BadgeShape = 'pill' | 'pin';

interface BadgeProps {
  variant?: BadgeVariant;         // default 'default'
  size?: Size;                    // default 'md'
  shape?: BadgeShape;             // default 'pill'
  children: React.ReactNode;
}
```

### 5.28 Avatar

```ts
interface AvatarProps {
  src?: string;
  alt?: string;                   // default ''
  initials?: string;              // used as the accessible name when `alt` is empty
  size?: Size;                    // default 'md'
  shape?: 'circle' | 'square';    // default 'circle'
}
```

### 5.29 AvatarEditor

```ts
type AvatarEditorShape = 'circle' | 'square';

interface AvatarEditorCropState {
  x: number;
  y: number;
  zoom: number;
}

interface AvatarEditorCropEvent {
  blob: Blob;
  dataUrl: string;
  state: AvatarEditorCropState;
}

interface AvatarEditorProps {
  shape?: AvatarEditorShape;      // default 'circle'
  canvasSize?: number;            // default 200 (px)
  currentSrc?: string;
  loading?: boolean;
  accept?: string;                // default 'image/*'
  maxFileSize?: number;           // default 5 * 1024 * 1024
  minZoom?: number;               // default 1
  maxZoom?: number;               // default 3
  exportQuality?: number;         // default 0.92
  exportType?: string;            // default 'image/png'
  cropState?: AvatarEditorCropState | null;
  onCropped?: (e: AvatarEditorCropEvent) => void;
  onFileSelected?: (file: File) => void;
  onRemoved?: () => void;
  onErrored?: (message: string) => void;
  onCropStateChanged?: (state: AvatarEditorCropState) => void;
}
```

Canvas is keyboard-pannable (arrow keys, Shift for larger steps; `+`/`-` to zoom) and exposes a descriptive `aria-label`. The "Change photo" hover overlay picks white or black ink based on the loaded photo's average luminance, not the active theme.

### 5.30 EmptyState

```ts
type EmptyStateHeadingLevel = 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface EmptyStateProps {
  title?: string;
  description?: string;
  size?: Size;                    // default 'md'
  headingLevel?: EmptyStateHeadingLevel; // default 'h2'
  bordered?: boolean;             // default false; draws a dashed container border
  icon?: React.ComponentType;     // convenience icon rendered above the title
  media?: React.ReactNode;        // 'media' slot: icon, illustration, etc.
  actions?: React.ReactNode;      // 'actions' slot: CTA buttons
}
```

### 5.31 Skeleton

```ts
type SkeletonVariant = 'text' | 'circle' | 'rect';

interface SkeletonProps {
  variant?: SkeletonVariant;      // default 'text'
  width?: string;                 // CSS length, e.g. '12rem' or '100%'
  height?: string;
  animated?: boolean;             // default true
}
```

### 5.32 ProgressBar, Spinner, Divider, EagamiWordmark

- **ProgressBar:** `value?: number = 0`, `max?: number = 100`, `variant?: 'default' | 'success' | 'warning' | 'error' | 'info'` (default `'default'`), `size?: Size` (default `'md'`), `label?: string` (default `undefined`), `showPercentage?: boolean` (default `false`), `indeterminate?: boolean` (default `false`). Exposes `aria-busy` while indeterminate.
- **Spinner:** `size?: Size` (default `'md'`), `label?: string` (accessible name for the busy state). Honors `prefers-reduced-motion` by slowing the spin rather than disabling it.
- **Divider:** `orientation?: 'horizontal' | 'vertical'` (default `'horizontal'`), `label?: string`, `thick?: boolean` (default `false`).
- **EagamiWordmark:** `variant?: 'default' | 'byline' | 'tagline'` (default `'default'`), `layout?: 'stacked' | 'inline'` (default `'stacked'`), `size?: number` (font size in px of the brand text, from which the rest of the lockup scales; default `24`), `linked?: boolean` (default `true`; false renders without the built-in eagami.com link for embedding in a custom link). Use for branded eagami pages only.

### 5.33 Icon

The library ships a single-color icon set (mostly Feather-derived under the MIT licence, plus original eagami additions and a small coloured brand-icon set for nominative use). In React, expose them as named components in an `eagami-icons` module, each accepting:

```ts
interface IconProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number | string;         // default 24
  color?: string;                 // default 'currentColor'
}
```

Single-color brand icons (`GithubIcon`, `FacebookIcon`, `XTwitterIcon`, `MicrosoftIcon`, `GoogleIcon`) default to `currentColor` so they inherit surrounding text color. Pass `brand` to opt back in to the original brand color.

<!-- eagami:generated:react-icons start -->

The full icon set (411 icons). Single-color icons: `Activity`, `Airplay`, `AlertCircle`, `AlertOctagon`, `AlertTriangle`, `AlignCenter`, `AlignJustify`, `AlignLeft`, `AlignRight`, `Anchor`, `Aperture`, `Archive`, `ArrowDown`, `ArrowDownCircle`, `ArrowDownLeft`, `ArrowDownRight`, `ArrowLeft`, `ArrowLeftCircle`, `ArrowRight`, `ArrowRightCircle`, `ArrowUp`, `ArrowUpCircle`, `ArrowUpLeft`, `ArrowUpRight`, `AspectRatio`, `AtSign`, `Award`, `BadgeCheck`, `BarChart`, `BarChart2`, `Battery`, `BatteryCharging`, `Bell`, `BellOff`, `BellRing`, `Bitcoin`, `Bluetooth`, `Bold`, `Book`, `BookOpen`, `Bookmark`, `BookmarkCheck`, `BookmarkPlus`, `Bot`, `Bottle`, `Box`, `Brain`, `Briefcase`, `Bug`, `Building`, `Calculator`, `Calendar`, `CalendarCheck`, `CalendarDays`, `Camera`, `CameraOff`, `Candle`, `Cast`, `Check`, `CheckCircle`, `CheckSquare`, `ChevronDown`, `ChevronLeft`, `ChevronRight`, `ChevronUp`, `ChevronsDown`, `ChevronsLeft`, `ChevronsRight`, `ChevronsUp`, `ChevronsUpDown`, `Circle`, `Clapperboard`, `Clipboard`, `ClipboardCheck`, `ClipboardList`, `Clock`, `Cloud`, `CloudDrizzle`, `CloudLightning`, `CloudOff`, `CloudRain`, `CloudSnow`, `Code`, `Coffee`, `Coins`, `Columns`, `Command`, `Compass`, `Contrast`, `Copy`, `CornerDownLeft`, `CornerDownRight`, `CornerLeftDown`, `CornerLeftUp`, `CornerRightDown`, `CornerRightUp`, `CornerUpLeft`, `CornerUpRight`, `Cpu`, `CreditCard`, `Crop`, `Crosshair`, `Database`, `Delete`, `Disc`, `Divide`, `DivideCircle`, `DivideSquare`, `DollarSign`, `Download`, `DownloadCloud`, `Droplet`, `Edit`, `Edit2`, `Edit3`, `ExternalLink`, `Eye`, `EyeOff`, `FastForward`, `Feather`, `File`, `FileAudio`, `FileCheck`, `FileImage`, `FileMinus`, `FilePdf`, `FilePlus`, `FileText`, `FileVideo`, `Film`, `Filter`, `FilterX`, `Fingerprint`, `Flag`, `Flame`, `Folder`, `FolderMinus`, `FolderOpen`, `FolderPlus`, `Frown`, `Gauge`, `Gift`, `GitBranch`, `GitCommit`, `GitCompare`, `GitMerge`, `GitPullRequest`, `Globe`, `Grid`, `HalfCircle`, `HalfHeart`, `HardDrive`, `Hash`, `Headphones`, `Heart`, `HelpCircle`, `Heptagon`, `Hexagon`, `History`, `Home`, `Image`, `ImagePlus`, `ImageSearch`, `Images`, `Inbox`, `Info`, `Italic`, `Key`, `Keyboard`, `Keyframe`, `Lamp`, `Languages`, `Layers`, `Layout`, `Leaf`, `LeftHalfStar`, `LifeBuoy`, `Lightbulb`, `Link`, `Link2`, `List`, `ListChecks`, `Loader`, `Lock`, `LogIn`, `LogOut`, `Mail`, `MailCheck`, `Map`, `MapPin`, `Maximize`, `Maximize2`, `Megaphone`, `Meh`, `Menu`, `MessageCircle`, `MessageSquare`, `Mic`, `MicOff`, `Microscope`, `Minimize`, `Minimize2`, `Minus`, `MinusCircle`, `MinusSquare`, `Monitor`, `Moon`, `MoreHorizontal`, `MoreVertical`, `MousePointer`, `Move`, `Music`, `Navigation`, `Navigation2`, `Octagon`, `Package`, `Palette`, `Paperclip`, `Pause`, `PauseCircle`, `PenTool`, `Pentagon`, `Percent`, `Phone`, `PhoneCall`, `PhoneForwarded`, `PhoneIncoming`, `PhoneMissed`, `PhoneOff`, `PhoneOutgoing`, `PictureInPicture`, `PieChart`, `Pin`, `Play`, `PlayCircle`, `Playlist`, `Plug`, `Plus`, `PlusCircle`, `PlusSquare`, `Pocket`, `Power`, `Printer`, `QrCode`, `Radio`, `Receipt`, `Record`, `RectangleHorizontal`, `RectangleVertical`, `Redo`, `RefreshCcw`, `RefreshCw`, `Repeat`, `Rewind`, `RightHalfStar`, `Rocket`, `RotateCcw`, `RotateCcwSquare`, `RotateCw`, `Rows`, `Rss`, `Save`, `Scan`, `Scissors`, `Search`, `Send`, `Server`, `Settings`, `Share`, `Shield`, `ShieldCheck`, `ShieldOff`, `ShoppingBag`, `ShoppingCart`, `Shuffle`, `Sidebar`, `SkipBack`, `SkipForward`, `Slash`, `Sliders`, `Smartphone`, `Smile`, `Snowflake`, `SoccerBall`, `Sparkles`, `Speaker`, `Square`, `Star`, `StopCircle`, `Subtitles`, `Sun`, `Sunrise`, `Sunset`, `Table`, `Tablet`, `Tag`, `Target`, `Terminal`, `Thermometer`, `ThumbsDown`, `ThumbsUp`, `Timecode`, `Timer`, `ToggleLeft`, `ToggleRight`, `Tool`, `Transcode`, `Trash`, `Trash2`, `TrendingDown`, `TrendingUp`, `Triangle`, `Trim`, `Trophy`, `Truck`, `Tv`, `Type`, `Umbrella`, `Underline`, `Undo`, `Unlock`, `Upload`, `UploadCloud`, `User`, `UserCheck`, `UserMinus`, `UserPlus`, `UserX`, `Users`, `Video`, `VideoOff`, `Voicemail`, `Volume`, `Volume1`, `Volume2`, `VolumeX`, `Wallet`, `Wand`, `Watch`, `Waveform`, `Wifi`, `WifiOff`, `Wind`, `X`, `XCircle`, `XOctagon`, `XSquare`, `Zap`, `ZapOff`, `ZoomIn`, `ZoomOut`.

Brand marks (flagged `isBrand` upstream): `Android`, `Angular`, `Anthropic`, `Bluesky`, `Chrome`, `Cloudflare`, `Codepen`, `Codesandbox`, `Discord`, `Docker`, `Dribbble`, `Dropbox`, `Eagami`, `Facebook`, `Facebook2`, `Figma`, `Figma2`, `Framer`, `Gemini`, `Github`, `Github2`, `Gitlab`, `Google`, `Instagram`, `Kubernetes`, `Linkedin`, `Linkedin2`, `Mastercard`, `Microsoft`, `Mongodb`, `Netlify`, `Nodejs`, `Notion`, `Npm`, `Paypal`, `Pinterest`, `Python`, `React`, `Reddit`, `Shopify`, `Slack`, `Slack2`, `Spotify`, `Stripe`, `Svelte`, `Tailwind`, `Telegram`, `Threads`, `Tiktok`, `Trello`, `Twitch`, `Twitch2`, `Twitter`, `Vercel`, `Vue`, `Whatsapp`, `Wordpress`, `XTwitter`, `Youtube`, `Youtube2`.

<!-- eagami:generated:react-icons end -->

### 5.34 ColorPicker

```ts
type ColorPickerFormat = 'hex' | 'rgb' | 'hsl' | 'all';

interface ColorPickerProps {
  value: string | null;             // default null; current color string, mirrors two-way [(value)]
  onChange: (value: string | null) => void; // mirrors `changed`
  format?: ColorPickerFormat;       // default 'all'; output format of the emitted color value
  presets?: readonly string[];      // default DEFAULT_PRESETS; preset swatches, pass [] to hide them
  showAlpha?: boolean;              // default true; shows the alpha slider and includes alpha in the value
  label?: string;
  placeholder?: string;             // shown on the trigger while no color is selected
  hint?: string;
  errorMsg?: string;
  size?: Size;                      // default 'md'
  disabled?: boolean;
  readOnly?: boolean;               // 'readonly' upstream; keeps the popover from opening
  required?: boolean;
  id?: string;
}
```

The trigger opens a popover swatch/slider picker built on the shared Popover primitive (see 5.38). An eyedropper control is offered where the browser supports the EyeDropper API; the hex/RGB input row can be cycled between modes.

### 5.35 CommandPalette

```ts
interface CommandPaletteItem<T = unknown> {
  id: string;                       // stable id used for tracking and aria-activedescendant
  label: string;
  description?: string;             // secondary text rendered below the label
  icon?: React.ComponentType;       // leading icon component
  shortcut?: string;                // decorative keyboard-shortcut hint on the right edge
  group?: string;                   // section heading; ungrouped items render first
  disabled?: boolean;
  keywords?: readonly string[];     // extra hidden search terms
  data?: T;                         // arbitrary payload passed through to onExecute
}

interface CommandPaletteProps {
  items: readonly CommandPaletteItem[]; // required
  open: boolean;                    // mirrors two-way [(open)]
  onOpenChange: (open: boolean) => void;
  onExecute: (item: CommandPaletteItem) => void; // 'execute' upstream; fires with the chosen item
  placeholder?: string;             // default ''; search input placeholder
  emptyMessage?: string;            // default uses i18n; shown when the query matches no items
}
```

A modal search dialog: type to filter, arrow keys to move the active row, Enter to execute. The palette does not bind global shortcuts (`shortcut` is display-only); the consumer wires those.

### 5.36 FileUploader

```ts
type FileUploaderRejectionReason = 'type' | 'size' | 'count';

interface FileUploaderRejection {
  file: File;
  reason: FileUploaderRejectionReason;
}

interface FileUploaderProps {
  value: readonly File[];           // default []; current file list, mirrors two-way [(value)]
  onChange: (value: readonly File[]) => void;
  onFileRemoved?: (file: File) => void;   // mirrors `fileRemoved`
  onRejected?: (rejections: readonly FileUploaderRejection[]) => void; // mirrors `rejected`
  accept?: string;                  // comma-separated MIME types / extensions, e.g. 'image/*,.pdf'
  multiple?: boolean;               // default true
  maxFiles?: number;                // files beyond the limit are rejected
  maxSize?: number;                 // max size per file in bytes; larger files are rejected
  showFileList?: boolean;           // default true; renders the selected-file list below the dropzone
  progress?: ReadonlyMap<File, number>; // per-file upload progress (0-100), keyed by File; omit to hide bars
  label?: string;
  hint?: string;
  errorMsg?: string;
  size?: Size;                      // default 'md'
  disabled?: boolean;
  required?: boolean;
  id?: string;
}
```

Pure UI: the component validates and lists files but does not perform the upload. Drive progress bars by feeding back a `progress` map keyed by `File` identity.

### 5.37 MultiSelect

Reuses the shared `SelectOption` shape (see 5.10). Selection is by option `value`, and the current value is a plain string array.

```ts
interface MultiSelectProps {
  options: readonly SelectOption[]; // default []
  value: readonly string[];         // default []; selected option values, mirrors two-way [(value)]
  onChange: (value: readonly string[]) => void; // mirrors `changed`
  label?: string;
  placeholder?: string;             // shown on the trigger while nothing is selected
  hint?: string;
  errorMsg?: string;
  size?: Size;                      // default 'md'
  disabled?: boolean;
  readOnly?: boolean;               // 'readonly' upstream
  required?: boolean;
  searchable?: boolean;             // default true; shows a search input at the top of the popover
  searchPlaceholder?: string;
  selectAll?: boolean;              // default true; shows the tri-state select-all row
  maxVisibleChips?: number;         // default 0 (no limit); chips past this collapse into a count pill
  id?: string;
}
```

Selected options render as removable chips in the trigger; the popover list (built on Popover, see 5.38) supports keyboard navigation, a tri-state select-all, and optional filtering.

### 5.38 Popover

The low-level positioning primitive that Menu, Dropdown, MultiSelect, ColorPicker, and TimePicker build on. It anchors a floating surface to a host element with `position: fixed` so it escapes overflow-clipping ancestors. Unlike the higher-level overlays, `open` here is one-way: the popover emits a close request and the parent mirrors it back into `open`.

```ts
type PopoverPlacement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'right';
type PopoverRole = 'menu' | 'listbox' | 'dialog' | 'tooltip' | 'grid';
type PopoverScrollBehavior = 'reposition' | 'close' | 'ignore';

interface PopoverProps {
  anchor: HTMLElement | React.RefObject<HTMLElement>; // required; element the popover positions against
  open: boolean;                    // default false
  onCloseRequested: () => void;     // mirrors `closeRequested`; parent mirrors this into `open`
  placement?: PopoverPlacement;     // default 'bottom-start'
  role?: PopoverRole;               // default 'dialog'
  offset?: number;                  // default 2; gap in px between anchor and surface
  flip?: boolean;                   // default true; flips to the opposite side when the placement overflows
  clamp?: boolean;                  // default true; clamps the surface inside the viewport
  matchAnchorWidth?: boolean;       // default false; sets min-width to match the anchor
  closeOnEscape?: boolean;          // default true
  closeOnOutsideClick?: boolean;    // default true
  scrollBehavior?: PopoverScrollBehavior; // default 'reposition'; response to scroll/resize while open
  surfaceId?: string;               // id for the surface, referenced by triggers via aria-controls
  'aria-label'?: string;            // name the surface when it has no visible heading
  children: React.ReactNode;
}
```

### 5.39 RangeSlider

```ts
type RangeSliderValue = readonly [number, number]; // [low, high]

interface RangeSliderProps {
  value: RangeSliderValue;          // default [0, 100]; mirrors two-way [(value)]
  onChange: (value: RangeSliderValue) => void; // mirrors `changed`
  min?: number;                     // default 0
  max?: number;                     // default 100
  step?: number;                    // default 1; increment each thumb snaps to
  label?: string;
  hint?: string;
  errorMsg?: string;
  size?: Size;                      // default 'md'
  disabled?: boolean;
  required?: boolean;
  showValue?: boolean;              // default false; shows the current low and high values
  showMinMaxLabels?: boolean;       // default false; shows the bounds at the ends of the track
  groupThousands?: boolean;         // default true; ignored when formatValue is provided
  formatValue?: (value: number) => string; // applied to each value before display
  ariaLabelLow?: string;            // accessible name for the low thumb; falls back to the field label
  ariaLabelHigh?: string;           // accessible name for the high thumb; falls back to the field label
  id?: string;
}
```

Two thumbs share a single track; the low thumb cannot cross above the high thumb and vice versa. Keyboard: arrows, PageUp/PageDown, Home/End per thumb.

### 5.40 Rating

```ts
interface RatingProps {
  value: number;                    // default 0; mirrors two-way [(value)]
  onChange: (value: number) => void;
  onHoverChange?: (value: number | null) => void; // 'hoverChanged'; previewed value, null on leave
  min?: number;                     // default 0; lowest value the user can select
  max?: number;                     // default 5; highest value and the number of icons rendered
  allowHalf?: boolean;              // default false; enables 0.5 increments
  clearable?: boolean;              // default true; clicking the current value clears back to 0
  icon?: React.ComponentType;       // 'iconClass' upstream; icon for empty and full positions (default Star)
  halfIcon?: React.ComponentType;   // 'halfIconClass' upstream; icon for half positions when allowHalf
  label?: string;
  hint?: string;
  errorMsg?: string;
  size?: Size;                      // default 'md'
  disabled?: boolean;
  readOnly?: boolean;               // 'readonly' upstream; display-only, ignores input
  required?: boolean;
  id?: string;
}
```

### 5.41 Stepper (with Step)

```ts
interface StepperProps {
  activeStep: number;               // default 0; zero-based index, mirrors two-way [(activeStep)]
  onChange: (index: number) => void; // mirrors `changed`
  linear?: boolean;                 // default false; require each non-optional step completed before advancing
  size?: Size;                      // default 'md'
  disabled?: boolean;
  id?: string;
  children: React.ReactNode;        // <Step> children
}

interface StepProps {
  label: string;                    // required; shown in the step indicator
  completed?: boolean;              // default false; marks the step done, updating its indicator
  optional?: boolean;               // default false; shown as a hint below the label
  disabled?: boolean;
  id?: string;
  children?: React.ReactNode;       // panel content for this step
}
```

In `linear` mode a step is only reachable once every preceding non-optional step is marked `completed`.

### 5.42 TimePicker

```ts
type TimePickerFormat = '12h' | '24h';

interface TimePickerProps {
  value: string | null;             // default null; 'HH:MM' or 'HH:MM:SS' (24-hour wire value), mirrors [(value)]
  onChange: (value: string | null) => void; // mirrors `changed`
  format?: TimePickerFormat;        // default '24h'; display format of the trigger label
  includeSeconds?: boolean;         // default false; shows a seconds column
  minuteStep?: number;              // default 1; increment the minutes column snaps to
  secondStep?: number;              // default 1; increment the seconds column snaps to
  label?: string;
  placeholder?: string;             // shown on the trigger while no time is selected
  hint?: string;
  errorMsg?: string;
  size?: Size;                      // default 'md'
  disabled?: boolean;
  readOnly?: boolean;               // 'readonly' upstream; keeps the popover from opening
  required?: boolean;
  id?: string;
}
```

The wire value is always 24-hour regardless of `format`. The popover exposes typeable spinner columns for each unit, with chevron long-press to step and auto-advance between columns as digits are typed.

### 5.43 TransferList

```ts
interface TransferListItem {
  id: string;
  label: string;
  disabled?: boolean;
}

interface TransferListProps {
  items: readonly TransferListItem[]; // required; full pool across both panes
  selectedIds: readonly string[];   // default []; ids on the target (right) side, mirrors two-way [(selectedIds)]
  onSelectedIdsChange: (ids: readonly string[]) => void;
  sourceLabel?: string;             // heading above the source (left) pane; falls back to i18n
  targetLabel?: string;             // heading above the target (right) pane; falls back to i18n
  size?: Size;                      // default 'md'
  disabled?: boolean;
}
```

Two side-by-side panes with move controls; items in `selectedIds` render in the target pane, the rest in the source pane.

### 5.44 Tree (with TreeNode)

```ts
interface TreeNode<T = unknown> {
  id: string;                       // stable, unique identifier
  label: string;
  children?: readonly TreeNode<T>[]; // omit or empty to render a leaf
  icon?: React.ComponentType;       // leading icon component
  disabled?: boolean;               // skipped by keyboard navigation, cannot be selected
  data?: T;                         // arbitrary payload passed through to onNodeClick
}

interface TreeProps<T = unknown> {
  nodes: readonly TreeNode<T>[];    // required; defines the hierarchy
  selectedId: string | null;        // default null; mirrors two-way [(selectedId)]
  onSelectedIdChange: (id: string | null) => void;
  expandedIds: readonly string[];   // default []; expanded branch ids, mirrors two-way [(expandedIds)]
  onExpandedIdsChange: (ids: readonly string[]) => void;
  onNodeClick?: (node: TreeNode<T>) => void; // mirrors `nodeClick`
  size?: Size;                      // default 'md'; scales text and spacing proportionally
  disabled?: boolean;
  'aria-label'?: string;            // accessible name for the tree widget
}
```

Rendered as a single `role="tree"` widget with roving-tabindex focus, `aria-level` / `aria-posinset` / `aria-setsize` per row, and arrow-key navigation. Individual rows are an internal `TreeNode` sub-component driven from the parent; consumers describe the hierarchy through the `nodes` data, not by composing children.

### 5.45 VirtualList

```ts
interface VirtualListProps<T = unknown> {
  items: readonly T[];              // required; only the visible slice is mounted at a time
  itemHeight: number;               // required; fixed px height shared by every row
  viewportHeight: number;           // required; px height of the scrolling viewport
  overscan?: number;                // default 3; extra rows rendered above/below the visible window
  onScrollIndexChange?: (index: number) => void; // 'scrollIndexChange'; index of the first visible row
  renderItem: (item: T, index: number) => React.ReactNode; // per-row render (Angular uses a template)
}
```

Windows a long list by mounting only the visible rows plus `overscan` padding. All rows must share the same fixed `itemHeight`. Expose an imperative `scrollToIndex(index)` (e.g. via a forwarded ref) that scrolls the row at `index` to the top, clamped to the list bounds.

---

## 6. Internationalization

The Angular library ships built-in strings (ARIA labels, placeholders, empty states, default labels) in fifteen locales and exposes a runtime API to switch and override them. A faithful React port must replicate the same shape so consumer code is transferable.

### 6.1 Supported locales

The library ships fifteen locales. As of v4.0.0 they are **opt-in**: English is always available without registration, and every other locale must be registered (see 6.4) so only the languages you use ship in your bundle. English is the fallback for unregistered locales or missing keys.

```ts
export type EagamiLocale =
  | 'en'
  | 'de'
  | 'es-ES'
  | 'fr-FR'
  | 'is'
  | 'nl'
  | 'pl'
  | 'pt-BR'
  | 'el'
  | 'ru'
  | 'uk'
  | 'he'
  | 'ar'
  | 'hi'
  | 'zh-CN';

export interface EagamiLocaleMeta {
  locale: EagamiLocale;
  label: string; // language's name in its own language
  flag: string; // representative flag emoji
  dir: 'ltr' | 'rtl'; // reading direction, for wiring the `dir` attribute
}

// Display order for a language switcher: English first, then by each
// language's own name. Arabic ('ar') and Hebrew ('he') are the only two
// right-to-left locales; every other locale is 'ltr'.
export const EAGAMI_LOCALE_META: readonly EagamiLocaleMeta[] = [
  { locale: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr' },
  { locale: 'de', label: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { locale: 'es-ES', label: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { locale: 'fr-FR', label: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { locale: 'is', label: 'Íslenska', flag: '🇮🇸', dir: 'ltr' },
  { locale: 'nl', label: 'Nederlands', flag: '🇳🇱', dir: 'ltr' },
  { locale: 'pl', label: 'Polski', flag: '🇵🇱', dir: 'ltr' },
  { locale: 'pt-BR', label: 'Português (Brasil)', flag: '🇧🇷', dir: 'ltr' },
  { locale: 'el', label: 'Ελληνικά', flag: '🇬🇷', dir: 'ltr' },
  { locale: 'ru', label: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  { locale: 'uk', label: 'Українська', flag: '🇺🇦', dir: 'ltr' },
  { locale: 'he', label: 'עברית', flag: '🇮🇱', dir: 'rtl' },
  { locale: 'ar', label: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { locale: 'hi', label: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { locale: 'zh-CN', label: '中文', flag: '🇨🇳', dir: 'ltr' },
];

export const EAGAMI_LOCALES: readonly EagamiLocale[] = EAGAMI_LOCALE_META.map(
  m => m.locale,
);
```

When the active locale's `dir` is `rtl`, set `dir="rtl"` on the app root (or the relevant subtree) so layout mirrors. English is the default and the fallback for unregistered locales or missing keys.

### 6.2 Message dictionary shape

Every user-facing string baked into the library lives in this interface. Parameterized strings are functions so each locale controls its own word order and pluralization.

```ts
export interface EagamiMessages {
  alert: { dismiss: string };
  autocomplete: { empty: string };
  avatarEditor: {
    upload: string;
    dropzone: string;
    canvas: string;
    change: string;
    revert: string;
    zoomOut: string;
    zoom: string;
    zoomIn: string;
    remove: string;
  };
  breadcrumbs: { label: string };
  codeInput: {
    groupLabel: (length: number) => string;
    digitLabel: (index: number, length: number) => string;
  };
  commandPalette: {
    dialogLabel: string;
    searchPlaceholder: string;
    empty: string;
    clear: string;
  };
  colorPicker: {
    placeholder: string;
    clear: string;
    hue: string;
    saturationAndValue: string;
    alpha: string;
    eyedropper: string;
    presets: string;
    toggleFormat: string;
  };
  dataTable: { noData: string };
  datePicker: {
    placeholder: string;
    clear: string;
    previousYear: string;
    previousMonth: string;
    nextMonth: string;
    nextYear: string;
    today: string;
  };
  dialog: { close: string };
  drawer: { close: string };
  dropdown: { placeholder: string };
  fileUploader: {
    prompt: string;
    promptSingle: string;
    browse: string;
    removeFile: (name: string) => string;
    fileListLabel: string;
    constraintsAccept: (accept: string) => string;
    constraintsMaxSize: (size: string) => string;
    constraintsMaxFiles: (count: number) => string;
    rejectionType: (name: string) => string;
    rejectionSize: (name: string, max: string) => string;
    rejectionCount: (max: number) => string;
    bytesUnit: { b: string; kb: string; mb: string; gb: string; tb: string };
  };
  input: { showPassword: string; hidePassword: string; clear: string };
  menu: { label: string };
  multiSelect: {
    placeholder: string;
    searchPlaceholder: string;
    searchEmpty: string;
    selectAll: string;
    clearAll: string;
    removeOption: (label: string) => string;
    selectedCount: (count: number) => string;
  };
  paginator: {
    label: string;
    rowsPerPage: string;
    range: (start: string, end: string, total: string) => string;
    previousPage: string;
    nextPage: string;
  };
  progressBar: { label: string };
  rating: {
    label: string;
    valueLabel: (value: number, max: number) => string;
    clear: string;
  };
  spinner: { label: string };
  stepper: { optional: string };
  tag: { remove: string };
  timePicker: {
    placeholder: string;
    clear: string;
    hoursLabel: string;
    minutesLabel: string;
    secondsLabel: string;
    incrementHours: string;
    decrementHours: string;
    incrementMinutes: string;
    decrementMinutes: string;
    incrementSeconds: string;
    decrementSeconds: string;
    amLabel: string;
    pmLabel: string;
  };
  toast: { dismiss: string };
  transferList: {
    sourceLabel: string;
    targetLabel: string;
    controlsLabel: string;
    moveSelectedToTarget: string;
    moveAllToTarget: string;
    moveSelectedToSource: string;
    moveAllToSource: string;
    empty: string;
  };
  tree: { expand: string; collapse: string };
  validation: {
    required: string;
    email: string;
    min: (min: number) => string;
    max: (max: number) => string;
    minlength: (requiredLength: number) => string;
    maxlength: (requiredLength: number) => string;
    pattern: string;
    invalid: string;
  };
  wordmark: { overline: string; tagline: string };
}

export type EagamiMessagesOverride = {
  [G in keyof EagamiMessages]?: Partial<EagamiMessages[G]>;
};

// A self-identifying locale dictionary. Import the ones you need and register
// them (see 6.4) so only those ship in your bundle; English is always
// available without registration.
export interface EagamiLocaleBundle {
  locale: EagamiLocale;
  messages: EagamiMessages;
}

export interface EagamiI18nConfig {
  locale?: EagamiLocale;                       // default 'en'; falls back to English if not registered
  locales?: readonly EagamiLocaleBundle[];     // dictionaries to make available beyond built-in English
  messages?: EagamiMessagesOverride;           // shallow-merged per group over the active locale
}
```

Ship a `messages` directory with one file per locale (`en.ts`, `de.ts`, `es-ES.ts`, `fr-FR.ts`, `is.ts`, `nl.ts`, `pl.ts`, `pt-BR.ts`, `el.ts`, `ru.ts`, `uk.ts`, `he.ts`, `ar.ts`, `hi.ts`, `zh-CN.ts`), each exporting an `EagamiLocaleBundle` (`{ locale, messages }`). An `index.ts` re-exports every bundle plus an `EAGAMI_ALL_LOCALES: readonly EagamiLocaleBundle[]` array for consumers who want every shipped language at once.

### 6.3 Provider and hook

```tsx
// EagamiI18nProvider.tsx
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type {
  EagamiI18nConfig,
  EagamiLocale,
  EagamiLocaleBundle,
  EagamiMessages,
  EagamiMessagesOverride,
} from './i18n.types';
import { EAGAMI_LOCALE_META } from './i18n.types';
import { en } from './messages';

interface EagamiI18nContextValue {
  locale: EagamiLocale;
  dir: 'ltr' | 'rtl';
  messages: EagamiMessages;
  setLocale: (locale: EagamiLocale) => void;
}

const EagamiI18nContext = createContext<EagamiI18nContextValue | null>(null);

function applyOverrides(base: EagamiMessages, overrides: EagamiMessagesOverride): EagamiMessages {
  const merged = {} as EagamiMessages;
  for (const key of Object.keys(base) as (keyof EagamiMessages)[]) {
    merged[key] = { ...base[key], ...(overrides[key] ?? {}) } as EagamiMessages[never];
  }
  return merged;
}

export function EagamiI18nProvider({
  config = {},
  children,
}: {
  config?: EagamiI18nConfig;
  children: React.ReactNode;
}) {
  // English is always available; the config's `locales` are opt-in extras.
  const registry = useMemo(() => {
    const map = new Map<EagamiLocale, EagamiLocaleBundle>([['en', en]]);
    for (const bundle of config.locales ?? []) map.set(bundle.locale, bundle);
    return map;
  }, [config.locales]);

  const [locale, setLocaleState] = useState<EagamiLocale>(config.locale ?? 'en');

  const setLocale = useCallback(
    (next: EagamiLocale) => setLocaleState(registry.has(next) ? next : 'en'),
    [registry],
  );

  const messages = useMemo(() => {
    const base = (registry.get(locale) ?? en).messages;
    return config.messages ? applyOverrides(base, config.messages) : base;
  }, [registry, locale, config.messages]);

  const dir = useMemo(
    () => EAGAMI_LOCALE_META.find(m => m.locale === locale)?.dir ?? 'ltr',
    [locale],
  );

  const value = useMemo<EagamiI18nContextValue>(
    () => ({ locale, dir, messages, setLocale }),
    [locale, dir, messages, setLocale],
  );

  return <EagamiI18nContext.Provider value={value}>{children}</EagamiI18nContext.Provider>;
}

export function useEagamiI18n(): EagamiI18nContextValue {
  const ctx = useContext(EagamiI18nContext);
  if (!ctx) {
    // Library components must work without a provider; fall back silently.
    return { locale: 'en', dir: 'ltr', messages: en.messages, setLocale: () => {} };
  }
  return ctx;
}
```

### 6.4 Configuring the app

Register only the non-English locales you actually use (English ships by default), so unused languages stay out of your bundle.

```tsx
// main.tsx
import { createRoot } from 'react-dom/client';
import { EagamiI18nProvider } from './theme/EagamiI18nProvider';
import { frFR, el } from './theme/messages';
import App from './App';
import './styles/eagami-tokens.css';

createRoot(document.getElementById('root')!).render(
  <EagamiI18nProvider config={{ locale: 'fr-FR', locales: [frFR, el] }}>
    <App />
  </EagamiI18nProvider>,
);
```

Pass `EAGAMI_ALL_LOCALES` for `locales` to ship every language at once. For right-to-left locales (`ar`, `he`), mirror the `dir` from the hook onto the app root:

```tsx
function AppShell({ children }: { children: React.ReactNode }) {
  const { dir } = useEagamiI18n();
  return <div dir={dir}>{children}</div>;
}
```

### 6.5 Switching locale at runtime

```tsx
import { EAGAMI_LOCALE_META } from './theme/i18n.types';

function LocaleSwitcher() {
  const { locale, setLocale } = useEagamiI18n();
  return (
    <Dropdown
      value={locale}
      onChange={setLocale}
      options={EAGAMI_LOCALE_META.map(m => ({
        value: m.locale,
        label: `${m.flag} ${m.label}`,
      }))}
    />
  );
}
```

Offer only the locales you registered (English plus the `locales` you passed) so the switcher never selects an unavailable language. Changing the locale rerenders every consumer of `useEagamiI18n()`, so all built-in strings flip together; a switch to `ar` or `he` also flips `dir` to `rtl`.

### 6.6 Overriding individual strings

```tsx
<EagamiI18nProvider
  config={{
    locale: 'en',
    messages: {
      paginator: { rowsPerPage: 'Items per page' },
      input: { showPassword: 'Reveal secret' },
    },
  }}
>
  <App />
</EagamiI18nProvider>
```

For one-off overrides at a single call site, accept an explicit prop on the component (`emptyMessage`, `placeholder`, `noDataText`, `removeLabel`, `aria-label`, etc.) and let it win over the i18n value.

### 6.7 Consuming messages inside a component

```tsx
function CloseButton() {
  const { messages } = useEagamiI18n();
  return (
    <IconButton aria-label={messages.dialog.close} onClick={...}>
      <X />
    </IconButton>
  );
}
```

### 6.8 Locale-aware DatePicker formatting

When `locale` is omitted on `DatePicker`, fall back to the active `EagamiI18nProvider` locale and pass it to `Intl.DateTimeFormat` for the visible date label.

```ts
const { locale } = useEagamiI18n();
const formatter = new Intl.DateTimeFormat(props.locale ?? locale, { dateStyle: 'medium' });
```

### 6.9 French spacing helper

French typography requires a narrow non-breaking space (U+202F) before `?` `!` `:` `;` `»` and after `«`. Provide an opt-in helper for consumer-supplied content (user input, CMS strings) destined for a French audience. The library never auto-applies this to inputs; the bundled French messages already contain U+202F.

```ts
const SPACE_BEFORE_HIGH_PUNCT = / ([!?:;»])/g;
const SPACE_AFTER_OPEN_GUILLEMET = /(«) /g;

/**
 * Replace regular ASCII spaces with U+202F where French typography requires
 * "espace fine insécable": before ! ? : ; », and after «. Idempotent.
 *
 * Do not apply to URLs, CSS, JSON, code snippets, or other strings where `:`
 * or `?` carry non-prose meaning.
 *
 * @example
 *   frenchSpacing('Lignes par page :');        // 'Lignes par page :'
 *   frenchSpacing("Qu'est-ce que c'est ?");    // "Qu'est-ce que c'est ?"
 *   frenchSpacing('Il a dit « bonjour ».');    // 'Il a dit « bonjour ».'
 */
export function frenchSpacing(text: string): string {
  return text
    .replace(SPACE_BEFORE_HIGH_PUNCT, ' $1')
    .replace(SPACE_AFTER_OPEN_GUILLEMET, '$1 ');
}
```

---

## 7. Accessibility requirements

The upstream library adheres to WCAG 2.2 Level AA and implements the matching [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/) pattern per widget; see [eagami.com/ui/accessibility](https://eagami.com/ui/accessibility). A React port must preserve that bar: everything below is a requirement, not a suggestion.

- **Semantics:** Use the right element. Buttons are `<button>`, links are `<a href>`, form fields use `<input>` / `<textarea>` / `<select>` with associated `<label>`. Icon-only buttons require `aria-label`.
- **Contrast:** Token combinations pre-tested for WCAG AA:
  - Body text (`--color-text-primary` on `--color-bg-base`): at least 4.5:1.
  - Large text (h1-h4) on `--color-bg-base`: at least 3:1.
  - Links (`--color-text-link` and `--color-text-link-hover`) meet AA against `--color-bg-base` in both light and dark mode, and the rest-to-hover delta is perceptible.
  - Never combine `--color-text-tertiary` with `--color-bg-muted` for body text.
- **Touch targets:** 44x44 px minimum. The `md` and `lg` sizes satisfy this; `sm` is for non-tappable or secondary contexts only.
- **Focus management:** Modal/drawer open -> focus moves inside; close -> focus returns to the element that opened it. Use `inert` on background content while a modal is open.
- **Keyboard:** Every interaction reachable without a mouse. Custom components must implement the standard key conventions (see section 5 notes).
- **Form fields:** Labels must be associated via `htmlFor` / `id` (or by wrapping). Errors must be announced (`aria-invalid` + `aria-describedby` pointing to the error message). Required custom controls must expose `aria-required`.
- **Live regions:** Scope `role="alert"` to `error` and `warning` variants of Alert and Toast. Non-urgent variants use `role="status"` with a polite live region.
- **Tooltips:** Use `role="tooltip"`, append to (do not overwrite) the trigger's `aria-describedby`, dismiss on Escape, and suppress on touch devices via a `(hover: hover)` media query subscription.
- **Reduced motion:** Rely on the provided `--duration-*` tokens; they collapse to 0ms automatically. Do not use literal `200ms` values. Animations that cannot collapse to instant (Spinner, Toast slide-in) must degrade gracefully (slower spin, opacity-only fade).
- **Internationalization:** All built-in ARIA strings come from the i18n dictionary (see section 6). Never hard-code English ARIA values inside a component.

---

## 8. Sync checklist

Every value-bearing part of this file is generated, never hand-edited. In the upstream repo, `pnpm ui sync-guides` (`packages/ui/scripts/sync-integration-guides.mjs`) regenerates all of section 2, the CSS block in section 3.1, the TypeScript module in section 3.2, the frontmatter version and sync date, and the machine-readable token export (`eagami-ui-tokens.json`) straight from the SCSS token source. It also rejects any colour literal in the hand-written sections that is not a current token value. CI fails on drift via `pnpm ui check-tokens`; regenerating is always the whole fix. Never edit the marked generated regions by hand.

When syncing this file with the upstream Angular library, verify the parts the script does not cover:

1. Component API conventions in section 5 match the Angular component signatures in `packages/ui/src/lib/**/*.component.ts`. Cross-check every input, output, type, default, and the past-tense event names (`clicked`, `changed`, `sorted`, `removed`, etc.).
2. The component inventory in section 5 covers every export in `packages/ui/src/public-api.ts`.
3. The i18n shape in section 6 matches `packages/ui/src/lib/i18n/i18n.types.ts`, and the list of locales matches `EAGAMI_LOCALES`.
4. The icon list in section 5.33 matches the icon exports in `public-api.ts`.
5. Prose in sections 1 and 4 (design rules, usage patterns) still describes the current tokens; the script owns values, not narrative.

**For AI agents performing the sync:** diff this file's section 5 and 6 against the TypeScript source of truth and report any discrepancies before editing. Do not regenerate blindly.
