import { Component } from '@angular/core';
import { LINKS } from '../../links';

@Component({
  selector: 'app-free-plan',
  templateUrl: './free-plan.html',
})
export class FreePlan {
  protected readonly links = LINKS;
}
