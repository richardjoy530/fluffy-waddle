import { Component, input } from '@angular/core';

@Component({
  selector: 'app-capability-card',
  imports: [],
  templateUrl: './capability-card.html',
  styleUrl: './capability-card.scss',
})
export class CapabilityCard {
  readonly label = input.required<string>();
  readonly heading = input.required<string>();
  readonly body = input.required<string>();
}
