import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerComponent } from './date-picker.component';

describe('DatePickerComponent', () => {
  let fixture: ComponentFixture<DatePickerComponent>;
  let component: DatePickerComponent;

  function getTrigger(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.ea-date-picker__trigger');
  }

  function getPopover(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.ea-date-picker__popover');
  }

  function getDayCells(): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.ea-date-picker__day'));
  }

  function findDayCell(dayNumber: number, currentMonth = true): HTMLButtonElement {
    return getDayCells().find(
      el =>
        el.textContent!.trim() === String(dayNumber) &&
        (currentMonth
          ? !el.classList.contains('ea-date-picker__day--outside')
          : el.classList.contains('ea-date-picker__day--outside')),
    )!;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Rendering', () => {
    it('renders a trigger button', () => {
      expect(getTrigger()).toBeTruthy();
    });

    it('shows placeholder when no value is selected', () => {
      expect(getTrigger().textContent).toContain('Select date…');
    });

    it('renders a label when provided', () => {
      fixture.componentRef.setInput('label', 'Birth date');
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector('.ea-date-picker-field__label');
      expect(label.textContent.trim()).toBe('Birth date');
    });

    it('does not show the popover by default', () => {
      expect(getPopover()).toBeNull();
    });

    it('applies the default size class', () => {
      expect(getTrigger().classList).toContain('ea-date-picker__trigger--md');
    });
  });

  describe('Opening and closing', () => {
    it('opens the popover on trigger click', () => {
      getTrigger().click();
      fixture.detectChanges();

      expect(getPopover()).toBeTruthy();
    });

    it('renders a 6-week grid when open', () => {
      getTrigger().click();
      fixture.detectChanges();

      expect(getDayCells()).toHaveLength(42);
    });

    it('closes the popover on second trigger click', () => {
      getTrigger().click();
      fixture.detectChanges();

      getTrigger().click();
      fixture.detectChanges();

      expect(getPopover()).toBeNull();
    });

    it('sets aria-expanded when open', () => {
      getTrigger().click();
      fixture.detectChanges();

      expect(getTrigger().getAttribute('aria-expanded')).toBe('true');
    });

    it('renders weekday headers when open', () => {
      getTrigger().click();
      fixture.detectChanges();

      const weekdays = fixture.nativeElement.querySelectorAll('.ea-date-picker__weekday');
      expect(weekdays).toHaveLength(7);
    });
  });

  describe('Selection', () => {
    it('selects a day on click', () => {
      component.viewYear.set(2026);
      component.viewMonth.set(3);
      getTrigger().click();
      fixture.detectChanges();

      findDayCell(15).click();
      fixture.detectChanges();

      const val = component.value();
      expect(val).not.toBeNull();
      expect(val!.getFullYear()).toBe(2026);
      expect(val!.getMonth()).toBe(3);
      expect(val!.getDate()).toBe(15);
    });

    it('emits changed on selection', () => {
      component.viewYear.set(2026);
      component.viewMonth.set(3);
      const spy = jest.fn();
      component.changed.subscribe(spy);
      getTrigger().click();
      fixture.detectChanges();

      findDayCell(10).click();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy.mock.calls[0][0].getDate()).toBe(10);
    });

    it('closes the popover after selection', () => {
      getTrigger().click();
      fixture.detectChanges();

      findDayCell(15).click();
      fixture.detectChanges();

      expect(getPopover()).toBeNull();
    });

    it('displays the formatted value after selection', () => {
      component.viewYear.set(2026);
      component.viewMonth.set(3);
      getTrigger().click();
      fixture.detectChanges();

      findDayCell(15).click();
      fixture.detectChanges();

      expect(getTrigger().textContent).not.toContain('Select date…');
    });

    it('clears value via the clear button', () => {
      component.writeValue(new Date(2026, 3, 15));
      fixture.detectChanges();

      const clearBtn = fixture.nativeElement.querySelector(
        '.ea-date-picker__clear',
      ) as HTMLButtonElement;
      clearBtn.click();
      fixture.detectChanges();

      expect(component.value()).toBeNull();
    });
  });

  describe('Navigation', () => {
    it('navigates to the previous month', () => {
      component.viewYear.set(2026);
      component.viewMonth.set(3);
      getTrigger().click();
      fixture.detectChanges();

      component.goToPrevMonth();

      expect(component.viewMonth()).toBe(2);
      expect(component.viewYear()).toBe(2026);
    });

    it('wraps to previous year at January', () => {
      component.viewYear.set(2026);
      component.viewMonth.set(0);

      component.goToPrevMonth();

      expect(component.viewMonth()).toBe(11);
      expect(component.viewYear()).toBe(2025);
    });

    it('wraps to next year at December', () => {
      component.viewYear.set(2026);
      component.viewMonth.set(11);

      component.goToNextMonth();

      expect(component.viewMonth()).toBe(0);
      expect(component.viewYear()).toBe(2027);
    });

    it('navigates to today', () => {
      component.viewYear.set(2020);
      component.viewMonth.set(0);

      component.goToToday();

      const now = new Date();
      expect(component.viewYear()).toBe(now.getFullYear());
      expect(component.viewMonth()).toBe(now.getMonth());
    });
  });

  describe('Min and max dates', () => {
    it('marks days before minDate as disabled', () => {
      fixture.componentRef.setInput('minDate', new Date(2026, 3, 10));
      component.viewYear.set(2026);
      component.viewMonth.set(3);
      getTrigger().click();
      fixture.detectChanges();

      expect(findDayCell(5).disabled).toBe(true);
      expect(findDayCell(15).disabled).toBe(false);
    });

    it('marks days after maxDate as disabled', () => {
      fixture.componentRef.setInput('maxDate', new Date(2026, 3, 10));
      component.viewYear.set(2026);
      component.viewMonth.set(3);
      getTrigger().click();
      fixture.detectChanges();

      expect(findDayCell(5).disabled).toBe(false);
      expect(findDayCell(20).disabled).toBe(true);
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

      expect(getPopover()).toBeNull();
    });
  });

  describe('Keyboard navigation', () => {
    it('opens on Enter key', () => {
      getTrigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      fixture.detectChanges();

      expect(getPopover()).toBeTruthy();
    });

    it('opens on ArrowDown key', () => {
      getTrigger().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      fixture.detectChanges();

      expect(getPopover()).toBeTruthy();
    });

    it('closes on Escape key', () => {
      getTrigger().click();
      fixture.detectChanges();

      const popover = getPopover()!;
      popover.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
      );
      fixture.detectChanges();

      expect(getPopover()).toBeNull();
    });
  });

  describe('Error and hint', () => {
    it('shows error message when set', () => {
      fixture.componentRef.setInput('error', 'Invalid date');
      fixture.detectChanges();

      const msg = fixture.nativeElement.querySelector(
        '.ea-date-picker-field__message--error',
      );
      expect(msg.textContent).toContain('Invalid date');
    });

    it('shows hint when set and no error', () => {
      fixture.componentRef.setInput('hint', 'Pick a future date');
      fixture.detectChanges();

      const msg = fixture.nativeElement.querySelector(
        '.ea-date-picker-field__message--hint',
      );
      expect(msg.textContent).toContain('Pick a future date');
    });

    it('hides hint when error is set', () => {
      fixture.componentRef.setInput('hint', 'Pick a future date');
      fixture.componentRef.setInput('error', 'Invalid date');
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('.ea-date-picker-field__message--hint'),
      ).toBeNull();
    });
  });

  describe('CVA', () => {
    it('writes a Date via writeValue', () => {
      component.writeValue(new Date(2026, 5, 20));
      fixture.detectChanges();

      expect(component.value()!.getDate()).toBe(20);
      expect(component.viewMonth()).toBe(5);
      expect(component.viewYear()).toBe(2026);
    });

    it('writes an ISO string via writeValue', () => {
      component.writeValue('2026-06-20');

      expect(component.value()).not.toBeNull();
      expect(component.value()!.getFullYear()).toBe(2026);
    });

    it('writes null via writeValue', () => {
      component.writeValue(new Date(2026, 5, 20));
      component.writeValue(null);

      expect(component.value()).toBeNull();
    });

    it('calls onChange on selection', () => {
      const onChange: jest.Mock<void, [Date | null]> = jest.fn();
      component.registerOnChange(onChange);
      component.viewYear.set(2026);
      component.viewMonth.set(3);
      getTrigger().click();
      fixture.detectChanges();

      findDayCell(15).click();

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0]!.getDate()).toBe(15);
    });

    it('disables via setDisabledState', () => {
      component.setDisabledState(true);
      fixture.detectChanges();

      expect(getTrigger().disabled).toBe(true);
    });
  });
});
