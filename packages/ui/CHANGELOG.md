# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [5.39.0] - 2026-09-08

### Added

- Add image-plus, image-search, microscope, and rows icons.

## [5.38.1] - 2026-09-01

### Changed

- Tidy the internal docs metadata and test coverage behind the field label icon, with no change to the published API.

## [5.38.0] - 2026-08-30

### Added

- Add a `labelIcon` input to every labelled field component, from the inputs and pickers to the sliders, radio group, rating, segmented control, file uploader and form field, rendering an icon component before the label text through the shared field label.

## [5.37.0] - 2026-08-30

### Added

- Add a `modal` input to the dialog: when true (the default) the page behind is inert and cannot scroll, while false opens it non-modally via `show()`, floating with no backdrop, so the page behind stays scrollable and interactive.
- Expand the icon set with two image-editing icons: contrast and rotate ccw square.

## [5.36.0] - 2026-08-25

### Changed

- Allow typing a time straight into the time picker's field: hand-typed text is read leniently on Enter or blur, in 12- or 24-hour notation with or without separators, unreadable text falls back to the held value, and cleared text clears it.

## [5.35.0] - 2026-08-22

### Added

- Add `uppercase` to the button, tag and badge, rendering their text in all capitals.
- Add an `--ea-button-radius` hook, so a button can become a pill through its own chrome.

### Fixed

- Keep the dialog body's scrollbar gutter reserved, so content sitting at the overflow threshold no longer flickers between its scrollbar states.

## [5.34.0] - 2026-08-20

### Added

- Add `popoverMaxHeight` to the multi-select, capping how tall the option popover may grow before its list scrolls.
- Add an `--ea-file-uploader-dropzone-padding` hook, so a consumer can tighten the dropzone through the uploader's own chrome.

### Fixed

- Apply `--ea-button-padding` to icon-only buttons too, which kept their built-in square padding and ignored the hook.

## [5.33.0] - 2026-08-18

### Added

- Add `--ea-button-padding` and `--ea-button-min-height` hooks, so a consumer can tighten an icon button to its glyph through the button's own chrome rather than by reaching into it.

### Fixed

- Keep the swatch's colour covering its transparency checkerboard exactly: both now paint on the one box, so sub-pixel rounding at fractional sizes can no longer leave a rim of the pattern flickering at the edge.

## [5.32.0] - 2026-08-18

### Added

- Add `snapValues` to the slider: values the thumb is pulled onto while dragging, each drawn as a tick on the track, so a marked value can be landed exactly.

### Fixed

- Stop a slider from following the cursor after the button is released: a drag now starts only on the primary button, ends the moment a move arrives with no button held, and captures the pointer on the track itself.

## [5.31.0] - 2026-08-18

### Changed

- Match every text filter past accents, so a term typed on a plain keyboard finds the accented spelling ("jablko" finds "Jabłko"): the multi-select's search and its create-row duplicate check, the autocomplete's option filtering, the dropdown's typeahead, and the command palette's filter.

### Fixed

- Keep focus rings and slider thumbs from being cut off at the bottom of a scrolling dialog body: the seam under the body now lives inside its scroll box instead of on the slot beneath it.
- Centre a field's error icon on the eye's line with the message text, where it sat a pixel low.

## [5.30.2] - 2026-08-16

### Fixed

- Fix every popover opened from inside a modal dialog being unusable: its surface now sits inside the dialog, where a select, autocomplete, date picker or menu can take the focus and the pointer again.
- Balance a dialog's padding across every combination of slots: each seam between two slots carries a single gap, no seam is padded from both sides, and the outermost slot on each side carries the panel's own edge.

## [5.30.1] - 2026-08-16

### Fixed

- Fix a popover opened from inside a modal dialog being left in the normal layer, where it took no focus and closed on its own clicks.

## [5.30.0] - 2026-08-16

### Added

- Add `--ea-dialog-inset`, `--ea-dialog-radius`, `--ea-dialog-max-height`, `--ea-dialog-header-padding`, `--ea-dialog-body-padding` and `--ea-dialog-status-padding`, so a dialog can run edge to edge or tune its chrome per instance.
- Ship an `@eagami/ui/testing` entry point with a native dialog shim for jsdom test runs.

### Changed

- **Breaking:** Move the dialog's close button into the header row, so header content lays out against it instead of reserving room by hand.
- **Breaking:** Restore the tag's uncapped default width, making `maxWidth` clipping opt-in again.

### Fixed

- Fix tooltips collapsing to a sliver of their text in Safari.

## [5.29.0] - 2026-08-16

### Added

- Let a dialog refuse a close: `manualClose` reports every close route through `closeRequested` and leaves the dialog open until the consumer closes it.
- Add `closeDisabled` to the dialog, for a close button that has to be unavailable while a task is in flight.
- Add a `status` slot to the dialog, held between the body and the footer and out of the body's scroll box.
- Extend the dialog and drawer width scale with a `2xl` step above `xl`.
- Offer a Create row in the multi-select through `allowCreate`, reporting the typed text as `created` when the search matches no option.
- Give the tag a `color` input that paints the chip from a hex value and picks whichever ink reads on it.
- Accept a fluid `maxWidth` on the tag, so a chip can be capped against its container rather than a fixed width.
- Add `truncate` to the checkbox, ellipsizing a label too long for its column and revealing the full text in a tooltip.
- Add a `compact` colour picker trigger, a bare swatch without the value text or the clear button.
- Let a tooltip move to the side that fits with `flip`, and show only over clipped content with `whenClipped`.
- Expose the dialog header typography, the input focus treatment, and the code input's cells, spacing and state borders as custom properties.

### Changed

- **Breaking:** Move a tooltip with no room on its requested side to the opposite one by default; set `flip` to false for the old behaviour of nudging it inward.
- Toggle a focused checkbox on Enter, which a native checkbox leaves to the form.
- Hold a dialog inside the viewport, so a wide preset no longer overflows a narrow screen sideways.
- Balance a dialog's body padding when it has no header or no footer, instead of leaving the content tight against one edge.

## [5.28.0] - 2026-08-16

### Added

- Accept an image dropped onto the avatar editor's preview, outlined and captioned while a file is held over it.

### Changed

- Keep an open dropdown on the side of its field it opened on, moving it only when that side no longer fits.
- Move focus to the multi-select's last remaining match as it is typed, so Enter takes it and clears the search for the next one.
- Give the multi-select's search input focus as soon as its panel opens.
- Reword the avatar editor's drop prompt away from uploading, and settle on the camera icon for both of its prompts.

### Fixed

- Redraw the avatar editor when a dropped image replaces the one already loaded.
- Keep a dialog, drawer, command palette or popover open when a drag that began inside it is released outside, so selecting text no longer dismisses it.
- Fix the dead space left beside a tooltip that wraps after a page zoom.
- Hold the multi-select at one height once its chips start to scroll.

## [5.27.0] - 2026-08-14

### Added

- Add a `spellcheck` input to the input, left to the browser default when unset.

### Fixed

- Stop the command palette's search field from spellchecking the commands typed into it.

## [5.26.1] - 2026-08-14

### Fixed

- Clear the command palette's search when Enter is pressed on its clear button, which ran the highlighted command instead.
- Narrow the input's `aria-activedescendant` to a single unset form, so it no longer accepts both `null` and `undefined`.
- Run a command palette's `disabledWhen` predicate once per matching command rather than on every keystroke and hover.

## [5.26.0] - 2026-08-14

### Added

- Add `disabledWhen` to the command palette, a predicate that disables matching commands, and keep disabled commands visible as greyed-out, inert rows instead of hiding them.
- Add `keepIcon` to the input, keeping the leading icon while the field has a value, with `false` restoring the previous hide-with-placeholder behaviour.
- Forward `role`, `aria-expanded`, `aria-controls`, `aria-activedescendant`, and `aria-autocomplete` from the input to its native control for combobox-style hosts.

### Changed

- **Breaking:** Remove the unused `commandPalette.clear` message from the localized message set.
- Rebuild the command palette's search field on the input component, giving it the standard focus ring, leading search icon, and clear button.
- Soften dividers to a translucent wash in both themes across the command palette, grouped option lists, and the divider.
- Inset the command palette's top divider to match its section rules.
- Shrink the input's leading icon to two thirds of its previous size.

## [5.25.1] - 2026-08-13

### Fixed

- Scale the remaining fixed gaps and paddings with the `size` input across the stepper, radio, radio group, tabs, multi-select, transfer list, slider, range slider, code input, autocomplete, dropdown, data table, badge, file uploader, and segmented control.
- Apply the `2xs` size to the tabs, which previously fell back to the surrounding font size.
- Scale the stepper's optional-step caption with the `size` input.

## [5.25.0] - 2026-08-12

### Added

- Add `dismissDelay` to the tooltip, a grace period before a scrollable bubble hides so the pointer can reach it.

### Changed

- Keep every tooltip inside the viewport, scrolling content that no longer fits and letting the pointer reach it, with `--ea-tooltip-viewport-margin` setting the gap left at each edge.

## [5.24.0] - 2026-08-11

### Added

- Accept a toast's title and message as text segments, drawing the parts marked strong at full strength while the rest of the line steps back, with `--ea-toast-strong-weight` to retune the weight.

### Changed

- Draw the spinner in the primary brand colour.

## [5.23.0] - 2026-08-10

### Added

- Accept option groups on the multi-select, dropdown, and autocomplete, each rendering under its own heading or under a rule when unlabelled.

## [5.22.1] - 2026-08-08

### Fixed

- Pin the dialog's and drawer's close button back to the top-right corner of the panel.

## [5.22.0] - 2026-08-08

### Added

- Cap a tag's width with `maxWidth`, 200px by default, ellipsizing a longer label and revealing its full text in a tooltip above or below the chip.
- Cap the multi-select's option panel to the field's width and its chips with `maxChipWidth`, with a tooltip on any option label the panel clips.
- Emit the file uploader's drag-over state, and expose custom properties for the dropzone's background and text colours.

### Changed

- Open the multi-select panel from the field's edge rather than from the chip row, matching every other field.

### Fixed

- Handle `dragenter` in the file uploader, which used to leave a wrapping element's own drag state stuck on.
- Stop a field nested inside a bound field adopting the outer control's error, which repeated the message under every option in a multi-select.
- Hold the multi-select trigger at one height whether or not it holds chips.

## [5.21.0] - 2026-08-08

### Added

- Give the toast an optional title, shown above the message, which steps the message back when set.
- Accept a date typed straight into the date picker, in ISO, all-numeric, or month-name form, and rewrite it in the picker's own format.

### Changed

- **Breaking:** Drop the date picker's default placeholder text; pass `placeholder` to show one.
- Enlarge the toast icon and give it more room from the text beside it.
- Quiet a readonly field under the pointer: no focus ring on click, no hover on its icons, and no pointer cursor.

## [5.20.0] - 2026-08-08

### Added

- Give the number input a `maxDigits` input, capping how many characters it accepts and sizing the field to match.

### Changed

- **Breaking:** Size the number input to the characters it accepts instead of filling its container, six by default, with equal-width digits so the value no longer shifts as it is typed.
- **Breaking:** Strip the increment and decrement buttons from the number input, leaving a plain field that still accepts only numbers and keeps its min, max, and step bounds; stepping stays on the arrow keys. The `numberInput.increment` and `numberInput.decrement` messages are removed.
- **Breaking:** Grow the pointer target of every clear, close, and dismiss button to the 24px WCAG 2.2 minimum without changing how large it looks, so the dense sizes stay operable.
- **Breaking:** Stop the field label shrinking below 12px, and error and hint text below 11px, however small the component's size is set.

## [5.19.0] - 2026-08-08

### Added

- Add a `2xs` size to every sized component, one step below `xs`, for dense toolbars and compact chrome.
- Expand the icon set with 16 media icons covering file formats, playback, and editing: file image, file video, file audio, file PDF, images, clapperboard, waveform, subtitles, picture-in-picture, aspect ratio, transcode, record, playlist, keyframe, timecode, and trim.

### Changed

- **Breaking:** Give a button that has an icon and no label equal padding on all four sides, taken from the smaller vertical value, so it renders as a square instead of a wide pill.

## [5.18.0] - 2026-08-06

### Changed

- Export the `EagamiUiConfig` type, so an app can name or extend the object it passes to `provideEagamiUi()`.

### Fixed

- Apply a consumer's brand palette under a strict Content Security Policy, where the theme stylesheet was dropped and the app quietly fell back to the library's own colours.

## [5.17.2] - 2026-08-06

### Fixed

- Show menus, dropdowns, selects, pickers, and tooltips opened from inside a dialog or drawer, which until now were painted behind the modal and unreachable.
- Stop Escape closing a menu or popover and the dialog around it at the same time, so one press dismisses only the innermost overlay.

## [5.17.1] - 2026-08-04

### Fixed

- Hide a toast's custom icon from assistive technology, matching the alert's decorative icon treatment.

## [5.17.0] - 2026-08-04

### Added

- Add an icon override to the toast service, so any toast can carry any icon component in place of its variant's own, or none at all.

### Changed

- Rebalance the toast: default to the small size, match the status icon to the text size, and align its gap and width cap with the alert.
- Enlarge the section-heading composite style from 20px to 22px, so page subsections read a clear step above body text.

### Fixed

- Stop the divider throwing a hydration error during server-side rendering when several dividers hydrate on the same page.

## [5.16.1] - 2026-08-02

### Fixed

- Keep the paginator's controls reachable in a container too narrow for them, where end and centre alignment pushed them off the start edge with no way to scroll back.
- Stop the transfer list's panes collapsing to a width that clips their own item labels.
- Centre the wordmark against text placed beside it, where a line box left empty space under the logo.

## [5.16.0] - 2026-08-02

### Added

- Add an `orientation` input to the stepper, so steps can stack vertically where a row will not fit.

## [5.15.1] - 2026-08-02

### Fixed

- Re-disable the avatar editor's revert control once the crop is panned or zoomed back to where it started.
- Keep the avatar editor's revert control disabled while a replacement image is still loading.

## [5.15.0] - 2026-08-01

### Changed

- Build and test against Angular 22 and TypeScript 6. The supported peer range is unchanged, so Angular 21 and 22 consumers are both still supported.

### Fixed

- Release the avatar editor's drag listeners when it is destroyed mid-drag, which previously left them bound to the document.
- Re-clamp the avatar editor's image when the canvas shrinks, which could leave a gap inside the frame.

## [5.14.4] - 2026-08-01

### Fixed

- Expose the colour picker's saturation area as a slider carrying its own value, instead of a role that switches screen readers out of browse mode without reporting anything.
- Keep each date picker's keyboard focus inside its own calendar when more than one is open.
- Stop a popover erroring when an application dispatches a scroll event directly at the window.

## [5.14.3] - 2026-08-01

### Fixed

- Emit the colour in the newly chosen notation as soon as the format toggle is cycled, instead of leaving the bound value in the previous format until the next edit.
- Send the color picker's hue slider to the end of the strip on End, which previously jumped back to the start.
- Mark the matching colour preset as pressed regardless of which output format the value uses.
- Keep the colour swatch opaque when the alpha slider is hidden, matching the value the picker actually emits.

## [5.14.2] - 2026-08-01

### Fixed

- Name the menu, color picker, and multi-select panels, whose accessible names were bound through a mismatched alias and never reached the rendered surface.

## [5.14.1] - 2026-08-01

### Fixed

- Step the date picker a whole month on PageUp and PageDown, which previously skipped past short months entirely when the focused day had no counterpart there.
- Move the date picker's keyboard focus into the month the header buttons navigate to, so days stay reachable and the next arrow key no longer jumps back.
- Accept percentage channels in an `rgb()` color, which were previously read as raw numbers and rendered far too dark.
- Normalize out-of-range `hsl()` colors instead of deriving negative or overflowing channels from them.
- Release the previous push target when a drawer's `pushTarget` changes while it is open, which left the old element permanently indented.
- Correct the migration guide, which skipped the v1 to v2 and v2 to v3 upgrades entirely.
- Correct several changelog entries whose stated icon counts, deprecation versions, and wordmark sizing did not match what shipped.
- Point the Angular Material comparison link at its current domain.

## [5.14.0] - 2026-08-01

### Changed

- Scale every form component's label, hint, and error text with its `size`, so a large field no longer pairs a large control with small chrome. Sizes other than `md` change appearance; `md` is unchanged.
- Scale the progress bar's label and value with its `size`, which previously rendered identically at every size.
- Scale the avatar editor's dropzone, icons, and controls continuously from `canvasSize` instead of switching at two hard-coded breakpoints, so a small canvas no longer jumps between densities.
- Derive the drawer's panel extent from one custom property per axis, replacing the per-size width and height rules duplicated across each placement.

### Fixed

- Open the dropdown onto the first selectable option instead of highlighting a disabled first option.

## [5.13.0] - 2026-08-01

### Added

- Add an `aria-label` input to `<ea-input>` and `<ea-textarea>` for fields with no visible label.
- Add `aria-label` and `caption` inputs to `<ea-data-table>` so a table can be named, with the caption also rendering above it.
- Add a `removeTabbable` input to `<ea-tag>` for chips inside a composite widget that owns keyboard navigation.

### Changed

- Announce transfer list moves in a live region so the destination and count are spoken.
- Name paginator page buttons beyond their bare digit.

### Fixed

- Apply menu trigger and tooltip ARIA to the control a component renders, so state reaches the button inside `<ea-button>` instead of stranding on the wrapper.
- Take multi-select chip remove buttons out of the tab order, which nested focusable controls inside the combobox.
- Draw the file uploader and avatar editor accents from the semantic color tokens so they follow a retheme.

## [5.12.2] - 2026-07-31

### Fixed

- Ensure time picker stepper buttons respond to keyboard activation.
- Announce error and warning toasts immediately, and pause toast auto-dismiss while the pointer or keyboard focus is on the stack.
- Make the multi-select's Select all row keyboard-accessible inside the option list, announce empty search results, and let the whole box toggle the list on click.
- Keep the keyboard-focused option scrolled into view in dropdown and multi-select lists.
- Correct the autocomplete's expanded state and selected-option announcements.
- Restore button semantics for the date picker's calendar day cells.
- Prevent a required file uploader from silently blocking form submission.
- Stop dialogs and drawers referencing an empty header as their accessible name.
- Expose disabled command palette items to assistive technology and skip them during arrow-key navigation.
- Let keyboard users scroll the virtual list even without an aria-label.
- Remove the avatar editor's invisible tab stop on its hidden file input.
- Mirror stepper and tree arrow-key navigation in right-to-left layouts.
- Add hover feedback to the tree's expand chevron, and an explicit label association to the switch.

## [5.12.1] - 2026-07-29

### Added

- Add a `--ea-divider-length` styling hook that pins the vertical divider's exact length.

### Changed

- Update development tooling dependencies.

## [5.12.0] - 2026-07-28

### Added

- Add a `linked` input to the wordmark so it can render without its built-in eagami.com link, for embedding in a custom link.

### Changed

- **Breaking:** Make the wordmark `size` input the brand text's font-size in px (previously it was the logo's size); the default drops from 48 to 24 so the brand text renders at its previous size.
- Re-proportion the wordmark: the logo renders at 1.5 times the text size, with a gap of one twelfth of the logo between them.
- Change the wordmark byline to "designed by" in every locale.
- Tuck the wordmark byline closer to the brand text, and raise the tagline variant's text for optical balance against the logo.

## [5.11.0] - 2026-07-25

### Added

- Add a `--ea-dialog-size` custom property that drives the dialog panel width.

### Changed

- **Breaking:** Make the tree expand chevron decorative; expansion state is announced via the treeitem's `aria-expanded` and toggled with the arrow keys. The tree-node `expandLabel` and `collapseLabel` inputs and the `tree.expand`/`tree.collapse` locale messages are removed.

## [5.10.1] - 2026-07-24

### Added

- Add checkbox label and count colour styling hooks (`--ea-checkbox-label-color`, `--ea-checkbox-count-color`).

### Fixed

- Mark the Framer icon as a brand icon, matching the other brand marks.

## [5.10.0] - 2026-07-24

### Added

- Allow the tooltip to render a TemplateRef, so consumers can show styled multi-part content instead of a plain string.

### Changed

- **Breaking:** Remove the share-2 icon, which was an accidental duplicate of the share icon.

### Fixed

- Let the tooltip bubble grow past its max width instead of clipping unbreakable template content such as avatars and icon rows.

## [5.9.0] - 2026-07-24

### Added

- Add 10 commonly used icons: bug, building, calculator, history, lightbulb, megaphone, palette, pin, plug, and timer.

## [5.8.6] - 2026-07-21

### Changed

- Update the README to list all components (adding Form Field, Number Input, and Timeline) and reflect the Angular v21 and v22 peer range.

### Fixed

- Mark the Twitter, Instagram, Trello, and Dribbble icons as brand icons (`isBrand`), matching the other Feather brand marks.

## [5.8.5] - 2026-07-18

### Fixed

- Give the command palette's search input a visible focus ring for keyboard users.
- Make the paginator's page-size dropdown chevron follow the theme colour so it is visible in dark mode, and scale it with the paginator's size.

## [5.8.4] - 2026-07-18

### Changed

- Align the avatar editor controls and number input steppers with the shared icon-button styling so their hover, focus, and disabled states match the rest of the library.

## [5.8.3] - 2026-07-18

### Fixed

- Scale the color picker's popover with its size input, so the saturation area, hue and alpha sliders, value inputs, and preset swatches grow with the field instead of staying a fixed size.

## [5.8.2] - 2026-07-18

### Fixed

- Scale the time picker's popover with its size input, so the hour/minute steppers, value fields, and AM/PM controls grow with the field instead of staying fixed.
- Make the switch, badge dot, slider and range-slider min/max labels, and the dropdown, autocomplete, and multi-select option rows scale proportionally with their size input; the badge dot now covers the full size range without an abrupt jump.

## [5.8.1] - 2026-07-17

### Fixed

- Make the transfer list and tree scale proportionally across all sizes: list heights, row padding, indentation, and the transfer controls now grow smoothly with the size input instead of jumping between a few hand-set steps, so adjacent sizes are no longer identical.

## [5.8.0] - 2026-07-16

### Added

- Add a size input to the menu, accordion, breadcrumbs, data table, form field, and toast components, scaling all inner text, paddings, and icons proportionally from the shared font-size scale; menu items and accordion items inherit the size from their parent.

### Changed

- **Breaking:** the menu, accordion, breadcrumbs, data table, and toast components now default to the shared md font scale (16px) instead of their previous fixed 14px text, so they render slightly larger out of the box; pass `size="sm"` to keep the old appearance.

## [5.7.0] - 2026-07-14

### Added

- Support lazy locale loading: register `localeLoaders` in `provideEagamiUi()` to fetch a language's dictionary on demand the first time it is activated, preload one with `EagamiI18nService.loadLocale()`, and fall back to English if a load fails.

## [5.6.2] - 2026-07-13

### Changed

- Publish the React and Flutter integration guides and a machine-readable design-token export (JSON) on eagami.com, kept in sync with the library's design tokens on every release.

### Fixed

- Sync stale values in the integration guides: dark-mode shadows, font stacks, secondary brand washes, and missing newer tokens.

## [5.6.1] - 2026-07-12

### Changed

- Drop the redundant publish flag; npm provenance is still generated automatically by trusted publishing.
- Sync the React and Flutter integration guides to the current token set (refreshed secondary palette).

## [5.6.0] - 2026-07-11

### Added

- Add 21 icons: 11 general-purpose (folder-open, file-check, shield-check, bell-ring, clipboard-list, mail-check, calendar-days, git-compare, bookmark-plus, languages, keyboard) and 10 brand marks (Svelte, Node.js, Vue.js, Angular, Python, WordPress, Shopify, Android, Pinterest, Bluesky).

## [5.5.0] - 2026-07-10

### Added

- Add a timeline: a vertical or horizontal sequence of events, each a colored node on a connecting line with an optional heading, timestamp, and description. A single item can be flagged as current to highlight it in the secondary brand color, and an alternate layout zig-zags content to either side of a centered line.

## [5.4.0] - 2026-07-10

### Added

- Add a number input: a numeric field with increment and decrement steppers, min/max/step bounds, and the standard label, hint, and error chrome, integrated with Angular forms.

## [5.3.0] - 2026-07-08

### Added

- Add a `buffer` input to the progress bar that renders the buffered-ahead segment in the secondary brand color, for download-then-process style progress.
- Add a `clearable` input to the color picker (default `true`) to show or hide the clear button, matching the other form inputs.

### Changed

- Put the secondary brand color to work as a native accent: the date picker marks today in it (the selected day stays primary) and the stepper marks the current step in it (completed steps stay primary). Secondary brand tokens now carry full light and dark coverage.
- Refresh the default secondary brand color to a cooler blue-violet.

## [5.2.2] - 2026-07-07

### Added

- Add a runnable starter example that opens in StackBlitz, linked from the README for a no-install first look.

## [5.2.1] - 2026-07-04

### Changed

- Expand the README with a comparison to other Angular UI libraries and a stability and support overview.

## [5.2.0] - 2026-07-04

### Added

- Add a form field component that wraps native inputs, selects, and textareas in the library's standard field chrome: label with required marker, hint, and error messages, with localized validation errors auto-derived from a bound form control and automatic label and aria wiring.

## [5.1.0] - 2026-07-03

### Added

- Add a `headingLevel` input to the accordion so item headers join the page's heading outline, and `ariaLabel` inputs to the autocomplete, multi-select, tabs, and virtual list for naming controls that render no visible label.
- Give the popover opt-in focus containment via `trapFocus` and `aria-labelledby` forwarding, for dialog-style surfaces.
- Document the library's WCAG 2.2 AA conformance and accessibility guarantees in the README.

### Fixed

- Announce the date and time picker popovers as named, focus-contained dialogs, move screen-reader focus along with arrow-key navigation in the calendar, and keep out-of-range days perceivable instead of removing them from the accessibility tree.
- Expose the dropdown trigger as a combobox so the highlighted option is announced while arrowing, include the selected value in its accessible name, and support Home, End, and type-ahead.
- Follow the ARIA listbox pattern in the multi-select and transfer list: valid option semantics, active-option announcement, and roving keyboard focus with arrow, Home, and End keys.
- Turn sortable data-table headers into real buttons so screen readers know they are operable, and announce the empty state.
- Announce toasts, alerts, file-uploader activity, and avatar-editor errors reliably by keeping live regions mounted before their content arrives and removing duplicate nested regions.
- Dismiss hover-triggered tooltips with Escape regardless of where keyboard focus is.
- Name previously unnamed controls: range-slider thumbs, the stepper and tabs tablists, decorative avatars, file-upload progress bars, the color-picker trigger and presets, and the paginator's page-size select (now with per-instance ids).
- Make every interaction keyboard-reachable: the input clear button, changing the avatar-editor photo, scrolling the virtual list, and closing the time picker with Escape from any control inside it; menus now use roving tabindex so Tab leaves the menu.
- Expose states that were visual-only to assistive technology: AM/PM selection, completed steps, rating required and error states, avatar-editor loading, live color-picker saturation and brightness announcements, and page-range updates in the paginator.
- Skip disabled options when the segmented control decides its keyboard tab stop.
- Localize all new screen-reader strings in every supported language.

## [5.0.1] - 2026-07-02

### Fixed

- Fix bottom and right drawers snapping open or overshooting and sliding faster than the selected animation, instead of easing in smoothly like left and top drawers.
- Align the switch label's font size with other basic form controls like radio and checkbox across all size variants.

## [5.0.0] - 2026-07-02

### Added

- Add a `push` mode to the drawer that opens it non-modally and reflows the page content aside instead of overlaying it, always keeping a strip of content visible, plus a `pushTarget` input to choose which element gets pushed. `closeOnBackdrop` now dismisses the drawer on an outside click in both overlay and push modes.

### Changed

- **Breaking:** Replace the drawer's boolean `animated` input with an `animation` input accepting `none`, `linear`, or `eased` (default `eased`); the panel now slides both in on open and out on close.
- **Breaking:** Rename the drawer's `width` input to `size`, which sets the panel's extent along its main axis (width for side drawers, height for top and bottom).

### Fixed

- Keep the date picker's weekday and month names, and grouped numbers in the slider, range-slider, and paginator, in the active locale even on browsers whose built-in `Intl` omits that locale's data, instead of silently falling back to English.
- Translate the avatar-editor file-validation errors and tree expand/collapse labels in every locale.
- Scale the date picker's calendar popover with the `size` input (its text, day cells, and controls), not only the trigger.

## [4.8.1] - 2026-07-01

### Fixed

- Show a color on the color picker swatch when it is set through the `value` binding, not only through Angular forms.
- Reserve room for the date picker's clear button so a long value ellipsizes rather than sliding underneath it.
- Carry a font-family override through to popover panels (dropdown menus, the color and date pickers), which previously kept the root font because the panel is portaled to the document body.

## [4.8.0] - 2026-06-30

### Added

- Add Modern Standard Arabic, Hebrew, and Hindi to the built-in locales, bringing the total to 15; Arabic and Hebrew ship as right-to-left, identified by a new `dir` field on the locale metadata.

### Fixed

- Mirror a toast's icon, message, and dismiss button under RTL while keeping the toast pinned to its chosen screen corner.

## [4.7.0] - 2026-06-30

### Added

- Right-to-left (RTL) support: set `dir="rtl"` and the library mirrors automatically. Styles use CSS logical properties, and pointer and keyboard interactions invert (sliders, rating, color picker, tabs, segmented, data table, date-picker calendar), with directional icons and slide animations flipping. Form fields keep typed content in its own direction, and toasts mirror their contents while keeping their on-screen corner.
- Add direction-aware `start` and `end` placements to `<ea-drawer>` (`start` is the left edge in LTR, the right edge in RTL).

### Changed

- Expand or collapse a tree node by clicking anywhere along its row, not only the chevron.

### Fixed

- Correct the stale built-in language count in the README and migration guide.

## [4.6.0] - 2026-06-27

### Added

- Add an `ng add @eagami/ui` schematic that registers the global stylesheet and fonts in an Angular workspace in one command.

### Fixed

- Restore the bundled stylesheets to the published package (a v4.5.1 packaging change accidentally excluded them, breaking the documented stylesheet import).

## [4.5.1] - 2026-06-26

### Changed

- Publish the package with npm provenance attestation and an explicit file allowlist for a more verifiable install.

## [4.5.0] - 2026-06-25

### Added

- Add Ukrainian and Russian to the built-in locales, bringing the bundled languages to twelve.

## [4.4.0] - 2026-06-24

### Added

- Support forced-colors (Windows High Contrast) mode across the library: keyboard focus rings now stay visible, floating surfaces (menus, dialogs, popovers, toasts, tooltips) keep a visible boundary, selected and checked states stay distinct, and meaningful colors (semantic alerts, tags, swatches, the brand wordmark) are preserved.

## [4.3.1] - 2026-06-24

### Fixed

- Honor `prefers-reduced-motion` for the button's loading spinner and the file uploader's progress bar, so neither animates against the user's motion preference.

## [4.3.0] - 2026-06-22

### Added

- Add a batch of icons spanning AI, editor, commerce, and nature, plus a set of popular brand marks.
- Add a `clickable` input and `rowActivate` output to `<ea-data-table>` for click and keyboard row activation with a pointer cursor.

## [4.2.0] - 2026-06-22

### Added

- Show a semantic leading icon on each `<ea-toast>` variant (success, info, warning, error).
- Expose per-component surface tokens (such as `--ea-dropdown-menu-background-color` and `--ea-dialog-panel-background-color`) so floating overlays can be re-themed without overriding the shared elevated-surface token.
- Add row-level styling tokens to `<ea-data-table>` (background, hover, stripe, and border) and an overline color token to `<ea-eagami-wordmark>`.

### Fixed

- Let a consumer's `:root` design-token overrides take effect in light mode, OS dark mode, and forced dark mode alike, regardless of stylesheet load order.
- Shrink a wrapping multi-line tooltip to its longest line so it no longer leaves empty space along the right edge.
- Center `<ea-radio>` on its content instead of an inline baseline, so radios no longer sit bottom-heavy (most visible in a horizontal `<ea-radio-group>`).

## [4.1.1] - 2026-06-20

### Fixed

- Correct the internationalization documentation to state that built-in strings ship in ten languages.

## [4.1.0] - 2026-06-20

### Added

- Add `EAGAMI_LOCALE_META`, exposing each built-in locale's display name and flag so apps can build a language switcher without re-declaring the list.

## [4.0.0] - 2026-06-20

### Changed

- **Breaking:** Make the built-in locales opt-in so apps bundle only the languages they use. English is always available; register other languages via `provideEagamiUi({ locales: [...] })`, or pass the new `EAGAMI_ALL_LOCALES` for every shipped language. An unregistered locale now falls back to English. Replaces the removed `EAGAMI_MESSAGES` export. See [MIGRATION.md](MIGRATION.md).

### Fixed

- Keep `<ea-radio-group>` options spaced apart when `orientation` is left unset.

## [3.2.1] - 2026-06-20

### Fixed

- Guard `<ea-dialog>` and `<ea-drawer>` against touching the DOM during server-side rendering, so the library prerenders and hydrates without crashing.

## [3.2.0] - 2026-06-20

### Added

- Add an opt-in `navigable` input to `<ea-data-table>` that turns the table into a keyboard-navigable grid, with roving focus, arrow-key cell movement, Home/End and Ctrl+Home/End jumps, and PageUp/PageDown paging.

## [3.1.1] - 2026-06-19

### Changed

- Migrate the unit test suite from Jest to Vitest.

## [3.1.0] - 2026-06-14

### Added

- Integrate every form control with Angular reactive and template-driven forms, so validation errors surface automatically once a field is invalid and touched, with localized default messages for the standard validators.
- Add an `errorMessages` input to every form control for overriding the validation text per error key.

### Changed

- Enlarge the field-level error icon slightly so it reads more clearly alongside the message.

## [3.0.0] - 2026-06-13

### Added

- Add German, Brazilian Portuguese, Mandarin Chinese, Icelandic, and Dutch translations (`de`, `pt-BR`, `zh-CN`, `is`, `nl`), bringing the built-in locales to ten.
- Add a `maxHeight` input to `<ea-menu>` so long menus can scroll past a taller cap.
- Add Angular 22 support by widening the `@angular/*` peer range to `^21.0.0 || ^22.0.0`.

### Changed

- **Breaking:** Remove the deprecated `size` input from `<ea-drawer>` and `<ea-dialog>`; use `width` instead.
- **Breaking:** Remove the deprecated `showValue` input from `<ea-progress-bar>`; use `showPercentage` instead.
- **Breaking:** Remove the deprecated `rows` input from `<ea-textarea>`; use `minHeight`, `maxHeight`, and the resize handle instead.
- **Breaking:** Remove the deprecated numeric (`1`/`2`/`3`) variant aliases from `<ea-eagami-wordmark>`; use `default`, `byline`, or `tagline`.
- **Breaking:** Default the tooltip directive's `maxWidth` to 200px, so a tooltip without an explicit width now wraps at 200px instead of running unbounded.

### Fixed

- Keep `<ea-input>` reflecting its bound value even when it reverts to the value last applied, so a cleared field repopulates a re-applied default.
- Give tooltips a dedicated surface colour and a hairline border so they no longer blend into dark backgrounds.
- Make `<ea-segmented>` block-level so it aligns with inputs and selects in a shared row instead of sitting lower.

## [2.12.0] - 2026-06-10

### Added

- Add playground control metadata for the remaining components so every component has an interactive demo.
- Add an `animated` slide-in option to `<ea-drawer>`.
- Add `size` and `groupThousands` inputs to `<ea-paginator>`.
- Add `clearable` and `position` inputs to `<ea-toast>`.
- Add a `maxWidth` input to the tooltip directive that wraps long text at a set width.
- Add `<ea-icon-half-heart>` and `<ea-icon-half-circle>` so half-step ratings work with heart and circle icons.

### Changed

- **Breaking:** `<ea-multi-select>` keeps selected chips on one horizontally scrollable row with an always-visible clear button, and shows every chip by default instead of capping at three.

### Fixed

- Honor `<ea-drawer>`'s `closeOnEscape` when off, and keep the trigger working after Escape closes the drawer.
- Trim `<ea-drawer>` vertical padding at the smaller sizes so top and bottom drawers no longer clip their content.
- Use the interactive hover wash for `<ea-menu>` items so the hover state stays visible on dark surfaces.
- Fix `<ea-paginator>` left and right alignment.
- Show tooltips when keyboard focus lands on a wrapped trigger such as `<ea-button>`.
- Stretch `<ea-segmented>` to the full width of its container when `fullWidth` is set.
- Even out the connector spacing between `<ea-stepper>` steps.

## [2.11.0] - 2026-06-09

### Added

- Add an `allowAllChars` input to `<ea-code-input>` for accepting any non-whitespace character, not just digits.

### Changed

- Lighten the avatar's initials placeholder background in light mode.
- Spread `<ea-code-input>`'s placeholder one character per cell instead of repeating it across every cell.
- Lighten `<ea-data-table>` striped rows to a mid-tone between the header and unstriped rows instead of matching the header shade.

### Fixed

- Stop the dropdown, autocomplete, and multi-select menus from revealing the content behind them when their list is scrolled past its end.
- Drop the trailing gap on an icon-only `<ea-button>` so the icon is no longer offset when there is no label.
- Scope `<ea-card>` padding to the card's own content so a nested card no longer inherits an outer card's padding.
- Make a full-width `<ea-card>` stretch the host so it fills flex and inline parents, not only normal block flow.
- Apply `<ea-data-table>` column widths to body cells so the columns stay aligned with the header when `stickyHeader` is enabled.

## [2.10.0] - 2026-06-08

### Changed

- Layer popover-based overlays (dropdowns, menus, selects, date and time pickers) above modals, drawers, and sticky headers so they are never covered, while staying below toasts and tooltips.

### Fixed

- Render the `<ea-autocomplete>` suggestion list in an overlay so it is no longer clipped by scrollable or overflow-hidden ancestors.
- Render `<ea-accordion>` as a block-level element so its width follows its container instead of stretching when a long panel opens.

## [2.9.0] - 2026-06-08

### Added

- Add bounded number support to `<ea-input>`: `min`/`max` (clamped on blur), `step`, and `maxLength`/`minLength`. Number fields auto-narrow to their widest value, ignore the scroll-wheel, and block the `e` key.
- Add a `groupThousands` input (default on) to `<ea-slider>` and `<ea-range-slider>` that formats displayed values with thousands separators.

### Changed

- Switch `<ea-eagami-wordmark>` `variant` to string values (`default`, `byline`, `tagline`); the numeric `1`/`2`/`3` are deprecated and will be removed in v3.0.0.
- Default `<ea-eagami-wordmark>` `size` to 48px and floor it at 10px.
- Add an `all` option to `<ea-color-picker>` `format` (now the default) that cycles hex/rgb/hsl from the popover toggle (with HSL inputs); a specific format locks the picker to it.

### Fixed

- Keep the `<ea-eagami-wordmark>` logo proportional when its size is cleared, and match the byline and tagline letter-spacing to the brand text.
- Apply the `xs` and `xl` sizes to `<ea-code-input>` and `<ea-tabs>`, which previously only bound `sm`/`md`/`lg`.

## [2.8.0] - 2026-06-07

### Added

- Add an optional `icon` input to `<ea-button>` for a leading icon that scales to 1.5x the label text.
- Add a `thick` input to `<ea-divider>` for a heavier rule.
- Add `icon` and `bordered` inputs to `<ea-empty-state>`.
- Extend the size range to the full `xs` through `xl` scale across all sized components, including `<ea-drawer>` and `<ea-dialog>` panel widths, and export shared `EaSize` and `EaWidth` types.

### Changed

- **Breaking:** Remove the deprecated `4` variant from `<ea-eagami-wordmark>`; use `3` instead.
- Standardize the `size` scale so `sm`, `md`, and `lg` map to the same text sizes across every component.
- Rename the `<ea-drawer>` and `<ea-dialog>` `size` input to `width`; `size` is deprecated and will be removed in v3.0.0.
- Normalize `<ea-rating>` to the standard size scale while keeping its stars at 1.5x the label text.
- Rescale `<ea-badge>` to the new range while keeping it a step smaller than body components.

### Fixed

- Offset menus and other popover panels from their anchor so an open panel no longer covers the input's active focus ring.

## [2.7.0] - 2026-06-06

### Added

- Add an `icon` input to `<ea-alert>` and `<ea-input>` for a leading icon, plus a `size` input on `<ea-alert>`.
- Add `showPercentage` to `<ea-progress-bar>`, replacing `showValue`.
- Add `xs` and `xl` sizes to `<ea-spinner>` and `<ea-radio-group>`.
- Add a `minHeight` input to `<ea-textarea>`.

### Changed

- Enlarge the alert status icon to 1.5x the text, tighten its gap, and vertically center it with the message.
- Scale every component's text, icons, padding, and controls proportionally with its `size`, and standardize all clear/close/dismiss/toggle buttons to one consistent affordance.
- Size `<ea-spinner>` so its circle is always 1.5x the label text.
- Deprecate `<ea-progress-bar>` `showValue` (use `showPercentage`) and `<ea-textarea>` `rows` (use `maxHeight` and the resize handle); both removed in v3.0.0.

### Fixed

- Stop popovers and dropdowns from closing when scrolling inside their own scrollable list.
- Show a hover background on the alert dismiss button.
- Darken the avatar placeholder background so it stays visible on light surfaces.
- Scale avatar initials and the fallback user icon to the avatar size so they stay proportionate at small sizes.
- Shrink small badge text so it reads distinctly from the medium size.
- Stop the `<ea-textarea>` focus ring being clipped at its bottom edge, and let it resize horizontally and in both directions.
- Show the dividing line for a vertical `<ea-divider>` with a label, and lift the divider line's contrast in dark mode.
- Show the `<ea-slider>` and `<ea-range-slider>` value when `showValue` is enabled but no label is set.

## [2.6.0] - 2026-06-05

### Added

- Add `--color-state-hover` and `--color-state-active` tokens: translucent hover and active fills that lift off whatever sits beneath them, so they never blend with the surface.

### Changed

- Route component hover and active states through the new translucent layers so they stay visible on any dark surface instead of matching the muted shade beneath.
- Add a top gap above accordion item content.
- Generate auto element ids deterministically so server and client renders stay in sync.

### Fixed

- Keep ghost and secondary button labels readable when pressed in dark mode; the active fill no longer washes out near white.

## [2.5.3] - 2026-06-04

### Changed

- Update dependencies to their latest compatible releases.

### Fixed

- Resolve a moderate-severity security advisory.

## [2.5.2] - 2026-05-31

### Added

- Add `--color-{success,warning,error,info}-text` foreground tokens. Status text in `<ea-badge>`, `<ea-tag>`, and `<ea-toast>` now routes through them, flipping from the `*-700` shades to light `*-200` pastels in dark mode so it stays legible on the translucent status washes.

### Fixed

- Soften the dark-mode muted surface (`--color-bg-muted`) one step so ghost/secondary button and table-row hovers lift subtly instead of reading as a harsh mid-grey fill.

## [2.5.1] - 2026-05-29

### Changed

- Rework dark-mode elevation so drop shadows render dark with a subtle top-edge highlight instead of an inverted white glow, fixing the washed-out look on cards, toasts, and other raised surfaces.
- Lift floating panels (menus, dropdowns, date/time/colour pickers, multi-select, autocomplete, command palette) onto the elevated surface tone in dark mode so they sit clearly above the page.

## [2.5.0] - 2026-05-29

### Added

- Add `<ea-field-label>` and `<ea-field-messages>`, the shared label and hint/error building blocks now used internally by every form control. Both are exported for consumers composing custom form fields.

### Changed

- Tighten source comments across the library to a stricter house style.

## [2.4.0] - 2026-05-28

### Added

- Add `--shadow-bevel` / `--shadow-bevel-strong` and `--shadow-well` / `--shadow-well-strong` tokens. Each pairs an inset highlight with an inset shadow to give a surface a raised (bevel) or recessed (well) 3D look, composable with `--shadow-*` for an ambient drop. Dark-mode variants drop the highlight alpha and raise the shadow alpha so the relief still reads on a lifted dark surface without glowing.
- Add `--text-section-heading-*` composite (20px / semibold / snug / brand family) for page-level subsection titles. First composite that pins a font-family token; everything else still inherits the body sans family.

### Changed

- Round out and alphabetize the README component list (Button, Color Picker, Command Palette, File Uploader, Multi-Select, Popover, Range Slider, Rating, Stepper, Time Picker, Transfer List, Tree, Virtual List were previously missing). Stepper now sits under Navigation; Accordion and Tree under Display.

### Fixed

- `<ea-segmented>` now wraps its options onto multiple rows instead of overflowing when they exceed the available width.

## [2.3.0] - 2026-05-28

### Added

- Add a `palette` option to `provideEagamiUi`. Consumers pass a `primary` (and optional `secondary`) base hex; the library derives a perceptually-uniform 10-shade scale via OKLCH, maps the shades to semantic brand roles in both light and dark mode, and asserts WCAG 2.1 AA contrast on every pairing before applying. A failing palette throws at bootstrap so a bad brand colour is caught before the app loads. Per-shade `overrides` and role remapping are supported for brand books that pin specific hexes.
- Add `--color-bg-canvas` token for the page background, distinct from `--color-bg-base` which becomes the surface token for components that sit on the page (inputs, cards, accordion items, popover panels). In dark mode the canvas stays at `neutral-950` while `bg-base` lifts to `neutral-800`, so component surfaces no longer disappear into the page.
- Add `--color-brand-text` token (defaults to `--color-primary-700` in light mode, `--color-primary-300` in dark mode). Use it for the brand colour as a foreground on a non-brand surface (selected dropdown row, today marker, sorted column, spinner, active paginator page). Keeps `--color-brand-default` free to optimize as a surface (button bg, badge bg) without dragging text-on-surface contrast along with it.
- Expose `--ea-switch-track-border-color` on `<ea-switch>` so consumers can recolour the track outline without overriding `--color-border-*` globally.

### Changed

- Tighten the dark-mode brand-default flip from `primary-400` to `primary-500`. The smaller shift keeps the primary CTA feeling like the same brand colour across themes while still clearing WCAG 1.4.11 (3:1 brand vs canvas) and carrying a white label above 4.5:1.
- Route `<ea-dropdown>` selected-option, `<ea-date-picker>` today indicator and today button, `<ea-data-table>` sorted-column header, `<ea-spinner>`, and `<ea-paginator>` active page colours through the new `--color-brand-text` token. Visually unchanged at defaults; consumers can now tune surface and foreground brand roles independently.
- Soften the default `<ea-switch>` track border from `--color-border-strong` to `--color-border-default` for a less heavy off-state ring.
- Default the primary `<ea-button>` text colour to `--color-neutral-0` (always white) instead of `--color-text-inverse` (which flipped to dark in dark mode). Text now stays white on the brand background in both themes; consumers can still override per-instance via `--ea-button-color`.
- Expose `--ea-empty-state-title-color` on `<ea-empty-state>` so consumers can recolour the title without bleeding `--color-text-primary` to its siblings.

## [2.2.0] - 2026-05-25

### Added

- Add `<ea-command-palette>`, a search-driven modal action launcher (Cmd/Ctrl + K-style). Wraps the native `<dialog>` element for focus trap and Esc dismissal. Items can be ungrouped or bucketed by a `group` field; the filter matches `label`, `description`, and hidden `keywords`. Keyboard navigation (Arrow keys, Home / End, Enter) drives a roving `aria-activedescendant` on the search input — the canonical ARIA combobox-with-listbox pattern. Optional per-item `shortcut`, `description`, leading `icon`, and `disabled` flag. `[(open)]` is a two-way model and `(execute)` fires once with the chosen item before the palette auto-closes.
- Add `<ea-virtual-list>`, a low-level windowed-rendering primitive for long lists. Only the rows currently in the viewport (plus a configurable overscan) are mounted; an absolutely-positioned spacer reserves the full scroll extent so the scrollbar reflects the real item count. Fixed-height items only in v1. Consumers project the per-row template via `<ng-template #item let-row let-i="index">` and stay role-agnostic — the primitive provides scroll mechanics; the consumer wraps the projected item with whatever ARIA the use case calls for (`role="option"`, `role="row"`, etc.). Exposes a `scrollIndexChange` output and a `scrollToIndex(n)` imperative method.
- Add `<ea-transfer-list>`, a two-pane shuttle control for moving items between a source set and a target set. Each pane is a `role="listbox"` with `aria-multiselectable="true"`; rows highlight on click and four direction buttons (move-selected and move-all in each direction) reconcile the panes against a `selectedIds` model. Disabled items per row stay anchored to their current pane and are skipped by the move-all buttons. Three sizes (sm / md / lg) and a whole-component `disabled` flag.
- Add `<ea-tree>`, a hierarchical single-selection treeview with full keyboard navigation (Arrow keys, Home / End, Enter / Space), the standard ARIA `tree` pattern (roving `tabindex`, `aria-level` / `aria-posinset` / `aria-setsize` / `aria-expanded` / `aria-selected`), three sizes (sm / md / lg), optional per-node leading icons, a disabled flag per node and at the tree level, and `selectedId` / `expandedIds` model signals for two-way binding. Setting `[selectedId]` for a deeply-nested node auto-expands the ancestor chain so the selection becomes visible.
- Add `[hasError]` boolean input to `<ea-slider>` so consumers rendering the error message themselves (above the slider, in a surrounding form layout) can still trigger the built-in error recolour of the fill and thumb. The flag is OR'd with the implicit error state derived from `errorMsg`, so existing usage is unchanged.

### Changed

- Route `<ea-button>` variant colours through CSS custom properties so consumers can recolour any single button without overriding `--color-brand-*` or `--color-text-inverse` globally. `--ea-button-background-color`, `--ea-button-color`, and `--ea-button-border-color` (and matching `*-hover` / `*-active` per-state tokens) override the variant defaults; each per-state token falls back to its base counterpart before the variant default so setting a single base colour produces a flat-coloured button across all states.
- Expose `--ea-empty-state-title-font-weight`, `--ea-empty-state-description-color`, and `--ea-empty-state-media-color` on `<ea-empty-state>` so consumers can fine-tune the title weight, description text colour, and media-area icon colour without piercing view encapsulation.

### Fixed

- Strip leaking `role` and `aria-label` attributes from the `<ea-popover>` host element, so assistive tech (and axe) only see the conditional ARIA on the inner surface. Resolves missing-accessible-name violations on every popover-driven component when closed (`<ea-dropdown>`, `<ea-multi-select>`, `<ea-date-picker>`, `<ea-time-picker>`, and `<ea-color-picker>`).
- Wire `<ea-multi-select>`'s `<label>` to its `<div role="combobox">` trigger via `aria-labelledby`. The previous `<label for>` linkage was inert because the trigger is a `<div>`, not a form-control element, so screen readers announced the trigger as nameless.
- Restructure `<ea-stepper>`'s tablist from an `<ol><li role="tablist">` containing `<button role="tab">` to a flat `<div role="tablist">` of tab buttons. The previous structure was rejected by axe and screen readers because ARIA tablist children must be tabs directly, not wrapped in list items, and the `role="tablist"` overrode the list's implicit role leaving the `<li>` elements orphaned. Visible rendering, keyboard navigation, and selection behaviour are unchanged.
- Replace the focusable `<button>` star elements in `<ea-rating>` with presentational spans, so the `role="slider"` container no longer nests interactive descendants. Mouse click and keyboard navigation behaviour is unchanged.

## [2.1.0] - 2026-05-24

### Added

- Add `<ea-file-uploader>`, a multi-file uploader with a drag-and-drop zone and a per-file list. Supports `accept` / `maxSize` / `maxFiles` validation (rejections emitted via a `rejected` event), a `multiple=false` single-file mode, per-file progress bars driven by a consumer-supplied `Map<File, number>`, three sizes (sm / md / lg), the standard hint / error message pattern, and Angular forms integration via `ControlValueAccessor`. The dropzone icon is exposed as a content slot via the `icon` attribute, so consumers can swap the default cloud icon for any other icon while inheriting the dropzone's size-aware sizing.
- Add `<ea-rating>`, a star-based rating input with whole-step (default) or half-step (`allowHalf`) granularity, hover preview, keyboard navigation (Arrow keys, Home/End, digit keys, Delete/Backspace to clear), a read-only display mode, three sizes (sm / md / lg), and Angular forms integration via `ControlValueAccessor`. Surfaces as `role="slider"` with `aria-valuemin` / `aria-valuemax` / `aria-valuenow`. The default star can be swapped via the `icon` / `icon-fill` content slots (e.g. `<ea-icon-heart icon />`) and the fill clip handles half-step rendering automatically.
- Add a `strokeWidth` input on every Feather-derived icon, exposing the SVG's `stroke-width` so consumers can thin or thicken any icon at the call site (e.g. `<ea-icon-star [strokeWidth]="1.5" />`). The default stays at 2 to preserve existing visuals; per-icon design choices (currently camera and upload at 1.5) are pinned via a `static override readonly defaultStrokeWidth` field on `IconComponentBase`. The rating component leans on this to render its dim background outline at 1.5 for visual quiet against the filled foreground.

### Fixed

- Set `min-width: 0` (and `max-width: 100%`) on `<ea-card>`'s host and inner element to match the existing `min-height: 0` baseline, so cards in flex / grid layouts no longer blow past their parent track when their content has an intrinsic width (long copy, wide tables, pre-formatted blocks). Removes a `::ng-deep` workaround consumers were applying in every layout that nested a card under a constrained flex / grid parent.

## [2.0.0] - 2026-05-23

### Added

- Add `<ea-stepper>` + `<ea-step>`, a multi-step wizard control with linear / non-linear flows, completed / optional step flags, click + keyboard navigation, and content projection per step.
- Add `<ea-multi-select>`, a multi-select dropdown with removable chips, optional search filter, and a tri-state "Select all" toggle.
- Add `<ea-time-picker>`, a stepper-style picker with type-to-edit inputs, long-press chevron buttons, and 12h/24h display.
- Add `left-half-star` and `right-half-star` Eagami-original icons. Each renders one half of the canonical Feather `star` silhouette, closed at the centre by a vertical line from the top peak to the bottom valley — paired, they read as a full star split down the middle (the building block for half-step rating components).
- Add a negative-spacing scale (`--space-n-px`, `--space-n-0-5` through `--space-n-32`) mirroring the existing positive tokens 1:1. Consumers reaching for negative margins (container bleeds, overlap tricks, gutter collapsing) can now reference a token instead of writing `calc(var(--space-2) * -1)`.
- Add `<ea-range-slider>`, a two-thumb sibling of `<ea-slider>` driven by a `[low, high]` numeric tuple. Each thumb supports the same keyboard model as the single-thumb slider (arrows, PageUp/PageDown, Home, End) with Tab moving between thumbs; pointer drag picks whichever thumb is closer to the click. Neither thumb is permitted to cross the other — once they meet, the moving thumb clamps to the boundary. Reuses the slider's visual chrome (track, fill spanning between thumbs, sizes, focus ring), supports min/max labels, value display, hint/error messages, and integrates with Angular forms via `ControlValueAccessor`.
- Round out the `code` typography role and introduce a `kbd` role. The `--text-code-*` tokens now cover size (relative `em` so inline code tracks surrounding text), weight, family, color, background, padding, and border-radius — enough to style a `<code>` chip with one block of token references. The new `--text-kbd-*` series styles a keyboard-key glyph with the same shape language plus a 1px border and a 1px bottom shadow for a raised appearance. The library's base reset now applies both to native `<code>` and `<kbd>` elements out of the box.
- Introduce `<ea-popover>`, a low-level floating-element primitive that handles anchored positioning (`position: fixed` against an external anchor element), flip-on-overflow, viewport clamping, outside-click and Escape dismissal, and SSR-safe scroll / resize handling. Supports 8 placements (`top`, `top-start`, `top-end`, `bottom`, `bottom-start`, `bottom-end`, `left`, `right`), three scroll behaviors (`reposition`, `close`, `ignore`), and an optional `matchAnchorWidth` mode for dropdown-style equal-width popovers. The surface is teleported to `document.body` so it escapes any ancestor that would otherwise create a new containing block for the fixed positioning (`transform`, `contain`, `filter`, `perspective`, `will-change`) — a common gotcha that hides popovers inside Storybook canvases, CSS-isolated app shells, and animated panels. The pure `computePopoverPosition()` helper is also exported so downstream apps can drive their own positioning. The existing menu, dropdown, color-picker, date-picker, and tooltip components are migrated onto this primitive in the same release so they share the same SSR guards and edge-case handling.
- Add a `shape` input to `<ea-badge>` accepting `'pill' | 'pin'` (defaults to `pill`). The new `pin` shape enforces `min-width = height` and applies `font-variant-numeric: tabular-nums` so the box stays a perfect square for single-character content (renders as a circle once the full `--radius-full` border-radius applies) and grows horizontally into a pill once content forces it wider. Per-size dimensions are sm 16×16 @ 9px, md 18×18 @ 10px, lg 22×22 @ 12px, all overridable via the new `--ea-badge-size` and `--ea-badge-font-size` custom properties.

### Changed

- **Breaking:** Remove `<ea-icon-apple>` / `AppleIconComponent`. The icon depicted Apple Inc.'s logo, which is more strictly protected than other brand marks; consumers needing it (e.g. "Sign in with Apple") should source the asset directly from Apple per their brand guidelines. The component was deprecated in v1.1.0.
- **Breaking:** Remove `<ea-icon-pencil>` / `PencilIconComponent`. The icon depicted the same mark as Feather's canonical `edit-2` and was deprecated in v1.4.0 as redundant; switch to `<ea-icon-edit-2>` / `Edit2IconComponent`.
- Default the `<ea-popover>` `offset` to `0` so the popover sits flush against its anchor on the placement axis (was 2px).
- Apply a font-aware `min-height` to `<ea-textarea>` matching one line of text plus the active size's vertical padding, so a textarea is never visually shorter than a single-line `<ea-input>` at the same size.
- Use a font-scaled `height` (`1.5em`) on the vertical `<ea-divider>` so it lines up with adjacent text instead of collapsing to its 16px `min-height` fallback.
- Redraw the `<ea-avatar-editor>` canvas when its `canvasSize` input changes, and shrink the dropzone padding / upload icon / prompt text in two tiers below 150px and 100px so the prompt still fits at small canvases.
- Migrate `<ea-dropdown>` onto the new `<ea-popover>` primitive. The visible behavior is unchanged (same trigger, same option list, same keyboard nav), but positioning, outside-click dismissal, and scroll/resize handling now route through the shared primitive. The internal `<ul role="listbox"><li role="option">` markup becomes `<div role="listbox"><div role="option">` so the listbox role lands directly on the surface element (the canonical ARIA pattern), and the now-duplicated `position: fixed` / `z-index` rules in `.ea-dropdown__menu` are dropped.
- Migrate `<ea-menu>` onto the new `<ea-popover>` primitive. The companion `[eaMenuTrigger]` directive's public API is unchanged, and the menu's role-driven keyboard navigation (ArrowUp/Down, Home/End, Escape to close and restore focus to the trigger) is preserved verbatim. Positioning, outside-click dismissal, and scroll-reposition handling now route through the shared primitive, and the menu's now-vestigial placement-class hooks (`.ea-menu__list--bottom-start` etc.) are dropped — the equivalent class lives on the popover surface (`.ea-popover__surface--bottom-start`) for any consumer that still wants to target placement-specific styling.
- Migrate `<ea-color-picker>` onto the new `<ea-popover>` primitive. Positioning, dismissal, flip-on-overflow, and scroll-close handling now route through the shared primitive (replacing the picker's bespoke `clampPopoverToViewport` logic). Visible behavior — keyboard control of the SV area / hue / alpha sliders, the format toggle, presets, the EyeDropper button, and focus restoration on Escape — is preserved verbatim.
- Migrate `<ea-date-picker>` onto the new `<ea-popover>` primitive. The calendar now uses `position: fixed` (via the popover surface, teleported to `document.body`) instead of its previous `position: absolute`, which resolves a latent bug where the calendar was clipped by any ancestor with `overflow: hidden` (a common pattern in scrollable forms and content panels). Outside-click dismissal and scroll-close handling now route through the shared primitive; keyboard navigation, focus restoration on Escape, and the rest of the visible behavior are preserved verbatim.
- Share positioning math between `[eaTooltip]` and `<ea-popover>` via the new `computePopoverPosition()` helper. The tooltip directive keeps its public API and its tooltip-specific behaviors (sticky/fixed-ancestor hit-testing, hover-vs-touch detection, `:focus-visible` filter, `aria-describedby` management, ResizeObserver, rAF-coalesced reposition); the bespoke placement switch and viewport-clamp math are replaced by the shared helper so future positioning fixes land once and apply to both.
- Route `<ea-badge>` variant colours through CSS custom properties so consumers can recolour the badge without piercing view encapsulation. `--ea-badge-background-color` and `--ea-badge-color` override the variant-default surface and text colours; the new `--ea-badge-border-color` / `--ea-badge-border-width` pair adds a configurable outer border (0-width and transparent by default, so existing usage is visually unchanged). Any of these can be set on the badge itself or on an ancestor and will inherit through view encapsulation.

### Fixed

- Observe the `<ea-popover>` surface with a `ResizeObserver` so the first reposition after open re-runs once the browser has actually laid out the projected content. Previously the surface's initial `getBoundingClientRect` could read its pre-layout width (a hold-over from the `display: none` → visible transition) and the viewport-clamp would silently skip, leaving menus / dropdowns / pickers clipped at the right edge until the next resize or scroll forced a fresh measurement.

## [1.5.0] - 2026-05-20

### Added

- Add `<ea-color-picker>`, a full-featured color picker with a swatch trigger that opens a popover containing a saturation/value gradient area, hue slider, optional alpha slider, hex / RGB inputs (one row at a time, toggled via a small format button), a configurable preset palette, and an eyedropper button (in browsers that expose the EyeDropper API). Pointer, touch, and full keyboard control are supported on every region (arrows step, Shift+arrows step coarse, Home/End jump to bounds). The popover positions itself via `position: fixed` so it escapes any ancestor with `overflow: hidden`. Integrates with Angular forms via `ControlValueAccessor`, accepts any CSS color string in `writeValue` (3/6/8-digit hex, `rgb()`/`rgba()`, `hsl()`/`hsla()`, named colors), and emits in the configurable `format` (`hex` | `rgb` | `hsl`). Comes with i18n coverage in all five locales.

### Changed

- Standardize field-level error and hint message rendering across every form-like component. Error messages now always lead with an alert-circle icon (previously `<ea-input>`, `<ea-textarea>`, `<ea-date-picker>`, and `<ea-color-picker>` had it, while `<ea-slider>`, `<ea-checkbox>`, `<ea-switch>`, `<ea-dropdown>`, `<ea-autocomplete>`, `<ea-radio-group>`, `<ea-code-input>`, and `<ea-segmented>` did not). Helper-text size bumps from 12px to 13px via `--text-helper-size` for better legibility on dense forms without crowding the label hierarchy.
- Replace `<ea-input>`'s `setTimeout(0)`-based autofocus with `afterNextRender()` so focus runs against a guaranteed-DOM-attached element rather than relying on the macrotask queue, and so the timing is naturally SSR-safe.

### Fixed

- Guard `window.addEventListener` calls in `<ea-dropdown>` with a `typeof window !== 'undefined'` check so prerendered (SSR) pages that render a dropdown no longer throw `ReferenceError: window is not defined`.

## [1.4.0] - 2026-05-20

### Added

- Add 11 new icons drawn in the Feather style (24px viewBox, 2px stroke, round caps and joins) so they sit naturally alongside the existing set: `bottle`, `candle`, `circle`, `heptagon`, `hexagon`, `lamp`, `pentagon`, `rectangle-horizontal`, `rectangle-vertical`, `soccer-ball`, `trophy`
- Complete coverage of the upstream Feather Icons set (287 / 287, each at its canonical Feather slug). Adds the 39 Feather icons that were not yet bundled (`arrow-{down,left,right,up}-circle`, `bar-chart-2`, `camera-off`, `cast`, `check-square`, `chevrons-{down,left,right,up}`, `cloud-{drizzle,lightning,off,rain,snow}`, `corner-{left,right}-{down,up}`, `divide-{circle,square}`, `dribbble`, `folder-{minus,plus}`, `framer`, `instagram`, `pen-tool`, `phone-{call,forwarded,incoming,missed,off,outgoing}`, `refresh-ccw`, `table`, `trello`, `twitter`). For the 10 brand marks that have both an Eagami brand-filled design and a Feather outline, the canonical slug now holds Feather's outline; the brand-filled variant moves to `<slug>-2` (e.g. `facebook-2`, `github-2`, `linkedin-2`). Three brand marks where the Eagami and Feather designs were already identical (`codepen`, `codesandbox`, `gitlab`) are deduplicated to a single component at the Feather slug
- Expose per-icon metadata as static fields on each component class (`static readonly slug`, `category`, `isBrand`, `tags`). Lets consumers build catalogues, search indices, or doc tables by reading `GithubIconComponent.tags` directly without pulling in any other icon as a transitive dependency. The new `IconCategory`, `IconMeta`, and `IconComponentType` exports describe the shape of these static fields
- Export an `ICONS` array (`ReadonlyArray<IconComponentType>`, sorted by slug so the base icon always precedes its `-2` variant) listing every non-deprecated icon component so apps that want to render the full catalogue (search pages, gallery views) can iterate one list rather than maintaining their own. Pair it with the new `iconDisplayName(iconOrSlug)` helper to resolve the human-readable label with the correct casing for acronyms and brand marks (`GitHub`, `npm`, `CodePen`, `X (Twitter)`, etc.). Importing `ICONS` pulls in every icon, so apps that only render a handful should keep importing the components they use directly

### Deprecated

- `<ea-icon-pencil>` / `PencilIconComponent` is deprecated and will be removed in v2.0.0. The icon depicts the same mark as Feather's canonical `edit-2` (with a marginally different cap curvature) and is being retired as redundant; switch to `<ea-icon-edit-2>` / `Edit2IconComponent`. The deprecated component still exports for backwards compatibility but is no longer listed on the `/ui/icons` reference page

### Changed

- Add an optional `count` input to `<ea-checkbox>` that renders inline within the same `<span>` as the label, dimmed to `--color-text-tertiary`. Inline placement shares the label's exact baseline and font metrics, so patterns like `Inbox 42` or `Brand (30)` stay aligned without a sibling element fighting flex / inline-flow centring at the consumer's call site
- Hide `[eaTooltip]` when its trigger has scrolled behind a sticky / fixed ancestor (typical app-header pattern), or when the calculated bubble would itself paint on top of one. Uses `elementFromPoint` plus an ancestor walk for `position: fixed | sticky`, so the directive picks up an app's chrome without needing to be told about it. Feature-detected for jsdom / SSR
- Scale the Netlify brand icon to the full `24×24` viewBox so it visually matches the other brand marks rather than rendering as a small motif inside whitespace
- Add `opacity: 1` to `<ea-input>`'s `::placeholder` rule to keep the tertiary token from being washed out further by the Firefox / WebKit ~0.54 default placeholder opacity

## [1.3.0] - 2026-05-17

### Added

- Expand the icon set from 101 to 268 icons. Round out the Feather Icons coverage with 148 additions (activity, airplay, alert-octagon, align-{center,justify,left,right}, anchor, aperture, arrow-down-{left,right}, arrow-up-{left,right}, award, battery, battery-charging, bell-off, bluetooth, bold, book, book-open, box, chrome, code, codepen, codesandbox, coffee, columns, command, compass, corner-{down,up}-{left,right}, cpu, crop, crosshair, database, delete, disc, divide, download-cloud, droplet, edit, edit-2, edit-3, fast-forward, feather, file-minus, file-plus, file-text, film, frown, git-branch, git-commit, git-merge, git-pull-request, gitlab, grid, hard-drive, headphones, italic, key, layers, layout, life-buoy, link-2, map, maximize-2, meh, message-circle, message-square, mic-off, minimize-2, minus-circle, minus-square, more-vertical, mouse-pointer, move, music, navigation, navigation-2, octagon, pause-circle, percent, pie-chart, play-circle, plus-circle, plus-square, pocket, power, radio, repeat, rewind, rotate-cw, rss, scissors, server, share-2, shield-off, shopping-bag, shuffle, sidebar, skip-back, skip-forward, slack, slash, sliders, smile, speaker, square, stop-circle, sunrise, sunset, tablet, tag, target, terminal, thermometer, toggle-left, toggle-right, tool, trash-2, trending-down, triangle, truck, tv, type, umbrella, underline, upload-cloud, user-check, user-minus, user-plus, user-x, video-off, voicemail, volume, volume-1, volume-x, watch, wifi-off, wind, x-octagon, x-square, zap-off, zoom-in, zoom-out)
- Add a coloured brand-icon set for nominative use: LinkedIn, Discord, YouTube, Reddit, Twitch, Spotify, Notion, Figma, Dropbox, npm, Stripe, PayPal, Mastercard, Vercel, Netlify, Cloudflare, Docker, Kubernetes, MongoDB. Each ships with a reminder that brand icons depict third-party trademarks and may only be used to identify the brand they represent

### Changed

- Retire the EagamiWordmark "eagami design system" variant. Variant `3` now renders the brand mark with its tagline (previously the role of variant `4`). Variant `4` is kept as a backwards-compatible alias for `3` and will be removed in v2.0.0
- Double the inline `EagamiWordmarkComponent` text-stack gap (`calc(--_size * 0.1px)` → `0.2px`) so the brand, separator, and tagline read as distinct words instead of crowding the em-dash
- Reposition `[eaTooltip]` while it is shown. Window resize, ancestor scroll, and ResizeObserver-detected layout shifts (the trigger or the page body resizing) all re-run the viewport clamp via rAF so the tooltip stays inside the viewport even when the page reflows under it. Guarded for SSR (window-free environments)
- Only show `[eaTooltip]` on keyboard focus, not click-focus. Clicking a tooltip-trigger that opens a menu would previously latch the tooltip open after the menu closed, because focus returned to the trigger. The directive now feature-detects `:focus-visible` and only opens on focus when the browser flags it as keyboard-driven; falls back to the previous always-on-focus behaviour in test environments without `:focus-visible` support

### Deprecated

- `EagamiWordmarkComponent` variant `4` is deprecated and aliases to `3`. The component's `variant` input now accepts `1 | 2 | 3 | 4`; new code should pass `3`

## [1.2.1] - 2026-05-16

### Changed

- Update the README to reflect the library's new monorepo home and switch the header image to a PNG so GitHub renders it inline.

## [1.2.0] - 2026-05-16

### Added

- Add internationalization support across every component. Built-in strings (ARIA labels, placeholders, empty states) now ship in English, French (France), Greek, Polish, and Spanish (Spain). Set the locale once with `provideEagamiUi({ locale })`, switch it at runtime through `EagamiI18nService`, and override individual strings via component inputs or `provideEagamiUi({ messages })`. `DatePickerComponent` also follows the active locale when formatting dates
- Export `frenchSpacing()`, an opt-in helper that converts regular spaces to U+202F (narrow non-breaking space) before French high punctuation (`?` `!` `:` `;` `»`) and after `«`. Lets consumers format user-supplied French text correctly without the library transforming arbitrary input

### Fixed

- Make the `InputComponent` password visibility toggle reachable by keyboard. It previously carried `tabindex="-1"`, so keyboard users could not reveal the password
- Wire `DropdownComponent`'s listbox to its trigger for screen readers. The trigger now exposes `aria-controls` and `aria-activedescendant`, so the highlighted option is announced as the user arrows through the list
- Correct `DataTableComponent`'s table semantics by replacing the inconsistent ARIA `grid`/`row`/`gridcell` roles with native table semantics and `scope="col"` headers, so assistive tech announces rows and columns reliably
- Hide `AlertComponent`'s decorative status icon from assistive technology
- Use U+202F before high punctuation in the bundled French messages so labels like `Lignes par page :` can no longer wrap onto their own line

## [1.1.1] - 2026-05-12

### Changed

- Tone down `--shadow-xl` and `--shadow-2xl` in dark mode — the white-at-alpha drop shadows behind `DialogComponent` and `DrawerComponent` were reading as bright halos. Alpha values are roughly halved so the elevation cue stays readable without the overstated glow

### Fixed

- Move horizontal scrolling in `DataTableComponent` into an inner wrapper so a slotted `<ea-paginator>` stays outside the scrolled coordinate space. On narrow viewports where the table overflowed, the paginator was being pulled into the scroll context, leaving its `border-top` divider short of the host's right edge
- Centre `AlertComponent`'s icon with the first line of its content. Previously the icon sat at the top of its 1.25rem box, a few pixels above the first line's visual middle; the icon span now sizes to the line-height and centres the icon inside it
- Suppress hover-triggered tooltips on touch devices, and re-attach pointer listeners reactively when hover capability changes. `TooltipDirective` now subscribes to the `(hover: hover)` media query, so tooltips disable on touch hardware (no more "sticky hover" where a tap latches the tooltip open) and re-enable without a refresh when a Bluetooth pointer connects or DevTools mobile emulation is toggled off. Focus/blur listeners stay attached regardless so keyboard users always get tooltips

## [1.1.0] - 2026-05-12

### Added

- Expand the icon set from 52 to 101 icons. New: archive, at-sign, bar-chart, bookmark, briefcase, clipboard, cloud, credit-card, dollar-sign, flag, folder, gift, globe, hash, help-circle, home, inbox, list, lock, log-in, map-pin, maximize, mic, minimize, monitor, moon, package, paperclip, pause, phone, play, printer, refresh-cw, save, send, share, shield, shopping-cart, smartphone, sun, thumbs-down, thumbs-up, trending-up, unlock, users, video, volume-2, wifi, zap
- Honor `prefers-reduced-motion` on `ToastComponent` — the slide-in animation degrades to an opacity-only fade so the toast still appears smoothly without translateX motion that can trip vestibular sensitivity
- Document icon attribution and brand-icon usage in the README. The icon set is derived from Feather Icons (Cole Bemis, MIT). Brand icons (Facebook, GitHub, Google, Microsoft, X/Twitter) include links to each platform's brand guidelines, since their use is governed by trademark rather than the library's MIT license

### Changed

- Retune the dark-mode background hierarchy so elevated surfaces (`CardComponent` variant="elevated", `DialogComponent`, `DrawerComponent`) are visibly raised above the page. `--color-bg-elevated` now resolves to `neutral-800` (was `neutral-900`) and `--color-bg-muted` to `neutral-700` (was `neutral-800`) so hover states inside elevated surfaces still read as a further step up. Light mode is unchanged
- Add a hairline border to `CardComponent` variant="elevated". Shadows alone can't reliably define elevation in dark mode, and the top edge isn't visible from a downward-cast shadow in light mode either — the border now carries the edge while the shadow + bg-elevated step convey depth
- Vertically center the `RadioComponent` label against the radio circle (was top-aligned)

### Deprecated

- `AppleIconComponent` is now deprecated and will be removed in v2.0.0. The icon depicts Apple Inc.'s logo, which is more strictly protected than other brand marks; consumers needing it (e.g., "Sign in with Apple") should source the asset directly from Apple per their brand guidelines. The export remains for backward compatibility — a `@deprecated` JSDoc warning surfaces in IDEs

### Fixed

- Make `ToastComponent` colored variants (success, warning, error, info) opaque in dark mode. The `--color-*-subtle` tokens are re-tinted as low-alpha rgba in dark mode (correct for inline banners) which caused floating toasts to bleed through arbitrary page content. Toasts now stack the tint over a solid `--color-bg-elevated` base and flip text to the lighter `*-200` shade so it reads against the darker tinted background
- Prevent `DataTableComponent` sticky-header text from overflowing into adjacent columns on narrow viewports — the sticky table now has a 32rem minimum width so the outer `overflow-x: auto` engages and the table scrolls horizontally rather than collapsing the columns

## [1.0.2] - 2026-05-10

### Fixed

- Fix hue/saturation drift in primary and secondary color palettes — all primary shades now share H=205° / S=50%, all secondary shades share H=264° / S=25%, varying only lightness, so each ramp reads as a single hue at different lightnesses rather than several different colors. Dark-mode `--color-brand-subtle` and `--color-brand-muted` retinted to the new primary-400 so they no longer drift from the rest of the palette
- Restore visible elevation on `--shadow-*` tokens in dark mode by flipping the drop-shadow color from black to white at low alpha (0.04 → 0.12). Black drop shadows are nearly invisible against a near-black page; against a dark page, white-at-low-alpha blends to a muted dark gray that mirrors the role black-at-low-alpha plays in light mode, preserving the same "floating above the page" depth cue. xl and 2xl use slightly tighter offset/blur than light mode so the lighter fade doesn't sprawl into a halo. Every surface using a shadow token now reads as elevated without any per-component change — `Card` variant="elevated", `Dialog`, `Drawer`, `Dropdown`, `Autocomplete`, `Menu`, `Toast`, `DatePicker` calendar, `Tabs` underline indicator, `Segmented` selected pill, `Slider` thumb, and `Switch` thumb

## [1.0.1] - 2026-05-10

### Added

- Support manual theme override via `<html data-theme="light">` or `<html data-theme="dark">` so consumers can ship their own dark/light toggles independent of the OS `prefers-color-scheme` setting
- New `--color-bg-elevated` semantic token for surfaces that float above the page (Card variant="elevated", Dialog, Drawer). Resolves to the page background in light mode and to a step-lighter shade in dark mode so elevated surfaces remain visibly distinct from the page

### Fixed

- Restore visibility of `Card` variant="elevated", `Dialog`, and `Drawer` in dark mode — they previously shared the same near-black background as the page, with shadows that vanished against it. Switched these surfaces to the new `--color-bg-elevated` token and deepened `--shadow-*` token alpha values for additional depth
- Switch the single-color brand icons (`GithubIconComponent`, `AppleIconComponent`, `FacebookIconComponent`, `XTwitterIconComponent`) to `currentColor` so they inherit the surrounding text color and remain legible in dark mode; opt back in to the original brand color via the new `[brand]` input
- Add dark-mode overrides for `--color-{success,warning,error,info}-{subtle,muted}` so `AlertComponent`, `ToastComponent`, and other status surfaces darken enough for primary text to remain readable against them
- `AvatarEditorComponent` "Change photo" hover overlay now picks white or black ink based on the loaded photo's average luminance instead of the active theme, so the affordance stays readable on both bright and dark images

## [1.0.0] - 2026-05-09

> See [MIGRATION.md](MIGRATION.md) for a step-by-step upgrade guide from v0.x.

### Added

- Introduce shared `SelectOption` interface (`{ value, label, disabled? }`) used by `AutocompleteComponent`, `DropdownComponent`, and `SegmentedComponent` for their `options` input, replacing the previous per-component option types
- Bring `RadioGroupComponent`, `SwitchComponent`, `CheckboxComponent`, and `SegmentedComponent` to parity with other form controls — they now expose `label` (where missing), `hint`, `errorMsg`, and `required` inputs; group controls also wire `aria-labelledby` to the rendered label and `aria-required`/`aria-invalid` to the host
- Add `focus()` public method to `AutocompleteComponent`, `DropdownComponent`, and `DatePickerComponent`; add `readonly` input to `DropdownComponent`, `DatePickerComponent`, and `CodeInputComponent`; add `placeholder` input to `CodeInputComponent`
- Add `focused` and `blurred` outputs (`FocusEvent`) to `AutocompleteComponent`
- Add `removeLabel` input to `TagComponent` so consumers can override the remove-button accessible name per tag
- Add `headingLevel` input to `EmptyStateComponent` (`h2`–`h6`, default `h2`) so the title fits the surrounding document outline
- Add `id` input to `MenuComponent`, `DialogComponent`, `DrawerComponent`, and `RadioGroupComponent` so external `aria-labelledby`/`aria-controls` references can target the host
- `MenuComponent` now implements WAI-ARIA roving keyboard navigation across menu items: arrow keys, Home/End, focus the first item on open
- Calendar grid in `DatePickerComponent` receives focus on open so keyboard users land on the focused day immediately
- `AvatarEditorComponent` canvas is now keyboard-pannable (arrow keys, Shift for larger steps; `+`/`-` to zoom) and exposes a descriptive `aria-label`
- `Spinner` animation honours `prefers-reduced-motion` by slowing the spin rather than disabling the loading affordance

### Changed

- **Breaking:** Rename the `error` input to `errorMsg` on `InputComponent`, `TextareaComponent`, `CodeInputComponent`, `DatePickerComponent`, `DropdownComponent`, `AutocompleteComponent`, and `SliderComponent`. Migration: `<ea-input error="…" />` becomes `<ea-input errorMsg="…" />`
- **Breaking:** `CardComponent` now reads its header and footer from standard `[slot=header]` and `[slot=footer]` content slots rather than the `[eaCardHeader]` and `[eaCardFooter]` attribute directives. Migration: `<span eaCardHeader>…</span>` becomes `<span slot="header">…</span>`. This aligns Card with `DialogComponent` and `DrawerComponent`, which already use the slot pattern
- **Breaking:** Replace `AutocompleteOption`, `DropdownOption`, and `SegmentedOption` types with the single shared `SelectOption` interface. The shape is unchanged; update import sites accordingly
- **Breaking:** Rename `inputFocused`/`inputBlurred` outputs to `focused`/`blurred` on `InputComponent`, and `textareaFocused`/`textareaBlurred` to `focused`/`blurred` on `TextareaComponent`, matching native DOM event names
- **Breaking:** Standardize event output names across components — `TabsComponent.tabChange`, `DataTableComponent.sortChange`, `MenuItemComponent.itemClicked`, and `BreadcrumbsComponent.itemClicked` are now `changed`, `sorted`, and `clicked` respectively
- **Breaking:** Rename `AvatarEditorComponent.cropStateChange` → `cropStateChanged` and `fileError` → `errored` to follow the past-tense convention
- **Breaking:** Rename `PaginatorComponent.placement` → `align` (and the corresponding `PaginatorPlacement` type → `PaginatorAlign`), since "placement" is reserved for popover positioning elsewhere in the library
- **Breaking:** Redesign `AutocompleteComponent` API for parity with other form controls — outputs are now `selected` (was `optionSelected`) and `changed` (was `valueChanged`), and the internal focus signal was renamed to `isFocused` to free the `focused` name for the new output
- **Breaking:** Rename the public type `SortDirection` → `DataTableSortDirection` to avoid leaking a generic name into consumer scope
- `ProgressBarComponent.label` now defaults to `undefined` rather than the empty string, matching the convention used by all other label inputs

### Fixed

- Increase contrast of the `--color-text-link-hover` token in light mode (now `--color-primary-800`) and add dark-mode overrides for `--color-text-link` and `--color-text-link-hover` so links meet WCAG AA in both schemes and the rest→hover delta is perceptible at a glance
- Scope `role="alert"` to the `error` and `warning` variants of `AlertComponent` and `ToastComponent`; non-urgent variants now use `role="status"` with a polite live region instead of interrupting screen-reader output for routine messages
- Add `aria-required` to the focusable element of `DropdownComponent`, `AutocompleteComponent`, `DatePickerComponent`, `SliderComponent`, and `SegmentedComponent` so screen readers announce required custom controls
- `DialogComponent` and `DrawerComponent` now derive an `aria-labelledby` from the slotted header when no `aria-label` is supplied, giving every overlay a programmatic name
- `DropdownComponent` no longer self-references its own trigger via `aria-labelledby`; the visible label now carries an id and the trigger references it
- `DataTableComponent` sortable header cells use the implicit `<th>` role plus `aria-sort` instead of an invalid `role="columnheader button"`
- `TooltipDirective` appends to (and removes from) `aria-describedby` rather than overwriting it, so it no longer clobbers an input's existing hint/error wiring
- Unwrap the `DatePickerComponent` clear button from inside the trigger button (which produced invalid HTML) and position it as a sibling
- `ProgressBarComponent` now exposes `aria-busy` while indeterminate
- Each digit input in `CodeInputComponent` now reflects `aria-invalid` when the group has an error
- `AvatarComponent` falls back to the supplied `initials` for its accessible name when `alt` is empty
- `AvatarEditorComponent` file input now exposes an `aria-label`

### Removed

- **Breaking:** Remove the `status` input (`'default' | 'error' | 'success'`) from `InputComponent`, `TextareaComponent`, and `CodeInputComponent` along with the `success` visual variant. Error state is now driven solely by the `errorMsg` input
- **Breaking:** Remove the `primary` variant from `TagComponent`. Tags now cover semantic statuses only (`default | success | warning | error | info`); use a styled element or `BadgeComponent` for brand-colored chips

## [0.12.0] - 2026-05-08

### Added

- Add `SliderComponent` (`ea-slider`) — single-value range input with `min`/`max`/`step`, `sm`/`md`/`lg` sizes, optional value display and min/max labels, full keyboard navigation (arrows, PageUp/PageDown, Home/End), pointer drag, error/hint messages, and `ControlValueAccessor` integration
- Add `SegmentedComponent` (`ea-segmented`) — toggle button group for view/mode switching with `sm`/`md`/`lg` sizes, full-width option, per-option disabled state, arrow-key navigation, and `ControlValueAccessor` integration
- Add `EmptyStateComponent` (`ea-empty-state`) — pattern component for "no results" / "nothing here yet" states with `media` and `actions` content slots, optional title and description, and `sm`/`md`/`lg` sizes

### Changed

- **Breaking:** `MenuComponent` no longer wraps its trigger via the `[slot=trigger]` content slot. Apply the new `[eaMenuTrigger]` directive to your own button instead and reference the menu by template variable. Migration: `<ea-menu><ea-button slot="trigger">…</ea-button>…</ea-menu>` becomes `<ea-button [eaMenuTrigger]="m">…</ea-button><ea-menu #m>…</ea-menu>`. The trigger now receives `aria-haspopup`/`aria-expanded`/`aria-controls` directly on the focusable element rather than on a wrapping `<div>`, fixing the largest a11y gap in the menu API. The popup is positioned with `position: fixed` so it escapes overflow-clipping ancestors

### Fixed

- Improve accessibility across the library: `DropdownComponent` trigger now exposes `aria-describedby` and `aria-invalid` for hint/error text; `AutocompleteComponent` input declares `aria-haspopup="listbox"` and `aria-autocomplete="list"`; `AccordionItemComponent` trigger and panel are linked via `aria-controls` and `aria-labelledby`; `TabComponent` panels are linked to their tab buttons via `aria-controls`/`aria-labelledby` and become keyboard-focusable; `TooltipDirective` now wires `aria-describedby` on the host, marks the popover with `role="tooltip"`, and dismisses on Escape; `SwitchComponent` accepts an `aria-label` for icon-only usage; `CodeInputComponent` group falls back to a descriptive `aria-label` when no visible label is set
- Restore focus to the previously focused element when `DialogComponent` and `DrawerComponent` close, so keyboard users return to the trigger that opened the overlay
- Remove redundant `aria-disabled` from `ButtonComponent` (native `disabled` is authoritative)
- Drop misleading `aria-modal="false"` from `DatePickerComponent` calendar popover

## [0.11.1] - 2026-04-22

### Fixed

- Prevent the `DropdownComponent` menu from being clipped by overflow-hidden ancestors (e.g. `CardComponent`) by switching it to fixed positioning anchored to the trigger

## [0.11.0] - 2026-04-21

### Added

- Introduce `design-system-flutter.md` and `design-system-react.md` — self-contained framework integration guides covering the full Eagami token set, mandatory design rules, ready-to-paste theme setup, usage patterns, and component API conventions, intended to be copied into consuming Flutter and React projects and written to be readable by both human developers and AI coding agents

### Fixed

- Allow the `DropdownComponent` menu to grow wider than its trigger so long option labels are no longer clipped or wrapped

## [0.10.1] - 2026-04-19

### Changed

- Rework `EagamiWordmarkComponent` API — replace `variant` and `text` inputs with a numeric `variant` (`1`–`4`) that maps to the four text options internally, add `layout` input (`stacked` | `inline`) for single-line rendering with em dash separator, and switch `size` from preset strings to a numeric pixel value for continuous scaling

### Fixed

- Prevent menu dropdown from being clipped by card boundaries in the sandbox

## [0.10.0] - 2026-04-14

### Added

- Add `DatePickerComponent` (`ea-date-picker`) — calendar popover with prev/next month and year navigation, today shortcut, `sm`/`md`/`lg` sizes, `short`/`medium`/`long` locale-aware display formats, configurable week start (Sunday or Monday), `minDate`/`maxDate` bounds, full keyboard navigation (arrows, PageUp/PageDown, Home/End, Enter, Escape), and `ControlValueAccessor` integration
- Introduce a `text` input on `EagamiWordmarkComponent` to switch the wordmark between "eagami" and "eagami design system"
- Build out `CardComponent` with a `headerDivider` input that renders an `ea-divider` between the header and the body

### Changed

- Standardize multi-word component names to sentence case across the README and Storybook sidebar (e.g. "Data Table" → "Data table", "Avatar Editor" → "Avatar editor")

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

[5.39.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.38.1...ui-v5.39.0
[5.38.1]: https://github.com/mwiraszka/eagami/compare/ui-v5.38.0...ui-v5.38.1
[5.38.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.37.0...ui-v5.38.0
[5.37.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.36.0...ui-v5.37.0
[5.36.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.35.0...ui-v5.36.0
[5.35.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.34.0...ui-v5.35.0
[5.34.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.33.0...ui-v5.34.0
[5.33.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.32.0...ui-v5.33.0
[5.32.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.31.0...ui-v5.32.0
[5.31.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.30.2...ui-v5.31.0
[5.30.2]: https://github.com/mwiraszka/eagami/compare/ui-v5.30.1...ui-v5.30.2
[5.30.1]: https://github.com/mwiraszka/eagami/compare/ui-v5.30.0...ui-v5.30.1
[5.30.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.29.0...ui-v5.30.0
[5.29.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.28.0...ui-v5.29.0
[5.28.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.27.0...ui-v5.28.0
[5.27.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.26.1...ui-v5.27.0
[5.26.1]: https://github.com/mwiraszka/eagami/compare/ui-v5.26.0...ui-v5.26.1
[5.26.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.25.1...ui-v5.26.0
[5.25.1]: https://github.com/mwiraszka/eagami/compare/ui-v5.25.0...ui-v5.25.1
[5.25.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.24.0...ui-v5.25.0
[5.24.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.23.0...ui-v5.24.0
[5.23.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.22.1...ui-v5.23.0
[5.22.1]: https://github.com/mwiraszka/eagami/compare/ui-v5.22.0...ui-v5.22.1
[5.22.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.21.0...ui-v5.22.0
[5.21.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.20.0...ui-v5.21.0
[5.20.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.19.0...ui-v5.20.0
[5.19.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.18.0...ui-v5.19.0
[5.18.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.17.2...ui-v5.18.0
[5.17.2]: https://github.com/mwiraszka/eagami/compare/ui-v5.17.1...ui-v5.17.2
[5.17.1]: https://github.com/mwiraszka/eagami/compare/ui-v5.17.0...ui-v5.17.1
[5.17.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.16.1...ui-v5.17.0
[5.16.1]: https://github.com/mwiraszka/eagami/compare/ui-v5.16.0...ui-v5.16.1
[5.16.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.15.1...ui-v5.16.0
[5.15.1]: https://github.com/mwiraszka/eagami/compare/ui-v5.15.0...ui-v5.15.1
[5.15.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.14.4...ui-v5.15.0
[5.14.4]: https://github.com/mwiraszka/eagami/compare/ui-v5.14.3...ui-v5.14.4
[5.14.3]: https://github.com/mwiraszka/eagami/compare/ui-v5.14.2...ui-v5.14.3
[5.14.2]: https://github.com/mwiraszka/eagami/compare/ui-v5.14.1...ui-v5.14.2
[5.14.1]: https://github.com/mwiraszka/eagami/compare/ui-v5.14.0...ui-v5.14.1
[5.14.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.13.0...ui-v5.14.0
[5.13.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.12.2...ui-v5.13.0
[5.12.2]: https://github.com/mwiraszka/eagami/compare/ui-v5.12.1...ui-v5.12.2
[5.12.1]: https://github.com/mwiraszka/eagami/compare/ui-v5.12.0...ui-v5.12.1
[5.12.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.11.0...ui-v5.12.0
[5.11.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.10.1...ui-v5.11.0
[5.10.1]: https://github.com/mwiraszka/eagami/compare/ui-v5.10.0...ui-v5.10.1
[5.10.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.9.0...ui-v5.10.0
[5.9.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.8.6...ui-v5.9.0
[5.8.6]: https://github.com/mwiraszka/eagami/compare/ui-v5.8.5...ui-v5.8.6
[5.8.5]: https://github.com/mwiraszka/eagami/compare/ui-v5.8.4...ui-v5.8.5
[5.8.4]: https://github.com/mwiraszka/eagami/compare/ui-v5.8.3...ui-v5.8.4
[5.8.3]: https://github.com/mwiraszka/eagami/compare/ui-v5.8.2...ui-v5.8.3
[5.8.2]: https://github.com/mwiraszka/eagami/compare/ui-v5.8.1...ui-v5.8.2
[5.8.1]: https://github.com/mwiraszka/eagami/compare/ui-v5.8.0...ui-v5.8.1
[5.8.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.7.0...ui-v5.8.0
[5.7.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.6.2...ui-v5.7.0
[5.6.2]: https://github.com/mwiraszka/eagami/compare/ui-v5.6.1...ui-v5.6.2
[5.6.1]: https://github.com/mwiraszka/eagami/compare/ui-v5.6.0...ui-v5.6.1
[5.6.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.5.0...ui-v5.6.0
[5.5.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.4.0...ui-v5.5.0
[5.4.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.3.0...ui-v5.4.0
[5.3.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.2.2...ui-v5.3.0
[5.2.2]: https://github.com/mwiraszka/eagami/compare/ui-v5.2.1...ui-v5.2.2
[5.2.1]: https://github.com/mwiraszka/eagami/compare/ui-v5.2.0...ui-v5.2.1
[5.2.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.1.0...ui-v5.2.0
[5.1.0]: https://github.com/mwiraszka/eagami/compare/ui-v5.0.1...ui-v5.1.0
[5.0.1]: https://github.com/mwiraszka/eagami/compare/ui-v5.0.0...ui-v5.0.1
[5.0.0]: https://github.com/mwiraszka/eagami/compare/ui-v4.8.1...ui-v5.0.0
[4.8.1]: https://github.com/mwiraszka/eagami/compare/ui-v4.8.0...ui-v4.8.1
[4.8.0]: https://github.com/mwiraszka/eagami/compare/ui-v4.7.0...ui-v4.8.0
[4.7.0]: https://github.com/mwiraszka/eagami/compare/ui-v4.6.0...ui-v4.7.0
[4.6.0]: https://github.com/mwiraszka/eagami/compare/ui-v4.5.1...ui-v4.6.0
[4.5.1]: https://github.com/mwiraszka/eagami/compare/ui-v4.5.0...ui-v4.5.1
[4.5.0]: https://github.com/mwiraszka/eagami/compare/ui-v4.4.0...ui-v4.5.0
[4.4.0]: https://github.com/mwiraszka/eagami/compare/ui-v4.3.1...ui-v4.4.0
[4.3.1]: https://github.com/mwiraszka/eagami/compare/ui-v4.3.0...ui-v4.3.1
[4.3.0]: https://github.com/mwiraszka/eagami/compare/ui-v4.2.0...ui-v4.3.0
[4.2.0]: https://github.com/mwiraszka/eagami/compare/ui-v4.1.1...ui-v4.2.0
[4.1.1]: https://github.com/mwiraszka/eagami/compare/ui-v4.1.0...ui-v4.1.1
[4.1.0]: https://github.com/mwiraszka/eagami/compare/ui-v4.0.0...ui-v4.1.0
[4.0.0]: https://github.com/mwiraszka/eagami/compare/ui-v3.2.1...ui-v4.0.0
[3.2.1]: https://github.com/mwiraszka/eagami/compare/ui-v3.2.0...ui-v3.2.1
[3.2.0]: https://github.com/mwiraszka/eagami/compare/ui-v3.1.1...ui-v3.2.0
[3.1.1]: https://github.com/mwiraszka/eagami/compare/ui-v3.1.0...ui-v3.1.1
[3.1.0]: https://github.com/mwiraszka/eagami/compare/ui-v3.0.0...ui-v3.1.0
[3.0.0]: https://github.com/mwiraszka/eagami/compare/ui-v2.12.0...ui-v3.0.0
[2.12.0]: https://github.com/mwiraszka/eagami/compare/ui-v2.11.0...ui-v2.12.0
[2.11.0]: https://github.com/mwiraszka/eagami/compare/ui-v2.10.0...ui-v2.11.0
[2.10.0]: https://github.com/mwiraszka/eagami/compare/ui-v2.9.0...ui-v2.10.0
[2.9.0]: https://github.com/mwiraszka/eagami/compare/ui-v2.8.0...ui-v2.9.0
[2.8.0]: https://github.com/mwiraszka/eagami/compare/ui-v2.7.0...ui-v2.8.0
[2.7.0]: https://github.com/mwiraszka/eagami/compare/ui-v2.6.0...ui-v2.7.0
[2.6.0]: https://github.com/mwiraszka/eagami/compare/ui-v2.5.3...ui-v2.6.0
[2.5.3]: https://github.com/mwiraszka/eagami/compare/ui-v2.5.2...ui-v2.5.3
[2.5.2]: https://github.com/mwiraszka/eagami/compare/ui-v2.5.1...ui-v2.5.2
[2.5.1]: https://github.com/mwiraszka/eagami/compare/ui-v2.5.0...ui-v2.5.1
[2.5.0]: https://github.com/mwiraszka/eagami/compare/ui-v2.4.0...ui-v2.5.0
[2.4.0]: https://github.com/mwiraszka/eagami/compare/ui-v2.3.0...ui-v2.4.0
[2.3.0]: https://github.com/mwiraszka/eagami/compare/ui-v2.2.0...ui-v2.3.0
[2.2.0]: https://github.com/mwiraszka/eagami/compare/ui-v2.1.0...ui-v2.2.0
[2.1.0]: https://github.com/mwiraszka/eagami/compare/ui-v2.0.0...ui-v2.1.0
[2.0.0]: https://github.com/mwiraszka/eagami/compare/ui-v1.5.0...ui-v2.0.0
[1.5.0]: https://github.com/mwiraszka/eagami/compare/ui-v1.4.0...ui-v1.5.0
[1.4.0]: https://github.com/mwiraszka/eagami/compare/ui-v1.3.0...ui-v1.4.0
[1.3.0]: https://github.com/mwiraszka/eagami/compare/ui-v1.2.1...ui-v1.3.0
[1.2.1]: https://github.com/mwiraszka/eagami/compare/v1.2.0...ui-v1.2.1
[1.2.0]: https://github.com/mwiraszka/eagami/compare/v1.1.1...v1.2.0
[1.1.1]: https://github.com/mwiraszka/eagami/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/mwiraszka/eagami/compare/v1.0.2...v1.1.0
[1.0.2]: https://github.com/mwiraszka/eagami/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/mwiraszka/eagami/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/mwiraszka/eagami/compare/v0.12.0...v1.0.0
[0.12.0]: https://github.com/mwiraszka/eagami/compare/v0.11.1...v0.12.0
[0.11.1]: https://github.com/mwiraszka/eagami/compare/v0.11.0...v0.11.1
[0.11.0]: https://github.com/mwiraszka/eagami/compare/v0.10.1...v0.11.0
[0.10.1]: https://github.com/mwiraszka/eagami/compare/v0.10.0...v0.10.1
[0.10.0]: https://github.com/mwiraszka/eagami/compare/v0.9.0...v0.10.0
[0.9.0]: https://github.com/mwiraszka/eagami/compare/v0.8.1...v0.9.0
[0.8.1]: https://github.com/mwiraszka/eagami/compare/v0.7.4...v0.8.1
[0.8.0]: https://github.com/mwiraszka/eagami/compare/v0.7.4...2839c0a0d3ce98ba9fd99e07e0c4d99cf760efe6
[0.7.4]: https://github.com/mwiraszka/eagami/compare/v0.7.3...v0.7.4
[0.7.3]: https://github.com/mwiraszka/eagami/compare/v0.7.2...v0.7.3
[0.7.2]: https://github.com/mwiraszka/eagami/compare/v0.7.1...v0.7.2
[0.7.1]: https://github.com/mwiraszka/eagami/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/mwiraszka/eagami/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/mwiraszka/eagami/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/mwiraszka/eagami/compare/v0.4.1...v0.5.0
[0.4.1]: https://github.com/mwiraszka/eagami/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/mwiraszka/eagami/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/mwiraszka/eagami/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/mwiraszka/eagami/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/mwiraszka/eagami/releases/tag/v0.1.0
