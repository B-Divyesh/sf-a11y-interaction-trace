# A11y Interaction Trace — review round 6 handoff

## Result

Adversarial review 6 is complete with a **FAIL** verdict. No product code was modified. The full report is `.factory/review-6.md`.

Five findings remain:

- `F-6-1 / UC-05` — `explicit-recording` does not prove that a pre-start action stays out of storage/export.
- `F-6-2 / UC-12` — `offline-export` injects generated HTML instead of opening the actual downloaded demo trace.
- `F-6-3` — the README promise that Start for real removes all demo data is exercised but not stated by a claims entry.
- `F-6-4` — the README's styled-404 promise has no claims entry.
- `F-6-5` — “seeded dialog” is avoidable first-screen testing jargon.

The current live behavior itself is clear and functional: both first screens pass, the one-click demo is populated and isolated, all five routes work offline after a visit, routing/accessibility checks pass, and the actual downloaded sample trace opens offline.

## Verification performed

Clean clone: `/tmp/a11y-review6-clean-h4DMvA/repo` at `d04c244b9fddf3a8c36cbf6f1d7b9b57edfdc5fe`.

- `npm ci` — passed; zero vulnerabilities.
- Every exact command in `.factory/claims.json` — 19/19 command passes.
- `npm test` — 11/11 passed.
- `npm run check` — passed.
- `npm run build` — passed; unpacked extension, 24.83 kB ZIP, and `dist/site` produced.
- `npm run test:a11y` — 31/31 passed.
- Deployed `tests/e2e/site.spec.ts` — 13/13 passed, including six Axe scans, route focus/Back, mobile targets, first-screen bounds, 404, and offline route/demo behavior.
- `verify-url.sh` — HTTP 200; title, `lang=en`, one h1, one main, alt/button labels, and console checks passed.
- Live crawl — 15/15 document, hash, download, and external-source targets resolved; an unknown route returned HTTP 404.
- Demo replay/reset/exit changed only the demo-prefixed key; two real-data sentinels remained unchanged; requests were same-origin only.
- The downloaded sample trace opened from disk offline with expected content and no HTTP(S) request.
- Clean and deployed HTML/ZIP hashes match. ZIP SHA-256: `f44101682b7df28e3094a48b56cb370720a0337e96195eeae9d5a2981bd6e887`.

## How to reproduce

```bash
npm ci
npm test
npm run check
npm run build
npm run test:a11y
BASE_URL=https://a11y-interaction-trace.sociobot.in npx playwright test tests/e2e/site.spec.ts
```

Run each `test` command in `.factory/claims.json` independently from a clean clone. Review assertion coverage, not only exit status; F-6-1 and F-6-2 describe the concealed gaps.

## Next steps

Repair the five findings in severity order, rerun every registered claim from a clean clone, then repeat the cold mobile/desktop, demo isolation, offline, routing, link, accessibility, and history checks. Deployment remains outside this repository.
