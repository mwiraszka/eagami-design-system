import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let fixture: ComponentFixture<InputComponent>;
  let component: InputComponent;

  function getNativeInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input');
  }

  function getWrapper(): HTMLElement {
    return fixture.nativeElement.querySelector('.ea-input-wrapper');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Rendering', () => {
    it('renders an <input> element', () => {
      expect(getNativeInput()).toBeTruthy();
    });

    it('renders no label by default', () => {
      expect(fixture.nativeElement.querySelector('label')).toBeNull();
    });

    it('renders a label when provided', () => {
      fixture.componentRef.setInput('label', 'Email');
      fixture.detectChanges();
      const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
      expect(label.textContent?.trim()).toBe('Email');
    });

    it('associates the label with the input via id', () => {
      fixture.componentRef.setInput('label', 'Email');
      fixture.detectChanges();
      const label: HTMLLabelElement = fixture.nativeElement.querySelector('label');
      const input = getNativeInput();
      expect(label.htmlFor).toBe(input.id);
    });

    it('sets the input type attribute', () => {
      fixture.componentRef.setInput('type', 'email');
      fixture.detectChanges();
      expect(getNativeInput().type).toBe('email');
    });

    it('sets the placeholder', () => {
      fixture.componentRef.setInput('placeholder', 'Enter text…');
      fixture.detectChanges();
      expect(getNativeInput().placeholder).toBe('Enter text…');
    });

    it('applies the default size class on the wrapper', () => {
      expect(getWrapper().classList).toContain('ea-input-wrapper--md');
    });

    it('applies the correct size class when set', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      expect(getWrapper().classList).toContain('ea-input-wrapper--lg');
    });
  });

  describe('Disabled state', () => {
    it('is not disabled by default', () => {
      expect(getNativeInput().disabled).toBe(false);
    });

    it('disables the input when disabled is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(getNativeInput().disabled).toBe(true);
      expect(getWrapper().classList).toContain('ea-input-wrapper--disabled');
    });

    it('disables the input via setDisabledState (CVA)', () => {
      component.setDisabledState(true);
      fixture.detectChanges();
      expect(getNativeInput().disabled).toBe(true);
    });

    it('re-enables the input via setDisabledState', () => {
      component.setDisabledState(true);
      fixture.detectChanges();
      component.setDisabledState(false);
      fixture.detectChanges();
      expect(getNativeInput().disabled).toBe(false);
    });
  });

  describe('ReadOnly / Required', () => {
    it('sets readonly on the native input', () => {
      fixture.componentRef.setInput('readonly', true);
      fixture.detectChanges();
      expect(getNativeInput().readOnly).toBe(true);
      expect(getWrapper().classList).toContain('ea-input-wrapper--readonly');
    });

    it('sets required on the native input', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      expect(getNativeInput().required).toBe(true);
    });

    it('adds the required modifier class to the label', () => {
      fixture.componentRef.setInput('label', 'Name');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('.ea-input-field__label--required'),
      ).toBeTruthy();
    });
  });

  describe('Value binding', () => {
    it('reflects the initial value on the native input', () => {
      component.value.set('hello');
      fixture.detectChanges();
      expect(getNativeInput().value).toBe('hello');
    });

    it('updates the value signal on user input', () => {
      const input = getNativeInput();
      input.value = 'typed';
      input.dispatchEvent(new Event('input'));
      expect(component.value()).toBe('typed');
    });
  });

  describe('CVA', () => {
    it('writes value via writeValue', () => {
      component.writeValue('written');
      expect(component.value()).toBe('written');
    });

    it('calls onChange when user types', () => {
      const onChange = jest.fn();
      component.registerOnChange(onChange);
      const input = getNativeInput();
      input.value = 'new value';
      input.dispatchEvent(new Event('input'));
      expect(onChange).toHaveBeenCalledWith('new value');
    });

    it('calls onTouched on blur', () => {
      const onTouched = jest.fn();
      component.registerOnTouched(onTouched);
      getNativeInput().dispatchEvent(new FocusEvent('blur'));
      expect(onTouched).toHaveBeenCalled();
    });
  });

  describe('Focus state', () => {
    it('adds focused class on focus', () => {
      getNativeInput().dispatchEvent(new FocusEvent('focus'));
      fixture.detectChanges();
      expect(getWrapper().classList).toContain('ea-input-wrapper--focused');
    });

    it('removes focused class on blur', () => {
      getNativeInput().dispatchEvent(new FocusEvent('focus'));
      fixture.detectChanges();
      getNativeInput().dispatchEvent(new FocusEvent('blur'));
      fixture.detectChanges();
      expect(getWrapper().classList).not.toContain('ea-input-wrapper--focused');
    });

    it('emits inputFocused on focus', () => {
      const spy = jest.fn();
      component.inputFocused.subscribe(spy);
      getNativeInput().dispatchEvent(new FocusEvent('focus'));
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('emits inputBlurred on blur', () => {
      const spy = jest.fn();
      component.inputBlurred.subscribe(spy);
      getNativeInput().dispatchEvent(new FocusEvent('blur'));
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Status / error / hint', () => {
    it('shows the error message when errorMsg is set', () => {
      fixture.componentRef.setInput('error', 'Required');
      fixture.detectChanges();
      const msg = fixture.nativeElement.querySelector('.ea-input-field__message--error');
      expect(msg?.textContent).toContain('Required');
    });

    it('sets wrapper to error status when errorMsg is set', () => {
      fixture.componentRef.setInput('error', 'Bad input');
      fixture.detectChanges();
      expect(getWrapper().classList).toContain('ea-input-wrapper--error');
    });

    it('sets aria-invalid on the input when status is error', () => {
      fixture.componentRef.setInput('error', 'Bad input');
      fixture.detectChanges();
      expect(getNativeInput().getAttribute('aria-invalid')).toBe('true');
    });

    it('does not set aria-invalid when there is no error', () => {
      expect(getNativeInput().getAttribute('aria-invalid')).toBeNull();
    });

    it('shows the hint message when hint is set and no error', () => {
      fixture.componentRef.setInput('hint', 'Helpful text');
      fixture.detectChanges();
      const msg = fixture.nativeElement.querySelector('.ea-input-field__message--hint');
      expect(msg?.textContent).toContain('Helpful text');
    });

    it('hides hint when error is also set', () => {
      fixture.componentRef.setInput('hint', 'Helpful text');
      fixture.componentRef.setInput('error', 'Required');
      fixture.detectChanges();
      expect(
        fixture.nativeElement.querySelector('.ea-input-field__message--hint'),
      ).toBeNull();
    });

    it('sets aria-describedby to the error id when error is shown', () => {
      fixture.componentRef.setInput('error', 'Oops');
      fixture.detectChanges();
      const inputEl = getNativeInput();
      const errorEl = fixture.nativeElement.querySelector('[role="alert"]');
      expect(inputEl.getAttribute('aria-describedby')).toBe(errorEl.id);
    });

    it('sets aria-describedby to the hint id when hint is shown', () => {
      fixture.componentRef.setInput('hint', 'Hint text');
      fixture.detectChanges();
      const inputEl = getNativeInput();
      const hintEl = fixture.nativeElement.querySelector(
        '.ea-input-field__message--hint',
      );
      expect(inputEl.getAttribute('aria-describedby')).toBe(hintEl.id);
    });

    it('applies success status class on wrapper', () => {
      fixture.componentRef.setInput('status', 'success');
      fixture.detectChanges();
      expect(getWrapper().classList).toContain('ea-input-wrapper--success');
    });
  });

  describe('Reactive forms integration', () => {
    it('works with a FormControl and Validators.required', () => {
      const hostFixture = TestBed.createComponent(InputComponent);
      const hostComponent = hostFixture.componentInstance;
      const control = new FormControl('', Validators.required);

      control.registerOnChange(() => {});
      hostComponent.registerOnChange(v => control.setValue(v));
      hostComponent.registerOnTouched(() => control.markAsTouched());

      hostFixture.detectChanges();

      const input: HTMLInputElement = hostFixture.nativeElement.querySelector('input');
      input.value = 'hello';
      input.dispatchEvent(new Event('input'));

      expect(control.value).toBe('hello');
      expect(control.valid).toBe(true);
    });

    it('disables via FormControl.disable()', () => {
      const control = new FormControl('');
      control.registerOnDisabledChange(isDisabled =>
        component.setDisabledState(isDisabled),
      );
      control.disable();
      fixture.detectChanges();
      expect(getNativeInput().disabled).toBe(true);
    });
  });

  describe('Programmatic focus', () => {
    it('exposes a focus() method that focuses the native input', () => {
      const spy = jest.spyOn(getNativeInput(), 'focus');
      component.focus();
      expect(spy).toHaveBeenCalled();
    });
  });
});
