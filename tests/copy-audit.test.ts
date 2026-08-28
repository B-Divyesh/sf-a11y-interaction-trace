import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const countWords = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;

describe('copy audit', () => {
  it('records the verified word counts for the review-2 corrections', () => {
    const audit = readFileSync('.factory/copy-audit.md', 'utf8');
    const sentences = [
      'For web developers and accessibility testers who need reproducible keyboard evidence without uploading a recording.',
      'Nearby control snapshots are selected DOM details, not an operating-system accessibility tree.'
    ];
    for (const sentence of sentences) {
      expect(audit).toContain(`| ${sentence} | ${countWords(sentence)} |`);
    }
  });

  it('records the tested demo promises and keeps the catalog description brief and verb-first', () => {
    const audit = readFileSync('.factory/copy-audit.md', 'utf8');
    const promises = [
      'It shows a checkout dialog and four ordered events without an install.',
      'Reset demo restores the original four-event sample.'
    ];
    for (const sentence of promises) expect(audit).toContain(`| ${sentence} | ${countWords(sentence)} |`);
    const catalog = readFileSync('.factory/catalog-description.txt', 'utf8').trim();
    expect(catalog.length).toBeLessThanOrEqual(120);
    expect(catalog).toMatch(/^(Record|Export|Trace|Capture)\b/);
  });
});
