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
});
