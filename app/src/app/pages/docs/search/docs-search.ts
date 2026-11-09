import {
  Component,
  DOCUMENT,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { DOCS_PAGES } from '../docs-nav';
import { DOCS_SECTIONS } from '../docs-sections';
import { DOCS_ERROR_GROUPS } from '../data/errors';
import { DOCS_NODES } from '../data/nodes';
import { DocsIcon } from '../icon/docs-icon';
import { DocsSearchState } from './docs-search-state';

export type DocsHitKind = 'guide' | 'node' | 'error';

export interface DocsHit {
  kind: DocsHitKind;
  icon: string;
  title: string;
  sub: string;
  where: string;
  path: string;
  fragment?: string;
  haystack: string;
}

interface DocsHitGroup {
  kind: DocsHitKind;
  label: string;
  hits: DocsHit[];
}

const KIND_LABELS: Record<DocsHitKind, string> = {
  guide: 'Guides',
  node: 'Nodes',
  error: 'Error codes',
};

const GROUP_ICONS: Record<string, string> = {
  start: 'zap',
  clients: 'cpu',
  workflows: 'flow',
  nodes: 'branch',
  integrations: 'plug',
  comms: 'radio',
  account: 'users',
  reference: 'code',
  sdks: 'pkg',
  help: 'help',
};

function buildIndex(): DocsHit[] {
  const hits: DocsHit[] = [];
  for (const p of DOCS_PAGES) {
    // Node pages are listed once, as nodes, below.
    if (p.path.startsWith('/docs/nodes/')) {
      continue;
    }
    const icon = GROUP_ICONS[p.group.id] ?? 'list';
    hits.push({
      kind: 'guide',
      icon,
      title: p.label,
      sub: p.sub?.label ?? p.group.title,
      where: p.sub ? `${p.group.title} › ${p.sub.label}` : p.group.title,
      path: p.path,
      haystack: '',
    });
    for (const s of DOCS_SECTIONS[p.path] ?? []) {
      hits.push({
        kind: 'guide',
        icon,
        title: s.label,
        sub: p.label,
        where: `${p.group.title} › ${p.label}`,
        path: p.path,
        fragment: s.id,
        haystack: '',
      });
    }
  }
  for (const n of DOCS_NODES) {
    hits.push({
      kind: 'node',
      icon: n.icon,
      title: n.name,
      sub: n.desc,
      where: n.kind,
      path: `/docs/nodes/${n.slug}`,
      haystack: n.kind,
    });
  }
  for (const g of DOCS_ERROR_GROUPS) {
    for (const e of g.codes) {
      hits.push({
        kind: 'error',
        icon: 'alert',
        title: `${e.code} · ${e.status}`,
        sub: e.text.replace(/<[^>]+>/g, ''),
        where: g.title,
        path: '/docs/errors',
        fragment: e.code,
        haystack: e.code.replace(/_/g, ' '),
      });
    }
  }
  for (const h of hits) {
    h.haystack = `${h.title} ${h.sub} ${h.where} ${h.haystack}`.toLowerCase();
  }
  return hits;
}

// The ⌘K search over every page, section, node and error code.
@Component({
  selector: 'app-docs-search',
  imports: [DocsIcon],
  templateUrl: './docs-search.html',
  host: { '(document:keydown)': 'onKey($event)' },
})
export class DocsSearch {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  // Where focus was before the search opened, to give it back on close.
  private returnFocus: HTMLElement | null = null;
  protected readonly state = inject(DocsSearchState);
  private readonly input = viewChild<ElementRef<HTMLInputElement>>('q');
  private readonly list = viewChild<ElementRef<HTMLElement>>('list');
  private readonly index = buildIndex();

  protected readonly kinds: (DocsHitKind | 'all')[] = ['all', 'guide', 'node', 'error'];
  protected readonly kindLabels: Record<string, string> = { all: 'All', ...KIND_LABELS };
  protected readonly query = signal('');
  protected readonly kind = signal<DocsHitKind | 'all'>('all');
  protected readonly active = signal(0);

  protected readonly groups = computed<DocsHitGroup[]>(() => {
    const words = this.query().trim().toLowerCase().split(/\s+/).filter(Boolean);
    const kind = this.kind();
    let hits = this.index.filter((h) => kind === 'all' || h.kind === kind);
    if (words.length) {
      hits = hits.filter((h) => words.every((w) => h.haystack.includes(w)));
      // A match in the title beats one in the description.
      const q = words.join(' ');
      const rank = (h: DocsHit) => {
        const t = h.title.toLowerCase();
        return t.startsWith(q) ? 0 : t.includes(q) ? 1 : words.every((w) => t.includes(w)) ? 2 : 3;
      };
      hits = hits.map((h, i) => ({ h, i, r: rank(h) })).sort((x, y) => x.r - y.r || x.i - y.i).map((x) => x.h);
    } else {
      // Nothing typed yet: list the pages, or everything of the kind picked.
      hits = hits.filter((h) => h.kind !== 'guide' || !h.fragment);
      if (kind === 'all') {
        hits = hits.filter((h) => h.kind === 'guide');
      }
    }
    const groups: DocsHitGroup[] = [];
    for (const k of ['error', 'node', 'guide'] as DocsHitKind[]) {
      const inKind = hits.filter((h) => h.kind === k).slice(0, words.length ? 6 : 24);
      if (inKind.length) {
        groups.push({ kind: k, label: KIND_LABELS[k], hits: inKind });
      }
    }
    return groups;
  });

  protected readonly flat = computed(() => this.groups().flatMap((g) => g.hits));

  constructor() {
    effect(() => {
      const open = this.state.open();
      const body = this.document.body;
      if (open) {
        this.returnFocus = this.document.activeElement as HTMLElement | null;
        setTimeout(() => this.input()?.nativeElement.focus());
      } else {
        this.returnFocus?.focus?.();
        this.returnFocus = null;
      }
      if (body) {
        body.style.overflow = open ? 'hidden' : '';
      }
    });
  }

  protected setQuery(value: string): void {
    this.query.set(value);
    this.active.set(0);
  }

  protected setKind(kind: DocsHitKind | 'all'): void {
    this.kind.set(kind);
    this.active.set(0);
    this.input()?.nativeElement.focus();
  }

  // Splits a title around the first match of the query so the template can mark it.
  protected parts(title: string): [string, string, string] {
    const q = this.query().trim();
    const i = q ? title.toLowerCase().indexOf(q.toLowerCase()) : -1;
    return i < 0
      ? [title, '', '']
      : [title.slice(0, i), title.slice(i, i + q.length), title.slice(i + q.length)];
  }

  protected indexOf(hit: DocsHit): number {
    return this.flat().indexOf(hit);
  }

  protected go(hit: DocsHit): void {
    this.close();
    this.router.navigate([hit.path], { fragment: hit.fragment });
  }

  protected close(): void {
    this.state.hide();
    this.query.set('');
    this.kind.set('all');
    this.active.set(0);
  }

  protected onKey(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (this.state.open()) {
        this.close();
      } else {
        this.state.show();
      }
      return;
    }
    if (!this.state.open()) {
      return;
    }
    const count = this.flat().length;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    } else if (event.key === 'ArrowDown' && count) {
      event.preventDefault();
      this.move((this.active() + 1) % count);
    } else if (event.key === 'ArrowUp' && count) {
      event.preventDefault();
      this.move((this.active() - 1 + count) % count);
    } else if (event.key === 'Enter') {
      const hit = this.flat()[this.active()];
      if (hit) {
        event.preventDefault();
        this.go(hit);
      }
    }
  }

  private move(i: number): void {
    this.active.set(i);
    setTimeout(() =>
      this.list()
        ?.nativeElement.querySelector(`[data-i="${i}"]`)
        ?.scrollIntoView({ block: 'nearest' }),
    );
  }
}
