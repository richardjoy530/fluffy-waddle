import { Component, computed, input } from '@angular/core';
import { DocsNode } from '../data/nodes';
import { DocsIcon } from '../icon/docs-icon';

// The node as it sits on the canvas: its input on the left and the ports it leaves by on the right.
@Component({
  selector: 'app-docs-node-preview',
  imports: [DocsIcon],
  templateUrl: './node-preview.html',
})
export class DocsNodePreview {
  readonly node = input.required<DocsNode>();
  protected readonly pins = computed(() => this.node().ports.filter((p) => !p.note));
  protected readonly label = computed(() => {
    const ports = this.pins().map((p) => p.t);
    return `${this.node().name} node, leaving by ${ports.length ? ports.join(', ') : 'no port'}`;
  });
  protected readonly hasInput = computed(() => this.node().cat !== 'trigger');
}
