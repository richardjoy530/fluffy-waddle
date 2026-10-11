import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { handleCopyClick } from '../copy';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  host: { '(click)': 'onClick($event)' },
})
export class Home {
  protected onClick(event: MouseEvent): void {
    handleCopyClick(event);
  }
}
