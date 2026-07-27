import { Component, input } from '@angular/core';

@Component({
  selector: 'app-solution-card',
  imports: [],
  templateUrl: './solution-card.html',
  styleUrl: './solution-card.scss',
})
export class SolutionCard {
  readonly tag = input.required<string>();
  readonly title = input.required<string>();
  readonly body = input.required<string>();
  readonly stack = input.required<string>();
}
