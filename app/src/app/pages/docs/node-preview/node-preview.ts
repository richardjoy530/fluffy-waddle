import { Component, computed, input } from '@angular/core';
import { DocsNode } from '../data/nodes';
import { DocsIcon } from '../icon/docs-icon';

// The step as the console draws it on the canvas: a sample name, its summary lines and the ports it leaves by.
@Component({
  selector: 'app-docs-node-preview',
  imports: [DocsIcon],
  templateUrl: './node-preview.html',
})
export class DocsNodePreview {
  readonly node = input.required<DocsNode>();

  // One plain way out is drawn as a dot on the card's edge; anything more is listed with labels.
  protected readonly ports = computed(() => {
    const n = this.node();
    const labels = n.sample.ports ?? n.ports.filter((p) => !p.note).map((p) => p.label ?? (p.t === 'default' ? 'next' : p.t));
    if (labels.length === 1 && labels[0] === 'next') {
      return [];
    }
    return labels.map((label) => ({
      label,
      error: label === 'error' || label === 'failed',
      alt: label === 'timed out' || label === 'timeout' || label === 'empty' || label === 'no',
    }));
  });
  protected readonly hasOut = computed(() => this.node().ports.some((p) => !p.note));
  protected readonly hasInput = computed(() => this.node().group !== 'start');
  protected readonly label = computed(() => {
    const n = this.node();
    const ports = this.ports().map((p) => p.label);
    const out = ports.length ? `leaving by ${ports.join(', ')}` : this.hasOut() ? 'with one way out' : 'with no way out';
    return `${n.name} step named ${n.sample.name} on the canvas, ${out}`;
  });
}
