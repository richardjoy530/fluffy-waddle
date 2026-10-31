import { RenderMode, ServerRoute } from '@angular/ssr';

// Every page is static, so each route is rendered to its own index.html at build time.
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
