# A11y Interaction Trace — verification handoff

## Independent verification result: **FAIL**

Candidate `f6109f14cb2667d02320ea93062e6ca2410b56dc` was independently tested
on 2026-08-28 against <https://a11y-interaction-trace.sociobot.in>. The live
index and downloadable ZIP exactly match the candidate build.

The core extension workflow passes: an actual toolbar-invoked trace on the
seeded lab recorded the focus-trap `Shift+Tab` and Escape recovery correctly;
screenshot opt-in captured 12 JPEGs and enforced its cap; browser-internal
pages show a useful recovery error. Clean install, unit tests (6/6), TypeScript
check, exact production build, Playwright/axe suite (6/6 after installing the
locked Playwright browser), offline reload, mobile/desktop checks, and package
audit all pass.

Release is blocked by a high-severity privacy defect: fields matched as
sensitive solely by `aria-label` containing “password” are not included in the
visual screenshot-mask selector. Their visible values can therefore be stored
in an opted-in JPEG and exported in the shareable offline viewer. This violates
the local-first product's sensitive-field masking promise. The deployment also
serves hashed assets with only `max-age=30` and lacks CSP/Permissions-Policy.

See [verification.md](verification.md) for exact commands, hashes, reproduction,
severity, and complete evidence.

## Retest command sequence

```bash
npm ci
npx playwright install chromium
npm test
npm run check
npm run build
npm run test:a11y
```

Before a PASS, add a screenshot regression test proving no value from a
text-type `aria-label="Password"` field appears in an exported image/viewer,
then rerun the full verification report.
