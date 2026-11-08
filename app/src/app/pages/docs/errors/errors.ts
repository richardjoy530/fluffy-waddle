import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DOCS_ERROR_GROUPS, DOCS_STATUS_FILTERS, DocsStatusFilter } from '../data/errors';
import { DocsIcon } from '../icon/docs-icon';

@Component({
  selector: 'app-docs-errors',
  imports: [RouterLink, DocsIcon],
  templateUrl: './errors.html',
})
export class DocsErrors {
  protected readonly filters = DOCS_STATUS_FILTERS;
  protected readonly total = DOCS_ERROR_GROUPS.reduce((n, g) => n + g.codes.length, 0);
  protected readonly query = signal('');
  protected readonly filter = signal<DocsStatusFilter>(DOCS_STATUS_FILTERS[0]);
  private readonly tones: Record<number, string> = {
    400: 'p-blue',
    401: 'p-violet',
    403: 'p-orange',
    404: 'p-grey',
    409: 'p-amber',
    429: 'p-amber',
    500: 'p-red',
    503: 'p-red',
  };

  protected readonly groups = computed(() => {
    const words = this.query().trim().toLowerCase().split(/\s+/).filter(Boolean);
    const statuses = this.filter().statuses;
    return DOCS_ERROR_GROUPS.map((g) => ({
      ...g,
      codes: g.codes.filter((e) => {
        const text =
          `${e.code} ${e.code.replace(/_/g, ' ')} ${e.text.replace(/<[^>]+>/g, '')}`.toLowerCase();
        return (
          (!statuses.length || statuses.includes(e.status)) && words.every((w) => text.includes(w))
        );
      }),
    })).filter((g) => g.codes.length);
  });

  protected readonly shown = computed(() => this.groups().reduce((n, g) => n + g.codes.length, 0));

  protected tone(status: number): string {
    return this.tones[status] ?? 'p-grey';
  }

  protected clear(): void {
    this.query.set('');
    this.filter.set(DOCS_STATUS_FILTERS[0]);
  }
}
