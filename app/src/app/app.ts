import { AfterViewInit, Component, ElementRef, HostListener, signal, viewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { MAINTENANCE_MODE, isDevViewEnabled } from './maintenance.config';

const SCROLLBAR_HIDE_DELAY_MS = 800;
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
  protected readonly canScroll = signal(false);
  protected readonly thumbTop = signal(0);
  protected readonly thumbHeight = signal(0);

  private readonly scrollArea = viewChild.required<ElementRef<HTMLElement>>('scrollArea');
  private hideTimeout?: ReturnType<typeof setTimeout>;

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

    this.thumbHeight.set(height);
    this.thumbTop.set(top);
  }
}
