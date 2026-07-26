import { Component, input } from '@angular/core';

export interface DiagramNode {
  x: number;
  y: number;
  width?: number;
  height?: number;
  label: string;
  variant?: 'default' | 'active' | 'logic' | 'highlight';
}

export interface DiagramPoint {
  x: number;
  y: number;
}

@Component({
  selector: 'app-network-diagram',
  imports: [],
  templateUrl: './network-diagram.html',
  styleUrl: './network-diagram.scss',
})
export class NetworkDiagram {
  readonly viewBox = input('0 0 340 300');
  readonly nodes = input.required<DiagramNode[]>();
  readonly wires = input.required<string>();
  readonly activeWire = input.required<string>();
  readonly pulse = input.required<DiagramPoint>();
  readonly statusLabel = input<string | null>(null);
  readonly statusState = input('EXECUTING');
}
