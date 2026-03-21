# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-03-20

### Fixed

- Move Angular and RxJS from direct dependencies to peer dependencies to prevent version conflicts for consumers with different minor/patch versions

## [0.2.0] - 2026-03-14

### Added

- Add `autocomplete`, `autofocus`, and password visibility toggle inputs to `InputComponent`
- Add `headerAlign` input to `CardComponent`
- Add `IconComponent` and `IconButtonComponent`

## [0.1.0] - 2026-03-09

### Added

- `ButtonComponent` with variant (`primary`, `secondary`, `ghost`, `danger`), size, and loading state support
- `InputComponent` with full `ControlValueAccessor` integration, label, hint, and error state
- `CheckboxComponent` with `ControlValueAccessor` integration and indeterminate state
- `RadioComponent` and `RadioGroupComponent` with composite pattern and `ControlValueAccessor` integration
- `DropdownComponent` with `ControlValueAccessor` integration
- `DialogComponent` built on the native `<dialog>` element
- `CardComponent`
- Global SCSS design tokens for colors, typography, spacing, elevation, motion, and shape
- CSS custom property theming support

[0.3.0]: https://github.com/mwiraszka/eagami-design-system/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/mwiraszka/eagami-design-system/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/mwiraszka/eagami-design-system/releases/tag/v0.1.0
