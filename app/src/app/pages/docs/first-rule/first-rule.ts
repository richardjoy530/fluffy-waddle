import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { handleCopyClick } from '../../copy';

@Component({
  selector: 'app-docs-first-rule',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './first-rule.html',
  host: { '(click)': 'onClick($event)' },
})
export class DocsFirstRule {
  protected onClick(event: MouseEvent): void {
    handleCopyClick(event);
  }
}
