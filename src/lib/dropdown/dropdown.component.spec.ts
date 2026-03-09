import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownComponent, DropdownOption } from './dropdown.component';

describe('DropdownComponent', () => {
  let fixture: ComponentFixture<DropdownComponent>;
  let component: DropdownComponent;

  const testOptions: DropdownOption[] = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Beta' },
    { value: 'c', label: 'Gamma', disabled: true },
  ];

  function getTrigger(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.ea-dropdown__trigger');
  }

  function getMenu(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.ea-dropdown__menu');
  }

  function getOptions(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.ea-dropdown__option'));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', testOptions);
    fixture.detectChanges();
  });

  describe('Rendering', () => {
    it('renders a trigger button', () => {
      expect(getTrigger()).toBeTruthy();
    });

    it('shows placeholder when no value is selected', () => {
      expect(getTrigger().textContent).toContain('Select…');
    });

    it('shows the selected label when value is set', () => {
      component.value.set('a');
      fixture.detectChanges();
      expect(getTrigger().textContent).toContain('Alpha');
    });

    it('applies the default size class', () => {
      expect(getTrigger().classList).toContain('ea-dropdown__trigger--md');
    });

    it('does not show the menu by default', () => {
      expect(getMenu()).toBeNull();
    });

    it('renders a label when provided', () => {
      fixture.componentRef.setInput('label', 'Country');
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector('.ea-dropdown-field__label');
      expect(label.textContent.trim()).toBe('Country');
    });
  });

  describe('Opening and closing', () => {
    it('opens the menu on trigger click', () => {
      getTrigger().click();
      fixture.detectChanges();
      expect(getMenu()).toBeTruthy();
      expect(getOptions()).toHaveLength(3);
    });

    it('closes the menu on second trigger click', () => {
      getTrigger().click();
      fixture.detectChanges();
      getTrigger().click();
      fixture.detectChanges();
      expect(getMenu()).toBeNull();
    });

    it('sets aria-expanded when open', () => {
      getTrigger().click();
      fixture.detectChanges();
      expect(getTrigger().getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('Selection', () => {
    it('selects an option on click', () => {
      getTrigger().click();
      fixture.detectChanges();
      getOptions()[1].click();
      fixture.detectChanges();
      expect(component.value()).toBe('b');
      expect(getTrigger().textContent).toContain('Beta');
    });

    it('emits changed event on selection', () => {
      const spy = jest.fn();
      component.changed.subscribe(spy);
      getTrigger().click();
      fixture.detectChanges();
      getOptions()[0].click();
      expect(spy).toHaveBeenCalledWith('a');
    });

    it('closes the menu after selection', () => {
      getTrigger().click();
      fixture.detectChanges();
      getOptions()[0].click();
      fixture.detectChanges();
      expect(getMenu()).toBeNull();
    });

    it('does not select a disabled option', () => {
      getTrigger().click();
      fixture.detectChanges();
      getOptions()[2].click();
      fixture.detectChanges();
      expect(component.value()).toBe('');
    });
  });

  describe('Disabled state', () => {
    it('disables the trigger when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(getTrigger().disabled).toBe(true);
    });

    it('does not open when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      getTrigger().click();
      fixture.detectChanges();
      expect(getMenu()).toBeNull();
    });
  });

  describe('Keyboard navigation', () => {
    it('opens on Enter key', () => {
      getTrigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      fixture.detectChanges();
      expect(getMenu()).toBeTruthy();
    });

    it('opens on ArrowDown key', () => {
      getTrigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      fixture.detectChanges();
      expect(getMenu()).toBeTruthy();
    });

    it('closes on Escape key', () => {
      getTrigger().click();
      fixture.detectChanges();
      getTrigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      fixture.detectChanges();
      expect(getMenu()).toBeNull();
    });
  });

  describe('Error and hint', () => {
    it('shows error message when set', () => {
      fixture.componentRef.setInput('error', 'Required');
      fixture.detectChanges();
      const msg = fixture.nativeElement.querySelector(
        '.ea-dropdown-field__message--error',
      );
      expect(msg.textContent).toContain('Required');
    });

    it('shows hint when set and no error', () => {
      fixture.componentRef.setInput('hint', 'Choose one');
      fixture.detectChanges();
      const msg = fixture.nativeElement.querySelector(
        '.ea-dropdown-field__message--hint',
      );
      expect(msg.textContent).toContain('Choose one');
    });

    it('hides hint when error is set', () => {
      fixture.componentRef.setInput('hint', 'Choose one');
      fixture.componentRef.setInput('error', 'Required');
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('.ea-dropdown-field__message--hint'),
      ).toBeNull();
    });
  });

  describe('CVA', () => {
    it('writes value via writeValue', () => {
      component.writeValue('b');
      fixture.detectChanges();
      expect(component.value()).toBe('b');
    });

    it('calls onChange on selection', () => {
      const onChange = jest.fn();
      component.registerOnChange(onChange);
      getTrigger().click();
      fixture.detectChanges();
      getOptions()[0].click();
      expect(onChange).toHaveBeenCalledWith('a');
    });

    it('disables via setDisabledState', () => {
      component.setDisabledState(true);
      fixture.detectChanges();
      expect(getTrigger().disabled).toBe(true);
    });
  });
});
