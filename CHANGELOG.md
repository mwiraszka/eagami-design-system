# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.9.0] - 2026-04-13

### Added

- Add `AutocompleteComponent` (`ea-autocomplete`) — text input with filtered suggestion dropdown, keyboard navigation, configurable `minLength` and `maxResults`, and `ControlValueAccessor` integration
- Add `BreadcrumbsComponent` (`ea-breadcrumbs`) — navigation trail with chevron or slash separators, link/button/disabled item rendering, and automatic current-page handling for the last item
- Add `DrawerComponent` (`ea-drawer`) — side panel built on native `<dialog>` with four positions (left/right/top/bottom), sizes, focus trapping, backdrop/escape close, and header/footer content slots
- Add `EagamiWordmarkComponent` (`ea-eagami-wordmark`) — branded wordmark linking to eagami.com with `logo`, `signature`, and `brand` variants and `sm`/`md`/`lg` sizes that scale the logo and text proportionally
- Add `MenuComponent` (`ea-menu`) and `MenuItemComponent` (`ea-menu-item`) — popup action menu with trigger slot, four placements, keyboard navigation, icon support, disabled items, and `danger` variant
- Add `ea-icon-eagami` brand logo icon used by `EagamiWordmarkComponent`

### Fixed

- Set default `1em × 1em` sizing on all icon components so icons render at the inherited font size when placed inside buttons without explicit sizing
- Allow `PaginatorComponent` controls to wrap onto multiple lines in narrow containers instead of overflowing horizontally
- Resolve strict type checking error in Storybook build for the autocomplete story

## [0.8.1] - 2026-04-11

### Fixed

- Ensure package.json version matches branch version before merge to prevent failed npm publishes

## [0.8.0] - 2026-04-11

### Added

- Add `DataTableComponent` (`ea-data-table`) with sortable columns, sticky header, density modes, striped/bordered/hoverable options, column formatting via `format` callback, and empty state
- Add `PaginatorComponent` (`ea-paginator`) with page size selector, range label, placement option, and smart page number ellipsis
- Add `aria-current` input to `ButtonComponent` for active page indication in pagination
- Add `captureOriginal()` method to `AvatarEditorComponent` for snapshotting the current image and crop state as the new original after a save
- Add 25 utility icon components: `alert-triangle`, `arrow-left`, `arrow-right`, `bell`, `calendar`, `check-circle`, `chevron-up`, `clock`, `copy`, `download`, `external-link`, `file`, `filter`, `heart`, `image`, `link`, `log-out`, `mail`, `menu`, `more-horizontal`, `pencil`, `search`, `settings`, `star`, `x-circle`
- Add 5 brand logo icon components with official brand colors: `apple`, `facebook`, `github`, `microsoft`, `x-twitter`
- Add Storybook stories for Avatar, Badge, Divider, Spinner, Switch, Toast, and Tooltip components

## [0.7.4] - 2026-04-04

### Added

- Add `loading` input to `AvatarEditorComponent` for showing a skeleton placeholder while avatar data is fetched externally

### Fixed

- Fix `AvatarEditorComponent` revert button being enabled on initial load before any changes are made
- Restore exact original zoom/pan crop state when reverting, instead of resetting to defaults
- Preserve the original image in memory so reverting after file uploads restores it instantly without a network request
- Support reverting to an empty state when the component started with no image
- Remove unused `revertSrc` input from `AvatarEditorComponent` (revert now always uses the stored original from initial load)

## [0.7.3] - 2026-04-04

### Added

- Separate `revertSrc` input on `AvatarEditorComponent` so the "revert to original" button can reset to a different image than `currentSrc`

### Fixed

- Remove unused `tslib` dependency from published package

## [0.7.2] - 2026-04-03

### Added

- Show a loading skeleton inside `AvatarEditorComponent` while an image is being fetched — skeleton matches the editor shape (`circle` or `rect`) and canvas size

### Fixed

- Disable `AvatarEditorComponent` revert button once already reverted to original; re-enables on any zoom or pan change

## [0.7.1] - 2026-04-03

### Fixed

- Fix `AvatarEditorComponent` to apply `cropState` on every `currentSrc` change, not just the initial load — restores crop position correctly when the source URL is swapped after the first render
- Fix `AvatarEditorComponent` to suppress `cropStateChange` emission during programmatic image loads (`currentSrc` changes and revert) — prevents transient state divergence that caused the save button to flicker enabled

## [0.7.0] - 2026-04-02

### Added

- Add `ProgressBarComponent` (`ea-progress-bar`) with determinate and indeterminate modes, semantic variants, and optional label/value display
- Add `TagComponent` (`ea-tag`) with semantic variants, sizes, and optional remove button
- Add `cropState` input to `AvatarEditorComponent` — when provided alongside `currentSrc`, restores zoom and pan position after the image loads; ignored on subsequent `currentSrc` changes
- Add `cropStateChange` output to `AvatarEditorComponent` — emits the current crop state on every zoom or pan change
- Add `fileSelected` output to `AvatarEditorComponent` — emits the original `File` when the user picks or drops a file (fires after validation passes)
- `exportCrop()` on `AvatarEditorComponent` now returns `Promise<Blob>`; the `(cropped)` output continues to fire for backwards compatibility
- Add `--ea-card-header-padding`, `--ea-card-body-padding`, and `--ea-card-footer-padding` CSS custom properties to `CardComponent` for per-section padding overrides
- Add `--ea-input-toggle-color` CSS custom property to `InputComponent` for overriding the password visibility toggle color

## [0.6.0] - 2026-03-28

### Added

- Add `CodeInputComponent` (`ea-code-input`) for verification code entry with auto-advance, paste support, arrow key navigation, and `ControlValueAccessor` integration
- Add `TabsComponent` (`ea-tabs`) and `TabComponent` (`ea-tab`) with underline and filled variants, keyboard navigation, and ARIA tab roles
- Add `AlertComponent` (`ea-alert`) with semantic variants (default, success, warning, error, info) and dismissible option
- Add `SkeletonComponent` (`ea-skeleton`) with text, circle, and rect variants for loading placeholders
- Add `AccordionComponent` (`ea-accordion`) and `AccordionItemComponent` (`ea-accordion-item`) with single and multi-expand modes
- Add `ea-icon-chevron-down` icon component

### Changed

- Remove `rxjs` from peer dependencies (no longer used by any component)
- Remove `tslib` from dependencies (not used in compiled output)

### Fixed

- Fix tab panel spacing increasing with each tab due to empty host elements participating in flex gap layout

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

[0.9.0]: https://github.com/mwiraszka/eagami-design-system/compare/v0.8.1...v0.9.0
[0.8.1]: https://github.com/mwiraszka/eagami-design-system/compare/v0.8.0...v0.8.1
[0.8.0]: https://github.com/mwiraszka/eagami-design-system/compare/v0.7.4...v0.8.0
[0.7.4]: https://github.com/mwiraszka/eagami-design-system/compare/v0.7.3...v0.7.4
[0.7.3]: https://github.com/mwiraszka/eagami-design-system/compare/v0.7.2...v0.7.3
[0.7.2]: https://github.com/mwiraszka/eagami-design-system/compare/v0.7.1...v0.7.2
[0.7.1]: https://github.com/mwiraszka/eagami-design-system/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/mwiraszka/eagami-design-system/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/mwiraszka/eagami-design-system/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/mwiraszka/eagami-design-system/compare/v0.4.1...v0.5.0
[0.4.1]: https://github.com/mwiraszka/eagami-design-system/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/mwiraszka/eagami-design-system/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/mwiraszka/eagami-design-system/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/mwiraszka/eagami-design-system/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/mwiraszka/eagami-design-system/releases/tag/v0.1.0
