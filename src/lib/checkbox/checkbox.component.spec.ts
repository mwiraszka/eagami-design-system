import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
  let fixture: ComponentFixture<CheckboxComponent>;
  let component: CheckboxComponent;

  function getNativeInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input[type="checkbox"]');
  }

  function getLabel(): HTMLLabelElement {
    return fixture.nativeElement.querySelector('label');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Rendering', () => {
    it('renders a checkbox input', () => {
      expect(getNativeInput()).toBeTruthy();
    });

    it('applies the default size class', () => {
      expect(getLabel().classList).toContain('ea-checkbox--md');
    });

    it('applies the correct size class when set', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      expect(getLabel().classList).toContain('ea-checkbox--lg');
    });

    it('renders no label text by default', () => {
      expect(fixture.nativeElement.querySelector('.ea-checkbox__label')).toBeNull();
    });

    it('renders label text when provided', () => {
      fixture.componentRef.setInput('label', 'Accept terms');
      fixture.detectChanges();
      const labelSpan = fixture.nativeElement.querySelector('.ea-checkbox__label');
      expect(labelSpan.textContent.trim()).toBe('Accept terms');
    });
  });

  describe('Checked state', () => {
    it('is unchecked by default', () => {
      expect(getNativeInput().checked).toBe(false);
    });

    it('reflects the checked model', () => {
      component.checked.set(true);
      fixture.detectChanges();
      expect(getNativeInput().checked).toBe(true);
      expect(getLabel().classList).toContain('ea-checkbox--checked');
    });

    it('toggles checked on change', () => {
      getNativeInput().click();
      fixture.detectChanges();
      expect(component.checked()).toBe(true);
    });

    it('emits changed event', () => {
      const spy = jest.fn();
      component.changed.subscribe(spy);
      getNativeInput().click();
      expect(spy).toHaveBeenCalledWith(true);
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
      expect(getLabel().classList).toContain('ea-checkbox--disabled');
    });
  });

  describe('Indeterminate state', () => {
    it('sets indeterminate on native input', () => {
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();
      expect(getNativeInput().indeterminate).toBe(true);
    });

    it('sets aria-checked to mixed when indeterminate', () => {
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();
      expect(getNativeInput().getAttribute('aria-checked')).toBe('mixed');
    });
  });

  describe('CVA', () => {
    it('writes value via writeValue', () => {
      component.writeValue(true);
      expect(component.checked()).toBe(true);
    });

    it('calls onChange when toggled', () => {
      const onChange = jest.fn();
      component.registerOnChange(onChange);
      getNativeInput().click();
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('calls onTouched when toggled', () => {
      const onTouched = jest.fn();
      component.registerOnTouched(onTouched);
      getNativeInput().click();
      expect(onTouched).toHaveBeenCalled();
    });

    it('disables via setDisabledState', () => {
      component.setDisabledState(true);
      fixture.detectChanges();
      expect(getNativeInput().disabled).toBe(true);
    });
  });

  describe('Required', () => {
    it('sets required on the native input', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      expect(getNativeInput().required).toBe(true);
    });
  });
});
