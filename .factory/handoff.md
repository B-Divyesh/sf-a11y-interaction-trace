# A11y Interaction Trace — review 8 handoff

## Result

Review 8 is complete with a **FAIL**: one medium finding and one untested
public claim. Product code was not modified. The report is
[`review-8.md`](review-8.md).

Implementation candidate:
`de448fb7f0a9891079c2e1abecb34b33f4dedd5c`. Documentation SHA reviewed:
`954036a05c4918d39f602e209e22eb753d340a88`.

## Finding to fix

The installed popup uses the product-name-only title “A11y Interaction Trace”
and the metaphorical heading “Capture the path, not the person.” The heading
also reads as a broad privacy promise, but it has no claims entry or test.
Replace it with a job-naming title and heading, remove “Private by design,” and
retain only the concrete tested privacy statements. Add the popup copy to the
copy/claims audit.

## Verification completed

- All 20 exact claim commands passed independently from a fresh clone.
- `npm test`: 11/11 passed.
- `npm run check`: passed.
- `npm run build`: passed and produced the extension, ZIP, and `dist/site/`.
- `npm run test:a11y`: 31/31 passed.
- Live route suite: 13/13 passed.
- Independent Axe: zero violations on all six site pages and the popup.
- Live verifier: correct title, language, h1, main, image text alternatives,
  button names, and no console errors.
- Demo replay/reset/exit preserved real-data sentinels and made only
  same-origin requests.
- Invalid start, empty export, normal recovery, screenshot cap, sensitive
  masking, and browser-restart persistence were exercised.
- Every served product file matched the clean build byte-for-byte. ZIP SHA-256:
  `f44101682b7df28e3094a48b56cb370720a0337e96195eeae9d5a2981bd6e887`.
- Mobile Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; LCP 1.1 s, TBT 20 ms, CLS 0.

## Run after repair

```bash
npm ci
npm test
npm run check
npm run build
npm run test:a11y
```

Run every `test` command in `.factory/claims.json` independently. Then build
and check the live routes with:

```bash
BASE_URL=https://a11y-interaction-trace.sociobot.in \
  npx playwright test tests/e2e/site.spec.ts --workers=2
```

## Product-code changes

None. Only this handoff and the review report were changed.
