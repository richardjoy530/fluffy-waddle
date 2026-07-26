import { Component } from '@angular/core';
import { Ticker } from '../../shared/ticker/ticker';
import { Eyebrow } from '../../shared/eyebrow/eyebrow';
import { CapabilityCard } from '../../shared/capability-card/capability-card';
import { NetworkDiagram } from '../../shared/network-diagram/network-diagram';

@Component({
  selector: 'app-landing',
  imports: [Ticker, Eyebrow, CapabilityCard, NetworkDiagram],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {

}
