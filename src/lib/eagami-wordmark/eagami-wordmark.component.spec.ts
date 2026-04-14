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

    it('sets an accessible label on the link', () => {
      expect(getAnchor().getAttribute('aria-label')).toBe('eagami — elegant web design');
    });
  });

  // ── Variants ─────────────────────────────────────────────────────────────────

  describe('Variants', () => {
    it('renders only the logo by default', () => {
      expect(getLogo()).toBeTruthy();
      expect(getBrand()).toBeNull();
      expect(getOverline()).toBeNull();
      expect(getTagline()).toBeNull();
    });

    it('renders "handcrafted by eagami" when variant is "signature"', () => {
      fixture.componentRef.setInput('variant', 'signature');
      fixture.detectChanges();

      expect(getLogo()).toBeTruthy();
      expect(getOverline()?.textContent?.trim()).toBe('handcrafted by');
      expect(getBrand()?.textContent?.trim()).toBe('eagami');
      expect(getTagline()).toBeNull();
    });

    it('renders "eagami" and the tagline when variant is "brand"', () => {
      fixture.componentRef.setInput('variant', 'brand');
      fixture.detectChanges();

      expect(getLogo()).toBeTruthy();
      expect(getBrand()?.textContent?.trim()).toBe('eagami');
      expect(getTagline()?.textContent?.trim()).toBe('elegant web design');
      expect(getOverline()).toBeNull();
    });
  });

  // ── Size ─────────────────────────────────────────────────────────────────────

  describe('Size', () => {
    it('applies the md modifier class by default', () => {
      expect(getAnchor().classList.contains('ea-eagami-wordmark--md')).toBe(true);
      expect(getAnchor().classList.contains('ea-eagami-wordmark--sm')).toBe(false);
      expect(getAnchor().classList.contains('ea-eagami-wordmark--lg')).toBe(false);
    });

    it('applies the sm modifier class when size is "sm"', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();

      expect(getAnchor().classList.contains('ea-eagami-wordmark--sm')).toBe(true);
      expect(getAnchor().classList.contains('ea-eagami-wordmark--md')).toBe(false);
    });

    it('applies the lg modifier class when size is "lg"', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();

      expect(getAnchor().classList.contains('ea-eagami-wordmark--lg')).toBe(true);
      expect(getAnchor().classList.contains('ea-eagami-wordmark--md')).toBe(false);
    });
  });
});
