import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { handleCopyClick } from '../copy';
import { Plans } from '../../layout/plans/plans';

@Component({
  selector: 'app-features',
  imports: [RouterLink, Plans],
  templateUrl: './features.html',
  host: { '(click)': 'onClick($event)' },
})
export class Features {
  protected onClick(event: MouseEvent): void {
    handleCopyClick(event);
  }
}
