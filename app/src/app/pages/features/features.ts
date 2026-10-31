import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { handleCopyClick } from '../copy';
import { FreePlan } from '../../layout/free-plan/free-plan';

@Component({
  selector: 'app-features',
  imports: [RouterLink, FreePlan],
  templateUrl: './features.html',
  host: { '(click)': 'onClick($event)' },
})
export class Features {
  protected onClick(event: MouseEvent): void {
    handleCopyClick(event);
  }
}
