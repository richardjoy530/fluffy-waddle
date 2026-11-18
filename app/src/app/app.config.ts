import {
  ApplicationConfig,
  PLATFORM_ID,
  inject,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  NavigationError,
  provideRouter,
  withInMemoryScrolling,
  withNavigationErrorHandler,
} from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(withEventReplay()),
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
      // A tab opened before a deploy asks for page chunks that no longer exist; load the page fresh instead.
      // Never for the page already open, so a page that fails on its own load can't reload forever.
      withNavigationErrorHandler((error: NavigationError) => {
        const path = (url: string) => url.split(/[?#]/)[0].replace(/\/$/, '');
        if (isPlatformBrowser(inject(PLATFORM_ID)) && path(error.url) !== path(location.pathname)) {
          location.assign(error.url);
        }
      }),
    ),
  ],
};
