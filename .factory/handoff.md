# A11y Interaction Trace — polish round 1 handoff

## Result

All blocking, high, medium, minor, unlisted-claim, and copy findings in `.factory/review-1.md` are resolved. No earlier `.factory/review-*.md` or `.factory/polish-*.md` existed beyond that report when work began.

Implementation commit `614c868f` was pushed to `origin/main`. Deployment `9bf19820-b4c5-46f9-b860-1a8bf6e99fdd` succeeded through `/opt/fleet/lib/deploy-static.sh a11y-interaction-trace dist/site`.

Live site: <https://a11y-interaction-trace.sociobot.in>

## Delivered

- Rewrote the first screen around the job, named audience, one-click sample, adjacent outcome, and three tested facts. Mobile puts copy and actions before artwork.
- Added isolated `?demo=1` → `/demo/` sample flow with four realistic events, persistent banner, replay, reset, start-for-real exit, trace download, and `demo:a11y-interaction-trace:` storage.
- Added `.factory/claims.json` with 17 unique claim IDs and one exact tagged test for each.
- Added real route titles and metadata, social/touch assets, canonical links, focus announcements, consistent navigation/footer, 44 px targets, sitemap entry, and a styled HTTP 404.
- Standardized product terms and rewrote every flagged landing/README phrase. `.factory/copy-audit.md` contains the sentence counts and terminology table.
- Strengthened extension tests to inspect actual browser-extension storage, badge and recorder controls, typed-key replacement, four sensitive field types, screenshot pixels, visible/background tab isolation, capture cap, clearing, and remote requests.
- Preserved and extended the concrete-and-moss visual system; new demo and 404 treatments are recorded in `.factory/design.md`.

The complete finding map is in `.factory/polish-1.md`.

## Verification evidence

From the working tree:

```text
npm test           8 passed
npm run check      passed
npm run build      passed; 41.62 kB extension, 24.77 kB ZIP
npm run test:a11y  27 passed
npm audit --omit=dev  0 vulnerabilities
```

From clean clone `/tmp/a11y-polish-clean-qRiwsx/repo`, all 17 commands listed in `.factory/claims.json` passed independently. Each command rebuilt the production artifacts before its one tagged test.

Production checks after deployment:

```text
live selected Playwright/axe/demo/offline suite  16 passed
/                                                    200
/demo/                                               200
/?demo=1                                             200, then client entry to /demo/
/lab/                                                200
/privacy/                                            200
/terms/                                              200
/downloads/a11y-interaction-trace.zip                200 application/zip
/definitely-not-a-route                              404 text/html
GitHub source link                                   200
```

`verify-url.sh` reports the correct title, `lang=en`, one h1, a main landmark, zero missing alt attributes, zero unlabeled buttons, and zero console errors. See `.factory/verify-live/verify.json`.

Live Lighthouse mobile scores are performance 100, accessibility 100, best practices 100, and SEO 100. LCP is 1.1 s, TBT is 0 ms, and CLS is 0. See `.factory/lighthouse-live-summary.json`.

Visual evidence:

- `.factory/evidence-live-home-mobile.png`
- `.factory/evidence-live-demo-mobile.png`
- `.factory/evidence-live-404-mobile.png`
- `.factory/verify-live/screenshot-desktop.png`

## How to verify

```bash
npm ci
npm test
npm run check
npm run build
npm run test:a11y
```

Then run each `test` command in `.factory/claims.json`. For production, set `BASE_URL=https://a11y-interaction-trace.sociobot.in` and run the site/demo subset described in `.factory/polish-1.md`.

## Known gaps and next steps

None for the reviewed scope. Infrastructure, DNS, and billing were not modified outside the authorized static deployment workflow.
