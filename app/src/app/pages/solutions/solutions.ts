import { Component } from '@angular/core';
import { SolutionCard } from '../../shared/solution-card/solution-card';

@Component({
  selector: 'app-solutions',
  imports: [SolutionCard],
  templateUrl: './solutions.html',
  styleUrl: './solutions.scss',
})
export class Solutions {}
