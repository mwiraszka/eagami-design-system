---
title: 'Eagami UI: Flutter Integration'
version: 5.39.0
source: '@eagami/ui@5.39.0 (https://github.com/mwiraszka/eagami)'
last-synced: 2026-09-08
audience: human developers and AI coding agents
purpose: >
  Single-file specification for applying the Eagami UI design tokens to a Flutter/Dart
  codebase without depending on the upstream Angular library. Copy this file into the
  consuming project's docs/ directory. When building or modifying UI in that project,
  follow every rule below and use only the tokens listed here.
---

# Eagami UI: Flutter Integration

This document is the complete, self-contained specification for applying the Eagami UI design tokens to a Flutter project. It contains:

1. Mandatory design rules
2. Full token set (values)
3. Ready-to-paste Dart theme setup
4. Usage patterns (do / don't)
5. Component API conventions
6. Internationalization
7. Accessibility requirements
8. Sync checklist

**For AI agents:** When building or modifying UI in this project, follow every rule in § 1 and use only the tokens in § 2 (accessed via the `EagamiTheme` in § 3). Do not introduce arbitrary color, spacing, or typography values. If a required token is missing, request an upstream addition rather than hard-coding. The `RULE:` markers below identify invariants that must always hold.

---

## Table of contents

1. [Design rules](#1-design-rules)
2. [Tokens](#2-tokens)
3. [Theme setup](#3-theme-setup)
4. [Usage patterns](#4-usage-patterns)
5. [Component API conventions](#5-component-api-conventions)
6. [Internationalization](#6-internationalization)
7. [Accessibility requirements](#7-accessibility-requirements)
8. [Sync checklist](#8-sync-checklist)

---

## 1. Design rules

### 1.1 Spacing scale

**RULE:** All padding, margin, and gap values must be drawn from this scale:

`1, 2, 4, 8, 12, 16, 24, 32, 48, 64`

Units are Flutter's default logical pixels. Arbitrary values (5, 10, 20, 100, etc.) are forbidden. Prefer named tokens (`context.eagami.spacing.md`) over numeric literals so the scale stays discoverable.

### 1.2 Colors

**RULE:** Never hard-code color literals (`Color(0xFF...)`, `Colors.blue`, `CupertinoColors.*`) in widget code. All colors come from `EagamiTheme` semantic tokens.

- Use **semantic names** (`colors.textPrimary`, `colors.surfaceBase`, `colors.borderDefault`) rather than primitives (`neutral900`, `primary500`).
- Tokens adapt automatically across `EagamiTheme.light` and `EagamiTheme.dark`.
- For translucent overlays, use `colors.surfaceOverlay`. Do not call `Color.withOpacity()` on raw palette colors.
- Surfaces that float above the page (cards with `variant: elevated`, dialogs, drawers, dropdowns, menus, toasts) must paint with `colors.surfaceElevated`, not `surfaceBase`. In dark mode that token resolves to a step-lighter shade so elevation reads at a glance, since drop shadows alone are too subtle on a near-black page.
- If a required semantic token is missing, add it upstream rather than falling back to primitives.

### 1.3 Focus indicators

**RULE:** Every focusable widget must render a visible keyboard focus indicator.

- Use `elevation.focusRing` as the default focus style (3px outer glow using a translucent blue).
- For error and success contexts, use `elevation.focusRingError` and `elevation.focusRingSuccess` so the ring colour matches the field state.
- Wrap custom interactive widgets in `FocusableActionDetector` or apply `Focus` + visual feedback.
- Never set `focusColor: Colors.transparent` or otherwise suppress the indicator.

### 1.4 Motion and reduced motion

**RULE:** Use the provided motion tokens for all animations. Respect reduced-motion.

- `motion.fast`, `motion.normal`, `motion.slow`, `motion.slower` are all `Duration` values; `motion.instant` is `Duration.zero`.
- `motion.easeIn`, `motion.easeOut`, `motion.easeInOut`, `motion.easeSpring`, `motion.easeLinear` are all `Curve` values.
- Use `context.eagamiDuration(base)` at every animation site. It reads `MediaQuery.disableAnimationsOf(context)` and collapses to `Duration.zero` when the user has requested reduced motion. Do not bypass this by constructing raw `Duration` literals.
- For loading affordances, prefer slowing rather than removing the animation. The upstream `Spinner` slows its spin under reduced motion rather than freezing, since freezing the only "I'm working" cue is worse than a gentle rotation.

### 1.5 Typography

**RULE:** Use semantic typography tokens when styling text.

- `typography.display`, `typography.h1`, `typography.h2`, `typography.h3`, `typography.h4`
- `typography.bodyLg`, `typography.bodyMd`, `typography.bodySm`
- `typography.labelLg`, `typography.labelMd`, `typography.labelSm`
- `typography.helper`, `typography.code`

Do not compose `TextStyle` from raw font sizes/weights. If a role is missing, add a token upstream.

### 1.6 Interactive element sizing

**RULE:** All tappable targets must be at least 44×44 logical pixels. Use the size tokens (`xs`, `sm`, `md`, `lg`, `xl`) which are calibrated to meet this for `md` and up; `xs` and `sm` are reserved for non-tappable or dense secondary contexts only.

### 1.7 Component API shape

**RULE:** Widgets that mirror Eagami components must preserve these prop shapes so behavior is predictable across Angular and Flutter:

| Prop              | Type                  | Notes                                                                            |
| ----------------- | --------------------- | -------------------------------------------------------------------------------- |
| `variant`         | enum                  | Matches Angular component's variant (e.g. Button → `ButtonVariant.primary`).      |
| `size`            | `EagamiSize` enum     | `xs | sm | md | lg | xl`, default `md`. Defined once and reused by every sized component. |
| `disabled`        | `bool`                | Default `false`.                                                                  |
| `loading`         | `bool`                | Where applicable.                                                                 |
| `fullWidth`       | `bool`                | Where applicable.                                                                 |
| `hint`            | `String?`             | Below-field helper text. Hidden while an `errorMsg` is present.                    |
| `errorMsg`        | `String?`             | Below-field error text. When non-null, forces the field into the error state.     |
| `required`        | `bool`                | Default `false`. Drives the visible "required" marker and `aria-required`.        |
| `readonly`        | `bool`                | Default `false`. Non-disabled but non-editable; supported on most form controls.  |
| value/onChanged   | controlled pattern    | Pair `value: T` with `onChanged: ValueChanged<T>` (or a `model<T>` two-way).      |

A common change since the previous version of this doc: every text/select-style control now uses `errorMsg` (not `error`), and there is no separate `status` enum any more. The presence of `errorMsg` is what flips the field into the error state.

See § 5 for per-component specifics.

---

## 2. Tokens

<!-- eagami:generated:flutter-tokens start -->

All values below are directly encoded into the Dart source in § 3. They mirror the CSS custom properties in `packages/ui/src/styles/tokens/*.scss` in the upstream Angular library. This whole section (and the theme code in § 3.2) is generated by `scripts/sync-integration-guides.mjs`; never edit it by hand, regenerate it with `pnpm ui sync-guides` when upstream tokens change (see § 8). Values in any older copy of this document are superseded by this version; do not trust cached palettes.

### 2.1 Colors, primitive palette

Use these only if a semantic token is not available. Adding a new semantic is almost always the right move.

#### Primary (brand)

The primary ramp is a single hue (H=205, S=50) varying only by lightness.

| Token        | Hex       |
| ------------ | --------- |
| `primary50`  | `#ECF3F9` |
| `primary100` | `#D1E3F0` |
| `primary200` | `#ABCBE3` |
| `primary300` | `#7DAFD4` |
| `primary400` | `#4B91C3` |
| `primary500` | `#3674A1` |
| `primary600` | `#2A5B7E` |
| `primary700` | `#204560` |
| `primary800` | `#162F41` |
| `primary900` | `#0D1C26` |

#### Secondary

The secondary ramp is a single hue (H=222, S=25) varying only by lightness.

| Token          | Hex       |
| -------------- | --------- |
| `secondary50`  | `#F3F5FA` |
| `secondary100` | `#DCE1EC` |
| `secondary200` | `#BBC4D8` |
| `secondary300` | `#93A1BF` |
| `secondary400` | `#687AA5` |
| `secondary500` | `#506086` |
| `secondary600` | `#404C6A` |
| `secondary700` | `#313B51` |
| `secondary800` | `#232938` |
| `secondary900` | `#151922` |

#### Neutral

| Token        | Hex       |
| ------------ | --------- |
| `neutral0`   | `#FFFFFF` |
| `neutral50`  | `#F9FAFB` |
| `neutral100` | `#F3F4F6` |
| `neutral200` | `#E5E7EB` |
| `neutral300` | `#D1D5DB` |
| `neutral400` | `#9CA3AF` |
| `neutral500` | `#6B7280` |
| `neutral600` | `#4B5563` |
| `neutral700` | `#374151` |
| `neutral800` | `#1F2937` |
| `neutral900` | `#111827` |
| `neutral950` | `#030712` |

#### Feedback

| Token        | Hex       |     | Token        | Hex       |
| ------------ | --------- | --- | ------------ | --------- |
| `success50`  | `#F0FDF4` |     | `warning50`  | `#FFFBEB` |
| `success100` | `#DCFCE7` |     | `warning100` | `#FEF3C7` |
| `success200` | `#BBF7D0` |     | `warning200` | `#FDE68A` |
| `success500` | `#22C55E` |     | `warning500` | `#F59E0B` |
| `success600` | `#16A34A` |     | `warning600` | `#D97706` |
| `success700` | `#15803D` |     | `warning700` | `#B45309` |
| `error50`    | `#FEF2F2` |     | `info50`     | `#ECFEFF` |
| `error100`   | `#FEE2E2` |     | `info100`    | `#CFFAFE` |
| `error200`   | `#FECACA` |     | `info200`    | `#A5F3FC` |
| `error500`   | `#EF4444` |     | `info500`    | `#06B6D4` |
| `error600`   | `#DC2626` |     | `info600`    | `#0891B2` |
| `error700`   | `#B91C1C` |     | `info700`    | `#0E7490` |

### 2.2 Colors, semantic (light & dark)

Dark-mode `*Subtle` and `*Muted` for status colours are re-tinted as low-alpha washes of the saturated `*500` so dark-mode text remains readable on them. Light-mode pastels would otherwise be unreadable behind light text in dark mode. Blended upstream values (`color-mix`) are precomputed to flat `Color` literals.

| Semantic token          | Light               | Dark                |
| ----------------------- | ------------------- | ------------------- |
| `textPrimary`           | `neutral900`        | `neutral50`         |
| `textSecondary`         | `neutral600`        | `neutral300`        |
| `textTertiary`          | `neutral400`        | `neutral500`        |
| `textDisabled`          | `neutral400`        | `neutral500`        |
| `textInverse`           | `neutral0`          | `neutral900`        |
| `textLink`              | `primary600`        | `primary300`        |
| `textLinkHover`         | `primary800`        | `primary100`        |
| `surfaceCanvas`         | `neutral0`          | `neutral950`        |
| `surfaceBase`           | `neutral0`          | `neutral800`        |
| `surfaceSubtle`         | `neutral50`         | `neutral700`        |
| `surfaceStripe`         | `neutral50`         | `neutral900`        |
| `surfaceStripeSubtle`   | `Color(0xFFFBFCFC)` | `Color(0xFF1A2331)` |
| `surfaceMuted`          | `neutral100`        | `neutral700`        |
| `surfaceEmphasis`       | `neutral100`        | `neutral600`        |
| `surfaceElevated`       | `neutral0`          | `neutral700`        |
| `surfaceOverlay`        | `Color(0x80000000)` | `Color(0x80000000)` |
| `tooltipSurface`        | `Color(0xFF1A1B21)` | `Color(0xFF1A1B21)` |
| `tooltipBorder`         | `Color(0x26FFFFFF)` | `Color(0x26FFFFFF)` |
| `stateHover`            | `neutral100`        | `Color(0x14FFFFFF)` |
| `stateActive`           | `neutral200`        | `Color(0x24FFFFFF)` |
| `borderSubtle`          | `neutral200`        | `Color(0xFF2B3544)` |
| `borderDefault`         | `neutral200`        | `neutral400`        |
| `borderStrong`          | `neutral400`        | `neutral300`        |
| `divider`               | `Color(0x1A000000)` | `Color(0x1FFFFFFF)` |
| `borderFocus`           | `primary500`        | `primary500`        |
| `brandDefault`          | `primary600`        | `primary500`        |
| `brandHover`            | `primary700`        | `primary600`        |
| `brandActive`           | `primary800`        | `primary700`        |
| `brandText`             | `primary700`        | `primary300`        |
| `brandSubtle`           | `primary50`         | `Color(0x1A4B91C3)` |
| `brandMuted`            | `primary100`        | `Color(0x334B91C3)` |
| `brandSecondaryDefault` | `secondary500`      | `secondary500`      |
| `brandSecondaryHover`   | `secondary600`      | `secondary600`      |
| `brandSecondaryActive`  | `secondary700`      | `secondary700`      |
| `brandSecondaryText`    | `secondary700`      | `secondary200`      |
| `brandSecondarySubtle`  | `secondary50`       | `Color(0x1A687AA5)` |
| `brandSecondaryMuted`   | `secondary100`      | `Color(0x33687AA5)` |
| `successDefault`        | `success600`        | `success600`        |
| `successSubtle`         | `success50`         | `Color(0x2622C55E)` |
| `successMuted`          | `success100`        | `Color(0x4022C55E)` |
| `successText`           | `success700`        | `success200`        |
| `warningDefault`        | `warning600`        | `warning600`        |
| `warningSubtle`         | `warning50`         | `Color(0x26F59E0B)` |
| `warningMuted`          | `warning100`        | `Color(0x40F59E0B)` |
| `warningText`           | `warning700`        | `warning200`        |
| `errorDefault`          | `error600`          | `error600`          |
| `errorSubtle`           | `error50`           | `Color(0x26EF4444)` |
| `errorMuted`            | `error100`          | `Color(0x40EF4444)` |
| `errorText`             | `error700`          | `error200`          |
| `infoDefault`           | `info600`           | `info600`           |
| `infoSubtle`            | `info50`            | `Color(0x2606B6D4)` |
| `infoMuted`             | `info100`           | `Color(0x4006B6D4)` |
| `infoText`              | `info700`           | `info200`           |

In dark mode the surface model splits the page (`surfaceCanvas`, deepest) from the surfaces that sit on it (`surfaceBase`, `surfaceSubtle`, `surfaceElevated`, `surfaceMuted`). Canvas stays at the deepest neutral while every component surface lifts above it so inputs, cards, accordion items, and popover panels read above the page instead of disappearing into it. `surfaceStripe` is the alternating-row tone for tables; it sits **below** `surfaceBase` to keep odd rows darker than the surrounding card, and `surfaceStripeSubtle` mixes it toward `surfaceBase` for a quieter zebra fill. `surfaceMuted` is the opaque static fill for disabled fields, slider and progress tracks, and skeletons; hover and active fills route through the translucent `stateHover` / `stateActive` washes, so this shade never collides with them.

`brandText` is the brand colour used as a **foreground** on a non-brand surface (selected dropdown row, today marker, sorted column header, spinner, active paginator page). It needs a 4.5:1 contrast against `surfaceBase`, so it flips to a lighter shade in dark mode. `brandDefault` stays free to be optimized as a surface (button background, badge background) without dragging the text-on-surface contrast along with it. The status `*Text` tokens mirror this split for text on the status washes.

### 2.3 Spacing, base scale

| Token | Pixels |
| ----- | ------ |
| `s0`  | 0      |
| `s1`  | 4      |
| `s2`  | 8      |
| `s3`  | 12     |
| `s4`  | 16     |
| `s6`  | 24     |
| `s8`  | 32     |
| `s12` | 48     |
| `s16` | 64     |

Only these values are permitted (see § 1.1). The upstream SCSS defines additional values (1px, 2px, 6px, 10px, 14px, 20px, 28px, 36px, 40px, 44px, 56px, 80px, 96px, 128px) but these exist for internal library use and are not exposed here.

### 2.4 Spacing, semantic

**Inset (component padding, vertical × horizontal):**

| Token     | Vertical | Horizontal |
| --------- | -------- | ---------- |
| `insetXs` | 4        | 8          |
| `insetSm` | 6        | 12         |
| `insetMd` | 8        | 16         |
| `insetLg` | 12       | 24         |
| `insetXl` | 16       | 32         |

`insetSm` and `insetXs` may use values off the public scale internally; do not construct the equivalent `EdgeInsets.symmetric(...)` directly, reach for the token so the choice stays consistent.

**Stack (vertical gap):**

| Token      | Pixels |
| ---------- | ------ |
| `stack2xs` | 4      |
| `stackXs`  | 8      |
| `stackSm`  | 12     |
| `stackMd`  | 16     |
| `stackLg`  | 24     |
| `stackXl`  | 32     |
| `stack2xl` | 48     |

**Inline (horizontal gap):**

| Token       | Pixels |
| ----------- | ------ |
| `inline2xs` | 4      |
| `inlineXs`  | 8      |
| `inlineSm`  | 12     |
| `inlineMd`  | 16     |
| `inlineLg`  | 24     |

### 2.5 Typography

**Font families** (bundled per § 3.1; upstream web stacks shown for reference):

| Token       | Upstream stack                                                                 |
| ----------- | ------------------------------------------------------------------------------ |
| `fontSans`  | DM Sans → DM Sans Fallback → Segoe UI → system-ui → -apple-system → sans-serif |
| `fontBrand` | Syne → Syne Fallback → DM Sans → DM Sans Fallback → system-ui → sans-serif     |
| `fontSerif` | Georgia → Times New Roman → serif                                              |
| `fontMono`  | ui-monospace → SFMono-Regular → Menlo → Monaco → Consolas → monospace          |

**Font sizes** (logical pixels; Flutter's `TextStyle.fontSize`):

| Token     | Pixels |
| --------- | ------ |
| `size2xs` | 10     |
| `sizeXs`  | 12     |
| `sizeSm`  | 14     |
| `sizeMd`  | 16     |
| `sizeLg`  | 18     |
| `sizeXl`  | 20     |
| `size2xl` | 24     |
| `size3xl` | 30     |
| `size4xl` | 36     |
| `size5xl` | 48     |

**Font weights:**

| Token       | Value  |
| ----------- | ------ |
| `regular`   | `w400` |
| `medium`    | `w500` |
| `semibold`  | `w600` |
| `bold`      | `w700` |
| `extrabold` | `w800` |

**Line heights** (unitless multiplier):

| Token       | Value |
| ----------- | ----- |
| `lhNone`    | 1     |
| `lhTight`   | 1.25  |
| `lhSnug`    | 1.375 |
| `lhNormal`  | 1.5   |
| `lhRelaxed` | 1.625 |
| `lhLoose`   | 2     |

**Letter spacing** (em):

| Token       | Value  |
| ----------- | ------ |
| `lsTighter` | -0.05  |
| `lsTight`   | -0.025 |
| `lsNormal`  | 0      |
| `lsWide`    | 0.025  |
| `lsWider`   | 0.05   |
| `lsWidest`  | 0.1    |

**Composite text styles** (what widget code should actually use):

| Style            | Size | Weight | Line height | Family |
| ---------------- | ---- | ------ | ----------- | ------ |
| `display`        | 48   | 700    | 1.25        | sans   |
| `h1`             | 36   | 700    | 1.25        | sans   |
| `h2`             | 30   | 600    | 1.375       | sans   |
| `h3`             | 24   | 600    | 1.375       | sans   |
| `h4`             | 20   | 600    | 1.375       | sans   |
| `sectionHeading` | 22   | 600    | 1.375       | brand  |
| `bodyLg`         | 18   | 400    | 1.625       | sans   |
| `bodyMd`         | 16   | 400    | 1.5         | sans   |
| `bodySm`         | 14   | 400    | 1.5         | sans   |
| `labelLg`        | 16   | 500    | 1.25        | sans   |
| `labelMd`        | 14   | 500    | 1.25        | sans   |
| `labelSm`        | 12   | 500    | 1.25        | sans   |
| `helper`         | 13   | 400    | 1.5         | sans   |
| `code`           | 14   | 400    | -           | mono   |
| `kbd`            | 13   | 500    | -           | mono   |

### 2.6 Shape

**Border radius:**

| Token        | Pixels |
| ------------ | ------ |
| `radiusNone` | 0      |
| `radiusXs`   | 2      |
| `radiusSm`   | 4      |
| `radiusMd`   | 6      |
| `radiusLg`   | 8      |
| `radiusXl`   | 12     |
| `radius2xl`  | 16     |
| `radius3xl`  | 24     |
| `radiusFull` | 9999   |

**Border width:**

| Token               | Pixels |
| ------------------- | ------ |
| `borderWidthNone`   | 0      |
| `borderWidthThin`   | 1      |
| `borderWidthMedium` | 2      |
| `borderWidthThick`  | 4      |

### 2.7 Elevation

**Shadows** (Flutter `BoxShadow` list). Both modes use black-at-low-alpha drop shadows: a drop shadow is the absence of light, so a white "shadow" reads as a glow and looks wrong. Dark mode deepens the black alpha and appends a hairline top highlight to every non-`none` level so the lifted surface catches light along its top edge. Elevation in dark mode is carried primarily by the lifted surface tone (see `surfaceElevated`) plus that top highlight, with the deeper drop shadow secondary.

| Token   | Light                                                                            | Dark                                                                                             |
| ------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `none`  | `[]`                                                                             | (same as light)                                                                                  |
| `xs`    | `(0,1) blur 2` at 5% black                                                       | `(0,1) blur 2` at 40% black + top highlight                                                      |
| `sm`    | `(0,1) blur 3` at 10% black + `(0,1) blur 2 spread -1` at 10% black              | `(0,1) blur 3` at 50% black + `(0,1) blur 2 spread -1` at 40% black + top highlight              |
| `md`    | `(0,4) blur 6 spread -1` at 10% black + `(0,2) blur 4 spread -2` at 10% black    | `(0,4) blur 8 spread -2` at 55% black + `(0,2) blur 4 spread -2` at 40% black + top highlight    |
| `lg`    | `(0,10) blur 15 spread -3` at 10% black + `(0,4) blur 6 spread -4` at 10% black  | `(0,12) blur 20 spread -4` at 60% black + `(0,4) blur 8 spread -4` at 45% black + top highlight  |
| `xl`    | `(0,20) blur 25 spread -5` at 10% black + `(0,8) blur 10 spread -6` at 10% black | `(0,20) blur 28 spread -6` at 65% black + `(0,8) blur 12 spread -6` at 50% black + top highlight |
| `xxl`   | `(0,25) blur 50 spread -12` at 25% black                                         | `(0,28) blur 50 spread -12` at 75% black + top highlight                                         |
| `inner` | inset `(0,2) blur 4` at 5% black                                                 | (same as light)                                                                                  |

**Bevel and well (relief)**: paired inset shadows that make a surface read as raised (`bevel`) or recessed (`well`). Flutter does not support inset `BoxShadow` natively; render with `CustomPainter`, stacked translucent `Container` overlays, or by painting a `BoxDecoration` whose `gradient` produces the highlight + shadow stops. Dark mode shifts the highlight to a lower alpha and the shadow to a higher alpha so the relief still reads on the lifted `surfaceBase`.

| Token         | Light                                                                      | Dark                                                                      |
| ------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `bevel`       | inset `(0,1) blur 1` at 85% white + inset `(0,-1) blur 1.5` at 25% black   | inset `(0,1) blur 1` at 18% white + inset `(0,-1) blur 1.5` at 60% black  |
| `bevelStrong` | inset `(0,1.5) blur 2` at 90% white + inset `(0,-2) blur 3` at 30% black   | inset `(0,1.5) blur 2` at 22% white + inset `(0,-2) blur 3` at 70% black  |
| `well`        | inset `(0,1) blur 1.5` at 30% black + inset `(0,-1) blur 0.5` at 50% white | inset `(0,1) blur 1.5` at 55% black + inset `(0,-1) blur 0.5` at 8% white |
| `wellStrong`  | inset `(0,2) blur 3` at 40% black + inset `(0,-1.5) blur 1` at 55% white   | inset `(0,2) blur 3` at 70% black + inset `(0,-1.5) blur 1` at 12% white  |

**Focus rings** (no dark-mode override):

| Token              | Definition                                           |
| ------------------ | ---------------------------------------------------- |
| `focusRing`        | `(0,0) blur 0 spread 3` at `Color(0x733B82F6)` (45%) |
| `focusRingError`   | `(0,0) blur 0 spread 3` at `error200`                |
| `focusRingSuccess` | `(0,0) blur 0 spread 3` at `success200`              |

**Z-index** (for `Stack` ordering; Flutter does not use CSS-style z-index, but these are semantic ordering constants):

| Token       | Value |
| ----------- | ----- |
| `zBase`     | 0     |
| `zRaised`   | 10    |
| `zDropdown` | 100   |
| `zSticky`   | 200   |
| `zOverlay`  | 300   |
| `zModal`    | 400   |
| `zPopover`  | 500   |
| `zToast`    | 600   |
| `zTooltip`  | 700   |

### 2.8 Motion

**Durations** (`Duration`):

| Token     | Value  |
| --------- | ------ |
| `instant` | 0 ms   |
| `fast`    | 100 ms |
| `normal`  | 200 ms |
| `slow`    | 300 ms |
| `slower`  | 500 ms |

Under `prefers-reduced-motion`, every duration above (except `instant`) collapses to 0 ms upstream. Mirror that in Flutter via `context.eagamiDuration(base)` (see § 1.4 and § 3.3).

**Easing** (`Cubic` / `Curve`):

| Token        | Value                        |
| ------------ | ---------------------------- |
| `easeLinear` | `Curves.linear`              |
| `easeIn`     | `Cubic(0.4, 0, 1, 1)`        |
| `easeOut`    | `Cubic(0, 0, 0.2, 1)`        |
| `easeInOut`  | `Cubic(0.4, 0, 0.2, 1)`      |
| `easeSpring` | `Cubic(0.34, 1.56, 0.64, 1)` |

<!-- eagami:generated:flutter-tokens end -->

---

## 3. Theme setup

### 3.1 Bundle fonts

Add to `pubspec.yaml`:

```yaml
flutter:
  fonts:
    - family: DM Sans
      fonts:
        - asset: assets/fonts/DMSans-Regular.ttf
          weight: 400
        - asset: assets/fonts/DMSans-Medium.ttf
          weight: 500
        - asset: assets/fonts/DMSans-SemiBold.ttf
          weight: 600
        - asset: assets/fonts/DMSans-Bold.ttf
          weight: 700
    - family: Syne
      fonts:
        - asset: assets/fonts/Syne-Bold.ttf
          weight: 700
        - asset: assets/fonts/Syne-ExtraBold.ttf
          weight: 800
    - family: JetBrains Mono
      fonts:
        - asset: assets/fonts/JetBrainsMono-Regular.ttf
          weight: 400
```

Download fonts from Google Fonts (DM Sans, Syne, JetBrains Mono).

### 3.2 Theme extension

Create `lib/theme/eagami_theme.dart`:

<!-- eagami:generated:flutter-theme start -->

```dart
import 'package:flutter/material.dart';

// =============================================================================
// EagamiTheme: design-token theme extension
// Generated from @eagami/ui@5.39.0 (packages/ui/src/styles/tokens/*.scss)
// by scripts/sync-integration-guides.mjs. Do not edit by hand.
// =============================================================================

@immutable
class EagamiTheme extends ThemeExtension<EagamiTheme> {
  const EagamiTheme({
    required this.colors,
    required this.typography,
    required this.spacing,
    required this.radius,
    required this.borderWidth,
    required this.elevation,
    required this.motion,
  });

  final EagamiColors colors;
  final EagamiTypography typography;
  final EagamiSpacing spacing;
  final EagamiRadius radius;
  final EagamiBorderWidth borderWidth;
  final EagamiElevation elevation;
  final EagamiMotion motion;

  static const EagamiTheme light = EagamiTheme(
    colors: EagamiColors.light,
    typography: EagamiTypography.base,
    spacing: EagamiSpacing.base,
    radius: EagamiRadius.base,
    borderWidth: EagamiBorderWidth.base,
    elevation: EagamiElevation.light,
    motion: EagamiMotion.base,
  );

  static const EagamiTheme dark = EagamiTheme(
    colors: EagamiColors.dark,
    typography: EagamiTypography.base,
    spacing: EagamiSpacing.base,
    radius: EagamiRadius.base,
    borderWidth: EagamiBorderWidth.base,
    elevation: EagamiElevation.dark,
    motion: EagamiMotion.base,
  );

  @override
  EagamiTheme copyWith({
    EagamiColors? colors,
    EagamiTypography? typography,
    EagamiSpacing? spacing,
    EagamiRadius? radius,
    EagamiBorderWidth? borderWidth,
    EagamiElevation? elevation,
    EagamiMotion? motion,
  }) {
    return EagamiTheme(
      colors: colors ?? this.colors,
      typography: typography ?? this.typography,
      spacing: spacing ?? this.spacing,
      radius: radius ?? this.radius,
      borderWidth: borderWidth ?? this.borderWidth,
      elevation: elevation ?? this.elevation,
      motion: motion ?? this.motion,
    );
  }

  @override
  EagamiTheme lerp(ThemeExtension<EagamiTheme>? other, double t) {
    if (other is! EagamiTheme) return this;
    return t < 0.5 ? this : other;
  }
}

// =============================================================================
// Colors
// =============================================================================

@immutable
class EagamiColors {
  const EagamiColors({
    required this.textPrimary,
    required this.textSecondary,
    required this.textTertiary,
    required this.textDisabled,
    required this.textInverse,
    required this.textLink,
    required this.textLinkHover,
    required this.surfaceCanvas,
    required this.surfaceBase,
    required this.surfaceSubtle,
    required this.surfaceStripe,
    required this.surfaceStripeSubtle,
    required this.surfaceMuted,
    required this.surfaceEmphasis,
    required this.surfaceElevated,
    required this.surfaceOverlay,
    required this.tooltipSurface,
    required this.tooltipBorder,
    required this.stateHover,
    required this.stateActive,
    required this.borderSubtle,
    required this.borderDefault,
    required this.borderStrong,
    required this.divider,
    required this.borderFocus,
    required this.brandDefault,
    required this.brandHover,
    required this.brandActive,
    required this.brandText,
    required this.brandSubtle,
    required this.brandMuted,
    required this.brandSecondaryDefault,
    required this.brandSecondaryHover,
    required this.brandSecondaryActive,
    required this.brandSecondaryText,
    required this.brandSecondarySubtle,
    required this.brandSecondaryMuted,
    required this.successDefault,
    required this.successSubtle,
    required this.successMuted,
    required this.successText,
    required this.warningDefault,
    required this.warningSubtle,
    required this.warningMuted,
    required this.warningText,
    required this.errorDefault,
    required this.errorSubtle,
    required this.errorMuted,
    required this.errorText,
    required this.infoDefault,
    required this.infoSubtle,
    required this.infoMuted,
    required this.infoText,
  });

  final Color textPrimary;
  final Color textSecondary;
  final Color textTertiary;
  final Color textDisabled;
  final Color textInverse;
  final Color textLink;
  final Color textLinkHover;
  final Color surfaceCanvas;
  final Color surfaceBase;
  final Color surfaceSubtle;
  final Color surfaceStripe;
  final Color surfaceStripeSubtle;
  final Color surfaceMuted;
  final Color surfaceEmphasis;
  final Color surfaceElevated;
  final Color surfaceOverlay;
  final Color tooltipSurface;
  final Color tooltipBorder;
  final Color stateHover;
  final Color stateActive;
  final Color borderSubtle;
  final Color borderDefault;
  final Color borderStrong;
  final Color divider;
  final Color borderFocus;
  final Color brandDefault;
  final Color brandHover;
  final Color brandActive;
  final Color brandText;
  final Color brandSubtle;
  final Color brandMuted;
  final Color brandSecondaryDefault;
  final Color brandSecondaryHover;
  final Color brandSecondaryActive;
  final Color brandSecondaryText;
  final Color brandSecondarySubtle;
  final Color brandSecondaryMuted;
  final Color successDefault;
  final Color successSubtle;
  final Color successMuted;
  final Color successText;
  final Color warningDefault;
  final Color warningSubtle;
  final Color warningMuted;
  final Color warningText;
  final Color errorDefault;
  final Color errorSubtle;
  final Color errorMuted;
  final Color errorText;
  final Color infoDefault;
  final Color infoSubtle;
  final Color infoMuted;
  final Color infoText;

  static const light = EagamiColors(
    textPrimary: Color(0xFF111827),
    textSecondary: Color(0xFF4B5563),
    textTertiary: Color(0xFF9CA3AF),
    textDisabled: Color(0xFF9CA3AF),
    textInverse: Color(0xFFFFFFFF),
    textLink: Color(0xFF2A5B7E),
    textLinkHover: Color(0xFF162F41),
    surfaceCanvas: Color(0xFFFFFFFF),
    surfaceBase: Color(0xFFFFFFFF),
    surfaceSubtle: Color(0xFFF9FAFB),
    surfaceStripe: Color(0xFFF9FAFB),
    surfaceStripeSubtle: Color(0xFFFBFCFC),
    surfaceMuted: Color(0xFFF3F4F6),
    surfaceEmphasis: Color(0xFFF3F4F6),
    surfaceElevated: Color(0xFFFFFFFF),
    surfaceOverlay: Color(0x80000000),
    tooltipSurface: Color(0xFF1A1B21),
    tooltipBorder: Color(0x26FFFFFF),
    stateHover: Color(0xFFF3F4F6),
    stateActive: Color(0xFFE5E7EB),
    borderSubtle: Color(0xFFE5E7EB),
    borderDefault: Color(0xFFE5E7EB),
    borderStrong: Color(0xFF9CA3AF),
    divider: Color(0x1A000000),
    borderFocus: Color(0xFF3674A1),
    brandDefault: Color(0xFF2A5B7E),
    brandHover: Color(0xFF204560),
    brandActive: Color(0xFF162F41),
    brandText: Color(0xFF204560),
    brandSubtle: Color(0xFFECF3F9),
    brandMuted: Color(0xFFD1E3F0),
    brandSecondaryDefault: Color(0xFF506086),
    brandSecondaryHover: Color(0xFF404C6A),
    brandSecondaryActive: Color(0xFF313B51),
    brandSecondaryText: Color(0xFF313B51),
    brandSecondarySubtle: Color(0xFFF3F5FA),
    brandSecondaryMuted: Color(0xFFDCE1EC),
    successDefault: Color(0xFF16A34A),
    successSubtle: Color(0xFFF0FDF4),
    successMuted: Color(0xFFDCFCE7),
    successText: Color(0xFF15803D),
    warningDefault: Color(0xFFD97706),
    warningSubtle: Color(0xFFFFFBEB),
    warningMuted: Color(0xFFFEF3C7),
    warningText: Color(0xFFB45309),
    errorDefault: Color(0xFFDC2626),
    errorSubtle: Color(0xFFFEF2F2),
    errorMuted: Color(0xFFFEE2E2),
    errorText: Color(0xFFB91C1C),
    infoDefault: Color(0xFF0891B2),
    infoSubtle: Color(0xFFECFEFF),
    infoMuted: Color(0xFFCFFAFE),
    infoText: Color(0xFF0E7490),
  );

  static const dark = EagamiColors(
    textPrimary: Color(0xFFF9FAFB),
    textSecondary: Color(0xFFD1D5DB),
    textTertiary: Color(0xFF6B7280),
    textDisabled: Color(0xFF6B7280),
    textInverse: Color(0xFF111827),
    textLink: Color(0xFF7DAFD4),
    textLinkHover: Color(0xFFD1E3F0),
    surfaceCanvas: Color(0xFF030712),
    surfaceBase: Color(0xFF1F2937),
    surfaceSubtle: Color(0xFF374151),
    surfaceStripe: Color(0xFF111827),
    surfaceStripeSubtle: Color(0xFF1A2331),
    surfaceMuted: Color(0xFF374151),
    surfaceEmphasis: Color(0xFF4B5563),
    surfaceElevated: Color(0xFF374151),
    surfaceOverlay: Color(0x80000000),
    tooltipSurface: Color(0xFF1A1B21),
    tooltipBorder: Color(0x26FFFFFF),
    stateHover: Color(0x14FFFFFF),
    stateActive: Color(0x24FFFFFF),
    borderSubtle: Color(0xFF2B3544),
    borderDefault: Color(0xFF9CA3AF),
    borderStrong: Color(0xFFD1D5DB),
    divider: Color(0x1FFFFFFF),
    borderFocus: Color(0xFF3674A1),
    brandDefault: Color(0xFF3674A1),
    brandHover: Color(0xFF2A5B7E),
    brandActive: Color(0xFF204560),
    brandText: Color(0xFF7DAFD4),
    brandSubtle: Color(0x1A4B91C3),
    brandMuted: Color(0x334B91C3),
    brandSecondaryDefault: Color(0xFF506086),
    brandSecondaryHover: Color(0xFF404C6A),
    brandSecondaryActive: Color(0xFF313B51),
    brandSecondaryText: Color(0xFFBBC4D8),
    brandSecondarySubtle: Color(0x1A687AA5),
    brandSecondaryMuted: Color(0x33687AA5),
    successDefault: Color(0xFF16A34A),
    successSubtle: Color(0x2622C55E),
    successMuted: Color(0x4022C55E),
    successText: Color(0xFFBBF7D0),
    warningDefault: Color(0xFFD97706),
    warningSubtle: Color(0x26F59E0B),
    warningMuted: Color(0x40F59E0B),
    warningText: Color(0xFFFDE68A),
    errorDefault: Color(0xFFDC2626),
    errorSubtle: Color(0x26EF4444),
    errorMuted: Color(0x40EF4444),
    errorText: Color(0xFFFECACA),
    infoDefault: Color(0xFF0891B2),
    infoSubtle: Color(0x2606B6D4),
    infoMuted: Color(0x4006B6D4),
    infoText: Color(0xFFA5F3FC),
  );
}

// =============================================================================
// Typography
// =============================================================================

@immutable
class EagamiTypography {
  const EagamiTypography({
    required this.display,
    required this.h1,
    required this.h2,
    required this.h3,
    required this.h4,
    required this.sectionHeading,
    required this.bodyLg,
    required this.bodyMd,
    required this.bodySm,
    required this.labelLg,
    required this.labelMd,
    required this.labelSm,
    required this.helper,
    required this.code,
    required this.kbd,
  });

  final TextStyle display;
  final TextStyle h1;
  final TextStyle h2;
  final TextStyle h3;
  final TextStyle h4;
  final TextStyle sectionHeading;
  final TextStyle bodyLg;
  final TextStyle bodyMd;
  final TextStyle bodySm;
  final TextStyle labelLg;
  final TextStyle labelMd;
  final TextStyle labelSm;
  final TextStyle helper;
  final TextStyle code;
  final TextStyle kbd;

  static const _sans = 'DM Sans';
  static const _brand = 'Syne';
  // Bundled mono face; the upstream mono stack is system fonts only
  static const _mono = 'JetBrains Mono';

  static const base = EagamiTypography(
    display: TextStyle(fontFamily: _sans, fontSize: 48, fontWeight: FontWeight.w700, height: 1.25),
    h1: TextStyle(fontFamily: _sans, fontSize: 36, fontWeight: FontWeight.w700, height: 1.25),
    h2: TextStyle(fontFamily: _sans, fontSize: 30, fontWeight: FontWeight.w600, height: 1.375),
    h3: TextStyle(fontFamily: _sans, fontSize: 24, fontWeight: FontWeight.w600, height: 1.375),
    h4: TextStyle(fontFamily: _sans, fontSize: 20, fontWeight: FontWeight.w600, height: 1.375),
    sectionHeading: TextStyle(fontFamily: _brand, fontSize: 22, fontWeight: FontWeight.w600, height: 1.375),
    bodyLg: TextStyle(fontFamily: _sans, fontSize: 18, fontWeight: FontWeight.w400, height: 1.625),
    bodyMd: TextStyle(fontFamily: _sans, fontSize: 16, fontWeight: FontWeight.w400, height: 1.5),
    bodySm: TextStyle(fontFamily: _sans, fontSize: 14, fontWeight: FontWeight.w400, height: 1.5),
    labelLg: TextStyle(fontFamily: _sans, fontSize: 16, fontWeight: FontWeight.w500, height: 1.25),
    labelMd: TextStyle(fontFamily: _sans, fontSize: 14, fontWeight: FontWeight.w500, height: 1.25),
    labelSm: TextStyle(fontFamily: _sans, fontSize: 12, fontWeight: FontWeight.w500, height: 1.25),
    helper: TextStyle(fontFamily: _sans, fontSize: 13, fontWeight: FontWeight.w400, height: 1.5),
    code: TextStyle(fontFamily: _mono, fontSize: 14, fontWeight: FontWeight.w400),
    kbd: TextStyle(fontFamily: _mono, fontSize: 13, fontWeight: FontWeight.w500),
  );
}

// =============================================================================
// Spacing
// =============================================================================

@immutable
class EagamiSpacing {
  const EagamiSpacing();

  // Base scale, only these values are permitted (see § 1.1).
  double get s0 => 0;
  double get s1 => 4;
  double get s2 => 8;
  double get s3 => 12;
  double get s4 => 16;
  double get s6 => 24;
  double get s8 => 32;
  double get s12 => 48;
  double get s16 => 64;

  // Semantic shortcuts, size mapping for component paddings/gaps
  double get xs => s1;
  double get sm => s2;
  double get md => s4;
  double get lg => s6;
  double get xl => s8;

  // Insets (component padding). Some insets use values off the public
  // 10-value scale internally; treat them as opaque tokens and reach for
  // them through this API rather than constructing EdgeInsets directly.
  EdgeInsets get insetXs => const EdgeInsets.symmetric(vertical: 4, horizontal: 8);
  EdgeInsets get insetSm => const EdgeInsets.symmetric(vertical: 6, horizontal: 12);
  EdgeInsets get insetMd => const EdgeInsets.symmetric(vertical: 8, horizontal: 16);
  EdgeInsets get insetLg => const EdgeInsets.symmetric(vertical: 12, horizontal: 24);
  EdgeInsets get insetXl => const EdgeInsets.symmetric(vertical: 16, horizontal: 32);

  // Stack (vertical gap)
  double get stack2xs => 4;
  double get stackXs => 8;
  double get stackSm => 12;
  double get stackMd => 16;
  double get stackLg => 24;
  double get stackXl => 32;
  double get stack2xl => 48;

  // Inline (horizontal gap)
  double get inline2xs => 4;
  double get inlineXs => 8;
  double get inlineSm => 12;
  double get inlineMd => 16;
  double get inlineLg => 24;

  static const base = EagamiSpacing();
}

// =============================================================================
// Shape
// =============================================================================

@immutable
class EagamiRadius {
  const EagamiRadius();

  BorderRadius get none => BorderRadius.zero;
  BorderRadius get xs => BorderRadius.circular(2);
  BorderRadius get sm => BorderRadius.circular(4);
  BorderRadius get md => BorderRadius.circular(6);
  BorderRadius get lg => BorderRadius.circular(8);
  BorderRadius get xl => BorderRadius.circular(12);
  BorderRadius get xxl => BorderRadius.circular(16);
  BorderRadius get xxxl => BorderRadius.circular(24);
  BorderRadius get full => BorderRadius.circular(9999);

  static const base = EagamiRadius();
}

@immutable
class EagamiBorderWidth {
  const EagamiBorderWidth();

  double get none => 0;
  double get thin => 1;
  double get medium => 2;
  double get thick => 4;

  static const base = EagamiBorderWidth();
}

// =============================================================================
// Elevation
// =============================================================================

@immutable
class EagamiElevation {
  const EagamiElevation({
    required this.none,
    required this.xs,
    required this.sm,
    required this.md,
    required this.lg,
    required this.xl,
    required this.xxl,
  });

  final List<BoxShadow> none;
  final List<BoxShadow> xs;
  final List<BoxShadow> sm;
  final List<BoxShadow> md;
  final List<BoxShadow> lg;
  final List<BoxShadow> xl;
  final List<BoxShadow> xxl;

  // Focus rings are theme-independent (light/dark share the same values).
  List<BoxShadow> get focusRing => const [
        BoxShadow(spreadRadius: 3, color: Color(0x733B82F6)),
      ];
  List<BoxShadow> get focusRingError => const [
        BoxShadow(spreadRadius: 3, color: Color(0xFFFECACA)),
      ];
  List<BoxShadow> get focusRingSuccess => const [
        BoxShadow(spreadRadius: 3, color: Color(0xFFBBF7D0)),
      ];

  // Z-index constants (for Stack ordering / overlay layering)
  int get zBase => 0;
  int get zRaised => 10;
  int get zDropdown => 100;
  int get zSticky => 200;
  int get zOverlay => 300;
  int get zModal => 400;
  int get zPopover => 500;
  int get zToast => 600;
  int get zTooltip => 700;

  static const light = EagamiElevation(
    none: [],
    xs: [
      BoxShadow(offset: Offset(0, 1), blurRadius: 2, color: Color(0x0D000000)),
    ],
    sm: [
      BoxShadow(offset: Offset(0, 1), blurRadius: 3, color: Color(0x1A000000)),
      BoxShadow(offset: Offset(0, 1), blurRadius: 2, spreadRadius: -1, color: Color(0x1A000000)),
    ],
    md: [
      BoxShadow(offset: Offset(0, 4), blurRadius: 6, spreadRadius: -1, color: Color(0x1A000000)),
      BoxShadow(offset: Offset(0, 2), blurRadius: 4, spreadRadius: -2, color: Color(0x1A000000)),
    ],
    lg: [
      BoxShadow(offset: Offset(0, 10), blurRadius: 15, spreadRadius: -3, color: Color(0x1A000000)),
      BoxShadow(offset: Offset(0, 4), blurRadius: 6, spreadRadius: -4, color: Color(0x1A000000)),
    ],
    xl: [
      BoxShadow(offset: Offset(0, 20), blurRadius: 25, spreadRadius: -5, color: Color(0x1A000000)),
      BoxShadow(offset: Offset(0, 8), blurRadius: 10, spreadRadius: -6, color: Color(0x1A000000)),
    ],
    xxl: [
      BoxShadow(offset: Offset(0, 25), blurRadius: 50, spreadRadius: -12, color: Color(0x40000000)),
    ],
  );

  // Dark drop shadows stay black (deeper than light) rather than flipping to
  // white, which would read as a glow. The upstream tokens also append a
  // hairline top highlight (inset (0,1) at 6% white) to every non-none level;
  // Flutter's BoxShadow has no inset, so paint that separately (a top-edge
  // gradient stop or a 1px translucent-white top border on the surface).
  // The upstream inner, bevel, and well tokens are inset-only and are
  // likewise not modelled here; see § 2.7 for how to approximate them.

  static const dark = EagamiElevation(
    none: [],
    xs: [
      BoxShadow(offset: Offset(0, 1), blurRadius: 2, color: Color(0x66000000)),
    ],
    sm: [
      BoxShadow(offset: Offset(0, 1), blurRadius: 3, color: Color(0x80000000)),
      BoxShadow(offset: Offset(0, 1), blurRadius: 2, spreadRadius: -1, color: Color(0x66000000)),
    ],
    md: [
      BoxShadow(offset: Offset(0, 4), blurRadius: 8, spreadRadius: -2, color: Color(0x8C000000)),
      BoxShadow(offset: Offset(0, 2), blurRadius: 4, spreadRadius: -2, color: Color(0x66000000)),
    ],
    lg: [
      BoxShadow(offset: Offset(0, 12), blurRadius: 20, spreadRadius: -4, color: Color(0x99000000)),
      BoxShadow(offset: Offset(0, 4), blurRadius: 8, spreadRadius: -4, color: Color(0x73000000)),
    ],
    xl: [
      BoxShadow(offset: Offset(0, 20), blurRadius: 28, spreadRadius: -6, color: Color(0xA6000000)),
      BoxShadow(offset: Offset(0, 8), blurRadius: 12, spreadRadius: -6, color: Color(0x80000000)),
    ],
    xxl: [
      BoxShadow(offset: Offset(0, 28), blurRadius: 50, spreadRadius: -12, color: Color(0xBF000000)),
    ],
  );
}

// =============================================================================
// Motion
// =============================================================================

@immutable
class EagamiMotion {
  const EagamiMotion();

  Duration get instant => Duration.zero;
  Duration get fast => const Duration(milliseconds: 100);
  Duration get normal => const Duration(milliseconds: 200);
  Duration get slow => const Duration(milliseconds: 300);
  Duration get slower => const Duration(milliseconds: 500);

  Curve get easeLinear => Curves.linear;
  Curve get easeIn => const Cubic(0.4, 0, 1, 1);
  Curve get easeOut => const Cubic(0, 0, 0.2, 1);
  Curve get easeInOut => const Cubic(0.4, 0, 0.2, 1);
  Curve get easeSpring => const Cubic(0.34, 1.56, 0.64, 1);

  static const base = EagamiMotion();
}
```

<!-- eagami:generated:flutter-theme end -->

### 3.3 Context extension (ergonomic access)

Create `lib/theme/eagami_context.dart`:

```dart
import 'package:flutter/material.dart';
import 'eagami_theme.dart';

extension EagamiContext on BuildContext {
  EagamiTheme get eagami =>
      Theme.of(this).extension<EagamiTheme>() ?? EagamiTheme.light;

  /// Returns a motion duration that collapses to zero when the user has
  /// requested reduced motion. Use this at every animation site instead of
  /// passing the raw token duration directly.
  Duration eagamiDuration(Duration base) {
    final disabled = MediaQuery.maybeDisableAnimationsOf(this) ?? false;
    return disabled ? Duration.zero : base;
  }
}
```

### 3.4 Wire up `MaterialApp`

In `main.dart` (or wherever the root `MaterialApp` lives):

```dart
import 'package:flutter/material.dart';
import 'theme/eagami_theme.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'My App',
      theme: ThemeData.light().copyWith(
        extensions: const [EagamiTheme.light],
        scaffoldBackgroundColor: EagamiTheme.light.colors.surfaceCanvas,
      ),
      darkTheme: ThemeData.dark().copyWith(
        extensions: const [EagamiTheme.dark],
        scaffoldBackgroundColor: EagamiTheme.dark.colors.surfaceCanvas,
      ),
      themeMode: ThemeMode.system,
      home: const HomePage(),
    );
  }
}
```

### 3.5 Brand palette derivation

The upstream Angular library accepts a single brand hex via `provideEagamiUi({ palette: { primary: { base: '#…' } } })` and derives a full ten-shade scale in [OKLCH](https://www.w3.org/TR/css-color-4/#ok-lab) space, holding hue and chroma steady while stepping lightness. Every brand-role pairing (text-on-surface, surface-on-canvas) is asserted against WCAG 2.1 AA at bootstrap; a contrast violation throws before the app loads.

The Flutter integration uses compile-time `EagamiColors` constants, so the same workflow is offline: pick a base hex, derive the ten shades, paste the resulting `Color(0xFF…)` values into the `EagamiColors.light` and `EagamiColors.dark` constants for the four primary roles (`brandDefault`, `brandHover`, `brandActive`, `brandText`). A small Dart helper (mirroring `packages/ui/src/lib/palette/derive-palette.ts` in the upstream repo) can do the OKLCH derivation in a `tool/` script:

```dart
import 'package:flutter/material.dart';

// Target OKLCH lightness for each shade, matching the upstream scale.
const _targetL = <int, double>{
  50: 0.96,  100: 0.90, 200: 0.82, 300: 0.72, 400: 0.62,
  500: 0.52, 600: 0.42, 700: 0.34, 800: 0.26, 900: 0.18,
};

/// Derive a 10-shade scale by stepping OKLCH lightness around an anchor hex.
/// Use a package like `flutter_oklch` or `colorhash` for the actual conversion,
/// or shell out to a CSS-color-4 OKLCH library.
Map<int, Color> derivePrimaryScale(Color base) {
  // Convert base -> OKLCH, then for each shade rebuild with target L,
  // base C, base H, and re-encode as a Color(0xFF…) value.
  // (Implementation depends on the OKLCH package you choose.)
  throw UnimplementedError('Wire up to your OKLCH package of choice.');
}
```

Run the helper in a one-off script when picking a new brand colour and copy the result into `EagamiColors`. For brand books that pin specific hexes, override individual shades after derivation. After regenerating, verify with the Flutter inspector that text-on-surface and surface-on-canvas pairs still meet AA; the Angular library does this assertion at bootstrap; with compile-time constants you assert manually.

---

## 4. Usage patterns

### 4.1 Do

```dart
import 'package:flutter/material.dart';
import '../theme/eagami_context.dart';

class InfoCard extends StatelessWidget {
  const InfoCard({super.key, required this.title, required this.body});
  final String title;
  final String body;

  @override
  Widget build(BuildContext context) {
    final t = context.eagami;
    return Container(
      padding: t.spacing.insetLg,
      decoration: BoxDecoration(
        // surfaceElevated, not surfaceBase: the card floats above the page.
        color: t.colors.surfaceElevated,
        borderRadius: t.radius.lg,
        border: Border.all(
          color: t.colors.borderDefault,
          width: t.borderWidth.thin,
        ),
        boxShadow: t.elevation.sm,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: t.typography.h4.copyWith(color: t.colors.textPrimary)),
          SizedBox(height: t.spacing.sm),
          Text(body, style: t.typography.bodyMd.copyWith(color: t.colors.textSecondary)),
        ],
      ),
    );
  }
}
```

### 4.2 Don't

```dart
// Hard-coded colors, spacing, and typography
Container(
  padding: const EdgeInsets.all(15), // not on the scale
  decoration: BoxDecoration(
    color: const Color(0xFFFFFFFF), // use t.colors.surfaceElevated
    borderRadius: BorderRadius.circular(10), // not a radius token
    border: Border.all(color: Colors.grey), // use t.colors.borderDefault
  ),
  child: const Text(
    'Hello',
    style: TextStyle(fontSize: 17, fontWeight: FontWeight.w600), // use t.typography.*
  ),
)
```

### 4.3 Focus-aware button

```dart
class EagamiFocusableButton extends StatefulWidget {
  const EagamiFocusableButton({super.key, required this.onPressed, required this.child});
  final VoidCallback onPressed;
  final Widget child;

  @override
  State<EagamiFocusableButton> createState() => _EagamiFocusableButtonState();
}

class _EagamiFocusableButtonState extends State<EagamiFocusableButton> {
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final t = context.eagami;
    return FocusableActionDetector(
      onFocusChange: (v) => setState(() => _focused = v),
      actions: {
        ActivateIntent: CallbackAction<ActivateIntent>(
          onInvoke: (_) { widget.onPressed(); return null; },
        ),
      },
      child: GestureDetector(
        onTap: widget.onPressed,
        child: AnimatedContainer(
          duration: context.eagamiDuration(t.motion.fast),
          curve: t.motion.easeOut,
          padding: t.spacing.insetMd,
          decoration: BoxDecoration(
            color: t.colors.brandDefault,
            borderRadius: t.radius.md,
            boxShadow: _focused ? t.elevation.focusRing : null,
          ),
          child: DefaultTextStyle(
            style: t.typography.labelMd.copyWith(color: t.colors.textInverse),
            child: widget.child,
          ),
        ),
      ),
    );
  }
}
```

---

## 5. Component API conventions

When building Flutter widgets that mirror Eagami components, preserve the property names, variant enums, and default values below. This keeps behaviour predictable across Angular and Flutter.

All sized components share a single `EagamiSize` enum:

```dart
/// Visual size shared by every sized Eagami component.
enum EagamiSize { xs, sm, md, lg, xl }
```

Panel-style components that can also fill their axis (dialog, drawer) use a widened scale that adds a full-bleed option on top of the standard five:

```dart
/// Size scale for width/panel components, adding a full-bleed option.
enum EagamiWidth { xs, sm, md, lg, xl, full }
```

Form controls that surface an error state expose the same pair of inputs everywhere: `hint` for helper text and `errorMsg` for the error string. The presence of `errorMsg` (non-null, non-empty) is what flips the field into the error state, there is no separate `status` enum.

### 5.1 Button

```dart
enum ButtonVariant { primary, secondary, ghost, danger }
enum ButtonType { button, submit, reset } // rarely relevant in Flutter but preserve the enum

class EagamiButton extends StatelessWidget {
  const EagamiButton({
    super.key,
    required this.onPressed,
    required this.child,
    this.variant = ButtonVariant.primary,
    this.size = EagamiSize.md,
    this.type = ButtonType.button,
    this.disabled = false,
    this.loading = false,
    this.fullWidth = false,
    this.icon,
    this.ariaLabel,
    this.ariaCurrent,
  });

  final VoidCallback? onPressed;
  final Widget child;
  final ButtonVariant variant;
  final EagamiSize size;
  final ButtonType type;
  final bool disabled;
  final bool loading;
  final bool fullWidth;
  final Widget? icon; // optional leading icon widget
  final String? ariaLabel;
  final String? ariaCurrent;
}
```

**Behaviour:**
- `disabled || loading` disables the tap target.
- `loading` shows a spinner and disables activation, but preserves the button's rendered width.
- `fullWidth: true` stretches to the parent's width.
- Hover on desktop: background shifts to `brandHover` / `brandActive` (via `MouseRegion`).
- `ariaCurrent` mirrors the HTML `aria-current` attribute used by pagination controls.

### 5.2 Input (TextField)

```dart
enum InputType { text, email, password, number, search, tel, url }

class EagamiInput extends StatefulWidget {
  const EagamiInput({
    super.key,
    this.label,
    this.type = InputType.text,
    this.placeholder = '',
    this.size = EagamiSize.md,
    this.hint,
    this.errorMsg,
    this.disabled = false,
    this.readonly = false,
    this.required = false,
    this.clearable = false,
    this.autocomplete,
    this.autofocus = false,
    this.showPasswordToggle = true,
    this.icon,
    this.list,
    this.min,
    this.max,
    this.step,
    this.minLength,
    this.maxLength,
    this.value,
    this.onChanged,
    this.onFocused,
    this.onBlurred,
  });

  final String? label;
  final InputType type;
  final String placeholder;
  final EagamiSize size;
  final String? hint;
  final String? errorMsg;
  final bool disabled;
  final bool readonly;
  final bool required;
  final bool clearable; // renders a clear (x) button when the field has a value
  final String? autocomplete;
  final bool autofocus;
  final bool showPasswordToggle;
  final Widget? icon; // optional leading icon widget
  final String? list; // id of a native datalist for suggestions
  final num? min; // number-type bound
  final num? max; // number-type bound
  final num? step; // number-type increment
  final int? minLength;
  final int? maxLength;
  final String? value;
  final ValueChanged<String>? onChanged;
  final ValueChanged<FocusEvent>? onFocused;
  final ValueChanged<FocusEvent>? onBlurred;
}
```

**Behaviour:**
- A non-null/non-empty `errorMsg` forces the field into the error state. There is no `status` enum; `errorMsg` alone drives the visual.
- `hint` displays below the input; replaced by `errorMsg` when the latter is present.
- For `type: InputType.password`, the field renders a built-in show/hide toggle when `showPasswordToggle: true` (the default). The toggle is keyboard-reachable.
- `clearable: true` renders a clear button while the field holds a value; `min`/`max`/`step` apply to `InputType.number`.

### 5.3 Textarea

```dart
enum TextareaResize { none, vertical, horizontal, both }

class EagamiTextarea extends StatefulWidget {
  const EagamiTextarea({
    super.key,
    this.label,
    this.placeholder = '',
    this.size = EagamiSize.md,
    this.hint,
    this.errorMsg,
    this.disabled = false,
    this.readonly = false,
    this.required = false,
    this.resize = TextareaResize.vertical,
    this.minHeight,
    this.maxHeight,
    this.maxlength,
    this.value,
    this.onChanged,
    this.onFocused,
    this.onBlurred,
  });

  final String? label;
  final String placeholder;
  final EagamiSize size;
  final String? hint;
  final String? errorMsg;
  final bool disabled;
  final bool readonly;
  final bool required;
  final TextareaResize resize;
  final double? minHeight; // minimum height in logical pixels (auto-grow floor)
  final double? maxHeight; // maximum height in logical pixels (auto-grow ceiling)
  final int? maxlength;
  final String? value;
  final ValueChanged<String>? onChanged;
  final ValueChanged<FocusEvent>? onFocused;
  final ValueChanged<FocusEvent>? onBlurred;
}
```

The upstream `rows` input was removed; size the field with `minHeight` / `maxHeight` instead. The textarea auto-grows with content between those bounds.

### 5.4 Checkbox

```dart
class EagamiCheckbox extends StatelessWidget {
  const EagamiCheckbox({
    super.key,
    required this.checked,
    required this.onChanged,
    this.label,
    this.hint,
    this.errorMsg,
    this.size = EagamiSize.md,
    this.disabled = false,
    this.required = false,
    this.indeterminate = false,
    this.count,
    this.ariaLabel,
  });

  final bool checked;
  final ValueChanged<bool>? onChanged;
  final String? label;
  final String? hint;
  final String? errorMsg;
  final EagamiSize size;
  final bool disabled;
  final bool required;
  final bool indeterminate;
  final Object? count; // optional String or num shown as a trailing count next to the label
  final String? ariaLabel;
}
```

### 5.5 Switch

```dart
class EagamiSwitch extends StatelessWidget {
  const EagamiSwitch({
    super.key,
    required this.checked,
    required this.onChanged,
    this.label,
    this.hint,
    this.errorMsg,
    this.size = EagamiSize.md,
    this.disabled = false,
    this.required = false,
    this.ariaLabel,
  });

  final bool checked;
  final ValueChanged<bool>? onChanged;
  final String? label;
  final String? hint;
  final String? errorMsg;
  final EagamiSize size;
  final bool disabled;
  final bool required;
  final String? ariaLabel;
}
```

### 5.6 Radio group

```dart
enum RadioOrientation { vertical, horizontal }

class EagamiRadioGroup<T> extends StatelessWidget {
  const EagamiRadioGroup({
    super.key,
    required this.value,
    required this.onChanged,
    required this.children,
    this.name,
    this.label,
    this.hint,
    this.errorMsg,
    this.size = EagamiSize.md,
    this.orientation = RadioOrientation.vertical,
    this.disabled = false,
    this.required = false,
    this.ariaLabel,
  });

  final T value;
  final ValueChanged<T>? onChanged;
  final List<EagamiRadio<T>> children;
  final String? name;
  final String? label;
  final String? hint;
  final String? errorMsg;
  final EagamiSize size;
  final RadioOrientation orientation;
  final bool disabled;
  final bool required;
  final String? ariaLabel;
}

class EagamiRadio<T> extends StatelessWidget {
  const EagamiRadio({
    super.key,
    required this.value,
    this.label,
    this.disabled = false,
  });

  final T value;
  final String? label;
  final bool disabled;
}
```

The radio label sits vertically centred against the radio circle (top-aligned in 0.x). Match that vertical alignment in the Flutter render.

### 5.7 Card

```dart
enum CardVariant { elevated, outlined, filled }
enum CardPadding { none, sm, md, lg, xl }
enum CardHeaderAlign { start, center, end }

class EagamiCard extends StatelessWidget {
  const EagamiCard({
    super.key,
    required this.child,
    this.variant = CardVariant.elevated,
    this.padding = CardPadding.md,
    this.fullWidth = false,
    this.headerAlign = CardHeaderAlign.center,
    this.headerDivider = false,
    this.header,
    this.footer,
  });

  final Widget child;
  final CardVariant variant;
  final CardPadding padding;
  final bool fullWidth;
  final CardHeaderAlign headerAlign;
  final bool headerDivider;
  final Widget? header;
  final Widget? footer;
}
```

**Behaviour:**
- `header` and `footer` are content-slot widgets (matching the Angular `slot="header"` / `slot="footer"` pattern).
- `headerDivider: true` renders a divider between the header and the body.
- `variant: elevated` carries a hairline border in addition to the shadow so the top edge stays visible when shadows alone cannot define elevation (notably dark mode).

### 5.8 Dialog

```dart
// The width scale mirrors the shared EagamiWidth (xs..xl plus full).
Future<T?> showEagamiDialog<T>({
  required BuildContext context,
  required WidgetBuilder builder,
  EagamiWidth width = EagamiWidth.md,
  bool closeOnBackdrop = true,
  bool closeOnEscape = true,
  bool showClose = true,
  Widget? header,
  Widget? footer,
  String? ariaLabel,
});
```

The panel width is `width` (named `width`, not `size`), defaulting to `md`. `closeOnBackdrop`/`closeOnEscape` default to `true`. When the dialog closes, restore focus to the element that was focused at the time it opened.

### 5.9 Drawer

```dart
// `start`/`end` are direction-aware and resolve to left/right per the active
// text direction (LTR: start = left; RTL: start = right).
enum DrawerPosition { left, right, top, bottom, start, end }
enum DrawerMode { overlay, push }
enum DrawerAnimation { none, linear, eased }

Future<T?> showEagamiDrawer<T>({
  required BuildContext context,
  required WidgetBuilder builder,
  DrawerPosition position = DrawerPosition.right,
  EagamiWidth size = EagamiWidth.md,
  DrawerMode mode = DrawerMode.overlay,
  Object? pushTarget, // a widget key / GlobalKey (or selector) whose content is shoved aside in push mode
  DrawerAnimation animation = DrawerAnimation.eased,
  bool closeOnBackdrop = true,
  bool closeOnEscape = true,
  bool showClose = true,
  Widget? header,
  Widget? footer,
  String? ariaLabel,
});
```

**Behaviour:**
- The panel extent is `size` (named `size`, using the shared `EagamiWidth` scale `xs..xl` plus `full`); there is no `width` parameter.
- `position` accepts the four edges plus the direction-aware `start`/`end`.
- `mode: DrawerMode.overlay` (the default) floats the drawer above a scrim; `mode: DrawerMode.push` slides the referenced `pushTarget` content aside instead of overlaying it.
- `animation` selects the slide transition: `none` (no animation), `linear`, or `eased` (the default). Reduced motion still collapses the transition to zero via `context.eagamiDuration`.
- Otherwise behaves like a dialog (modal, focus-trapped, restores focus on close).

### 5.10 Dropdown, Autocomplete, Segmented (single-select controls)

These three components share the `SelectOption` value type, defined once and imported wherever it is needed:

```dart
class SelectOption<T> {
  const SelectOption({required this.value, required this.label, this.disabled = false});
  final T value;
  final String label;
  final bool disabled;
}
```

#### Dropdown

```dart
class EagamiDropdown<T> extends StatefulWidget {
  const EagamiDropdown({
    super.key,
    required this.options,
    required this.value,
    required this.onChanged,
    this.label,
    this.placeholder,
    this.hint,
    this.errorMsg,
    this.size = EagamiSize.md,
    this.disabled = false,
    this.readonly = false,
    this.required = false,
  });

  final List<SelectOption<T>> options;
  final T? value;
  final ValueChanged<T?>? onChanged;
  final String? label;
  final String? placeholder; // falls back to the locale's `dropdown.placeholder`
  final String? hint;
  final String? errorMsg;
  final EagamiSize size;
  final bool disabled;
  final bool readonly;
  final bool required;
}
```

**Keyboard:** ArrowDown opens or moves focus down, ArrowUp moves up, Enter/Space selects, Escape closes. The popup is anchored to the trigger with absolute positioning so it escapes overflow-clipping ancestors.

#### Autocomplete

```dart
class EagamiAutocomplete<T> extends StatefulWidget {
  const EagamiAutocomplete({
    super.key,
    required this.options,
    required this.value,
    required this.onChanged,
    this.label,
    this.placeholder = '',
    this.hint,
    this.errorMsg,
    this.size = EagamiSize.md,
    this.disabled = false,
    this.readonly = false,
    this.required = false,
    this.minLength = 0,
    this.maxResults = 10,
    this.emptyMessage, // falls back to the locale's `autocomplete.empty`
    this.onSelected,
    this.onFocused,
    this.onBlurred,
  });

  final List<SelectOption<T>> options;
  final String value;
  final ValueChanged<String>? onChanged;
  final String? label;
  final String placeholder;
  final String? hint;
  final String? errorMsg;
  final EagamiSize size;
  final bool disabled;
  final bool readonly;
  final bool required;
  final int minLength;
  final int maxResults;
  final String? emptyMessage;
  final ValueChanged<SelectOption<T>>? onSelected;
  final ValueChanged<FocusEvent>? onFocused;
  final ValueChanged<FocusEvent>? onBlurred;
}
```

Filters options by case-insensitive substring on `label`. Emits `onChanged` for every text edit, `onSelected` only when the user picks a suggestion.

#### Segmented

```dart
class EagamiSegmented<T> extends StatelessWidget {
  const EagamiSegmented({
    super.key,
    required this.options,
    required this.value,
    required this.onChanged,
    this.label,
    this.hint,
    this.errorMsg,
    this.size = EagamiSize.md,
    this.disabled = false,
    this.required = false,
    this.fullWidth = false,
    this.ariaLabel,
  });

  final List<SelectOption<T>> options;
  final T value;
  final ValueChanged<T>? onChanged;
  final String? label;
  final String? hint;
  final String? errorMsg;
  final EagamiSize size;
  final bool disabled;
  final bool required;
  final bool fullWidth;
  final String? ariaLabel;
}
```

Implements `radiogroup` semantics with full keyboard support (arrow keys to move, Home/End to jump to ends, Enter/Space to select).

### 5.11 Date picker

```dart
enum DatePickerFormat { short, medium, long }
enum DatePickerWeekStart { sunday, monday } // 0 = Sunday, 1 = Monday

class EagamiDatePicker extends StatefulWidget {
  const EagamiDatePicker({
    super.key,
    required this.value,
    required this.onChanged,
    this.label,
    this.placeholder, // falls back to locale `datePicker.placeholder`
    this.hint,
    this.errorMsg,
    this.size = EagamiSize.md,
    this.disabled = false,
    this.readonly = false,
    this.required = false,
    this.minDate,
    this.maxDate,
    this.format = DatePickerFormat.medium,
    this.weekStartsOn = DatePickerWeekStart.monday,
    this.locale, // explicit locale, else the active EagamiI18n locale
  });

  final DateTime? value;
  final ValueChanged<DateTime?>? onChanged;
  final String? label;
  final String? placeholder;
  final String? hint;
  final String? errorMsg;
  final EagamiSize size;
  final bool disabled;
  final bool readonly;
  final bool required;
  final DateTime? minDate;
  final DateTime? maxDate;
  final DatePickerFormat format;
  final DatePickerWeekStart weekStartsOn;
  final String? locale;
}
```

**Behaviour:**
- Value is a `DateTime` at local midnight (or `null`).
- Format strings are locale-aware: `short` / `medium` / `long` map to the equivalent `intl` `DateFormat` presets, formatted in `locale` or the active `EagamiI18n` locale.
- Calendar grid receives focus on open so keyboard users land on the focused day immediately.
- **Keyboard:** arrows move by day, PageUp/PageDown by month (Shift = year), Home/End jump to the start/end of the week, Enter/Space selects, Escape closes.

### 5.12 Code input

```dart
class EagamiCodeInput extends StatefulWidget {
  const EagamiCodeInput({
    super.key,
    required this.value,
    required this.onChanged,
    this.label,
    this.placeholder = '',
    this.length = 6,
    this.size = EagamiSize.md,
    this.hint,
    this.errorMsg,
    this.disabled = false,
    this.readonly = false,
    this.required = false,
    this.allowAllChars = false,
    this.onCompleted,
  });

  final String value;
  final ValueChanged<String>? onChanged;
  final String? label;
  final String placeholder;
  final int length;
  final EagamiSize size;
  final String? hint;
  final String? errorMsg;
  final bool disabled;
  final bool readonly;
  final bool required;
  final bool allowAllChars; // when false (default), restrict entry to digits; true accepts any character
  final ValueChanged<String>? onCompleted;
}
```

Auto-advances on input, supports paste of the full code at once, ArrowLeft/ArrowRight for navigation, Backspace clears the current digit (or the previous one if already empty). Emits `onCompleted` with the full string once every digit is filled. Internally, the per-digit accessible name comes from the locale's `codeInput.digitLabel(index, length)`.

### 5.13 Slider

```dart
class EagamiSlider extends StatefulWidget {
  const EagamiSlider({
    super.key,
    required this.value,
    required this.onChanged,
    this.label,
    this.hint,
    this.errorMsg,
    this.min = 0,
    this.max = 100,
    this.step = 1,
    this.size = EagamiSize.md,
    this.disabled = false,
    this.required = false,
    this.hasError = false,
    this.showValue = false,
    this.showMinMaxLabels = false,
    this.groupThousands = true,
    this.formatValue,
    this.ariaLabel,
  });

  final double value;
  final ValueChanged<double>? onChanged;
  final String? label;
  final String? hint;
  final String? errorMsg;
  final double min;
  final double max;
  final double step;
  final EagamiSize size;
  final bool disabled;
  final bool required;
  final bool hasError; // forces the error visual without an errorMsg string
  final bool showValue;
  final bool showMinMaxLabels;
  final bool groupThousands; // thousands separators in the displayed value
  final String Function(double value)? formatValue;
  final String? ariaLabel;
}
```

**Keyboard:** arrows step by `step`, PageUp/PageDown by `max(step * 10, range / 10)`, Home/End jump to bounds. Snap-clamp emitted values to the configured `min`/`max`/`step`. Either a non-empty `errorMsg` or `hasError: true` flips the slider into the error state.

### 5.14 Tabs

```dart
enum TabsVariant { underline, filled }

class EagamiTabs extends StatefulWidget {
  const EagamiTabs({
    super.key,
    required this.activeTab,
    required this.onChanged,
    required this.children,
    this.variant = TabsVariant.underline,
    this.size = EagamiSize.md,
  });

  final String activeTab;
  final ValueChanged<String>? onChanged;
  final List<EagamiTab> children;
  final TabsVariant variant;
  final EagamiSize size;
}

class EagamiTab extends StatelessWidget {
  const EagamiTab({
    super.key,
    required this.value,
    required this.label,
    required this.child,
    this.disabled = false,
  });

  final String value;
  final String label;
  final Widget child;
  final bool disabled;
}
```

**Keyboard:** ArrowLeft / ArrowRight move between tabs (wraps); Home / End jump to first/last enabled tab. The tab panel itself is focusable so keyboard users can scroll through its content.

### 5.15 Accordion

```dart
class EagamiAccordion extends StatefulWidget {
  const EagamiAccordion({
    super.key,
    required this.children,
    this.multi = false,
  });

  final List<EagamiAccordionItem> children;
  final bool multi; // when true, multiple items can stay expanded
}

class EagamiAccordionItem extends StatelessWidget {
  const EagamiAccordionItem({
    super.key,
    required this.value,
    required this.label,
    required this.child,
    this.disabled = false,
  });

  final String value;
  final String label;
  final Widget child;
  final bool disabled;
}
```

### 5.16 Menu

```dart
enum MenuPlacement { bottomStart, bottomEnd, topStart, topEnd }
enum MenuItemVariant { defaultItem, danger }

class EagamiMenu extends StatefulWidget {
  const EagamiMenu({
    super.key,
    required this.children,
    required this.trigger, // widget that opens the menu (e.g. EagamiButton)
    this.placement = MenuPlacement.bottomStart,
    this.maxHeight = '20rem',
    this.disabled = false,
    this.ariaLabel,
    this.onOpened,
    this.onClosed,
  });

  final List<EagamiMenuItem> children;
  final Widget trigger;
  final MenuPlacement placement;
  final String maxHeight; // max popup height before the list scrolls (CSS length string upstream)
  final bool disabled;
  final String? ariaLabel;
  final VoidCallback? onOpened;
  final VoidCallback? onClosed;
}

class EagamiMenuItem extends StatelessWidget {
  const EagamiMenuItem({
    super.key,
    required this.onPressed,
    required this.child,
    this.icon,
    this.disabled = false,
    this.variant = MenuItemVariant.defaultItem,
  });

  final VoidCallback onPressed;
  final Widget child;
  final Widget? icon;
  final bool disabled;
  final MenuItemVariant variant;
}
```

**Behaviour:**
- The menu's trigger element receives `aria-haspopup="menu"`, `aria-expanded`, and `aria-controls` directly (mirror this on the focusable element in Flutter via `Semantics`).
- The popup is positioned absolutely so it escapes overflow-clipping ancestors.
- Arrow keys move between enabled items; Home / End jump to ends; Escape closes and restores focus to the trigger; outside-click closes without restoring focus.

### 5.17 Breadcrumbs

```dart
enum BreadcrumbsSeparator { chevron, slash }

class BreadcrumbItem {
  const BreadcrumbItem({required this.label, this.href, this.disabled = false});
  final String label;
  final String? href;
  final bool disabled;
}

class BreadcrumbClickEvent {
  const BreadcrumbClickEvent({required this.item, required this.index});
  final BreadcrumbItem item;
  final int index;
}

class EagamiBreadcrumbs extends StatelessWidget {
  const EagamiBreadcrumbs({
    super.key,
    required this.items,
    this.separator = BreadcrumbsSeparator.chevron,
    this.ariaLabel, // falls back to locale `breadcrumbs.label`
    this.onClicked,
  });

  final List<BreadcrumbItem> items;
  final BreadcrumbsSeparator separator;
  final String? ariaLabel;
  final ValueChanged<BreadcrumbClickEvent>? onClicked;
}
```

The final item is always treated as the current page (non-interactive). Items with an `href` render as link-styled; others as buttons.

### 5.18 Paginator

```dart
enum PaginatorAlign { left, center, right }

class PaginatorState {
  const PaginatorState({required this.page, required this.pageSize});
  final int page;
  final int pageSize;
}

class EagamiPaginator extends StatelessWidget {
  const EagamiPaginator({
    super.key,
    required this.totalItems,
    required this.page,
    required this.pageSize,
    required this.onChanged,
    this.pageSizeOptions = const [10, 25, 50, 100],
    this.showPageSizeSelector = true,
    this.showRangeLabel = true,
    this.groupThousands = true,
    this.align = PaginatorAlign.right,
    this.size = EagamiSize.md,
    this.disabled = false,
  });

  final int totalItems;
  final int page;
  final int pageSize;
  final ValueChanged<PaginatorState>? onChanged;
  final List<int> pageSizeOptions;
  final bool showPageSizeSelector;
  final bool showRangeLabel;
  final bool groupThousands; // thousands separators in the range label and totals
  final PaginatorAlign align;
  final EagamiSize size;
  final bool disabled;
}
```

The range label ("1–10 of 47"), the "Rows per page" caption, and the prev/next button labels all come from the locale dictionary (`paginator.range`, `paginator.rowsPerPage`, `paginator.previousPage`, `paginator.nextPage`).

### 5.19 Data table

```dart
enum DataTableDensity { compact, comfortable, spacious }
enum DataTableAlign { left, center, right }

/// Sort direction. `null` means no sort is applied (there is no `none` value).
enum DataTableSortDirection { asc, desc }

class DataTableColumn<T> {
  const DataTableColumn({
    required this.key,
    required this.label,
    this.sortable = false,
    this.align = DataTableAlign.left,
    this.width,
    this.format,
    this.cellBuilder,
    this.headerBuilder,
  });

  final String key;
  final String label;
  final bool sortable;
  final DataTableAlign align;
  final String? width;
  final String Function(Object? value)? format;
  final Widget Function(BuildContext, T row, Object? value)? cellBuilder;
  final Widget Function(BuildContext, DataTableColumn<T> column)? headerBuilder;
}

class DataTableSortState {
  const DataTableSortState({required this.column, this.direction});
  final String column;
  final DataTableSortDirection? direction; // null = unsorted
}

class EagamiDataTable<T> extends StatelessWidget {
  const EagamiDataTable({
    super.key,
    required this.columns,
    required this.data,
    this.sort = const DataTableSortState(column: ''),
    this.onSorted,
    this.trackBy,
    this.density = DataTableDensity.comfortable,
    this.stickyHeader = false,
    this.striped = false,
    this.hoverable = true,
    this.bordered = false,
    this.clickable = false,
    this.navigable = false,
    this.noDataText, // falls back to locale `dataTable.noData`
    this.onRowActivate,
  });

  final List<DataTableColumn<T>> columns;
  final List<T> data;
  final DataTableSortState sort;
  final ValueChanged<DataTableSortState>? onSorted;
  final String? trackBy; // property name used for keying rows (keyof T upstream)
  final DataTableDensity density;
  final bool stickyHeader;
  final bool striped;
  final bool hoverable;
  final bool bordered;
  final bool clickable; // rows become activatable (hover/press affordance + onRowActivate)
  final bool navigable; // roving-tabindex grid keyboard navigation across cells
  final String? noDataText;
  final ValueChanged<T>? onRowActivate; // fires when a row is activated (click / Enter)
}
```

**Behaviour:**
- `sort` is two-way: `direction` is `asc`, `desc`, or `null` (unsorted). Sortable columns cycle `null` → `asc` → `desc` → `null` on header click; clicking a different column starts at `asc`.
- `clickable: true` makes rows activatable and emits `onRowActivate` with the row; `navigable: true` adds roving-tabindex keyboard navigation across cells.
- Use semantic table markup (header cells, row scope, etc.); avoid ARIA `grid`/`row`/`gridcell` roles, the upstream library uses native table semantics with `scope="col"` for screen-reader reliability.
- For horizontal overflow, scroll an inner wrapper rather than the whole component so a sibling paginator is not pulled into the scrolled coordinate space.

### 5.20 Alert

```dart
enum AlertVariant { defaultVariant, success, warning, error, info }

class EagamiAlert extends StatelessWidget {
  const EagamiAlert({
    super.key,
    required this.child,
    this.variant = AlertVariant.defaultVariant,
    this.size = EagamiSize.md,
    this.dismissible = false,
    this.visible = true,
    this.icon,
    this.onDismissed,
  });

  final Widget child;
  final AlertVariant variant;
  final EagamiSize size;
  final bool dismissible;
  final bool visible;
  final Widget? icon; // overrides the variant's default status icon
  final VoidCallback? onDismissed;
}
```

- `error` and `warning` variants render with `role: alert` (interrupting); other variants use `role: status` (polite).
- `size` scales the text, icon, and gap together proportionally.
- The decorative status icon should be marked decorative for screen readers; the dismiss button accessible name comes from the locale's `alert.dismiss`.
- Vertically centre the status icon against the first line of content rather than against the icon container's top edge.

### 5.21 Tag

```dart
enum TagVariant { defaultVariant, success, warning, error, info }

class EagamiTag extends StatelessWidget {
  const EagamiTag({
    super.key,
    required this.child,
    this.variant = TagVariant.defaultVariant,
    this.size = EagamiSize.md,
    this.removable = false,
    this.disabled = false,
    this.removeLabel, // falls back to locale `tag.remove`
    this.onRemoved,
  });

  final Widget child;
  final TagVariant variant;
  final EagamiSize size;
  final bool removable;
  final bool disabled;
  final String? removeLabel;
  final VoidCallback? onRemoved;
}
```

Tags cover semantic statuses only. There is no `primary` variant; for brand-colored chips, style an element directly or use `EagamiBadge`.

### 5.22 Badge

```dart
enum BadgeVariant { defaultVariant, success, warning, error, info }
enum BadgeShape { pill, pin }

class EagamiBadge extends StatelessWidget {
  const EagamiBadge({
    super.key,
    required this.child,
    this.variant = BadgeVariant.defaultVariant,
    this.size = EagamiSize.md,
    this.shape = BadgeShape.pill,
  });

  final Widget child;
  final BadgeVariant variant;
  final EagamiSize size;
  final BadgeShape shape;
}
```

`pill` hugs the content; `pin` renders as a circle for single characters.

### 5.23 Avatar

```dart
enum AvatarShape { circle, square }

class EagamiAvatar extends StatelessWidget {
  const EagamiAvatar({
    super.key,
    this.src,
    this.alt = '',
    this.initials,
    this.size = EagamiSize.md,
    this.shape = AvatarShape.circle,
  });

  final String? src;
  final String alt;
  final String? initials;
  final EagamiSize size;
  final AvatarShape shape;
}
```

Falls back to `initials` when `src` is empty, then to a generic user icon when neither is provided. When `alt` is empty, the accessible name falls back to `initials`.

### 5.24 Avatar editor

```dart
enum AvatarEditorShape { circle, square }

class AvatarEditorCropEvent {
  const AvatarEditorCropEvent({required this.bytes, required this.dataUrl});
  final Uint8List bytes;
  final String dataUrl;
}

class AvatarEditorCropState {
  const AvatarEditorCropState({
    required this.zoom,
    required this.offsetX,
    required this.offsetY,
  });
  final double zoom;
  final double offsetX;
  final double offsetY;
}

class EagamiAvatarEditor extends StatefulWidget {
  const EagamiAvatarEditor({
    super.key,
    this.shape = AvatarEditorShape.circle,
    this.canvasSize = 200,
    this.currentSrc,
    this.loading = false,
    this.accept = 'image/*',
    this.maxFileSize = 5 * 1024 * 1024,
    this.minZoom = 1,
    this.maxZoom = 3,
    this.exportQuality = 0.92,
    this.exportType = 'image/png',
    this.cropState,
    this.onCropped,
    this.onFileSelected,
    this.onRemoved,
    this.onErrored,
    this.onCropStateChanged,
  });

  final AvatarEditorShape shape;
  final double canvasSize;
  final String? currentSrc;
  final bool loading;
  final String accept;
  final int maxFileSize;
  final double minZoom;
  final double maxZoom;
  final double exportQuality;
  final String exportType;
  final AvatarEditorCropState? cropState;
  final ValueChanged<AvatarEditorCropEvent>? onCropped;
  final ValueChanged<File>? onFileSelected;
  final VoidCallback? onRemoved;
  final ValueChanged<String>? onErrored;
  final ValueChanged<AvatarEditorCropState>? onCropStateChanged;
}
```

**Behaviour:**
- Supports drag-and-drop upload, pan via mouse/touch drag, zoom via slider or scroll wheel.
- **Keyboard:** arrow keys pan the image (Shift for larger steps); `+`/`-` zoom in/out.
- Public methods: `captureOriginal()` (snapshot the current image/crop as the new baseline for revert), `revertImage()` (restore the captured baseline), `exportCrop()` (export current crop and emit `onCropped`).
- The hover overlay picks white or black ink based on the loaded photo's average luminance (not the active theme) so the "Change photo" affordance stays readable on both light and dark images.
- Honour `loading: true` by showing a skeleton matching the editor shape (`circle` or `rect`) until the consumer hides it.

### 5.25 Skeleton

```dart
enum SkeletonVariant { text, circle, rect }

class EagamiSkeleton extends StatelessWidget {
  const EagamiSkeleton({
    super.key,
    this.variant = SkeletonVariant.text,
    this.width,
    this.height,
    this.animated = true,
  });

  final SkeletonVariant variant;
  final String? width;
  final String? height;
  final bool animated;
}
```

The pulse animation is automatically suppressed under reduced motion; do not key it off `animated` for that purpose.

### 5.26 Spinner

```dart
class EagamiSpinner extends StatelessWidget {
  const EagamiSpinner({
    super.key,
    this.size = EagamiSize.md,
    this.label, // falls back to locale `spinner.label`
  });

  final EagamiSize size;
  final String? label;
}
```

Under reduced motion, slow the rotation rather than removing it (the spin is the affordance).

### 5.27 Progress bar

```dart
enum ProgressBarVariant { defaultVariant, success, warning, error, info }

class EagamiProgressBar extends StatelessWidget {
  const EagamiProgressBar({
    super.key,
    this.value = 0,
    this.max = 100,
    this.variant = ProgressBarVariant.defaultVariant,
    this.size = EagamiSize.md,
    this.label, // default: undefined; no automatic placeholder
    this.showPercentage = false,
    this.indeterminate = false,
  });

  final double value;
  final double max;
  final ProgressBarVariant variant;
  final EagamiSize size;
  final String? label;
  final bool showPercentage;
  final bool indeterminate;
}
```

Expose `aria-busy: true` while `indeterminate: true`.

### 5.28 Empty state

```dart
enum EmptyStateHeadingLevel { h2, h3, h4, h5, h6 }

class EagamiEmptyState extends StatelessWidget {
  const EagamiEmptyState({
    super.key,
    this.title,
    this.description,
    this.size = EagamiSize.md,
    this.headingLevel = EmptyStateHeadingLevel.h2,
    this.bordered = false,
    this.media,
    this.actions,
  });

  final String? title;
  final String? description;
  final EagamiSize size;
  final EmptyStateHeadingLevel headingLevel;
  final bool bordered;   // dashed frame around the block
  final Widget? media;   // icon or illustration slot
  final Widget? actions; // follow-up button row
}
```

Use `headingLevel` to fit the title into the surrounding document outline. `bordered` renders a dashed frame around the block.

### 5.29 Divider

```dart
enum DividerOrientation { horizontal, vertical }

class EagamiDivider extends StatelessWidget {
  const EagamiDivider({
    super.key,
    this.orientation = DividerOrientation.horizontal,
    this.label, // optional centred label (e.g. "or")
    this.thick = false,
  });

  final DividerOrientation orientation;
  final String? label;
  final bool thick; // renders a heavier rule
}
```

### 5.30 Tooltip

```dart
enum TooltipPosition { top, bottom, left, right }

// Apply via a wrapper widget (the equivalent of [eaTooltip] in Angular).
class EagamiTooltip extends StatelessWidget {
  const EagamiTooltip({
    super.key,
    required this.message,
    required this.child,
    this.position = TooltipPosition.top,
    this.maxWidth = 200,
  });

  final String message;
  final Widget child;
  final TooltipPosition position;
  final double maxWidth; // wrap width in px (50px floor)
}
```

**Behaviour:**
- Show on hover and focus; hide on leave, blur, or Escape.
- `maxWidth` caps the text width so the tooltip wraps at that width, clamped to a 50px floor.
- Suppress hover-triggered tooltips on touch-only devices (touch taps fire `mouseenter` but never `mouseleave`, leaving tooltips latched open). Re-attach pointer listeners reactively when hover capability changes (Bluetooth pointer connects, DevTools mobile mode toggles off, etc.).
- Wire `aria-describedby` on the host element by appending to any existing tokens (not overwriting).

### 5.31 Toast

```dart
enum ToastVariant { defaultVariant, success, warning, error, info }
enum ToastPosition { topLeft, top, topRight, bottomLeft, bottom, bottomRight }

class Toast {
  const Toast({
    required this.id,
    required this.message,
    required this.variant,
    required this.duration, // ms; 0 means manual dismiss only
  });
  final int id;
  final String message;
  final ToastVariant variant;
  final int duration;
}

class ToastOptions {
  const ToastOptions({this.variant = ToastVariant.defaultVariant, this.duration = 4000});
  final ToastVariant variant;
  final int duration;
}

/// Application-wide notification controller. Drive it from a ChangeNotifier /
/// Provider / Riverpod, then render the active list with `EagamiToastOutlet`.
class ToastService extends ChangeNotifier {
  int show(String message, {ToastOptions options = const ToastOptions()});
  int success(String message, {int duration = 4000});
  int error(String message, {int duration = 4000});
  int warning(String message, {int duration = 4000});
  int info(String message, {int duration = 4000});
  void dismiss(int id);
  void clear();
}

class EagamiToastOutlet extends StatelessWidget {
  const EagamiToastOutlet({
    super.key,
    this.position = ToastPosition.bottomRight,
    this.clearable = true,
  });

  final ToastPosition position; // viewport corner/edge the stack pins to
  final bool clearable;         // show a dismiss button on each toast
}
```

**Behaviour:**
- Place a single `EagamiToastOutlet` once near the root of the app so toasts created from anywhere are surfaced.
- `position` pins the toast stack to a viewport corner or edge; `clearable` toggles the per-toast dismiss button.
- `error` and `warning` variants render with `role: alert`; other variants use `role: status`.
- Honour reduced motion by degrading the slide-in to an opacity-only fade (the horizontal translate can trip vestibular sensitivity).
- Dismiss button accessible name comes from the locale's `toast.dismiss`.

### 5.32 Eagami wordmark

```dart
/// default: the bare "eagami" wordmark; byline adds the "handcrafted by"
/// overline; tagline adds the tagline line.
enum EagamiWordmarkVariant { defaultVariant, byline, tagline }
enum EagamiWordmarkLayout { stacked, inline }

class EagamiWordmark extends StatelessWidget {
  const EagamiWordmark({
    super.key,
    this.variant = EagamiWordmarkVariant.defaultVariant,
    this.layout = EagamiWordmarkLayout.stacked,
    this.size = 24, // font size in px of the brand text (continuous, not a preset bucket)
    this.linked = true, // false embeds the lockup without its built-in eagami.com link
  });

  final EagamiWordmarkVariant variant;
  final EagamiWordmarkLayout layout;
  final double size;
  final bool linked;
}
```

The brand name itself stays untranslated. Only the overline ("handcrafted by") and the tagline follow the active locale.

### 5.33 Icons

The upstream library ships an SVG icon set covering core utility, semantic, navigation, household, sports, and brand-mark categories. Each is exported as its own component (e.g. `<ea-icon-bell />`). For Flutter:

- Treat each icon as an `IconData`-equivalent constant (use Flutter's `Icon` widget with a custom font, or render each SVG via `flutter_svg`).
- Default sizing is `1em × 1em` so the icon scales to the inherited font size when placed inside buttons without an explicit size.
- Brand marks ship as two variants: an outline form (`Github`, `Facebook`, `Twitter`, `XTwitter`, `Microsoft`, `Google`) that renders in `currentColor` so it inherits surrounding text colour, and a brand-filled form (`Github2`, `Facebook2`, etc.) that carries a `brand` flag: leave it off to inherit `currentColor`, or set `brand: true` to paint the mark in the official brand colour.
- The icon set is derived from Feather Icons (Cole Bemis, MIT). Brand icons are governed by trademark, not the MIT licence; consult each platform's brand guidelines before redistributing.

### 5.34 Icon button

There is no dedicated `EagamiIconButton` widget in the current library. To render an icon-only button, use `EagamiButton` with `variant: ButtonVariant.ghost` and an icon child, and supply `ariaLabel` so the action is announced verbally.

### 5.35 Color picker

```dart
enum ColorPickerFormat { hex, rgb, hsl, all }

class EagamiColorPicker extends StatefulWidget {
  const EagamiColorPicker({
    super.key,
    required this.value,
    required this.onChanged,
    this.label,
    this.placeholder,
    this.hint,
    this.errorMsg,
    this.size = EagamiSize.md,
    this.format = ColorPickerFormat.all,
    this.presets = kDefaultColorPresets, // pass const [] to hide the preset swatches
    this.showAlpha = true,
    this.disabled = false,
    this.readonly = false,
    this.required = false,
  });

  final String? value; // current color string, two-way bindable (null when unset)
  final ValueChanged<String?>? onChanged;
  final String? label;
  final String? placeholder; // shown on the trigger while no color is selected
  final String? hint;
  final String? errorMsg;
  final EagamiSize size;
  final ColorPickerFormat format; // output format of the emitted value; all keeps the hex/rgb/hsl toggle
  final List<String> presets;
  final bool showAlpha; // shows the alpha slider and includes alpha in the emitted value
  final bool disabled;
  final bool readonly;
  final bool required;
}
```

The trigger opens a popover with a saturation/value area, hue and (optionally) alpha sliders, a preset row, and a hex/RGB input toggle. Where the platform exposes an eyedropper, offer it; otherwise hide that affordance.

### 5.36 Command palette

```dart
class CommandPaletteItem<T> {
  const CommandPaletteItem({
    required this.id,
    required this.label,
    this.description,
    this.icon,
    this.shortcut,
    this.group,
    this.disabled = false,
    this.keywords = const [],
    this.data,
  });

  final String id;
  final String label;
  final String? description; // secondary text below the label
  final Widget? icon;
  final String? shortcut; // decorative shortcut hint on the right edge; the palette binds no global keys
  final String? group; // section heading; ungrouped items render first
  final bool disabled;
  final List<String> keywords; // hidden search synonyms
  final T? data; // passed through to onExecute
}

class EagamiCommandPalette<T> extends StatefulWidget {
  const EagamiCommandPalette({
    super.key,
    required this.items,
    required this.open,
    required this.onOpenChanged,
    required this.onExecute,
    this.placeholder = '',
    this.emptyMessage = '', // falls back to the locale's `commandPalette.empty`
  });

  final List<CommandPaletteItem<T>> items;
  final bool open; // two-way: mirror onOpenChanged back into open
  final ValueChanged<bool>? onOpenChanged;
  final ValueChanged<CommandPaletteItem<T>>? onExecute;
  final String placeholder;
  final String emptyMessage;
}
```

A modal search dialog. The filter matches case-insensitively on `label`, `description`, and `keywords`. Arrow keys move the active row, Enter executes it, Escape closes.

### 5.37 File uploader

```dart
enum FileUploaderRejectionReason { type, size, count }

class FileUploaderRejection {
  const FileUploaderRejection({required this.file, required this.reason});
  final XFile file;
  final FileUploaderRejectionReason reason;
}

class EagamiFileUploader extends StatefulWidget {
  const EagamiFileUploader({
    super.key,
    required this.value,
    required this.onChanged,
    this.label,
    this.hint,
    this.errorMsg,
    this.size = EagamiSize.md,
    this.accept, // comma-separated MIME types / extensions, e.g. 'image/*,.pdf'
    this.multiple = true,
    this.maxFiles,
    this.maxSize, // max size per file in bytes
    this.showFileList = true,
    this.progress, // per-file progress 0-100 keyed by file identity; omit to hide progress bars
    this.disabled = false,
    this.required = false,
    this.onFileRemoved,
    this.onRejected,
  });

  final List<XFile> value; // two-way bindable
  final ValueChanged<List<XFile>>? onChanged;
  final String? label;
  final String? hint;
  final String? errorMsg;
  final EagamiSize size;
  final String? accept;
  final bool multiple;
  final int? maxFiles;
  final int? maxSize;
  final bool showFileList;
  final Map<XFile, double>? progress;
  final bool disabled;
  final bool required;
  final ValueChanged<XFile>? onFileRemoved;
  final ValueChanged<List<FileUploaderRejection>>? onRejected;
}
```

Pure UI: it manages selection, validation, and removal but performs no network I/O. The consumer uploads the resulting files and optionally feeds progress back via `progress`. Files failing the `accept` / `maxFiles` / `maxSize` checks are dropped and reported through `onRejected` with a per-file reason. A dropzone icon slot lets the consumer override the default upload glyph.

### 5.38 Multi-select

Reuses the shared `SelectOption` value type (see § 5.10).

```dart
class EagamiMultiSelect extends StatefulWidget {
  const EagamiMultiSelect({
    super.key,
    required this.options,
    required this.value,
    required this.onChanged,
    this.label,
    this.placeholder,
    this.hint,
    this.errorMsg,
    this.size = EagamiSize.md,
    this.maxVisibleChips = 0, // 0 = no cap; extra selections collapse into a count pill
    this.searchable = true,
    this.searchPlaceholder,
    this.selectAll = true, // tri-state select-all row at the top of the list
    this.disabled = false,
    this.readonly = false,
    this.required = false,
  });

  final List<SelectOption> options;
  final List<String> value; // selected option values, two-way bindable
  final ValueChanged<List<String>>? onChanged;
  final String? label;
  final String? placeholder;
  final String? hint;
  final String? errorMsg;
  final EagamiSize size;
  final int maxVisibleChips;
  final bool searchable;
  final String? searchPlaceholder;
  final bool selectAll;
  final bool disabled;
  final bool readonly;
  final bool required;
}
```

Selected values render as removable chips in the trigger. The popover lists every option with a checkbox; a search field filters by label, and the select-all row toggles the filtered options.

### 5.39 Popover

The low-level anchored surface that dropdown, menu, multi-select, and the pickers are built on. Expose it for custom overlays.

```dart
enum PopoverPlacement { top, topStart, topEnd, bottom, bottomStart, bottomEnd, left, right }
enum PopoverRole { menu, listbox, dialog, tooltip, grid }
enum PopoverScrollBehavior { reposition, close, ignore }

class EagamiPopover extends StatefulWidget {
  const EagamiPopover({
    super.key,
    required this.anchor, // element the popover positions itself against
    required this.child,
    this.open = false,
    this.placement = PopoverPlacement.bottomStart,
    this.role = PopoverRole.dialog,
    this.offset = 2, // gap in px between anchor and surface
    this.flip = true, // flip to the opposite side when the placement overflows
    this.clamp = true, // clamp inside the viewport when it would overflow
    this.matchAnchorWidth = false, // set the surface min-width to the anchor width
    this.closeOnEscape = true,
    this.closeOnOutsideClick = true,
    this.scrollBehavior = PopoverScrollBehavior.reposition,
    this.ariaLabel, // provide when the surface has no visible heading
    this.surfaceId, // DOM id used by triggers via aria-controls
    this.onCloseRequested,
  });

  final GlobalKey anchor;
  final Widget child;
  final bool open;
  final PopoverPlacement placement;
  final PopoverRole role;
  final double offset;
  final bool flip;
  final bool clamp;
  final bool matchAnchorWidth;
  final bool closeOnEscape;
  final bool closeOnOutsideClick;
  final PopoverScrollBehavior scrollBehavior;
  final String? ariaLabel;
  final String? surfaceId;
  final VoidCallback? onCloseRequested; // parent mirrors this into `open`
}
```

`open` is one-way here: the popover asks to close via `onCloseRequested` (Escape, outside click, or a scroll when `scrollBehavior` is `close`), and the parent decides whether to honour it by flipping `open`.

### 5.40 Range slider

```dart
typedef RangeSliderValue = (double low, double high);

class EagamiRangeSlider extends StatefulWidget {
  const EagamiRangeSlider({
    super.key,
    required this.value,
    required this.onChanged,
    this.label,
    this.hint,
    this.errorMsg,
    this.min = 0,
    this.max = 100,
    this.step = 1,
    this.size = EagamiSize.md,
    this.disabled = false,
    this.required = false,
    this.showValue = false,
    this.showMinMaxLabels = false,
    this.groupThousands = true,
    this.formatValue,
    this.ariaLabelLow,
    this.ariaLabelHigh,
  });

  final RangeSliderValue value; // (low, high) tuple, two-way bindable
  final ValueChanged<RangeSliderValue>? onChanged;
  final String? label;
  final String? hint;
  final String? errorMsg;
  final double min;
  final double max;
  final double step;
  final EagamiSize size;
  final bool disabled;
  final bool required;
  final bool showValue;
  final bool showMinMaxLabels;
  final bool groupThousands; // thousands separators in displayed values, ignored when formatValue is set
  final String Function(double value)? formatValue;
  final String? ariaLabelLow; // falls back to the field label
  final String? ariaLabelHigh; // falls back to the field label
}
```

Two thumbs whose values are snapped to `step`, clamped to `min`/`max`, and constrained by each other (the low thumb can never pass the high thumb).

### 5.41 Rating

```dart
class EagamiRating extends StatefulWidget {
  const EagamiRating({
    super.key,
    required this.value,
    required this.onChanged,
    this.label,
    this.hint,
    this.errorMsg,
    this.min = 0,
    this.max = 5, // highest value and the number of stars rendered
    this.size = EagamiSize.md,
    this.allowHalf = false, // permits 0.5 increments
    this.clearable = true, // clicking the current value resets it to 0
    this.readonly = false,
    this.disabled = false,
    this.required = false,
    this.icon, // widget for empty and full positions (default: star)
    this.halfIcon, // widget for half positions when allowHalf is true
    this.onHoverChanged,
  });

  final double value; // two-way bindable
  final ValueChanged<double>? onChanged;
  final String? label;
  final String? hint;
  final String? errorMsg;
  final double min;
  final double max;
  final EagamiSize size;
  final bool allowHalf;
  final bool clearable;
  final bool readonly;
  final bool disabled;
  final bool required;
  final Widget? icon;
  final Widget? halfIcon;
  final ValueChanged<double?>? onHoverChanged; // previewed value while hovering, null when the cursor leaves
}
```

### 5.42 Stepper

```dart
class EagamiStep extends StatelessWidget {
  const EagamiStep({
    super.key,
    required this.label,
    required this.child,
    this.completed = false,
    this.optional = false, // shown as a hint below the label
    this.disabled = false,
  });

  final String label;
  final Widget child;
  final bool completed;
  final bool optional;
  final bool disabled;
}

class EagamiStepper extends StatefulWidget {
  const EagamiStepper({
    super.key,
    required this.activeStep,
    required this.onChanged,
    required this.children,
    this.size = EagamiSize.md,
    this.linear = false, // require each non-optional step to be completed before advancing
    this.disabled = false,
  });

  final int activeStep; // zero-based index, two-way bindable
  final ValueChanged<int>? onChanged;
  final List<EagamiStep> children;
  final EagamiSize size;
  final bool linear;
  final bool disabled;
}
```

In `linear` mode a step is only reachable once every earlier non-optional step is marked `completed`.

### 5.43 Time picker

```dart
enum TimePickerFormat { h12, h24 } // '12h' | '24h' upstream

class EagamiTimePicker extends StatefulWidget {
  const EagamiTimePicker({
    super.key,
    required this.value,
    required this.onChanged,
    this.label,
    this.placeholder,
    this.hint,
    this.errorMsg,
    this.size = EagamiSize.md,
    this.format = TimePickerFormat.h24, // display only; the wire value is always 24-hour
    this.includeSeconds = false,
    this.minuteStep = 1,
    this.secondStep = 1,
    this.disabled = false,
    this.readonly = false,
    this.required = false,
  });

  final String? value; // 'HH:MM' or 'HH:MM:SS' 24-hour, two-way bindable (null when unset)
  final ValueChanged<String?>? onChanged;
  final String? label;
  final String? placeholder;
  final String? hint;
  final String? errorMsg;
  final EagamiSize size;
  final TimePickerFormat format;
  final bool includeSeconds;
  final int minuteStep;
  final int secondStep;
  final bool disabled;
  final bool readonly;
  final bool required;
}
```

The wire value stays 24-hour regardless of `format`. Typed digits auto-advance between the hour, minute, and (optional) second columns; each column can also be stepped or long-pressed to repeat.

### 5.44 Transfer list

```dart
class TransferListItem {
  const TransferListItem({required this.id, required this.label, this.disabled = false});
  final String id;
  final String label;
  final bool disabled; // greyed out, cannot be highlighted, skipped by the move-all buttons
}

class EagamiTransferList extends StatefulWidget {
  const EagamiTransferList({
    super.key,
    required this.items, // full pool across both panes
    required this.selectedIds, // ids on the target (right) side, two-way bindable
    required this.onSelectedIdsChanged,
    this.size = EagamiSize.md,
    this.sourceLabel, // heading above the source (left) pane, falls back to the locale
    this.targetLabel, // heading above the target (right) pane, falls back to the locale
    this.disabled = false,
  });

  final List<TransferListItem> items;
  final List<String> selectedIds;
  final ValueChanged<List<String>>? onSelectedIdsChanged;
  final EagamiSize size;
  final String? sourceLabel;
  final String? targetLabel;
  final bool disabled;
}
```

Two panes with move and move-all controls between them. Items not in `selectedIds` sit in the source pane, the rest in the target pane.

### 5.45 Tree

```dart
class TreeNode<T> {
  const TreeNode({
    required this.id, // unique across the entire tree
    required this.label,
    this.children = const [],
    this.icon,
    this.disabled = false,
    this.data, // passed through to onNodeClick
  });

  final String id;
  final String label;
  final List<TreeNode<T>> children; // empty = leaf
  final Widget? icon;
  final bool disabled;
  final T? data;
}

class EagamiTree<T> extends StatefulWidget {
  const EagamiTree({
    super.key,
    required this.nodes,
    required this.expandedIds,
    required this.onExpandedIdsChanged,
    required this.selectedId,
    required this.onSelectedIdChanged,
    this.size = EagamiSize.md,
    this.disabled = false,
    this.ariaLabel,
    this.onNodeClick,
  });

  final List<TreeNode<T>> nodes;
  final List<String> expandedIds; // ids of expanded branches, two-way bindable
  final ValueChanged<List<String>>? onExpandedIdsChanged;
  final String? selectedId; // two-way bindable, null when nothing is selected
  final ValueChanged<String?>? onSelectedIdChanged;
  final EagamiSize size;
  final bool disabled;
  final String? ariaLabel;
  final ValueChanged<TreeNode<T>>? onNodeClick;
}
```

Each row exposes `treeitem` semantics with `aria-level`, `aria-posinset`, and `aria-setsize`. A single row holds the roving tabindex: arrows move focus and expand/collapse branches, Enter/Space selects. The upstream `<ea-tree-node>` is an internal recursion detail rendered per node; consumers only interact with `EagamiTree` and the `TreeNode` data.

### 5.46 Virtual list

```dart
class EagamiVirtualList<T> extends StatefulWidget {
  const EagamiVirtualList({
    super.key,
    required this.items,
    required this.itemHeight, // fixed px height shared by every row
    required this.viewportHeight, // px height of the scrolling viewport
    required this.itemBuilder,
    this.overscan = 3, // extra rows rendered above and below the window to reduce blank edges
    this.onScrollIndexChanged,
  });

  final List<T> items;
  final double itemHeight;
  final double viewportHeight;
  final Widget Function(BuildContext, T item, int index) itemBuilder;
  final int overscan;
  final ValueChanged<int>? onScrollIndexChanged; // index of the first visible row on scroll
}
```

Only the visible slice (plus `overscan`) is mounted at any time, so the list stays smooth over very large `items`. All rows must share the same fixed `itemHeight`. Expose an imperative `scrollToIndex(int index)` that scrolls the target row to the top, clamped to the list bounds.

---

## 6. Internationalization

Eagami UI ships full i18n. Every built-in user-facing string (ARIA labels, placeholders, empty states, pagination labels, dismiss buttons, etc.) is provided in fifteen locales and can be overridden per-string. Locales are opt-in as of @eagami/ui@4.0.0: English is always available without registration, and every other locale must be registered (upstream via `provideEagamiUi({ locales: [...] })`) so only the languages you ship land in the bundle. Two locales are right-to-left (Arabic and Hebrew); every locale carries a `dir` field so a consumer can wire `Directionality` correctly. A Flutter consumer should replicate the same surface so the component library stays consistent across both stacks.

### 6.1 Supported locales

Each locale carries display metadata (label in its own language, flag, and reading direction). Register the ones you need; English is always available.

```dart
/// BCP 47 locale tags supported out of the box.
enum EagamiLocale {
  en,    // English (default / fallback)
  de,    // German
  esES,  // Spanish (Spain)
  frFR,  // French (France)
  is,    // Icelandic
  nl,    // Dutch
  pl,    // Polish
  ptBR,  // Portuguese (Brazil)
  el,    // Greek
  ru,    // Russian
  uk,    // Ukrainian
  he,    // Hebrew (right-to-left)
  ar,    // Arabic (right-to-left)
  hi,    // Hindi
  zhCN,  // Chinese (Simplified)
}

enum TextDir { ltr, rtl }

/// Display metadata for one locale: label in its own language, flag, and
/// reading direction (for wiring `Directionality`).
@immutable
class EagamiLocaleMeta {
  const EagamiLocaleMeta({
    required this.locale,
    required this.label,
    required this.flag,
    required this.dir,
  });

  final EagamiLocale locale;
  final String label;
  final String flag;
  final TextDir dir;
}

/// Ordered list (language-switcher order), plus per-locale metadata. English
/// first, then Latin scripts, then Greek, Cyrillic, Hebrew, Arabic,
/// Devanagari, and Chinese by Unicode block order.
const List<EagamiLocaleMeta> kEagamiLocaleMeta = [
  EagamiLocaleMeta(locale: EagamiLocale.en, label: 'English', flag: '🇬🇧', dir: TextDir.ltr),
  EagamiLocaleMeta(locale: EagamiLocale.de, label: 'Deutsch', flag: '🇩🇪', dir: TextDir.ltr),
  EagamiLocaleMeta(locale: EagamiLocale.esES, label: 'Español', flag: '🇪🇸', dir: TextDir.ltr),
  EagamiLocaleMeta(locale: EagamiLocale.frFR, label: 'Français', flag: '🇫🇷', dir: TextDir.ltr),
  EagamiLocaleMeta(locale: EagamiLocale.is, label: 'Íslenska', flag: '🇮🇸', dir: TextDir.ltr),
  EagamiLocaleMeta(locale: EagamiLocale.nl, label: 'Nederlands', flag: '🇳🇱', dir: TextDir.ltr),
  EagamiLocaleMeta(locale: EagamiLocale.pl, label: 'Polski', flag: '🇵🇱', dir: TextDir.ltr),
  EagamiLocaleMeta(locale: EagamiLocale.ptBR, label: 'Português (Brasil)', flag: '🇧🇷', dir: TextDir.ltr),
  EagamiLocaleMeta(locale: EagamiLocale.el, label: 'Ελληνικά', flag: '🇬🇷', dir: TextDir.ltr),
  EagamiLocaleMeta(locale: EagamiLocale.ru, label: 'Русский', flag: '🇷🇺', dir: TextDir.ltr),
  EagamiLocaleMeta(locale: EagamiLocale.uk, label: 'Українська', flag: '🇺🇦', dir: TextDir.ltr),
  EagamiLocaleMeta(locale: EagamiLocale.he, label: 'עברית', flag: '🇮🇱', dir: TextDir.rtl),
  EagamiLocaleMeta(locale: EagamiLocale.ar, label: 'العربية', flag: '🇸🇦', dir: TextDir.rtl),
  EagamiLocaleMeta(locale: EagamiLocale.hi, label: 'हिन्दी', flag: '🇮🇳', dir: TextDir.ltr),
  EagamiLocaleMeta(locale: EagamiLocale.zhCN, label: '中文', flag: '🇨🇳', dir: TextDir.ltr),
];
```

### 6.2 Message dictionary

Every user-facing string in the library is grouped by component. Parameterized strings are functions so each locale controls its own word order and pluralisation.

```dart
class EagamiMessages {
  const EagamiMessages({
    required this.alert,
    required this.autocomplete,
    required this.avatarEditor,
    required this.breadcrumbs,
    required this.codeInput,
    required this.commandPalette,
    required this.colorPicker,
    required this.dataTable,
    required this.datePicker,
    required this.dialog,
    required this.drawer,
    required this.dropdown,
    required this.fileUploader,
    required this.input,
    required this.menu,
    required this.multiSelect,
    required this.paginator,
    required this.progressBar,
    required this.rating,
    required this.spinner,
    required this.stepper,
    required this.tag,
    required this.timePicker,
    required this.toast,
    required this.transferList,
    required this.tree,
    required this.validation,
    required this.wordmark,
  });

  final AlertMessages alert;             // { dismiss }
  final AutocompleteMessages autocomplete; // { empty }
  final AvatarEditorMessages avatarEditor; // { upload, dropzone, canvas, change, revert, zoomOut, zoom, zoomIn, remove }
  final BreadcrumbsMessages breadcrumbs; // { label }
  final CodeInputMessages codeInput;     // { groupLabel(length), digitLabel(index, length) }
  final CommandPaletteMessages commandPalette; // { dialogLabel, searchPlaceholder, empty, clear }
  final ColorPickerMessages colorPicker; // { placeholder, clear, hue, saturationAndValue, alpha, eyedropper, presets, toggleFormat }
  final DataTableMessages dataTable;     // { noData }
  final DatePickerMessages datePicker;   // { placeholder, clear, previousYear, previousMonth, nextMonth, nextYear, today }
  final DialogMessages dialog;           // { close }
  final DrawerMessages drawer;           // { close }
  final DropdownMessages dropdown;       // { placeholder }
  final FileUploaderMessages fileUploader; // { prompt, promptSingle, browse, removeFile(name), fileListLabel, constraintsAccept(accept), constraintsMaxSize(size), constraintsMaxFiles(count), rejectionType(name), rejectionSize(name, max), rejectionCount(max), bytesUnit { b, kb, mb, gb, tb } }
  final InputMessages input;             // { showPassword, hidePassword, clear }
  final MenuMessages menu;               // { label }
  final MultiSelectMessages multiSelect; // { placeholder, searchPlaceholder, searchEmpty, selectAll, clearAll, removeOption(label), selectedCount(count) }
  final PaginatorMessages paginator;     // { label, rowsPerPage, range(start, end, total), previousPage, nextPage }
  final ProgressBarMessages progressBar; // { label }
  final RatingMessages rating;           // { label, valueLabel(value, max), clear }
  final SpinnerMessages spinner;         // { label }
  final StepperMessages stepper;         // { optional }
  final TagMessages tag;                 // { remove }
  final TimePickerMessages timePicker;   // { placeholder, clear, hoursLabel, minutesLabel, secondsLabel, incrementHours, decrementHours, incrementMinutes, decrementMinutes, incrementSeconds, decrementSeconds, amLabel, pmLabel }
  final ToastMessages toast;             // { dismiss }
  final TransferListMessages transferList; // { sourceLabel, targetLabel, controlsLabel, moveSelectedToTarget, moveAllToTarget, moveSelectedToSource, moveAllToSource, empty }
  final TreeMessages tree;               // { expand, collapse }
  final ValidationMessages validation;   // { required, email, min(min), max(max), minlength(len), maxlength(len), pattern, invalid }
  final WordmarkMessages wordmark;       // { overline, tagline }
}
```

The English baseline (which acts as the fallback for any missing key) reads:

```dart
const EagamiMessages kEagamiEnglish = EagamiMessages(
  alert:         AlertMessages(dismiss: 'Dismiss'),
  autocomplete:  AutocompleteMessages(empty: 'No results'),
  avatarEditor:  AvatarEditorMessages(
    upload: 'Upload image',
    dropzone: 'Drop image or click to upload',
    canvas: 'Image preview, drag or use arrow keys to pan, slider to zoom',
    change: 'Change photo',
    revert: 'Revert to original',
    zoomOut: 'Zoom out',
    zoom: 'Zoom',
    zoomIn: 'Zoom in',
    remove: 'Remove image',
  ),
  breadcrumbs:   BreadcrumbsMessages(label: 'Breadcrumb'),
  codeInput:     CodeInputMessages(
    groupLabel: (length) => 'Verification code, $length digits',
    digitLabel: (index, length) => 'Digit $index of $length',
  ),
  commandPalette: CommandPaletteMessages(
    dialogLabel: 'Command palette',
    searchPlaceholder: 'Type a command or search…',
    empty: 'No results found',
    clear: 'Clear search',
  ),
  colorPicker:   ColorPickerMessages(
    placeholder: 'Pick a color…',
    clear: 'Clear color',
    hue: 'Hue',
    saturationAndValue: 'Saturation and value',
    alpha: 'Alpha',
    eyedropper: 'Pick from screen',
    presets: 'Presets',
    toggleFormat: 'Switch input format',
  ),
  dataTable:     DataTableMessages(noData: 'No data available'),
  datePicker:    DatePickerMessages(
    placeholder: 'Select date…',
    clear: 'Clear date',
    previousYear: 'Previous year',
    previousMonth: 'Previous month',
    nextMonth: 'Next month',
    nextYear: 'Next year',
    today: 'Today',
  ),
  dialog:        DialogMessages(close: 'Close dialog'),
  drawer:        DrawerMessages(close: 'Close panel'),
  dropdown:      DropdownMessages(placeholder: 'Select…'),
  fileUploader:  FileUploaderMessages(
    prompt: 'Click or drag files here to upload',
    promptSingle: 'Click or drag a file here to upload',
    browse: 'Browse files',
    removeFile: (name) => 'Remove $name',
    fileListLabel: 'Selected files',
    constraintsAccept: (accept) => 'Accepted: $accept',
    constraintsMaxSize: (size) => 'Max $size per file',
    constraintsMaxFiles: (count) => 'Up to $count files',
    rejectionType: (name) => '$name has an unsupported file type',
    rejectionSize: (name, max) => '$name exceeds the $max limit',
    rejectionCount: (max) => 'Only $max files can be selected',
    bytesUnit: FileUploaderBytesUnit(b: 'B', kb: 'KB', mb: 'MB', gb: 'GB', tb: 'TB'),
  ),
  input:         InputMessages(showPassword: 'Show password', hidePassword: 'Hide password', clear: 'Clear'),
  menu:          MenuMessages(label: 'Menu'),
  multiSelect:   MultiSelectMessages(
    placeholder: 'Select…',
    searchPlaceholder: 'Search…',
    searchEmpty: 'No matches',
    selectAll: 'Select all',
    clearAll: 'Clear selection',
    removeOption: (label) => 'Remove $label',
    selectedCount: (count) => '$count selected',
  ),
  paginator:     PaginatorMessages(
    label: 'Pagination',
    rowsPerPage: 'Rows per page:',
    range: (start, end, total) => '$start–$end of $total',
    previousPage: 'Previous page',
    nextPage: 'Next page',
  ),
  progressBar:   ProgressBarMessages(label: 'Progress'),
  rating:        RatingMessages(
    label: 'Rating',
    valueLabel: (value, max) => '$value of $max',
    clear: 'Clear rating',
  ),
  spinner:       SpinnerMessages(label: 'Loading'),
  stepper:       StepperMessages(optional: 'optional'),
  tag:           TagMessages(remove: 'Remove'),
  timePicker:    TimePickerMessages(
    placeholder: 'Select time…',
    clear: 'Clear time',
    hoursLabel: 'Hours',
    minutesLabel: 'Minutes',
    secondsLabel: 'Seconds',
    incrementHours: 'Increment hours',
    decrementHours: 'Decrement hours',
    incrementMinutes: 'Increment minutes',
    decrementMinutes: 'Decrement minutes',
    incrementSeconds: 'Increment seconds',
    decrementSeconds: 'Decrement seconds',
    amLabel: 'AM',
    pmLabel: 'PM',
  ),
  toast:         ToastMessages(dismiss: 'Dismiss'),
  transferList:  TransferListMessages(
    sourceLabel: 'Available',
    targetLabel: 'Selected',
    controlsLabel: 'Transfer controls',
    moveSelectedToTarget: 'Move selected to target',
    moveAllToTarget: 'Move all to target',
    moveSelectedToSource: 'Move selected to source',
    moveAllToSource: 'Move all to source',
    empty: 'No items',
  ),
  tree:          TreeMessages(expand: 'Expand', collapse: 'Collapse'),
  validation:    ValidationMessages(
    required: 'This field is required',
    email: 'Enter a valid email address',
    min: (min) => 'Must be at least $min',
    max: (max) => 'Must be at most $max',
    minlength: (length) => 'Must be at least $length characters',
    maxlength: (length) => 'Must be at most $length characters',
    pattern: 'Invalid format',
    invalid: 'Invalid value',
  ),
  wordmark:      WordmarkMessages(
    overline: 'handcrafted by',
    tagline: 'elegant web design',
  ),
);
```

Add one dictionary constant per registered locale (`kEagamiFrench`, `kEagamiGreek`, `kEagamiPolish`, `kEagamiSpanish`, `kEagamiGerman`, `kEagamiPortugueseBR`, `kEagamiChinese`, `kEagamiIcelandic`, `kEagamiDutch`, `kEagamiUkrainian`, `kEagamiRussian`, `kEagamiHebrew`, `kEagamiArabic`, `kEagamiHindi`) that translates every key. Ship only the ones your app registers (English is always present). **Use the upstream `packages/ui/src/lib/i18n/messages/*.ts` files as the source of truth for each translation** so wording stays in lockstep across stacks.

### 6.3 Runtime service

Expose a `ChangeNotifier` (or Riverpod `StateNotifier` / Provider, whichever matches the host app's state convention) so locale changes propagate to every consuming widget reactively. Locales are opt-in: the consumer registers the dictionaries it ships, and English is always available as the fallback whether or not it is passed in.

```dart
class EagamiI18n extends ChangeNotifier {
  EagamiI18n({
    EagamiLocale initial = EagamiLocale.en,
    // Register only the locales you ship; English is always available.
    Map<EagamiLocale, EagamiMessages> locales = const {},
    EagamiMessagesOverride? overrides,
  })  : _dictionaries = {EagamiLocale.en: kEagamiEnglish, ...locales},
        _locale = initial,
        _overrides = overrides;

  final Map<EagamiLocale, EagamiMessages> _dictionaries;
  EagamiLocale _locale;
  final EagamiMessagesOverride? _overrides;

  EagamiLocale get locale => _locale;
  EagamiMessages get messages {
    final base = _dictionaries[_locale] ?? kEagamiEnglish;
    return _overrides == null ? base : _applyOverrides(base, _overrides);
  }

  void setLocale(EagamiLocale next) {
    // Unregistered locale falls back to English.
    _locale = _dictionaries.containsKey(next) ? next : EagamiLocale.en;
    notifyListeners();
  }
}
```

Provide the instance through whichever scoping mechanism the host app already uses (`InheritedNotifier`, `Provider.value`, Riverpod, etc.) and read it through a context extension:

```dart
extension EagamiI18nContext on BuildContext {
  EagamiI18n get eagamiI18n => /* read from the chosen scope */;
  EagamiMessages get eagamiMessages => eagamiI18n.messages;
}
```

Every widget that surfaces a built-in string should read it from `context.eagamiMessages` so a locale change rebuilds it.

### 6.4 Per-string overrides

`EagamiMessagesOverride` is a deep-partial of `EagamiMessages` (each component group is optional, each key within a group is optional). Apply overrides on top of the active locale's base dictionary:

```dart
// Replace just one string for the whole app.
EagamiI18n(
  initial: EagamiLocale.en,
  overrides: EagamiMessagesOverride(
    autocomplete: AutocompleteMessagesPartial(empty: 'Nothing matches that yet'),
  ),
);
```

Component-level inputs (`emptyMessage` on Autocomplete, `placeholder` on Dropdown / DatePicker, `noDataText` on DataTable, `ariaLabel` on Menu / Breadcrumbs, `removeLabel` on Tag, `label` on Spinner / ProgressBar) take precedence over the global dictionary when supplied.

### 6.5 French spacing helper

French typography requires "espace fine insécable" (narrow non-breaking space, U+202F) before high punctuation (`?` `!` `:` `;` `»`) and after `«`. The upstream library exports `frenchSpacing(text)`, an opt-in helper that performs that substitution. The library does **not** auto-apply it to anything; the component renders whatever string it receives. Apply it to consumer-supplied content (user input, CMS strings, etc.) you want correctly formatted for a French audience.

```dart
const _spaceBeforeHighPunct = r' ([!?:;»])';
const _spaceAfterOpenGuillemet = r'(«) ';

/// Replaces regular spaces with U+202F (narrow non-breaking space) in the
/// positions where standard French typography requires "espace fine insécable":
/// before `!` `?` `:` `;` `»`, and after `«`.
///
/// Opt-in. The Eagami UI library does not apply this automatically. Use it on
/// consumer-supplied French content you control. Do NOT apply it to URLs,
/// CSS, JSON, code, or other technical strings where these characters have
/// non-prose meaning. The function is idempotent.
String frenchSpacing(String text) {
  return text
      .replaceAllMapped(RegExp(_spaceBeforeHighPunct), (m) => ' ${m[1]}')
      .replaceAllMapped(RegExp(_spaceAfterOpenGuillemet), (m) => '${m[1]} ');
}

// Examples:
//   frenchSpacing('Lignes par page :');     // → 'Lignes par page :'
//   frenchSpacing("Qu'est-ce que c'est ?"); // → "Qu'est-ce que c'est ?"
//   frenchSpacing('Il a dit « bonjour ».'); // → 'Il a dit « bonjour ».'
```

The bundled French dictionary already uses U+202F where appropriate (e.g. `Lignes par page :` in `paginator.rowsPerPage`); do the same in any custom French translations you add so labels cannot wrap punctuation onto its own line.

### 6.6 Date picker locale handling

`EagamiDatePicker.locale` is optional. When unset, the picker uses the active `EagamiI18n` locale for both the displayed value (`short` / `medium` / `long` via `intl`'s `DateFormat`) and the weekday/month labels in the calendar grid.

---

## 7. Accessibility requirements

The upstream library adheres to WCAG 2.2 Level AA and implements the matching [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/) pattern per widget; see [eagami.com/ui/accessibility](https://eagami.com/ui/accessibility). A Flutter port must preserve that bar: everything below is a requirement, not a suggestion.

- **Semantics:** Every interactive widget must supply a `Semantics` label (either via the widget itself or a wrapping `Semantics`). Icon-only buttons must expose their action verbally via `ariaLabel`.
- **Live regions:**
  - Errors must be announced (`Semantics(liveRegion: true)` on the error message line).
  - `EagamiProgressBar` exposes `aria-busy: true` while `indeterminate: true`.
  - `EagamiAlert` and `Toast` use `role: alert` for `error` / `warning` (interrupting) and `role: status` for other variants (polite). Do not use `role: alert` for routine non-urgent messages.
- **Contrast:** Token combinations are pre-tested for WCAG AA:
  - Body text (`textPrimary` on `surfaceBase`): ≥ 4.5:1.
  - Large text (`h1`–`h4` on `surfaceBase`): ≥ 3:1.
  - `textLink` and `textLinkHover` meet AA in both light and dark schemes, with a perceptible rest→hover delta.
  - Never combine `textTertiary` with `surfaceMuted` for body text.
- **Touch targets:** 44×44 logical pixels minimum. The `md` and `lg` sizes satisfy this; `sm` is for dense secondary contexts only.
- **Focus order:** Must match visual reading order. Use `FocusTraversalGroup` and `FocusTraversalOrder` where needed.
- **Form fields:** Labels must be associated with inputs (pass `label` to `EagamiInput`, not a separate `Text` widget). `EagamiCodeInput` must mark every digit `aria-invalid` when the group has an error. Group controls (`EagamiRadioGroup`, `EagamiSegmented`, `EagamiCheckbox`, `EagamiSwitch`) must wire `aria-labelledby` to their rendered label and `aria-required`/`aria-invalid` to the host.
- **Dropdown / autocomplete / select:** The trigger must expose `aria-haspopup`, `aria-expanded`, `aria-controls`, `aria-required`, `aria-invalid`, and `aria-describedby` (for hint/error). When a listbox option is highlighted, mirror it on the trigger via `aria-activedescendant` so screen readers announce the highlighted option as the user arrows through.
- **Modals (dialog, drawer):** Derive `aria-labelledby` from the slotted header when no explicit `aria-label` is supplied; restore focus to the previously focused element on close.
- **Tabs:** Tab panels are keyboard-focusable and linked to their tab via `aria-controls` / `aria-labelledby`.
- **Tooltip:** Wire `aria-describedby` on the host by appending to any existing tokens (do not overwrite hint / error references). Dismiss on Escape. Suppress hover-triggered tooltips on touch-only devices to avoid the "sticky hover" pattern; reactively re-attach pointer listeners when hover capability returns.
- **Tables:** Use native table semantics with `scope="col"` headers. Sortable headers use `aria-sort`, not invalid composite roles.
- **Date picker:** Calendar grid receives focus on open; do not advertise the popover as `aria-modal`.
- **Reduced motion:** Use `context.eagamiDuration()` or the library's motion tokens. Toasts degrade their slide-in to an opacity-only fade; spinners slow rather than freeze.

---

## 8. Sync checklist

Every value-bearing part of this file is generated, never hand-edited. In the upstream repo, `pnpm ui sync-guides` (`packages/ui/scripts/sync-integration-guides.mjs`) regenerates all of § 2, the `eagami_theme.dart` block in § 3.2 (including every semantic colour, text style, shadow, and curve, with `color-mix` blends precomputed to flat `Color` literals), and the frontmatter version and sync date straight from the SCSS token source. It also rejects any hex, `Color`, or `Cubic` literal in the hand-written sections that is not a current token value. CI fails on drift via `pnpm ui check-tokens`; regenerating is always the whole fix. Never edit the marked generated regions by hand.

When regenerating this file from the upstream Angular library, verify the parts the script does not cover:

1. Component API conventions in § 5 match the Angular component `input()` / `output()` / `model()` signatures in `packages/ui/src/lib/<component>/<component>.component.ts`. Particular regressions to watch for:
    - All form controls take `errorMsg` (not `error`); the `status` enum was removed in 1.0.0.
    - Card uses `header` / `footer` slots (not `eaCardHeader` / `eaCardFooter` directives) since 1.0.0.
    - `Autocomplete`, `Dropdown`, and `Segmented` all consume the shared `SelectOption` type.
    - Standardised output names: `changed`, `sorted`, `clicked`, `removed`, `cropStateChanged`, `errored` (past tense).
    - `Tag` has no `primary` variant; use `Badge` for brand chips.
    - Menu is opened via the `eaMenuTrigger` directive on the host element (not the `slot="trigger"` pattern); mirror with a `trigger:` parameter in Flutter.
    - The `EagamiSize` enum is `xs | sm | md | lg | xl` (not `small | medium | large`), shared by every sized component; `EagamiWidth` adds `full` for width-style inputs.
2. i18n surface in § 6 matches `packages/ui/src/lib/i18n/`:
    - `EagamiLocale` enum matches `i18n.types.ts` (15 locales; `ar` and `he` are `dir: rtl`, the rest `ltr`, per `EAGAMI_LOCALE_META`).
    - Locales are opt-in as of 4.0.0: English is always available; every other locale must be registered. Reflect that in the § 6.3 service (English merged in by default).
    - `EagamiMessages` shape (group keys, per-group keys, function signatures for parameterised strings) matches `i18n.types.ts`. Groups added since the previous sync: `commandPalette`, `colorPicker`, `fileUploader` (with nested `bytesUnit`), `multiSelect`, `rating`, `stepper`, `timePicker`, `transferList`, `tree`, `validation`; `input` gained `clear`.
    - English baseline strings in § 6.2 match `messages/en.ts`.
    - The registered-locale list and the French spacing helper match `messages/index.ts` and `french-spacing.ts`.
**For AI agents performing the sync:** diff this file's tables and code blocks against the SCSS and TypeScript source of truth and report any discrepancies before editing Dart code. Do not regenerate blindly.
