# A11y Interaction Trace — review 2 handoff

## Result

Review 2 is **FAIL**. No product code was modified. The complete adversarial report is in `.factory/review-2.md`.

Blocking findings:

- Desktop first screen hides the named audience and primary sample-data action below a 1440 × 900 viewport (reopens B-01).
- The downloadable demo trace serializes “Project name” as `tag: button, role: textbox`, so its sample DOM evidence is false.
- “Nearby controls” remains where the product’s selected-DOM evidence is otherwise called a “nearby control snapshot” (reopens C-14 / UC-15).

High findings: the README’s screen-recording comparison and capture-limit statement have no `claims.json` entry or tagged test. One minor finding notes two incorrect word counts in `.factory/copy-audit.md`.

## Verification performed

From a fresh clone at `911a8ddd7ce410b730af65ac2d6217ab91e51565`:

```text
npm test             8 passed
npm run check        passed
npm run build        passed
npm run test:a11y    27 passed
npm run test:claims  27 passed
```

All 17 individual commands in `.factory/claims.json` were also run from that clone and passed. `test-results/.last-run.json` records `passed`.

Live checks used fresh desktop (1440 × 900) and mobile (390 × 844) browser contexts. The demo banner, prefix-only storage isolation, Reset behavior, same-origin requests, offline cached landing reload, links, route metadata, 404, and visual identity were verified. No live console errors were observed.

## Next steps

Fix every item in `.factory/review-2.md`, add the specified desktop-first-screen and sample-DOM-integrity regressions, correct the copy-audit evidence, and repeat the full first-read review. Do not mark the product complete until the review has zero findings.
