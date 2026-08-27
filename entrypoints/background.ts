import { buildViewerHtml, fileNameFor } from '../src/lib/export';
import type { RuntimeMessage, TraceEvent, TraceSession } from '../src/lib/types';

const STORAGE_KEY = 'traceSession';
let writeQueue = Promise.resolve();
let lastScreenshotAt = 0;

async function getSession(): Promise<TraceSession | null> {
  const result = await chrome.storage.local.get(STORAGE_KEY);
  return (result[STORAGE_KEY] as TraceSession | undefined) ?? null;
}

function saveSession(session: TraceSession | null): Promise<void> {
  writeQueue = writeQueue.then(async () => {
    if (session) await chrome.storage.local.set({ [STORAGE_KEY]: session });
    else await chrome.storage.local.remove(STORAGE_KEY);
  });
  return writeQueue;
}

async function setBadge(recording: boolean) {
  await chrome.action.setBadgeText({ text: recording ? 'REC' : '' });
  await chrome.action.setBadgeBackgroundColor({ color: recording ? '#3E631D' : '#5A5F55' });
  await chrome.action.setTitle({ title: recording ? 'A11y Interaction Trace — recording' : 'A11y Interaction Trace' });
}

async function appendEvent(message: Extract<RuntimeMessage, { type: 'TRACE_EVENT' }>, sender: chrome.runtime.MessageSender) {
  const session = await getSession();
  if (!session || session.status !== 'recording' || sender.tab?.id !== session.tabId) return { ok: false };
  const event: TraceEvent = { ...message.event, id: crypto.randomUUID(), at: Math.max(0, message.elapsed) };
  if (session.screenshotsEnabled && message.requestScreenshot && Date.now() - lastScreenshotAt > 650) {
    lastScreenshotAt = Date.now();
    try {
      event.screenshot = await chrome.tabs.captureVisibleTab(session.windowId, { format: 'jpeg', quality: 62 });
    } catch (error) {
      event.screenshotError = error instanceof Error ? error.message : 'Browser permission did not allow capture.';
    }
  }
  session.events.push(event);
  await saveSession(session);
  return { ok: true };
}

async function stopSession() {
  const session = await getSession();
  if (!session || session.status !== 'recording') return session;
  session.status = 'stopped';
  session.endedAt = new Date().toISOString();
  session.events.push({ id: crypto.randomUUID(), at: Date.now() - new Date(session.startedAt).getTime(), kind: 'stop', action: 'Recording stopped' });
  await saveSession(session);
  await setBadge(false);
  await chrome.tabs.sendMessage(session.tabId, { type: 'TRACE_STOP' }).catch(() => undefined);
  return session;
}

function toDataUrl(html: string): string {
  const bytes = new TextEncoder().encode(html);
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  return `data:text/html;base64,${btoa(binary)}`;
}

export default defineBackground(() => {
  void getSession().then(session => setBadge(session?.status === 'recording'));

  chrome.runtime.onMessage.addListener((message: RuntimeMessage, sender, sendResponse) => {
    void (async () => {
      if (message.type === 'GET_STATE') return { session: await getSession() };
      if (message.type === 'CONTENT_READY') {
        const session = await getSession();
        return { recording: session?.status === 'recording' && sender.tab?.id === session.tabId, startedAt: session?.startedAt };
      }
      if (message.type === 'START_SESSION') {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab?.id || !tab.windowId || !tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('edge://')) throw new Error('Open a regular web page, then start recording again.');
        const existing = await getSession();
        if (existing?.status === 'recording') await stopSession();
        const startedAt = new Date().toISOString();
        const session: TraceSession = {
          schema: 1, id: crypto.randomUUID(), status: 'recording', startedAt,
          tabId: tab.id, windowId: tab.windowId, url: tab.url, title: tab.title || tab.url,
          viewport: { width: 0, height: 0, devicePixelRatio: 1 }, userAgent: '',
          screenshotsEnabled: message.screenshotsEnabled,
          events: [{ id: crypto.randomUUID(), at: 0, kind: 'start', action: 'Recording started' }]
        };
        await saveSession(session);
        await setBadge(true);
        await chrome.tabs.sendMessage(tab.id, { type: 'TRACE_START', startedAt }).catch(() => { throw new Error('This page cannot be recorded. Reload it after installing the extension, then try again.'); });
        return { session };
      }
      if (message.type === 'TRACE_EVENT') return appendEvent(message, sender);
      if (message.type === 'CONTENT_META') {
        const session = await getSession();
        if (session?.status === 'recording' && sender.tab?.id === session.tabId) {
          Object.assign(session, { url: message.url, title: message.title, viewport: message.viewport, userAgent: message.userAgent });
          await saveSession(session);
        }
        return { ok: true };
      }
      if (message.type === 'STOP_SESSION' || message.type === 'CONTENT_STOP') return { session: await stopSession() };
      if (message.type === 'CLEAR_SESSION') { await stopSession(); await saveSession(null); return { session: null }; }
      if (message.type === 'EXPORT_SESSION') {
        const session = await stopSession();
        if (!session) throw new Error('Record at least one interaction before exporting.');
        await chrome.downloads.download({ url: toDataUrl(buildViewerHtml(session)), filename: fileNameFor(session), saveAs: true });
        return { session };
      }
      return { ok: false };
    })().then(sendResponse).catch(error => sendResponse({ error: error instanceof Error ? error.message : 'Something went wrong.' }));
    return true;
  });
});
