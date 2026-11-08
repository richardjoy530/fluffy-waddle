import { Component } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DOCS_NODES, DocsNode } from '../data/nodes';
import { DocsIcon } from '../icon/docs-icon';

@Component({
  selector: 'app-docs-nodes',
  imports: [RouterLink, NgTemplateOutlet, DocsIcon],
  templateUrl: './nodes.html',
})
export class DocsNodes {
  protected readonly triggers = DOCS_NODES.filter((n) => n.cat === 'trigger');
  protected readonly control = DOCS_NODES.filter((n) => n.cat === 'control');
  protected readonly actions = DOCS_NODES.filter((n) => n.cat === 'action');

  protected anchor(node: DocsNode): string {
    return node.kind.replace(':', '-');
  }
}
