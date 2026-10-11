import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { handleCopyClick } from '../../copy';

@Component({
  selector: 'app-docs-troubleshooting',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './troubleshooting.html',
  host: { '(click)': 'onClick($event)' },
})
export class DocsTroubleshooting {
  protected onClick(event: MouseEvent): void {
    handleCopyClick(event);
  }
}
