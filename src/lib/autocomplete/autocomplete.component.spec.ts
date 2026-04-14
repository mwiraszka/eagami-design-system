import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  AutocompleteComponent,
  AutocompleteOption,
  AutocompleteSize,
} from './autocomplete.component';

const FRUITS: AutocompleteOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'apricot', label: 'Apricot' },
  { value: 'banana', label: 'Banana' },
  { value: 'blueberry', label: 'Blueberry', disabled: true },
  { value: 'cherry', label: 'Cherry' },
];

@Component({
  selector: 'ea-test-host',
  imports: [AutocompleteComponent],
  template: `
    <ea-autocomplete
      [(value)]="value"
      [options]="options()"
      [label]="label()"
      [placeholder]="placeholder()"
      [size]="size()"
      [disabled]="disabled()"
      [required]="required()"
      [hint]="hint()"
      [error]="error()"
      [minLength]="minLength()"
      [maxResults]="maxResults()"
      (optionSelected)="onSelected($event)" />
  `,
})
class TestHostComponent {
  value = signal('');
  options = signal<AutocompleteOption[]>(FRUITS);
  label = signal<string | undefined>(undefined);
  placeholder = signal('');
  size = signal<AutocompleteSize>('md');
  disabled = signal(false);
  required = signal(false);
  hint = signal<string | undefined>(undefined);
  error = signal<string | undefined>(undefined);
  minLength = signal(0);
  maxResults = signal(10);
  lastSelected: AutocompleteOption | null = null;

  onSelected(option: AutocompleteOption): void {
    this.lastSelected = option;
  }
}

describe('AutocompleteComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  function getInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('.ea-autocomplete__input');
  }

  function getListbox(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.ea-autocomplete__listbox');
  }

  function getOptions(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.ea-autocomplete__option'));
  }

  function getLabel(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.ea-autocomplete__label');
  }

  function type(value: string): void {
    const input = getInput();
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function focus(): void {
    getInput().dispatchEvent(new FocusEvent('focus'));
    fixture.detectChanges();
  }

  function press(key: string): KeyboardEvent {
    const event = new KeyboardEvent('keydown', { key, cancelable: true });
    getInput().dispatchEvent(event);
    fixture.detectChanges();
    return event;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  describe('Rendering', () => {
    it('renders an input element', () => {
      expect(getInput()).toBeTruthy();
    });

    it('does not render the listbox by default', () => {
      expect(getListbox()).toBeNull();
    });

    it('renders the label when provided', () => {
      host.label.set('Fruit');
      fixture.detectChanges();

      expect(getLabel()?.textContent).toContain('Fruit');
    });

    it('applies the default size class', () => {
      const wrapper = fixture.nativeElement.querySelector('.ea-autocomplete__wrapper');

      expect(wrapper.classList).toContain('ea-autocomplete__wrapper--md');
    });

    it('applies size classes', () => {
      host.size.set('lg');
      fixture.detectChanges();

      const wrapper = fixture.nativeElement.querySelector('.ea-autocomplete__wrapper');

      expect(wrapper.classList).toContain('ea-autocomplete__wrapper--lg');
    });

    it('marks input as aria-invalid when error is set', () => {
      host.error.set('Required');
      fixture.detectChanges();

      expect(getInput().getAttribute('aria-invalid')).toBe('true');
    });
  });

  // ── Filtering ─────────────────────────────────────────────────────────────

  describe('Filtering', () => {
    it('opens the listbox on focus', () => {
      focus();

      expect(getListbox()).toBeTruthy();
    });

    it('shows all options when input is empty', () => {
      focus();

      expect(getOptions().length).toBe(FRUITS.length);
    });

    it('filters options by label, case-insensitive', () => {
      focus();
      type('ap');

      const labels = getOptions().map(o => o.textContent?.trim());

      expect(labels).toEqual(['Apple', 'Apricot']);
    });

    it('filters to match substrings anywhere in the label', () => {
      focus();
      type('err');

      const labels = getOptions().map(o => o.textContent?.trim());

      expect(labels).toContain('Cherry');
      expect(labels).toContain('Blueberry');
    });

    it('shows the empty message when there are no matches', () => {
      focus();
      type('zzz');

      const empty = fixture.nativeElement.querySelector('.ea-autocomplete__empty');

      expect(empty).toBeTruthy();
      expect(getOptions().length).toBe(0);
    });

    it('respects minLength', () => {
      host.minLength.set(2);
      fixture.detectChanges();

      focus();

      expect(getListbox()).toBeNull();

      type('a');

      expect(getListbox()).toBeNull();

      type('ap');

      expect(getListbox()).toBeTruthy();
    });

    it('respects maxResults', () => {
      host.maxResults.set(2);
      fixture.detectChanges();

      focus();

      expect(getOptions().length).toBe(2);
    });
  });

  // ── Selection ─────────────────────────────────────────────────────────────

  describe('Selection', () => {
    it('selects an option on mousedown', () => {
      focus();

      const options = getOptions();
      options[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      fixture.detectChanges();

      expect(host.value()).toBe('Apple');
      expect(host.lastSelected?.value).toBe('apple');
    });

    it('closes the listbox after selecting', () => {
      focus();

      const options = getOptions();
      options[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      fixture.detectChanges();

      expect(getListbox()).toBeNull();
    });

    it('does not select disabled options', () => {
      focus();
      type('blu');

      const options = getOptions();
      options[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      fixture.detectChanges();

      expect(host.lastSelected).toBeNull();
      expect(host.value()).toBe('blu');
    });
  });

  // ── Keyboard navigation ───────────────────────────────────────────────────

  describe('Keyboard navigation', () => {
    it('opens on ArrowDown if closed', () => {
      getInput().dispatchEvent(new FocusEvent('focus'));
      // Close first by blurring via Escape flow
      press('Escape');

      press('ArrowDown');

      expect(getListbox()).toBeTruthy();
    });

    it('moves focus down with ArrowDown', () => {
      focus();
      press('ArrowDown');

      expect(getOptions()[0].classList).toContain('ea-autocomplete__option--focused');
    });

    it('skips disabled options when navigating', () => {
      focus();
      type('b');
      press('ArrowDown');

      // First match is "Banana", next would be "Blueberry" (disabled), then the loop
      // clamps to last valid option.
      press('ArrowDown');

      const focused = getOptions().find(o =>
        o.classList.contains('ea-autocomplete__option--focused'),
      );

      expect(focused?.textContent?.trim()).not.toBe('Blueberry');
    });

    it('selects the focused option on Enter', () => {
      focus();
      press('ArrowDown');
      press('Enter');

      expect(host.value()).toBe('Apple');
      expect(host.lastSelected?.value).toBe('apple');
    });

    it('closes on Escape', () => {
      focus();

      expect(getListbox()).toBeTruthy();

      press('Escape');

      expect(getListbox()).toBeNull();
    });
  });

  // ── Disabled ──────────────────────────────────────────────────────────────

  describe('Disabled', () => {
    it('disables the input', () => {
      host.disabled.set(true);
      fixture.detectChanges();

      expect(getInput().disabled).toBe(true);
    });
  });

  // ── Messages ──────────────────────────────────────────────────────────────

  describe('Messages', () => {
    it('shows the hint when provided', () => {
      host.hint.set('Start typing to search');
      fixture.detectChanges();

      const hint = fixture.nativeElement.querySelector('.ea-autocomplete__message--hint');

      expect(hint.textContent).toContain('Start typing to search');
    });

    it('shows the error and hides the hint', () => {
      host.hint.set('Hint text');
      host.error.set('Required');
      fixture.detectChanges();

      const error = fixture.nativeElement.querySelector(
        '.ea-autocomplete__message--error',
      );
      const hint = fixture.nativeElement.querySelector('.ea-autocomplete__message--hint');

      expect(error.textContent).toContain('Required');
      expect(hint).toBeNull();
    });
  });
});
