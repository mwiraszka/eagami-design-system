import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBarComponent } from './progress-bar.component';

describe('ProgressBarComponent', () => {
  let fixture: ComponentFixture<ProgressBarComponent>;

  function getBar(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.ea-progress-bar');
  }

  function getTrack(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.ea-progress-bar__track');
  }

  function getFill(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.ea-progress-bar__fill');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressBarComponent);
    fixture.detectChanges();
  });

  describe('Rendering', () => {
    it('renders the progress bar element', () => {
      expect(getBar()).toBeTruthy();
    });

    it('applies the default variant class', () => {
      expect(getBar()!.classList).toContain('ea-progress-bar--default');
    });

    it('applies the correct variant class when set', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();

      expect(getBar()!.classList).toContain('ea-progress-bar--success');
    });

    it('applies the default size class', () => {
      expect(getBar()!.classList).toContain('ea-progress-bar--md');
    });

    it('applies the correct size class when set', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();

      expect(getBar()!.classList).toContain('ea-progress-bar--lg');
    });
  });

  describe('Variants', () => {
    const variants = ['default', 'success', 'warning', 'error', 'info'] as const;

    variants.forEach(variant => {
      it(`renders with ${variant} variant`, () => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();

        expect(getBar()!.classList).toContain(`ea-progress-bar--${variant}`);
      });
    });
  });

  describe('ARIA', () => {
    it('has role="progressbar" on the track', () => {
      expect(getTrack()!.getAttribute('role')).toBe('progressbar');
    });

    it('sets aria-valuemin to 0', () => {
      expect(getTrack()!.getAttribute('aria-valuemin')).toBe('0');
    });

    it('sets aria-valuemax to 100', () => {
      expect(getTrack()!.getAttribute('aria-valuemax')).toBe('100');
    });

    it('sets aria-valuenow to the rounded percentage', () => {
      fixture.componentRef.setInput('value', 50);
      fixture.detectChanges();

      expect(getTrack()!.getAttribute('aria-valuenow')).toBe('50');
    });

    it('uses label as aria-label when provided', () => {
      fixture.componentRef.setInput('label', 'Upload progress');
      fixture.detectChanges();

      expect(getTrack()!.getAttribute('aria-label')).toBe('Upload progress');
    });

    it('falls back to "Progress" as aria-label when no label is provided', () => {
      expect(getTrack()!.getAttribute('aria-label')).toBe('Progress');
    });
  });

  describe('Fill width', () => {
    it('sets fill width to 0% when value is 0', () => {
      expect(getFill()!.style.width).toBe('0%');
    });

    it('sets fill width to 100% when value equals max', () => {
      fixture.componentRef.setInput('value', 100);
      fixture.detectChanges();

      expect(getFill()!.style.width).toBe('100%');
    });

    it('sets fill width to 50% when value is half of max', () => {
      fixture.componentRef.setInput('value', 50);
      fixture.detectChanges();

      expect(getFill()!.style.width).toBe('50%');
    });

    it('clamps fill width to 0% for negative values', () => {
      fixture.componentRef.setInput('value', -10);
      fixture.detectChanges();

      expect(getFill()!.style.width).toBe('0%');
    });

    it('clamps fill width to 100% for values exceeding max', () => {
      fixture.componentRef.setInput('value', 200);
      fixture.detectChanges();

      expect(getFill()!.style.width).toBe('100%');
    });

    it('calculates percentage correctly for non-100 max', () => {
      fixture.componentRef.setInput('value', 1);
      fixture.componentRef.setInput('max', 4);
      fixture.detectChanges();

      expect(getFill()!.style.width).toBe('25%');
    });
  });

  describe('Header', () => {
    it('does not show header by default', () => {
      expect(fixture.nativeElement.querySelector('.ea-progress-bar__header')).toBeNull();
    });

    it('shows header when label is provided', () => {
      fixture.componentRef.setInput('label', 'Uploading');
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('.ea-progress-bar__header'),
      ).toBeTruthy();
    });

    it('shows header when showValue is true', () => {
      fixture.componentRef.setInput('showValue', true);
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('.ea-progress-bar__header'),
      ).toBeTruthy();
    });

    it('shows label text when label is provided', () => {
      fixture.componentRef.setInput('label', 'Uploading');
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector('.ea-progress-bar__label');
      expect(label?.textContent?.trim()).toBe('Uploading');
    });

    it('shows rounded percentage when showValue is true', () => {
      fixture.componentRef.setInput('showValue', true);
      fixture.componentRef.setInput('value', 66);
      fixture.detectChanges();

      const valueEl = fixture.nativeElement.querySelector('.ea-progress-bar__value');
      expect(valueEl?.textContent?.trim()).toBe('66%');
    });

    it('does not show percentage when indeterminate is true', () => {
      fixture.componentRef.setInput('showValue', true);
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.ea-progress-bar__value')).toBeNull();
    });
  });

  describe('Indeterminate', () => {
    it('applies indeterminate class', () => {
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();

      expect(getBar()!.classList).toContain('ea-progress-bar--indeterminate');
    });

    it('sets aria-valuenow to null when indeterminate', () => {
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();

      expect(getTrack()!.getAttribute('aria-valuenow')).toBeNull();
    });

    it('does not set fill width inline when indeterminate', () => {
      fixture.componentRef.setInput('indeterminate', true);
      fixture.componentRef.setInput('value', 50);
      fixture.detectChanges();

      expect(getFill()!.style.width).toBe('');
    });
  });
});
