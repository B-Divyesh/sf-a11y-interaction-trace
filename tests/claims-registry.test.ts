import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

type Claim = { id: string; claim: string; where: string; test: string; sandbox: string };
const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as Claim[];
const claimSources = [readFileSync('tests/e2e/claims.spec.ts', 'utf8'), readFileSync('tests/e2e/site.spec.ts', 'utf8')].join('\n');

describe('claims registry', () => {
  it('has unique complete entries with one matching tagged browser test each', () => {
    expect(claims.length).toBeGreaterThan(0);
    expect(new Set(claims.map(claim => claim.id)).size).toBe(claims.length);
    for (const claim of claims) {
      expect(claim.claim.trim()).not.toBe('');
      expect(claim.where.trim()).not.toBe('');
      expect(claim.sandbox.trim()).not.toBe('');
      expect(claim.test).toBe(`npm run test:claims -- --grep @claim:${claim.id}`);
      const count = claimSources.split(`@claim:${claim.id}`).length - 1;
      expect(count, claim.id).toBe(1);
    }
  });
});
