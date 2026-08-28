# A11y Interaction Trace — polish round 3 handoff

## Result

Repair implementation: `2d0019bb523941ecfa5d5ac426554cdc42a71314`.

The release candidate is deployed to <https://a11y-interaction-trace.sociobot.in>. Round 3 closes the two review-3 findings: screenshot capture now waits for a real two-frame mask-paint acknowledgement instead of a timing guess, and the no-install populated-demo plus Reset seed promises each have a registered claim test.

## What changed

- Sensitive fields remain masked until the screenshot promise settles. The recorder responds to `TRACE_MASK_SENSITIVE` only after all masks have been inserted and painted across two animation frames.
- The privacy test now checks all four sensitive-field rectangles in every stored JPEG. A second regression runs concurrent capture sessions.
- Added `demo-entry` and `demo-reset` claims and tests. The first enters demo by clicking the landing action in a non-extension context; the second compares the restored local-storage seed byte-for-byte.
- Updated the claims registry (19 claims), README/demo/copy-audit records, and verb-first catalog description.
- Added current local and live mobile/desktop screenshots, live verifier output, and Lighthouse report.

## Verification

Local repair checkout:

```bash
npm test                 # 10 passed
npm run check            # passed
npm run build            # passed; dist/site created
npm run test:a11y        # 31 passed, repeated three consecutive times
```

Fresh clone `/tmp/a11y-polish-3-clean-wKkDIC/repo`:

- `npm ci`, `npm test` (10), `npm run check`, and `npm run build` passed.
- All 19 commands listed in `.factory/claims.json` passed independently.
- `npm run test:a11y` passed 31/31.

Production:

- Deployed with `/opt/fleet/lib/deploy-static.sh a11y-interaction-trace dist/site` (deployment `0348c32d-5788-4d6f-b49f-f7bacd17b627`).
- `verify-url.sh` reports HTTP 200, no console errors, title/lang, one h1, main landmark, and no missing image alt attributes in `verify-live-polish-3/verify.json`.
- `BASE_URL=https://a11y-interaction-trace.sociobot.in npx playwright test tests/e2e/site.spec.ts --workers=2` passed 13/13, including serious/critical Axe checks across six routes, mobile targets, focus/Back, offline reload, and first-screen bounds.
- Live demo/export/privacy claim subset passed 8/8, including `demo-entry`, `demo-reset`, and `demo-isolation`.
- Production status checks: `/`, `/demo/`, `/lab/`, `/privacy/`, `/terms/`, and the ZIP return 200; an unknown path returns the styled 404 response.
- Lighthouse mobile report: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1,061 ms, TBT 0 ms, CLS 0. See `lighthouse-polish-3.json`.

The required Axe evidence is supplied by the product’s `@axe-core/playwright` integration on every live route. The standalone `@axe-core/cli` was attempted, but its bundled ChromeDriver supports Chrome 152 while the preinstalled Playwright Chromium is 145; this is a container-driver incompatibility, not an accessibility result.

## Evidence

- Local: `evidence-polish-3-home-desktop.png`, `evidence-polish-3-home-mobile.png`, `evidence-polish-3-demo-mobile.png`, `evidence-polish-3-not-found-mobile.png`.
- Live: `evidence-live-polish-3-home-mobile.png`, `evidence-live-polish-3-demo-mobile.png`, `evidence-live-polish-3-not-found-mobile.png`, and `verify-live-polish-3/`.
- Finding-level closure: `polish-3.md`.

## Run and deploy

```bash
npm ci
npm test
npm run check
npm run build
npm run test:a11y
/opt/fleet/lib/deploy-static.sh a11y-interaction-trace dist/site
```

## Known gaps

None. The product remains a local-first MV3 extension plus static landing site; no analytics, account, third-party runtime, or external data service was added.
