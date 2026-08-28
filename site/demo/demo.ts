import { buildViewerHtml } from '../../src/lib/export';
import type { TraceSession } from '../../src/lib/types';
import '../main';

const DEMO_PREFIX = 'demo:a11y-interaction-trace:';
const DEMO_KEY = `${DEMO_PREFIX}state`;
const status = document.querySelector<HTMLElement>('#demo-status')!;

const focus = (role: string, name: string, selector: string, states: string[] = []) => ({ tag: role === 'link' ? 'a' : 'button', role, name, selector, states, focused: true });
const snapshot = (focused: ReturnType<typeof focus>) => ({ scope: 'nearby controls within the visible tested page', nodes: [focused] });

function sampleSession(): TraceSession {
  const project = focus('textbox', 'Project name', '#project-name', ['inside dialog', 'required:false']);
  const background = focus('link', 'Background help', '#background-help', ['outside dialog', 'focus escaped']);
  const opener = focus('button', 'Open quick edit', '#open-dialog', ['dialog closed']);
  return {
    schema: 1,
    id: 'demo-checkout-focus-escape',
    status: 'stopped',
    startedAt: '2026-08-28T12:00:00.000Z',
    endedAt: '2026-08-28T12:00:02.180Z',
    tabId: 0,
    windowId: 0,
    url: 'https://shop.example.test/settings/checkout',
    title: 'Checkout settings',
    viewport: { width: 1280, height: 720, devicePixelRatio: 1 },
    userAgent: 'A11y Interaction Trace sample',
    screenshotsEnabled: false,
    events: [
      { id: 'start', at: 0, kind: 'start', action: 'Recording started' },
      { id: 'enter', at: 240, kind: 'keyboard', action: 'Enter', focus: project, snapshot: snapshot(project) },
      { id: 'shift-tab', at: 1420, kind: 'keyboard', action: 'Shift+Tab', modifiers: ['Shift'], focus: background, snapshot: snapshot(background) },
      { id: 'escape', at: 2180, kind: 'keyboard', action: 'Escape', focus: opener, snapshot: snapshot(opener) }
    ]
  };
}

function seedDemo() {
  localStorage.setItem(DEMO_KEY, JSON.stringify({ schema: 1, replayCount: 0, trace: sampleSession() }));
}

function clearDemo() {
  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const key = localStorage.key(index);
    if (key?.startsWith(DEMO_PREFIX)) localStorage.removeItem(key);
  }
}

if (!localStorage.getItem(DEMO_KEY)) seedDemo();

document.querySelector<HTMLButtonElement>('#reset-demo')!.addEventListener('click', () => {
  clearDemo();
  seedDemo();
  document.querySelectorAll('.demo-events .is-replaying').forEach(element => element.classList.remove('is-replaying'));
  status.textContent = 'Demo reset to the original four events. Real data was not changed.';
});

document.querySelector<HTMLAnchorElement>('#start-real')!.addEventListener('click', () => clearDemo());

document.querySelector<HTMLButtonElement>('#replay-demo')!.addEventListener('click', async () => {
  const saved = JSON.parse(localStorage.getItem(DEMO_KEY) ?? '{}') as { replayCount?: number; trace?: TraceSession };
  localStorage.setItem(DEMO_KEY, JSON.stringify({ ...saved, replayCount: (saved.replayCount ?? 0) + 1 }));
  const steps = [...document.querySelectorAll<HTMLElement>('.demo-events .trace-step')];
  steps.forEach(step => step.classList.remove('is-replaying'));
  for (const step of steps) {
    step.classList.add('is-replaying');
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) await new Promise(resolve => setTimeout(resolve, 160));
  }
  status.textContent = 'Replay complete. Focus escaped on Shift + Tab and recovered on Escape.';
});

document.querySelector<HTMLButtonElement>('#export-demo')!.addEventListener('click', () => {
  const saved = JSON.parse(localStorage.getItem(DEMO_KEY) ?? '{}') as { trace?: TraceSession };
  const trace = saved.trace ?? sampleSession();
  const url = URL.createObjectURL(new Blob([buildViewerHtml(trace)], { type: 'text/html' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'a11y-trace-sample-checkout.html';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = 'Sample trace downloaded. Open the HTML file without a network connection.';
});
