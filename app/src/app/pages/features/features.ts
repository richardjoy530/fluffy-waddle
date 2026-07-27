import { Component } from '@angular/core';
import { NetworkDiagram } from '../../shared/network-diagram/network-diagram';
import { Eyebrow } from '../../shared/eyebrow/eyebrow';
import { VcCard } from '../../shared/vc-card/vc-card';
import { Terminal } from '../../shared/terminal/terminal';

@Component({
  selector: 'app-features',
  imports: [NetworkDiagram, Eyebrow, VcCard, Terminal],
  templateUrl: './features.html',
  styleUrl: './features.scss',
})
export class Features {}
