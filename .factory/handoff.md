# A11y Interaction Trace — review 1 handoff

## Result: **FAIL**

The adversarial first-read review is in [`review-1.md`](review-1.md). It covers
the live deployment and repository base
`bbcc27187318377310450a1d91940c53d157ef2b` on 2026-08-28 UTC.

## What was done

- Captured cold 390 × 844 and 1440 × 900 first screens before scrolling.
- Audited every landing-page and README sentence/content unit with word counts,
  terminology, jargon, headings, and action-label checks.
- Exercised the closest live trial path (`/lab/`), direct `/demo`, and
  `/?demo=1`; checked demo controls and a seeded real-storage sentinel.
- Confirmed `.factory/claims.json` and `@claim:*` tests are absent, then listed
  every landing/README claim that needs a test or removal.
- Captured live requests through landing/lab interaction and an offline reload.
- Checked titles, headings, metadata, unknown routes, deep links, Back/focus,
  every linked target, headers, mobile touch targets, reduced motion, console,
  and the distinct visual system.

## Verification run

From a clean clone of the base commit:

```bash
npm ci
npm test
npm run check
npm run build
npm run test:a11y
```

All commands passed: 7 unit tests and 7 Playwright/axe tests. The live
`verify-url.sh` check passed, live axe scans found zero violations on the four
real routes, the link crawl found no dead links, and the visited landing page
reloaded offline. These passes do not satisfy the missing claims/demo contract.

## Blocking gaps

1. The first screen does not name its intended user; at 390 px the main action
   is clipped and the three facts are below the fold.
2. There is no one-click sample-data demo, demo banner, reset, real-data exit,
   isolated namespace, or `.factory/demo.md`.
3. `.factory/claims.json` and all required one-to-one claim tests are missing.
4. Unknown routes return HTTP 200 with the home page instead of a designed 404.

Additional metadata, route-focus, touch-target, footer consistency, copy, and
README gaps are specified with concrete fixes in the review.

No product code was modified. Only this handoff and the review report changed.
