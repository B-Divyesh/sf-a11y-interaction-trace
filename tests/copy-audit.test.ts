import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const countWords = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;

describe('copy audit', () => {
  it('records the verified word count for every numeric audit row', () => {
    const audit = readFileSync('.factory/copy-audit.md', 'utf8');
    const rows = [...audit.matchAll(/^\|\s*(.*?)\s*\|\s*(\d+)\s*\|\s*(.*?)\s*\|$/gm)];

    expect(rows).toHaveLength(34);
    for (const row of rows) {
      const copy = row[1] ?? '';
      const statedWords = row[2] ?? '';
      expect(Number(statedWords), `Incorrect word count for: ${copy}`).toBe(countWords(copy));
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
