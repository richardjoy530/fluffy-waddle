import { Routes } from '@angular/router';
import { MAINTENANCE_MODE, isDevViewEnabled } from './maintenance.config';

const maintenanceRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/maintenance/maintenance').then((m) => m.Maintenance),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

const siteRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'features',
    loadComponent: () => import('./pages/features/features').then((m) => m.Features),
  },
  {
    path: 'solutions',
    loadComponent: () => import('./pages/solutions/solutions').then((m) => m.Solutions),
  },
  {
    path: 'pricing',
    loadComponent: () => import('./pages/pricing/pricing').then((m) => m.Pricing),
  },
  {
    path: 'docs',
    loadComponent: () => import('./pages/docs/docs').then((m) => m.Docs),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/maintenance/maintenance').then((m) => m.Maintenance),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

const showMaintenance = MAINTENANCE_MODE && !isDevViewEnabled();

export const routes: Routes = showMaintenance ? maintenanceRoutes : siteRoutes;
