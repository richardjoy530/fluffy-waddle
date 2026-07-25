import { Component, input } from '@angular/core';

@Component({
  selector: 'app-eyebrow',
  imports: [],
  templateUrl: './eyebrow.html',
  styleUrl: './eyebrow.scss',
})
export class Eyebrow {
  readonly label = input.required<string>();
}
