# A11y Interaction Trace — review 4 handoff

## Result

Review-only work; no product code was changed. The review is **FAIL** for one
blocking regression: four word counts in `.factory/copy-audit.md` are wrong.
See `.factory/review-4.md` for the exact rows and correction.

## What was verified

- Cold live visits at 390 × 844 and 1440 × 900 identified the job, audience,
  and “Try it with sample data” action before scrolling.
- The live demo entered a populated four-event checkout trace in one click.
  Replay, reset, and exit affected only
  `demo:a11y-interaction-trace:state`; seeded real storage keys were
  unchanged. Intercepted requests were same-origin.
- A fresh clone at `/tmp/a11y-review-4-clean` passed `npm test` (10),
  `npm run check`, and `npm run build`. All 19 claim commands from
  `.factory/claims.json` passed independently. `npm run test:a11y` passed
  31/31.
- The live 13-test route suite passed: metadata, Axe serious/critical checks,
  first-screen bounds, focus/Back, touch targets, 404, and offline reload.
  Internal-link crawl and unknown-route HTTP 404 checks passed.

## Required follow-up

Correct the four copy-audit counts to 12, 13, 11, and 12, and add a complete
row-by-row count regression test. Then rerun the adversarial review; no other
finding remains.

## How to verify

~~~bash
npm ci
npm test
npm run check
npm run build
npm run test:a11y
~~~

For the live route suite:

~~~bash
BASE_URL=https://a11y-interaction-trace.sociobot.in \
  npx playwright test tests/e2e/site.spec.ts --workers=2
~~~
