# A11y Interaction Trace — polish round 5 handoff

## Result

Round 5 is complete with no known open finding. The repair preserves the WXT + TypeScript MV3 browser extension, static site deployment, and concrete-and-moss visual system.

The two review-5 blockers are closed:

- `@claim:chronological-order` now compares complete action/timestamp pairs from the rendered demo, demo-namespaced production state, and downloaded production `trace-data`.
- `@claim:offline-site` now visits `/`, `/demo/`, `/lab/`, `/privacy/`, and `/terms/` once in separate clean contexts, then proves each reloads offline. It also proves the demo replay/reset controls, required modules/CSS, and same-origin request boundary offline.

The full suite exposed a `Vary`-header cache mismatch while this was being repaired. The service worker now uses `ignoreVary` for same-origin precache matches and reports its ready resource inventory. The temporary inline demo duplicate was removed; online and offline flows use the same TypeScript module under `script-src 'self'`.

The catalog description is: “Record keyboard focus failures and export one local trace for bug reports.” It is verb-first and 74 characters before the newline.

## Commits and deployment

- Review target: `53af30e402de1d313498864cdf0b7e290f01d38c`
- Review report: `a61925d5e47fbe1ed88d5fcb8805e2de6d759e4e`
- Repair commits: `1c3fc97`, `fbeb262`, `b4988a3`, `2697ef6`
- Production deployment ID: `1de44946-68f3-48c7-bc21-d5a92e265e62`
- Live URL: <https://a11y-interaction-trace.sociobot.in>
- Packaged ZIP SHA-256, local and live: `f44101682b7df28e3094a48b56cb370720a0337e96195eeae9d5a2981bd6e887`

## Clean-clone verification

Fresh clone: `/tmp/a11y-polish-5-clean-zFzl4ouL/repo` at `2697ef6`.

- `npm ci` — passed; 235 packages audited, zero vulnerabilities.
- Every exact command in `.factory/claims.json` — 19/19 passed independently.
- `npm test` — 11/11 passed.
- `npm run check` — passed.
- `npm run build` — passed; unpacked MV3 extension, 24.83 kB ZIP, and `dist/site` produced.
- `npm run test:a11y` — 31/31 passed.
- The offline claim also passed three consecutive repeated runs with two workers.
- Initial site payload: 2.15 kB main JS, 14.69 kB CSS, and 25.01 kB mobile hero image, all below product budgets.

## Production verification

- Deployed route/Axe/focus/mobile/offline suite — 13/13 passed.
- Deployed demo/export/order/scope/free claim subset — 8/8 passed.
- `verify-url.sh` — HTTP 200; correct title; `lang=en`; one h1; one main; zero missing alts; zero unnamed buttons; no console errors.
- Link crawl — 15/15 live links and hash targets passed.
- `/`, `/demo/`, `/lab/`, `/privacy/`, `/terms/`, the ZIP, `robots.txt`, and `sitemap.xml` returned 200.
- `/round-5-cold-missing-route` returned the designed page with HTTP 404.
- Live headers include self-only CSP, HSTS, Permissions-Policy, Referrer-Policy, and `X-Content-Type-Options`.
- Local Lighthouse — performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.2 s, TBT 0 ms, CLS 0.
- Live Lighthouse — performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.1 s, TBT 30 ms, CLS 0.

Cold live screenshots:

- `.factory/evidence-live-polish-5-home-mobile.png`
- `.factory/evidence-live-polish-5-home-desktop.png`
- `.factory/evidence-live-polish-5-demo-mobile.png`
- `.factory/evidence-live-polish-5-not-found-mobile.png`

The full ID-by-ID review mapping is in `.factory/polish-5.md`.

## Run and verify

```bash
npm ci
npm test
npm run check
npm run build
npm run test:a11y
```

Run one claim with the exact command recorded for its ID in `.factory/claims.json`. The production deploy root is `dist/site`.

## Known gaps and next steps

None identified. No TODO, stub, unresolved review item, deployment task, or follow-up product change remains.
