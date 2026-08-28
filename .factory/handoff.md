# A11y Interaction Trace — adversarial review 5 handoff

## Result

Review 5 is complete with verdict **FAIL**. No product code was modified.

The live product passes the cold first read at 390 × 844 and 1440 × 900, its one-click demo is realistic and isolated, every registered command passes, and the structure/accessibility/live behavior checks pass. Two claim tests are narrower than their public promises:

- F-5-1 / UC-03: `chronological-order` checks a separate test constant instead of the production demo's stored and downloaded trace.
- F-5-2 / UC-12: `offline-site` checks only `/` after an extra online reload, not the plural pages or interactive demo named by the claim.

Full evidence, exact locations, copy inventory, historical closure, and fixes are in `.factory/review-5.md`.

## Verification

Fresh clone: `/tmp/a11y-review5-OLiRRO/repo` at `53af30e402de1d313498864cdf0b7e290f01d38c`.

- `npm ci` — passed; zero vulnerabilities.
- Every exact command in `.factory/claims.json` — 19/19 command passes.
- `npm test` — 10/10 passed.
- `npm run check` — passed.
- `npm run build` — passed and produced `dist/` plus the extension package.
- `npm run test:a11y` — 31/31 passed.
- Live `tests/e2e/site.spec.ts` — 13/13 passed.
- `/opt/fleet/lib/verify-url.sh` — title, language, one h1, main, alt, button, and console checks passed.
- Live crawl — 15/15 discovered targets passed; unknown path returned the designed HTTP 404.
- Live demo replay/reset/exit preserved seeded real-data keys and made only same-origin requests.
- Live route documents and ZIP are byte-identical to the clean build. ZIP SHA-256: `f44101682b7df28e3094a48b56cb370720a0337e96195eeae9d5a2981bd6e887`.

## Remaining work

Implement the two claim-test fixes specified in review 5, then rerun every claim command and the complete browser suite. No deployment, infrastructure, DNS, billing, or product-code change was made during this review.
