import { describe, expect, it } from 'vitest';
import { cleanText, safeKeyLabel } from '../src/lib/privacy';

const key = (value: string, extra = {}) => ({ key: value, ctrlKey: false, altKey: false, metaKey: false, ...extra }) as KeyboardEvent;

describe('keyboard privacy', () => {
  it('preserves navigation keys needed to reproduce a failure', () => {
    expect(safeKeyLabel(key('Tab'))).toBe('Tab');
    expect(safeKeyLabel(key('ArrowDown'))).toBe('ArrowDown');
    expect(safeKeyLabel(key(' '))).toBe('Space');
  });

  it('masks printable input and keeps only shortcut shape', () => {
    expect(safeKeyLabel(key('p'))).toBe('Character');
    expect(safeKeyLabel(key('x', { ctrlKey: true }))).toBe('Ctrl+Character');
    expect(safeKeyLabel(key('p'), true)).toBe('Masked character');
  });

  it('normalizes exposed labels', () => {
    expect(cleanText('  Save\n  project  ')).toBe('Save project');
    expect(cleanText('a'.repeat(100), 8)).toBe('aaaaaaaa');
  });
});
