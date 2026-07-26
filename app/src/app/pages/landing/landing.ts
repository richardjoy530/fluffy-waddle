import { Component } from '@angular/core';
import { Ticker } from '../../shared/ticker/ticker';
import { Eyebrow } from '../../shared/eyebrow/eyebrow';
import { CapabilityCard } from '../../shared/capability-card/capability-card';

@Component({
  selector: 'app-landing',
  imports: [Ticker, Eyebrow, CapabilityCard],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {

}
