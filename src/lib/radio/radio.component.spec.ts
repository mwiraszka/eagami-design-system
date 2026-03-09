import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioGroupComponent } from './radio-group.component';
import { RadioComponent } from './radio.component';

@Component({
  selector: 'ea-test-host',
  imports: [RadioGroupComponent, RadioComponent],
  template: `
    <ea-radio-group
      [(value)]="selected"
      [disabled]="groupDisabled()">
      <ea-radio
        value="a"
        label="Option A"></ea-radio>
      <ea-radio
        value="b"
        label="Option B"></ea-radio>
      <ea-radio
        value="c"
        label="Option C"
        [disabled]="true"></ea-radio>
    </ea-radio-group>
  `,
})
class TestHostComponent {
  selected = signal('');
  groupDisabled = signal(false);
}

describe('RadioGroup + Radio', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  function getRadios(): HTMLInputElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('input[type="radio"]'));
  }

  function getLabels(): HTMLLabelElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('label.ea-radio'));
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
    it('renders three radio inputs', () => {
      expect(getRadios()).toHaveLength(3);
    });

    it('renders labels for each radio', () => {
      const labels = fixture.nativeElement.querySelectorAll('.ea-radio__label');
      expect(labels[0].textContent.trim()).toBe('Option A');
      expect(labels[1].textContent.trim()).toBe('Option B');
      expect(labels[2].textContent.trim()).toBe('Option C');
    });

    it('sets the radiogroup role', () => {
      const group = fixture.nativeElement.querySelector('[role="radiogroup"]');
      expect(group).toBeTruthy();
    });

    it('all radios share the same name', () => {
      const radios = getRadios();
      const name = radios[0].name;
      expect(name).toBeTruthy();
      radios.forEach(r => expect(r.name).toBe(name));
    });
  });

  describe('Selection', () => {
    it('no radio is checked initially', () => {
      getRadios().forEach(r => expect(r.checked).toBe(false));
    });

    it('selects a radio on click', () => {
      getRadios()[0].click();
      fixture.detectChanges();
      expect(host.selected()).toBe('a');
      expect(getRadios()[0].checked).toBe(true);
    });

    it('deselects previous when another is selected', () => {
      getRadios()[0].click();
      fixture.detectChanges();
      getRadios()[1].click();
      fixture.detectChanges();
      expect(host.selected()).toBe('b');
      expect(getRadios()[0].checked).toBe(false);
      expect(getRadios()[1].checked).toBe(true);
    });

    it('reflects programmatic value changes', () => {
      host.selected.set('b');
      fixture.detectChanges();
      expect(getRadios()[1].checked).toBe(true);
    });
  });

  describe('Disabled state', () => {
    it('disables individual radio when its disabled input is true', () => {
      expect(getRadios()[2].disabled).toBe(true);
      expect(getLabels()[2].classList).toContain('ea-radio--disabled');
    });

    it('disables all radios when group is disabled', () => {
      host.groupDisabled.set(true);
      fixture.detectChanges();
      getRadios().forEach(r => expect(r.disabled).toBe(true));
    });
  });

  describe('CVA', () => {
    it('writes value via writeValue', () => {
      const group = fixture.debugElement.children[0]
        .componentInstance as RadioGroupComponent;
      group.writeValue('b');
      fixture.detectChanges();
      expect(getRadios()[1].checked).toBe(true);
    });

    it('calls onChange when a radio is selected', () => {
      const group = fixture.debugElement.children[0]
        .componentInstance as RadioGroupComponent;
      const onChange = jest.fn();
      group.registerOnChange(onChange);
      getRadios()[0].click();
      expect(onChange).toHaveBeenCalledWith('a');
    });

    it('disables via setDisabledState', () => {
      const group = fixture.debugElement.children[0]
        .componentInstance as RadioGroupComponent;
      group.setDisabledState(true);
      fixture.detectChanges();
      getRadios().forEach(r => expect(r.disabled).toBe(true));
    });
  });
});
