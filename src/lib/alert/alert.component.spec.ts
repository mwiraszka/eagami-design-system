import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  let fixture: ComponentFixture<AlertComponent>;
  let component: AlertComponent;

  function getAlert(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.ea-alert');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Rendering', () => {
    it('renders the alert element', () => {
      expect(getAlert()).toBeTruthy();
    });

    it('applies the default variant class', () => {
      expect(getAlert()!.classList).toContain('ea-alert--default');
    });

    it('applies the correct variant class when set', () => {
      fixture.componentRef.setInput('variant', 'error');
      fixture.detectChanges();
      expect(getAlert()!.classList).toContain('ea-alert--error');
    });

    it('has role="alert"', () => {
      expect(getAlert()!.getAttribute('role')).toBe('alert');
    });

    it('renders an icon', () => {
      expect(fixture.nativeElement.querySelector('.ea-alert__icon')).toBeTruthy();
    });
  });

  describe('Variants', () => {
    const variants = ['default', 'success', 'warning', 'error', 'info'] as const;

    variants.forEach(variant => {
      it(`renders with ${variant} variant`, () => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();
        expect(getAlert()!.classList).toContain(`ea-alert--${variant}`);
      });
    });
  });

  describe('Dismissible', () => {
    it('does not show close button by default', () => {
      expect(fixture.nativeElement.querySelector('.ea-alert__close')).toBeNull();
    });

    it('shows close button when dismissible is true', () => {
      fixture.componentRef.setInput('dismissible', true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.ea-alert__close')).toBeTruthy();
    });

    it('hides the alert when close button is clicked', () => {
      fixture.componentRef.setInput('dismissible', true);
      fixture.detectChanges();
      fixture.nativeElement.querySelector('.ea-alert__close').click();
      fixture.detectChanges();
      expect(getAlert()).toBeNull();
    });

    it('emits dismissed when close button is clicked', () => {
      const spy = jest.fn();
      component.dismissed.subscribe(spy);
      fixture.componentRef.setInput('dismissible', true);
      fixture.detectChanges();
      fixture.nativeElement.querySelector('.ea-alert__close').click();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('updates visible model when dismissed', () => {
      fixture.componentRef.setInput('dismissible', true);
      fixture.detectChanges();
      fixture.nativeElement.querySelector('.ea-alert__close').click();
      expect(component.visible()).toBe(false);
    });
  });

  describe('Visibility', () => {
    it('is visible by default', () => {
      expect(getAlert()).toBeTruthy();
    });

    it('hides when visible is set to false', () => {
      component.visible.set(false);
      fixture.detectChanges();
      expect(getAlert()).toBeNull();
    });
  });
});
