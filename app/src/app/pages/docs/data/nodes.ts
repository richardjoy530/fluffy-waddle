// The 24 workflow nodes, as the engine defines them, named and drawn as in the console design.
// Credits per pass; see Plans and billing.
export interface DocsPort {
  t: string;
  // What the canvas calls the port, when it isn't the engine's id.
  label?: string;
  note?: boolean;
}

export type DocsNodeGroupId = 'start' | 'flow' | 'wait' | 'data' | 'act' | 'stop';

export interface DocsNodeGroup {
  id: DocsNodeGroupId;
  anchor: string;
  label: string;
  blurb: string;
}

// The palette's groups, in the console's order. Nodes are listed in this order in the sidebar too.
export const DOCS_NODE_GROUPS: DocsNodeGroup[] = [
  { id: 'start', anchor: 'starts-the-workflow', label: 'Starts the workflow', blurb: 'Triggers. A workflow has exactly one, and what it hands on is the run\'s input.' },
  { id: 'flow', anchor: 'flow', label: 'Flow', blurb: 'Decide where the run goes next: one way or another, once per item, down several paths at once, or into another workflow.' },
  { id: 'wait', anchor: 'waits', label: 'Waits', blurb: 'Park the run on the server until a time passes or something calls back, for minutes or days.' },
  { id: 'data', anchor: 'data', label: 'Data', blurb: 'Keep a value for later steps of this run, or for every run of the workflow.' },
  { id: 'act', anchor: 'does-something', label: 'Does something', blurb: 'Command a board, notify someone or call a URL.' },
  { id: 'stop', anchor: 'stops', label: 'Stops', blurb: 'End a path on purpose, as a success or a failure.' },
];

// A step as the console draws it on the canvas, for the "How it looks" preview.
export interface DocsNodeSample {
  name: string;
  lines: string[];
  chips?: string[];
  ports?: string[];
}

export interface DocsNode {
  icon: string;
  name: string;
  kind: string;
  slug: string;
  credits: string;
  desc: string;
  ports: DocsPort[];
  tone: string;
  group: DocsNodeGroupId;
  sample: DocsNodeSample;
}

export const DOCS_NODES: DocsNode[] = [
  {
    icon: 'cpu',
    name: 'Client message',
    kind: 'trigger:client',
    slug: 'client-message',
    group: 'start',
    credits: 'Free',
    desc: 'Starts when a client sends a message of a type you pick, optionally only when its values match, or have matched for a while.',
    ports: [{ t: 'default' }],
    tone: 'c-tr',
    sample: { name: 'Frost reading', lines: ['gh-temp-01 · reading', 'when temp < 2 for 5 min'], chips: ['queue'] },
  },
  {
    icon: 'wifi',
    name: 'Client online / offline',
    kind: 'trigger:clientPresence',
    slug: 'client-online-offline',
    group: 'start',
    credits: 'Free',
    desc: 'Starts when a client comes online or goes offline. Holds back while a client is installing a firmware update.',
    ports: [{ t: 'default' }],
    tone: 'c-tr',
    sample: { name: 'Garage cam dropped', lines: ['garage-cam goes offline', 'for 2 min'], chips: ['queue'] },
  },
  {
    icon: 'clock',
    name: 'Schedule',
    kind: 'trigger:schedule',
    slug: 'schedule',
    group: 'start',
    credits: 'Free',
    desc: 'Starts every few minutes, daily at a time, or on a cron expression. Times are UTC.',
    ports: [{ t: 'default' }],
    tone: 'c-tr',
    sample: { name: 'Every morning', lines: ['every day at 06:00 UTC'] },
  },
  {
    icon: 'webhook',
    name: 'Webhook received',
    kind: 'trigger:webhook',
    slug: 'webhook-received',
    group: 'start',
    credits: 'Free',
    desc: "Starts when something outside WBSKT posts to the workflow's own URL. The body becomes the run's input.",
    ports: [{ t: 'default' }],
    tone: 'c-tr',
    sample: { name: 'Doorbell from IFTTT', lines: ['POST /doorbell', 'needs secret'], chips: ['queue'] },
  },
  {
    icon: 'play',
    name: 'Run by hand',
    kind: 'trigger:manual',
    slug: 'run-by-hand',
    group: 'start',
    credits: 'Free',
    desc: 'Starts from the Run button in the console or from the API, with inputs you define.',
    ports: [{ t: 'default' }],
    tone: 'c-tr',
    sample: { name: 'Reboot soil sensor', lines: ['Run now'] },
  },
  {
    icon: 'split',
    name: 'If',
    kind: 'control:logic',
    slug: 'if',
    group: 'flow',
    credits: '0.1 credits',
    desc: 'Checks a condition, or several joined with and or or, and leaves by true or false.',
    ports: [{ t: 'true', label: 'yes' }, { t: 'false', label: 'no' }],
    tone: 'c-co',
    sample: { name: 'Too cold?', lines: ['temp < 2 and heater off'] },
  },
  {
    icon: 'repeat',
    name: 'For each',
    kind: 'control:foreach',
    slug: 'for-each',
    group: 'flow',
    credits: '0.1 credits',
    desc: 'Runs the body once per item of a list, one after another, then leaves by done.',
    ports: [{ t: 'body', label: 'each item' }, { t: 'done' }],
    tone: 'c-co',
    sample: { name: 'Each sensor', lines: ['{{trigger.payload.sensors}}'] },
  },
  {
    icon: 'copy',
    name: 'For each, in parallel',
    kind: 'control:parallelForEach',
    slug: 'for-each-in-parallel',
    group: 'flow',
    credits: '0.1 credits',
    desc: 'Runs the body for every item at once. An empty list leaves by empty.',
    ports: [{ t: 'body', label: 'each item' }, { t: 'empty' }],
    tone: 'c-co',
    sample: { name: 'Ping every client', lines: ['{{trigger.payload.devices}}'] },
  },
  {
    icon: 'fork',
    name: 'Split into paths',
    kind: 'control:fork',
    slug: 'split-into-paths',
    group: 'flow',
    credits: '0.1 credits',
    desc: 'Splits the run into named paths that carry on side by side.',
    ports: [{ t: 'one per path you name', note: true }],
    tone: 'c-co',
    sample: { name: 'Alert everyone', lines: ['3 paths'], ports: ['phone', 'email', 'siren'] },
  },
  {
    icon: 'merge',
    name: 'Wait for paths',
    kind: 'control:join',
    slug: 'wait-for-paths',
    group: 'flow',
    credits: '0.1 credits',
    desc: 'Waits for paths to arrive: all of them, the first one, or a number you set.',
    ports: [{ t: 'default' }],
    tone: 'c-co',
    sample: { name: 'All alerts sent', lines: ['wait for 2 of 3'] },
  },
  {
    icon: 'flow',
    name: 'Run workflow',
    kind: 'control:subWorkflow',
    slug: 'run-workflow',
    group: 'flow',
    credits: '1 credit',
    desc: 'Starts another workflow as a child run, with its own credits, and passes the result back.',
    ports: [{ t: 'default' }],
    tone: 'c-co',
    sample: { name: 'Send alert', lines: ['Send alert · v3', 'input: message, level'] },
  },
  {
    icon: 'hourglass',
    name: 'Wait',
    kind: 'control:delay',
    slug: 'wait',
    group: 'wait',
    credits: '0.1 credits',
    desc: 'Pauses the run for a fixed time. Waiting costs nothing.',
    ports: [{ t: 'default' }],
    tone: 'c-wa',
    sample: { name: 'Let it settle', lines: ['10 min'] },
  },
  {
    icon: 'link',
    name: 'Wait for a call',
    kind: 'control:waitForHttp',
    slug: 'wait-for-a-call',
    group: 'wait',
    credits: '0.1 credits',
    desc: 'Parks the run on a one-off callback URL until something calls it, or the time runs out.',
    ports: [{ t: 'default', label: 'called' }, { t: 'timeout', label: 'timed out' }],
    tone: 'c-wa',
    sample: { name: 'Wait for the gate', lines: ['up to 30 min'] },
  },
  {
    icon: 'flag',
    name: 'Wait for signal',
    kind: 'control:awaitSignal',
    slug: 'wait-for-signal',
    group: 'wait',
    credits: '0.1 credits',
    desc: 'Parks the run until a named signal arrives from the console, the API or another run.',
    ports: [{ t: 'default', label: 'received' }, { t: 'with Give up after', note: true }, { t: 'timeout', label: 'timed out' }],
    tone: 'c-wa',
    sample: { name: 'Wait for approval', lines: ['signal: approve', 'up to 1 h'] },
  },
  {
    icon: 'var',
    name: 'Set variable',
    kind: 'control:variable',
    slug: 'set-variable',
    group: 'data',
    credits: '0.1 credits',
    desc: 'Sets, increments or compare-and-sets a variable, local to the run or shared by every run.',
    ports: [{ t: 'default' }],
    tone: 'c-da',
    sample: { name: 'Count frosts', lines: ['frostCount + 1', 'shared'] },
  },
  {
    icon: 'radio',
    name: 'Send to client',
    kind: 'action:clientMessage',
    slug: 'send-to-client',
    group: 'act',
    credits: '1 credit',
    desc: 'Sends a command to a client. Can wait for the client to confirm and leave by what happened.',
    ports: [
      { t: 'default' },
      { t: 'or, when waiting', note: true },
      { t: 'acked' },
      { t: 'failed' },
      { t: 'timeout' },
    ],
    tone: 'c-ac',
    sample: { name: 'Heater on', lines: ['gh-heater · relay.set', '{ "on": true }', 'wait for confirmation'], ports: ['acked', 'failed', 'timed out'] },
  },
  {
    icon: 'mail',
    name: 'Email',
    kind: 'action:email',
    slug: 'email',
    group: 'act',
    credits: '10 credits',
    desc: 'Sends an email through an SMTP integration, with values from the run in the subject and body.',
    ports: [{ t: 'default' }],
    tone: 'c-ac',
    sample: { name: 'Tell me', lines: ['pika@gmail.com → me@…', '“Frost: 1.4°C”'] },
  },
  {
    icon: 'telegram',
    name: 'Telegram',
    kind: 'action:telegram',
    slug: 'telegram',
    group: 'act',
    credits: '5 credits',
    desc: 'Sends a message to a Telegram chat through your bot.',
    ports: [{ t: 'default' }],
    tone: 'c-ac',
    sample: { name: 'Ping my phone', lines: ['Greenhouse bot · chat 48213…', '“Frost! 1.4°C”'] },
  },
  {
    icon: 'globe',
    name: 'Call a URL',
    kind: 'action:webhook',
    slug: 'call-a-url',
    group: 'act',
    credits: '5 credits',
    desc: 'Calls any HTTP endpoint, with an HTTP auth integration if it needs one. Errors leave by error.',
    ports: [{ t: 'default' }, { t: 'error' }],
    tone: 'c-ac',
    sample: { name: 'Tell Home Assistant', lines: ['POST ha.example.com/…', '→ status, body'], chips: ['retry 3×'] },
  },
  {
    icon: 'monitor',
    name: 'Console notification',
    kind: 'action:toast',
    slug: 'console-notification',
    group: 'act',
    credits: '0.5 credits',
    desc: 'Pops a notice in the console for everyone watching the workspace.',
    ports: [{ t: 'default' }],
    tone: 'c-ac',
    sample: { name: 'Show in console', lines: ['“Heater switched on”'] },
  },
  {
    icon: 'discord',
    name: 'Discord',
    kind: 'action:discord',
    slug: 'discord',
    group: 'act',
    credits: '5 credits',
    desc: 'Posts to a Discord channel, as plain text or an embed.',
    ports: [{ t: 'default' }],
    tone: 'c-ac',
    sample: { name: 'Post to #greenhouse', lines: ['Greenhouse alerts', '“Greenhouse dropped to 1.4°C…”'] },
  },
  {
    icon: 'ntfy',
    name: 'ntfy',
    kind: 'action:ntfy',
    slug: 'ntfy',
    group: 'act',
    credits: '5 credits',
    desc: 'Pushes a notification to your phone through an ntfy topic, with priority and tags.',
    ports: [{ t: 'default' }],
    tone: 'c-ac',
    sample: { name: 'Push to phone', lines: ['greenhouse-alerts · high', '“Frost in the greenhouse”'] },
  },
  {
    icon: 'octx',
    name: 'Fail run',
    kind: 'control:failRun',
    slug: 'fail-run',
    group: 'stop',
    credits: '0.1 credits',
    desc: 'Ends the run as failed, with a reason that shows in the runs list.',
    ports: [{ t: 'none, it ends the run', note: true }],
    tone: 'c-st',
    sample: { name: 'Sensor broken', lines: ['“No reading for 1 h”'] },
  },
  {
    icon: 'stop',
    name: 'End',
    kind: 'control:end',
    slug: 'end',
    group: 'stop',
    credits: '0.1 credits',
    desc: 'Ends this path as done, optionally handing a value back to the run that started it.',
    ports: [{ t: 'none, it ends this path', note: true }],
    tone: 'c-en',
    sample: { name: 'Done', lines: ['ends this path'] },
  },
];

// Pages that were published under the engine's names before the docs took the console's.
export const DOCS_NODE_RENAMES: Record<string, string> = {
  'client-presence': 'client-online-offline',
  webhook: 'webhook-received',
  manual: 'run-by-hand',
  'parallel-for-each': 'for-each-in-parallel',
  fork: 'split-into-paths',
  join: 'wait-for-paths',
  'sub-workflow': 'run-workflow',
  variable: 'set-variable',
  delay: 'wait',
  'wait-for-http': 'wait-for-a-call',
  'await-signal': 'wait-for-signal',
  'console-toast': 'console-notification',
};
