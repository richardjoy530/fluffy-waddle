import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DOCS_NODES } from '../data/nodes';
import { DocsIcon } from '../icon/docs-icon';
import { DocsNodeCard } from '../node-card/node-card';
import { DocsNodePreview } from '../node-preview/node-preview';

// Send to client has a hand-written page for its board-side samples; the rest are in data/node-docs.ts.
@Component({
  selector: 'app-docs-send-to-client',
  imports: [RouterLink, DocsIcon, DocsNodeCard, DocsNodePreview],
  templateUrl: './send-to-client.html',
})
export class DocsSendToClient {
  protected readonly node = DOCS_NODES.find((n) => n.slug === 'send-to-client')!;
  protected readonly related = ['client-message', 'wait', 'if']
    .map((s) => DOCS_NODES.find((n) => n.slug === s))
    .filter((n) => !!n);
}
