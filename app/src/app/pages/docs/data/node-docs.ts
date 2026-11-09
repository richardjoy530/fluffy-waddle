// The page for each node, keyed by slug. Text may hold <code>, <b> and <i>; links go in `related`.
// Send to client has a page of its own (send-to-client/), so it is not here.
export interface DocsNodeSetting {
  name: string;
  key: string;
  req?: boolean;
  text: string;
}

export interface DocsNodePortDoc {
  id: string;
  when: string;
}

export interface DocsNodeOutput {
  key: string;
  text: string;
}

export interface DocsNodeProblem {
  code: string;
  text: string;
}

export interface DocsNodeDoc {
  lead: string;
  portsFact?: string;
  settings: DocsNodeSetting[];
  ports: DocsNodePortDoc[];
  output: DocsNodeOutput[];
  example?: { title: string; steps: string[] };
  code?: { file: string; text: string };
  tip?: { label: string; text: string; warn?: boolean };
  concurrency?: boolean;
  problems: DocsNodeProblem[];
  related: string[];
}

const CONCURRENCY: DocsNodeSetting = {
  name: 'If it fires while a run is still going',
  key: 'concurrencyPolicy',
  text: '<b>Queue</b> by default. See <i>Runs that overlap</i> below.',
};

const CORRELATION = (fallback: string): DocsNodeSetting => ({
  name: 'Correlation key',
  key: 'correlationKey',
  text: `Which runs count as the same for the setting above. Left empty, ${fallback}. Set it to share one line with another trigger.`,
});

const TRIGGER_OUTPUT: DocsNodeOutput = {
  key: 'triggeredAt',
  text: 'When the trigger fired.',
};

export const DOCS_NODE_DOCS: Record<string, DocsNodeDoc> = {
  'client-message': {
    lead: 'Starts a run when a client sends a message of the type you pick. Add conditions to start only on the readings that matter, and a hold to start only when they keep mattering.',
    settings: [
      { name: 'Client', key: 'clientRef', req: true, text: 'The client to listen to.' },
      { name: 'Message type', key: 'type', req: true, text: 'The type the board sends, like <code>temperature</code>. <code>*</code> starts on any type.' },
      { name: 'Conditions', key: 'filter', text: 'Checked against the message before a run starts, like <code>celsius &gt; 30</code>. A run starts only when they hold. A condition that can\'t be checked counts as not matching, so a bad reading never starts a run by accident.' },
      { name: 'Hold for', key: 'holdSeconds', text: 'The conditions must keep holding this long before a run starts, up to 24 hours. After that the trigger stays quiet until a message stops matching. Needs conditions.' },
      CONCURRENCY,
      CORRELATION('the client and message type'),
    ],
    ports: [{ id: 'default', when: 'Always. The message is the run\'s input.' }],
    output: [
      { key: 'trigger', text: 'The message the board sent. Its values are under <code>trigger.payload</code>, so <code>{{trigger.payload.celsius}}</code> in a later node is the reading.' },
      TRIGGER_OUTPUT,
    ],
    example: {
      title: 'Fridge door left open',
      steps: [
        'Message type <code>door</code>, condition <code>open == true</code>.',
        'Hold for <b>10 minutes</b>.',
        'Connect a Telegram node. You hear about it once, ten minutes in, not on every reading, and again only after the door has closed and opened.',
      ],
    },
    concurrency: true,
    problems: [
      { code: 'INVALID_CLIENT_REF', text: 'The client isn\'t one in this workspace. Shown when you publish.' },
      { code: 'HOLD_REQUIRES_FILTER', text: 'Hold for is set without any conditions to hold.' },
      { code: 'INVALID_HOLD_DURATION', text: 'Hold for is negative or over 24 hours.' },
    ],
    related: ['if', 'send-to-client', 'telegram'],
  },

  'client-online-offline': {
    lead: 'Starts a run when a client goes offline or comes back, and stays that way for a while. The wait keeps a board that reboots or roams between access points from paging you.',
    settings: [
      { name: 'This client', key: 'clientRef', req: true, text: 'The client to watch.' },
      { name: 'Goes', key: 'state', text: '<b>Offline</b> (the default) or <b>Online</b>.' },
      { name: 'For at least', key: 'forSeconds', text: 'How long it must stay that way before a run starts. 1 minute by default, at most 24 hours.' },
      CONCURRENCY,
      CORRELATION('the client and state'),
    ],
    ports: [{ id: 'default', when: 'The client has stayed in that state for the time you set.' }],
    output: [
      { key: 'trigger', text: 'Which client changed, and to what.' },
      TRIGGER_OUTPUT,
    ],
    tip: {
      label: 'Firmware updates',
      text: 'A board that closes its connection to install firmware shows as <b>updating</b>, not offline, for 5 minutes, so an update doesn\'t start an offline run.',
    },
    example: {
      title: 'Tell me when the pump controller drops off',
      steps: [
        'This client <b>pump-01</b>, goes <b>Offline</b>, for at least <b>5 minutes</b>.',
        'Connect an Email node: "pump-01 has been offline for 5 minutes".',
        'Add a second workflow with Goes <b>Online</b> to hear when it\'s back.',
      ],
    },
    concurrency: true,
    problems: [
      { code: 'INVALID_CLIENT_REF', text: 'The client isn\'t one in this workspace.' },
      { code: 'INVALID_PRESENCE_DURATION', text: 'For at least is negative or over 24 hours.' },
    ],
    related: ['client-message', 'email', 'ntfy'],
  },

  schedule: {
    lead: 'Starts a run on a timetable: every few minutes, every hour, every day at a time, on chosen days, or on any cron expression. Times are in UTC.',
    settings: [
      { name: 'Repeat', key: 'cron', req: true, text: 'Pick every N minutes, hourly, daily, weekly or monthly and the console writes the cron expression for you, or type your own, like <code>0 6 * * *</code> for 06:00 UTC each day. <b>Next runs</b> shows when it will fire.' },
      CORRELATION('each occurrence is its own'),
    ],
    ports: [{ id: 'default', when: 'At each scheduled time.' }],
    output: [TRIGGER_OUTPUT],
    tip: {
      label: 'If WBSKT was down',
      text: 'Occurrences missed while the engine was restarting are fired one after another when it\'s back, so nothing is skipped.',
    },
    example: {
      title: 'Water the plants at dawn',
      steps: [
        'Repeat <b>daily</b> at <b>05:30</b> UTC.',
        'Connect Send to client with command <code>pump.run</code> and payload <code>{ "seconds": 20 }</code>.',
      ],
    },
    problems: [{ code: 'INVALID_CRON', text: 'The cron expression can\'t be read. The console checks it as you type.' }],
    related: ['send-to-client', 'wait', 'set-variable'],
  },

  'webhook-received': {
    lead: 'Starts a run when something outside WBSKT posts to the workflow\'s own URL: a form, another service, a script or a button on your phone. The request body becomes the run\'s input.',
    settings: [
      { name: 'Path', key: 'path', req: true, text: 'The last part of the URL, like <code>doorbell</code>. The console shows the full URL to copy.' },
      { name: 'Secret', key: 'secret', text: 'Optional, but set one. Callers send it in the <code>X-Wbskt-Secret</code> header. It\'s stored hashed, and a wrong secret gets the same answer as a right one, so it can\'t be guessed by trying.' },
      { name: 'Only when', key: 'filter', text: 'Conditions on the body. A call that doesn\'t match starts no run and costs nothing.' },
      CONCURRENCY,
      CORRELATION('the path'),
    ],
    ports: [{ id: 'default', when: 'A call matched and started a run.' }],
    output: [
      { key: 'trigger', text: 'The request body. A JSON body\'s fields can be read in later nodes, like <code>{{trigger.payload.button}}</code>.' },
      TRIGGER_OUTPUT,
    ],
    code: {
      file: 'call it',
      text: `curl -X POST https://api.dev.wbskt.com/api/callbacks/webhook/<workspace>/doorbell \\
  -H "Content-Type: application/json" \\
  -H "X-Wbskt-Secret: <your secret>" \\
  -H "Idempotency-Key: ring-0142" \\
  -d '{ "button": "front" }'`,
    },
    tip: {
      label: 'Retries are safe',
      text: 'Send an <code>Idempotency-Key</code> header and a retry with the same key within 24 hours starts nothing new. Only <code>POST</code> is accepted.',
    },
    concurrency: true,
    problems: [{ code: 'IDEMPOTENCY_KEY_INVALID', text: 'The <code>Idempotency-Key</code> header isn\'t 1–255 printable characters. Answered with 400.' }],
    related: ['wait-for-a-call', 'call-a-url', 'if'],
  },

  'run-by-hand': {
    lead: 'Starts a run when someone presses <b>Run now</b> in the console, or calls the API. It can ask for inputs first, and it\'s also how one workflow starts another with <b>Run workflow</b>.',
    settings: [
      { name: 'What "Run now" does', key: 'description', text: 'A line shown next to the Run now button, like "Power-cycles the soil sensor".' },
      { name: 'Ask for input', key: 'inputs', text: 'Fields the console asks for before starting, each with a name, a label and a default. A value left out takes its default. Names are letters, digits or underscores, and can\'t be <code>parentRunRefId</code>, <code>correlationKey</code> or <code>depth</code>.' },
    ],
    ports: [{ id: 'default', when: 'Someone started a run.' }],
    output: [
      { key: 'trigger', text: 'The inputs, by name. An input called <code>reason</code> is <code>{{trigger.payload.reason}}</code>.' },
      TRIGGER_OUTPUT,
    ],
    code: {
      file: 'start a run from the API',
      text: `POST /api/v1/workspaces/<workspace>/workflows/<workflow>/runs
Authorization: Bearer <token>

{
  "triggerNodeId": "<the manual trigger's node id>",
  "payload": { "reason": "testing the relay" },
  "idempotencyKey": "relay-test-1"
}`,
    },
    tip: {
      label: 'Answers',
      text: '<b>200</b> started, <b>202</b> queued behind a run that\'s still going, <b>409</b> dropped by the concurrency setting or the workflow has no manual trigger. Starting a run needs <code>workflows.execute</code>.',
    },
    problems: [
      { code: 'MANUAL_INPUT_NAME_INVALID', text: 'An input name isn\'t letters, digits or underscores, starting with a letter or underscore.' },
      { code: 'MANUAL_INPUT_NAME_DUPLICATE', text: 'Two inputs have the same name, ignoring case.' },
      { code: 'MANUAL_INPUT_NAME_RESERVED', text: 'An input uses a name WBSKT writes itself.' },
    ],
    related: ['run-workflow', 'end', 'wait-for-signal'],
  },

  if: {
    lead: 'Checks a condition and sends the run down <code>true</code> or <code>false</code>. Join several checks with <b>and</b> or <b>or</b>.',
    settings: [
      { name: 'Continue down "true" when', key: 'condition', req: true, text: 'Build it from values in the run, like <code>trigger.payload.celsius</code> is greater than <code>30</code>, or write it as an expression. It must come out as true or false.' },
    ],
    ports: [
      { id: 'true', when: 'The condition held.' },
      { id: 'false', when: 'It didn\'t.' },
    ],
    output: [],
    tip: {
      label: 'Types are strict',
      text: 'A number is never equal to the same digits as text, so <code>21.5</code> and <code>"21.5"</code> differ. Send numbers from the board as numbers.',
    },
    example: {
      title: 'Only at night',
      steps: [
        'Condition: <code>trigger.payload.lux</code> is less than <code>10</code>.',
        'Connect <code>true</code> to Send to client <code>lights.on</code>, and leave <code>false</code> empty to end there.',
      ],
    },
    problems: [
      { code: 'LOGIC_CONDITION_NOT_BOOL', text: 'The condition came out as something other than true or false, like a number or text.' },
      { code: 'EXPRESSION_EVALUATION_ERROR', text: 'A value it reads couldn\'t be worked out.' },
    ],
    related: ['client-message', 'set-variable', 'split-into-paths'],
  },

  'for-each': {
    lead: 'Goes through a list one item at a time. Each pass leaves by <code>body</code> with the item; when the body leads back here, the next item goes. After the last one it leaves by <code>done</code>.',
    settings: [
      { name: 'List', key: 'collection', req: true, text: 'Where the list is in the run, like <code>trigger.payload.readings</code> or the <code>json</code> a URL answered with.' },
    ],
    ports: [
      { id: 'body', when: 'Once per item. Connect the last node of the body back to this node.' },
      { id: 'done', when: 'After the last item, or at once for an empty list.' },
    ],
    output: [
      { key: 'item', text: 'The item for this pass.' },
      { key: 'index', text: 'Its position, from 0.' },
    ],
    tip: {
      label: 'One at a time or all at once',
      text: 'For each waits for each pass before the next. To handle every item at the same time, use For each, in parallel.',
    },
    problems: [{ code: 'FOREACH_COLLECTION_NOT_ARRAY', text: 'The value at List isn\'t a list.' }],
    related: ['for-each-in-parallel', 'call-a-url', 'set-variable'],
  },

  'for-each-in-parallel': {
    lead: 'Starts one path per item of a list, all at once, up to 1,000. The paths must meet again at a Wait for paths, which decides when the run carries on.',
    settings: [
      { name: 'List', key: 'collection', req: true, text: 'Where the list is in the run.' },
    ],
    ports: [
      { id: 'body', when: 'Once per item, each on its own path. Lead them all to one Wait for paths. The canvas calls it <b>each item</b>.' },
      { id: 'empty', when: 'The list had no items, so no path started.' },
    ],
    output: [{ key: 'item', text: 'The item, on each path.' }],
    tip: {
      label: 'Every path starts at once',
      text: 'There\'s no limit on how many run at the same time yet, so a list of 500 calls to a URL makes 500 calls together.',
      warn: true,
    },
    problems: [
      { code: 'PARALLEL_FOREACH_WITHOUT_JOIN', text: 'The paths don\'t reach a Wait for paths. Shown when you publish.' },
      { code: 'PFE_COLLECTION_NOT_ARRAY', text: 'The value at List isn\'t a list.' },
      { code: 'PFE_FAN_OUT_TOO_LARGE', text: 'The list has more than 1,000 items. Nothing starts.' },
    ],
    related: ['wait-for-paths', 'for-each', 'split-into-paths'],
  },

  'split-into-paths': {
    portsFact: 'One per path',
    lead: 'Splits the run into paths you name, which carry on side by side: say, one to switch the fan on and one to tell you about it.',
    settings: [
      { name: 'Paths', key: 'branches', req: true, text: 'A name for each path. Each name becomes an output port.' },
    ],
    ports: [{ id: 'one per path', when: 'Every path, at once. Each path starts with a copy of the run so far.' }],
    output: [],
    tip: {
      label: 'With or without Wait for paths',
      text: 'Lead every path to the same Wait for paths to wait for them, or none of them to let each finish on its own. Some to it and some not isn\'t allowed.',
    },
    problems: [
      { code: 'FORK_BRANCH_WITHOUT_JOIN', text: 'Some paths reach a Wait for paths and others don\'t.' },
      { code: 'FORK_BRANCHES_JOIN_MISMATCH', text: 'The paths reach different Wait for paths steps.' },
    ],
    related: ['wait-for-paths', 'for-each-in-parallel', 'if'],
  },

  'wait-for-paths': {
    lead: 'Waits for the paths of a Split into paths or For each, in parallel, then lets one run carry on. Choose whether it waits for all of them, the first, or a number.',
    settings: [
      { name: 'Continue when', key: 'mode', req: true, text: '<b>All</b> paths have arrived, <b>Any</b> one has, or a <b>Quorum</b>.' },
      { name: 'How many', key: 'quorumCount', text: 'For Quorum: how many paths must arrive.' },
    ],
    ports: [{ id: 'default', when: 'Enough paths arrived. Exactly one carries on; the others end here.' }],
    output: [
      { key: 'joinContributed', text: 'How many paths arrived.' },
      { key: 'joinSucceeded', text: 'How many of them succeeded.' },
      { key: 'joinFailed', text: 'How many failed. A failed path still counts as arriving.' },
    ],
    tip: {
      label: 'A path that never arrives',
      text: 'A path that ends before Wait for paths, at an End or a port with nothing connected, sits it out. With <b>All</b> that fails the run; with Any or Quorum the run fails only once the rest can no longer make up the number.',
      warn: true,
    },
    problems: [
      { code: 'JOIN_WITHOUT_COHORT', text: 'Nothing upstream splits the run, so there is nothing to join.' },
      { code: 'JOIN_BRANCH_ENDED', text: 'A path ended without reaching Wait for paths, and it can no longer continue.' },
    ],
    related: ['split-into-paths', 'for-each-in-parallel', 'fail-run'],
  },

  'run-workflow': {
    lead: 'Starts another workflow as a child run and waits for it to finish. Use it to keep a job you do often, like "notify the family", in one place.',
    settings: [
      { name: 'Workflow', key: 'workflowRefId', req: true, text: 'The workflow to run. It needs a Run by hand trigger, which is how the child starts. A workflow can\'t call itself.' },
      { name: 'Pass in', key: 'input', text: 'Values for the child\'s inputs, worked out from this run. The child reads them like Run now inputs.' },
      { name: 'Correlation key', key: 'correlationKey', text: 'Advanced. Groups child runs for the child\'s concurrency setting.' },
    ],
    ports: [{ id: 'default', when: 'The child run finished, however it ended. Check <code>childResult.status</code> to tell.' }],
    output: [
      { key: 'childResult', text: '<code>{ childRunRefId, status, output }</code>. <code>output</code> is what the child\'s End node handed back.' },
    ],
    tip: {
      label: 'Credits',
      text: 'This step costs <b>1</b> credit. The child pays for itself from its own budget, its own run start included. Cancelling or failing this run cancels the child.',
    },
    problems: [
      { code: 'SUBWORKFLOW_SELF_REFERENCE', text: 'The workflow calls itself.' },
      { code: 'SUBWORKFLOW_DEPTH_EXCEEDED', text: 'Run workflow steps are nested more than 8 deep.' },
      { code: 'SUBWORKFLOW_INPUT_KEY_RESERVED', text: 'An input is named <code>parentRunRefId</code>, <code>correlationKey</code> or <code>depth</code>.' },
      { code: 'SUBWORKFLOW_WORKSPACE_BUSY', text: 'The workspace is at its limit of active runs.' },
    ],
    related: ['run-by-hand', 'end', 'wait-for-signal'],
  },

  'set-variable': {
    lead: 'Keeps a value. A local variable lives for this run only. A shared variable is one value for the whole workflow, kept between runs, so it can count things or remember the last state.',
    settings: [
      { name: 'Keep it for', key: 'scope', req: true, text: '<b>This run</b> (Local) or <b>Every run</b> (Shared). Shared variables are declared on the workflow with a type and a default.' },
      { name: 'Variable', key: 'var', req: true, text: 'Its name. Names starting with <code>__</code> are WBSKT\'s own.' },
      { name: 'Do', key: 'op', req: true, text: '<b>Set</b> it to a value. A shared variable can also <b>Compare and set</b>, and a shared counter <b>Increment</b> and <b>Decrement</b>.' },
      { name: 'Value', key: 'value', text: 'A fixed value, or one from the run.' },
      { name: 'Only if it is now', key: 'expected', text: 'For Compare and set: the value is written only if the variable holds this now.' },
    ],
    ports: [{ id: 'default', when: 'After the write.' }],
    output: [
      { key: '(the name)', text: 'A local variable, by its name, for later nodes.' },
      { key: 'casSucceeded', text: 'For Compare and set: whether the write happened.' },
    ],
    tip: {
      label: 'Reading a shared variable',
      text: 'Use <code>{{$shared.NAME}}</code> in any text field, or pick it in a condition. Increment and Decrement are safe with many runs at once; Set is last write wins. You can also set one by hand in the console.',
    },
    example: {
      title: 'Count the doorbell rings today',
      steps: [
        'Declare a shared counter <code>rings</code>, default 0.',
        'In the doorbell workflow, Set variable: Every run, <code>rings</code>, Increment.',
        'A Schedule at midnight sets <code>rings</code> back to 0.',
      ],
    },
    problems: [
      { code: 'VARIABLE_NOT_A_COUNTER', text: 'Increment or Decrement on a variable that isn\'t a counter.' },
      { code: 'VARIABLE_NAME_RESERVED', text: 'The name starts with <code>__</code>.' },
      { code: 'VARIABLE_EXPECTED_MISSING', text: 'Compare and set without a value to compare.' },
    ],
    related: ['if', 'schedule', 'for-each'],
  },

  wait: {
    lead: 'Pauses the run for as long as you set, from seconds to days. The run is parked on the server while it waits, so it costs nothing and survives restarts.',
    settings: [{ name: 'Wait for', key: 'duration', req: true, text: 'How long to wait.' }],
    ports: [{ id: 'default', when: 'The time is up.' }],
    output: [],
    tip: {
      label: 'While it waits',
      text: 'The run shows <b>waiting</b> in its history. Entering the node costs <b>0.1</b> credits; the waiting is free.',
    },
    example: {
      title: 'Pump for two minutes',
      steps: [
        'Send to client <code>pump.on</code>.',
        'Wait <b>2 minutes</b>.',
        'Send to client <code>pump.off</code>.',
      ],
    },
    problems: [],
    related: ['wait-for-a-call', 'wait-for-signal', 'send-to-client'],
  },

  'wait-for-a-call': {
    lead: 'Parks the run on a wake URL until something calls it, or the time runs out. Hand the URL to a service that calls back when it\'s done, like a payment or an approval.',
    settings: [
      { name: 'Give up after', key: 'ttl', req: true, text: 'How long to wait before leaving by <code>timeout</code>.' },
      { name: 'Token', key: 'token', req: true, text: 'The secret part of the wake URL, at least 24 characters. Press <b>Generate</b>. It\'s the only thing guarding the URL, so keep it to yourself.' },
    ],
    ports: [
      { id: 'default', when: 'The wake URL was called.' },
      { id: 'timeout', when: 'Nobody called in time.' },
    ],
    output: [{ key: 'wakePayload', text: 'The body of the call that woke it.' }],
    code: {
      file: 'wake the run',
      text: `curl -X POST https://api.dev.wbskt.com/api/callbacks/wake/<token> \\
  -H "Content-Type: application/json" \\
  -d '{ "approved": true }'`,
    },
    tip: {
      label: 'One run at a time',
      text: 'The token is fixed in the workflow, so two runs parked on the same node at once would share a URL. Keep the trigger\'s concurrency on Queue or Drop if running.',
      warn: true,
    },
    problems: [{ code: 'WAITFORHTTP_WEAK_TOKEN', text: 'The token is missing or shorter than 24 characters. Shown when you publish.' }],
    related: ['wait-for-signal', 'webhook-received', 'wait'],
  },

  'wait-for-signal': {
    portsFact: '1 or 2',
    lead: 'Parks the run until a named signal arrives for it, from the console, the API or another run. Use it for "wait until someone says go".',
    settings: [
      { name: 'Signal name', key: 'signalName', req: true, text: 'The name to wait for, like <code>approved</code>.' },
      { name: 'Give up after', key: 'ttl', text: 'Optional. With it, the node also has a <code>timeout</code> port.' },
      { name: 'Correlation', key: 'correlation', text: 'Which run the signal must be sent to. Left empty, this run. Use <code>{{trigger.payload.parentRun}}</code> to wait on another run\'s signal.' },
    ],
    ports: [
      { id: 'default', when: 'The signal arrived.' },
      { id: 'timeout', when: 'Only with Give up after: no signal in time.' },
    ],
    output: [{ key: 'signalPayload', text: 'The body sent with the signal.' }],
    code: {
      file: 'send the signal',
      text: `POST /api/v1/workspaces/<workspace>/runs/<run>/signals/approved
Authorization: Bearer <token>

{ "by": "Sam" }`,
    },
    problems: [
      { code: 'SIGNAL_CORRELATION_MISSING', text: 'Correlation filled in to nothing, so there\'s no run to wait on.' },
      { code: 'AWAIT_SIGNAL_CORRELATION_INVALID', text: 'Correlation could never fill in to a value. Shown when you publish.' },
    ],
    related: ['wait-for-a-call', 'run-workflow', 'run-by-hand'],
  },

  'fail-run': {
    lead: 'Ends the whole run as failed, with a reason. Every other path stops and child runs are cancelled. Use it when something is wrong enough that the rest shouldn\'t happen.',
    settings: [
      { name: 'Reason', key: 'reason', text: 'Shown in the run history and in failure alerts, like "No reading from the soil sensor for an hour".' },
    ],
    ports: [],
    output: [],
    problems: [{ code: 'FAIL_RUN', text: 'The code the run fails with, so you can tell it from an accident.' }],
    related: ['end', 'if', 'wait-for-paths'],
  },

  end: {
    lead: 'Ends this path as done. Other paths carry on. In a workflow started by Run workflow, it can hand a value back to the run that started it.',
    settings: [
      { name: 'Output', key: 'output', text: 'Optional. A value worked out from the run, read by the parent as <code>childResult.output</code>. Only in workflows with a Run by hand trigger.' },
    ],
    ports: [],
    output: [],
    tip: {
      label: 'You often don\'t need one',
      text: 'A port with nothing connected also ends the path as done. Add End when you want to hand back an output, or to make the end obvious.',
    },
    problems: [
      { code: 'END_OUTPUT_WITHOUT_MANUAL_TRIGGER', text: 'Output is set in a workflow that has no Run by hand trigger, so no Run workflow step can start it.' },
      { code: 'END_OUTPUT_EVALUATION_ERROR', text: 'The output couldn\'t be worked out.' },
    ],
    related: ['run-workflow', 'fail-run', 'run-by-hand'],
  },

  'console-notification': {
    lead: 'Pops a notice in the console for everyone watching the workspace. Handy while you build, or on a screen on the wall.',
    settings: [
      { name: 'Title', key: 'title', text: 'The notice\'s heading. Values from the run can go in, like <code>{{trigger.payload.celsius}}</code>.' },
      { name: 'Message', key: 'message', text: 'The text under it.' },
    ],
    ports: [{ id: 'default', when: 'The notice was sent.' }],
    output: [],
    tip: { label: 'Nobody watching?', text: 'A console notification is only seen by people with the console open at the time. For anything you mustn\'t miss, use Telegram, ntfy or email.' },
    problems: [{ code: 'TOAST_PUBLISH_ERROR', text: 'The notice couldn\'t be sent. Retryable.' }],
    related: ['telegram', 'ntfy', 'email'],
  },

  'call-a-url': {
    lead: 'Calls any HTTP endpoint: Home Assistant, a spreadsheet script, your own server. The answer comes back into the run, and a failed call can leave by <code>error</code>.',
    settings: [
      { name: 'Method', key: 'method', req: true, text: '<code>GET</code>, <code>POST</code>, <code>PUT</code>, <code>PATCH</code>, <code>DELETE</code>, <code>HEAD</code> or <code>OPTIONS</code>.' },
      { name: 'URL', key: 'url', req: true, text: 'The address. With an integration, it can be a path under the integration\'s base URL.' },
      { name: 'Authentication', key: 'integrationRef', text: 'An HTTP auth or Home Assistant integration. Its credential is added for you and only ever sent to its own address.' },
      { name: 'Headers', key: 'headers', text: 'Up to 20 extra headers. Never put a credential here: that\'s what the integration is for.' },
      { name: 'Body', key: 'body', text: 'JSON to send. Values from the run can go in.' },
      { name: 'Timeout', key: 'timeoutSeconds', text: 'Seconds to wait for the answer, 1–60. 30 by default.' },
    ],
    ports: [
      { id: 'default', when: 'The call answered with a success.' },
      { id: 'error', when: 'With On failure set to continue: the call failed after its retries.' },
    ],
    output: [
      { key: 'status', text: 'The HTTP status.' },
      { key: 'body', text: 'The answer as text, up to 256 KB.' },
      { key: 'json', text: 'The answer, parsed, when it was JSON. Read <code>json.state</code> in a later node.' },
    ],
    tip: {
      label: 'What it won\'t do',
      text: 'Redirects aren\'t followed, and private or reserved addresses (your home network) are refused. To reach a box at home, expose it through a tunnel or use Home Assistant Cloud. 5xx, timeouts and network errors are retried; 4xx isn\'t.',
      warn: true,
    },
    problems: [
      { code: 'WEBHOOK_HTTP_ERROR', text: 'The server answered with an error status.' },
      { code: 'WEBHOOK_TIMEOUT', text: 'No answer within the timeout.' },
      { code: 'WEBHOOK_BLOCKED_TARGET', text: 'The address is private or reserved.' },
      { code: 'WEBHOOK_ORIGIN_MISMATCH', text: 'The URL points somewhere other than the integration\'s own address.' },
      { code: 'WEBHOOK_RESPONSE_TOO_LARGE', text: 'The answer was over 256 KB.' },
    ],
    related: ['for-each', 'if', 'webhook-received'],
  },

  email: {
    lead: 'Sends an email through your own mail server or provider, with values from the run in the subject and body.',
    settings: [
      { name: 'Send with', key: 'integrationRef', req: true, text: 'An Email (SMTP) integration: the server and the address it sends from.' },
      { name: 'To', key: 'to', req: true, text: 'One address, or several separated by commas. Can come from the run.' },
      { name: 'Subject', key: 'subject', req: true, text: 'Like <code>Greenhouse at {{trigger.payload.celsius}} °C</code>.' },
      { name: 'Message', key: 'body', req: true, text: 'The text of the email.' },
    ],
    ports: [{ id: 'default', when: 'The server accepted the email.' }],
    output: [],
    tip: { label: 'Credits', text: 'Email is the dearest step, at <b>10</b> credits. For alerts only you see, Telegram or ntfy cost 5.' },
    problems: [
      { code: 'EMAIL_RECIPIENT_MISSING', text: 'To filled in to nothing.' },
      { code: 'EMAIL_RECIPIENT_REFUSED', text: 'The server refused an address.' },
      { code: 'EMAIL_AUTH_FAILED', text: 'The server refused the sign-in.' },
      { code: 'EMAIL_NETWORK_ERROR', text: 'The server couldn\'t be reached. Retryable.' },
    ],
    related: ['telegram', 'ntfy', 'client-online-offline'],
  },

  telegram: {
    lead: 'Sends a message to a Telegram chat, group or channel through your bot. The quickest way to get alerts on your phone.',
    settings: [
      { name: 'Send with', key: 'integrationRef', req: true, text: 'A Telegram integration: your bot.' },
      { name: 'Chat ID', key: 'chatId', req: true, text: 'A numeric chat id, or <code>@channelname</code> for a public channel. The console lists the chats your bot heard from in the last 24 hours.' },
      { name: 'Message', key: 'message', req: true, text: '1–4,096 characters. Values from the run can go in.' },
      { name: 'Format', key: 'parseMode', text: 'Plain text by default, or <code>MarkdownV2</code> or <code>HTML</code>.' },
      { name: 'Silent', key: 'silent', text: 'Arrives without a sound.' },
      { name: 'Topic', key: 'messageThreadId', text: 'In a group with topics, the topic to post into.' },
      { name: 'No link preview', key: 'disableLinkPreview', text: 'Don\'t show a preview for a link in the message.' },
    ],
    ports: [{ id: 'default', when: 'Telegram accepted the message.' }],
    output: [{ key: 'telegram', text: '<code>{ messageId, chatId }</code> of the message sent.' }],
    problems: [
      { code: 'TELEGRAM_CHAT_FORBIDDEN', text: 'The bot was blocked or removed from the chat. Not retried.' },
      { code: 'TELEGRAM_CHAT_MISSING', text: 'No chat is set.' },
      { code: 'TELEGRAM_MESSAGE_INVALID', text: 'The message is empty or over 4,096 characters.' },
      { code: 'TELEGRAM_HTTP_ERROR', text: 'Telegram answered with an error. A 429 is retried.' },
    ],
    related: ['discord', 'ntfy', 'client-message'],
  },

  discord: {
    lead: 'Posts to a Discord channel through a webhook, as plain text, rich embeds, or both.',
    settings: [
      { name: 'Send with', key: 'integrationRef', req: true, text: 'A Discord integration: a channel\'s webhook.' },
      { name: 'Message', key: 'message', text: 'The text. Can be left out when there\'s an embed. Mentions like <code>@everyone</code> are never parsed.' },
      { name: 'Embeds', key: 'embeds', text: 'Up to 10 cards, each with a title, link, description, colour (<code>#RRGGBB</code>), fields, footer, image, thumbnail and an optional timestamp.' },
      { name: 'Name and picture', key: 'username, avatarUrl', text: 'Post under another name or picture than the webhook\'s own.' },
      { name: 'Thread', key: 'threadId', text: 'A thread in the channel to post into.' },
    ],
    ports: [{ id: 'default', when: 'Discord saved the message.' }],
    output: [{ key: 'discord', text: '<code>{ messageId, channelId }</code> of the message posted.' }],
    problems: [
      { code: 'DISCORD_MESSAGE_INVALID', text: 'There\'s no message and no embed, or the message is too long.' },
      { code: 'DISCORD_EMBED_INVALID', text: 'An embed has nothing visible, or a field is too long.' },
      { code: 'DISCORD_HTTP_ERROR', text: 'Discord answered with an error. A 429 is retried.' },
    ],
    related: ['telegram', 'ntfy', 'console-notification'],
  },

  ntfy: {
    lead: 'Pushes a notification to your phone or desktop through ntfy, with a title, a priority and tags. Works with ntfy.sh or your own server.',
    settings: [
      { name: 'Send with', key: 'integrationRef', req: true, text: 'An ntfy integration: the server and the topic.' },
      { name: 'Message', key: 'message', req: true, text: 'The notification text.' },
      { name: 'Title', key: 'title', text: 'A heading above it.' },
      { name: 'Priority', key: 'priority', text: '1 (min) to 5 (max). 3 when unset.' },
      { name: 'Tags', key: 'tags', text: 'Words ntfy shows as emoji where one matches, like <code>warning</code> or <code>seedling</code>.' },
    ],
    ports: [{ id: 'default', when: 'ntfy accepted the notification.' }],
    output: [],
    problems: [
      { code: 'NTFY_MESSAGE_MISSING', text: 'The message is empty.' },
      { code: 'NTFY_PRIORITY_INVALID', text: 'Priority isn\'t 1 to 5.' },
      { code: 'NTFY_AUTH_FAILED', text: 'The server refused the access token.' },
    ],
    related: ['telegram', 'discord', 'client-online-offline'],
  },
};
