import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarEditorComponent, AvatarEditorCropState } from './avatar-editor.component';

// ─── Image mock ───────────────────────────────────────────────────────────────
//
// Captures every Image instance created by the component so tests can manually
// fire onload / onerror without triggering real network requests.

class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  crossOrigin = '';
  width = 100;
  height = 100;
  private _src = '';

  get src(): string {
    return this._src;
  }

  set src(value: string) {
    this._src = value;
    mockImageInstances.push(this);
  }
}

const mockImageInstances: MockImage[] = [];

function lastImage(): MockImage {
  return mockImageInstances[mockImageInstances.length - 1];
}

function triggerLoad(): void {
  lastImage()?.onload?.();
}

function triggerError(): void {
  lastImage()?.onerror?.();
}

// ─── FileReader mock ──────────────────────────────────────────────────────────
//
// Two call paths:
//   loadFile  → sets onload then calls readAsDataURL(File)   → test triggers manually
//   exportCrop → sets onloadend then calls readAsDataURL(Blob) → mock auto-fires via microtask

interface MockFileReaderEvent {
  target: { result: string };
}

interface MockFileReaderInstance {
  onload: ((e: MockFileReaderEvent) => void) | null;
  onloadend: (() => void) | null;
  result: string;
  readAsDataURL(file: Blob): void;
}

let lastMockFileReader: MockFileReaderInstance | null = null;

function createMockFileReader(): MockFileReaderInstance {
  const instance: MockFileReaderInstance = {
    onload: null,
    onloadend: null,
    result: 'data:image/png;base64,mock',
    readAsDataURL(file: Blob): void {
      lastMockFileReader = instance;
      if (!(file instanceof File)) {
        // exportCrop path: auto-fire onloadend so the returned Promise resolves
        Promise.resolve().then(() => instance.onloadend?.());
      }
    },
  };
  return instance;
}

// ─── Canvas mock ─────────────────────────────────────────────────────────────

const mockCtx = {
  clearRect: jest.fn(),
  fillRect: jest.fn(),
  drawImage: jest.fn(),
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  closePath: jest.fn(),
  clip: jest.fn(),
} as unknown as CanvasRenderingContext2D;

// ─── Global setup ─────────────────────────────────────────────────────────────

beforeAll(() => {
  Object.defineProperty(globalThis, 'Image', { value: MockImage, writable: true });
  Object.defineProperty(globalThis, 'FileReader', {
    value: createMockFileReader,
    writable: true,
  });
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    value: jest.fn(() => mockCtx),
    writable: true,
    configurable: true,
  });
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    value: jest.fn((cb: BlobCallback) => cb(new Blob(['img'], { type: 'image/png' }))),
    writable: true,
    configurable: true,
  });
});

afterEach(() => {
  mockImageInstances.length = 0;
  lastMockFileReader = null;
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeFile(type = 'image/jpeg', byteCount = 100): File {
  return new File([new Uint8Array(byteCount)], 'photo.jpg', { type });
}

// ─── Spec ─────────────────────────────────────────────────────────────────────

describe('AvatarEditorComponent', () => {
  let fixture: ComponentFixture<AvatarEditorComponent>;
  let component: AvatarEditorComponent;

  function host(): HTMLElement {
    return fixture.nativeElement.querySelector('.ea-avatar-editor')!;
  }

  function getDropzone(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.ea-avatar-editor__dropzone');
  }

  function getCanvas(): HTMLCanvasElement | null {
    return fixture.nativeElement.querySelector('.ea-avatar-editor__canvas');
  }

  function getFileInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('.ea-avatar-editor__file-input')!;
  }

  function getZoomSlider(): HTMLInputElement {
    return fixture.nativeElement.querySelector('.ea-avatar-editor__zoom-slider')!;
  }

  function iconButtons(): HTMLButtonElement[] {
    return Array.from(
      fixture.nativeElement.querySelectorAll('.ea-avatar-editor__icon-btn'),
    );
  }

  // Control order per template: revert [0], zoom-out [1], zoom-in [2], remove [3]
  function revertBtn(): HTMLButtonElement {
    return iconButtons()[0];
  }
  function zoomOutBtn(): HTMLButtonElement {
    return iconButtons()[1];
  }
  function zoomInBtn(): HTMLButtonElement {
    return iconButtons()[2];
  }
  function removeBtn(): HTMLButtonElement {
    return iconButtons()[3];
  }

  /**
   * Loads an image via currentSrc through the full two-cycle lifecycle:
   *   1st detectChanges → effect fires → loadFromUrl called → _suppressCropStateEmit = true
   *   triggerLoad       → onload fires → state updated → afterNextRender registered
   *   2nd detectChanges → afterNextRender fires → _suppressCropStateEmit = false
   */
  function loadImage(url = 'https://example.com/photo.jpg'): void {
    fixture.componentRef.setInput('currentSrc', url);
    fixture.detectChanges();
    triggerLoad();
    fixture.detectChanges();
  }

  function selectFile(file: File): void {
    const input = getFileInput();
    Object.defineProperty(input, 'files', { value: [file], configurable: true });
    input.dispatchEvent(new Event('change'));
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Rendering ────────────────────────────────────────────────────────────────

  describe('Rendering', () => {
    it('renders a dropzone before any image is loaded', () => {
      expect(getDropzone()).toBeTruthy();
      expect(getCanvas()).toBeNull();
    });

    it('shows canvas and hides dropzone after image loads', () => {
      loadImage();

      expect(getCanvas()).toBeTruthy();
      expect(getDropzone()).toBeNull();
    });

    it('applies circle shape class by default', () => {
      expect(host().classList).toContain('ea-avatar-editor--circle');
    });

    it('applies square shape class when shape input is square', () => {
      fixture.componentRef.setInput('shape', 'square');
      fixture.detectChanges();

      expect(host().classList).toContain('ea-avatar-editor--square');
    });

    it('applies has-image class after image loads', () => {
      loadImage();

      expect(host().classList).toContain('ea-avatar-editor--has-image');
    });

    it('removes has-image class after removeImage', () => {
      loadImage();

      component.removeImage();
      fixture.detectChanges();

      expect(host().classList).not.toContain('ea-avatar-editor--has-image');
    });

    it('applies canvasSize to the dropzone dimensions', () => {
      fixture.componentRef.setInput('canvasSize', 150);
      fixture.detectChanges();

      expect(getDropzone()!.style.width).toBe('150px');
      expect(getDropzone()!.style.height).toBe('150px');
    });

    it('applies canvasSize to the canvas wrapper dimensions', () => {
      fixture.componentRef.setInput('canvasSize', 300);
      loadImage();

      const wrapper: HTMLElement = fixture.nativeElement.querySelector(
        '.ea-avatar-editor__canvas-wrapper',
      )!;
      expect(wrapper.style.width).toBe('300px');
      expect(wrapper.style.height).toBe('300px');
    });
  });

  // ── currentSrc loading ────────────────────────────────────────────────────

  describe('currentSrc loading', () => {
    it('loads image from the provided URL', () => {
      fixture.componentRef.setInput('currentSrc', 'https://example.com/photo.jpg');
      fixture.detectChanges();

      expect(lastImage().src).toBe('https://example.com/photo.jpg');
    });

    it('sets crossOrigin to anonymous', () => {
      fixture.componentRef.setInput('currentSrc', 'https://example.com/photo.jpg');
      fixture.detectChanges();

      expect(lastImage().crossOrigin).toBe('anonymous');
    });

    it('sets hasImage to true after onload fires', () => {
      fixture.componentRef.setInput('currentSrc', 'https://example.com/photo.jpg');
      fixture.detectChanges();
      expect(component.hasImage()).toBe(false);

      triggerLoad();

      expect(component.hasImage()).toBe(true);
    });

    it('initialises zoom to 1 when no cropState is set', () => {
      fixture.componentRef.setInput('currentSrc', 'https://example.com/photo.jpg');
      fixture.detectChanges();
      triggerLoad();

      expect(component.zoom()).toBe(1);
    });

    it('does not load when currentSrc is undefined', () => {
      fixture.componentRef.setInput('currentSrc', undefined);
      fixture.detectChanges();

      expect(component.hasImage()).toBe(false);
    });

    it('reloads the image when currentSrc changes', () => {
      loadImage('https://example.com/a.jpg');

      fixture.componentRef.setInput('currentSrc', 'https://example.com/b.jpg');
      fixture.detectChanges();

      expect(lastImage().src).toBe('https://example.com/b.jpg');
    });
  });

  // ── cropState restoration ─────────────────────────────────────────────────

  describe('cropState restoration', () => {
    it('restores zoom from cropState on load', () => {
      fixture.componentRef.setInput('cropState', {
        zoom: 2,
        offsetX: 0,
        offsetY: 0,
      } satisfies AvatarEditorCropState);
      fixture.componentRef.setInput('currentSrc', 'https://example.com/photo.jpg');
      fixture.detectChanges();
      triggerLoad();

      expect(component.zoom()).toBe(2);
    });

    it('re-applies cropState when currentSrc swaps to a new URL', () => {
      fixture.componentRef.setInput('cropState', {
        zoom: 1.5,
        offsetX: -5,
        offsetY: -10,
      } satisfies AvatarEditorCropState);
      loadImage('https://example.com/clerk.jpg');

      fixture.componentRef.setInput('currentSrc', 'https://example.com/r2.jpg');
      fixture.detectChanges();
      triggerLoad();

      expect(component.zoom()).toBe(1.5);
    });

    it('clamps restored zoom to maxZoom', () => {
      fixture.componentRef.setInput('maxZoom', 2);
      fixture.componentRef.setInput('cropState', {
        zoom: 5,
        offsetX: 0,
        offsetY: 0,
      } satisfies AvatarEditorCropState);
      fixture.componentRef.setInput('currentSrc', 'https://example.com/photo.jpg');
      fixture.detectChanges();
      triggerLoad();

      expect(component.zoom()).toBe(2);
    });

    it('clamps restored zoom to minZoom', () => {
      fixture.componentRef.setInput('minZoom', 1);
      fixture.componentRef.setInput('cropState', {
        zoom: 0.5,
        offsetX: 0,
        offsetY: 0,
      } satisfies AvatarEditorCropState);
      fixture.componentRef.setInput('currentSrc', 'https://example.com/photo.jpg');
      fixture.detectChanges();
      triggerLoad();

      expect(component.zoom()).toBe(1);
    });

    it('uses zoom 1 when cropState is null', () => {
      fixture.componentRef.setInput('cropState', null);
      fixture.componentRef.setInput('currentSrc', 'https://example.com/photo.jpg');
      fixture.detectChanges();
      triggerLoad();

      expect(component.zoom()).toBe(1);
    });
  });

  // ── cropStateChange emission ──────────────────────────────────────────────

  describe('cropStateChange emission', () => {
    it('does not emit during a programmatic load (afterNextRender not yet settled)', () => {
      const spy = jest.fn();
      component.cropStateChange.subscribe(spy);

      fixture.componentRef.setInput('currentSrc', 'https://example.com/photo.jpg');
      fixture.detectChanges(); // effect fires → _suppressCropStateEmit = true
      triggerLoad(); // onload fires → afterNextRender registered but not yet run

      component.setZoom(1.5); // attempts emission while still suppressed

      expect(spy).not.toHaveBeenCalled();
    });

    it('emits after load has fully settled', () => {
      loadImage(); // two detectChanges — afterNextRender fires, suppress cleared

      const spy = jest.fn();
      component.cropStateChange.subscribe(spy);

      component.setZoom(1.5);

      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ zoom: 1.5 }));
    });

    it('clears emission suppression on load error', () => {
      const spy = jest.fn();
      component.cropStateChange.subscribe(spy);

      fixture.componentRef.setInput('currentSrc', 'https://example.com/photo.jpg');
      fixture.detectChanges(); // _suppressCropStateEmit = true
      triggerError(); // onerror fires → _suppressCropStateEmit = false

      component.setZoom(1.5);

      expect(spy).toHaveBeenCalled();
    });

    it('does not emit during revertImage load', () => {
      loadImage();

      const spy = jest.fn();
      component.cropStateChange.subscribe(spy);

      component.revertImage();
      fixture.detectChanges(); // _suppressCropStateEmit = true
      triggerLoad(); // afterNextRender registered but not yet run

      component.setZoom(1.5); // still suppressed

      expect(spy).not.toHaveBeenCalled();
    });

    it('emits cropStateChange with the correct shape', () => {
      loadImage();

      const spy = jest.fn();
      component.cropStateChange.subscribe(spy);
      component.setZoom(2);

      expect(spy).toHaveBeenCalledWith<[AvatarEditorCropState]>({
        zoom: 2,
        offsetX: expect.any(Number),
        offsetY: expect.any(Number),
      });
    });
  });

  // ── removeImage ───────────────────────────────────────────────────────────

  describe('removeImage', () => {
    beforeEach(() => {
      loadImage();
    });

    it('sets hasImage to false', () => {
      component.removeImage();

      expect(component.hasImage()).toBe(false);
    });

    it('resets zoom to 1', () => {
      component.setZoom(2);
      component.removeImage();

      expect(component.zoom()).toBe(1);
    });

    it('emits the removed output', () => {
      const spy = jest.fn();
      component.removed.subscribe(spy);

      component.removeImage();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('sets canRevert to false', () => {
      expect(component.canRevert()).toBe(true);

      component.removeImage();

      expect(component.canRevert()).toBe(false);
    });
  });

  // ── revertImage ───────────────────────────────────────────────────────────

  describe('revertImage', () => {
    it('does nothing when currentSrc is not set', () => {
      component.revertImage();

      expect(component.hasImage()).toBe(false);
    });

    it('reloads the image from currentSrc', () => {
      fixture.componentRef.setInput('currentSrc', 'https://example.com/photo.jpg');
      fixture.detectChanges();
      triggerLoad();
      fixture.detectChanges();

      mockImageInstances.length = 0; // reset tracker

      component.revertImage();

      expect(lastImage()?.src).toBe('https://example.com/photo.jpg');
    });

    it('resets zoom to 1 (no cropState)', () => {
      loadImage();
      component.setZoom(2);

      component.revertImage();
      fixture.detectChanges();
      triggerLoad();

      expect(component.zoom()).toBe(1);
    });

    it('sets isAtOriginal to true', () => {
      loadImage();

      component.revertImage();

      expect(component.isAtOriginal()).toBe(true);
    });

    it('re-enables canRevert after zooming post-revert', () => {
      loadImage();
      component.revertImage();

      component.setZoom(2);

      expect(component.canRevert()).toBe(true);
    });
  });

  // ── Zoom ──────────────────────────────────────────────────────────────────

  describe('Zoom', () => {
    beforeEach(() => {
      loadImage();
    });

    it('setZoom clamps value to minZoom', () => {
      fixture.componentRef.setInput('minZoom', 1);
      component.setZoom(0.5);

      expect(component.zoom()).toBe(1);
    });

    it('setZoom clamps value to maxZoom', () => {
      fixture.componentRef.setInput('maxZoom', 3);
      component.setZoom(5);

      expect(component.zoom()).toBe(3);
    });

    it('setZoom rounds to two decimal places', () => {
      component.setZoom(1.567);

      expect(component.zoom()).toBe(1.57);
    });

    it('zoom in button increments zoom by 0.1', () => {
      component.zoom.set(1.0);
      fixture.detectChanges();

      zoomInBtn().click();

      expect(component.zoom()).toBeCloseTo(1.1, 5);
    });

    it('zoom out button decrements zoom by 0.1', () => {
      component.zoom.set(2.0);
      fixture.detectChanges();

      zoomOutBtn().click();

      expect(component.zoom()).toBeCloseTo(1.9, 5);
    });

    it('slider input event updates zoom', () => {
      const slider = getZoomSlider();
      slider.value = '1.8';
      slider.dispatchEvent(new Event('input'));

      expect(component.zoom()).toBeCloseTo(1.8, 5);
    });
  });

  // ── File selection ────────────────────────────────────────────────────────

  describe('File selection', () => {
    it('emits fileError for a non-image file type', () => {
      const spy = jest.fn();
      component.fileError.subscribe(spy);

      selectFile(makeFile('application/pdf'));

      expect(spy).toHaveBeenCalledWith('File must be an image');
    });

    it('emits fileError when the file exceeds maxFileSize', () => {
      const spy = jest.fn();
      component.fileError.subscribe(spy);
      fixture.componentRef.setInput('maxFileSize', 1);

      selectFile(makeFile('image/jpeg', 10));

      expect(spy).toHaveBeenCalledWith(expect.stringContaining('exceeds'));
    });

    it('emits fileSelected for a valid file', () => {
      const spy = jest.fn();
      component.fileSelected.subscribe(spy);
      const file = makeFile('image/jpeg');

      selectFile(file);

      expect(spy).toHaveBeenCalledWith(file);
    });

    it('calls FileReader.readAsDataURL for a valid file', () => {
      selectFile(makeFile('image/jpeg'));

      expect(lastMockFileReader).not.toBeNull();
    });

    it('loads image after FileReader resolves', () => {
      selectFile(makeFile('image/jpeg'));

      lastMockFileReader!.onload!({ target: { result: 'data:image/jpeg;base64,abc' } });
      triggerLoad();

      expect(component.hasImage()).toBe(true);
    });

    it('initialises zoom to 1 after loading a user-selected file', () => {
      component.zoom.set(2);

      selectFile(makeFile('image/jpeg'));
      lastMockFileReader!.onload!({ target: { result: 'data:image/jpeg;base64,abc' } });
      triggerLoad();

      expect(component.zoom()).toBe(1);
    });

    it('resets the file input value after selection', () => {
      selectFile(makeFile('image/jpeg'));
      // value is reset so the same file can be re-selected
      expect(getFileInput().value).toBe('');
    });
  });

  // ── Drag and drop ─────────────────────────────────────────────────────────

  describe('Drag and drop', () => {
    it('sets isDragOver to true on dragover', () => {
      getDropzone()!.dispatchEvent(new Event('dragover'));

      expect(component.isDragOver()).toBe(true);
    });

    it('clears isDragOver on dragleave', () => {
      getDropzone()!.dispatchEvent(new Event('dragover'));
      getDropzone()!.dispatchEvent(new Event('dragleave'));

      expect(component.isDragOver()).toBe(false);
    });

    it('applies drag-over class when isDragOver is true', () => {
      getDropzone()!.dispatchEvent(new Event('dragover'));
      fixture.detectChanges();

      expect(host().classList).toContain('ea-avatar-editor--drag-over');
    });

    it('clears isDragOver on drop', () => {
      getDropzone()!.dispatchEvent(new Event('dragover'));
      const event = new Event('drop');
      Object.defineProperty(event, 'dataTransfer', {
        value: { files: [makeFile('image/jpeg')] },
      });
      getDropzone()!.dispatchEvent(event);

      expect(component.isDragOver()).toBe(false);
    });

    it('emits fileError on drop of a non-image file', () => {
      const spy = jest.fn();
      component.fileError.subscribe(spy);
      const event = new Event('drop');
      Object.defineProperty(event, 'dataTransfer', {
        value: { files: [makeFile('application/pdf')] },
      });

      getDropzone()!.dispatchEvent(event);

      expect(spy).toHaveBeenCalledWith('File must be an image');
    });

    it('emits fileSelected on drop of a valid image file', () => {
      const spy = jest.fn();
      component.fileSelected.subscribe(spy);
      const file = makeFile('image/jpeg');
      const event = new Event('drop');
      Object.defineProperty(event, 'dataTransfer', { value: { files: [file] } });

      getDropzone()!.dispatchEvent(event);

      expect(spy).toHaveBeenCalledWith(file);
    });
  });

  // ── Controls ──────────────────────────────────────────────────────────────

  describe('Controls', () => {
    it('revert button is disabled before any image loads', () => {
      expect(revertBtn().disabled).toBe(true);
    });

    it('revert button is enabled after image loads with currentSrc', () => {
      loadImage();
      fixture.detectChanges();

      expect(revertBtn().disabled).toBe(false);
    });

    it('revert button is disabled after removeImage', () => {
      loadImage();
      component.removeImage();
      fixture.detectChanges();

      expect(revertBtn().disabled).toBe(true);
    });

    it('revert button is disabled after revertImage is called', () => {
      loadImage();

      component.revertImage();
      fixture.detectChanges();

      expect(revertBtn().disabled).toBe(true);
    });

    it('revert button is re-enabled after zooming post-revert', () => {
      loadImage();
      component.revertImage();

      component.setZoom(2);
      fixture.detectChanges();

      expect(revertBtn().disabled).toBe(false);
    });

    it('zoom in button is disabled before any image loads', () => {
      expect(zoomInBtn().disabled).toBe(true);
    });

    it('zoom in button is disabled at maxZoom', () => {
      fixture.componentRef.setInput('maxZoom', 1);
      loadImage();
      fixture.detectChanges();

      expect(zoomInBtn().disabled).toBe(true);
    });

    it('zoom out button is disabled before any image loads', () => {
      expect(zoomOutBtn().disabled).toBe(true);
    });

    it('zoom out button is disabled at minZoom', () => {
      loadImage(); // zoom initialises at 1, which equals minZoom default of 1
      fixture.detectChanges();

      expect(zoomOutBtn().disabled).toBe(true);
    });

    it('zoom slider is disabled before any image loads', () => {
      expect(getZoomSlider().disabled).toBe(true);
    });

    it('zoom slider is enabled after image loads', () => {
      loadImage();
      fixture.detectChanges();

      expect(getZoomSlider().disabled).toBe(false);
    });

    it('remove button is disabled before any image loads', () => {
      expect(removeBtn().disabled).toBe(true);
    });

    it('remove button is enabled after image loads', () => {
      loadImage();
      fixture.detectChanges();

      expect(removeBtn().disabled).toBe(false);
    });
  });

  // ── exportCrop ────────────────────────────────────────────────────────────

  describe('exportCrop', () => {
    it('rejects when no image is loaded', async () => {
      await expect(component.exportCrop()).rejects.toThrow('No image loaded');
    });

    it('resolves with a Blob when image is loaded', async () => {
      loadImage();

      const blob = await component.exportCrop();

      expect(blob).toBeInstanceOf(Blob);
    });

    it('emits cropped output with the blob and a dataUrl', async () => {
      loadImage();
      const spy = jest.fn();
      component.cropped.subscribe(spy);

      const blob = await component.exportCrop();

      expect(spy).toHaveBeenCalledWith<[{ blob: Blob; dataUrl: string }]>({
        blob,
        dataUrl: expect.any(String),
      });
    });
  });
});
