const SAFE_KEYS = new Set([
  'Tab', 'Enter', 'Escape', ' ', 'Spacebar', 'Backspace', 'Delete', 'Home', 'End',
  'PageUp', 'PageDown', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Shift',
  'Control', 'Alt', 'Meta', 'CapsLock', 'Insert', 'F1', 'F2', 'F3', 'F4', 'F5',
  'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
]);

export function isSensitiveElement(element: Element | null): boolean {
  if (!(element instanceof HTMLElement)) return false;
  if (element.matches('input[type="password"], [data-private], [aria-label*="password" i]')) return true;
  const autocomplete = element.getAttribute('autocomplete')?.toLowerCase() ?? '';
  return ['cc-number', 'cc-csc', 'current-password', 'new-password', 'one-time-code'].some(value => autocomplete.includes(value));
}

export function safeKeyLabel(event: Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey'>, sensitive = false): string {
  const key = event.key === ' ' || event.key === 'Spacebar' ? 'Space' : event.key;
  const safe = SAFE_KEYS.has(event.key) || event.key.startsWith('Arrow') ? key : 'Character';
  if (sensitive && safe === 'Character') return 'Masked character';
  const modifiers = [event.ctrlKey && 'Ctrl', event.altKey && 'Alt', event.metaKey && 'Meta'].filter(Boolean);
  return modifiers.length && !['Control', 'Alt', 'Meta'].includes(key)
    ? `${modifiers.join('+')}+${safe}`
    : safe;
}

export function cleanText(value: string | null | undefined, limit = 80): string {
  return (value ?? '').replace(/\s+/g, ' ').trim().slice(0, limit);
}
