import { Component, input } from '@angular/core';

@Component({
  selector: 'app-section-intro',
  imports: [],
  templateUrl: './section-intro.html',
  styleUrl: './section-intro.scss',
})
export class SectionIntro {
  readonly label = input.required<string>();
  readonly heading = input.required<string>();
}
