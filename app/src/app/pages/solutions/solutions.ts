import { Component } from '@angular/core';
import { SolutionCard } from '../../shared/solution-card/solution-card';
import { Eyebrow } from '../../shared/eyebrow/eyebrow';
import { Terminal } from '../../shared/terminal/terminal';
import { CtaSection } from '../../shared/cta-section/cta-section';

@Component({
  selector: 'app-solutions',
  imports: [SolutionCard, Eyebrow, Terminal, CtaSection],
  templateUrl: './solutions.html',
  styleUrl: './solutions.scss',
})
export class Solutions {}
