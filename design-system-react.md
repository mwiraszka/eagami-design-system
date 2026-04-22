---
title: Eagami Design System — React Integration
version: 0.11.0
source: '@eagami/ui@0.11.0 — https://github.com/mwiraszka/eagami-design-system'
last-synced: 2026-04-21
audience: human developers and AI coding agents
purpose: >
  Single-file specification for applying the Eagami design system to a React/TypeScript
  codebase without depending on the upstream Angular library. Copy this file into the
  consuming project's docs/ directory. When building or modifying UI in that project,
  follow every rule below and use only the tokens listed here.
---

# Eagami Design System — React Integration

This document is the complete, self-contained specification for applying the Eagami design system to a React project. It contains:

1. Mandatory design rules
2. Full token set (values)
3. Ready-to-paste setup (CSS custom properties + TypeScript constants)
4. Usage patterns (do / don't)
5. Component API conventions
6. Accessibility requirements
7. Sync checklist

**For AI agents:** When building or modifying UI in this project, follow every rule in § 1 and use only the tokens in § 2 (accessed via the CSS file in § 3.1 or the TypeScript module in § 3.2). Do not introduce arbitrary color, spacing, or typography values. If a required token is missing, request an upstream addition rather than hard-coding. The `RULE:` markers below identify invariants that must always hold.

---

## Table of contents

1. [Design rules](#1-design-rules)
2. [Tokens](#2-tokens)
3. [Setup](#3-setup)
4. [Usage patterns](#4-usage-patterns)
5. [Component API conventions](#5-component-api-conventions)
6. [Accessibility requirements](#6-accessibility-requirements)
7. [Sync checklist](#7-sync-checklist)

---

## 1. Design rules

### 1.1 Spacing scale

**RULE:** All padding, margin, and gap values must be drawn from this scale:

`1, 2, 4, 8, 12, 16, 24, 32, 48, 64` (pixels)

Arbitrary values (5, 10, 20, 100, etc.) are forbidden. Prefer the CSS custom properties (`var(--space-1)`, `var(--stack-md)`) or the TypeScript constants (`spacing.s4`, `spacing.stackMd`) over numeric literals.

### 1.2 Colors

**RULE:** Never hard-code color literals (hex, `rgb()`, `rgba()`, `hsl()`, named colors) in component styles. All colors come from CSS custom properties.

- Use **semantic tokens** (`var(--color-text-primary)`, `var(--color-bg-base)`, `var(--color-border-default)`) — not primitives (`var(--color-neutral-900)`).
- Tokens adapt automatically via the `prefers-color-scheme` media query. No manual dark mode logic needed unless you implement a user-overridable toggle (see § 3.4).
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

**RULE:** All tappable targets must be at least 44×44 pixels. Use the component size tokens (`sm` / `md` / `lg`), which are calibrated to meet this (except `sm` which is reserved for non-tappable or secondary contexts).

### 1.7 Component API shape

**RULE:** React components that mirror Eagami components must preserve these prop shapes so behavior is predictable across Angular and React:

| Prop         | Type                          | Notes                                                          |
| ------------ | ----------------------------- | -------------------------------------------------------------- |
| `variant`    | union literal                 | Matches the Angular variant (e.g. `'primary' \| 'secondary' \| 'ghost' \| 'danger'`). |
| `size`       | `'sm' \| 'md' \| 'lg'`        | Default `'md'`.                                                |
| `disabled`   | `boolean`                     | Default `false`.                                               |
| `loading`    | `boolean`                     | Where applicable.                                              |
| `fullWidth`  | `boolean`                     | Where applicable.                                              |
| `value` / `onChange` | controlled pattern    | Pair `value: T` with `onChange: (value: T) => void`.           |

See § 5 for per-component specifics.

---

## 2. Tokens

All values below mirror the CSS custom properties in `src/styles/tokens/*.scss` in the upstream Angular library. Do not edit these tables in isolation — regenerate this file when upstream tokens change (see § 7).

### 2.1 Colors — primitive palette

Use these only if a semantic token is not available. Adding a new semantic is almost always the right move.

#### Primary (brand)

| Token                  | Hex       |
| ---------------------- | --------- |
| `--color-primary-50`   | `#EEF4F8` |
| `--color-primary-100`  | `#D5E5F0` |
| `--color-primary-200`  | `#ACCFE2` |
| `--color-primary-300`  | `#7DB1CE` |
| `--color-primary-400`  | `#628EAD` |
| `--color-primary-500`  | `#3C6C90` |
| `--color-primary-600`  | `#2F567A` |
| `--color-primary-700`  | `#285175` |
| `--color-primary-800`  | `#11365C` |
| `--color-primary-900`  | `#0D2533` |

#### Secondary

| Token                   | Hex       |
| ----------------------- | --------- |
| `--color-secondary-50`  | `#F3F1F7` |
| `--color-secondary-100` | `#E3DEED` |
| `--color-secondary-200` | `#C7BEDB` |
| `--color-secondary-300` | `#A796C3` |
| `--color-secondary-400` | `#7D6A9C` |
| `--color-secondary-500` | `#594B6E` |
| `--color-secondary-600` | `#493D5C` |
| `--color-secondary-700` | `#40374F` |
| `--color-secondary-800` | `#2F2439` |
| `--color-secondary-900` | `#1E1528` |

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

### 2.2 Colors — semantic (light / dark)

In light mode (default) and dark mode (`@media (prefers-color-scheme: dark)`):

| Semantic token                       | Light ref              | Dark ref                 |
| ------------------------------------ | ---------------------- | ------------------------ |
| `--color-text-primary`               | `--color-neutral-900`  | `--color-neutral-50`     |
| `--color-text-secondary`             | `--color-neutral-600`  | `--color-neutral-400`    |
| `--color-text-tertiary`              | `--color-neutral-400`  | `--color-neutral-500`    |
| `--color-text-disabled`              | `--color-neutral-300`  | `--color-neutral-700`    |
| `--color-text-inverse`               | `--color-neutral-0`    | `--color-neutral-900`    |
| `--color-text-link`                  | `--color-primary-600`  | `--color-primary-600`    |
| `--color-text-link-hover`            | `--color-primary-700`  | `--color-primary-700`    |
| `--color-bg-base`                    | `--color-neutral-0`    | `--color-neutral-950`    |
| `--color-bg-subtle`                  | `--color-neutral-50`   | `--color-neutral-900`    |
| `--color-bg-muted`                   | `--color-neutral-100`  | `--color-neutral-800`    |
| `--color-bg-overlay`                 | `rgba(0,0,0,0.5)`      | `rgba(0,0,0,0.5)`        |
| `--color-border-default`             | `--color-neutral-200`  | `--color-neutral-700`    |
| `--color-border-strong`              | `--color-neutral-400`  | `--color-neutral-500`    |
| `--color-border-focus`               | `--color-primary-500`  | `--color-primary-500`    |
| `--color-brand-default`              | `--color-primary-600`  | `--color-primary-400`    |
| `--color-brand-hover`                | `--color-primary-700`  | `--color-primary-300`    |
| `--color-brand-active`               | `--color-primary-800`  | `--color-primary-200`    |
| `--color-brand-subtle`               | `--color-primary-50`   | `rgba(98, 142, 173, 0.1)`|
| `--color-brand-muted`                | `--color-primary-100`  | `rgba(98, 142, 173, 0.2)`|
| `--color-brand-secondary-default`    | `--color-secondary-500`| `--color-secondary-500`  |
| `--color-brand-secondary-hover`      | `--color-secondary-600`| `--color-secondary-600`  |
| `--color-brand-secondary-active`     | `--color-secondary-700`| `--color-secondary-700`  |
| `--color-brand-secondary-subtle`     | `--color-secondary-50` | `--color-secondary-50`   |
| `--color-brand-secondary-muted`      | `--color-secondary-100`| `--color-secondary-100`  |
| `--color-success-default`            | `--color-success-600`  | `--color-success-600`    |
| `--color-success-subtle`             | `--color-success-50`   | `--color-success-50`     |
| `--color-success-muted`              | `--color-success-100`  | `--color-success-100`    |
| `--color-warning-default`            | `--color-warning-600`  | `--color-warning-600`    |
| `--color-warning-subtle`             | `--color-warning-50`   | `--color-warning-50`     |
| `--color-warning-muted`              | `--color-warning-100`  | `--color-warning-100`    |
| `--color-error-default`              | `--color-error-600`    | `--color-error-600`      |
| `--color-error-subtle`               | `--color-error-50`     | `--color-error-50`       |
| `--color-error-muted`                | `--color-error-100`    | `--color-error-100`      |
| `--color-info-default`               | `--color-info-600`     | `--color-info-600`       |
| `--color-info-subtle`                | `--color-info-50`      | `--color-info-50`        |
| `--color-info-muted`                 | `--color-info-100`     | `--color-info-100`       |

### 2.3 Spacing — base scale

| Token       | Value (px) |
| ----------- | ---------- |
| `--space-0` | 0          |
| `--space-1` | 4          |
| `--space-2` | 8          |
| `--space-3` | 12         |
| `--space-4` | 16         |
| `--space-6` | 24         |
| `--space-8` | 32         |
| `--space-12`| 48         |
| `--space-16`| 64         |

Only these values are permitted (see § 1.1). The upstream SCSS defines additional values (`--space-0-5`, `--space-1-5`, `--space-5`, etc.) for internal library use; consumers should not use them.

### 2.4 Spacing — semantic

**Inset (component padding — vertical horizontal):**

| Token        | Value                        |
| ------------ | ---------------------------- |
| `--inset-xs` | `var(--space-1) var(--space-2)`  (4px 8px) |
| `--inset-sm` | `var(--space-1-5) var(--space-3)` (6px 12px) |
| `--inset-md` | `var(--space-2) var(--space-4)`  (8px 16px) |
| `--inset-lg` | `var(--space-3) var(--space-6)`  (12px 24px) |
| `--inset-xl` | `var(--space-4) var(--space-8)`  (16px 32px) |

**Stack (vertical gap):**

| Token          | Value       |
| -------------- | ----------- |
| `--stack-2xs`  | 4px         |
| `--stack-xs`   | 8px         |
| `--stack-sm`   | 12px        |
| `--stack-md`   | 16px        |
| `--stack-lg`   | 24px        |
| `--stack-xl`   | 32px        |
| `--stack-2xl`  | 48px        |

**Inline (horizontal gap):**

| Token          | Value       |
| -------------- | ----------- |
| `--inline-2xs` | 4px         |
| `--inline-xs`  | 8px         |
| `--inline-sm`  | 12px        |
| `--inline-md`  | 16px        |
| `--inline-lg`  | 24px        |

### 2.5 Typography

**Font families:**

| Token                   | Stack                                                       |
| ----------------------- | ----------------------------------------------------------- |
| `--font-family-sans`    | DM Sans, Segoe UI, system-ui, -apple-system, sans-serif     |
| `--font-family-brand`   | Syne, DM Sans, system-ui, sans-serif                        |
| `--font-family-serif`   | Georgia, Times New Roman, serif                             |
| `--font-family-mono`    | JetBrains Mono, Fira Code, Cascadia Code, monospace         |

Load fonts via `<link>` to Google Fonts or self-hosted via `@font-face`.

**Font sizes (rem, base 16px):**

| Token               | rem     | px  |
| ------------------- | ------- | --- |
| `--font-size-2xs`   | 0.625   | 10  |
| `--font-size-xs`    | 0.75    | 12  |
| `--font-size-sm`    | 0.875   | 14  |
| `--font-size-md`    | 1.0     | 16  |
| `--font-size-lg`    | 1.125   | 18  |
| `--font-size-xl`    | 1.25    | 20  |
| `--font-size-2xl`   | 1.5     | 24  |
| `--font-size-3xl`   | 1.875   | 30  |
| `--font-size-4xl`   | 2.25    | 36  |
| `--font-size-5xl`   | 3.0     | 48  |

**Font weights:** `regular` 400, `medium` 500, `semibold` 600, `bold` 700, `extrabold` 800.

**Line heights:** `none` 1, `tight` 1.25, `snug` 1.375, `normal` 1.5, `relaxed` 1.625, `loose` 2.

**Letter spacing:** `tighter` -0.05em, `tight` -0.025em, `normal` 0, `wide` 0.025em, `wider` 0.05em, `widest` 0.1em.

**Composite text styles** (use these in components):

Each role exposes three custom properties: `size`, `weight`, `lh`.

| Role          | Size        | Weight  | LH      |
| ------------- | ----------- | ------- | ------- |
| `display`     | 5xl         | bold    | tight   |
| `h1`          | 4xl         | bold    | tight   |
| `h2`          | 3xl         | semibold| snug    |
| `h3`          | 2xl         | semibold| snug    |
| `h4`          | xl          | semibold| snug    |
| `body-lg`     | lg          | regular | relaxed |
| `body-md`     | md          | regular | normal  |
| `body-sm`     | sm          | regular | normal  |
| `label-lg`    | md          | medium  | tight   |
| `label-md`    | sm          | medium  | tight   |
| `label-sm`    | xs          | medium  | tight   |
| `helper`      | xs          | regular | normal  |
| `code`        | sm          | regular | normal  (+ mono family) |

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

| Token            | Value   |
| ---------------- | ------- |
| `--radius-none`  | 0       |
| `--radius-xs`    | 2px     |
| `--radius-sm`    | 4px     |
| `--radius-md`    | 6px     |
| `--radius-lg`    | 8px     |
| `--radius-xl`    | 12px    |
| `--radius-2xl`   | 16px    |
| `--radius-3xl`   | 24px    |
| `--radius-full`  | 9999px  |

**Border width:**

| Token                   | Value |
| ----------------------- | ----- |
| `--border-width-none`   | 0     |
| `--border-width-thin`   | 1px   |
| `--border-width-medium` | 2px   |
| `--border-width-thick`  | 4px   |

### 2.7 Elevation

**Shadows:**

| Token                 | Value                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------- |
| `--shadow-none`       | `none`                                                                                   |
| `--shadow-xs`         | `0 1px 2px 0 rgba(0,0,0,0.05)`                                                            |
| `--shadow-sm`         | `0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)`                             |
| `--shadow-md`         | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)`                          |
| `--shadow-lg`         | `0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)`                        |
| `--shadow-xl`         | `0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)`                       |
| `--shadow-2xl`        | `0 25px 50px -12px rgba(0,0,0,0.25)`                                                      |
| `--shadow-inner`      | `inset 0 2px 4px 0 rgba(0,0,0,0.05)`                                                      |
| `--shadow-focus-ring` | `0 0 0 3px rgba(59,130,246,0.45)`                                                         |
| `--shadow-focus-ring-error`   | `0 0 0 3px var(--color-error-200)`                                                |
| `--shadow-focus-ring-success` | `0 0 0 3px var(--color-success-200)`                                              |

**Z-index:**

| Token               | Value |
| ------------------- | ----- |
| `--z-index-base`    | 0     |
| `--z-index-raised`  | 10    |
| `--z-index-dropdown`| 100   |
| `--z-index-sticky`  | 200   |
| `--z-index-overlay` | 300   |
| `--z-index-modal`   | 400   |
| `--z-index-popover` | 500   |
| `--z-index-toast`   | 600   |
| `--z-index-tooltip` | 700   |

### 2.8 Motion

**Durations:**

| Token                | Value  |
| -------------------- | ------ |
| `--duration-instant` | 0ms    |
| `--duration-fast`    | 100ms  |
| `--duration-normal`  | 200ms  |
| `--duration-slow`    | 300ms  |
| `--duration-slower`  | 500ms  |

Under `@media (prefers-reduced-motion: reduce)`, all non-instant durations collapse to 0ms automatically.

**Easings:**

| Token             | Value                                |
| ----------------- | ------------------------------------ |
| `--ease-linear`   | `linear`                             |
| `--ease-in`       | `cubic-bezier(0.4, 0, 1, 1)`         |
| `--ease-out`      | `cubic-bezier(0, 0, 0.2, 1)`         |
| `--ease-in-out`   | `cubic-bezier(0.4, 0, 0.2, 1)`       |
| `--ease-spring`   | `cubic-bezier(0.34, 1.56, 0.64, 1)`  |

**Composite transitions:**

| Token                    | Value                                                                               |
| ------------------------ | ----------------------------------------------------------------------------------- |
| `--transition-colors`    | color, background-color, border-color, fill — `fast` `ease-out`                      |
| `--transition-shadow`    | box-shadow — `fast` `ease-out`                                                       |
| `--transition-transform` | transform — `normal` `ease-spring`                                                   |
| `--transition-opacity`   | opacity — `normal` `ease-out`                                                        |
| `--transition-all`       | all — `normal` `ease-in-out`                                                         |

---

## 3. Setup

### 3.1 CSS custom properties

Copy the block below to `src/styles/eagami-tokens.css` in the consuming project and import it once from your root (`main.tsx` / `_app.tsx` / `layout.tsx`).

```css
/* ---------------------------------------------------------------------------
 * Eagami Design System — CSS Tokens
 * Sync source: @eagami/ui@0.11.0 (src/styles/tokens/*.scss)
 * Do not edit by hand — regenerate from the upstream SCSS.
 * ------------------------------------------------------------------------- */

:root {
  /* Primitive palette — primary */
  --color-primary-50: #eef4f8;
  --color-primary-100: #d5e5f0;
  --color-primary-200: #accfe2;
  --color-primary-300: #7db1ce;
  --color-primary-400: #628ead;
  --color-primary-500: #3c6c90;
  --color-primary-600: #2f567a;
  --color-primary-700: #285175;
  --color-primary-800: #11365c;
  --color-primary-900: #0d2533;

  /* Primitive palette — secondary */
  --color-secondary-50: #f3f1f7;
  --color-secondary-100: #e3deed;
  --color-secondary-200: #c7bedb;
  --color-secondary-300: #a796c3;
  --color-secondary-400: #7d6a9c;
  --color-secondary-500: #594b6e;
  --color-secondary-600: #493d5c;
  --color-secondary-700: #40374f;
  --color-secondary-800: #2f2439;
  --color-secondary-900: #1e1528;

  /* Primitive palette — neutral */
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

  /* Primitive palette — feedback */
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

  /* Semantic — text */
  --color-text-primary: var(--color-neutral-900);
  --color-text-secondary: var(--color-neutral-600);
  --color-text-tertiary: var(--color-neutral-400);
  --color-text-disabled: var(--color-neutral-300);
  --color-text-inverse: var(--color-neutral-0);
  --color-text-link: var(--color-primary-600);
  --color-text-link-hover: var(--color-primary-700);

  /* Semantic — background */
  --color-bg-base: var(--color-neutral-0);
  --color-bg-subtle: var(--color-neutral-50);
  --color-bg-muted: var(--color-neutral-100);
  --color-bg-overlay: rgba(0, 0, 0, 0.5);

  /* Semantic — border */
  --color-border-default: var(--color-neutral-200);
  --color-border-strong: var(--color-neutral-400);
  --color-border-focus: var(--color-primary-500);

  /* Semantic — brand */
  --color-brand-default: var(--color-primary-600);
  --color-brand-hover: var(--color-primary-700);
  --color-brand-active: var(--color-primary-800);
  --color-brand-subtle: var(--color-primary-50);
  --color-brand-muted: var(--color-primary-100);
  --color-brand-secondary-default: var(--color-secondary-500);
  --color-brand-secondary-hover: var(--color-secondary-600);
  --color-brand-secondary-active: var(--color-secondary-700);
  --color-brand-secondary-subtle: var(--color-secondary-50);
  --color-brand-secondary-muted: var(--color-secondary-100);

  /* Semantic — feedback */
  --color-success-default: var(--color-success-600);
  --color-success-subtle: var(--color-success-50);
  --color-success-muted: var(--color-success-100);
  --color-warning-default: var(--color-warning-600);
  --color-warning-subtle: var(--color-warning-50);
  --color-warning-muted: var(--color-warning-100);
  --color-error-default: var(--color-error-600);
  --color-error-subtle: var(--color-error-50);
  --color-error-muted: var(--color-error-100);
  --color-info-default: var(--color-info-600);
  --color-info-subtle: var(--color-info-50);
  --color-info-muted: var(--color-info-100);

  /* Spacing — base scale (whitelist only) */
  --space-0: 0;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Spacing — semantic insets */
  --inset-xs: 0.25rem 0.5rem;
  --inset-sm: 0.375rem 0.75rem;
  --inset-md: 0.5rem 1rem;
  --inset-lg: 0.75rem 1.5rem;
  --inset-xl: 1rem 2rem;

  /* Spacing — stack */
  --stack-2xs: 0.25rem;
  --stack-xs: 0.5rem;
  --stack-sm: 0.75rem;
  --stack-md: 1rem;
  --stack-lg: 1.5rem;
  --stack-xl: 2rem;
  --stack-2xl: 3rem;

  /* Spacing — inline */
  --inline-2xs: 0.25rem;
  --inline-xs: 0.5rem;
  --inline-sm: 0.75rem;
  --inline-md: 1rem;
  --inline-lg: 1.5rem;

  /* Typography — families */
  --font-family-sans: 'DM Sans', 'Segoe UI', system-ui, -apple-system, sans-serif;
  --font-family-brand: 'Syne', 'DM Sans', system-ui, sans-serif;
  --font-family-serif: 'Georgia', 'Times New Roman', serif;
  --font-family-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;

  /* Typography — sizes */
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

  /* Typography — weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;

  /* Typography — line heights */
  --line-height-none: 1;
  --line-height-tight: 1.25;
  --line-height-snug: 1.375;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 2;

  /* Typography — composite text styles */
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
  --text-helper-size: var(--font-size-xs);
  --text-helper-weight: var(--font-weight-regular);
  --text-helper-lh: var(--line-height-normal);
  --text-code-size: var(--font-size-sm);
  --text-code-weight: var(--font-weight-regular);
  --text-code-family: var(--font-family-mono);

  /* Shape — radius */
  --radius-none: 0;
  --radius-xs: 0.125rem;
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  --radius-full: 9999px;

  /* Shape — border widths */
  --border-width-none: 0;
  --border-width-thin: 1px;
  --border-width-medium: 2px;
  --border-width-thick: 4px;

  /* Elevation — shadows */
  --shadow-none: none;
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  --shadow-focus-ring: 0 0 0 3px rgba(59, 130, 246, 0.45);
  --shadow-focus-ring-error: 0 0 0 3px var(--color-error-200);
  --shadow-focus-ring-success: 0 0 0 3px var(--color-success-200);

  /* Elevation — z-index */
  --z-index-base: 0;
  --z-index-raised: 10;
  --z-index-dropdown: 100;
  --z-index-sticky: 200;
  --z-index-overlay: 300;
  --z-index-modal: 400;
  --z-index-popover: 500;
  --z-index-toast: 600;
  --z-index-tooltip: 700;

  /* Motion — durations */
  --duration-instant: 0ms;
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;

  /* Motion — easings */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Motion — composite transitions */
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

/* Dark mode overrides */
@media (prefers-color-scheme: dark) {
  :root {
    --color-text-primary: var(--color-neutral-50);
    --color-text-secondary: var(--color-neutral-400);
    --color-text-tertiary: var(--color-neutral-500);
    --color-text-disabled: var(--color-neutral-700);
    --color-text-inverse: var(--color-neutral-900);

    --color-bg-base: var(--color-neutral-950);
    --color-bg-subtle: var(--color-neutral-900);
    --color-bg-muted: var(--color-neutral-800);

    --color-border-default: var(--color-neutral-700);
    --color-border-strong: var(--color-neutral-500);

    --color-brand-default: var(--color-primary-400);
    --color-brand-hover: var(--color-primary-300);
    --color-brand-active: var(--color-primary-200);
    --color-brand-subtle: rgba(98, 142, 173, 0.1);
    --color-brand-muted: rgba(98, 142, 173, 0.2);
  }
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

### 3.2 TypeScript constants module

For JS access (CSS-in-JS, Tailwind config, runtime theming), create `src/theme/eagami-tokens.ts`. This mirrors the primitive palette; prefer reading CSS vars at runtime via `getComputedStyle` for semantic tokens (which change with theme).

```ts
/**
 * Eagami Design System — TypeScript tokens
 * Sync source: @eagami/ui@0.11.0
 */

export const palette = {
  primary: {
    50: '#eef4f8', 100: '#d5e5f0', 200: '#accfe2', 300: '#7db1ce', 400: '#628ead',
    500: '#3c6c90', 600: '#2f567a', 700: '#285175', 800: '#11365c', 900: '#0d2533',
  },
  secondary: {
    50: '#f3f1f7', 100: '#e3deed', 200: '#c7bedb', 300: '#a796c3', 400: '#7d6a9c',
    500: '#594b6e', 600: '#493d5c', 700: '#40374f', 800: '#2f2439', 900: '#1e1528',
  },
  neutral: {
    0: '#ffffff', 50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db',
    400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151', 800: '#1f2937',
    900: '#111827', 950: '#030712',
  },
  success: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 500: '#22c55e', 600: '#16a34a', 700: '#15803d' },
  warning: { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 500: '#f59e0b', 600: '#d97706', 700: '#b45309' },
  error:   { 50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c' },
  info:    { 50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 500: '#06b6d4', 600: '#0891b2', 700: '#0e7490' },
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
  linear: 'linear',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export const zIndex = {
  base: 0, raised: 10, dropdown: 100, sticky: 200, overlay: 300,
  modal: 400, popover: 500, toast: 600, tooltip: 700,
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

### 3.3 Importing tokens in the root

```tsx
// app/layout.tsx (Next.js) or main.tsx (Vite) or _app.tsx (pages router)
import './styles/eagami-tokens.css';

// then import your app entry as usual
```

### 3.4 Optional: manual dark mode override

If the app exposes a theme toggle in addition to `prefers-color-scheme`, use a `data-theme` attribute pattern. Replace the `@media (prefers-color-scheme: dark)` block with:

```css
:root[data-theme='dark'] {
  /* dark overrides exactly as in the media query block above */
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    /* same overrides — applies when user hasn't set an explicit preference */
  }
}
```

Toggle with `document.documentElement.setAttribute('data-theme', 'dark' | 'light')`.

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
/* ❌ Hard-coded colors, spacing, typography, transition */
.root {
  padding: 10px 15px;                    /* not on the scale — use --inset-md */
  background: #2f567a;                   /* use var(--color-brand-default) */
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
  background: var(--color-bg-base);
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
        // ... semantic color aliases
      },
      bg: {
        base: 'var(--color-bg-base)',
        subtle: 'var(--color-bg-subtle)',
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
  },
};
```

**Keep the Tailwind config's spacing table in sync with § 2.3** — Tailwind's default scale includes values (5, 7, 9, 10, 11, 14, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96) that violate the Eagami scale. Either override the entire `spacing` key (as above) or configure a lint rule to prevent forbidden keys.

---

## 5. Component API conventions

When building React components that mirror Eagami components, preserve the prop names, variant literals, and defaults below.

### 5.1 Button

```ts
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: ButtonVariant;        // default 'primary'
  size?: Size;                    // default 'md'
  type?: 'button' | 'submit' | 'reset'; // default 'button'
  disabled?: boolean;             // default false
  loading?: boolean;              // default false
  fullWidth?: boolean;            // default false
  children: React.ReactNode;
}
```

**Behavior:**
- `loading` shows a spinner and disables the button but preserves width (`visibility: hidden` on the children, spinner positioned absolutely).
- `fullWidth` sets `width: 100%`.
- Hover: background shifts to `--color-brand-hover` / `--color-brand-active`.

### 5.2 Input

```ts
type InputStatus = 'default' | 'error' | 'success';
type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'prefix'> {
  label?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  type?: InputType;               // default 'text'
  size?: Size;                    // default 'md'
  status?: InputStatus;           // default 'default' — forced to 'error' when `error` is set
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void; // note: emits string, not the event
  onFocus?: () => void;
  onBlur?: () => void;
  prefix?: React.ReactNode;       // icon/element rendered inside the input, left
  suffix?: React.ReactNode;       // icon/element rendered inside the input, right
}
```

### 5.3 Checkbox

```ts
interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: Size;
  disabled?: boolean;
  required?: boolean;
  indeterminate?: boolean;
}
```

### 5.4 Radio group

```ts
interface RadioGroupProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  name?: string;
  size?: Size;
  orientation?: 'vertical' | 'horizontal';  // default 'vertical'
  disabled?: boolean;
  children: React.ReactNode; // expects <Radio> children
}

interface RadioProps<T extends string> {
  value: T;
  label?: string;
  disabled?: boolean;
}
```

### 5.5 Card

```ts
type CardVariant = 'elevated' | 'outlined' | 'filled';
type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

interface CardProps {
  variant?: CardVariant;          // default 'elevated'
  padding?: CardPadding;          // default 'md'
  fullWidth?: boolean;
  headerDivider?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}
```

### 5.6 Dropdown

```ts
interface DropdownOption<T extends string> {
  value: T;
  label: string;
  disabled?: boolean;
}

interface DropdownProps<T extends string> {
  options: DropdownOption<T>[];
  value: T | '';
  onChange: (value: T) => void;
  label?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  size?: Size;
  disabled?: boolean;
  required?: boolean;
}
```

**Keyboard:** ArrowUp/Down to navigate, Enter/Space to select, Escape to close.

### 5.7 Dialog

```ts
type DialogSize = 'sm' | 'md' | 'lg' | 'full';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  size?: DialogSize;              // default 'md'
  closeOnBackdrop?: boolean;      // default true
  closeOnEscape?: boolean;        // default true
  showClose?: boolean;            // default true
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}
```

**Implementation note:** build on the native `<dialog>` element with `showModal()` to get focus trap and inert backdrop for free.

### 5.8 Other components

Follow the same conventions for other mirrored Eagami components (Alert, Accordion, Autocomplete, Avatar, Badge, Breadcrumbs, CodeInput, DataTable, DatePicker, Divider, Drawer, Icon, IconButton, Menu, Paginator, ProgressBar, Skeleton, Spinner, Switch, Tabs, Tag, Textarea, Toast, Tooltip, Wordmark). Upstream docs: https://github.com/mwiraszka/eagami-design-system

---

## 6. Accessibility requirements

- **Semantics:** Use the right element. Buttons are `<button>`, links are `<a href>`, form fields use `<input>` / `<textarea>` / `<select>` with associated `<label>`. Icon-only buttons require `aria-label`.
- **Contrast:** Token combinations pre-tested for WCAG AA:
  - Body text (`--color-text-primary` on `--color-bg-base`): ≥ 4.5:1.
  - Large text (h1–h4) on `--color-bg-base`: ≥ 3:1.
  - Never combine `--color-text-tertiary` with `--color-bg-muted` for body text.
- **Touch targets:** 44×44 px minimum. The `md` and `lg` sizes satisfy this; `sm` is for non-tappable or secondary contexts only.
- **Focus management:** Modal/drawer open → focus moves inside; close → focus returns to trigger. Use `inert` on background content while a modal is open.
- **Keyboard:** Every interaction reachable without a mouse. Custom components must implement the standard key conventions (see § 5 notes).
- **Form fields:** Labels must be associated via `htmlFor` / `id` (or by wrapping). Errors must be announced (`aria-invalid` + `aria-describedby` pointing to the error message).
- **Reduced motion:** Rely on the provided `--duration-*` tokens; they collapse to 0ms automatically. Do not use literal `200ms` values.

---

## 7. Sync checklist

When regenerating this file from the upstream Angular library, verify in order:

1. `version` in frontmatter matches the upstream `package.json` version.
2. Every hex in § 2.1 matches `src/styles/tokens/_colors.scss` primitives.
3. Every semantic token in § 2.2 matches the light/dark definitions in `_colors.scss`.
4. Spacing scale in § 2.3 matches `_spacing.scss` (only the 10-value whitelist).
5. Typography composites in § 2.5 match the `--text-*` tokens in `_typography.scss`.
6. Radius/border-width values in § 2.6 match `_shape.scss`.
7. Shadow values in § 2.7 match `_elevation.scss`.
8. Motion durations and easings in § 2.8 match `_motion.scss`.
9. The CSS block in § 3.1 matches § 2 exactly.
10. The TypeScript constants in § 3.2 match § 2 exactly.
11. Component API conventions in § 5 match the Angular component signatures.
12. `last-synced` date in frontmatter updated to today.

**For AI agents performing the sync:** diff this file's tables against the SCSS source of truth and report any discrepancies before editing the CSS or TS blocks. Do not regenerate blindly.
