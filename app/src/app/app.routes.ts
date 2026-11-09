import { Routes } from '@angular/router';
import { DOCS_INTEGRATIONS } from './pages/docs/data/integrations';
import { DOCS_NODE_RENAMES, DOCS_NODES } from './pages/docs/data/nodes';

export const routes: Routes = [
  {
    path: '',
    title: 'WBSKT · Your projects, looked after',
    data: {
      description:
        'Connect a board and build rules that wait, check and act, then message you. They keep going through Wi-Fi drops and restarts. Free for good.',
    },
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'features',
    title: 'Features · WBSKT',
    data: {
      description:
        'Live two-way messages, uptime, policies, a visual workflow builder, integrations, an audit log and team members. Every feature is free.',
    },
    loadComponent: () => import('./pages/features/features').then((m) => m.Features),
  },
  {
    path: 'get-started',
    title: 'Get started · WBSKT',
    data: {
      description:
        'Get your first board online with WBSKT: copy a policy PIN, add a few lines to your sketch and set your first rule.',
    },
    loadComponent: () => import('./pages/get-started/get-started').then((m) => m.GetStarted),
  },
  {
    path: 'privacy',
    title: 'Privacy · WBSKT',
    data: {
      description:
        'What WBSKT keeps, how long it keeps it, and who else sees it. No ads, no tracking, no selling your data.',
    },
    loadComponent: () => import('./pages/privacy/privacy').then((m) => m.Privacy),
  },
  {
    path: 'docs',
    pathMatch: 'full',
    title: 'Docs · WBSKT',
    data: {
      description:
        'Everything WBSKT does, written down: connecting boards, workflows and every node, integrations, the protocol, error codes, SDKs, teams and plans.',
    },
    loadComponent: () => import('./pages/docs/overview/overview').then((m) => m.DocsOverview),
  },
  {
    path: 'docs',
    loadComponent: () => import('./pages/docs/layout/docs-layout').then((m) => m.DocsLayout),
    children: [
      {
        path: 'connect',
        title: 'Connect a board · WBSKT docs',
        data: {
          description:
            'How a board joins WBSKT with a name and a policy PIN, how approval works, and how it stays connected.',
        },
        loadComponent: () => import('./pages/docs/connect/connect').then((m) => m.DocsConnect),
      },
      {
        path: 'messages',
        title: 'Readings and commands · WBSKT docs',
        data: {
          description:
            'How readings travel from your board to WBSKT, how commands travel back, and how to report state.',
        },
        loadComponent: () => import('./pages/docs/messages/messages').then((m) => m.DocsMessages),
      },
      {
        path: 'first-rule',
        title: 'Your first rule · WBSKT docs',
        data: {
          description:
            'Build your first WBSKT workflow: pick what starts it, add a check, and say what happens.',
        },
        loadComponent: () =>
          import('./pages/docs/first-rule/first-rule').then((m) => m.DocsFirstRule),
      },
      {
        path: 'nodes',
        title: 'Node reference · WBSKT docs',
        data: {
          description:
            'All 24 workflow nodes: what each one does, the ports it leaves by and what it costs in credits.',
        },
        loadComponent: () => import('./pages/docs/nodes/nodes').then((m) => m.DocsNodes),
      },
      {
        path: 'nodes/send-to-client',
        title: 'Send to client · WBSKT docs',
        data: {
          description:
            'The Send to client node: its settings, its acked, failed and timeout ports, and how a board answers it.',
        },
        loadComponent: () =>
          import('./pages/docs/send-to-client/send-to-client').then((m) => m.DocsSendToClient),
      },
      // Every other node and every integration type has a page filled from its data file.
      ...DOCS_NODES.filter((n) => n.slug !== 'send-to-client').map((n) => ({
        path: `nodes/${n.slug}`,
        title: `${n.name} node · WBSKT docs`,
        data: { node: n.slug, description: `The ${n.name} node in WBSKT workflows. ${n.desc}` },
        loadComponent: () => import('./pages/docs/node-page/node-page').then((m) => m.DocsNodePage),
      })),
      ...Object.entries(DOCS_NODE_RENAMES).map(([from, to]) => ({
        path: `nodes/${from}`,
        redirectTo: `/docs/nodes/${to}`,
      })),
      {
        path: 'integrations',
        title: 'Integrations · WBSKT docs',
        data: {
          description:
            'Connect Telegram, Discord, email, ntfy, HTTP APIs and Home Assistant once per workspace, then use them from any workflow.',
        },
        loadComponent: () =>
          import('./pages/docs/integrations/integrations').then((m) => m.DocsIntegrations),
      },
      ...DOCS_INTEGRATIONS.map((i) => ({
        path: `integrations/${i.slug}`,
        title: `${i.name} integration · WBSKT docs`,
        data: { integration: i.slug, description: `Connect ${i.name} to WBSKT. ${i.blurb}` },
        loadComponent: () =>
          import('./pages/docs/integration-page/integration-page').then((m) => m.DocsIntegrationPage),
      })),
      {
        path: 'communication',
        title: 'How messages travel · WBSKT docs',
        data: {
          description:
            'Every way data moves in and out of WBSKT: readings, commands, state, webhooks, callbacks, notifications and the API.',
        },
        loadComponent: () =>
          import('./pages/docs/communication/communication').then((m) => m.DocsCommunication),
      },
      {
        path: 'members',
        title: 'Workspaces and members · WBSKT docs',
        data: {
          description:
            'Workspaces, inviting members, the User and Admin roles and the 23 permissions a role can grant.',
        },
        loadComponent: () => import('./pages/docs/members/members').then((m) => m.DocsMembers),
      },
      {
        path: 'billing',
        title: 'Plans and billing · WBSKT docs',
        data: {
          description:
            'What each WBSKT plan includes, how credits are counted per node, and what happens when you reach a limit.',
        },
        loadComponent: () => import('./pages/docs/billing/billing').then((m) => m.DocsBilling),
      },
      {
        path: 'protocol',
        title: 'Client protocol · WBSKT docs',
        data: {
          description:
            'How any client talks to WBSKT over any gateway: registering, logging in, messages, reserved types, limits and reconnects.',
        },
        loadComponent: () => import('./pages/docs/protocol/protocol').then((m) => m.DocsProtocol),
      },
      {
        path: 'protocol/websocket',
        title: 'WebSocket gateway · WBSKT docs',
        data: {
          description:
            'Connecting a client over WebSocket: the upgrade and its refusals, frames, keepalive and close codes.',
        },
        loadComponent: () => import('./pages/docs/websocket/websocket').then((m) => m.DocsWebsocket),
      },
      {
        path: 'errors',
        title: 'Error codes · WBSKT docs',
        data: {
          description:
            'Every error code the WBSKT API and gateway return, what each one means and what to do about it.',
        },
        loadComponent: () => import('./pages/docs/errors/errors').then((m) => m.DocsErrors),
      },
      {
        path: 'sdks',
        title: 'SDKs · WBSKT docs',
        data: {
          description:
            'The WBSKT libraries for ESP32 and Arduino, .NET and Python, what each one does, and how to write your own client.',
        },
        loadComponent: () => import('./pages/docs/sdks/sdks').then((m) => m.DocsSdks),
      },
      {
        path: 'troubleshooting',
        title: 'Troubleshooting · WBSKT docs',
        data: {
          description:
            "What to check when a board won't connect, a rule doesn't fire, or a message doesn't arrive.",
        },
        loadComponent: () =>
          import('./pages/docs/troubleshooting/troubleshooting').then((m) => m.DocsTroubleshooting),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
