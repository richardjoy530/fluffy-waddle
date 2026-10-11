import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { handleCopyClick } from '../../copy';

@Component({
  selector: 'app-docs-connect',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './connect.html',
  host: { '(click)': 'onClick($event)' },
})
export class DocsConnect {
  protected onClick(event: MouseEvent): void {
    handleCopyClick(event);
  }
}
