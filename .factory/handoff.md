# A11y Interaction Trace — polish round 6 handoff

## Result

Repair commit `de448fb` closes every finding in adversarial reviews 1–6. It is pushed to `main` and deployed as Static Web Apps deployment `6fe3a43c-5bff-4157-80da-23c3a3c419ca`:

<https://a11y-interaction-trace.sociobot.in>

The round-six repairs are substantive:

- The explicit-recording test now proves a keyboard action made before Start is absent from both storage and the production background download.
- Offline export now downloads the real `/demo/` file, opens that file in a fresh context, and proves it works offline without HTTP(S) requests.
- The demo-isolation registry claim explicitly covers **Start for real** deleting demo data.
- The true styled 404 behavior now has a registry claim and an HTTP-level built-site test.
- First-screen copy now says “checkout dialog with a completed sample trace,” not “seeded dialog.”

The visual system remains the product-specific concrete-and-moss extension identity. No third-party runtime scripts, analytics, or fonts were added.

## Verification

Fresh clone used: `/tmp/a11y-polish-6-clean-o4jwhS/repo` at `de448fb`.

- `npm ci` — passed, zero vulnerabilities.
- Every exact command in `.factory/claims.json` — 20/20 independently passed from the clean clone.
- `npm test` — 11/11 passed.
- `npm run check` — passed.
- `npm run build` — passed; `dist/` and `dist/site/` produced. Packaged ZIP is 24.83 kB.
- `npm run test:a11y` — 31/31 passed.
- Live `tests/e2e/site.spec.ts` — 13/13 passed, covering metadata, headings, focus/Back announcement, 44 px targets, mobile/desktop first screens, keyboard lab behavior, built-site 404, offline routes, and Axe serious/critical checks.
- Live production claim checks — 8/8 passed for demo isolation/entry/reset, export content/order, real offline export, snapshot scope, and free/MIT verification.
- `verify-url.sh` — live HTTP 200, correct title, `lang=en`, one h1, one main, zero missing alt text or unnamed buttons, and no console errors: [.factory/verify-live-polish-6/verify.json](verify-live-polish-6/verify.json).
- Cold live route checks — `/`, `/demo/`, `/lab/`, `/privacy/`, `/terms/`, ZIP, `robots.txt`, and `sitemap.xml` returned 200; an unknown path returned 404.
- Local Lighthouse: 96 performance / 100 accessibility / 100 best practices / 100 SEO; LCP 2.4 s, TBT 0 ms, CLS 0. Live Lighthouse: 100 / 100 / 100 / 100; LCP 1.1 s, TBT 30 ms, CLS 0.
- Clean and live ZIP SHA-256 match: `f44101682b7df28e3094a48b56cb370720a0337e96195eeae9d5a2981bd6e887`.

See [.factory/polish-6.md](polish-6.md) for the complete finding-id → repair → evidence map and retained cold screenshots.

## Run and verify

```bash
npm ci
npm test
npm run check
npm run build
npm run test:a11y
```

Run every `test` command in `.factory/claims.json` independently from a fresh clone. To exercise the production deployment:

```bash
BASE_URL=https://a11y-interaction-trace.sociobot.in \
  npx playwright test tests/e2e/site.spec.ts --workers=2
```

Use <https://a11y-interaction-trace.sociobot.in/demo/> or `https://a11y-interaction-trace.sociobot.in/?demo=1` for the isolated sample. **Reset demo** restores the sample; **Start for real** discards its `demo:` storage namespace. The extension package is linked from the landing page download control.

## Known gaps

None. All recorded findings, including minor copy and claim-coverage findings, are closed and rechecked on the deployed site.
