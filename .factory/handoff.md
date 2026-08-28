# A11y Interaction Trace — polish round 4 handoff

## Result

Round 4 is complete with no unresolved review finding. The false copy-audit values are corrected, all 34 numeric audit rows now have a row-by-row count regression, and the verb-first catalog sentence is 72 characters.

The prior demo, claims, routing, metadata, focus, mobile, legal, privacy, offline, packaging, and visual-identity repairs were rechecked from a clean clone and after deployment.

## Changes

- Corrected F-4-1 / F-2-6 counts to 12, 13, 11, and 12.
- Replaced the two-example count test with a parser that verifies every numeric `.factory/copy-audit.md` row; it currently checks 34 rows.
- Updated `.factory/catalog-description.txt` to: “Record keyboard focus failures and export a local trace for bug reports.”
- Added `.factory/polish-4.md` with every review ID mapped to its current change, test, screenshot, and live check.
- Preserved the WXT TypeScript MV3 extension, static deployment class, concrete-and-moss visual system, isolated demo, and existing user-facing behavior.

Repair implementation commit: `e88e26c8aab4b31fe75ecde6cbae8757368c79ef`.

## Clean-clone evidence

Clean clone: `/tmp/a11y-polish-4-clean-9Uo4SY/repo` at `e88e26c8aab4b31fe75ecde6cbae8757368c79ef`.

- `npm ci` — passed; 235 packages audited, zero vulnerabilities.
- `npm test` — 5 files, 10 tests passed.
- `npm run check` — passed.
- `npm run build` — passed; 41.78 kB unpacked extension output, 24.83 kB extension ZIP, and `dist/site` produced.
- `npm run test:a11y` — 31/31 passed, including six Axe route scans, extension integration, privacy, masking concurrency, mobile, routing, offline, and 404 checks.
- Every exact `.factory/claims.json` command — 19/19 passed separately.

The sensitive-mask path passed in the working-tree full suite, clean-clone full suite, its independent claim run, and the parallel two-session regression.

## Performance and accessibility

- Local Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.2 s, TBT 0 ms, CLS 0. Evidence: `.factory/lighthouse-polish-4-local.json`.
- Live Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.1 s, TBT 70 ms, CLS 0. Evidence: `.factory/lighthouse-polish-4-live.json`.
- Site production JS totals 12,112 bytes uncompressed across route bundles; CSS is 14,689 bytes uncompressed.
- `verify-url.sh` passed locally and live: title, language, one h1, main, image alts, button names, and console. Evidence: `.factory/verify-local-polish-4.json` and `.factory/verify-live-polish-4.json`.

## Deployment and cold live verification

- Pushed implementation commit to `origin/main`.
- Built `dist/site` and deployed with `/opt/fleet/lib/deploy-static.sh a11y-interaction-trace dist/site`.
- Azure Static Web Apps deployment ID: `81a4d40f-21bc-4d6c-ae95-2d70f90ee383`.
- Live URL: <https://a11y-interaction-trace.sociobot.in>.
- Live route/Axe/focus/mobile/offline suite: 13/13 passed.
- Live demo/export/scope/offline claim subset: 8/8 passed.
- All 15 discovered links and hash targets returned 200; legal links, external Source, sample entry, and ZIP were included.
- `/`, `/demo/`, `/lab/`, `/privacy/`, `/terms/`, and the ZIP returned 200. `/round-4-cold-missing-route` returned the styled page with HTTP 404.
- A fresh 390 × 844 home context had no console error or horizontal overflow; the final first-screen fact ended at y=699.
- A fresh 1440 × 900 context placed the final fact at y=713.
- One-click sample entry showed all four events. Replay and reset left `real:sentinel` and `traceSession` unchanged and touched only `demo:a11y-interaction-trace:state`.
- Deployed and local extension ZIP SHA-256 values matched: `f44101682b7df28e3094a48b56cb370720a0337e96195eeae9d5a2981bd6e887`.

Screenshots:

- `.factory/evidence-live-polish-4-home-mobile.png`
- `.factory/evidence-live-polish-4-home-desktop.png`
- `.factory/evidence-live-polish-4-demo-mobile.png`
- `.factory/evidence-live-polish-4-not-found-mobile.png`

## Run and verify

```bash
npm ci
npm test
npm run check
npm run build
npm run test:a11y
```

Run any single registered claim using the exact `test` command in `.factory/claims.json`. Run the deployed route suite with:

```bash
BASE_URL=https://a11y-interaction-trace.sociobot.in \
  npx playwright test tests/e2e/site.spec.ts --workers=2
```

## Known gaps and next steps

None. Version 1 intentionally remains a Chromium MV3 extension with selected-DOM nearby control snapshots; those documented boundaries match the brief and tested claims.
