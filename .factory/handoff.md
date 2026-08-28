# A11y Interaction Trace — review 7 handoff

## Result

Adversarial review 7 is complete with a **PASS** and zero findings. Product
source was not modified. The review is recorded in
[`review-7.md`](review-7.md).

## What was checked

- Cold live first reads at 390 × 844 and 1440 × 900.
- Complete landing-page and README sentence audit.
- One-click populated demo, namespace isolation, reset, exit, offline use, and
  same-origin network behavior.
- Every earlier review, polish record, and prior handoff; all prior IDs were
  rechecked in current code and on the live deployment.
- Titles, metadata, route focus/Back/scroll behavior, true 404, link and fragment
  crawl, headers, footer/header consistency, and visual identity.
- Accessibility through the live route suite, independent full Axe scans, and
  `verify-url.sh`.
- Every registered claim from a fresh clone.

## Verification

Fresh clone: `/tmp/a11y-review7-clean-VtYsXB/repo` at
`a2c8e14cf1a28b59b5869d5be97786148c44929b`.

- All 20 exact commands in `.factory/claims.json`: 20/20 passed independently.
- `npm test`: 11/11 passed.
- `npm run check`: passed.
- `npm run build`: passed and produced the extension, ZIP, and `dist/site/`.
- `npm run test:a11y`: 31/31 passed.
- Live `tests/e2e/site.spec.ts`: 13/13 passed after building its local 404
  fixture.
- Independent Axe scans: zero violations on `/`, `/demo/`, `/lab/`,
  `/privacy/`, `/terms/`, and `/404.html`.
- `verify-url.sh`: title, language, h1, main, alt, button-label, and console
  checks passed.
- Live crawl: every discovered link and fragment resolved; an unknown route
  returned HTTP 404.
- Live HTML and extension ZIP match the current local build byte-for-byte. ZIP
  SHA-256:
  `f44101682b7df28e3094a48b56cb370720a0337e96195eeae9d5a2981bd6e887`.

## Run again

```bash
npm ci
npm test
npm run check
npm run build
npm run test:a11y
```

Run each `test` value in `.factory/claims.json` independently from a fresh
clone. For live route checks, build locally first because the styled-404 test
serves `dist/site/`, then run:

```bash
BASE_URL=https://a11y-interaction-trace.sociobot.in \
  npx playwright test tests/e2e/site.spec.ts --workers=2
```

## Known gaps

None found.
