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
    title: 'wbskt — live connections and durable workflows for connected equipment',
    loadComponent: () => import('./pages/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'features',
    title: 'Features — wbskt',
    loadComponent: () => import('./pages/features/features').then((m) => m.Features),
  },
  {
    path: 'solutions',
    title: 'Who it\'s for — wbskt',
    loadComponent: () => import('./pages/solutions/solutions').then((m) => m.Solutions),
  },
  {
    path: 'pricing',
    title: 'Pricing — wbskt',
    loadComponent: () => import('./pages/pricing/pricing').then((m) => m.Pricing),
  },
  {
    path: 'docs',
    title: 'Documentation — wbskt',
    loadComponent: () => import('./pages/docs/docs').then((m) => m.Docs),
  },
  {
    path: 'about',
    title: 'About — wbskt',
    loadComponent: () => import('./pages/about/about').then((m) => m.About),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

const showMaintenance = MAINTENANCE_MODE && !isDevViewEnabled();

export const routes: Routes = showMaintenance ? maintenanceRoutes : siteRoutes;
