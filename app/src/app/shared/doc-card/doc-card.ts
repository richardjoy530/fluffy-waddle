import { Component, input } from '@angular/core';

@Component({
  selector: 'app-doc-card',
  imports: [],
  templateUrl: './doc-card.html',
  styleUrl: './doc-card.scss',
})
export class DocCard {
  readonly tag = input.required<string>();
  readonly title = input.required<string>();
  readonly body = input.required<string>();
  readonly count = input.required<string>();
  readonly href = input.required<string>();
}
