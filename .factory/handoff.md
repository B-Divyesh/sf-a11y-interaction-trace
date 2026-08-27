# A11y Interaction Trace — handoff

## Delivered

- Production-ready WXT/TypeScript Manifest V3 extension for Chrome and Edge.
- Explicit per-tab recording with a toolbar `REC` badge and persistent in-page timer/Stop dock.
- Ordered keyboard and focus timeline with DOM-derived role, accessible name, selector, ARIA state, viewport, URL, and timing evidence.
- Printable-key masking, sensitive-field name masking, and temporary visual masks over password/payment/private fields during screenshots.
- Screenshots off by default, rate-limited, and capped at 12 per session; storage-pressure fallback preserves the event without the image.
- Browser-local persistence, stop/clear states, actionable error states, and a self-contained offline HTML export viewer.
- Responsive product site, `/privacy/`, `/terms/`, and `/lab/` routes plus an offline service-worker shell.
- Seeded, safely escapable focus-containment defect at `/lab/` for validating the real job-to-be-done.
- Original concrete-and-moss hero imagery in WebP at 720 px and 1200 px, with source prompt and provenance under `assets/src/` and `.factory/design.md`.
- Packaged extension staged at `dist/site/downloads/a11y-interaction-trace.zip` by the production build.

## Run and verify

```bash
npm ci
npm run check
npm test
npx playwright install chromium
npm run test:a11y
npm run build
```

The deploy command is exactly `npm run build`. Static output is `dist/site/`, with `dist/site/index.html` at its root.

## Verification completed on 2026-08-27

- `npm run check`: passed.
- `npm test`: 6/6 unit tests passed (key masking, text normalization, safe JSON embedding, self-contained viewer, and filename behavior).
- `npm run test:a11y`: 6/6 Playwright checks passed at 390 × 844, covering all four routes, serious/critical axe findings, console errors, the seeded keyboard defect, Escape recovery, and offline reload.
- Chromium MV3 smoke test: passed against `/lab/`; six events were persisted, including `Shift+Tab → Background help (link)` and `Escape → Open quick edit (button)`, then the session stopped cleanly.
- Extension popup axe scan: no serious or critical violations.
- Production Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.3 s, CLS 0, TBT 0 ms.
- Production site payload: 1.8 KB JavaScript total, 9.8 KB CSS, 25 KB mobile hero / 77 KB desktop hero.
- Extension output: 41.8 KB unpacked; distributable zip 24.8 KB.
- `npm audit --omit=dev`: 0 vulnerabilities.
- Visual inspection completed at 1440 × 1000 and 390 × 844 with no horizontal overflow or console errors.
- Final manifest requests `activeTab`, `scripting`, `storage`, and `downloads`; it has no broad host permission.

## Known boundaries

- Chromium browsers are the supported v1 target.
- The semantic snapshot is a focused, DOM-derived approximation—not the browser or operating system accessibility tree. The product and exported viewer state this explicitly.
- Shadow DOM and cross-origin iframe internals are not traversed.
- A cross-origin navigation ends the browser's `activeTab` grant; the current trace stops rather than silently broadening access.
- Screenshot opt-in can capture non-sensitive visible page content. Sensitive password/payment/private fields are covered before capture, and users are reminded to review an exported file before sharing.

## Suggested next steps

- Publish the generated zip to the Chrome Web Store after external policy review.
- Add Firefox packaging after validating its MV3 `activeTab` and download behavior.
- Consider an optional user-authored marker/note control if issue triage shows that timeline events need narrative context.
