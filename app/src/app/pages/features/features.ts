import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { handleCopyClick } from '../copy';

@Component({
  selector: 'app-features',
  imports: [RouterLink],
  templateUrl: './features.html',
  host: { '(click)': 'onClick($event)' },
})
export class Features {
  protected onClick(event: MouseEvent): void {
    handleCopyClick(event);
  }
}
