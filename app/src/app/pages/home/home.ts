import { Component } from '@angular/core';
import { handleCopyClick } from '../copy';
import { Plans } from '../../layout/plans/plans';
import { LINKS } from '../../links';
import { Mark } from '../../layout/mark/mark';

@Component({
  selector: 'app-home',
  imports: [Plans, Mark],
  templateUrl: './home.html',
  host: { '(click)': 'onClick($event)' },
})
export class Home {
  protected readonly links = LINKS;

  protected onClick(event: MouseEvent): void {
    handleCopyClick(event);
  }
}
