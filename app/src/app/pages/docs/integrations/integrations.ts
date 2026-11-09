import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DOCS_INTEGRATIONS } from '../data/integrations';
import { DOCS_NODES } from '../data/nodes';
import { DocsIcon } from '../icon/docs-icon';

@Component({
  selector: 'app-docs-integrations',
  imports: [RouterLink, DocsIcon],
  templateUrl: './integrations.html',
})
export class DocsIntegrations {
  protected readonly integrations = DOCS_INTEGRATIONS;

  protected nodeName(slug: string): string {
    return DOCS_NODES.find((n) => n.slug === slug)?.name ?? slug;
  }
}
