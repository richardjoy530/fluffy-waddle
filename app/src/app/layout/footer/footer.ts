import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LINKS } from '../../links';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer>
      <div class="wrap">
        <a class="logo" routerLink="/"><i>w</i>WBSKT</a>
        <span class="copy">Made for makers · © {{ year }}</span>
        <span class="sp"></span>
        <span class="fl2">
          <a [href]="links.github">GitHub</a>
          <a routerLink="/docs">Docs</a>
          <a routerLink="/privacy">Privacy</a>
        </span>
      </div>
    </footer>
  `,
})
export class Footer {
  protected readonly links = LINKS;
  protected readonly year = new Date().getFullYear();
}
