import { Component } from '@angular/core';
import { Eyebrow } from '../../shared/eyebrow/eyebrow';
import { SectionIntro } from '../../shared/section-intro/section-intro';
import { SpecItem } from '../../shared/spec-item/spec-item';

@Component({
  selector: 'app-about',
  imports: [Eyebrow, SectionIntro, SpecItem],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {}
