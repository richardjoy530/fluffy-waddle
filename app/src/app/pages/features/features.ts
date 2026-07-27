import { Component } from '@angular/core';
import { NetworkDiagram } from '../../shared/network-diagram/network-diagram';
import { Eyebrow } from '../../shared/eyebrow/eyebrow';
import { VcCard } from '../../shared/vc-card/vc-card';
import { Terminal } from '../../shared/terminal/terminal';
import { CtaSection } from '../../shared/cta-section/cta-section';

@Component({
  selector: 'app-features',
  imports: [NetworkDiagram, Eyebrow, VcCard, Terminal, CtaSection],
  templateUrl: './features.html',
  styleUrl: './features.scss',
})
export class Features {}
