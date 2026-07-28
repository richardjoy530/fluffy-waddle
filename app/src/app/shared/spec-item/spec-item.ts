import { Component, input } from '@angular/core';

@Component({
  selector: 'app-spec-item',
  imports: [],
  templateUrl: './spec-item.html',
  styleUrl: './spec-item.scss',
})
export class SpecItem {
  readonly value = input.required<string>();
  readonly label = input.required<string>();
  readonly accent = input(false);
}
