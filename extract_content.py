"""
extract_content.py
Parses all WBSKT HTML documentation files and emits a structured CSV.

Columns:
  file         — source filename
  page_id      — data-page attribute from <body>
  record_type  — metadata | property | port | callout | concept
  section      — nearest <h2> ancestor text
  sub_section  — nearest <h3> / node-card name
  name         — property name, port name, badge label, or concept title
  type         — data type (property rows only, else blank)
  default      — default value (property rows only, else blank)
  description  — main text content
"""

import csv
import glob
import os
import re
from html.parser import HTMLParser


# ── helpers ────────────────────────────────────────────────────────────────────

def clean(text: str) -> str:
    """Collapse whitespace and strip leading/trailing space."""
    return re.sub(r'\s+', ' ', text).strip()


# ── tiny DOM builder ──────────────────────────────────────────────────────────

class Element:
    def __init__(self, tag, attrs, parent=None):
        self.tag = tag
        self.attrs = dict(attrs)
        self.children = []
        self.parent = parent

    def get_class(self):
        return self.attrs.get('class', '')

    def text(self):
        """Recursively gather all text."""
        parts = []
        for c in self.children:
            if isinstance(c, str):
                parts.append(c)
            else:
                parts.append(c.text())
        return ''.join(parts)

    def find_all(self, tag=None, cls=None):
        results = []
        for c in self.children:
            if not isinstance(c, Element):
                continue
            tag_ok = (tag is None or c.tag == tag)
            cls_ok = (cls is None or cls in c.get_class().split())
            if tag_ok and cls_ok:
                results.append(c)
            results.extend(c.find_all(tag=tag, cls=cls))
        return results

    def find(self, tag=None, cls=None):
        hits = self.find_all(tag=tag, cls=cls)
        return hits[0] if hits else None


class DOMBuilder(HTMLParser):
    VOID = {'area','base','br','col','embed','hr','img','input',
            'link','meta','param','source','track','wbr'}

    def __init__(self):
        super().__init__()
        self.root = Element('root', [])
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        el = Element(tag, attrs, parent=self.stack[-1])
        self.stack[-1].children.append(el)
        if tag not in self.VOID:
            self.stack.append(el)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                self.stack = self.stack[:i]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def parse_html(path: str) -> Element:
    with open(path, encoding='utf-8') as f:
        src = f.read()
    builder = DOMBuilder()
    builder.feed(src)
    return builder.root


# ── extraction logic ──────────────────────────────────────────────────────────

def get_page_id(root: Element) -> str:
    bodies = root.find_all('body')
    if bodies:
        return bodies[0].attrs.get('data-page', '')
    return ''


def extract_records(filepath: str) -> list[dict]:
    filename = os.path.basename(filepath)
    root = parse_html(filepath)
    page_id = get_page_id(root)
    records = []

    def row(record_type, section, sub_section, name, typ='', default='', description=''):
        records.append({
            'file': filename,
            'page_id': page_id,
            'record_type': record_type,
            'section': section,
            'sub_section': sub_section,
            'name': name,
            'type': typ,
            'default': default,
            'description': description,
        })

    main = root.find('main')
    if main is None:
        return records

    # ── page metadata (header block) ──────────────────────────────────────────
    header = main.find(cls='header')
    if header:
        h1 = header.find('h1')
        tagline = header.find('p')
        if h1:
            row('metadata', '', '', 'title', description=clean(h1.text()))
        if tagline:
            row('metadata', '', '', 'tagline', description=clean(tagline.text()))
        for badge in header.find_all(cls='badge'):
            badge_text = clean(badge.text())
            if badge_text:
                row('metadata', '', '', 'badge', description=badge_text)

    # ── walk top-level children tracking h2 / h3 context ─────────────────────
    current_h2 = ''
    current_h3 = ''

    def process_node(el: Element):
        nonlocal current_h2, current_h3

        if not isinstance(el, Element):
            return

        if el.tag == 'h2':
            current_h2 = clean(el.text())
            current_h3 = ''
            return

        if el.tag == 'h3':
            current_h3 = clean(el.text())
            return

        # section intro paragraph
        if el.tag == 'p' and 'section-intro' in el.get_class():
            row('section_intro', current_h2, current_h3, '', description=clean(el.text()))
            return

        # callout boxes
        if 'callout' in el.get_class():
            strong = el.find('strong')
            title = clean(strong.text()) if strong else ''
            # get text minus the strong tag
            full = clean(el.text())
            if title and full.startswith(title):
                body = full[len(title):].strip()
            else:
                body = full
            callout_type = 'info' if 'callout-info' in el.get_class() else \
                           'warn' if 'callout-warn' in el.get_class() else 'callout'
            row('callout', current_h2, current_h3, title,
                typ=callout_type, description=body)
            return

        # node card — extract h3 inside, prop-table rows, port rows
        if 'node-card' in el.get_class():
            card_name_el = el.find(cls='node-name')
            card_name = clean(card_name_el.text()) if card_name_el else ''
            desc_el = el.find(cls='node-desc')
            if desc_el:
                row('concept', current_h2, card_name, card_name,
                    description=clean(desc_el.text()))
            # process h3s and tables inside the card
            inner_h3 = ''
            for child in el.find_all():
                if child.tag == 'h3':
                    inner_h3 = clean(child.text())
                elif child.tag == 'table' and 'prop-table' in child.get_class():
                    extract_prop_table(child, current_h2, card_name or inner_h3, row)
            return

        # port diagram
        if 'port-diagram' in el.get_class():
            for pin in el.find_all(cls='port-pin'):
                dot = pin.find(cls='port-pin-dot')
                port_type = ''
                if dot:
                    cls_str = dot.get_class()
                    if 'pin-signal' in cls_str:
                        port_type = 'signal'
                    elif 'pin-control' in cls_str:
                        port_type = 'control'
                    elif 'pin-error' in cls_str:
                        port_type = 'error'
                is_output = 'output' in pin.get_class()
                port_name = clean(pin.text())
                direction = 'output' if is_output else 'input'
                row('port', current_h2, 'Port Overview', port_name,
                    typ=port_type, default=direction)
            return

        # port-grid (port detail section)
        if 'port-grid' in el.get_class():
            for port_row in el.find_all(cls='port-row'):
                name_el = port_row.find(cls='port-name')
                desc_el = port_row.find(cls='port-desc')
                payload_el = port_row.find(cls='port-payload')
                if not name_el:
                    continue
                # port name is before the pill
                pill = name_el.find(cls='port-pill')
                port_type = clean(pill.text()) if pill else ''
                # strip pill text from name
                full_name = clean(name_el.text())
                if port_type and full_name.endswith(port_type):
                    port_name = full_name[: -len(port_type)].strip()
                else:
                    port_name = full_name
                desc = clean(desc_el.text()) if desc_el else ''
                payload = clean(payload_el.text()) if payload_el else ''
                if payload:
                    desc = desc + ' | payload: ' + payload
                row('port', current_h2, 'Port Detail', port_name,
                    typ=port_type, description=desc)
            return

        # recurse into generic containers
        for child in el.children:
            if isinstance(child, Element):
                process_node(child)

    def extract_prop_table(table: Element, section: str, sub_section: str, row_fn):
        for tr in table.find_all('tr'):
            cells = tr.find_all('td')
            if not cells:
                continue
            name_el = cells[0] if len(cells) > 0 else None
            type_el = cells[1] if len(cells) > 1 else None
            default_el = cells[2] if len(cells) > 2 else None
            desc_el = cells[3] if len(cells) > 3 else None
            name = clean(name_el.text()) if name_el else ''
            typ = clean(type_el.text()) if type_el else ''
            default = clean(default_el.text()) if default_el else ''
            desc = clean(desc_el.text()) if desc_el else ''
            if name:
                row_fn('property', section, sub_section, name, typ, default, desc)

    for child in main.children:
        if isinstance(child, Element):
            process_node(child)

    return records


# ── main ──────────────────────────────────────────────────────────────────────

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    html_files = sorted(glob.glob(os.path.join(script_dir, '*.html')))

    # Skip purely navigational pages with no doc content
    skip = {'index.html', 'reference.html'}
    html_files = [f for f in html_files if os.path.basename(f) not in skip]

    all_records = []
    for path in html_files:
        recs = extract_records(path)
        all_records.extend(recs)
        print(f"  {os.path.basename(path):40s}  {len(recs)} records")

    columns = ['file', 'page_id', 'record_type', 'section', 'sub_section',
               'name', 'type', 'default', 'description']

    out_path = os.path.join(script_dir, 'wbskt_content.csv')
    with open(out_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=columns)
        writer.writeheader()
        writer.writerows(all_records)

    print(f"\nWrote {len(all_records)} records → wbskt_content.csv")


if __name__ == '__main__':
    main()
