import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocsNode } from '../data/nodes';
import { DocsIcon } from '../icon/docs-icon';

// One node as a card that opens its page, on the node reference and under "See also".
@Component({
  selector: 'app-docs-node-card',
  imports: [RouterLink, DocsIcon],
  templateUrl: './node-card.html',
  host: { style: 'display: contents' },
})
export class DocsNodeCard {
  readonly node = input.required<DocsNode>();
}
