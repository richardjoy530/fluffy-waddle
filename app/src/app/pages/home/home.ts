import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { handleCopyClick } from '../copy';
import { FreePlan } from '../../layout/free-plan/free-plan';
import { LINKS } from '../../links';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FreePlan],
  templateUrl: './home.html',
  host: { '(click)': 'onClick($event)' },
})
export class Home {
  protected readonly links = LINKS;

  protected onClick(event: MouseEvent): void {
    handleCopyClick(event);
  }
}
