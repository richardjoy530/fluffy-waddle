import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly navLinks = [
    { path: '/features', label: 'Features' },
    { path: '/solutions', label: 'Solutions' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/docs', label: 'Docs' },
    { path: '/about', label: 'About' },
  ];
}
