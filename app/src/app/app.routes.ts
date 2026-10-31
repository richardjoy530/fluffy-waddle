import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'WBSKT · Your projects, looked after',
    data: { description: "Connect a board and build rules that wait, check and act, then message you. They keep going through Wi-Fi drops and restarts. Free for good." },
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'features',
    title: 'Features · WBSKT',
    data: { description: "Live two-way messages, uptime, policies, a visual workflow builder, integrations, an audit log and team members. Every feature is free." },
    loadComponent: () => import('./pages/features/features').then((m) => m.Features),
  },
  {
    path: 'get-started',
    title: 'Get started · WBSKT',
    data: { description: "Get your first board online with WBSKT: copy a policy PIN, add a few lines to your sketch and set your first rule." },
    loadComponent: () => import('./pages/get-started/get-started').then((m) => m.GetStarted),
  },
  {
    path: 'privacy',
    title: 'Privacy · WBSKT',
    data: { description: "What WBSKT keeps, how long it keeps it, and who else sees it. No ads, no tracking, no selling your data." },
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
    data: { description: "How a board joins WBSKT with a name and a policy PIN, how approval works, and how it stays connected." },
    loadComponent: () => import('./pages/docs/connect/connect').then((m) => m.DocsConnect),
  },
  {
    path: 'docs/first-rule',
    title: 'Your first rule · WBSKT docs',
    data: { description: "Build your first WBSKT workflow: pick what starts it, add a check, and say what happens." },
    loadComponent: () => import('./pages/docs/first-rule/first-rule').then((m) => m.DocsFirstRule),
  },
  {
    path: 'docs/messages',
    title: 'Readings and commands · WBSKT docs',
    data: { description: "How readings travel from your board to WBSKT, and how commands travel back to it." },
    loadComponent: () => import('./pages/docs/messages/messages').then((m) => m.DocsMessages),
  },
  {
    path: 'docs/troubleshooting',
    title: 'Troubleshooting · WBSKT docs',
    data: { description: "What to check when a board won't connect, a rule doesn't fire, or a message doesn't arrive." },
    loadComponent: () => import('./pages/docs/troubleshooting/troubleshooting').then((m) => m.DocsTroubleshooting),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
