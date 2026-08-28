const SAFE_KEYS = new Set([
  'Tab', 'Enter', 'Escape', ' ', 'Spacebar', 'Backspace', 'Delete', 'Home', 'End',
  'PageUp', 'PageDown', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Shift',
  'Control', 'Alt', 'Meta', 'CapsLock', 'Insert', 'F1', 'F2', 'F3', 'F4', 'F5',
  'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'
]);

// This selector is the single definition of a field that must never be shown
// in a trace screenshot. Keep the metadata classifier and visual masking path
// together so a newly-recognised sensitive field cannot leak through capture.
export const SENSITIVE_ELEMENT_SELECTOR = [
  'input[type="password"]',
  '[data-private]',
  '[aria-label*="password" i]',
  'input[autocomplete*="cc-" i]',
  'input[autocomplete*="password" i]',
  'input[autocomplete="one-time-code" i]'
].join(', ');

export function isSensitiveElement(element: Element | null): boolean {
  if (!(element instanceof HTMLElement)) return false;
  return element.matches(SENSITIVE_ELEMENT_SELECTOR);
}

export function sensitiveElements(root: ParentNode = document): HTMLElement[] {
  return Array.from(root.querySelectorAll(SENSITIVE_ELEMENT_SELECTOR))
    .filter((element): element is HTMLElement => isSensitiveElement(element));
}

export function safeKeyLabel(event: Pick<KeyboardEvent, 'key' | 'shiftKey' | 'ctrlKey' | 'metaKey' | 'altKey'>, sensitive = false): string {
  const key = event.key === ' ' || event.key === 'Spacebar' ? 'Space' : event.key;
  const safe = SAFE_KEYS.has(event.key) || event.key.startsWith('Arrow') ? key : 'Character';
  if (sensitive && safe === 'Character') return 'Masked character';
  const modifiers = [event.shiftKey && 'Shift', event.ctrlKey && 'Ctrl', event.altKey && 'Alt', event.metaKey && 'Meta'].filter(Boolean);
  return modifiers.length && !['Shift', 'Control', 'Alt', 'Meta'].includes(key)
    ? `${modifiers.join('+')}+${safe}`
    : safe;
}

export function cleanText(value: string | null | undefined, limit = 80): string {
  return (value ?? '').replace(/\s+/g, ' ').trim().slice(0, limit);
}
