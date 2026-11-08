import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DOCS_ICONS } from '../data/icons';

// A Lucide icon by name, for the docs parts that are built from data.
@Component({
  selector: 'app-docs-icon',
  template: '',
  host: { '[innerHTML]': 'svg()', style: 'display:contents' },
})
export class DocsIcon {
  readonly name = input.required<string>();
  readonly size = input(16);
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly svg = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(
      `<svg width="${this.size()}" height="${this.size()}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${DOCS_ICONS[this.name()] ?? ''}</svg>`,
    ),
  );
}
