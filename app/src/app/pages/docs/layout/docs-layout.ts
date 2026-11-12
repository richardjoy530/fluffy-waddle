import {
  Component,
  DestroyRef,
  PLATFORM_ID,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { DOCS_NAV, DOCS_PAGES, DocsLink, DocsNavItem, DocsSubgroup, isDocsSubgroup } from '../docs-nav';
import { DOCS_SECTIONS } from '../docs-sections';
import { DocsIcon } from '../icon/docs-icon';
import { DocsSearch } from '../search/docs-search';
import { DocsSearchState } from '../search/docs-search-state';
import { handleCopyClick } from '../../copy';

// The frame every docs page sits in: the grouped sidebar, the breadcrumb, "On this page",
// previous/next links and search.
@Component({
  selector: 'app-docs-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, DocsIcon, DocsSearch],
  templateUrl: './docs-layout.html',
  host: { '(click)': 'onClick($event)' },
})
export class DocsLayout {
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly search = inject(DocsSearchState);
  protected readonly nav = DOCS_NAV;
  protected readonly path = signal(this.cleanPath(this.router.url));
  protected readonly menuOpen = signal(false);
  protected readonly activeSection = signal('');
  // Sub-groups the reader folded or unfolded; the current page's sub-group starts open.
  private readonly toggled = signal<Record<string, boolean>>({});

  protected readonly page = computed(() => DOCS_PAGES.find((p) => p.path === this.path()));
  protected readonly sections = computed(() => DOCS_SECTIONS[this.path()] ?? []);
  protected readonly prev = computed(() => this.neighbour(-1));
  protected readonly next = computed(() => this.neighbour(1));

  private observer?: IntersectionObserver;

  constructor() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        this.path.set(this.cleanPath(this.router.url));
        this.menuOpen.set(false);
        if (this.isBrowser) {
          setTimeout(() => this.watchSections());
        }
      });
    afterNextRender(() => this.watchSections());
    inject(DestroyRef).onDestroy(() => this.observer?.disconnect());
  }

  // A sub-group starts open when it holds the current page.
  protected isOpen(id: string): boolean {
    return this.toggled()[id] ?? this.page()?.sub?.id === id;
  }

  protected asSub(item: DocsNavItem): DocsSubgroup | null {
    return isDocsSubgroup(item) ? item : null;
  }

  protected asLink(item: DocsNavItem): DocsLink | null {
    return isDocsSubgroup(item) ? null : item;
  }

  protected toggle(subId: string): void {
    this.toggled.update((t) => ({ ...t, [subId]: !this.isOpen(subId) }));
  }

  protected onClick(event: MouseEvent): void {
    handleCopyClick(event);
  }

  private neighbour(step: number) {
    const i = DOCS_PAGES.findIndex((p) => p.path === this.path());
    return i < 0 ? undefined : DOCS_PAGES[i + step];
  }

  private cleanPath(url: string): string {
    return url.split(/[?#]/)[0].replace(/\/$/, '') || '/';
  }

  // Marks the section being read in "On this page".
  private watchSections(): void {
    this.observer?.disconnect();
    const ids = this.sections().map((s) => s.id);
    this.activeSection.set(ids[0] ?? '');
    if (!ids.length || typeof IntersectionObserver === 'undefined') {
      return;
    }
    const visible = new Set<string>();
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            visible.add(e.target.id);
          } else {
            visible.delete(e.target.id);
          }
        }
        const first = ids.find((id) => visible.has(id));
        if (first) {
          this.activeSection.set(first);
        }
      },
      { rootMargin: '-80px 0px -55% 0px' },
    );
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) {
        this.observer.observe(el);
      }
    }
  }
}
