<p align="center">
  <img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/eagami-header.png" alt="eagami design system — elegant web design." width="800" />
</p>

A lightweight, accessible Angular component library built on CSS custom properties. Ready to use out of the box — install, import, and start building.

Every component is standalone, signal-based, and fully themed via design tokens. No wrapping modules, no complex setup, no runtime style conflicts. Designed to be AI-friendly with clear APIs, consistent patterns, and comprehensive documentation that makes it easy for both developers and AI assistants to work with.

## Why @eagami/ui?

**Approx. component sizes (gzipped)¹**

| Component | **@eagami/ui** | Angular Material | PrimeNG | ng-bootstrap | ng-zorro |
|---|---|---|---|---|---|
| Button | ~2 KB | ~12 KB | ~8 KB | ~10 KB | ~18 KB |
| Input | ~4 KB | ~25 KB | ~14 KB | ~20 KB | ~35 KB |
| Checkbox | ~2 KB | ~15 KB | ~9 KB | ~12 KB | ~22 KB |
| Dropdown / Select | ~4 KB | ~30 KB | ~20 KB | ~25 KB | ~40 KB |
| Dialog / Modal | ~2 KB | ~20 KB | ~15 KB | ~18 KB | ~30 KB |

> ¹ Approximate — depends on configuration, tree-shaking, and Angular version. @eagami/ui sizes measured from production build.

| | **@eagami/ui** | Angular Material | PrimeNG | ng-bootstrap | ng-zorro |
|---|---|---|---|---|---|
| External CSS dependency | No | No | Optional | Bootstrap (~30 KB) | No |
| CSS custom property theming | Yes | Partial (MDC) | Yes | No (Sass vars) | No |
| Signals-first API | Yes | Partial | No | No | No |
| `OnPush` by default | Yes | Partial | No | No | No |
| Runtime dependencies | 0 | CDK + animations | PrimeIcons² | Bootstrap CSS | CDK |
> ² PrimeNG components are tree-shakable but PrimeIcons font (~50 KB) is typically included globally.

## Features

- **Zero configuration** — works immediately after install with sensible defaults
- **Standalone components** — no `NgModule` boilerplate, just import and use
- **Signal-based** — built on Angular's modern reactivity primitives (`input()`, `model()`, `output()`, `effect()`)
- **Full theming via CSS custom properties** — override any design token on `:root` or scope overrides to individual components
- **Dark mode built in** — automatic via `prefers-color-scheme`, no extra setup
- **Accessible** — ARIA attributes, keyboard navigation, focus management, and screen reader support throughout
- **Form-ready** — `ControlValueAccessor` on all form components (Input, Textarea, Checkbox, Switch, Radio, Dropdown)
- **Lightweight** — zero runtime dependencies beyond Angular
- **Tree-shakeable** — only the components you import end up in your bundle

## Installation

```bash
npm install @eagami/ui
# or
pnpm add @eagami/ui
```

Add the global stylesheet to your `angular.json` (or import it in your root SCSS):

```json
"styles": ["node_modules/@eagami/ui/src/styles/eagami-ui.scss"]
```

Load the fonts in your `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Syne:wght@400;500;600;700&display=swap" />
```

## Quick start

```typescript
import { ButtonComponent } from '@eagami/ui';

@Component({
  imports: [ButtonComponent],
  template: `<ea-button variant="primary" (clicked)="save()">Save</ea-button>`,
})
export class MyComponent {
  save() { /* ... */ }
}
```

No modules to register, no providers to configure. Every component works the same way — import it, drop it in your template.

## Components

### Button

Variants: `primary` | `secondary` | `ghost` | `danger`. Sizes: `sm` | `md` | `lg`. Supports `loading`, `disabled`, and `fullWidth` states.

```html
<ea-button variant="primary" size="md" [loading]="isSaving" (clicked)="save()">
  Save changes
</ea-button>
```

<img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/button.png" alt="Button component" width="560" />

---

### Input

Full `ControlValueAccessor` support. Types: `text` | `email` | `password` | `number` | `search` | `tel` | `url`. Built-in password visibility toggle.

```html
<ea-input
  label="Email"
  type="email"
  placeholder="you@example.com"
  hint="We'll never share your email"
  [(value)]="email" />
```

<img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/input.png" alt="Input component" width="560" />

---

### Textarea

Mirrors the Input API with `ControlValueAccessor`. Configurable `rows`, `resize` (`none` | `vertical` | `horizontal` | `both`), and `maxlength`.

```html
<ea-textarea
  label="Message"
  placeholder="Enter your message…"
  hint="Maximum 500 characters"
  [rows]="4"
  [(value)]="message" />
```

<img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/textarea.png" alt="Textarea component" width="560" />

---

### Checkbox

`ControlValueAccessor` with `indeterminate` state support. Sizes: `sm` | `md` | `lg`.

```html
<ea-checkbox label="Accept terms and conditions" [(checked)]="accepted" />
```

<img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/checkbox.png" alt="Checkbox component" width="560" />

---

### Switch

Toggle switch with `ControlValueAccessor`. Sizes: `sm` | `md` | `lg`.

```html
<ea-switch label="Enable notifications" [(checked)]="notificationsOn" />
```

<img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/switch.png" alt="Switch component" width="560" />

---

### Radio Group

Composite pattern with `ControlValueAccessor`. Supports `vertical` and `horizontal` orientation.

```html
<ea-radio-group [(value)]="plan">
  <ea-radio value="free" label="Free" />
  <ea-radio value="pro" label="Pro" />
  <ea-radio value="enterprise" label="Enterprise" />
</ea-radio-group>
```

<img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/radio.png" alt="Radio group component" width="560" />

---

### Dropdown

Select dropdown with `ControlValueAccessor` and keyboard navigation (Arrow keys, Enter/Space, Escape).

```html
<ea-dropdown
  label="Country"
  placeholder="Select a country…"
  [options]="countries"
  [(value)]="selectedCountry" />
```

<img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/dropdown.png" alt="Dropdown component" width="560" />

---

### Card

Content container with variants: `elevated` | `outlined` | `filled`. Padding: `none` | `sm` | `md` | `lg` | `xl`. Customizable shadow via `--ea-card-shadow`.

```html
<ea-card variant="elevated">
  <span eaCardHeader>Card Title</span>
  Card body content goes here.
  <span eaCardFooter>
    <ea-button variant="secondary" size="sm">Cancel</ea-button>
    <ea-button size="sm">Save</ea-button>
  </span>
</ea-card>
```

<img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/card.png" alt="Card component" width="560" />

---

### Avatar

Image with initials or icon fallback. Sizes: `xs` | `sm` | `md` | `lg` | `xl`. Shapes: `circle` | `square`.

```html
<ea-avatar src="/photo.jpg" alt="User" size="lg" />
<ea-avatar initials="MW" shape="square" />
<ea-avatar />  <!-- shows fallback user icon -->
```

<img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/avatar.png" alt="Avatar component" width="560" />

---

### Avatar Editor

Canvas-based image editor with drag-and-drop upload, pan, zoom (slider + scroll wheel), and crop export. Outputs a `Blob` and data URL for use with the Avatar component.

```html
<ea-avatar-editor
  shape="circle"
  [canvasSize]="200"
  (cropped)="onCropped($event)" />
```

<img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/avatar-editor.png" alt="Avatar editor component" width="560" />

---

### Badge

Semantic status indicators. Variants: `default` | `success` | `warning` | `error` | `info`. Sizes: `sm` | `md` | `lg`.

```html
<ea-badge variant="success">Active</ea-badge>
<ea-badge variant="error">Failed</ea-badge>
```

<img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/badge.png" alt="Badge component" width="560" />

---

### Spinner

SVG loading indicator with `role="status"` for accessibility. Sizes: `sm` | `md` | `lg`.

```html
<ea-spinner size="md" label="Loading data" />
```

<img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/spinner.png" alt="Spinner component" width="560" />

---

### Divider

Visual separator with optional label. Orientation: `horizontal` | `vertical`.

```html
<ea-divider />
<ea-divider label="or" />
<ea-divider orientation="vertical" />
```

<img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/divider.png" alt="Divider component" width="560" />

---

### Dialog

Built on the native `<dialog>` element for built-in focus trapping. Sizes: `sm` | `md` | `lg` | `full`. Two-way `open` binding.

```html
<ea-button (clicked)="dialogOpen.set(true)">Open</ea-button>

<ea-dialog [(open)]="dialogOpen" size="md">
  <span slot="header">Confirm</span>
  <p>Are you sure?</p>
  <span slot="footer">
    <ea-button variant="secondary" (clicked)="dialogOpen.set(false)">Cancel</ea-button>
    <ea-button (clicked)="confirm()">Confirm</ea-button>
  </span>
</ea-dialog>
```

---

### Tooltip

Directive that shows a positioned tooltip on hover and focus. Positions: `top` | `bottom` | `left` | `right`.

```html
<ea-button eaTooltip="Save your changes" tooltipPosition="top">Save</ea-button>
```

---

### Toast

Notification system via injectable `ToastService`. Variants: `default` | `success` | `warning` | `error` | `info`. Auto-dismiss with configurable duration. Full-width on mobile, independent widths on desktop.

```typescript
import { ToastService } from '@eagami/ui';

export class MyComponent {
  private toast = inject(ToastService);

  save() {
    this.toast.success('Changes saved');
  }

  handleError() {
    this.toast.error('Something went wrong');
  }
}
```

Add the toast outlet once in your root template:

```html
<ea-toast />
```

<img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/toast.png" alt="Toast component" width="560" />

## Icons

Built-in SVG icon components following the Feather icon style (24x24 viewBox, stroke-based, inherits `currentColor`):

| Tag | Preview |
|---|---|
| `<ea-icon-alert-circle />` | <img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/icons/alert-circle.png" width="24" height="24" alt="alert-circle" /> |
| `<ea-icon-camera />` | <img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/icons/camera.png" width="24" height="24" alt="camera" /> |
| `<ea-icon-check />` | <img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/icons/check.png" width="24" height="24" alt="check" /> |
| `<ea-icon-eye />` | <img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/icons/eye.png" width="24" height="24" alt="eye" /> |
| `<ea-icon-eye-off />` | <img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/icons/eye-off.png" width="24" height="24" alt="eye-off" /> |
| `<ea-icon-google />` | <img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/icons/google.png" width="24" height="24" alt="google" /> |
| `<ea-icon-info />` | <img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/icons/info.png" width="24" height="24" alt="info" /> |
| `<ea-icon-loader />` | <img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/icons/loader.png" width="24" height="24" alt="loader" /> |
| `<ea-icon-minus />` | <img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/icons/minus.png" width="24" height="24" alt="minus" /> |
| `<ea-icon-plus />` | <img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/icons/plus.png" width="24" height="24" alt="plus" /> |
| `<ea-icon-rotate-ccw />` | <img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/icons/rotate-ccw.png" width="24" height="24" alt="rotate-ccw" /> |
| `<ea-icon-trash />` | <img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/icons/trash.png" width="24" height="24" alt="trash" /> |
| `<ea-icon-upload />` | <img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/icons/upload.png" width="24" height="24" alt="upload" /> |
| `<ea-icon-user />` | <img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/icons/user.png" width="24" height="24" alt="user" /> |
| `<ea-icon-x />` | <img src="https://raw.githubusercontent.com/mwiraszka/eagami-design-system/main/docs/images/icons/x.png" width="24" height="24" alt="x" /> |

## Theming

All visual properties are controlled through CSS custom properties defined on `:root`. Override any token to customize the entire library:

```css
:root {
  --color-primary-600: #2563eb;
  --font-family-sans: 'Inter', sans-serif;
  --radius-md: 0.5rem;
}
```

Component-level overrides are available where useful:

```css
.my-card {
  --ea-card-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  --ea-button-font-weight: 600;
}
```

See [`src/styles/tokens/`](src/styles/tokens/) for the full token reference.

## Peer dependencies

| Package | Version |
|---------|---------|
| `@angular/common` | `^21.0.0` |
| `@angular/core` | `^21.0.0` |
| `@angular/forms` | `^21.0.0` |

## Development

```bash
pnpm install       # Install dependencies
pnpm start         # Run sandbox dev app
pnpm storybook     # Run Storybook
pnpm test          # Run tests
pnpm build         # Build the library
pnpm lint          # Lint
```

## License

MIT
