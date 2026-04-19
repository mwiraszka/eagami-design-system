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

  // ── Text ─────────────────────────────────────────────────────────────────────

  describe('Text', () => {
    it('renders "eagami" by default', () => {
      expect(getBrand()?.textContent?.trim()).toBe('eagami');
      expect(getOverline()).toBeNull();
      expect(getTagline()).toBeNull();
    });

    it('renders overline and brand for "handcrafted by eagami"', () => {
      fixture.componentRef.setInput('text', 'handcrafted by eagami');
      fixture.detectChanges();

      expect(getOverline()?.textContent?.trim()).toBe('handcrafted by');
      expect(getBrand()?.textContent?.trim()).toBe('eagami');
      expect(getTagline()).toBeNull();
    });

    it('renders brand only for "eagami design system"', () => {
      fixture.componentRef.setInput('text', 'eagami design system');
      fixture.detectChanges();

      expect(getBrand()?.textContent?.trim()).toBe('eagami design system');
      expect(getOverline()).toBeNull();
      expect(getTagline()).toBeNull();
    });

    it('renders brand and tagline for the full variant', () => {
      fixture.componentRef.setInput(
        'text',
        'eagami design system \u2014 elegant web design',
      );
      fixture.detectChanges();

      expect(getBrand()?.textContent?.trim()).toBe('eagami design system');
      expect(getTagline()?.textContent?.trim()).toBe('elegant web design');
      expect(getOverline()).toBeNull();
    });

    it('uses the text input as the aria-label', () => {
      fixture.componentRef.setInput('text', 'handcrafted by eagami');
      fixture.detectChanges();

      expect(getAnchor().getAttribute('aria-label')).toBe('handcrafted by eagami');
    });

    it('uses the default text as the aria-label', () => {
      expect(getAnchor().getAttribute('aria-label')).toBe('eagami');
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

    it('renders overline and brand inline for "handcrafted by eagami"', () => {
      fixture.componentRef.setInput('text', 'handcrafted by eagami');
      fixture.componentRef.setInput('layout', 'inline');
      fixture.detectChanges();

      expect(getOverline()?.textContent?.trim()).toBe('handcrafted by');
      expect(getBrand()?.textContent?.trim()).toBe('eagami');
    });

    it('renders brand and tagline inline for the full variant', () => {
      fixture.componentRef.setInput(
        'text',
        'eagami design system \u2014 elegant web design',
      );
      fixture.componentRef.setInput('layout', 'inline');
      fixture.detectChanges();

      expect(getBrand()?.textContent?.trim()).toBe('eagami design system');
      expect(getTagline()?.textContent?.trim()).toBe('elegant web design');
    });
  });
});
