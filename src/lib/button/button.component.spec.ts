import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  let fixture: ComponentFixture<ButtonComponent>;
  let component: ButtonComponent;

  function getButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Rendering', () => {
    it('renders a <button> element', () => {
      expect(getButton()).toBeTruthy();
    });

    it('applies the default variant class', () => {
      expect(getButton().classList).toContain('ea-button--primary');
    });

    it('applies the default size class', () => {
      expect(getButton().classList).toContain('ea-button--md');
    });

    it('applies the correct variant class when set', () => {
      fixture.componentRef.setInput('variant', 'danger');
      fixture.detectChanges();
      expect(getButton().classList).toContain('ea-button--danger');
    });

    it('applies the correct size class when set', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      expect(getButton().classList).toContain('ea-button--lg');
    });

    it('sets the native button type attribute', () => {
      fixture.componentRef.setInput('type', 'submit');
      fixture.detectChanges();
      expect(getButton().type).toBe('submit');
    });

    it('sets aria-label when provided', () => {
      fixture.componentRef.setInput('aria-label', 'Close dialog');
      fixture.detectChanges();
      expect(getButton().getAttribute('aria-label')).toBe('Close dialog');
    });
  });

  describe('Disabled state', () => {
    it('is not disabled by default', () => {
      expect(getButton().disabled).toBe(false);
    });

    it('disables the button when disabled input is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(getButton().disabled).toBe(true);
      expect(getButton().classList).toContain('ea-button--disabled');
    });

    it('disables the button when loading is true', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      expect(getButton().disabled).toBe(true);
      expect(getButton().classList).toContain('ea-button--disabled');
    });

    it('sets aria-busy when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      expect(getButton().getAttribute('aria-busy')).toBe('true');
    });

    it('does not set aria-busy when not loading', () => {
      expect(getButton().getAttribute('aria-busy')).toBeNull();
    });

    it('shows the spinner when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.ea-button__spinner'))).toBeTruthy();
    });

    it('hides the spinner when not loading', () => {
      expect(fixture.debugElement.query(By.css('.ea-button__spinner'))).toBeNull();
    });

    it('applies full-width class when fullWidth is true', () => {
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();
      expect(getButton().classList).toContain('ea-button--full-width');
    });
  });

  describe('Click handling', () => {
    it('emits clicked on click', () => {
      const spy = jest.fn();
      component.clicked.subscribe(spy);
      getButton().click();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('does not emit clicked when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const spy = jest.fn();
      component.clicked.subscribe(spy);
      getButton().click();
      expect(spy).not.toHaveBeenCalled();
    });

    it('does not emit clicked when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      const spy = jest.fn();
      component.clicked.subscribe(spy);
      getButton().click();
      expect(spy).not.toHaveBeenCalled();
    });

    it('calls preventDefault when clicked while disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const event = new MouseEvent('click');
      const preventSpy = jest.spyOn(event, 'preventDefault');
      component.handleClick(event);
      expect(preventSpy).toHaveBeenCalled();
    });
  });
});
