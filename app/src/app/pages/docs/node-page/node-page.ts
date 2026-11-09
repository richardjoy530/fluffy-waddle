import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DOCS_NODE_DOCS } from '../data/node-docs';
import { DOCS_NODE_GROUPS, DOCS_NODES } from '../data/nodes';
import { DocsIcon } from '../icon/docs-icon';
import { DocsNodeCard } from '../node-card/node-card';
import { DocsNodePreview } from '../node-preview/node-preview';

// One node's page, filled from its entry in data/node-docs.ts. The route names the node.
@Component({
  selector: 'app-docs-node-page',
  imports: [RouterLink, DocsIcon, DocsNodeCard, DocsNodePreview],
  templateUrl: './node-page.html',
})
export class DocsNodePage {
  private readonly slug: string = inject(ActivatedRoute).snapshot.data['node'];
  protected readonly node = DOCS_NODES.find((n) => n.slug === this.slug)!;
  protected readonly doc = DOCS_NODE_DOCS[this.slug];
  protected readonly group = DOCS_NODE_GROUPS.find((g) => g.id === this.node.group)!;
  protected readonly related = this.doc.related
    .map((s) => DOCS_NODES.find((n) => n.slug === s))
    .filter((n) => !!n);
  protected readonly pins = this.node.ports.filter((p) => !p.note).length;
}
