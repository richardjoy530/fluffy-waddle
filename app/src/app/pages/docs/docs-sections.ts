// The sections of each docs page, for the "On this page" list and for search.
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
    { id: 'triggers', label: 'Triggers' },
    { id: 'control', label: 'Control' },
    { id: 'actions', label: 'Actions' },
    { id: 'ports', label: 'Ports' },
  ],
  '/docs/nodes/send-to-client': [
    { id: 'how-it-looks', label: 'How it looks' },
    { id: 'settings', label: 'Settings' },
    { id: 'ports', label: 'Ports' },
    { id: 'on-the-board', label: 'On the board' },
    { id: 'errors-you-might-see', label: 'Errors you might see' },
  ],
  '/docs/integrations': [
    { id: 'what-you-can-connect', label: 'What you can connect' },
    { id: 'set-one-up', label: 'Set one up' },
    { id: 'telegram-step-by-step', label: 'Telegram, step by step' },
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
    { id: 'at-a-glance', label: 'At a glance' },
    { id: 'register', label: 'Register' },
    { id: 'log-in', label: 'Log in' },
    { id: 'messages', label: 'Messages' },
    { id: 'limits-and-pacing', label: 'Limits and pacing' },
    { id: 'close-codes', label: 'Close codes' },
    { id: 'reconnecting', label: 'Reconnecting' },
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
