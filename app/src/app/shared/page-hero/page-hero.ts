import { Component, input } from '@angular/core';
import { Eyebrow } from '../eyebrow/eyebrow';

@Component({
  selector: 'app-page-hero',
  imports: [Eyebrow],
  templateUrl: './page-hero.html',
  styleUrl: './page-hero.scss',
})
export class PageHero {
  readonly eyebrowLabel = input.required<string>();
  readonly titlePrefix = input.required<string>();
  readonly titleAccent = input.required<string>();
  readonly sub = input<string | null>(null);
  readonly maxWidth = input('14ch');
}
