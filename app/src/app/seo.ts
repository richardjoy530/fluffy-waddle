import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

const SITE = 'https://wbskt.com';

// Keeps the description, Open Graph tags and canonical link in step with the page on show,
// so each prerendered page carries its own.
@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly router = inject(Router);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  start(): void {
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => this.apply());
  }

  private apply(): void {
    let route: ActivatedRouteSnapshot = this.router.routerState.snapshot.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    const description: string | undefined = route.data['description'];
    const path = this.router.url.split(/[?#]/)[0];
    const url = SITE + (path === '/' ? '/' : path + '/');
    const title = route.title ?? 'WBSKT';

    if (description) {
      this.meta.updateTag({ name: 'description', content: description });
      this.meta.updateTag({ property: 'og:description', content: description });
    }
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:url', content: url });

    let canonical = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.rel = 'canonical';
      this.document.head.appendChild(canonical);
    }
    canonical.href = url;
  }
}
