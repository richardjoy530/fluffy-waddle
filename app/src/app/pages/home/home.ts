import { Component } from '@angular/core';
import { handleCopyClick } from '../copy';
import { FreePlan } from '../../layout/free-plan/free-plan';
import { LINKS } from '../../links';
import { Mark } from '../../layout/mark/mark';

@Component({
  selector: 'app-home',
  imports: [FreePlan, Mark],
  templateUrl: './home.html',
  host: { '(click)': 'onClick($event)' },
})
export class Home {
  protected readonly links = LINKS;

  protected onClick(event: MouseEvent): void {
    handleCopyClick(event);
  }
}
