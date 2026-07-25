import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Brand } from '../../shared/brand/brand';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, Brand],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {}
