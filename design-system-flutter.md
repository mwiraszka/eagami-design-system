---
title: Eagami Design System — Flutter Integration
version: 0.11.0
source: '@eagami/ui@0.11.0 — https://github.com/mwiraszka/eagami-design-system'
last-synced: 2026-04-21
audience: human developers and AI coding agents
purpose: >
  Single-file specification for applying the Eagami design system to a Flutter/Dart
  codebase without depending on the upstream Angular library. Copy this file into the
  consuming project's docs/ directory. When building or modifying UI in that project,
  follow every rule below and use only the tokens listed here.
---

# Eagami Design System — Flutter Integration

This document is the complete, self-contained specification for applying the Eagami design system to a Flutter project. It contains:

1. Mandatory design rules
2. Full token set (values)
3. Ready-to-paste Dart theme setup
4. Usage patterns (do / don't)
5. Component API conventions
6. Accessibility requirements
7. Sync checklist

**For AI agents:** When building or modifying UI in this project, follow every rule in § 1 and use only the tokens in § 2 (accessed via the `EagamiTheme` in § 3). Do not introduce arbitrary color, spacing, or typography values. If a required token is missing, request an upstream addition rather than hard-coding. The `RULE:` markers below identify invariants that must always hold.

---

## Table of contents

1. [Design rules](#1-design-rules)
2. [Tokens](#2-tokens)
3. [Theme setup](#3-theme-setup)
4. [Usage patterns](#4-usage-patterns)
5. [Component API conventions](#5-component-api-conventions)
6. [Accessibility requirements](#6-accessibility-requirements)
7. [Sync checklist](#7-sync-checklist)

---

## 1. Design rules

### 1.1 Spacing scale

**RULE:** All padding, margin, and gap values must be drawn from this scale:

`1, 2, 4, 8, 12, 16, 24, 32, 48, 64`

Units are Flutter's default logical pixels. Arbitrary values (5, 10, 20, 100, etc.) are forbidden. Prefer named tokens (`context.eagami.spacing.md`) over numeric literals so the scale stays discoverable.

### 1.2 Colors

**RULE:** Never hard-code color literals (`Color(0xFF...)`, `Colors.blue`, `CupertinoColors.*`) in widget code. All colors come from `EagamiTheme` semantic tokens.

- Use **semantic names** (`colors.textPrimary`, `colors.surfaceBase`, `colors.borderDefault`) — not primitives (`neutral900`, `primary500`).
- Tokens adapt automatically across `EagamiTheme.light` and `EagamiTheme.dark`.
- For translucent overlays, use `colors.surfaceOverlay`. Do not call `Color.withOpacity()` on raw palette colors.
- If a required semantic token is missing, add it upstream rather than falling back to primitives.

### 1.3 Focus indicators

**RULE:** Every focusable widget must render a visible keyboard focus indicator.

- Use `elevation.focusRing` as the focus style (3px outer glow using `colors.borderFocus`).
- Wrap custom interactive widgets in `FocusableActionDetector` or apply `Focus` + visual feedback.
- Never set `focusColor: Colors.transparent` or otherwise suppress the indicator.

### 1.4 Motion and reduced motion

**RULE:** Use the provided motion tokens for all animations. Respect reduced-motion.

- `motion.durationFast`, `motion.durationNormal`, `motion.durationSlow`, `motion.durationSlower` — all `Duration` values.
- `motion.easeIn`, `motion.easeOut`, `motion.easeInOut`, `motion.easeSpring` — all `Curve` values.
- `EagamiTheme` reads `MediaQuery.disableAnimations` at resolution time; when true, all durations collapse to `Duration.zero` automatically. Do not bypass this by constructing raw `Duration` literals.

### 1.5 Typography

**RULE:** Use semantic typography tokens when styling text.

- `typography.h1`, `typography.h2`, `typography.h3`, `typography.h4`
- `typography.bodyLg`, `typography.bodyMd`, `typography.bodySm`
- `typography.labelLg`, `typography.labelMd`, `typography.labelSm`
- `typography.helper`, `typography.code`, `typography.display`

Do not compose `TextStyle` from raw font sizes/weights. If a role is missing, add a token upstream.

### 1.6 Interactive element sizing

**RULE:** All tappable targets must be at least 44×44 logical pixels. Use the size tokens (`small`, `medium`, `large`) which are calibrated to meet this.

### 1.7 Component API shape

**RULE:** Widgets that mirror Eagami components must preserve these prop shapes so behavior is predictable across Angular and Flutter:

| Prop         | Type                  | Notes                                                              |
| ------------ | --------------------- | ------------------------------------------------------------------ |
| `variant`    | enum                  | Matches Angular component's variant (e.g. Button → `ButtonVariant.primary`). |
| `size`       | `EagamiSize` enum     | `small \| medium \| large` — default `medium`.                      |
| `disabled`   | `bool`                | Default `false`.                                                   |
| `loading`    | `bool`                | Where applicable.                                                  |
| `fullWidth`  | `bool`                | Where applicable.                                                  |
| value/onChanged | controlled pattern | Pair `value: T` with `onChanged: ValueChanged<T>`.                 |

See § 5 for per-component specifics.

---

## 2. Tokens

All values below are directly encoded into the Dart source in § 3. They mirror the CSS custom properties in `src/styles/tokens/*.scss` in the upstream Angular library. Do not edit these tables in isolation — regenerate this file when upstream tokens change (see § 7).

### 2.1 Colors — primitive palette

Use these only if a semantic token is not available. Adding a new semantic is almost always the right move.

#### Primary (brand)

| Token         | Hex       |
| ------------- | --------- |
| `primary50`   | `#EEF4F8` |
| `primary100`  | `#D5E5F0` |
| `primary200`  | `#ACCFE2` |
| `primary300`  | `#7DB1CE` |
| `primary400`  | `#628EAD` |
| `primary500`  | `#3C6C90` |
| `primary600`  | `#2F567A` |
| `primary700`  | `#285175` |
| `primary800`  | `#11365C` |
| `primary900`  | `#0D2533` |

#### Secondary

| Token          | Hex       |
| -------------- | --------- |
| `secondary50`  | `#F3F1F7` |
| `secondary100` | `#E3DEED` |
| `secondary200` | `#C7BEDB` |
| `secondary300` | `#A796C3` |
| `secondary400` | `#7D6A9C` |
| `secondary500` | `#594B6E` |
| `secondary600` | `#493D5C` |
| `secondary700` | `#40374F` |
| `secondary800` | `#2F2439` |
| `secondary900` | `#1E1528` |

#### Neutral

| Token         | Hex       |
| ------------- | --------- |
| `neutral0`    | `#FFFFFF` |
| `neutral50`   | `#F9FAFB` |
| `neutral100`  | `#F3F4F6` |
| `neutral200`  | `#E5E7EB` |
| `neutral300`  | `#D1D5DB` |
| `neutral400`  | `#9CA3AF` |
| `neutral500`  | `#6B7280` |
| `neutral600`  | `#4B5563` |
| `neutral700`  | `#374151` |
| `neutral800`  | `#1F2937` |
| `neutral900`  | `#111827` |
| `neutral950`  | `#030712` |

#### Feedback

| Token          | Hex       |     | Token          | Hex       |
| -------------- | --------- | --- | -------------- | --------- |
| `success50`    | `#F0FDF4` |     | `warning50`    | `#FFFBEB` |
| `success100`   | `#DCFCE7` |     | `warning100`   | `#FEF3C7` |
| `success200`   | `#BBF7D0` |     | `warning200`   | `#FDE68A` |
| `success500`   | `#22C55E` |     | `warning500`   | `#F59E0B` |
| `success600`   | `#16A34A` |     | `warning600`   | `#D97706` |
| `success700`   | `#15803D` |     | `warning700`   | `#B45309` |
| `error50`      | `#FEF2F2` |     | `info50`       | `#ECFEFF` |
| `error100`     | `#FEE2E2` |     | `info100`      | `#CFFAFE` |
| `error200`     | `#FECACA` |     | `info200`      | `#A5F3FC` |
| `error500`     | `#EF4444` |     | `info500`      | `#06B6D4` |
| `error600`     | `#DC2626` |     | `info600`      | `#0891B2` |
| `error700`     | `#B91C1C` |     | `info700`      | `#0E7490` |

### 2.2 Colors — semantic (light & dark)

| Semantic token            | Light                           | Dark                            |
| ------------------------- | ------------------------------- | ------------------------------- |
| `textPrimary`             | `neutral900`                    | `neutral50`                     |
| `textSecondary`           | `neutral600`                    | `neutral400`                    |
| `textTertiary`            | `neutral400`                    | `neutral500`                    |
| `textDisabled`            | `neutral300`                    | `neutral700`                    |
| `textInverse`             | `neutral0`                      | `neutral900`                    |
| `textLink`                | `primary600`                    | `primary600`                    |
| `textLinkHover`           | `primary700`                    | `primary700`                    |
| `surfaceBase`             | `neutral0`                      | `neutral950`                    |
| `surfaceSubtle`           | `neutral50`                     | `neutral900`                    |
| `surfaceMuted`            | `neutral100`                    | `neutral800`                    |
| `surfaceOverlay`          | `Color(0x80000000)`             | `Color(0x80000000)`             |
| `borderDefault`           | `neutral200`                    | `neutral700`                    |
| `borderStrong`            | `neutral400`                    | `neutral500`                    |
| `borderFocus`             | `primary500`                    | `primary500`                    |
| `brandDefault`            | `primary600`                    | `primary400`                    |
| `brandHover`              | `primary700`                    | `primary300`                    |
| `brandActive`             | `primary800`                    | `primary200`                    |
| `brandSubtle`             | `primary50`                     | `Color(0x1A628EAD)`             |
| `brandMuted`              | `primary100`                    | `Color(0x33628EAD)`             |
| `brandSecondaryDefault`   | `secondary500`                  | `secondary500`                  |
| `brandSecondaryHover`     | `secondary600`                  | `secondary600`                  |
| `brandSecondaryActive`    | `secondary700`                  | `secondary700`                  |
| `brandSecondarySubtle`    | `secondary50`                   | `secondary50`                   |
| `brandSecondaryMuted`     | `secondary100`                  | `secondary100`                  |
| `successDefault`          | `success600`                    | `success600`                    |
| `successSubtle`           | `success50`                     | `success50`                     |
| `successMuted`            | `success100`                    | `success100`                    |
| `warningDefault`          | `warning600`                    | `warning600`                    |
| `warningSubtle`           | `warning50`                     | `warning50`                     |
| `warningMuted`            | `warning100`                    | `warning100`                    |
| `errorDefault`            | `error600`                      | `error600`                      |
| `errorSubtle`             | `error50`                       | `error50`                       |
| `errorMuted`              | `error100`                      | `error100`                      |
| `infoDefault`             | `info600`                       | `info600`                       |
| `infoSubtle`              | `info50`                        | `info50`                        |
| `infoMuted`               | `info100`                       | `info100`                       |

### 2.3 Spacing — base scale

| Token  | Pixels |
| ------ | ------ |
| `s0`   | 0      |
| `s1`   | 4      |
| `s2`   | 8      |
| `s3`   | 12     |
| `s4`   | 16     |
| `s6`   | 24     |
| `s8`   | 32     |
| `s12`  | 48     |
| `s16`  | 64     |

Only these values are permitted (see § 1.1). The upstream SCSS defines additional values (6, 10, 14, 20, 28, 36, 40, 44, 56, 80, 96, 128) but these exist for internal library use and are not exposed here — follow the 10-value scale above.

### 2.4 Spacing — semantic

**Inset (component padding — vertical × horizontal):**

| Token      | Vertical | Horizontal |
| ---------- | -------- | ---------- |
| `insetXs`  | 4        | 8          |
| `insetSm`  | 6        | 12         |
| `insetMd`  | 8        | 16         |
| `insetLg`  | 12       | 24         |
| `insetXl`  | 16       | 32         |

**Stack (vertical gap):**

| Token         | Pixels |
| ------------- | ------ |
| `stack2xs`    | 4      |
| `stackXs`     | 8      |
| `stackSm`     | 12     |
| `stackMd`     | 16     |
| `stackLg`     | 24     |
| `stackXl`     | 32     |
| `stack2xl`    | 48     |

**Inline (horizontal gap):**

| Token       | Pixels |
| ----------- | ------ |
| `inline2xs` | 4      |
| `inlineXs`  | 8      |
| `inlineSm`  | 12     |
| `inlineMd`  | 16     |
| `inlineLg`  | 24     |

### 2.5 Typography

**Font families** (must be declared in `pubspec.yaml` with font files bundled):

| Token       | Stack                                                       |
| ----------- | ----------------------------------------------------------- |
| `fontSans`  | DM Sans → Segoe UI → system-ui → -apple-system → sans-serif |
| `fontBrand` | Syne → DM Sans → system-ui → sans-serif                     |
| `fontSerif` | Georgia → Times New Roman → serif                           |
| `fontMono`  | JetBrains Mono → Fira Code → Cascadia Code → monospace      |

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

| Token        | Value          |
| ------------ | -------------- |
| `regular`    | `w400`         |
| `medium`     | `w500`         |
| `semibold`   | `w600`         |
| `bold`       | `w700`         |
| `extrabold`  | `w800`         |

**Line heights** (unitless multiplier):

| Token      | Value |
| ---------- | ----- |
| `lhNone`   | 1.0   |
| `lhTight`  | 1.25  |
| `lhSnug`   | 1.375 |
| `lhNormal` | 1.5   |
| `lhRelaxed`| 1.625 |
| `lhLoose`  | 2.0   |

**Letter spacing** (em):

| Token           | Value    |
| --------------- | -------- |
| `lsTighter`     | -0.05    |
| `lsTight`       | -0.025   |
| `lsNormal`      | 0        |
| `lsWide`        | 0.025    |
| `lsWider`       | 0.05     |
| `lsWidest`      | 0.1      |

**Composite text styles** (what widget code should actually use):

| Style        | Size | Weight     | Line height | Family        |
| ------------ | ---- | ---------- | ----------- | ------------- |
| `display`    | 48   | bold       | 1.25        | sans          |
| `h1`         | 36   | bold       | 1.25        | sans          |
| `h2`         | 30   | semibold   | 1.375       | sans          |
| `h3`         | 24   | semibold   | 1.375       | sans          |
| `h4`         | 20   | semibold   | 1.375       | sans          |
| `bodyLg`     | 18   | regular    | 1.625       | sans          |
| `bodyMd`     | 16   | regular    | 1.5         | sans          |
| `bodySm`     | 14   | regular    | 1.5         | sans          |
| `labelLg`    | 16   | medium     | 1.25        | sans          |
| `labelMd`    | 14   | medium     | 1.25        | sans          |
| `labelSm`    | 12   | medium     | 1.25        | sans          |
| `helper`     | 12   | regular    | 1.5         | sans          |
| `code`       | 14   | regular    | 1.5         | mono          |

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

**Shadows** (Flutter `BoxShadow` list):

| Token       | Definition                                                                                      |
| ----------- | ----------------------------------------------------------------------------------------------- |
| `shadowNone`| `[]`                                                                                            |
| `shadowXs`  | `(0,1) blur 2 spread 0` at 5% black                                                              |
| `shadowSm`  | `(0,1) blur 3 spread 0` at 10% + `(0,1) blur 2 spread -1` at 10%                                 |
| `shadowMd`  | `(0,4) blur 6 spread -1` at 10% + `(0,2) blur 4 spread -2` at 10%                                |
| `shadowLg`  | `(0,10) blur 15 spread -3` at 10% + `(0,4) blur 6 spread -4` at 10%                              |
| `shadowXl`  | `(0,20) blur 25 spread -5` at 10% + `(0,8) blur 10 spread -6` at 10%                             |
| `shadow2xl` | `(0,25) blur 50 spread -12` at 25% black                                                         |
| `focusRing` | `(0,0) blur 0 spread 3` at `rgba(59,130,246,0.45)` — outer glow for keyboard focus               |
| `focusRingError`   | `(0,0) blur 0 spread 3` at `error200`                                                     |
| `focusRingSuccess` | `(0,0) blur 0 spread 3` at `success200`                                                   |

**Z-index** (for `Stack` ordering; Flutter does not use CSS-style z-index, but these are semantic ordering constants):

| Token      | Value |
| ---------- | ----- |
| `zBase`    | 0     |
| `zRaised`  | 10    |
| `zDropdown`| 100   |
| `zSticky`  | 200   |
| `zOverlay` | 300   |
| `zModal`   | 400   |
| `zPopover` | 500   |
| `zToast`   | 600   |
| `zTooltip` | 700   |

### 2.8 Motion

**Durations** (`Duration`):

| Token       | Value       |
| ----------- | ----------- |
| `instant`   | 0 ms        |
| `fast`      | 100 ms      |
| `normal`    | 200 ms      |
| `slow`      | 300 ms      |
| `slower`    | 500 ms      |

**Easing** (`Cubic` / `Curve`):

| Token       | Value                       |
| ----------- | --------------------------- |
| `easeLinear`| `Curves.linear`             |
| `easeIn`    | `Cubic(0.4, 0, 1, 1)`       |
| `easeOut`   | `Cubic(0, 0, 0.2, 1)`       |
| `easeInOut` | `Cubic(0.4, 0, 0.2, 1)`     |
| `easeSpring`| `Cubic(0.34, 1.56, 0.64, 1)`|

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

```dart
import 'package:flutter/material.dart';

// =============================================================================
// EagamiTheme — design system theme extension
// Sync source: @eagami/ui@0.11.0 (src/styles/tokens/*.scss)
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
    elevation: EagamiElevation.base,
    motion: EagamiMotion.base,
  );

  static const EagamiTheme dark = EagamiTheme(
    colors: EagamiColors.dark,
    typography: EagamiTypography.base,
    spacing: EagamiSpacing.base,
    radius: EagamiRadius.base,
    borderWidth: EagamiBorderWidth.base,
    elevation: EagamiElevation.base,
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
    required this.surfaceBase,
    required this.surfaceSubtle,
    required this.surfaceMuted,
    required this.surfaceOverlay,
    required this.borderDefault,
    required this.borderStrong,
    required this.borderFocus,
    required this.brandDefault,
    required this.brandHover,
    required this.brandActive,
    required this.brandSubtle,
    required this.brandMuted,
    required this.brandSecondaryDefault,
    required this.brandSecondaryHover,
    required this.brandSecondaryActive,
    required this.brandSecondarySubtle,
    required this.brandSecondaryMuted,
    required this.successDefault,
    required this.successSubtle,
    required this.successMuted,
    required this.warningDefault,
    required this.warningSubtle,
    required this.warningMuted,
    required this.errorDefault,
    required this.errorSubtle,
    required this.errorMuted,
    required this.infoDefault,
    required this.infoSubtle,
    required this.infoMuted,
  });

  final Color textPrimary;
  final Color textSecondary;
  final Color textTertiary;
  final Color textDisabled;
  final Color textInverse;
  final Color textLink;
  final Color textLinkHover;
  final Color surfaceBase;
  final Color surfaceSubtle;
  final Color surfaceMuted;
  final Color surfaceOverlay;
  final Color borderDefault;
  final Color borderStrong;
  final Color borderFocus;
  final Color brandDefault;
  final Color brandHover;
  final Color brandActive;
  final Color brandSubtle;
  final Color brandMuted;
  final Color brandSecondaryDefault;
  final Color brandSecondaryHover;
  final Color brandSecondaryActive;
  final Color brandSecondarySubtle;
  final Color brandSecondaryMuted;
  final Color successDefault;
  final Color successSubtle;
  final Color successMuted;
  final Color warningDefault;
  final Color warningSubtle;
  final Color warningMuted;
  final Color errorDefault;
  final Color errorSubtle;
  final Color errorMuted;
  final Color infoDefault;
  final Color infoSubtle;
  final Color infoMuted;

  static const light = EagamiColors(
    textPrimary: Color(0xFF111827),
    textSecondary: Color(0xFF4B5563),
    textTertiary: Color(0xFF9CA3AF),
    textDisabled: Color(0xFFD1D5DB),
    textInverse: Color(0xFFFFFFFF),
    textLink: Color(0xFF2F567A),
    textLinkHover: Color(0xFF285175),
    surfaceBase: Color(0xFFFFFFFF),
    surfaceSubtle: Color(0xFFF9FAFB),
    surfaceMuted: Color(0xFFF3F4F6),
    surfaceOverlay: Color(0x80000000),
    borderDefault: Color(0xFFE5E7EB),
    borderStrong: Color(0xFF9CA3AF),
    borderFocus: Color(0xFF3C6C90),
    brandDefault: Color(0xFF2F567A),
    brandHover: Color(0xFF285175),
    brandActive: Color(0xFF11365C),
    brandSubtle: Color(0xFFEEF4F8),
    brandMuted: Color(0xFFD5E5F0),
    brandSecondaryDefault: Color(0xFF594B6E),
    brandSecondaryHover: Color(0xFF493D5C),
    brandSecondaryActive: Color(0xFF40374F),
    brandSecondarySubtle: Color(0xFFF3F1F7),
    brandSecondaryMuted: Color(0xFFE3DEED),
    successDefault: Color(0xFF16A34A),
    successSubtle: Color(0xFFF0FDF4),
    successMuted: Color(0xFFDCFCE7),
    warningDefault: Color(0xFFD97706),
    warningSubtle: Color(0xFFFFFBEB),
    warningMuted: Color(0xFFFEF3C7),
    errorDefault: Color(0xFFDC2626),
    errorSubtle: Color(0xFFFEF2F2),
    errorMuted: Color(0xFFFEE2E2),
    infoDefault: Color(0xFF0891B2),
    infoSubtle: Color(0xFFECFEFF),
    infoMuted: Color(0xFFCFFAFE),
  );

  static const dark = EagamiColors(
    textPrimary: Color(0xFFF9FAFB),
    textSecondary: Color(0xFF9CA3AF),
    textTertiary: Color(0xFF6B7280),
    textDisabled: Color(0xFF374151),
    textInverse: Color(0xFF111827),
    textLink: Color(0xFF2F567A),
    textLinkHover: Color(0xFF285175),
    surfaceBase: Color(0xFF030712),
    surfaceSubtle: Color(0xFF111827),
    surfaceMuted: Color(0xFF1F2937),
    surfaceOverlay: Color(0x80000000),
    borderDefault: Color(0xFF374151),
    borderStrong: Color(0xFF6B7280),
    borderFocus: Color(0xFF3C6C90),
    brandDefault: Color(0xFF628EAD),
    brandHover: Color(0xFF7DB1CE),
    brandActive: Color(0xFFACCFE2),
    brandSubtle: Color(0x1A628EAD),
    brandMuted: Color(0x33628EAD),
    brandSecondaryDefault: Color(0xFF594B6E),
    brandSecondaryHover: Color(0xFF493D5C),
    brandSecondaryActive: Color(0xFF40374F),
    brandSecondarySubtle: Color(0xFFF3F1F7),
    brandSecondaryMuted: Color(0xFFE3DEED),
    successDefault: Color(0xFF16A34A),
    successSubtle: Color(0xFFF0FDF4),
    successMuted: Color(0xFFDCFCE7),
    warningDefault: Color(0xFFD97706),
    warningSubtle: Color(0xFFFFFBEB),
    warningMuted: Color(0xFFFEF3C7),
    errorDefault: Color(0xFFDC2626),
    errorSubtle: Color(0xFFFEF2F2),
    errorMuted: Color(0xFFFEE2E2),
    infoDefault: Color(0xFF0891B2),
    infoSubtle: Color(0xFFECFEFF),
    infoMuted: Color(0xFFCFFAFE),
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
    required this.bodyLg,
    required this.bodyMd,
    required this.bodySm,
    required this.labelLg,
    required this.labelMd,
    required this.labelSm,
    required this.helper,
    required this.code,
  });

  final TextStyle display;
  final TextStyle h1;
  final TextStyle h2;
  final TextStyle h3;
  final TextStyle h4;
  final TextStyle bodyLg;
  final TextStyle bodyMd;
  final TextStyle bodySm;
  final TextStyle labelLg;
  final TextStyle labelMd;
  final TextStyle labelSm;
  final TextStyle helper;
  final TextStyle code;

  static const _sans = 'DM Sans';
  static const _mono = 'JetBrains Mono';

  static const base = EagamiTypography(
    display: TextStyle(fontFamily: _sans, fontSize: 48, fontWeight: FontWeight.w700, height: 1.25),
    h1:      TextStyle(fontFamily: _sans, fontSize: 36, fontWeight: FontWeight.w700, height: 1.25),
    h2:      TextStyle(fontFamily: _sans, fontSize: 30, fontWeight: FontWeight.w600, height: 1.375),
    h3:      TextStyle(fontFamily: _sans, fontSize: 24, fontWeight: FontWeight.w600, height: 1.375),
    h4:      TextStyle(fontFamily: _sans, fontSize: 20, fontWeight: FontWeight.w600, height: 1.375),
    bodyLg:  TextStyle(fontFamily: _sans, fontSize: 18, fontWeight: FontWeight.w400, height: 1.625),
    bodyMd:  TextStyle(fontFamily: _sans, fontSize: 16, fontWeight: FontWeight.w400, height: 1.5),
    bodySm:  TextStyle(fontFamily: _sans, fontSize: 14, fontWeight: FontWeight.w400, height: 1.5),
    labelLg: TextStyle(fontFamily: _sans, fontSize: 16, fontWeight: FontWeight.w500, height: 1.25),
    labelMd: TextStyle(fontFamily: _sans, fontSize: 14, fontWeight: FontWeight.w500, height: 1.25),
    labelSm: TextStyle(fontFamily: _sans, fontSize: 12, fontWeight: FontWeight.w500, height: 1.25),
    helper:  TextStyle(fontFamily: _sans, fontSize: 12, fontWeight: FontWeight.w400, height: 1.5),
    code:    TextStyle(fontFamily: _mono, fontSize: 14, fontWeight: FontWeight.w400, height: 1.5),
  );
}

// =============================================================================
// Spacing
// =============================================================================

@immutable
class EagamiSpacing {
  const EagamiSpacing();

  // Base scale — only these values are permitted (see § 1.1).
  double get s0 => 0;
  double get s1 => 4;
  double get s2 => 8;
  double get s3 => 12;
  double get s4 => 16;
  double get s6 => 24;
  double get s8 => 32;
  double get s12 => 48;
  double get s16 => 64;

  // Semantic shortcuts — size mapping for component paddings/gaps
  double get xs => s1;
  double get sm => s2;
  double get md => s4;
  double get lg => s6;
  double get xl => s8;

  // Insets (component padding)
  EdgeInsets get insetXs => const EdgeInsets.symmetric(vertical: 4, horizontal: 8);
  EdgeInsets get insetSm => const EdgeInsets.symmetric(vertical: 6, horizontal: 12);
  EdgeInsets get insetMd => const EdgeInsets.symmetric(vertical: 8, horizontal: 16);
  EdgeInsets get insetLg => const EdgeInsets.symmetric(vertical: 12, horizontal: 24);
  EdgeInsets get insetXl => const EdgeInsets.symmetric(vertical: 16, horizontal: 32);

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
  const EagamiElevation();

  List<BoxShadow> get none => const [];
  List<BoxShadow> get xs => const [
        BoxShadow(offset: Offset(0, 1), blurRadius: 2, color: Color(0x0D000000)),
      ];
  List<BoxShadow> get sm => const [
        BoxShadow(offset: Offset(0, 1), blurRadius: 3, color: Color(0x1A000000)),
        BoxShadow(offset: Offset(0, 1), blurRadius: 2, spreadRadius: -1, color: Color(0x1A000000)),
      ];
  List<BoxShadow> get md => const [
        BoxShadow(offset: Offset(0, 4), blurRadius: 6, spreadRadius: -1, color: Color(0x1A000000)),
        BoxShadow(offset: Offset(0, 2), blurRadius: 4, spreadRadius: -2, color: Color(0x1A000000)),
      ];
  List<BoxShadow> get lg => const [
        BoxShadow(offset: Offset(0, 10), blurRadius: 15, spreadRadius: -3, color: Color(0x1A000000)),
        BoxShadow(offset: Offset(0, 4), blurRadius: 6, spreadRadius: -4, color: Color(0x1A000000)),
      ];
  List<BoxShadow> get xl => const [
        BoxShadow(offset: Offset(0, 20), blurRadius: 25, spreadRadius: -5, color: Color(0x1A000000)),
        BoxShadow(offset: Offset(0, 8), blurRadius: 10, spreadRadius: -6, color: Color(0x1A000000)),
      ];
  List<BoxShadow> get xxl => const [
        BoxShadow(offset: Offset(0, 25), blurRadius: 50, spreadRadius: -12, color: Color(0x40000000)),
      ];

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

  static const base = EagamiElevation();
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

### 3.3 Context extension (ergonomic access)

Create `lib/theme/eagami_context.dart`:

```dart
import 'package:flutter/material.dart';
import 'eagami_theme.dart';

extension EagamiContext on BuildContext {
  EagamiTheme get eagami =>
      Theme.of(this).extension<EagamiTheme>() ?? EagamiTheme.light;

  /// Returns a motion duration that collapses to zero when the user has
  /// requested reduced motion.
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
        scaffoldBackgroundColor: EagamiTheme.light.colors.surfaceBase,
      ),
      darkTheme: ThemeData.dark().copyWith(
        extensions: const [EagamiTheme.dark],
        scaffoldBackgroundColor: EagamiTheme.dark.colors.surfaceBase,
      ),
      themeMode: ThemeMode.system,
      home: const HomePage(),
    );
  }
}
```

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
        color: t.colors.surfaceBase,
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
// ❌ Hard-coded colors, spacing, and typography
Container(
  padding: const EdgeInsets.all(15), // not on the scale
  decoration: BoxDecoration(
    color: const Color(0xFFFFFFFF), // use t.colors.surfaceBase
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

When building Flutter widgets that mirror Eagami components, preserve the property names, variant enums, and default values below. This keeps behavior predictable across Angular and Flutter.

### 5.1 Button

```dart
enum ButtonVariant { primary, secondary, ghost, danger }
enum EagamiSize { small, medium, large }
enum ButtonType { button, submit, reset } // rarely relevant in Flutter but preserve the enum

class EagamiButton extends StatelessWidget {
  const EagamiButton({
    super.key,
    required this.onPressed,
    required this.child,
    this.variant = ButtonVariant.primary,
    this.size = EagamiSize.medium,
    this.disabled = false,
    this.loading = false,
    this.fullWidth = false,
  });

  final VoidCallback? onPressed;
  final Widget child;
  final ButtonVariant variant;
  final EagamiSize size;
  final bool disabled;
  final bool loading;
  final bool fullWidth;
}
```

**Behavior:**
- `disabled` disables the tap target and dims colors.
- `loading` shows a spinner and disables the tap target, but preserves the button's width.
- `fullWidth: true` stretches to the parent's width.
- Hover on desktop: background shifts to `brandHover`/`brandActive` (via `MouseRegion`).

### 5.2 Input (TextField)

```dart
enum InputStatus { defaultStatus, error, success }

class EagamiInput extends StatefulWidget {
  const EagamiInput({
    super.key,
    this.label,
    this.placeholder,
    this.hint,
    this.error,
    this.size = EagamiSize.medium,
    this.status = InputStatus.defaultStatus,
    this.disabled = false,
    this.readonly = false,
    this.required = false,
    this.value,
    this.onChanged,
    this.onFocused,
    this.onBlurred,
  });

  final String? label;
  final String? placeholder;
  final String? hint;
  final String? error;
  final EagamiSize size;
  final InputStatus status;
  final bool disabled;
  final bool readonly;
  final bool required;
  final String? value;
  final ValueChanged<String>? onChanged;
  final VoidCallback? onFocused;
  final VoidCallback? onBlurred;
}
```

**Behavior:**
- When `error` is non-null, visual status is forced to `error` regardless of `status`.
- `hint` displays below the input; replaced by `error` when error is present.
- Prefix/suffix widgets accepted via named parameters (`prefix`, `suffix`).

### 5.3 Checkbox

```dart
class EagamiCheckbox extends StatelessWidget {
  const EagamiCheckbox({
    super.key,
    required this.checked,
    required this.onChanged,
    this.label,
    this.size = EagamiSize.medium,
    this.disabled = false,
    this.required = false,
    this.indeterminate = false,
  });

  final bool checked;
  final ValueChanged<bool>? onChanged;
  final String? label;
  final EagamiSize size;
  final bool disabled;
  final bool required;
  final bool indeterminate;
}
```

### 5.4 Radio group

```dart
class EagamiRadioGroup<T> extends StatelessWidget {
  const EagamiRadioGroup({
    super.key,
    required this.value,
    required this.onChanged,
    required this.children,
    this.name,
    this.size = EagamiSize.medium,
    this.orientation = Axis.vertical,
    this.disabled = false,
  });

  final T value;
  final ValueChanged<T>? onChanged;
  final List<EagamiRadio<T>> children;
  final String? name;
  final EagamiSize size;
  final Axis orientation;
  final bool disabled;
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

### 5.5 Card

```dart
enum CardVariant { elevated, outlined, filled }
enum CardPadding { none, small, medium, large, extraLarge }

class EagamiCard extends StatelessWidget {
  const EagamiCard({
    super.key,
    this.variant = CardVariant.elevated,
    this.padding = CardPadding.medium,
    this.fullWidth = false,
    this.header,
    this.footer,
    this.headerDivider = false,
    required this.child,
  });

  final CardVariant variant;
  final CardPadding padding;
  final bool fullWidth;
  final Widget? header;
  final Widget? footer;
  final bool headerDivider;
  final Widget child;
}
```

### 5.6 Dropdown

```dart
class DropdownOption<T> {
  const DropdownOption({required this.value, required this.label, this.disabled = false});
  final T value;
  final String label;
  final bool disabled;
}

class EagamiDropdown<T> extends StatefulWidget {
  const EagamiDropdown({
    super.key,
    required this.options,
    required this.value,
    required this.onChanged,
    this.label,
    this.placeholder,
    this.hint,
    this.error,
    this.size = EagamiSize.medium,
    this.disabled = false,
    this.required = false,
  });

  final List<DropdownOption<T>> options;
  final T? value;
  final ValueChanged<T?>? onChanged;
  final String? label;
  final String? placeholder;
  final String? hint;
  final String? error;
  final EagamiSize size;
  final bool disabled;
  final bool required;
}
```

**Keyboard:** ArrowUp / ArrowDown to navigate, Enter/Space to select, Escape to close.

### 5.7 Dialog

```dart
enum DialogSize { small, medium, large, full }

Future<T?> showEagamiDialog<T>({
  required BuildContext context,
  required WidgetBuilder builder,
  DialogSize size = DialogSize.medium,
  bool closeOnBackdrop = true,
  bool closeOnEscape = true,
  bool showClose = true,
  Widget? header,
  Widget? footer,
});
```

### 5.8 Other components

Follow the same conventions for other mirrored Eagami components (Alert, Accordion, Autocomplete, Avatar, Badge, Breadcrumbs, CodeInput, DataTable, DatePicker, Divider, Drawer, Icon, IconButton, Menu, Paginator, ProgressBar, Skeleton, Spinner, Switch, Tabs, Tag, Textarea, Toast, Tooltip, Wordmark). Upstream docs: https://github.com/mwiraszka/eagami-design-system

---

## 6. Accessibility requirements

- **Semantics:** Every interactive widget must supply a `Semantics` label (either via the widget itself or a wrapping `Semantics`). Icon-only buttons must expose their action verbally.
- **Contrast:** Token combinations are pre-tested for WCAG AA:
  - Body text (`textPrimary` on `surfaceBase`): ≥ 4.5:1.
  - Large text (`h1`–`h4` on `surfaceBase`): ≥ 3:1.
  - Never combine `textTertiary` with `surfaceMuted` for body text.
- **Touch targets:** 44×44 logical pixels minimum. The `medium` and `large` sizes satisfy this; `small` is for non-tappable or secondary contexts only.
- **Focus order:** Must match visual reading order. Use `FocusTraversalGroup` and `FocusTraversalOrder` where needed.
- **Form fields:** Labels must be associated with inputs (pass `label` to `EagamiInput`, not a separate `Text` widget). Errors must be announced (`Semantics(liveRegion: true)`).
- **Reduced motion:** Use `context.eagamiDuration()` or rely on the theme's motion tokens. Do not construct raw `Duration` literals for animations.

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
8. Motion durations and curves in § 2.8 match `_motion.scss`.
9. Every `Color(0x…)` literal in § 3.2 matches the corresponding hex in § 2.
10. Component API conventions in § 5 match the Angular component signatures.
11. `last-synced` date in frontmatter updated to today.

**For AI agents performing the sync:** diff this file's tables against the SCSS source of truth and report any discrepancies before editing Dart code. Do not regenerate blindly.
