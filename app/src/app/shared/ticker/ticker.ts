import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-ticker',
  imports: [],
  templateUrl: './ticker.html',
  styleUrl: './ticker.scss',
})
export class Ticker {
  readonly items = input.required<string[]>();

  readonly content = computed(() => this.items().join(' ///// ') + ' ///// ');
}
