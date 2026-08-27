import type { TraceNode, TraceSnapshot } from './types';
import { cleanText, isSensitiveElement } from './privacy';

const IMPLICIT_ROLES: Record<string, string> = {
  A: 'link', BUTTON: 'button', DETAILS: 'group', DIALOG: 'dialog', FORM: 'form',
  IMG: 'img', MAIN: 'main', NAV: 'navigation', SELECT: 'combobox', TEXTAREA: 'textbox'
};

function implicitRole(element: Element): string {
  if (element instanceof HTMLInputElement) {
    const type = element.type;
    if (type === 'checkbox') return 'checkbox';
    if (type === 'radio') return 'radio';
    if (type === 'range') return 'slider';
    if (['button', 'submit', 'reset'].includes(type)) return 'button';
    return 'textbox';
  }
  return IMPLICIT_ROLES[element.tagName] ?? (element.matches('h1,h2,h3,h4,h5,h6') ? 'heading' : 'generic');
}

function labelText(element: Element): string {
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const text = labelledBy.split(/\s+/).map(id => document.getElementById(id)?.textContent ?? '').join(' ');
    if (cleanText(text)) return cleanText(text);
  }
  const aria = element.getAttribute('aria-label');
  if (aria) return cleanText(aria);
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement) {
    if (element.labels?.length) return cleanText(Array.from(element.labels).map(label => label.textContent).join(' '));
    if (element instanceof HTMLInputElement && ['button', 'submit', 'reset'].includes(element.type)) return cleanText(element.value);
  }
  if (element instanceof HTMLImageElement) return cleanText(element.alt);
  if (element.matches('input, textarea, [contenteditable], [role="textbox"], [role="searchbox"], [role="combobox"]')) {
    return cleanText(element.getAttribute('title') || element.getAttribute('placeholder'));
  }
  return cleanText(element.textContent || element.getAttribute('title') || element.getAttribute('placeholder'));
}

function selectorFor(element: Element): string {
  if (element.id) return `#${CSS.escape(element.id)}`;
  const testId = element.getAttribute('data-testid');
  if (testId) return `[data-testid="${CSS.escape(testId)}"]`;
  const name = element.getAttribute('name');
  if (name) return `${element.tagName.toLowerCase()}[name="${CSS.escape(name)}"]`;
  const parent = element.parentElement;
  if (!parent) return element.tagName.toLowerCase();
  const siblings = Array.from(parent.children).filter(child => child.tagName === element.tagName);
  const suffix = siblings.length > 1 ? `:nth-of-type(${siblings.indexOf(element) + 1})` : '';
  return `${selectorFor(parent)} > ${element.tagName.toLowerCase()}${suffix}`.slice(-160);
}

function statesFor(element: Element): string[] {
  const states: string[] = [];
  const pairs = [
    ['aria-expanded', 'expanded'], ['aria-pressed', 'pressed'], ['aria-selected', 'selected'],
    ['aria-checked', 'checked'], ['aria-invalid', 'invalid'], ['aria-current', 'current']
  ] as const;
  for (const [attribute, label] of pairs) {
    const value = element.getAttribute(attribute);
    if (value !== null) states.push(`${label}:${value}`);
  }
  if ('disabled' in element && (element as HTMLButtonElement).disabled) states.push('disabled');
  if (element.getAttribute('aria-disabled') === 'true') states.push('disabled');
  if ('required' in element && (element as HTMLInputElement).required) states.push('required');
  if (isSensitiveElement(element)) states.push('sensitive:masked');
  return states;
}

export function nodeSummary(element: Element | null): TraceNode | undefined {
  if (!element || element.id === '__a11y_trace_recorder__' || element.closest('#__a11y_trace_recorder__')) return undefined;
  return {
    tag: element.tagName.toLowerCase(),
    role: element.getAttribute('role') || implicitRole(element),
    name: isSensitiveElement(element) ? '[sensitive field]' : labelText(element) || '(unnamed)',
    selector: selectorFor(element),
    states: statesFor(element),
    focused: element === document.activeElement
  };
}

export function captureSnapshot(focus: Element | null = document.activeElement): TraceSnapshot {
  const scope = focus?.closest('[role="dialog"], dialog, form, nav, main, section') ?? document.body;
  const candidates = Array.from(scope.querySelectorAll('button, a[href], input, select, textarea, [tabindex], [role]'))
    .filter(element => !element.closest('#__a11y_trace_recorder__') && element.getClientRects().length > 0 && element.getAttribute('aria-hidden') !== 'true');
  if (focus && !candidates.includes(focus)) candidates.unshift(focus);
  const focusIndex = candidates.indexOf(focus as Element);
  const start = Math.max(0, focusIndex < 0 ? 0 : focusIndex - 5);
  const selected = candidates.slice(start, start + 12);
  return {
    scope: nodeSummary(scope)?.selector ?? 'body',
    nodes: selected.map(nodeSummary).filter((node): node is TraceNode => Boolean(node))
  };
}
