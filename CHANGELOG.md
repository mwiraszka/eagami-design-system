# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.0] - 2026-03-28

### Added

- Add `CodeInputComponent` (`ea-code-input`) for verification code entry with auto-advance, paste support, arrow key navigation, and `ControlValueAccessor` integration

## [0.5.0] - 2026-03-22

### Added

- Add hover overlay on avatar editor canvas to change photo by clicking the image
- Add revert-to-original and remove icon buttons inline with zoom controls in avatar editor
- Add tooltips to all avatar editor icon buttons
- Add `removed` output to `AvatarEditorComponent`
- Add icon components: `ea-icon-camera`, `ea-icon-minus`, `ea-icon-plus`, `ea-icon-rotate-ccw`, `ea-icon-trash`, `ea-icon-upload`
- Add `--shadow-focus-ring-error` and `--shadow-focus-ring-success` elevation tokens
- Add `pnpm screenshots` command to capture README component images via Puppeteer

### Changed

- Redesign avatar editor controls: replace Change/Remove/Apply buttons with icon button row and canvas hover overlay
- Avatar editor controls are always visible (disabled when no image is loaded)

### Fixed

- Fix avatar editor image not displaying until clicked by using `afterNextRender` instead of `setTimeout`/`requestAnimationFrame`
- Fix browser autofill adding light blue background to input fields
- Replace all hardcoded hex and rgba colors with design token references

## [0.4.1] - 2026-03-22

### Fixed

- Update README so npm package page displays correctly

## [0.4.0] - 2026-03-22

### Changed

- Use `--color-text-primary` as default color for `AvatarEditorComponent` zoom buttons instead of `--color-text-secondary`

### Fixed

- Set `display: inline-block; line-height: 0` on `AvatarComponent` host element to eliminate extra space below the avatar
- Load `currentSrc` image in `AvatarEditorComponent` on initialization so pre-existing avatars display in the editor
- Use local sample avatar image in sandbox instead of external URL

## [0.3.0] - 2026-03-21

### Added

- Add `xl` padding option to `CardComponent` (32px)
- Add `--ea-card-shadow` CSS custom property for overriding card box-shadow without `::ng-deep`
- Add `--ea-button-font-size` and `--ea-button-font-weight` CSS custom properties for overriding button typography without `::ng-deep`
- Add icon components: `ea-icon-google`, `ea-icon-check`, `ea-icon-x`, `ea-icon-user`, `ea-icon-info`, `ea-icon-loader`
- Add `AvatarComponent` with image, initials, and icon fallback; `size` (xs–xl) and `shape` (circle/square) inputs
- Add `BadgeComponent` with semantic variants (default/success/warning/error/info) and size options
- Add `SpinnerComponent` with SVG-based loading animation and accessible `role="status"`
- Add `SwitchComponent` with `ControlValueAccessor` integration, label, and size options
- Add `TextareaComponent` with `ControlValueAccessor` integration, mirroring `InputComponent` API (label, hint, error, size, status, resize, maxlength)
- Add `DividerComponent` with horizontal/vertical orientation and optional label
- Add `TooltipDirective` (`[eaTooltip]`) with configurable position (top/bottom/left/right), triggered on hover and focus
- Add `ToastComponent` and `ToastService` for notification toasts with semantic variants, auto-dismiss, and slide-in animation
- Add `AvatarEditorComponent` with drag-and-drop upload, pan, zoom, and crop export for circle and square shapes

### Fixed

- Make toast widths independent so each toast sizes to its own content; full-width layout on mobile (<640px)
- Increase `lg` size font for `InputComponent` and `TextareaComponent` to `--font-size-lg` for a clearer distinction from `md`
- Remove double spacing between card header/body/footer sections (header no longer adds bottom padding, footer no longer adds top padding)
- Use color inheritance in `InputComponent` so password toggle and hint messages respect parent context colors
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

[0.6.0]: https://github.com/mwiraszka/eagami-design-system/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/mwiraszka/eagami-design-system/compare/v0.4.1...v0.5.0
[0.4.1]: https://github.com/mwiraszka/eagami-design-system/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/mwiraszka/eagami-design-system/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/mwiraszka/eagami-design-system/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/mwiraszka/eagami-design-system/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/mwiraszka/eagami-design-system/releases/tag/v0.1.0
