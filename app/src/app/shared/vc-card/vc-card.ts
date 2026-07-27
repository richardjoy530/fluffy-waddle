import { Component, input } from '@angular/core';

@Component({
  selector: 'app-vc-card',
  imports: [],
  templateUrl: './vc-card.html',
  styleUrl: './vc-card.scss',
})
export class VcCard {
  readonly name = input.required<string>();
  readonly status = input.required<string>();
  readonly variant = input.required<'ok' | 'pending' | 'revoked'>();
}
