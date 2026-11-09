// Each integration type's page. Text may hold <code>, <b> and <i>.
export interface DocsIntegrationField {
  name: string;
  key: string;
  secret?: boolean;
  req?: boolean;
  text: string;
}

export interface DocsIntegration {
  slug: string;
  name: string;
  mark: string;
  tone: string;
  category: string;
  blurb: string;
  lead: string;
  nodes: string[];
  steps: string[];
  fields: DocsIntegrationField[];
  test: string;
  tip?: { label: string; text: string; warn?: boolean };
  problems: { code: string; text: string }[];
}

export const DOCS_INTEGRATIONS: DocsIntegration[] = [
  {
    slug: 'telegram',
    name: 'Telegram',
    mark: 'T',
    tone: 'lg-tg',
    category: 'Chat',
    blurb: 'A bot token. WBSKT lists the chats your bot is in so you can pick one.',
    lead: 'A Telegram bot that messages you, a group or a channel. Most people start here: it takes two minutes and the alerts land on your phone.',
    nodes: ['telegram'],
    steps: [
      'In Telegram, open a chat with <b>@BotFather</b>, send <code>/newbot</code> and follow along. Copy the token it gives you.',
      'Add your bot to the chat, group or channel it should post in, and send it any message so it can see the chat.',
      'In the console, open <b>Integrations</b>, choose <b>Add integration</b>, pick <b>Telegram</b> and paste the token.',
      'Press <b>Test</b>, then pick the integration in a Telegram node and choose the chat from the list.',
    ],
    fields: [
      { name: 'Bot token', key: 'botToken', secret: true, req: true, text: 'From @BotFather: digits, a colon, then the key, like <code>123456:ABC-DEF…</code>.' },
    ],
    test: 'Asks Telegram who the bot is (<code>getMe</code>). Nothing is posted.',
    tip: {
      label: 'Finding the chat',
      text: 'The chat list shows chats the bot heard from in the last 24 hours. If yours is missing, send the bot a message there and refresh. A public channel can also be named as <code>@channelname</code>.',
    },
    problems: [
      { code: 'INTEGRATION_AUTH_FAILED', text: 'Telegram doesn\'t know the token. It was revoked or mistyped.' },
      { code: 'TELEGRAM_CHAT_FORBIDDEN', text: 'At send time: the bot was blocked or removed from the chat.' },
    ],
  },
  {
    slug: 'discord',
    name: 'Discord',
    mark: 'D',
    tone: 'lg-dc',
    category: 'Chat',
    blurb: 'A channel webhook URL. Send plain text or rich embeds.',
    lead: 'A Discord channel\'s webhook. The URL is the whole credential, so WBSKT keeps it sealed like a password.',
    nodes: ['discord'],
    steps: [
      'In Discord, open the channel\'s settings, then <b>Integrations</b> › <b>Webhooks</b> › <b>New Webhook</b>.',
      'Name it and pick its picture if you like, then <b>Copy Webhook URL</b>.',
      'Add a Discord integration in the console and paste the URL.',
      'Press <b>Test</b>, then pick it in a Discord node.',
    ],
    fields: [
      { name: 'Webhook URL', key: 'webhookUrl', secret: true, req: true, text: 'Starts with <code>https://discord.com/api/webhooks/</code>.' },
    ],
    test: 'Reads the webhook\'s details from Discord. Nothing is posted to the channel.',
    problems: [
      { code: 'INTEGRATION_SECRET_INVALID', text: 'The URL isn\'t a Discord webhook URL.' },
      { code: 'INTEGRATION_HTTP_ERROR', text: 'Discord answered with an error: usually the webhook was deleted.' },
    ],
  },
  {
    slug: 'email',
    name: 'Email (SMTP)',
    mark: '@',
    tone: 'lg-em',
    category: 'Email',
    blurb: 'Your mail server, port, sign-in and from address. Works with any SMTP provider.',
    lead: 'Any mail server or provider that speaks SMTP: your own domain, Gmail with an app password, or a sending service like Postmark, Mailgun or Amazon SES.',
    nodes: ['email'],
    steps: [
      'From your provider, get the SMTP host, port, user name and password. Many call the password an <i>app password</i> or <i>SMTP key</i>.',
      'Add an Email (SMTP) integration with those, and the address mail should come from.',
      'Press <b>Test</b>, optionally with an address to send a test email to.',
      'Pick it in an Email node.',
    ],
    fields: [
      { name: 'Host', key: 'host', req: true, text: 'The server\'s name, like <code>smtp.example.com</code>.' },
      { name: 'Port', key: 'port', text: '587 by default. One of 25, 465, 587 or 2525.' },
      { name: 'Security', key: 'tls', text: '<b>STARTTLS</b> (upgrades after connecting, usually 587) or <b>Implicit TLS</b> (from the start, usually 465). Picked from the port when left out. Mail is never sent unencrypted.' },
      { name: 'User name', key: 'userName', text: 'Leave empty for a relay that doesn\'t ask you to sign in.' },
      { name: 'Password', key: 'password', secret: true, text: 'Needed when there\'s a user name.' },
      { name: 'From address', key: 'fromAddress', req: true, text: 'The address mail is sent as. Your provider must allow it.' },
      { name: 'From name', key: 'fromName', text: 'Shown beside it, like <code>Greenhouse</code>.' },
    ],
    test: 'Connects, starts TLS and signs in. Give it an address and it also sends a test email there.',
    problems: [
      { code: 'INTEGRATION_AUTH_FAILED', text: 'The server refused the user name or password.' },
      { code: 'INTEGRATION_TLS_FAILED', text: 'The TLS handshake failed. Check the port and security setting go together.' },
      { code: 'INTEGRATION_UNREACHABLE', text: 'Nothing answered at that host and port.' },
    ],
  },
  {
    slug: 'ntfy',
    name: 'ntfy',
    mark: 'n',
    tone: 'lg-nt',
    category: 'Push',
    blurb: 'A topic on ntfy.sh or your own server, with an access token if it\'s protected.',
    lead: 'Push notifications through <b>ntfy</b>, a free app for Android, iOS and the desktop. Use the public ntfy.sh server or run your own.',
    nodes: ['ntfy'],
    steps: [
      'Install the ntfy app and subscribe to a topic. Pick a long, hard-to-guess name: on ntfy.sh anyone who knows a topic can read it.',
      'Add an ntfy integration with the same topic, and an access token if your server needs one.',
      'Press <b>Test</b>. A notification should arrive on your phone.',
      'Pick it in an ntfy node.',
    ],
    fields: [
      { name: 'Server', key: 'serverUrl', text: '<code>https://ntfy.sh</code> by default, or your own server\'s address.' },
      { name: 'Topic', key: 'topic', secret: true, req: true, text: '1–64 letters, digits, <code>-</code> or <code>_</code>. Kept secret, since knowing it is enough to read it.' },
      { name: 'Access token', key: 'accessToken', secret: true, text: 'For a protected topic.' },
    ],
    test: 'Sends a test notification to the topic. ntfy has no way to check access without publishing.',
    problems: [
      { code: 'INTEGRATION_SECRET_INVALID', text: 'The topic is missing or has characters ntfy doesn\'t allow.' },
      { code: 'INTEGRATION_AUTH_FAILED', text: 'The server refused the access token.' },
    ],
  },
  {
    slug: 'http-auth',
    name: 'HTTP auth',
    mark: 'H',
    tone: 'lg-ht',
    category: 'HTTP',
    blurb: 'A bearer token, basic sign-in or a header for a URL that needs one.',
    lead: 'A credential for an API that the Call a URL node uses. The credential is tied to one address, so a workflow can never send it anywhere else.',
    nodes: ['call-a-url'],
    steps: [
      'Get an API key or token from the service you want to call.',
      'Add an HTTP auth integration with the service\'s base URL and how it wants the credential.',
      'Press <b>Test</b>.',
      'In a Call a URL node, pick it under <b>Authentication</b> and write the URL as a path, like <code>/v1/rows</code>.',
    ],
    fields: [
      { name: 'Base URL', key: 'baseUrl', req: true, text: 'Where the credential may go, like <code>https://api.example.com</code>. Must be HTTPS. A node\'s URL is a path under it, or a full URL with the same origin.' },
      { name: 'Mode', key: 'mode', req: true, text: '<b>Bearer</b> (<code>Authorization: Bearer …</code>), <b>Basic</b> (a user name and password) or <b>Header</b> (any header you name).' },
      { name: 'Token', key: 'token', secret: true, text: 'For Bearer.' },
      { name: 'User name and password', key: 'userName, password', secret: true, text: 'For Basic. Only the password is secret.' },
      { name: 'Header name and value', key: 'headerName, headerValue', secret: true, text: 'For Header, like <code>X-Api-Key</code>. Only the value is secret. Headers the HTTP stack owns, like <code>Host</code> or <code>Cookie</code>, can\'t be used.' },
    ],
    test: 'Makes a <code>GET</code> to the base URL with the credential and reports what came back.',
    tip: {
      label: 'Home networks',
      text: 'WBSKT calls from the internet and refuses private addresses like <code>192.168.x.x</code>. The service has to be reachable from outside.',
      warn: true,
    },
    problems: [
      { code: 'INTEGRATION_CONFIG_INVALID', text: 'The base URL isn\'t HTTPS, or a setting doesn\'t fit the mode.' },
      { code: 'INTEGRATION_AUTH_FAILED', text: 'The service refused the credential.' },
      { code: 'WEBHOOK_ORIGIN_MISMATCH', text: 'At send time: the node\'s URL points away from the base URL.' },
    ],
  },
  {
    slug: 'home-assistant',
    name: 'Home Assistant',
    mark: 'HA',
    tone: 'lg-ha',
    category: 'HTTP',
    blurb: 'A ready-made HTTP auth: your instance\'s address and a long-lived token.',
    lead: 'HTTP auth set up for Home Assistant, so a workflow can turn on a light, run a script or read a sensor through its REST API.',
    nodes: ['call-a-url'],
    steps: [
      'In Home Assistant, open your profile, then <b>Security</b> › <b>Long-lived access tokens</b> › <b>Create token</b>.',
      'Add a Home Assistant integration with your instance\'s address, like your Nabu Casa URL, and the token.',
      'Press <b>Test</b>. It says which instance answered.',
      'In a Call a URL node, pick it and call, say, <code>POST /api/services/light/turn_on</code> with <code>{ "entity_id": "light.porch" }</code>.',
    ],
    fields: [
      { name: 'Address', key: 'baseUrl', req: true, text: 'Your instance, reachable from the internet over HTTPS.' },
      { name: 'Access token', key: 'token', secret: true, req: true, text: 'The long-lived token. Home Assistant only takes bearer tokens.' },
    ],
    test: 'Calls <code>/api/config</code>, which needs a valid token, and shows the instance\'s name.',
    problems: [
      { code: 'INTEGRATION_AUTH_FAILED', text: 'Home Assistant refused the token.' },
      { code: 'INTEGRATION_UNREACHABLE', text: 'The address can\'t be reached from the internet.' },
    ],
  },
];
