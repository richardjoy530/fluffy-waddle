import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocsIcon } from '../icon/docs-icon';

@Component({
  selector: 'app-docs-mqtt',
  imports: [RouterLink, DocsIcon],
  templateUrl: './mqtt.html',
})
export class DocsMqtt {}
