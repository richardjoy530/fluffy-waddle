import { Component } from '@angular/core';
import { handleCopyClick } from '../copy';

@Component({
  selector: 'app-get-started',
  templateUrl: './get-started.html',
  host: { '(click)': 'onClick($event)' },
})
export class GetStarted {
  protected onClick(event: MouseEvent): void {
    handleCopyClick(event);
  }
}
