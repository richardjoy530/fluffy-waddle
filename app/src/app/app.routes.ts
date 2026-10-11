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
    path: 'privacy',
    title: 'Privacy · WBSKT',
    loadComponent: () => import('./pages/privacy/privacy').then((m) => m.Privacy),
  },
  {
    path: 'docs',
    pathMatch: 'full',
    redirectTo: 'docs/connect',
  },
  {
    path: 'docs/connect',
    title: 'Connect a board · WBSKT docs',
    loadComponent: () => import('./pages/docs/connect/connect').then((m) => m.DocsConnect),
  },
  {
    path: 'docs/first-rule',
    title: 'Your first rule · WBSKT docs',
    loadComponent: () => import('./pages/docs/first-rule/first-rule').then((m) => m.DocsFirstRule),
  },
  {
    path: 'docs/messages',
    title: 'Readings and commands · WBSKT docs',
    loadComponent: () => import('./pages/docs/messages/messages').then((m) => m.DocsMessages),
  },
  {
    path: 'docs/troubleshooting',
    title: 'Troubleshooting · WBSKT docs',
    loadComponent: () => import('./pages/docs/troubleshooting/troubleshooting').then((m) => m.DocsTroubleshooting),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
