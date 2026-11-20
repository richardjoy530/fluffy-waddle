// Every error code the WBSKT API and gateway return, grouped by area. Codes never change meaning.
export interface DocsError {
  code: string;
  status: number;
  text: string;
}

export interface DocsErrorGroup {
  id: string;
  title: string;
  codes: DocsError[];
}

export interface DocsStatusFilter {
  label: string;
  statuses: number[];
}

export const DOCS_STATUS_FILTERS: DocsStatusFilter[] = [
  { label: 'All', statuses: [] },
  { label: '400 Bad request', statuses: [400] },
  { label: '401 Not signed in', statuses: [401] },
  { label: '403 Not allowed', statuses: [403] },
  { label: '404 Not found', statuses: [404] },
  { label: '409 Conflict', statuses: [409] },
  { label: '429 Slow down', statuses: [429] },
  { label: '5xx Our side', statuses: [500, 503] },
];

export const DOCS_ERROR_GROUPS: DocsErrorGroup[] = [
  {
    id: 'any-request',
    title: 'Any request',
    codes: [
      {
        code: 'VALIDATION_FAILED',
        status: 400,
        text: 'A field is missing or malformed. <code>errors</code> lists each field and its messages.',
      },
      {
        code: 'PAGE_CURSOR_INVALID',
        status: 400,
        text: "The <code>cursor</code> isn't one a list gave you. Start again from the first page.",
      },
      {
        code: 'IDEMPOTENCY_KEY_INVALID',
        status: 400,
        text: 'The <code>Idempotency-Key</code> header is empty or too long.',
      },
      {
        code: 'TIME_RANGE_INVALID',
        status: 400,
        text: "<code>from</code> is after <code>to</code>, or one of them isn't a time.",
      },
      {
        code: 'TIME_RANGE_TOO_LONG',
        status: 400,
        text: 'The range is longer than this list allows. Ask for a shorter one.',
      },
      {
        code: 'AUTH_UNAUTHORIZED',
        status: 401,
        text: "You aren't signed in, or the token expired. Sign in again.",
      },
      { code: 'AUTH_FORBIDDEN', status: 403, text: 'Signed in, but not allowed to do this.' },
      { code: 'NOT_FOUND', status: 404, text: 'Nothing lives at that address.' },
      {
        code: 'RATE_LIMITED',
        status: 429,
        text: 'Too many requests. Wait the seconds in <code>Retry-After</code>.',
      },
      {
        code: 'INTERNAL_ERROR',
        status: 500,
        text: "Our fault. Quote the <code>traceId</code> on GitHub and we'll look.",
      },
      {
        code: 'UNAVAILABLE',
        status: 503,
        text: 'Something WBSKT depends on is down and nothing was done. Retry after <code>Retry-After</code>.',
      },
      {
        code: 'EVENT_BUS_UNAVAILABLE',
        status: 503,
        text: "The message bus is down, so the command wasn't sent. Retry after <code>Retry-After</code>.",
      },
      {
        code: 'AUTH_UNAVAILABLE',
        status: 503,
        text: 'Sign-in is briefly unavailable. Retry in a moment.',
      },
    ],
  },
  {
    id: 'board-connection',
    title: 'Board connection',
    codes: [
      {
        code: 'REGISTRATION_PIN_REQUIRED',
        status: 400,
        text: 'Registration was sent without a PIN.',
      },
      {
        code: 'POLICY_LIMIT_REACHED',
        status: 400,
        text: 'The policy has reached its own client limit. Raise the limit or use another policy.',
      },
      {
        code: 'SOCKET_PROTOCOL_UNSUPPORTED',
        status: 400,
        text: "The WebSocket didn't ask for the <code>wbskt.v1</code> subprotocol.",
      },
      {
        code: 'SOCKET_UPGRADE_REQUIRED',
        status: 400,
        text: 'A plain HTTP request reached <code>/ws</code>. Open a WebSocket instead.',
      },
      {
        code: 'CLIENT_NOT_REGISTERED',
        status: 401,
        text: 'The client is pending approval, or was revoked or rejected. Keep retrying; it connects once approved.',
      },
      {
        code: 'CLIENT_UNAUTHORIZED',
        status: 401,
        text: 'Its secret is no longer valid (deleted or rotated). Clear stored credentials and register again.',
      },
      {
        code: 'CLIENT_TOKEN_INVALID',
        status: 401,
        text: "The socket's access token is missing, expired or wrong. Log in again for a new one.",
      },
      {
        code: 'CLIENT_REVOKED',
        status: 403,
        text: 'Refused at connect: the client lost access after its token was issued.',
      },
      {
        code: 'POLICY_DISABLED',
        status: 403,
        text: 'The policy for that PIN is switched off. Enable it in the console.',
      },
    ],
  },
  {
    id: 'clients-and-commands',
    title: 'Clients and commands',
    codes: [
      { code: 'CLIENT_NAME_INVALID', status: 400, text: 'The name is empty or too long.' },
      {
        code: 'CLIENT_REFS_INVALID',
        status: 400,
        text: "A list of client references is empty, too long or holds something that isn't a reference.",
      },
      {
        code: 'CLIENT_TAG_INVALID',
        status: 400,
        text: "A tag is empty, too long or uses characters tags can't have.",
      },
      {
        code: 'CLIENT_TAGS_TOO_MANY',
        status: 400,
        text: 'A client can carry only so many tags. Remove some first.',
      },
      { code: 'CLIENT_UPDATE_EMPTY', status: 400, text: 'The update named no field to change.' },
      { code: 'COMMAND_TYPE_INVALID', status: 400, text: 'The command type is empty or too long.' },
      {
        code: 'COMMAND_TYPE_RESERVED',
        status: 400,
        text: 'The command type starts with <code>sys.</code> or is otherwise reserved.',
      },
      { code: 'COMMAND_PAYLOAD_TOO_LARGE', status: 400, text: 'The command is over 64 KB.' },
      {
        code: 'COMMAND_EXPIRY_INVALID',
        status: 400,
        text: 'The expiry is in the past or further out than a command can wait.',
      },
      {
        code: 'COMMAND_STATUS_INVALID',
        status: 400,
        text: "The status filter isn't one commands can have.",
      },
      {
        code: 'DIRECTION_INVALID',
        status: 400,
        text: 'The direction filter must be <code>inbound</code> or <code>outbound</code>.',
      },
      {
        code: 'EVENT_LOG_SEARCH_TOO_LONG',
        status: 400,
        text: 'The activity search text is too long.',
      },
      {
        code: 'DELETED_WINDOW_INVALID',
        status: 400,
        text: 'The window for recently deleted clients is out of range.',
      },
      {
        code: 'CLIENT_NOT_FOUND',
        status: 404,
        text: 'No client with that reference in this workspace.',
      },
      {
        code: 'COMMAND_NOT_QUEUED',
        status: 404,
        text: "There's no queued command with that id; it was delivered, expired or cancelled.",
      },
      {
        code: 'CLIENT_INACTIVE',
        status: 409,
        text: "The client is paused or revoked, so it can't take commands.",
      },
    ],
  },
  {
    id: 'firmware-and-readings',
    title: 'Firmware updates and readings',
    codes: [
      { code: 'OTA_URL_INVALID', status: 400, text: 'Firmware links must be <code>https</code>.' },
      { code: 'OTA_SHA256_INVALID', status: 400, text: 'The SHA-256 must be 64 hex characters.' },
      {
        code: 'OTA_SIZE_INVALID',
        status: 400,
        text: 'The firmware size must be a positive number of bytes.',
      },
      { code: 'OTA_VERSION_INVALID', status: 400, text: 'The version is empty or too long.' },
      {
        code: 'OTA_NOT_SUPPORTED',
        status: 409,
        text: "The client didn't list <code>ota</code> in its capabilities.",
      },
      {
        code: 'READINGS_NAME_REQUIRED',
        status: 400,
        text: 'Say which state variable to chart with <code>name</code>.',
      },
      {
        code: 'READINGS_NAME_INVALID',
        status: 400,
        text: 'The variable name is too long or malformed.',
      },
      {
        code: 'READINGS_BUCKET_INVALID',
        status: 400,
        text: "The bucket size isn't one readings can be grouped by.",
      },
      {
        code: 'READINGS_RANGE_TOO_LARGE',
        status: 400,
        text: 'The time range is longer than readings are kept for.',
      },
      {
        code: 'READINGS_TOO_MANY_BUCKETS',
        status: 400,
        text: 'The range and bucket size make too many points. Use bigger buckets.',
      },
    ],
  },
  {
    id: 'policies-and-templates',
    title: 'Policies and templates',
    codes: [
      { code: 'POLICY_NAME_REQUIRED', status: 400, text: 'A policy needs a name.' },
      {
        code: 'POLICY_LIMIT_CONFLICT',
        status: 400,
        text: 'The client limit is below the number of clients already in the policy.',
      },
      {
        code: 'TEMPLATE_NAME_INVALID',
        status: 400,
        text: 'The template name is empty or too long.',
      },
      {
        code: 'TEMPLATE_TYPE_INVALID',
        status: 400,
        text: "The template's message type is empty or too long.",
      },
      {
        code: 'TEMPLATE_TYPE_RESERVED',
        status: 400,
        text: "The template's message type is reserved, like <code>sys.</code> types.",
      },
      {
        code: 'TEMPLATE_PAYLOAD_INVALID',
        status: 400,
        text: "The payload isn't valid JSON, or it's over 64 KB.",
      },
      {
        code: 'POLICY_NOT_FOUND',
        status: 404,
        text: 'No policy with that reference in this workspace.',
      },
      {
        code: 'TEMPLATE_NOT_FOUND',
        status: 404,
        text: 'No template with that reference in this workspace.',
      },
    ],
  },
  {
    id: 'workflows-and-runs',
    title: 'Workflows and runs',
    codes: [
      {
        code: 'WORKFLOW_VALIDATION_FAILED',
        status: 400,
        text: 'The workflow has problems: a missing trigger, an unconnected port or a bad setting. The response lists each one.',
      },
      {
        code: 'WORKFLOW_DRAFT_INVALID',
        status: 400,
        text: "The draft can't be read as a workflow.",
      },
      {
        code: 'TEST_RUN_TRIGGER_REQUIRED',
        status: 400,
        text: 'A test run needs a trigger payload to start from.',
      },
      {
        code: 'TEST_RUN_TRIGGER_NOT_FOUND',
        status: 400,
        text: "The test run names a trigger the draft doesn't have.",
      },
      {
        code: 'WORKFLOW_NOT_FOUND',
        status: 404,
        text: 'No workflow with that reference in this workspace.',
      },
      {
        code: 'WORKFLOW_DRAFT_NOT_FOUND',
        status: 404,
        text: 'The workflow has no draft. Start one from the published version.',
      },
      {
        code: 'WORKFLOW_VERSION_NOT_FOUND',
        status: 404,
        text: 'The workflow has no version with that number.',
      },
      { code: 'RUN_NOT_FOUND', status: 404, text: 'No run with that reference in this workspace.' },
      { code: 'VARIABLE_NOT_FOUND', status: 404, text: "The shared variable hasn't been set yet." },
      {
        code: 'WORKFLOW_DEPRECATED',
        status: 409,
        text: 'The workflow is deprecated and takes no new runs. Reinstate it first.',
      },
      {
        code: 'WORKFLOW_DELETED',
        status: 409,
        text: 'The workflow was deleted. Restore it before changing it.',
      },
      {
        code: 'WORKFLOW_REF_TAKEN',
        status: 409,
        text: 'Another workflow in the workspace already uses that reference.',
      },
      { code: 'RUN_NOT_CANCELLABLE', status: 409, text: 'The run has already finished.' },
      {
        code: 'RUN_DROPPED_BY_CONCURRENCY_POLICY',
        status: 409,
        text: 'A run by hand was dropped: a run is going and the trigger is set to <b>Skip it</b>.',
      },
      {
        code: 'WORKFLOW_HAS_NO_MANUAL_TRIGGER',
        status: 409,
        text: "The workflow has no Run by hand trigger, so it can't be started from the console or the API.",
      },
    ],
  },
  {
    id: 'integrations',
    title: 'Integrations',
    codes: [
      { code: 'INTEGRATION_NAME_INVALID', status: 400, text: 'The name is empty or too long.' },
      {
        code: 'INTEGRATION_TYPE_INVALID',
        status: 400,
        text: "That isn't a kind of integration WBSKT has.",
      },
      {
        code: 'INTEGRATION_PRESET_INVALID',
        status: 400,
        text: "The HTTP auth preset is unknown, or its fields don't match it.",
      },
      {
        code: 'INTEGRATION_SECRET_UNREADABLE',
        status: 400,
        text: "A stored secret can't be read any more. Enter it again.",
      },
      {
        code: 'INTEGRATION_NOT_FOUND',
        status: 404,
        text: 'No integration with that reference in this workspace.',
      },
      {
        code: 'INTEGRATION_NAME_TAKEN',
        status: 409,
        text: 'Another integration in the workspace has that name.',
      },
      {
        code: 'INTEGRATIONS_UNAVAILABLE',
        status: 503,
        text: 'The integration service is down and nothing was sent. Retry in a moment.',
      },
      {
        code: 'INTEGRATION_LIMIT_REACHED',
        status: 409,
        text: 'The workspace already has 50 integrations. Delete one you no longer use.',
      },
      {
        code: 'INTEGRATION_IN_USE',
        status: 409,
        text: "A live workflow uses it. Turn those workflows off, or make a version live that doesn't use it, first. The answer lists them.",
      },
      {
        code: 'INTEGRATION_RUNS_IN_FLIGHT',
        status: 409,
        text: 'Runs still going use it and would fail at that step. Wait for them, or delete it anyway with <code>confirm=true</code>.',
      },
      {
        code: 'INTEGRATION_CHANGED',
        status: 409,
        text: 'Someone else changed it while you were saving. Reload it and try again.',
      },
      {
        code: 'INTEGRATION_TYPE_IMMUTABLE',
        status: 400,
        text: "An integration's type can't change. Add a new one instead.",
      },
      {
        code: 'INTEGRATION_TYPE_UNSUPPORTED',
        status: 400,
        text: 'Only a Telegram integration can list its chats.',
      },
      {
        code: 'INTEGRATION_WEBHOOK_ACTIVE',
        status: 409,
        text: "The Telegram bot has a webhook set, so Telegram won't list its recent chats. Type the chat id, or remove the webhook.",
      },
      {
        code: 'INTEGRATION_BOT_BUSY',
        status: 409,
        text: "Another program is reading the bot's updates, so Telegram won't list its recent chats. Try again, or type the chat id.",
      },
      {
        code: 'INTEGRATIONS_NOT_CONFIGURED',
        status: 503,
        text: "Integrations aren't set up on this server, so secrets can't be stored.",
      },
    ],
  },
  {
    id: 'sign-in-and-account',
    title: 'Sign-in and account',
    codes: [
      {
        code: 'PASSWORD_BREACHED',
        status: 400,
        text: 'That password has appeared in a data breach. Choose another.',
      },
      {
        code: 'AUTH_CURRENT_PASSWORD_INVALID',
        status: 400,
        text: 'The current password you typed is wrong.',
      },
      {
        code: 'AUTH_OPERATION_REJECTED',
        status: 400,
        text: "The request couldn't be completed as asked. Check the details and try again.",
      },
      {
        code: 'RESET_TOKEN_INVALID',
        status: 400,
        text: 'The password reset link has expired or was already used. Ask for a new one.',
      },
      {
        code: 'VERIFICATION_TOKEN_INVALID',
        status: 400,
        text: 'The email link has expired or was already used. Ask for a new one.',
      },
      {
        code: 'EMAIL_CHANGE_TOKEN_INVALID',
        status: 400,
        text: 'The link to confirm a new email has expired or was already used.',
      },
      { code: 'EMAIL_UNCHANGED', status: 400, text: "That's already your email." },
      { code: 'ACCOUNT_NO_CHANGES', status: 400, text: 'The update named nothing to change.' },
      {
        code: 'USERNAME_CHANGED_RECENTLY',
        status: 400,
        text: 'You changed your username a short while ago. Wait before changing it again.',
      },
      { code: 'USERNAME_RESERVED', status: 400, text: 'That username is reserved. Pick another.' },
      { code: 'AUTH_INVALID_CREDENTIALS', status: 401, text: 'Wrong email or password.' },
      {
        code: 'AUTH_INVALID_TOKEN',
        status: 401,
        text: 'The token is malformed or signed by someone else. Sign in again.',
      },
      {
        code: 'AUTH_TOKEN_INACTIVE',
        status: 401,
        text: 'The session was signed out or replaced. Sign in again.',
      },
      {
        code: 'AUTH_USER_INACTIVE',
        status: 401,
        text: 'The account is suspended. Ask an admin of your account.',
      },
      {
        code: 'AUTH_USER_NOT_FOUND',
        status: 401,
        text: 'The account behind this token no longer exists.',
      },
      {
        code: 'AUTH_ACCOUNT_LOCKED',
        status: 403,
        text: 'Too many failed sign-ins. Wait, or reset your password.',
      },
      { code: 'AUTH_SESSION_NOT_FOUND', status: 404, text: 'That session was already signed out.' },
      { code: 'USERNAME_TAKEN', status: 409, text: 'Someone already uses that username.' },
      {
        code: 'AUTH_USERNAME_CONFLICT',
        status: 409,
        text: 'Someone took that username at the same moment. Try another.',
      },
      {
        code: 'EMAIL_CHANGE_CONFLICT',
        status: 409,
        text: 'Another account already uses that email.',
      },
      {
        code: 'ACCOUNT_SOLE_ADMINISTRATOR',
        status: 409,
        text: "You're the only admin somewhere. Make someone else an admin before deleting your account.",
      },
      {
        code: 'ACCOUNT_DELETE_RETRY',
        status: 409,
        text: 'Deleting the account was interrupted. Send the request again.',
      },
      {
        code: 'AUTH_EMAIL_UNVERIFIED',
        status: 401,
        text: 'Confirm your email address before signing in. Ask for a new link if the old one expired.',
      },
      {
        code: 'SIGNUP_CHALLENGE_REQUIRED',
        status: 400,
        text: 'Signing up needs a solved challenge. Fetch one and send its answer with the sign-up.',
      },
      {
        code: 'SIGNUP_CHALLENGE_INVALID',
        status: 400,
        text: 'The sign-up challenge expired, was used already, or the answer is wrong. Fetch a new one.',
      },
      {
        code: 'BILLING_SUBSCRIPTION_NOT_CANCELLED',
        status: 503,
        text: "Your subscription couldn't be cancelled with the payment provider, so nothing was deleted. Try again shortly.",
      },
    ],
  },
  {
    id: 'workspaces-and-members',
    title: 'Workspaces, members and roles',
    codes: [
      {
        code: 'INVITATION_INVALID',
        status: 400,
        text: 'The invite has expired, was revoked or was already used.',
      },
      {
        code: 'WORKSPACE_OWNER_PROTECTED',
        status: 400,
        text: "The owner can't be removed. Transfer ownership first.",
      },
      {
        code: 'CANNOT_REMOVE_SELF',
        status: 400,
        text: "You can't remove yourself this way. Leave the workspace instead.",
      },
      {
        code: 'AUTH_CANNOT_SUSPEND_SELF',
        status: 400,
        text: "You can't suspend your own account.",
      },
      {
        code: 'MEMBER_UPDATE_EMPTY',
        status: 400,
        text: 'The update named nothing to change for that member.',
      },
      { code: 'TENANT_REQUIRED', status: 400, text: 'Say which account the request is for.' },
      {
        code: 'WORKSPACE_UNAUTHENTICATED',
        status: 401,
        text: 'The request reached a workspace without a signed-in user. Sign in again.',
      },
      {
        code: 'WORKSPACE_FORBIDDEN',
        status: 403,
        text: "You aren't a member of that workspace, or it doesn't exist. We don't say which.",
      },
      {
        code: 'WORKSPACE_NOT_FOUND',
        status: 403,
        text: 'Same answer as above, from the sign-in side: not a workspace you can open.',
      },
      {
        code: 'PERMISSION_UNAUTHORIZED',
        status: 403,
        text: "You're a member but lack the permission. Ask an admin for a role that has it.",
      },
      { code: 'TENANT_NOT_FOUND', status: 403, text: 'Not an account you belong to.' },
      { code: 'ROLE_NOT_FOUND', status: 404, text: 'No role with that reference in your account.' },
      {
        code: 'GROUP_NOT_FOUND',
        status: 404,
        text: 'No group with that reference in your account.',
      },
      { code: 'USER_NOT_FOUND', status: 404, text: 'No such person in your account.' },
      {
        code: 'AUTH_ALREADY_MEMBER',
        status: 409,
        text: 'That person is already in the workspace.',
      },
      {
        code: 'AUTH_ROLE_CONFLICT',
        status: 409,
        text: 'The role was changed by someone else at the same time. Reload and try again.',
      },
      {
        code: 'AUTH_GROUP_CONFLICT',
        status: 409,
        text: 'The group was changed by someone else at the same time. Reload and try again.',
      },
      {
        code: 'TENANT_SOLE_ADMINISTRATOR',
        status: 409,
        text: "You're the account's only admin. Make someone else an admin first.",
      },
      {
        code: 'TENANT_LEAVE_LAST',
        status: 409,
        text: "This is the only account you belong to, so you can't leave it.",
      },
      {
        code: 'TENANT_LEAVE_SOLE_MEMBER',
        status: 409,
        text: "You're the account's only member. Delete the account instead of leaving it.",
      },
      {
        code: 'WORKSPACE_RESOLVE_ERROR',
        status: 500,
        text: "We couldn't check your membership just then. Try again.",
      },
      {
        code: 'PLAN_WORKSPACE_LIMIT_REACHED',
        status: 409,
        text: 'Your plan allows no more workspaces. Delete one, or upgrade.',
      },
      {
        code: 'PLAN_MEMBER_LIMIT_REACHED',
        status: 409,
        text: 'Your plan allows no more members. Remove one, or upgrade.',
      },
      {
        code: 'TENANT_FREE_LIMIT_REACHED',
        status: 409,
        text: 'You already have a Free account of your own. Upgrade it before creating another.',
      },
      {
        code: 'ROLE_BUILT_IN',
        status: 409,
        text: "The built-in Admin role holds every permission and can't be changed or deleted. Make a role of your own instead.",
      },
      {
        code: 'EVENT_LOG_GROUP_UNKNOWN',
        status: 400,
        text: "<code>group</code> isn't one of <code>people</code>, <code>clients</code>, <code>policies</code>, <code>workflows</code>, <code>integrations</code> or <code>security</code>.",
      },
      {
        code: 'EVENT_LOG_SOURCE_UNKNOWN',
        status: 400,
        text: "<code>source</code> isn't one of <code>Console</code>, <code>Api</code>, <code>Client</code>, <code>Workflow</code>, <code>System</code> or <code>Support</code>.",
      },
      {
        code: 'MESSAGES_BUCKET_INVALID',
        status: 400,
        text: 'Message counts come by the hour or by the day: <code>1h</code> or <code>1d</code>.',
      },
      {
        code: 'MESSAGES_HOURLY_EXPIRED',
        status: 400,
        text: 'Hourly message counts are no longer kept that far back. Ask for days instead.',
      },
    ],
  },
  {
    id: 'plans-and-billing',
    title: 'Plans, billing and usage',
    codes: [
      {
        code: 'BILLING_UNAVAILABLE',
        status: 503,
        text: "Payments aren't set up on this server.",
      },
      {
        code: 'BILLING_CHECKOUT_INVALID',
        status: 400,
        text: 'A checkout names either a plan with its interval, or a credit pack.',
      },
      {
        code: 'BILLING_OFFER_INVALID',
        status: 400,
        text: "That plan isn't offered on that interval.",
      },
      {
        code: 'BILLING_SUBSCRIPTION_ACTIVE',
        status: 409,
        text: 'The account already has a subscription. Change its plan instead of starting another.',
      },
      {
        code: 'BILLING_SUBSCRIPTION_REQUIRED',
        status: 409,
        text: 'There is no subscription to change. Start one with a checkout.',
      },
      {
        code: 'BILLING_SUBSCRIPTION_NOT_CHANGEABLE',
        status: 409,
        text: 'The subscription is cancelled or a payment failed. Resume it or settle the payment in the billing portal first.',
      },
      {
        code: 'BILLING_PLAN_SET_BY_OPERATOR',
        status: 403,
        text: 'WBSKT set this plan for you, so a subscription would change nothing. Contact us to change it. Credit packs can still be bought.',
      },
      {
        code: 'BILLING_CUSTOMER_NOT_FOUND',
        status: 404,
        text: "The account hasn't paid for anything yet, so it has no billing portal.",
      },
      {
        code: 'BILLING_CUSTOMER_SHARED',
        status: 409,
        text: "The account shares a payment customer with another account, so its portal would show the other's billing. Contact support.",
      },
      {
        code: 'BILLING_PROVIDER_REFUSED',
        status: 409,
        text: 'The payment provider refused the request. Check the subscription in the billing portal.',
      },
      {
        code: 'BILLING_PROVIDER_UNAVAILABLE',
        status: 503,
        text: "The payment provider couldn't be reached. Try again shortly.",
      },
      {
        code: 'WORKSPACE_CREDIT_CAP_INVALID',
        status: 400,
        text: 'A monthly credit cap is from 0 to 10<sup>12</sup> credits, or <code>null</code> for none.',
      },
      {
        code: 'WORKSPACE_CREDIT_CAP_BUSY',
        status: 503,
        text: "The workspace's runs held the cap for too long. Try again after <code>Retry-After</code>.",
      },
    ],
  },
];
