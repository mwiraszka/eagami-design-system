import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  ViewEncapsulation,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';

import { CameraIconComponent } from '../icons/camera.component';
import { MinusIconComponent } from '../icons/minus.component';
import { PlusIconComponent } from '../icons/plus.component';
import { RotateCcwIconComponent } from '../icons/rotate-ccw.component';
import { TrashIconComponent } from '../icons/trash.component';
import { UploadIconComponent } from '../icons/upload.component';
import { SkeletonComponent } from '../skeleton/skeleton.component';
import { TooltipDirective } from '../tooltip/tooltip.directive';

export type AvatarEditorShape = 'circle' | 'square';

export interface AvatarEditorCropEvent {
  blob: Blob;
  dataUrl: string;
}

export interface AvatarEditorCropState {
  zoom: number;
  offsetX: number;
  offsetY: number;
}

@Component({
  selector: 'ea-avatar-editor',
  imports: [
    NgClass,
    CameraIconComponent,
    MinusIconComponent,
    PlusIconComponent,
    RotateCcwIconComponent,
    SkeletonComponent,
    TrashIconComponent,
    UploadIconComponent,
    TooltipDirective,
  ],
  templateUrl: './avatar-editor.component.html',
  styleUrl: './avatar-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AvatarEditorComponent implements OnDestroy {
  readonly canvasEl = viewChild<ElementRef<HTMLCanvasElement>>('canvasEl');
  readonly fileInputEl = viewChild<ElementRef<HTMLInputElement>>('fileInputEl');

  readonly shape = input<AvatarEditorShape>('circle');
  readonly canvasSize = input<number>(200);
  readonly currentSrc = input<string | undefined>(undefined);
  readonly loading = input<boolean>(false);
  readonly accept = input<string>('image/*');
  readonly maxFileSize = input<number>(5 * 1024 * 1024); // 5 MB
  readonly minZoom = input<number>(1);
  readonly maxZoom = input<number>(3);
  readonly exportQuality = input<number>(0.92);
  readonly exportType = input<string>('image/png');

  readonly cropState = input<AvatarEditorCropState | null | undefined>();

  readonly cropped = output<AvatarEditorCropEvent>();
  readonly fileSelected = output<File>();
  readonly removed = output<void>();
  readonly fileError = output<string>();
  readonly cropStateChange = output<AvatarEditorCropState>();

  readonly hasImage = signal(false);
  readonly isDragOver = signal(false);
  readonly isAtOriginal = signal(false);
  readonly isLoading = computed(() => this.isFetching() || this.loading());
  readonly zoom = signal(1);
  readonly canRevert = computed(() => !this.isAtOriginal() && this.originalCaptured);

  private image: HTMLImageElement | null = null;
  private offsetX = 0;
  private offsetY = 0;
  private dragStartX = 0;
  private dragStartY = 0;
  private isDragging = false;
  private hasDragged = false;
  private initialOffsetX = 0;
  private initialOffsetY = 0;
  private _suppressCropStateEmit = false;
  private readonly isFetching = signal(false);
  private originalCaptured = false;
  private originalImage: HTMLImageElement | null = null;
  private originalCropState: { zoom: number; offsetX: number; offsetY: number } | null =
    null;

  readonly hostClasses = computed(() => ({
    [`ea-avatar-editor--${this.shape()}`]: true,
    'ea-avatar-editor--has-image': this.hasImage(),
    'ea-avatar-editor--drag-over': this.isDragOver(),
  }));

  private readonly injector = inject(Injector);
  private readonly boundWheel = (e: WheelEvent) => this.onWheel(e);

  constructor() {
    effect(() => {
      const src = this.currentSrc();
      if (!src) {
        this.isFetching.set(false);
        if (!this.originalCaptured) {
          this.originalCaptured = true;
          this.originalImage = null;
          this.originalCropState = null;
          this.isAtOriginal.set(true);
        }
        return;
      }
      this.originalCaptured = false;
      this.originalImage = null;
      this.originalCropState = null;
      this.loadFromUrl(src, untracked(() => this.cropState()) ?? null, true);
    });
  }

  ngOnDestroy(): void {
    const canvas = this.canvasEl()?.nativeElement;
    canvas?.removeEventListener('wheel', this.boundWheel);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    const file = event.dataTransfer?.files[0];
    if (file) this.loadFile(file);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.loadFile(file);
    input.value = '';
  }

  openFilePicker(): void {
    this.fileInputEl()?.nativeElement.click();
  }

  onMouseDown(event: MouseEvent): void {
    if (!this.hasImage()) return;
    event.preventDefault();
    this.isDragging = true;
    this.hasDragged = false;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.initialOffsetX = this.offsetX;
    this.initialOffsetY = this.offsetY;

    document.addEventListener('mousemove', this.onMouseMoveBound);
    document.addEventListener('mouseup', this.onMouseUpBound);
  }

  onTouchStart(event: TouchEvent): void {
    if (!this.hasImage() || event.touches.length !== 1) return;
    const touch = event.touches[0];
    this.isDragging = true;
    this.hasDragged = false;
    this.dragStartX = touch.clientX;
    this.dragStartY = touch.clientY;
    this.initialOffsetX = this.offsetX;
    this.initialOffsetY = this.offsetY;

    document.addEventListener('touchmove', this.onTouchMoveBound, { passive: false });
    document.addEventListener('touchend', this.onTouchEndBound);
  }

  private readonly onMouseMoveBound = (e: MouseEvent) => this.onMouseMove(e);
  private readonly onMouseUpBound = () => this.onMouseUp();
  private readonly onTouchMoveBound = (e: TouchEvent) => this.onTouchMove(e);
  private readonly onTouchEndBound = () => this.onTouchEnd();

  private onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    const dx = event.clientX - this.dragStartX;
    const dy = event.clientY - this.dragStartY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      this.hasDragged = true;
      this.isAtOriginal.set(false);
    }
    this.offsetX = this.initialOffsetX + dx;
    this.offsetY = this.initialOffsetY + dy;
    this.clampOffset();
    this.draw();
    this.emitCropStateChange();
  }

  private onMouseUp(): void {
    if (!this.hasDragged) this.openFilePicker();
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onMouseMoveBound);
    document.removeEventListener('mouseup', this.onMouseUpBound);
  }

  private onTouchMove(event: TouchEvent): void {
    if (!this.isDragging || event.touches.length !== 1) return;
    event.preventDefault();
    const touch = event.touches[0];
    const dx = touch.clientX - this.dragStartX;
    const dy = touch.clientY - this.dragStartY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      this.hasDragged = true;
      this.isAtOriginal.set(false);
    }
    this.offsetX = this.initialOffsetX + dx;
    this.offsetY = this.initialOffsetY + dy;
    this.clampOffset();
    this.draw();
    this.emitCropStateChange();
  }

  private onTouchEnd(): void {
    if (!this.hasDragged) this.openFilePicker();
    this.isDragging = false;
    document.removeEventListener('touchmove', this.onTouchMoveBound);
    document.removeEventListener('touchend', this.onTouchEndBound);
  }

  private onWheel(event: WheelEvent): void {
    if (!this.hasImage()) return;
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    this.setZoom(this.zoom() + delta);
  }

  setZoom(value: number): void {
    this.isAtOriginal.set(false);
    const clamped = Math.min(this.maxZoom(), Math.max(this.minZoom(), value));
    this.zoom.set(Math.round(clamped * 100) / 100);
    this.clampOffset();
    this.draw();
    this.emitCropStateChange();
  }

  onZoomInput(event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    this.setZoom(value);
  }

  removeImage(): void {
    this.image = null;
    this.hasImage.set(false);
    this.isFetching.set(false);
    this.zoom.set(1);
    this.offsetX = 0;
    this.offsetY = 0;
    this.clearCanvas();
    this.isAtOriginal.set(this.originalCaptured && !this.originalImage);
    this.removed.emit();
  }

  captureOriginal(): void {
    this.originalCaptured = true;
    this.originalImage = this.image;
    this.originalCropState = this.image
      ? { zoom: this.zoom(), offsetX: this.offsetX, offsetY: this.offsetY }
      : null;
    this.isAtOriginal.set(true);
  }

  revertImage(): void {
    if (!this.originalCaptured) return;

    if (this.originalImage) {
      this.image = this.originalImage;
      this.hasImage.set(true);

      const crop = this.originalCropState;
      if (crop) {
        this.zoom.set(Math.min(this.maxZoom(), Math.max(this.minZoom(), crop.zoom)));
        this.offsetX = crop.offsetX;
        this.offsetY = crop.offsetY;
        this.clampOffset();
      } else {
        this.zoom.set(1);
        this.centerImage();
      }

      this.isAtOriginal.set(true);
      this.scheduleDrawAfterRender();
    } else {
      this.image = null;
      this.hasImage.set(false);
      this.zoom.set(1);
      this.offsetX = 0;
      this.offsetY = 0;
      this.clearCanvas();
      this.isAtOriginal.set(true);
    }
  }

  exportCrop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.image) {
        reject(new Error('No image loaded'));
        return;
      }

      const size = this.canvasSize();
      const offscreen = document.createElement('canvas');
      offscreen.width = size;
      offscreen.height = size;
      const ctx = offscreen.getContext('2d')!;

      if (this.shape() === 'circle') {
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
      }

      const { drawX, drawY, drawW, drawH } = this.getDrawParams();
      ctx.drawImage(this.image, drawX, drawY, drawW, drawH);

      offscreen.toBlob(
        blob => {
          if (blob) {
            const reader = new FileReader();
            reader.onloadend = () => {
              this.cropped.emit({ blob, dataUrl: reader.result as string });
              resolve(blob);
            };
            reader.readAsDataURL(blob);
          } else {
            reject(new Error('Canvas export failed'));
          }
        },
        this.exportType(),
        this.exportQuality(),
      );
    });
  }

  private loadFromUrl(
    url: string,
    cropState: AvatarEditorCropState | null = null,
    suppressEmit = false,
  ): void {
    this.isFetching.set(true);
    this._suppressCropStateEmit = suppressEmit;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onerror = () => {
      this.isFetching.set(false);
      this._suppressCropStateEmit = false;
    };
    img.onload = () => {
      this.image = img;
      this.hasImage.set(true);
      if (cropState) {
        this.zoom.set(Math.min(this.maxZoom(), Math.max(this.minZoom(), cropState.zoom)));
        this.offsetX = cropState.offsetX;
        this.offsetY = cropState.offsetY;
        this.clampOffset();
      } else {
        this.zoom.set(1);
        this.centerImage();
      }
      if (suppressEmit) {
        this.originalCaptured = true;
        this.originalImage = img;
        this.originalCropState = cropState
          ? { ...cropState }
          : { zoom: this.zoom(), offsetX: this.offsetX, offsetY: this.offsetY };
        this.isAtOriginal.set(true);
      }
      this.scheduleDrawAfterRender();
    };
    img.src = url;
  }

  private loadFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      this.fileError.emit('File must be an image');
      return;
    }
    if (file.size > this.maxFileSize()) {
      const maxMb = Math.round(this.maxFileSize() / (1024 * 1024));
      this.fileError.emit(`File exceeds ${maxMb} MB limit`);
      return;
    }

    this.isAtOriginal.set(false);
    this.fileSelected.emit(file);

    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        this.image = img;
        this.hasImage.set(true);
        this.zoom.set(1);
        this.centerImage();
        this.scheduleDrawAfterRender();
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  private scheduleDrawAfterRender(): void {
    afterNextRender(
      () => {
        this.draw();
        this.isFetching.set(false);
        this._suppressCropStateEmit = false;
        const canvas = this.canvasEl()?.nativeElement;
        canvas?.removeEventListener('wheel', this.boundWheel);
        canvas?.addEventListener('wheel', this.boundWheel, { passive: false });
      },
      { injector: this.injector },
    );
  }

  private centerImage(): void {
    if (!this.image) return;
    const size = this.canvasSize();
    const scale = this.getScale();
    const drawW = this.image.width * scale;
    const drawH = this.image.height * scale;
    this.offsetX = (size - drawW) / 2;
    this.offsetY = (size - drawH) / 2;
  }

  private getScale(): number {
    if (!this.image) return 1;
    const size = this.canvasSize();
    const baseScale = Math.max(size / this.image.width, size / this.image.height);
    return baseScale * this.zoom();
  }

  private getDrawParams(): {
    drawX: number;
    drawY: number;
    drawW: number;
    drawH: number;
  } {
    if (!this.image) return { drawX: 0, drawY: 0, drawW: 0, drawH: 0 };
    const scale = this.getScale();
    return {
      drawX: this.offsetX,
      drawY: this.offsetY,
      drawW: this.image.width * scale,
      drawH: this.image.height * scale,
    };
  }

  private clampOffset(): void {
    if (!this.image) return;
    const size = this.canvasSize();
    const { drawW, drawH } = this.getDrawParams();

    this.offsetX = Math.min(0, Math.max(size - drawW, this.offsetX));
    this.offsetY = Math.min(0, Math.max(size - drawH, this.offsetY));
  }

  private draw(): void {
    const canvas = this.canvasEl()?.nativeElement;
    if (!canvas || !this.image) return;

    const ctx = canvas.getContext('2d')!;
    const size = this.canvasSize();
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    const { drawX, drawY, drawW, drawH } = this.getDrawParams();
    ctx.drawImage(this.image, drawX, drawY, drawW, drawH);

    // Draw overlay mask
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, size, size);

    ctx.globalCompositeOperation = 'destination-out';
    if (this.shape() === 'circle') {
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, size, size);
    }

    ctx.globalCompositeOperation = 'destination-over';
    ctx.drawImage(this.image, drawX, drawY, drawW, drawH);
    ctx.globalCompositeOperation = 'source-over';
  }

  private emitCropStateChange(): void {
    if (this._suppressCropStateEmit) return;
    this.cropStateChange.emit({
      zoom: this.zoom(),
      offsetX: this.offsetX,
      offsetY: this.offsetY,
    });
  }

  private clearCanvas(): void {
    const canvas = this.canvasEl()?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
