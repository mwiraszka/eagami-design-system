import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EagamiWordmarkComponent } from './eagami-wordmark.component';

describe('EagamiWordmarkComponent', () => {
  let fixture: ComponentFixture<EagamiWordmarkComponent>;
  let component: EagamiWordmarkComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EagamiWordmarkComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EagamiWordmarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function getAnchor(): HTMLAnchorElement {
    return fixture.nativeElement.querySelector('a.ea-eagami-wordmark');
  }

  function getLogo(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.ea-eagami-wordmark__logo');
  }

  function getBrand(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.ea-eagami-wordmark__brand');
  }

  function getOverline(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.ea-eagami-wordmark__overline');
  }

  function getTagline(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.ea-eagami-wordmark__tagline');
  }

  // ── Rendering ────────────────────────────────────────────────────────────────

  describe('Rendering', () => {
    it('creates the component', () => {
      expect(component).toBeTruthy();
    });

    it('renders an anchor linking to eagami.com', () => {
      const anchor = getAnchor();

      expect(anchor).toBeTruthy();
      expect(anchor.getAttribute('href')).toBe('https://eagami.com');
      expect(anchor.getAttribute('target')).toBe('_blank');
      expect(anchor.getAttribute('rel')).toBe('noopener');
    });

    it('renders the logo icon', () => {
      expect(getLogo()).toBeTruthy();
    });
  });

  // ── Variant ──────────────────────────────────────────────────────────────────

  describe('Variant', () => {
    it('renders "eagami" by default (variant 1)', () => {
      expect(getBrand()?.textContent?.trim()).toBe('eagami');
      expect(getOverline()).toBeNull();
      expect(getTagline()).toBeNull();
    });

    it('renders overline and brand for variant 2', () => {
      fixture.componentRef.setInput('variant', 2);
      fixture.detectChanges();

      expect(getOverline()?.textContent?.trim()).toBe('handcrafted by');
      expect(getBrand()?.textContent?.trim()).toBe('eagami');
      expect(getTagline()).toBeNull();
    });

    it('renders brand only for variant 3', () => {
      fixture.componentRef.setInput('variant', 3);
      fixture.detectChanges();

      expect(getBrand()?.textContent?.trim()).toBe('eagami design system');
      expect(getOverline()).toBeNull();
      expect(getTagline()).toBeNull();
    });

    it('renders brand and tagline for variant 4', () => {
      fixture.componentRef.setInput('variant', 4);
      fixture.detectChanges();

      expect(getBrand()?.textContent?.trim()).toBe('eagami design system');
      expect(getTagline()?.textContent?.trim()).toBe('elegant web design');
      expect(getOverline()).toBeNull();
    });

    it('sets aria-label to "eagami" for variant 1', () => {
      expect(getAnchor().getAttribute('aria-label')).toBe('eagami');
    });

    it('sets aria-label to "handcrafted by eagami" for variant 2', () => {
      fixture.componentRef.setInput('variant', 2);
      fixture.detectChanges();

      expect(getAnchor().getAttribute('aria-label')).toBe('handcrafted by eagami');
    });

    it('sets aria-label to "eagami design system" for variant 3', () => {
      fixture.componentRef.setInput('variant', 3);
      fixture.detectChanges();

      expect(getAnchor().getAttribute('aria-label')).toBe('eagami design system');
    });

    it('sets aria-label to the full text for variant 4', () => {
      fixture.componentRef.setInput('variant', 4);
      fixture.detectChanges();

      expect(getAnchor().getAttribute('aria-label')).toBe(
        'eagami design system \u2014 elegant web design',
      );
    });
  });

  // ── Size ─────────────────────────────────────────────────────────────────────

  describe('Size', () => {
    it('sets --_size to 32 by default', () => {
      expect(fixture.nativeElement.style.getPropertyValue('--_size')).toBe('32');
    });

    it('sets --_size to the provided value', () => {
      fixture.componentRef.setInput('size', 48);
      fixture.detectChanges();

      expect(fixture.nativeElement.style.getPropertyValue('--_size')).toBe('48');
    });
  });

  // ── Layout ──────────────────────────────────────────────────────────────────

  describe('Layout', () => {
    it('does not apply the inline modifier by default', () => {
      expect(getAnchor().classList.contains('ea-eagami-wordmark--inline')).toBe(false);
    });

    it('applies the inline modifier when layout is "inline"', () => {
      fixture.componentRef.setInput('layout', 'inline');
      fixture.detectChanges();

      expect(getAnchor().classList.contains('ea-eagami-wordmark--inline')).toBe(true);
    });

    it('renders overline and brand inline for variant 2', () => {
      fixture.componentRef.setInput('variant', 2);
      fixture.componentRef.setInput('layout', 'inline');
      fixture.detectChanges();

      expect(getOverline()?.textContent?.trim()).toBe('handcrafted by');
      expect(getBrand()?.textContent?.trim()).toBe('eagami');
    });

    it('renders brand and tagline inline for variant 4', () => {
      fixture.componentRef.setInput('variant', 4);
      fixture.componentRef.setInput('layout', 'inline');
      fixture.detectChanges();

      expect(getBrand()?.textContent?.trim()).toBe('eagami design system');
      expect(getTagline()?.textContent?.trim()).toBe('elegant web design');
    });
  });
});
