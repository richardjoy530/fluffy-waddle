import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DOCS_NODE_GROUPS, DOCS_NODES } from '../data/nodes';
import { DocsNodeCard } from '../node-card/node-card';

@Component({
  selector: 'app-docs-nodes',
  imports: [RouterLink, DocsNodeCard],
  templateUrl: './nodes.html',
})
export class DocsNodes {
  protected readonly groups = DOCS_NODE_GROUPS.map((g) => ({
    ...g,
    nodes: DOCS_NODES.filter((n) => n.group === g.id),
  }));
}
