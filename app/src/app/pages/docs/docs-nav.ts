// The docs sidebar, in reading order. Prev/next links and search follow this list.
export interface DocsLink {
  label: string;
  path: string;
}

export interface DocsGroup {
  id: string;
  title: string;
  links: DocsLink[];
}

export const DOCS_NAV: DocsGroup[] = [
  {
    id: 'start',
    title: 'Start here',
    links: [
      { label: 'Overview', path: '/docs' },
      { label: 'Get started', path: '/get-started' },
    ],
  },
  {
    id: 'clients',
    title: 'Clients',
    links: [
      { label: 'Connect a board', path: '/docs/connect' },
      { label: 'Readings and commands', path: '/docs/messages' },
    ],
  },
  {
    id: 'workflows',
    title: 'Workflows',
    links: [
      { label: 'Your first rule', path: '/docs/first-rule' },
      { label: 'Node reference', path: '/docs/nodes' },
      { label: 'Send to client', path: '/docs/nodes/send-to-client' },
    ],
  },
  {
    id: 'integrations',
    title: 'Integrations',
    links: [{ label: 'Telegram, email and more', path: '/docs/integrations' }],
  },
  {
    id: 'comms',
    title: 'Communication',
    links: [{ label: 'How messages travel', path: '/docs/communication' }],
  },
  {
    id: 'account',
    title: 'Account and teams',
    links: [
      { label: 'Workspaces and members', path: '/docs/members' },
      { label: 'Plans and billing', path: '/docs/billing' },
    ],
  },
  {
    id: 'reference',
    title: 'Reference',
    links: [
      { label: 'Client protocol', path: '/docs/protocol' },
      { label: 'Error codes', path: '/docs/errors' },
    ],
  },
  {
    id: 'sdks',
    title: 'SDKs',
    links: [{ label: 'Libraries', path: '/docs/sdks' }],
  },
  {
    id: 'help',
    title: 'Help',
    links: [{ label: 'Troubleshooting', path: '/docs/troubleshooting' }],
  },
];

export const DOCS_PAGES: (DocsLink & { group: DocsGroup })[] = DOCS_NAV.flatMap((group) =>
  group.links.map((link) => ({ ...link, group })),
);
