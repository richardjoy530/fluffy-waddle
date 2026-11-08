import { Injectable, signal } from '@angular/core';

// Whether the docs search is open, shared by the layout, the overview and the search itself.
@Injectable({ providedIn: 'root' })
export class DocsSearchState {
  readonly open = signal(false);

  show(): void {
    this.open.set(true);
  }

  hide(): void {
    this.open.set(false);
  }
}
