import { Component, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CLOSE_ICON, MENU_ICON } from '../icons';
import { LINKS } from '../../links';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
})
export class Header {
  protected readonly links = LINKS;
  protected readonly open = signal(false);
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly menuIcon = this.sanitizer.bypassSecurityTrustHtml(MENU_ICON);
  protected readonly closeIcon = this.sanitizer.bypassSecurityTrustHtml(CLOSE_ICON);

  constructor() {
    inject(Router).events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.open.set(false);
      }
    });
  }
}
