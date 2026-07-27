import { Component, input } from '@angular/core';

@Component({
  selector: 'app-cta-section',
  imports: [],
  templateUrl: './cta-section.html',
  styleUrl: './cta-section.scss',
})
export class CtaSection {
  readonly title = input.required<string>();
  readonly primaryLabel = input.required<string>();
  readonly primaryHref = input.required<string>();
  readonly secondaryLabel = input.required<string>();
  readonly secondaryHref = input.required<string>();
}
