// The docs sidebar, in reading order. Prev/next links and search follow this list.
import { DOCS_INTEGRATIONS } from './data/integrations';
import { DOCS_NODE_GROUPS, DOCS_NODES } from './data/nodes';

export interface DocsLink {
  label: string;
  path: string;
}

// A folding list inside a group, like the triggers under Nodes.
export interface DocsSubgroup {
  id: string;
  label: string;
  links: DocsLink[];
}

export type DocsNavItem = DocsLink | DocsSubgroup;

export interface DocsGroup {
  id: string;
  title: string;
  items: DocsNavItem[];
}

export interface DocsPage extends DocsLink {
  group: DocsGroup;
  sub?: DocsSubgroup;
}

export function isDocsSubgroup(item: DocsNavItem): item is DocsSubgroup {
  return 'links' in item;
}

export const DOCS_NAV: DocsGroup[] = [
  {
    id: 'start',
    title: 'Start here',
    items: [
      { label: 'Overview', path: '/docs' },
      { label: 'Get started', path: '/get-started' },
    ],
  },
  {
    id: 'clients',
    title: 'Clients',
    items: [
      { label: 'Connect a board', path: '/docs/connect' },
      { label: 'Readings and commands', path: '/docs/messages' },
    ],
  },
  {
    id: 'workflows',
    title: 'Workflows',
    items: [{ label: 'Your first rule', path: '/docs/first-rule' }],
  },
  {
    id: 'nodes',
    title: 'Nodes',
    items: [
      { label: 'Overview', path: '/docs/nodes' },
      ...DOCS_NODE_GROUPS.map((g) => ({
        id: `nodes-${g.id}`,
        label: g.label,
        links: DOCS_NODES.filter((n) => n.group === g.id).map((n) => ({
          label: n.name,
          path: `/docs/nodes/${n.slug}`,
        })),
      })),
    ],
  },
  {
    id: 'integrations',
    title: 'Integrations',
    items: [
      { label: 'Overview', path: '/docs/integrations' },
      ...DOCS_INTEGRATIONS.map((i) => ({ label: i.name, path: `/docs/integrations/${i.slug}` })),
    ],
  },
  {
    id: 'comms',
    title: 'Communication',
    items: [{ label: 'How messages travel', path: '/docs/communication' }],
  },
  {
    id: 'account',
    title: 'Account and teams',
    items: [
      { label: 'Workspaces and members', path: '/docs/members' },
      { label: 'Plans and billing', path: '/docs/billing' },
    ],
  },
  {
    id: 'reference',
    title: 'Reference',
    items: [
      {
        id: 'reference-protocol',
        label: 'Client protocol',
        links: [
          { label: 'Overview', path: '/docs/protocol' },
          { label: 'WebSocket gateway', path: '/docs/protocol/websocket' },
          { label: 'MQTT gateway', path: '/docs/protocol/mqtt' },
        ],
      },
      { label: 'Error codes', path: '/docs/errors' },
    ],
  },
  {
    id: 'sdks',
    title: 'SDKs',
    items: [{ label: 'Libraries', path: '/docs/sdks' }],
  },
  {
    id: 'help',
    title: 'Help',
    items: [{ label: 'Troubleshooting', path: '/docs/troubleshooting' }],
  },
];

export const DOCS_PAGES: DocsPage[] = DOCS_NAV.flatMap((group) =>
  group.items.flatMap((item) =>
    isDocsSubgroup(item)
      ? item.links.map((link) => ({ ...link, group, sub: item }))
      : [{ ...item, group }],
  ),
);
