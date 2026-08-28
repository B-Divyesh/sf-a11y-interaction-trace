# A11y Interaction Trace — review 3 handoff

## Result

Review only; no product code was changed. Review evidence and findings are in
`.factory/review-3.md`. Commit reviewed:
`b3b702cec6585c7436337ccc18e9b6c5c1702b81`.

The review verdict is **FAIL**.

## Verification performed

- Fresh live contexts at 390 × 844 and 1440 × 900 confirmed the first screen,
  demo entry, and distinct visual system.
- Live route/axe suite passed 13/13. A live crawl found no dead links or
  console errors; unknown paths return the styled HTTP 404.
- In a clean clone, `npm ci`, `npm test` (9 passed), `npm run check`, and
  `npm run build` passed. Each of the 17 commands in `.factory/claims.json`
  passed when invoked independently.
- A clean-clone `npm run test:a11y` failed once at the privacy-critical
  `@claim:sensitive-mask` screenshot pixel assertion, then passed on the next
  full run (28/28). This is an unacceptable intermittent quality gate, not a
  pass.

## Known gaps / next steps

1. Fix the screenshot-mask capture race and make the full suite pass
   repeatedly. See F-3-1 for the failing assertion and required regression.
2. Add registry entries/tests for the no-install populated demo and Reset seed
   restoration promises, or remove those statements. See F-3-2.

## Run

```bash
npm ci
npm test
npm run check
npm run build
npm run test:a11y
```

Do not deploy a review repair until the two findings in `review-3.md` are
closed and the full browser suite is stable.
