import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LINKS } from '../../links';

@Component({
  selector: 'app-plans',
  imports: [RouterLink],
  templateUrl: './plans.html',
})
export class Plans {
  protected readonly links = LINKS;
}
