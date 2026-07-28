import { Component } from '@angular/core';
import { Eyebrow } from '../../shared/eyebrow/eyebrow';
import { DocCard } from '../../shared/doc-card/doc-card';
import { Terminal } from '../../shared/terminal/terminal';

@Component({
  selector: 'app-docs',
  imports: [Eyebrow, DocCard, Terminal],
  templateUrl: './docs.html',
  styleUrl: './docs.scss',
})
export class Docs {}
