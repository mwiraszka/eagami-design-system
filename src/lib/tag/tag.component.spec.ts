import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagComponent } from './tag.component';

describe('TagComponent', () => {
  let fixture: ComponentFixture<TagComponent>;
  let component: TagComponent;

  function getTag(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.ea-tag');
  }

  function getRemoveButton(): HTMLButtonElement | null {
    return fixture.nativeElement.querySelector('.ea-tag__remove');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Rendering', () => {
    it('renders the tag element', () => {
      expect(getTag()).toBeTruthy();
    });

    it('applies the default variant class', () => {
      expect(getTag()!.classList).toContain('ea-tag--default');
    });

    it('applies the correct variant class when set', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();

      expect(getTag()!.classList).toContain('ea-tag--success');
    });

    it('applies the default size class', () => {
      expect(getTag()!.classList).toContain('ea-tag--md');
    });

    it('applies the correct size class when set', () => {
      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();

      expect(getTag()!.classList).toContain('ea-tag--lg');
    });
  });

  describe('Variants', () => {
    const variants = [
      'default',
      'primary',
      'success',
      'warning',
      'error',
      'info',
    ] as const;

    variants.forEach(variant => {
      it(`renders with ${variant} variant`, () => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();

        expect(getTag()!.classList).toContain(`ea-tag--${variant}`);
      });
    });
  });

  describe('Remove button', () => {
    it('does not show remove button by default', () => {
      expect(getRemoveButton()).toBeNull();
    });

    it('shows remove button when removable is true', () => {
      fixture.componentRef.setInput('removable', true);
      fixture.detectChanges();

      expect(getRemoveButton()).toBeTruthy();
    });

    it('emits removed when remove button is clicked', () => {
      const spy = jest.fn();
      component.removed.subscribe(spy);
      fixture.componentRef.setInput('removable', true);
      fixture.detectChanges();

      getRemoveButton()!.click();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('remove button has disabled attribute when disabled', () => {
      fixture.componentRef.setInput('removable', true);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getRemoveButton()!.disabled).toBe(true);
    });
  });

  describe('Disabled', () => {
    it('applies disabled class when disabled is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getTag()!.classList).toContain('ea-tag--disabled');
    });

    it('does not apply disabled class when disabled is false', () => {
      expect(getTag()!.classList).not.toContain('ea-tag--disabled');
    });
  });
});
