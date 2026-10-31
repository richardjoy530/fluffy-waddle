import { Component } from '@angular/core';
import { handleCopyClick } from '../copy';
import { LINKS } from '../../links';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.html',
  host: { '(click)': 'onClick($event)' },
})
export class GetStarted {
  protected readonly links = LINKS;

  protected onClick(event: MouseEvent): void {
    handleCopyClick(event);
  }
}
