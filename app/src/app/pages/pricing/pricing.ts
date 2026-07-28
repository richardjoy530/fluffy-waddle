import { Component } from '@angular/core';
import { CtaSection } from '../../shared/cta-section/cta-section';
import { PageHero } from '../../shared/page-hero/page-hero';
import { SectionIntro } from '../../shared/section-intro/section-intro';

@Component({
  selector: 'app-pricing',
  imports: [CtaSection, PageHero, SectionIntro],
  templateUrl: './pricing.html',
  styleUrl: './pricing.scss',
})
export class Pricing {}
