import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LINKS } from '../../links';
import { Mark } from '../mark/mark';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, Mark],
  template: `
    <footer>
      <div class="wrap">
        <a class="logo" routerLink="/"><i><app-mark /></i>WBSKT</a>
        <span class="copy">Made for makers · © {{ year }}</span>
        <span class="sp"></span>
        <span class="fl2">
          <a [href]="links.github">GitHub</a>
          <a routerLink="/docs">Docs</a>
          <a routerLink="/privacy">Privacy</a>
          <a routerLink="/terms">Terms</a>
        </span>
      </div>
    </footer>
  `,
})
export class Footer {
  protected readonly links = LINKS;
  protected readonly year = new Date().getFullYear();
}
