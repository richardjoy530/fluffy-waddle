import { Routes } from '@angular/router';
import { DOCS_INTEGRATIONS } from './pages/docs/data/integrations';
import { DOCS_NODE_RENAMES, DOCS_NODES } from './pages/docs/data/nodes';

export const routes: Routes = [
  {
    path: '',
    title: 'WBSKT · Free IoT cloud for ESP32, Arduino and Raspberry Pi',
    data: {
      description:
        'Connect an ESP32, Arduino or Raspberry Pi, watch live readings, control it from anywhere and build automations that alert you on Telegram, Discord or email. Free.',
    },
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'features',
    title: 'IoT features: live data, remote control, automations · WBSKT',
    data: {
      description:
        'Live two-way messaging over WebSocket or MQTT, offline alerts, a no-code automation builder, Telegram and Discord alerts, and teams. Every feature, even on Free.',
    },
    loadComponent: () => import('./pages/features/features').then((m) => m.Features),
  },
  {
    path: 'get-started',
    title: 'Connect an ESP32 or Arduino in 10 minutes · WBSKT',
    data: {
      description:
        'Get an ESP32 or Arduino online in about ten minutes: install the WBSKT library, upload a short sketch and build an automation that alerts your phone.',
    },
    loadComponent: () => import('./pages/get-started/get-started').then((m) => m.GetStarted),
  },
  {
    path: 'privacy',
    title: 'Privacy · WBSKT',
    data: {
      description:
        'What WBSKT collects, why, how long it keeps it, who else handles it and your rights over it. No ads, no tracking, no selling your data.',
    },
    loadComponent: () => import('./pages/privacy/privacy').then((m) => m.Privacy),
  },
  {
    path: 'terms',
    title: 'Terms · WBSKT',
    data: {
      description:
        'The agreement between you and WBSKT: who can use it, plans and payment, refunds, fair use, your data and our liability.',
    },
    loadComponent: () => import('./pages/terms/terms').then((m) => m.Terms),
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
        path: 'policies',
        title: 'Policies · WBSKT docs',
        data: {
          description:
            'How clients join through a policy: the PIN, automatic or manual approval, client limits, turning a policy off, and what happens at each limit.',
        },
        loadComponent: () => import('./pages/docs/policies/policies').then((m) => m.DocsPolicies),
      },
      {
        path: 'clients',
        title: 'Client lifecycle · WBSKT docs',
        data: {
          description:
            'The statuses of a client, online and offline, renaming and tags, rotating its secret, revoking and deleting it, and the edge cases in between.',
        },
        loadComponent: () => import('./pages/docs/clients/clients').then((m) => m.DocsClients),
      },
      {
        path: 'commands',
        title: 'Commands · WBSKT docs',
        data: {
          description:
            'Sending commands to clients: delivery and acknowledgements, queueing for offline clients, expiry, templates and firmware updates.',
        },
        loadComponent: () => import('./pages/docs/commands/commands').then((m) => m.DocsCommands),
      },
      {
        path: 'state',
        title: 'Capabilities, state and readings · WBSKT docs',
        data: {
          description:
            'What a client declares, the state it reports, how readings are kept and charted on each plan, and how to export them.',
        },
        loadComponent: () => import('./pages/docs/state/state').then((m) => m.DocsState),
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
        path: 'workflows',
        title: 'Drafts, publishing and versions · WBSKT docs',
        data: {
          description:
            'How a workflow is drafted, checked and published, what its versions and states mean, and the settings every workflow has.',
        },
        loadComponent: () =>
          import('./pages/docs/workflows/workflows').then((m) => m.DocsWorkflows),
      },
      {
        path: 'runs',
        title: 'Runs · WBSKT docs',
        data: {
          description:
            'What a workflow run goes through: its statuses, paths and waits, cancelling, test runs, and how long its history is kept.',
        },
        loadComponent: () => import('./pages/docs/runs/runs').then((m) => m.DocsRuns),
      },
      {
        path: 'triggers',
        title: 'Triggers in depth · WBSKT docs',
        data: {
          description:
            'What every trigger shares: overlapping runs, filters and holds, webhook secrets, missed schedules, and why a run did not start.',
        },
        loadComponent: () => import('./pages/docs/triggers/triggers').then((m) => m.DocsTriggers),
      },
      {
        path: 'variables',
        title: 'Variables and placeholders · WBSKT docs',
        data: {
          description:
            'What a run can read, how placeholders fill in a message, local and shared variables, and how conditions compare values.',
        },
        loadComponent: () =>
          import('./pages/docs/variables/variables').then((m) => m.DocsVariables),
      },
      {
        path: 'failures',
        title: 'Retries and failures · WBSKT docs',
        data: {
          description:
            'How a step tries again, what a run does when a step still fails, how split paths fail together, and running out of credits.',
        },
        loadComponent: () => import('./pages/docs/failures/failures').then((m) => m.DocsFailures),
      },
      {
        path: 'engine',
        title: 'How the engine runs workflows · WBSKT docs',
        data: {
          description:
            'From an event to a finished run: paths, waits, restarts and failover, and what WBSKT guarantees happens once.',
        },
        loadComponent: () => import('./pages/docs/engine/engine').then((m) => m.DocsEngine),
      },
      {
        path: 'activity',
        title: 'Audit log · WBSKT docs',
        data: {
          description:
            'What the audit log records, its views and filters, client traffic, export, and how long entries are kept.',
        },
        loadComponent: () => import('./pages/docs/activity/activity').then((m) => m.DocsActivity),
      },
      {
        path: 'usage',
        title: 'Usage and credit caps · WBSKT docs',
        data: {
          description:
            'How clients, messages, credits and runs are counted across workspaces, the warnings on the way to a limit, and capping one workspace.',
        },
        loadComponent: () => import('./pages/docs/usage/usage').then((m) => m.DocsUsage),
      },
      {
        path: 'limits',
        title: 'Limits · WBSKT docs',
        data: {
          description:
            'Every limit in WBSKT in one place: plan limits, message and client limits, workflow limits, retention and rate limits.',
        },
        loadComponent: () => import('./pages/docs/limits/limits').then((m) => m.DocsLimits),
      },
      {
        path: 'scenarios',
        title: 'What happens when… · WBSKT docs',
        data: {
          description:
            'Every scenario the WBSKT docs answer, from a board joining a full policy to a run running out of credits, each linked to its page.',
        },
        loadComponent: () =>
          import('./pages/docs/scenarios/scenarios').then((m) => m.DocsScenarios),
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
          import('./pages/docs/integration-page/integration-page').then(
            (m) => m.DocsIntegrationPage,
          ),
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
        loadComponent: () =>
          import('./pages/docs/websocket/websocket').then((m) => m.DocsWebsocket),
      },
      {
        path: 'protocol/mqtt',
        title: 'MQTT gateway · WBSKT docs',
        data: {
          description:
            'Connecting a board over MQTT with any MQTT library: login, CONNECT, topics, messages, reason codes and complete ESP32 and Python examples.',
        },
        loadComponent: () => import('./pages/docs/mqtt/mqtt').then((m) => m.DocsMqtt),
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
