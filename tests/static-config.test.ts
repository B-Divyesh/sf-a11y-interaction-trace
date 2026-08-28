import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';

const config = JSON.parse(readFileSync('public/staticwebapp.config.json', 'utf8')) as {
  globalHeaders: Record<string, string>;
  routes: Array<{ route: string; headers: Record<string, string> }>;
  responseOverrides: Record<string, { rewrite: string; statusCode: number }>;
};

describe('static deployment response policy', () => {
  it('hardens browser responses and caches fingerprinted assets immutably', () => {
    expect(config.globalHeaders['Content-Security-Policy']).toContain("default-src 'self'");
    expect(config.globalHeaders['Permissions-Policy']).toContain('camera=()');
    expect(config.routes.find(route => route.route === '/assets/*')?.headers['Cache-Control']).toBe('public, max-age=31536000, immutable');
    expect(config.routes.find(route => route.route === '/sw.js')?.headers['Cache-Control']).toBe('no-cache, no-store, must-revalidate');
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
  });

  it('allows only the reviewed inline offline-demo fallback', () => {
    const html = readFileSync('site/demo/index.html', 'utf8');
    const inline = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
      .map(match => match[1] ?? '')
      .find(source => source.includes('__a11yDemoReady'));
    expect(inline).toBeTruthy();
    const hash = createHash('sha256').update(inline!).digest('base64');
    expect(config.globalHeaders['Content-Security-Policy']).toContain(`'sha256-${hash}'`);
  });
});
