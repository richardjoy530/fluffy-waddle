import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  template: `
    <div class="mk">
      <app-header />
      <main><router-outlet /></main>
      <app-footer />
    </div>
  `,
})
export class App {}
