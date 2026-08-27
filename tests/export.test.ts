import { describe, expect, it } from 'vitest';
import { buildViewerHtml, fileNameFor, safeJson } from '../src/lib/export';
import type { TraceSession } from '../src/lib/types';

const session: TraceSession = {
  schema: 1, id: 'session', status: 'stopped', startedAt: '2026-08-27T12:00:00.000Z', endedAt: '2026-08-27T12:00:03.000Z',
  tabId: 1, windowId: 1, url: 'https://example.com/dialog', title: 'Dialog <test>', viewport: { width: 1280, height: 720, devicePixelRatio: 1 },
  userAgent: 'test', screenshotsEnabled: false,
  events: [{ id: 'event', at: 1200, kind: 'keyboard', action: 'Tab', focus: { tag: 'button', role: 'button', name: 'Save', selector: '#save', states: [], focused: true } }]
};

describe('offline trace export', () => {
  it('generates a self-contained semantic document', () => {
    const html = buildViewerHtml(session);
    expect(html).toContain('<!doctype html>');
    expect(html).toContain('<main id="main">');
    expect(html).toContain('application/json');
    expect(html).not.toContain('https://cdn');
    expect(html).not.toContain('<test>');
  });

  it('neutralizes markup in embedded JSON', () => {
    expect(safeJson({ value: '</script><script>alert(1)</script>' })).not.toContain('</script>');
  });

  it('creates a stable attachment name', () => {
    expect(fileNameFor(session)).toBe('a11y-trace-example.com-2026-08-27.html');
  });
});
