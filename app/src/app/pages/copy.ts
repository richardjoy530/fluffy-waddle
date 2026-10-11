// Click handling for the "Copy" buttons in the page templates (marked with data-copy).
export function handleCopyClick(event: MouseEvent): void {
  const button = (event.target as HTMLElement).closest<HTMLElement>('[data-copy]');
  if (!button) {
    return;
  }
  const box = button.closest('.code, .keybox');
  // Tabbed code boxes hold one <pre> per language; copy the one on show.
  const shown = Array.from(box?.querySelectorAll<HTMLElement>('pre, code') ?? []).find(el => el.getClientRects().length > 0);
  const text = shown?.textContent ?? '';
  if (!text || !navigator.clipboard) {
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    const label = button.lastChild;
    if (label?.nodeType !== Node.TEXT_NODE) {
      return;
    }
    const original = label.textContent;
    label.textContent = ' Copied';
    setTimeout(() => (label.textContent = original), 1500);
  });
}
