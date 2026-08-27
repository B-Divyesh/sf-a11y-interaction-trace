import { captureSnapshot, nodeSummary } from '../src/lib/snapshot';
import { isSensitiveElement, safeKeyLabel } from '../src/lib/privacy';
import type { RuntimeMessage, TraceEvent } from '../src/lib/types';

export default defineUnlistedScript(() => {
    let recording = false;
    let started = 0;
    type PendingKey = { timer: number; event: Omit<TraceEvent, 'id' | 'at'> };
    const pendingKeys: PendingKey[] = [];
    let dock: HTMLElement | null = null;
    let clock: number | undefined;

    function message(payload: RuntimeMessage): Promise<unknown> {
      return chrome.runtime.sendMessage(payload).catch(() => undefined);
    }

    function meta(): RuntimeMessage {
      return {
        type: 'CONTENT_META', url: location.href, title: document.title,
        viewport: { width: innerWidth, height: innerHeight, devicePixelRatio },
        userAgent: navigator.userAgent
      };
    }

    function emit(event: Omit<TraceEvent, 'id' | 'at'>, requestScreenshot = false) {
      if (!recording) return;
      void message({ type: 'TRACE_EVENT', event, elapsed: Date.now() - started, requestScreenshot });
    }

    function showDock() {
      dock?.remove();
      dock = document.createElement('aside');
      dock.id = '__a11y_trace_recorder__';
      dock.setAttribute('role', 'status');
      dock.setAttribute('aria-label', 'A11y Interaction Trace recording');
      dock.innerHTML = '<span class="trace-rec-dot" aria-hidden="true"></span><strong>TRACE REC</strong><time>00:00</time><button type="button">Stop</button>';
      const style = document.createElement('style');
      style.textContent = `#__a11y_trace_recorder__{all:initial;box-sizing:border-box;position:fixed;z-index:2147483647;right:16px;bottom:16px;display:flex;align-items:center;gap:10px;padding:8px 8px 8px 12px;background:#1b1e1a;color:#f2f0e8;border:2px solid #cbef45;box-shadow:4px 4px 0 #222520;font:700 12px/1.2 ui-monospace,monospace;letter-spacing:.04em}#__a11y_trace_recorder__ *{box-sizing:border-box}#__a11y_trace_recorder__ .trace-rec-dot{width:9px;height:9px;background:#cbef45;border-radius:50%}#__a11y_trace_recorder__ time{color:#cbef45;font-variant-numeric:tabular-nums}#__a11y_trace_recorder__ button{all:initial;min-width:44px;min-height:44px;padding:0 12px;background:#f2f0e8;color:#1b1e1a;font:700 13px/44px system-ui,sans-serif;text-align:center;cursor:pointer}#__a11y_trace_recorder__ button:focus-visible{outline:3px solid #cbef45;outline-offset:3px}@media(max-width:500px){#__a11y_trace_recorder__{left:8px;right:8px;bottom:max(8px,env(safe-area-inset-bottom));justify-content:space-between}}`;
      dock.append(style);
      dock.querySelector('button')?.addEventListener('click', () => void message({ type: 'CONTENT_STOP' }));
      document.documentElement.append(dock);
      clock = window.setInterval(() => {
        const seconds = Math.floor((Date.now() - started) / 1000);
        const time = dock?.querySelector('time');
        if (time) time.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
      }, 1000);
    }

    function start(sessionStartedAt?: string) {
      if (recording) return;
      recording = true;
      started = sessionStartedAt ? new Date(sessionStartedAt).getTime() : Date.now();
      showDock();
      void message(meta());
    }

    function stop() {
      recording = false;
      for (const pending of pendingKeys) window.clearTimeout(pending.timer);
      pendingKeys.length = 0;
      if (clock) window.clearInterval(clock);
      dock?.remove();
      dock = null;
    }

    function maskSensitiveFields() {
      document.getElementById('__a11y_trace_masks__')?.remove();
      const layer = document.createElement('div');
      layer.id = '__a11y_trace_masks__';
      layer.setAttribute('aria-hidden', 'true');
      for (const element of document.querySelectorAll('input[type="password"], [data-private], input[autocomplete*="cc-"], input[autocomplete*="password"], input[autocomplete="one-time-code"]')) {
        const rect = element.getBoundingClientRect();
        if (!rect.width || !rect.height) continue;
        const mask = document.createElement('span');
        Object.assign(mask.style, { position: 'fixed', zIndex: '2147483646', left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, background: '#1b1e1a', color: '#f2f0e8', border: '2px solid #cbef45', font: '700 12px/1 system-ui', display: 'grid', placeItems: 'center' });
        mask.textContent = 'MASKED';
        layer.append(mask);
      }
      document.documentElement.append(layer);
    }

    document.addEventListener('keydown', event => {
      if (!recording || event.target instanceof Element && event.target.closest('#__a11y_trace_recorder__')) return;
      if (['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) return;
      const label = safeKeyLabel(event, isSensitiveElement(event.target as Element));
      const modifiers = [event.shiftKey && 'Shift', event.ctrlKey && 'Ctrl', event.altKey && 'Alt', event.metaKey && 'Meta'].filter(Boolean) as string[];
      const pending = { timer: 0, event: { kind: 'keyboard', action: label, modifiers } } satisfies PendingKey;
      pending.timer = window.setTimeout(() => {
        const index = pendingKeys.indexOf(pending);
        if (index >= 0) pendingKeys.splice(index, 1);
        const focus = nodeSummary(document.activeElement);
        emit({ ...pending.event, focus, snapshot: captureSnapshot() }, true);
      }, 0);
      pendingKeys.push(pending);
    }, true);

    document.addEventListener('focusin', event => {
      if (!recording || event.target instanceof Element && event.target.closest('#__a11y_trace_recorder__')) return;
      const pending = pendingKeys.shift();
      if (pending) {
        window.clearTimeout(pending.timer);
        const focus = nodeSummary(event.target as Element);
        emit({ ...pending.event, focus, snapshot: captureSnapshot(event.target as Element) }, true);
        return;
      }
      const focus = nodeSummary(event.target as Element);
      emit({ kind: 'focus', action: 'Focus changed', focus, snapshot: captureSnapshot(event.target as Element) }, true);
    }, true);

    chrome.runtime.onMessage.addListener((request: { type: string; startedAt?: string }, _sender, sendResponse) => {
      if (request.type === 'TRACE_START') { start(request.startedAt); sendResponse({ ok: true }); }
      if (request.type === 'TRACE_STOP') { stop(); sendResponse({ ok: true }); }
      if (request.type === 'TRACE_MASK_SENSITIVE') { maskSensitiveFields(); sendResponse({ ok: true }); }
      if (request.type === 'TRACE_UNMASK_SENSITIVE') { document.getElementById('__a11y_trace_masks__')?.remove(); sendResponse({ ok: true }); }
      return false;
    });

    void message({ type: 'CONTENT_READY' }).then(response => {
      const state = response as { recording?: boolean; startedAt?: string } | undefined;
      if (state?.recording) start(state.startedAt);
    });
});
