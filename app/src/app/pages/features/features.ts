import { Component } from '@angular/core';
import { NetworkDiagram } from '../../shared/network-diagram/network-diagram';
import { VcCard } from '../../shared/vc-card/vc-card';
import { Terminal } from '../../shared/terminal/terminal';
import { CtaSection } from '../../shared/cta-section/cta-section';
import { PageHero } from '../../shared/page-hero/page-hero';

@Component({
  selector: 'app-features',
  imports: [NetworkDiagram, VcCard, Terminal, CtaSection, PageHero],
  templateUrl: './features.html',
  styleUrl: './features.scss',
})
export class Features {}
