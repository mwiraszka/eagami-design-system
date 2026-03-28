import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { CodeInputComponent } from './code-input.component';

describe('CodeInputComponent', () => {
  let fixture: ComponentFixture<CodeInputComponent>;
  let component: CodeInputComponent;

  function getDigitInputs(): HTMLInputElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('.ea-code-input'));
  }

  function getGroup(): HTMLElement {
    return fixture.nativeElement.querySelector('.ea-code-input-group');
  }

  function typeDigit(input: HTMLInputElement, digit: string): void {
    input.value = digit;
    input.dispatchEvent(new Event('input'));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeInputComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CodeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Rendering', () => {
    it('renders 6 digit inputs by default', () => {
      expect(getDigitInputs().length).toBe(6);
    });

    it('renders custom number of digit inputs', () => {
      fixture.componentRef.setInput('length', 4);
      fixture.detectChanges();
      expect(getDigitInputs().length).toBe(4);
    });

    it('renders no label by default', () => {
      expect(fixture.nativeElement.querySelector('label')).toBeNull();
    });

    it('renders a label when provided', () => {
      fixture.componentRef.setInput('label', 'Verification code');
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector('label');
      expect(label.textContent?.trim()).toBe('Verification code');
    });

    it('applies the default size class', () => {
      expect(getGroup().classList).toContain('ea-code-input-group--md');
    });

    it('applies the correct size class when set', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      expect(getGroup().classList).toContain('ea-code-input-group--lg');
    });

    it('sets inputmode to numeric on all inputs', () => {
      const inputs = getDigitInputs();
      inputs.forEach(input => {
        expect(input.getAttribute('inputmode')).toBe('numeric');
      });
    });

    it('sets autocomplete to one-time-code', () => {
      const inputs = getDigitInputs();
      inputs.forEach(input => {
        expect(input.getAttribute('autocomplete')).toBe('one-time-code');
      });
    });

    it('sets aria-label on each input', () => {
      const inputs = getDigitInputs();
      expect(inputs[0].getAttribute('aria-label')).toBe('Digit 1 of 6');
      expect(inputs[5].getAttribute('aria-label')).toBe('Digit 6 of 6');
    });
  });

  describe('Disabled state', () => {
    it('is not disabled by default', () => {
      getDigitInputs().forEach(input => {
        expect(input.disabled).toBe(false);
      });
    });

    it('disables all inputs when disabled is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      getDigitInputs().forEach(input => {
        expect(input.disabled).toBe(true);
      });
      expect(getGroup().classList).toContain('ea-code-input-group--disabled');
    });

    it('disables via setDisabledState (CVA)', () => {
      component.setDisabledState(true);
      fixture.detectChanges();
      getDigitInputs().forEach(input => {
        expect(input.disabled).toBe(true);
      });
    });
  });

  describe('Value binding', () => {
    it('reflects the value across digit inputs', () => {
      component.value.set('123456');
      fixture.detectChanges();
      const inputs = getDigitInputs();
      expect(inputs[0].value).toBe('1');
      expect(inputs[1].value).toBe('2');
      expect(inputs[5].value).toBe('6');
    });

    it('updates value when user types a digit', () => {
      const inputs = getDigitInputs();
      typeDigit(inputs[0], '7');
      expect(component.value()).toBe('7');
    });

    it('rejects non-numeric characters', () => {
      const inputs = getDigitInputs();
      inputs[0].value = 'a';
      inputs[0].dispatchEvent(new Event('input'));
      expect(component.value()).toBe('');
    });

    it('auto-advances focus to next input after typing', () => {
      const inputs = getDigitInputs();
      const focusSpy = jest.spyOn(inputs[1], 'focus');
      typeDigit(inputs[0], '1');
      expect(focusSpy).toHaveBeenCalled();
    });
  });

  describe('Backspace handling', () => {
    it('clears the current digit on backspace', () => {
      component.value.set('123');
      fixture.detectChanges();
      const inputs = getDigitInputs();
      inputs[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
      expect(component.value()).toBe('12');
    });

    it('moves focus to previous input when current is empty', () => {
      component.value.set('12');
      fixture.detectChanges();
      const inputs = getDigitInputs();
      const focusSpy = jest.spyOn(inputs[1], 'focus');
      inputs[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
      expect(focusSpy).toHaveBeenCalled();
    });
  });

  describe('Arrow key navigation', () => {
    it('moves focus left on ArrowLeft', () => {
      const inputs = getDigitInputs();
      const focusSpy = jest.spyOn(inputs[0], 'focus');
      inputs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      expect(focusSpy).toHaveBeenCalled();
    });

    it('moves focus right on ArrowRight', () => {
      const inputs = getDigitInputs();
      const focusSpy = jest.spyOn(inputs[2], 'focus');
      inputs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(focusSpy).toHaveBeenCalled();
    });

    it('does not move left past the first input', () => {
      const inputs = getDigitInputs();
      const focusSpy = jest.spyOn(inputs[0], 'focus');
      inputs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      expect(focusSpy).not.toHaveBeenCalled();
    });
  });

  describe('Paste handling', () => {
    function createPasteEvent(text: string): Event {
      const clipboardData = { getData: () => text };
      const event = new Event('paste', { bubbles: true, cancelable: true });
      (event as unknown as Record<string, unknown>)['clipboardData'] = clipboardData;
      return event;
    }

    it('fills all digits from pasted text', () => {
      const inputs = getDigitInputs();
      inputs[0].dispatchEvent(createPasteEvent('123456'));
      expect(component.value()).toBe('123456');
    });

    it('strips non-numeric characters from pasted text', () => {
      const inputs = getDigitInputs();
      inputs[0].dispatchEvent(createPasteEvent('12-34-56'));
      expect(component.value()).toBe('123456');
    });

    it('truncates pasted text to the code length', () => {
      const inputs = getDigitInputs();
      inputs[0].dispatchEvent(createPasteEvent('12345678'));
      expect(component.value()).toBe('123456');
    });

    it('emits completed when paste fills all digits', () => {
      const spy = jest.fn();
      component.completed.subscribe(spy);
      const inputs = getDigitInputs();
      inputs[0].dispatchEvent(createPasteEvent('123456'));
      expect(spy).toHaveBeenCalledWith('123456');
    });
  });

  describe('Completed output', () => {
    it('emits completed when the last digit is entered', () => {
      const spy = jest.fn();
      component.completed.subscribe(spy);
      component.value.set('12345');
      fixture.detectChanges();
      const inputs = getDigitInputs();
      typeDigit(inputs[5], '6');
      expect(spy).toHaveBeenCalledWith('123456');
    });

    it('does not emit completed for partial input', () => {
      const spy = jest.fn();
      component.completed.subscribe(spy);
      const inputs = getDigitInputs();
      typeDigit(inputs[0], '1');
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('CVA', () => {
    it('writes value via writeValue', () => {
      component.writeValue('654321');
      expect(component.value()).toBe('654321');
    });

    it('calls onChange when user types', () => {
      const onChange = jest.fn();
      component.registerOnChange(onChange);
      const inputs = getDigitInputs();
      typeDigit(inputs[0], '9');
      expect(onChange).toHaveBeenCalledWith('9');
    });

    it('calls onTouched on blur', () => {
      const onTouched = jest.fn();
      component.registerOnTouched(onTouched);
      getDigitInputs()[0].dispatchEvent(new FocusEvent('blur'));
      expect(onTouched).toHaveBeenCalled();
    });
  });

  describe('Status / error / hint', () => {
    it('shows the error message when errorMsg is set', () => {
      fixture.componentRef.setInput('error', 'Invalid code');
      fixture.detectChanges();
      const msg = fixture.nativeElement.querySelector(
        '.ea-code-input-field__message--error',
      );
      expect(msg?.textContent).toContain('Invalid code');
    });

    it('applies error status class on group', () => {
      fixture.componentRef.setInput('error', 'Invalid code');
      fixture.detectChanges();
      expect(getGroup().classList).toContain('ea-code-input-group--error');
    });

    it('shows the hint message when hint is set and no error', () => {
      fixture.componentRef.setInput('hint', 'Check your email');
      fixture.detectChanges();
      const msg = fixture.nativeElement.querySelector(
        '.ea-code-input-field__message--hint',
      );
      expect(msg?.textContent).toContain('Check your email');
    });

    it('hides hint when error is also set', () => {
      fixture.componentRef.setInput('hint', 'Check your email');
      fixture.componentRef.setInput('error', 'Invalid code');
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('.ea-code-input-field__message--hint'),
      ).toBeNull();
    });

    it('applies success status class on group', () => {
      fixture.componentRef.setInput('status', 'success');
      fixture.detectChanges();
      expect(getGroup().classList).toContain('ea-code-input-group--success');
    });
  });

  describe('Programmatic focus', () => {
    it('exposes a focus() method that focuses the first empty digit', () => {
      component.value.set('12');
      fixture.detectChanges();
      const inputs = getDigitInputs();
      const focusSpy = jest.spyOn(inputs[2], 'focus');
      component.focus();
      expect(focusSpy).toHaveBeenCalled();
    });
  });
});
