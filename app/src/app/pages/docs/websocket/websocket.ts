import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocsIcon } from '../icon/docs-icon';

@Component({
  selector: 'app-docs-websocket',
  imports: [RouterLink, DocsIcon],
  templateUrl: './websocket.html',
})
export class DocsWebsocket {}
