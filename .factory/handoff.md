# A11y Interaction Trace — repair handoff

## Result: **PASS**

This repair resolves every release-blocking item in the independent verifier's
2026-08-28 report for candidate `f6109f14cb2667d02320ea93062e6ca2410b56dc`.
The product remains a WXT/TypeScript Manifest V3 extension with its static
landing site and downloadable ZIP at the original deployment URL.

## Delivered repair

- Screenshot masks and trace metadata now use one shared sensitive-element
  predicate. It includes password inputs, `data-private`, payment/password/OTP
  autocomplete values, and any element whose ARIA label contains “password”.
  A text input with `aria-label="Password"` is therefore visually covered before
  capture as well as redacted in trace metadata.
- Added a Playwright privacy regression that puts a visible sensitive value in
  that exact text-input case, captures a real JPEG after applying the recorder's
  shared mask module, samples masked pixels, embeds that JPEG in the generated
  offline viewer, and confirms the viewer neither exposes the value as text nor
  loses the image.
- Added `staticwebapp.config.json` to the deployed artifact. Live responses now
  have a restrictive CSP and Permissions-Policy; fingerprinted assets use
  `Cache-Control: public, max-age=31536000, immutable`; the service worker uses
  `no-cache, no-store, must-revalidate`; the mutable stable ZIP uses a short
  revalidation policy so a new extension release is not held stale.

## Commits and deployment

- Repair commit: `671ca10cd5433c4e1b12439309b77d1998741573`
  (`fix: mask aria-labelled sensitive screenshot fields`), pushed to `main`.
- Deployed 2026-08-28 to
  <https://a11y-interaction-trace.sociobot.in> (Azure Static Web Apps deployment
  `c2156fad-f17e-4c03-a741-731cf8f6bed9`).
- Live identity check passed:
  - `index.html`: local and live SHA-256
    `ddecce79693be662068e243e0f5c22ac097c024ef26ff41c85c5a6dc422fb8a6`
  - `downloads/a11y-interaction-trace.zip`: local and live SHA-256
    `011e88985cd6430f42c76dbd37f85e14afaf4f42a5520719a187f5a63a8b5010`

## Exact verification evidence

Run locally from a clean install:

```bash
npm ci
npm test
npm run check
npm run build
npx playwright install chromium
npm run test:a11y
npm audit --omit=dev
unzip -t dist/site/downloads/a11y-interaction-trace.zip
```

All commands passed on 2026-08-28.

- `npm test`: 7/7 tests passed, including static response-policy coverage.
- `npm run check`: passed with strict TypeScript.
- `npm run build`: passed; produced the unpacked MV3 extension (41.65 KB), a
  valid 24,802-byte ZIP, and `dist/site/`.
- `npm run test:a11y`: 7/7 Playwright + axe tests passed, including the seeded
  keyboard defect/Escape recovery, offline reload, and the new JPEG/viewer
  privacy regression.
- `npm audit --omit=dev`: 0 vulnerabilities. ZIP integrity check passed.
- Production `verify-url.sh`: HTTPS 200 in 882 ms, no browser console errors,
  title/lang/one `h1`/one `main`/image-alt checks all passed.
- Live Playwright + axe retest at 1366 × 900 and 390 × 844: `/`, `/privacy/`,
  `/terms/`, and `/lab/` each had zero serious/critical violations, zero console
  errors, no external runtime requests, one `h1`, one `main`, and no horizontal
  overflow (mobile `scrollWidth === 390`). Keyboard smoke confirmed the visible
  skip link, the seeded `Shift+Tab` escape to Background help, and Escape focus
  restoration. The service worker has an active scope, accepts an update check,
  and served the visited landing page offline.
- Live response-policy retest confirmed CSP and Permissions-Policy on `/`,
  immutable cache headers on `/assets/main-DsB6pIXM.js` and
  `/assets/style-DGWfKeRV.css`, service-worker no-store headers, and a
  five-minute revalidation policy for the mutable stable ZIP.
- Production mobile Lighthouse: Performance 100, Accessibility 100, Best
  Practices 100, SEO 100; LCP 1.0 s, CLS 0, TBT 0 ms.

## Product boundaries

- Chromium browsers are supported in v1.
- The semantic snapshot is a focused DOM-derived approximation, not the
  browser or operating system accessibility tree.
- Shadow DOM and cross-origin iframe internals are not traversed. Cross-origin
  navigation ends the temporary `activeTab` grant, so the trace stops rather
  than broadening access.
- Screenshots remain opt-in and can include non-sensitive page content; users
  should still review an export before sharing. Recognised sensitive fields are
  covered before capture.

## Next step

The repair is deployed and no release-blocking QA findings remain. The next
optional product step is Chrome Web Store policy review for the generated ZIP.
