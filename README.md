# @eagami/ui

A lightweight, accessible Angular UI component library built on CSS custom properties. Zero runtime dependencies beyond Angular itself.

<p align="center">
  <img src="logo.svg" alt="eagami-ui logo" width="150" />
</p>

## Why @eagami/ui?

| | **@eagami/ui** | Angular Material | PrimeNG | ng-bootstrap | ng-zorro (Ant Design) |
|---|---|---|---|---|---|
| Approx. bundle (Button + Input, gzipped)¹ | ~8 KB | ~60 KB | ~35 KB | ~55 KB | ~120 KB |
| External CSS dependency | ❌ | ❌ | Optional | Bootstrap (~30 KB) | ❌ |
| CSS custom property theming | ✅ | Partial (MDC) | ✅ | ❌ (Sass vars) | ❌ |
| Signals-first API | ✅ | Partial | ❌ | ❌ | ❌ |
| `OnPush` by default | ✅ | Partial | ❌ | ❌ | ❌ |
| Runtime dependencies | 0 | CDK + animations | PrimeIcons² | Bootstrap CSS | CDK |

> ¹ All numbers are approximate and depend on configuration, tree-shaking, and Angular version. Measured with production builds and `@angular/build`.

> ² PrimeNG components are tree-shakable but PrimeIcons font (~50 KB) is typically included globally.

## Requirements

- Angular 21+
- A CSS preprocessor that supports SCSS (standard with Angular CLI)

## Installation

```sh
npm install @eagami/ui
```

## Setup

### 1. Import the global stylesheet

In `angular.json`:
```json
"styles": ["node_modules/@eagami/ui/src/styles/eagami-ui.scss"]
```

Or in your root `styles.scss`:
```scss
@use '@eagami/ui/src/styles/eagami-ui';
```

### 2. Import components

Components are standalone — import only what you use:

```ts
import { ButtonComponent, InputComponent, CheckboxComponent } from '@eagami/ui';

@Component({
  imports: [ButtonComponent, InputComponent, CheckboxComponent],
  ...
})
```

## Usage

### Button

```html
<ea-button variant="primary" (clicked)="onSave($event)">Save</ea-button>

<ea-button variant="secondary" size="sm" [disabled]="true">Cancel</ea-button>

<ea-button variant="danger" [loading]="isDeleting()">Delete</ea-button>
```

**Inputs**

| Input | Type | Default | Description |
|---|---|---|---|
| `variant` | `primary \| secondary \| ghost \| danger` | `primary` | Visual style |
| `size` | `sm \| md \| lg` | `md` | Button size |
| `type` | `button \| submit \| reset` | `button` | Native button type |
| `disabled` | `boolean` | `false` | Disables the button |
| `loading` | `boolean` | `false` | Shows a spinner, disables interaction |
| `fullWidth` | `boolean` | `false` | Stretches to fill container |
| `aria-label` | `string` | — | Accessible label for icon-only buttons |

**Outputs**

| Output | Type | Description |
|---|---|---|
| `clicked` | `MouseEvent` | Emitted on click (not emitted when disabled or loading) |

---

### Input

```html
<ea-input
  label="Email"
  type="email"
  placeholder="you@example.com"
  [(value)]="email" />

<ea-input
  label="Password"
  type="password"
  hint="At least 8 characters"
  [required]="true" />

<ea-input
  label="Username"
  error="This username is already taken"
  [(value)]="username" />
```

Works with Angular reactive forms and template-driven forms via `ControlValueAccessor`:

```ts
// Reactive
this.form = this.fb.group({ email: ['', Validators.required] });
```
```html
<ea-input label="Email" formControlName="email" />
```

**Inputs**

| Input | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Field label |
| `type` | `text \| email \| password \| number \| search \| tel \| url` | `text` | Input type |
| `placeholder` | `string` | `''` | Placeholder text |
| `size` | `sm \| md \| lg` | `md` | Field size |
| `status` | `default \| error \| success` | `default` | Visual validation state |
| `hint` | `string` | — | Helper text below the input |
| `error` | `string` | — | Error message (also sets status to `error`) |
| `disabled` | `boolean` | `false` | Disables the input |
| `readonly` | `boolean` | `false` | Makes the input read-only |
| `required` | `boolean` | `false` | Marks as required |

**Two-way binding**

| Binding | Type | Description |
|---|---|---|
| `[(value)]` | `string` | Two-way signal-based value binding |

---

### Checkbox

```html
<ea-checkbox label="Accept terms" [(checked)]="accepted" />

<ea-checkbox label="Select all" [indeterminate]="true" />

<ea-checkbox label="Disabled" [disabled]="true" />
```

Works with Angular forms via `ControlValueAccessor`.

**Inputs**

| Input | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Checkbox label |
| `size` | `sm \| md \| lg` | `md` | Checkbox size |
| `disabled` | `boolean` | `false` | Disables the checkbox |
| `required` | `boolean` | `false` | Marks as required |
| `indeterminate` | `boolean` | `false` | Shows indeterminate (minus) state |

**Two-way binding**

| Binding | Type | Description |
|---|---|---|
| `[(checked)]` | `boolean` | Two-way checked state |

**Outputs**

| Output | Type | Description |
|---|---|---|
| `changed` | `boolean` | Emitted when the checked state changes |

---

### Radio

Radio buttons are composed of a `ea-radio-group` wrapper and `ea-radio` items:

```html
<ea-radio-group [(value)]="colour">
  <ea-radio value="red" label="Red" />
  <ea-radio value="green" label="Green" />
  <ea-radio value="blue" label="Blue" />
</ea-radio-group>
```

The group implements `ControlValueAccessor` for Angular forms integration.

**RadioGroup Inputs**

| Input | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | auto | Shared name for all radios |
| `size` | `sm \| md \| lg` | `md` | Size of all radios |
| `orientation` | `vertical \| horizontal` | `vertical` | Layout direction |
| `disabled` | `boolean` | `false` | Disables all radios |

**RadioGroup Two-way binding**

| Binding | Type | Description |
|---|---|---|
| `[(value)]` | `string` | Currently selected value |

**Radio Inputs**

| Input | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | *required* | Option value |
| `label` | `string` | — | Radio label |
| `disabled` | `boolean` | `false` | Disables this radio |

---

### Card

```html
<ea-card variant="elevated">
  <span slot="header">Card Title</span>
  Body content goes here.
  <span slot="footer">
    <ea-button size="sm">Action</ea-button>
  </span>
</ea-card>
```

**Inputs**

| Input | Type | Default | Description |
|---|---|---|---|
| `variant` | `elevated \| outlined \| filled` | `elevated` | Visual style |
| `padding` | `none \| sm \| md \| lg` | `md` | Inner padding |
| `fullWidth` | `boolean` | `false` | Stretches to fill container |

**Content slots**

| Slot | Description |
|---|---|
| `[slot=header]` | Card header / title area |
| *(default)* | Card body content |
| `[slot=footer]` | Card footer / actions area |

Header and footer are hidden when empty.

---

### Dropdown

```html
<ea-dropdown
  label="Country"
  placeholder="Select a country…"
  [options]="countries"
  [(value)]="selectedCountry" />
```

Options are passed as an array of `{ value, label, disabled? }` objects. Supports keyboard navigation (arrow keys, Enter, Escape). Implements `ControlValueAccessor`.

**Inputs**

| Input | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Field label |
| `placeholder` | `string` | `'Select…'` | Placeholder text |
| `options` | `DropdownOption[]` | `[]` | Array of `{ value, label, disabled? }` |
| `size` | `sm \| md \| lg` | `md` | Trigger size |
| `disabled` | `boolean` | `false` | Disables the dropdown |
| `required` | `boolean` | `false` | Marks as required |
| `hint` | `string` | — | Helper text |
| `error` | `string` | — | Error message |

**Two-way binding**

| Binding | Type | Description |
|---|---|---|
| `[(value)]` | `string` | Selected option value |

**Outputs**

| Output | Type | Description |
|---|---|---|
| `changed` | `string` | Emitted when selection changes |

---

### Dialog

```html
<ea-button (clicked)="isOpen = true">Open</ea-button>

<ea-dialog [(open)]="isOpen">
  <span slot="header">Confirm Action</span>
  <p>Are you sure you want to proceed?</p>
  <span slot="footer">
    <ea-button variant="secondary" (clicked)="isOpen = false">Cancel</ea-button>
    <ea-button (clicked)="onConfirm()">Confirm</ea-button>
  </span>
</ea-dialog>
```

Uses the native `<dialog>` element with `showModal()` for proper focus trapping, backdrop, and accessibility.

**Inputs**

| Input | Type | Default | Description |
|---|---|---|---|
| `size` | `sm \| md \| lg \| full` | `md` | Dialog panel width |
| `closeOnBackdrop` | `boolean` | `true` | Close on backdrop click |
| `closeOnEscape` | `boolean` | `true` | Close on Escape key |
| `showClose` | `boolean` | `true` | Show the close (×) button |
| `aria-label` | `string` | — | Accessible label for the dialog |

**Two-way binding**

| Binding | Type | Description |
|---|---|---|
| `[(open)]` | `boolean` | Controls dialog visibility |

**Outputs**

| Output | Type | Description |
|---|---|---|
| `opened` | `void` | Emitted when the dialog opens |
| `closed` | `void` | Emitted when the dialog closes |

**Content slots**

| Slot | Description |
|---|---|
| `[slot=header]` | Dialog title |
| *(default)* | Dialog body |
| `[slot=footer]` | Dialog actions |

---

## Theming

All components use CSS custom properties. Override them after importing the stylesheet:

```css
:root {
  /* Brand colour — affects primary buttons, focus rings, etc. */
  --color-brand-default: #7c3aed;
  --color-brand-hover:   #6d28d9;
  --color-brand-active:  #5b21b6;
  --color-brand-subtle:  #f5f3ff;
  --color-brand-muted:   #ede9fe;
}
```

See [`src/styles/tokens/`](src/styles/tokens/) for the full token reference.

---

## Development

```sh
# Install dependencies
pnpm install

# Run the sandbox dev app
pnpm sandbox

# Run Storybook (component explorer)
pnpm storybook

# Run tests
pnpm test

# Build the library
pnpm build
```

## Contributing

Issues and PRs are welcome. Please open an issue before submitting large changes.

## License

MIT
