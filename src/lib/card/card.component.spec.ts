import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';

@Component({
  selector: 'ea-test-host',
  imports: [CardComponent],
  template: `
    <ea-card
      [variant]="variant"
      [padding]="padding"
      [fullWidth]="fullWidth">
      <span eaCardHeader>{{ header }}</span>
      Body content
      <span eaCardFooter>{{ footer }}</span>
    </ea-card>
  `,
})
class TestHostComponent {
  variant: 'elevated' | 'outlined' | 'filled' = 'elevated';
  padding: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  fullWidth = false;
  header = '';
  footer = '';
}

describe('CardComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  function getCard(): HTMLElement {
    return fixture.nativeElement.querySelector('.ea-card');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Rendering', () => {
    it('renders a card element', () => {
      expect(getCard()).toBeTruthy();
    });

    it('applies the default variant class', () => {
      expect(getCard().classList).toContain('ea-card--elevated');
    });

    it('applies the default padding class', () => {
      expect(getCard().classList).toContain('ea-card--padding-md');
    });

    it('renders body content', () => {
      expect(getCard().textContent).toContain('Body content');
    });
  });

  describe('Variants', () => {
    it('applies outlined variant', () => {
      host.variant = 'outlined';
      fixture.detectChanges();
      expect(getCard().classList).toContain('ea-card--outlined');
    });

    it('applies filled variant', () => {
      host.variant = 'filled';
      fixture.detectChanges();
      expect(getCard().classList).toContain('ea-card--filled');
    });
  });

  describe('Padding', () => {
    it('applies none padding', () => {
      host.padding = 'none';
      fixture.detectChanges();
      expect(getCard().classList).toContain('ea-card--padding-none');
    });

    it('applies lg padding', () => {
      host.padding = 'lg';
      fixture.detectChanges();
      expect(getCard().classList).toContain('ea-card--padding-lg');
    });

    it('applies xl padding', () => {
      host.padding = 'xl';
      fixture.detectChanges();
      expect(getCard().classList).toContain('ea-card--padding-xl');
    });
  });

  describe('Slots', () => {
    it('projects header content', () => {
      host.header = 'Card Title';
      fixture.detectChanges();
      const header = fixture.nativeElement.querySelector('.ea-card__header');
      expect(header.textContent).toContain('Card Title');
    });

    it('projects footer content', () => {
      host.footer = 'Footer text';
      fixture.detectChanges();
      const footer = fixture.nativeElement.querySelector('.ea-card__footer');
      expect(footer.textContent).toContain('Footer text');
    });
  });

  describe('Full width', () => {
    it('applies full-width class', () => {
      host.fullWidth = true;
      fixture.detectChanges();
      expect(getCard().classList).toContain('ea-card--full-width');
    });
  });
});
