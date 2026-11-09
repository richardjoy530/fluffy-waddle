// The sections of each docs page, for the "On this page" list and for search.
import { DOCS_INTEGRATIONS } from './data/integrations';
import { DOCS_NODE_DOCS, DocsNodeDoc } from './data/node-docs';
import { DOCS_NODE_GROUPS } from './data/nodes';

export interface DocsSection {
  id: string;
  label: string;
}

export const DOCS_SECTIONS: Record<string, DocsSection[]> = {
  '/docs/connect': [
    { id: 'copy-a-policy-pin', label: 'Copy a policy PIN' },
    { id: 'add-a-few-lines-to-your-code', label: 'Add a few lines to your code' },
    { id: 'approve-it', label: 'Approve it' },
    { id: 'staying-connected', label: 'Staying connected' },
  ],
  '/docs/messages': [
    { id: 'send-a-reading', label: 'Send a reading' },
    { id: 'receive-a-command', label: 'Receive a command' },
    { id: 'report-what-the-board-is-doing', label: 'Report what the board is doing' },
    { id: 'good-to-know', label: 'Good to know' },
  ],
  '/docs/first-rule': [
    { id: 'pick-what-starts-it', label: 'Pick what starts it' },
    { id: 'add-a-check', label: 'Add a check' },
    { id: 'say-what-happens', label: 'Say what happens' },
    { id: 'publish-and-test', label: 'Publish and test' },
  ],
  '/docs/nodes': [
    ...DOCS_NODE_GROUPS.map((g) => ({ id: g.anchor, label: g.label })),
    { id: 'ports', label: 'Ports' },
  ],
  '/docs/nodes/send-to-client': [
    { id: 'how-it-looks', label: 'How it looks' },
    { id: 'settings', label: 'Settings' },
    { id: 'ports', label: 'Ports' },
    { id: 'adds-to-the-run', label: 'What it adds to the run' },
    { id: 'on-the-board', label: 'On the board' },
    { id: 'problems-you-might-see', label: 'Problems you might see' },
    { id: 'see-also', label: 'See also' },
  ],
  ...Object.fromEntries(
    Object.entries(DOCS_NODE_DOCS).map(([slug, doc]) => [`/docs/nodes/${slug}`, nodeSections(doc)]),
  ),
  ...Object.fromEntries(
    DOCS_INTEGRATIONS.map((i) => [
      `/docs/integrations/${i.slug}`,
      [
        { id: 'set-it-up', label: 'Set it up' },
        { id: 'fields', label: 'Fields' },
        { id: 'test-it', label: 'Test it' },
        { id: 'problems-you-might-see', label: 'Problems you might see' },
        { id: 'used-by', label: 'Used by' },
      ],
    ]),
  ),
  '/docs/integrations': [
    { id: 'what-you-can-connect', label: 'What you can connect' },
    { id: 'set-one-up', label: 'Set one up' },
    { id: 'how-secrets-are-kept', label: 'How secrets are kept' },
    { id: 'deleting-an-integration', label: 'Deleting an integration' },
    { id: 'errors-you-might-see', label: 'Errors you might see' },
  ],
  '/docs/communication': [
    { id: 'the-whole-picture', label: 'The whole picture' },
    { id: 'ways-in-and-out', label: 'Ways in and out' },
    { id: 'which-one-should-i-use', label: 'Which one should I use?' },
  ],
  '/docs/members': [
    { id: 'how-it-fits-together', label: 'How it fits together' },
    { id: 'invite-someone', label: 'Invite someone' },
    { id: 'roles', label: 'Roles' },
    { id: 'when-youre-not-allowed', label: "When you're not allowed" },
    { id: 'plan-limits', label: 'Plan limits' },
  ],
  '/docs/billing': [
    { id: 'plans', label: 'Plans' },
    { id: 'how-credits-are-counted', label: 'How credits are counted' },
    { id: 'what-happens-at-a-limit', label: 'What happens at a limit' },
    { id: 'paying', label: 'Paying' },
  ],
  '/docs/protocol': [
    { id: 'how-it-fits-together', label: 'How it fits together' },
    { id: 'at-a-glance', label: 'At a glance' },
    { id: 'register', label: 'Register' },
    { id: 'log-in', label: 'Log in' },
    { id: 'messages', label: 'Messages' },
    { id: 'limits-and-pacing', label: 'Limits and pacing' },
    { id: 'when-a-connection-ends', label: 'When a connection ends' },
    { id: 'reconnecting', label: 'Reconnecting' },
  ],
  '/docs/protocol/websocket': [
    { id: 'connect', label: 'Connect' },
    { id: 'when-the-upgrade-is-refused', label: 'When the upgrade is refused' },
    { id: 'frames', label: 'Frames' },
    { id: 'keepalive', label: 'Keepalive' },
    { id: 'close-codes', label: 'Close codes' },
  ],
  '/docs/sdks': [
    { id: 'hello-wbskt', label: 'Hello, WBSKT' },
    { id: 'what-each-one-does', label: 'What each one does' },
    { id: 'another-language', label: 'Another language?' },
  ],
  '/docs/troubleshooting': [
    { id: 'board-never-shows-up', label: 'Board never shows up' },
    { id: 'it-says-pending', label: 'It says Pending' },
    { id: 'it-keeps-going-offline', label: 'It keeps going offline' },
    { id: 'my-rule-didnt-run', label: "My rule didn't run" },
    { id: 'no-message-on-my-phone', label: 'No message on my phone' },
    { id: 'an-error-code', label: 'An error code' },
  ],
};

// A node page shows only the sections its entry fills.
function nodeSections(doc: DocsNodeDoc): DocsSection[] {
  return [
    { id: 'how-it-looks', label: 'How it looks' },
    { id: 'settings', label: 'Settings' },
    { id: 'ports', label: 'Ports' },
    ...(doc.output.length ? [{ id: 'adds-to-the-run', label: 'What it adds to the run' }] : []),
    ...(doc.example || doc.code ? [{ id: 'example', label: 'Example' }] : []),
    ...(doc.concurrency ? [{ id: 'runs-that-overlap', label: 'Runs that overlap' }] : []),
    ...(doc.problems.length ? [{ id: 'problems-you-might-see', label: 'Problems you might see' }] : []),
    { id: 'see-also', label: 'See also' },
  ];
}
