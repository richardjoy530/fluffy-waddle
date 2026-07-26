import { Component } from '@angular/core';
import { Ticker } from '../../shared/ticker/ticker';
import { Eyebrow } from '../../shared/eyebrow/eyebrow';

@Component({
  selector: 'app-landing',
  imports: [Ticker, Eyebrow],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {

}
