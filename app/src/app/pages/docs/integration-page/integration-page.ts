import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DOCS_INTEGRATIONS } from '../data/integrations';
import { DOCS_NODES } from '../data/nodes';
import { DocsIcon } from '../icon/docs-icon';
import { DocsNodeCard } from '../node-card/node-card';

// One integration type's page, filled from data/integrations.ts. The route names the type.
@Component({
  selector: 'app-docs-integration-page',
  imports: [RouterLink, DocsIcon, DocsNodeCard],
  templateUrl: './integration-page.html',
})
export class DocsIntegrationPage {
  private readonly slug: string = inject(ActivatedRoute).snapshot.data['integration'];
  protected readonly it = DOCS_INTEGRATIONS.find((i) => i.slug === this.slug)!;
  protected readonly nodes = this.it.nodes
    .map((s) => DOCS_NODES.find((n) => n.slug === s))
    .filter((n) => !!n);
  protected readonly secrets = this.it.fields.filter((f) => f.secret).length;
}
