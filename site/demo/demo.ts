import { buildViewerHtml } from '../../src/lib/export';
import type { TraceSession } from '../../src/lib/types';
import '../main';

const DEMO_PREFIX = 'demo:a11y-interaction-trace:';
const DEMO_KEY = `${DEMO_PREFIX}state`;
const status = document.querySelector<HTMLElement>('#demo-status')!;

function sampleSession(): TraceSession {
  return JSON.parse(document.querySelector<HTMLScriptElement>('#demo-seed')!.textContent!) as TraceSession;
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
