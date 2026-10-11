import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'WBSKT · Your projects, looked after',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'features',
    title: 'Features · WBSKT',
    loadComponent: () => import('./pages/features/features').then((m) => m.Features),
  },
  {
    path: 'get-started',
    title: 'Get started · WBSKT',
    loadComponent: () => import('./pages/get-started/get-started').then((m) => m.GetStarted),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
