# Independent verification — FAIL

**Work order:** `a11y-interaction-trace-verify-1`  
**Candidate:** `f6109f14cb2667d02320ea93062e6ca2410b56dc`  
**Live URL:** <https://a11y-interaction-trace.sociobot.in>  
**Verified:** 2026-08-28 UTC

## Result

**FAIL.** The main local trace workflow works, but a high-severity privacy
defect violates the researched brief's requirement to mask sensitive fields
before screenshot capture. The live deployment is an exact match for the
candidate, so this is not a deployment-only failure.

## Blocking defect

### High — ARIA-labelled password fields are captured unmasked in screenshots

`src/lib/privacy.ts:8-12` classifies `[aria-label*="password" i]` as a
sensitive element. This correctly produces a masked field name and a masked
keypress label. But `entrypoints/recorder.ts:66-79`, the code executed just
before `captureVisibleTab`, covers only:

```
input[type="password"], [data-private], input[autocomplete*="cc-"],
input[autocomplete*="password"], input[autocomplete="one-time-code"]
```

It omits `[aria-label*="password" i]`. Consequently, a visible
`<input type="text" aria-label="Password" value="…">` is recognized as
sensitive for trace metadata but remains visible in an opted-in JPEG. The JPEG
is stored locally and embedded into the shareable exported viewer. This is a
direct violation of the brief's “mask typed text and sensitive fields”
constraint and the popup's “passwords and sensitive fields are always masked”
claim.

Reproduction: open a regular page containing that input, enable **Include
screenshots**, start a trace, focus/type in the field, and trigger a capture.
The recorder's tested screenshot path creates the JPEG after the incomplete
mask selector has run. The classifier/selector discrepancy above makes the
exposure deterministic.

## Other defects and deployment findings

### Medium — immutable static assets are served with a 30-second cache policy

The live hashed assets, image, extension ZIP, and service worker all return
`Cache-Control: public, must-revalidate, max-age=30`. This does not meet the
factory performance contract's long-lived immutable caching for hashed assets.
For example, `/assets/main-DsB6pIXM.js` and
`/assets/style-DGWfKeRV.css` both returned that policy on 2026-08-28.

### Low — missing browser hardening headers

The live response includes HSTS, `X-Content-Type-Options: nosniff`, and a
strict cross-origin referrer policy, but has no `Content-Security-Policy` or
`Permissions-Policy`. No unexpected external request occurred during normal
site use, but the response policy should be hardened before release.

## Evidence gathered

### Clean candidate checkout and quality gates

Created a detached clean worktree at the candidate SHA, then ran:

```bash
npm ci
npm test
npm run check
npm run build
npm run test:a11y
npm audit --omit=dev
```

- `npm ci`: passed; 0 audit vulnerabilities.
- `npm test`: **6/6** Vitest tests passed.
- `npm run check`: passed (`tsc --noEmit`). No lint script exists.
- Exact production build `npm run build`: passed and produced the unpacked
  MV3 extension, 24,826-byte ZIP, and `dist/site/`.
- `npm run test:a11y`: **6/6** passed after `npx playwright install chromium`.
  Its first run failed before test execution because the locked Playwright
  1.62.1 browser revision was absent from the supplied cache; installing the
  exact browser resolved it. This is test-environment setup, not a product
  failure.
- Extension output: 41.84 KB unpacked; ZIP 24,826 bytes.
- Initial site JavaScript is far below the 200 KB budget (287 B main module,
  711 B shared module; 1,777 B across all emitted JS). CSS is 9,819 B. The
  mobile hero is 25,008 B and desktop hero 77,316 B.

### End-to-end extension exercise

Used the built unpacked MV3 extension in Chrome under Xvfb and invoked its
actual browser-toolbar action (not a mocked message) on `/lab/`.

- Normal path: the visible dock read `TRACE REC 00:00 Stop`; it was removed by
  Stop. The stored stopped trace had six ordered events: start; focus to
  **Open quick edit**; focus to **Project name**; `Shift+Tab` focused
  **Background help** (link); `Escape` restored **Open quick edit** (button);
  stop. Each interaction event had a narrowed semantic snapshot.
- Boundary: with screenshot opt-in, 17 events produced exactly **12** JPEG
  data URLs and **2** explicit “skipped after 12 captures” events. The cap and
  opt-in work.
- Invalid/recovery path: starting on `chrome://version/` displayed the exact,
  actionable error: “Open a regular web page, then start recording again.” A
  fresh regular-tab session then succeeded as above.
- The manifest has only `activeTab`, `storage`, `downloads`, and `scripting`;
  it has no host permissions. Site-runtime request logging found no external
  requests and source/built-artifact scanning found no analytics or CDN assets.

### Live deployment, accessibility, and responsive checks

- Downloaded live `/` and `downloads/a11y-interaction-trace.zip`; both SHA-256
  matched the fresh local build exactly:
  - index: `ddecce79693be662068e243e0f5c22ac097c024ef26ff41c85c5a6dc422fb8a6`
  - ZIP: `9b2d8fc7e888ed4025a68bec04fe7021f068a6a19329512f18ad7746a8c61cdd`
- Live `/`, `/privacy/`, `/terms/`, and `/lab/` each returned 200, have one
  `h1`, one `main`, `lang=en`, a title, and zero axe serious/critical findings.
- On desktop and at 390 × 844, every checked route had `scrollWidth === 390`
  on mobile, no disabled zoom, no console/page errors, and no outbound requests.
- Keyboard-only smoke: the first Tab reached the skip link with a visible
  3 px solid moss focus outline. The seeded lab defect and Escape recovery
  succeeded in the extension trace.
- Under `prefers-reduced-motion: reduce`, the live page had `scroll-behavior:
  auto` and no running CSS animations.
- The repository's Playwright suite additionally passed its service-worker
  offline-reload test. This product is a browser extension rather than a PWA;
  no separate service-worker-version transition was supplied to exercise an
  update migration.

## Required remediation and retest

1. Use one shared sensitive-field predicate for metadata and screenshot masks,
   including ARIA-labelled password fields (and add an automated screenshot
   regression test using a visible text input labelled Password).
2. Rebuild, rerun the complete suite, and retest an actual exported JPEG/viewer
   to prove the sensitive value is absent.
3. Configure long-lived immutable caching for fingerprinted static assets and
   add CSP and Permissions-Policy response headers at deployment.
