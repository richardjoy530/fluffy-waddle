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
      withNavigationErrorHandler((error: NavigationError) => {
        if (isPlatformBrowser(inject(PLATFORM_ID))) {
          location.assign(error.url);
        }
      }),
    ),
  ],
};
