import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewEncapsulation,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

export type AvatarEditorShape = 'circle' | 'square';

export interface AvatarEditorCropEvent {
  blob: Blob;
  dataUrl: string;
}

@Component({
  selector: 'ea-avatar-editor',
  imports: [NgClass],
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
  readonly accept = input<string>('image/*');
  readonly maxFileSize = input<number>(5 * 1024 * 1024); // 5 MB
  readonly minZoom = input<number>(1);
  readonly maxZoom = input<number>(3);
  readonly exportQuality = input<number>(0.92);
  readonly exportType = input<string>('image/png');

  readonly cropped = output<AvatarEditorCropEvent>();
  readonly fileError = output<string>();

  readonly hasImage = signal(false);
  readonly isDragOver = signal(false);
  readonly zoom = signal(1);

  private image: HTMLImageElement | null = null;
  private offsetX = 0;
  private offsetY = 0;
  private dragStartX = 0;
  private dragStartY = 0;
  private isDragging = false;
  private initialOffsetX = 0;
  private initialOffsetY = 0;

  readonly hostClasses = computed(() => ({
    [`ea-avatar-editor--${this.shape()}`]: true,
    'ea-avatar-editor--has-image': this.hasImage(),
    'ea-avatar-editor--drag-over': this.isDragOver(),
  }));

  private readonly boundWheel = (e: WheelEvent) => this.onWheel(e);

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
    this.offsetX = this.initialOffsetX + dx;
    this.offsetY = this.initialOffsetY + dy;
    this.clampOffset();
    this.draw();
  }

  private onMouseUp(): void {
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
    this.offsetX = this.initialOffsetX + dx;
    this.offsetY = this.initialOffsetY + dy;
    this.clampOffset();
    this.draw();
  }

  private onTouchEnd(): void {
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
    const clamped = Math.min(this.maxZoom(), Math.max(this.minZoom(), value));
    this.zoom.set(Math.round(clamped * 100) / 100);
    this.clampOffset();
    this.draw();
  }

  onZoomInput(event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    this.setZoom(value);
  }

  removeImage(): void {
    this.image = null;
    this.hasImage.set(false);
    this.zoom.set(1);
    this.offsetX = 0;
    this.offsetY = 0;
    this.clearCanvas();
  }

  exportCrop(): void {
    if (!this.image) return;

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
          };
          reader.readAsDataURL(blob);
        }
      },
      this.exportType(),
      this.exportQuality(),
    );
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

    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        this.image = img;
        this.hasImage.set(true);
        this.zoom.set(1);
        this.centerImage();
        this.draw();

        const canvas = this.canvasEl()?.nativeElement;
        canvas?.removeEventListener('wheel', this.boundWheel);
        canvas?.addEventListener('wheel', this.boundWheel, { passive: false });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
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

  private clearCanvas(): void {
    const canvas = this.canvasEl()?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
