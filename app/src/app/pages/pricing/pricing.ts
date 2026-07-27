import { Component } from '@angular/core';
import { CtaSection } from '../../shared/cta-section/cta-section';
import { PageHero } from '../../shared/page-hero/page-hero';

@Component({
  selector: 'app-pricing',
  imports: [CtaSection, PageHero],
  templateUrl: './pricing.html',
  styleUrl: './pricing.scss',
})
export class Pricing {}
