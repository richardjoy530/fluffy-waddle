import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { handleCopyClick } from '../../copy';

@Component({
  selector: 'app-docs-messages',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './messages.html',
  host: { '(click)': 'onClick($event)' },
})
export class DocsMessages {
  protected onClick(event: MouseEvent): void {
    handleCopyClick(event);
  }
}
