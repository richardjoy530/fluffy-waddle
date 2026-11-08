import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocsSearch } from '../search/docs-search';
import { DocsSearchState } from '../search/docs-search-state';

@Component({
  selector: 'app-docs-overview',
  imports: [RouterLink, DocsSearch],
  templateUrl: './overview.html',
})
export class DocsOverview {
  protected readonly search = inject(DocsSearchState);
}
