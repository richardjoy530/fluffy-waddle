import { Component } from '@angular/core';
import { Eyebrow } from '../../shared/eyebrow/eyebrow';
import { SectionIntro } from '../../shared/section-intro/section-intro';
import { CtaSection } from '../../shared/cta-section/cta-section';

@Component({
  selector: 'app-about',
  imports: [Eyebrow, SectionIntro, CtaSection],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {}
