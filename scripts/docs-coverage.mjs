#!/usr/bin/env node
// Checks the product docs against a checkout of wbskt/Wbskt: every workflow node kind has a node
// page, every error code the API can return is documented somewhere under pages/docs (or is listed,
// with a reason, in docs-coverage-ignore.json), and the scenarios index lists every page's "What
// happens when…" question. Exits 1 and prints what is missing.
//
//   node scripts/docs-coverage.mjs ../Wbskt
//   node scripts/docs-coverage.mjs ../Wbskt --markdown   (the report as Markdown, for an issue)

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(import.meta.url), '..', '..');
const backend = process.argv[2];
const markdown = process.argv.includes('--markdown');
if (!backend) {
  console.error('Usage: node scripts/docs-coverage.mjs <path to a wbskt/Wbskt checkout> [--markdown]');
  process.exit(2);
}

const docsDir = join(root, 'app/src/app/pages/docs');
const ignore = JSON.parse(readFileSync(join(root, 'scripts/docs-coverage-ignore.json'), 'utf8'));

function walk(dir, keep, skip = () => false) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (skip(name)) continue;
    if (statSync(path).isDirectory()) out.push(...walk(path, keep, skip));
    else if (keep(name)) out.push(path);
  }
  return out;
}

const skipDir = (name) => ['bin', 'obj', 'node_modules', '.git', 'Tests'].includes(name);
const sources = walk(backend, (n) => n.endsWith('.cs'), skipDir).map((path) => ({
  path: relative(backend, path),
  text: readFileSync(path, 'utf8'),
}));
const docsText = walk(docsDir, (n) => n.endsWith('.html') || n.endsWith('.ts'))
  .map((p) => readFileSync(p, 'utf8'))
  .join('\n');

// A code a user can meet: the first argument of an API error (Error.Conflict(...)), a validation issue
// (Error(...), Warning(...)) or a step failure (Fail(...), Failed(...)), or a constant holding one.
// Calls may break across lines. Codes are UPPER_SNAKE with at least one underscore.
const code = '"([A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+)"';
const codePatterns = [
  new RegExp(`\\b(?:Error(?:\\.\\w+)?|Warning|Fail|Failed)\\(\\s*${code}`, 'g'),
  new RegExp(`\\bconst string \\w+ = ${code};`, 'g'),
];
const apiCodes = new Map();
for (const { path, text } of sources) {
  for (const pattern of codePatterns) {
    for (const m of text.matchAll(pattern)) {
      if (!apiCodes.has(m[1])) apiCodes.set(m[1], path);
    }
  }
}

const nodeKindFile = sources.find((s) => s.path.endsWith('Models/Nodes/NodeKind.cs'));
if (!nodeKindFile) {
  console.error('NodeKind.cs not found: is this a wbskt/Wbskt checkout?');
  process.exit(2);
}
const nodeKinds = [...nodeKindFile.text.matchAll(/const string \w+ = "([a-z]+:[A-Za-z]+)"/g)].map((m) => m[1]);
const documentedKinds = new Set(
  [...readFileSync(join(docsDir, 'data/nodes.ts'), 'utf8').matchAll(/kind: '([a-z]+:[A-Za-z]+)'/g)].map((m) => m[1]),
);

if (apiCodes.size === 0 || nodeKinds.length === 0) {
  console.error('Found no error codes or no node kinds: the backend layout changed, so this check needs updating.');
  process.exit(2);
}

const ignored = new Set(Object.keys(ignore.errorCodes));
const missingCodes = [...apiCodes]
  .filter(([code]) => !ignored.has(code) && !new RegExp(`\\b${code}\\b`).test(docsText))
  .sort(([a], [b]) => a.localeCompare(b));
const missingKinds = nodeKinds.filter((k) => !documentedKinds.has(k) && !(k in ignore.nodeKinds));
const staleIgnores = [
  ...[...ignored].filter((code) => !apiCodes.has(code)),
  ...Object.keys(ignore.nodeKinds).filter((k) => !nodeKinds.includes(k)),
];

// The error reference lists only codes the backend still has.
const listedCodes = [...readFileSync(join(docsDir, 'data/errors.ts'), 'utf8').matchAll(/code: '([A-Z0-9_]+)'/g)].map((m) => m[1]);
const anyCode = new Set(sources.flatMap(({ text }) => [...text.matchAll(new RegExp(code, 'g'))].map((m) => m[1])));
const generic = ['NOT_FOUND', 'UNAVAILABLE'];
const goneCodes = listedCodes.filter((c) => !anyCode.has(c) && !generic.includes(c));

// The scenarios index lists every "What happens when…" question on the other pages.
const scenarios = readFileSync(join(docsDir, 'scenarios/scenarios.html'), 'utf8');
const missingScenarios = [];
for (const path of walk(docsDir, (n) => n.endsWith('.html'))) {
  if (path.endsWith('scenarios.html')) continue;
  const qa = readFileSync(path, 'utf8').match(/<dl class="qa">([\s\S]*?)<\/dl>/);
  for (const m of qa ? qa[1].matchAll(/<dt>([\s\S]*?)<\/dt>/g) : []) {
    if (!scenarios.includes(`>${m[1].trim()}</a>`)) missingScenarios.push(`${relative(docsDir, path)}: ${m[1].trim()}`);
  }
}

// And the other way: every question the index lists is still asked, in those words, on the page it links.
for (const m of scenarios.matchAll(/<li><a routerLink="\/docs\/([a-z-]+)" fragment="what-happens-when">([\s\S]*?)<\/a><\/li>/g)) {
  let page = '';
  try {
    page = readFileSync(join(docsDir, m[1], `${m[1]}.html`), 'utf8');
  } catch {
    // A link to a page that doesn't exist is reported below like a reworded question.
  }
  const question = m[2].trim();
  if (!page.includes(`<dt>${question}</dt>`)) missingScenarios.push(`scenarios.html: "${question}" is not asked on /docs/${m[1]}`);
}

const lines = [];
if (missingKinds.length) {
  lines.push(markdown ? '### Node kinds without a node page' : 'Node kinds without a node page (data/nodes.ts):');
  for (const k of missingKinds) lines.push(markdown ? `- \`${k}\`` : `  ${k}`);
}
if (missingCodes.length) {
  lines.push(markdown ? '### Error codes not in the docs' : 'Error codes users can meet that no docs page mentions:');
  for (const [code, path] of missingCodes) lines.push(markdown ? `- \`${code}\` (${path})` : `  ${code}  (${path})`);
}
if (missingScenarios.length) {
  lines.push(markdown ? '### Scenarios the index and the pages disagree on' : 'Scenarios the index and the pages disagree on (scenarios/scenarios.html):');
  for (const q of missingScenarios) lines.push(markdown ? `- ${q}` : `  ${q}`);
}
if (goneCodes.length) {
  lines.push(markdown ? '### Codes in the error reference the backend no longer has' : 'Codes in the error reference (data/errors.ts) the backend no longer has:');
  for (const code of goneCodes) lines.push(markdown ? `- \`${code}\`` : `  ${code}`);
}
if (staleIgnores.length) {
  lines.push(markdown ? '### Ignored codes or node kinds the backend no longer has' : 'Ignored codes or node kinds the backend no longer has:');
  for (const code of staleIgnores) lines.push(markdown ? `- \`${code}\`` : `  ${code}`);
}

if (lines.length === 0) {
  console.log(`Docs cover all ${nodeKinds.length} node kinds and ${apiCodes.size} error codes.`);
  process.exit(0);
}
console.log(lines.join('\n'));
if (!markdown) {
  console.log(
    '\nDocument each one (data/errors.ts, data/nodes.ts or the page about it), or add it to' +
      ' scripts/docs-coverage-ignore.json with the reason it is not for product docs. List a new scenario in scenarios/scenarios.html.',
  );
}
process.exit(1);
