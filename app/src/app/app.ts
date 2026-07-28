import { AfterViewInit, Component, ElementRef, HostListener, signal, viewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { MAINTENANCE_MODE, isDevViewEnabled } from './maintenance.config';

const SCROLLBAR_HIDE_DELAY_MS = 800;
const HOVER_HIDE_DELAY_MS = 300;
const MIN_THUMB_HEIGHT = 40;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit {
  protected readonly maintenanceMode = MAINTENANCE_MODE && !isDevViewEnabled();
  protected readonly isScrolling = signal(false);
  protected readonly isHovering = signal(false);
  protected readonly isDragging = signal(false);
  protected readonly canScroll = signal(false);
  protected readonly trackTop = signal(0);
  protected readonly trackHeight = signal(0);
  protected readonly thumbTop = signal(0);
  protected readonly thumbHeight = signal(0);

  private readonly scrollArea = viewChild.required<ElementRef<HTMLElement>>('scrollArea');
  private hideTimeout?: ReturnType<typeof setTimeout>;
  private hoverTimeout?: ReturnType<typeof setTimeout>;
  private dragStartY = 0;
  private dragStartScrollTop = 0;

  constructor(router: Router) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => this.updateThumb(), 0);
      }
    });
  }

  ngAfterViewInit(): void {
    this.updateThumb();
  }

  @HostListener('window:resize')
  protected onResize(): void {
    this.updateThumb();
  }

  protected onScroll(): void {
    this.updateThumb();
    this.isScrolling.set(true);
    clearTimeout(this.hideTimeout);
    this.hideTimeout = setTimeout(() => this.isScrolling.set(false), SCROLLBAR_HIDE_DELAY_MS);
  }

  protected onHoverZoneEnter(): void {
    clearTimeout(this.hoverTimeout);
    this.isHovering.set(true);
  }

  protected onHoverZoneLeave(): void {
    clearTimeout(this.hoverTimeout);
    this.hoverTimeout = setTimeout(() => this.isHovering.set(false), HOVER_HIDE_DELAY_MS);
  }

  protected onThumbMouseDown(event: MouseEvent): void {
    event.preventDefault();
    const el = this.scrollArea().nativeElement;
    this.isDragging.set(true);
    this.dragStartY = event.clientY;
    this.dragStartScrollTop = el.scrollTop;
    clearTimeout(this.hideTimeout);
  }

  @HostListener('document:mousemove', ['$event'])
  protected onDocumentMouseMove(event: MouseEvent): void {
    if (!this.isDragging()) {
      return;
    }
    const el = this.scrollArea().nativeElement;
    const scrollable = el.scrollHeight - el.clientHeight;
    const travel = this.trackHeight() - this.thumbHeight();
    if (travel <= 0) {
      return;
    }
    const deltaY = event.clientY - this.dragStartY;
    const deltaScroll = (deltaY / travel) * scrollable;
    el.scrollTop = Math.min(scrollable, Math.max(0, this.dragStartScrollTop + deltaScroll));
  }

  @HostListener('document:mouseup')
  protected onDocumentMouseUp(): void {
    if (!this.isDragging()) {
      return;
    }
    this.isDragging.set(false);
    clearTimeout(this.hideTimeout);
    this.hideTimeout = setTimeout(() => this.isScrolling.set(false), SCROLLBAR_HIDE_DELAY_MS);
  }

  private updateThumb(): void {
    const el = this.scrollArea().nativeElement;
    const { clientHeight, scrollHeight, scrollTop } = el;
    const scrollable = scrollHeight - clientHeight;

    if (scrollable <= 0) {
      this.canScroll.set(false);
      return;
    }

    this.canScroll.set(true);
    const trackTop = el.getBoundingClientRect().top;
    const height = Math.max(MIN_THUMB_HEIGHT, (clientHeight / scrollHeight) * clientHeight);
    const travel = clientHeight - height;
    const top = trackTop + (scrollTop / scrollable) * travel;

    this.trackTop.set(trackTop);
    this.trackHeight.set(clientHeight);
    this.thumbHeight.set(height);
    this.thumbTop.set(top);
  }
}
