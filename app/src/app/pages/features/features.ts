import { Component } from '@angular/core';
import { NetworkDiagram } from '../../shared/network-diagram/network-diagram';
import { Eyebrow } from '../../shared/eyebrow/eyebrow';

@Component({
  selector: 'app-features',
  imports: [NetworkDiagram, Eyebrow],
  templateUrl: './features.html',
  styleUrl: './features.scss',
})
export class Features {}
