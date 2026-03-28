import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkeletonComponent } from './skeleton.component';

describe('SkeletonComponent', () => {
  let fixture: ComponentFixture<SkeletonComponent>;

  function getSkeleton(): HTMLElement {
    return fixture.nativeElement.querySelector('.ea-skeleton');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonComponent);
    fixture.detectChanges();
  });

  describe('Rendering', () => {
    it('renders the skeleton element', () => {
      expect(getSkeleton()).toBeTruthy();
    });

    it('applies text variant by default', () => {
      expect(getSkeleton().classList).toContain('ea-skeleton--text');
    });

    it('is animated by default', () => {
      expect(getSkeleton().classList).toContain('ea-skeleton--animated');
    });

    it('has aria-hidden="true"', () => {
      expect(getSkeleton().getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('Variants', () => {
    it('applies circle variant class', () => {
      fixture.componentRef.setInput('variant', 'circle');
      fixture.detectChanges();
      expect(getSkeleton().classList).toContain('ea-skeleton--circle');
    });

    it('applies rect variant class', () => {
      fixture.componentRef.setInput('variant', 'rect');
      fixture.detectChanges();
      expect(getSkeleton().classList).toContain('ea-skeleton--rect');
    });
  });

  describe('Custom dimensions', () => {
    it('applies custom width', () => {
      fixture.componentRef.setInput('width', '200px');
      fixture.detectChanges();
      expect(getSkeleton().style.width).toBe('200px');
    });

    it('applies custom height', () => {
      fixture.componentRef.setInput('height', '3rem');
      fixture.detectChanges();
      expect(getSkeleton().style.height).toBe('3rem');
    });
  });

  describe('Animation', () => {
    it('removes animated class when animated is false', () => {
      fixture.componentRef.setInput('animated', false);
      fixture.detectChanges();
      expect(getSkeleton().classList).not.toContain('ea-skeleton--animated');
    });
  });
});
