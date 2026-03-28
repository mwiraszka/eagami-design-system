import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccordionItemComponent } from './accordion-item.component';
import { AccordionComponent } from './accordion.component';

@Component({
  imports: [AccordionComponent, AccordionItemComponent],
  template: `
    <ea-accordion [multi]="multi">
      <ea-accordion-item
        value="one"
        label="Section One"
        >Content one</ea-accordion-item
      >
      <ea-accordion-item
        value="two"
        label="Section Two"
        >Content two</ea-accordion-item
      >
      <ea-accordion-item
        value="three"
        label="Section Three"
        [disabled]="true">
        Content three
      </ea-accordion-item>
    </ea-accordion>
  `,
})
class TestHostComponent {
  multi = false;
}

describe('AccordionComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  function getTriggers(): HTMLButtonElement[] {
    return Array.from(
      fixture.nativeElement.querySelectorAll('.ea-accordion-item__trigger'),
    );
  }

  function getPanels(): HTMLElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('[role="region"]'));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  describe('Rendering', () => {
    it('renders trigger buttons for each item', () => {
      expect(getTriggers().length).toBe(3);
    });

    it('renders trigger labels', () => {
      const labels = getTriggers().map(t =>
        t.querySelector('.ea-accordion-item__label')?.textContent?.trim(),
      );
      expect(labels).toEqual(['Section One', 'Section Two', 'Section Three']);
    });

    it('has no panels open by default', () => {
      expect(getPanels().length).toBe(0);
    });
  });

  describe('Single mode (default)', () => {
    it('opens a panel when trigger is clicked', () => {
      getTriggers()[0].click();
      fixture.detectChanges();
      expect(getPanels().length).toBe(1);
      expect(getPanels()[0].textContent?.trim()).toBe('Content one');
    });

    it('closes the current panel when another is opened', () => {
      getTriggers()[0].click();
      fixture.detectChanges();
      getTriggers()[1].click();
      fixture.detectChanges();
      expect(getPanels().length).toBe(1);
      expect(getPanels()[0].textContent?.trim()).toBe('Content two');
    });

    it('closes a panel when its trigger is clicked again', () => {
      getTriggers()[0].click();
      fixture.detectChanges();
      getTriggers()[0].click();
      fixture.detectChanges();
      expect(getPanels().length).toBe(0);
    });

    it('sets aria-expanded on triggers', () => {
      getTriggers()[0].click();
      fixture.detectChanges();
      expect(getTriggers()[0].getAttribute('aria-expanded')).toBe('true');
      expect(getTriggers()[1].getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('Multi mode', () => {
    beforeEach(() => {
      fixture.componentInstance.multi = true;
      fixture.detectChanges();
    });

    it('allows multiple panels to be open', () => {
      getTriggers()[0].click();
      fixture.detectChanges();
      getTriggers()[1].click();
      fixture.detectChanges();
      expect(getPanels().length).toBe(2);
    });

    it('closes individual panels independently', () => {
      getTriggers()[0].click();
      fixture.detectChanges();
      getTriggers()[1].click();
      fixture.detectChanges();
      getTriggers()[0].click();
      fixture.detectChanges();
      expect(getPanels().length).toBe(1);
      expect(getPanels()[0].textContent?.trim()).toBe('Content two');
    });
  });

  describe('Disabled items', () => {
    it('disables the trigger button', () => {
      expect(getTriggers()[2].disabled).toBe(true);
    });

    it('does not open when disabled trigger is clicked', () => {
      getTriggers()[2].click();
      fixture.detectChanges();
      expect(getPanels().length).toBe(0);
    });
  });
});
