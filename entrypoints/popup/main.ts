import type { RecorderState, RuntimeMessage, TraceSession } from '../../src/lib/types';

const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
const idle = $('#idle');
const recording = $('#recording');
const complete = $('#complete');
const status = $('#status');
const mode = $('#mode');
const elapsed = $('#elapsed');
let session: TraceSession | null = null;
let clock: number | undefined;

async function send(message: RuntimeMessage): Promise<RecorderState> {
  const response = await chrome.runtime.sendMessage(message) as RecorderState;
  if (response.error) throw new Error(response.error);
  return response;
}

function setBusy(button: HTMLButtonElement, busy: boolean, label?: string) {
  button.disabled = busy;
  button.setAttribute('aria-busy', String(busy));
  if (label) button.textContent = label;
}

function render(next: TraceSession | null) {
  session = next;
  const active = next?.status === 'recording';
  idle.hidden = Boolean(next);
  recording.hidden = !active;
  complete.hidden = !next || active;
  mode.textContent = active ? 'REC' : next ? 'READY TO EXPORT' : 'READY';
  if (next) {
    $('#event-count').textContent = String(next.events.filter(event => event.kind !== 'start' && event.kind !== 'stop').length);
    $('#shot-state').textContent = next.screenshotsEnabled ? 'On' : 'Off';
    $('#summary').textContent = `${next.events.length} timeline steps from ${next.title}.`;
  }
  if (clock) window.clearInterval(clock);
  if (active && next) {
    const update = () => {
      const seconds = Math.max(0, Math.floor((Date.now() - new Date(next.startedAt).getTime()) / 1000));
      elapsed.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    };
    update();
    clock = window.setInterval(update, 1000);
  }
}

async function act(button: HTMLButtonElement, message: RuntimeMessage, busyLabel: string) {
  const original = button.textContent ?? '';
  setBusy(button, true, busyLabel);
  status.textContent = '';
  try {
    const result = await send(message);
    render(result.session);
    status.textContent = message.type === 'EXPORT_SESSION' ? 'Saved. Share the HTML trace file with your reviewer.' : '';
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : 'The action could not be completed. Try again.';
  } finally {
    setBusy(button, false, original);
  }
}

$('#start').addEventListener('click', () => void act($('#start') as HTMLButtonElement, { type: 'START_SESSION', screenshotsEnabled: ($('#screenshots') as HTMLInputElement).checked }, 'Starting…'));
$('#stop').addEventListener('click', () => void act($('#stop') as HTMLButtonElement, { type: 'STOP_SESSION' }, 'Stopping…'));
$('#export').addEventListener('click', () => void act($('#export') as HTMLButtonElement, { type: 'EXPORT_SESSION' }, 'Preparing trace file…'));
$('#clear').addEventListener('click', () => {
  if (!session || confirm(`Clear the trace for “${session.title}”? This cannot be undone.`)) void act($('#clear') as HTMLButtonElement, { type: 'CLEAR_SESSION' }, 'Clearing…');
});

void send({ type: 'GET_STATE' }).then(result => render(result.session)).catch(error => { status.textContent = error instanceof Error ? error.message : 'Could not read local trace state.'; });
