# Polish round 6 — zero-finding closure

Repair commit: `de448fb` (based on adversarial review commit `28065e0`). Deployed as `6fe3a43c-5bff-4157-80da-23c3a3c419ca` to <https://a11y-interaction-trace.sociobot.in> on 2026-08-28.

Every `review-1.md` through `review-6.md` and every earlier `polish-*.md` was read before repair. Prior fixes below were rechecked in the repaired build and, where applicable, on the cold deployed site.

## Evidence key

- **CLEAN** — fresh clone `/tmp/a11y-polish-6-clean-o4jwhS/repo` at `de448fb`: `npm ci` (0 vulnerabilities), all 20 exact commands in `.factory/claims.json`, `npm test` (11/11), `npm run check`, `npm run build`, and `npm run test:a11y` (31/31) passed.
- **ROUTES** — `BASE_URL=https://a11y-interaction-trace.sociobot.in npx playwright test tests/e2e/site.spec.ts --workers=2` passed 13/13. It covers route metadata, focus/back announcement, responsive first screens, target sizes, lab keyboard flow, built-site 404, offline navigation, and Axe serious/critical scans.
- **LIVE-CLAIMS** — the production checks for `demo-isolation`, `demo-entry`, `demo-reset`, `trace-export-content`, `chronological-order`, `offline-export`, `snapshot-scope`, and `free-mit` all passed.
- **VERIFY** — `.factory/verify-live-polish-6/verify.json` records HTTP 200, the correct title, `lang=en`, one `h1`, `main`, zero missing image alt text or unnamed buttons, and no console errors.
- **LIVE** — `/polish-6-cold-missing-route` returned HTTP 404. `/`, `/demo/`, `/lab/`, `/privacy/`, `/terms/`, the ZIP, `robots.txt`, and `sitemap.xml` returned 200. The live ZIP SHA-256 equals the clean build: `f44101682b7df28e3094a48b56cb370720a0337e96195eeae9d5a2981bd6e887`.
- **SCREENSHOTS** — cold live [home mobile](evidence-live-polish-6-home-mobile.png), [home desktop](evidence-live-polish-6-home-desktop.png), [demo mobile](evidence-live-polish-6-demo-mobile.png), and [404 mobile](evidence-live-polish-6-not-found-mobile.png); local counterparts are also retained in this directory.
- **LIGHTHOUSE** — [local](lighthouse-polish-6-local.json): performance 96, accessibility 100, best practices 100, SEO 100; LCP 2.4 s, TBT 0 ms, CLS 0. [Live](lighthouse-polish-6-live.json): 100/100/100/100; LCP 1.1 s, TBT 30 ms, CLS 0.

## Review 6

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-6-1 / UC-05 | The explicit-recording test now sends `ArrowDown` before Start, proves storage is empty, then records only post-start `Enter`. It parses the actual production background-download data URL and proves the export excludes the pre-start action; recorder bar, badge, dock Stop, and popup Stop remain checked. | `@claim:explicit-recording`; CLEAN |
| F-6-2 / UC-12 | The offline-export test clicks **Download sample trace** in `/demo/`, saves that emitted file, opens it in a fresh browser context, turns the context offline, and checks content, focus/snapshot output, zero HTTP(S) requests, and zero page/console errors. | `@claim:offline-export`; CLEAN; LIVE-CLAIMS |
| F-6-3 | The `demo-isolation` claim, location, and sandbox now explicitly say **Start for real** removes demo data. Its test asserts the demo key is gone after exit and real sentinels are unchanged. | `@claim:demo-isolation`; CLEAN; LIVE-CLAIMS |
| F-6-4 | Added the `designed-404` claim and a tagged built-site server test that requires HTTP 404, the title and heading, and a working **Return to product** link. | `@claim:designed-404`; CLEAN; ROUTES; LIVE |
| F-6-5 | Replaced “seeded dialog” with “checkout dialog with a completed sample trace,” and rewrote the demo lead in the same plain language. The copy audit and desktop assertion were updated. | first-screen copy test; CLEAN; ROUTES; SCREENSHOTS |

## Reviews 5, 4, 3, and 2

| Finding | Change retained or rechecked | Evidence |
| --- | --- | --- |
| F-5-1 / UC-03 | Timeline, demo storage, and downloaded production `trace-data` are compared as complete action/timestamp pairs. | `@claim:chronological-order`; CLEAN; LIVE-CLAIMS |
| F-5-2 / UC-12 | Fresh contexts visit and reload `/`, `/demo/`, `/lab/`, `/privacy/`, and `/terms/` offline; the demo also replays and resets offline. | `@claim:offline-site`; CLEAN; ROUTES |
| F-4-1 / F-2-6 | All 34 numeric copy-audit rows are parsed against their actual whitespace-delimited text; the revised checkout and catalog text are counted. | copy-audit test; CLEAN |
| F-3-1 / UC-08 | Screenshot masks wait for two painted frames and persist through capture; all four sensitive fields in every JPEG and concurrent captures are checked. | `@claim:sensitive-mask`; screenshot concurrency test; CLEAN |
| F-3-2 | Separate claims prove a no-install populated entry and byte-identical Reset behavior. | `@claim:demo-entry`, `@claim:demo-reset`; CLEAN; LIVE-CLAIMS |
| F-2-1 / B-01 | Desktop keeps job, audience, primary action, outcome, and facts above the fold; phone puts usable copy before the art. | 390 px and 1440 px first-screen tests; ROUTES; SCREENSHOTS |
| F-2-2 | The sample and exported trace serialize Project name as `input` / `textbox`. | `@claim:snapshot-scope`; CLEAN; LIVE-CLAIMS |
| F-2-3 / C-14 / UC-15 | “Nearby control snapshot” is the single selected-DOM term in copy and export, including the DOM-only limitation. | `@claim:snapshot-scope`; CLEAN; LIVE-CLAIMS |
| F-2-4 | The untestable screen-recording comparison was removed. | copy-audit test; CLEAN |
| F-2-5 | The untestable broad permission/page-policy claim was removed. | claims-registry and copy-audit tests; CLEAN |

## Review 1 — blocking, high, medium, and non-blocking findings

| Finding | Change retained or rechecked | Evidence |
| --- | --- | --- |
| B-01 | First screen states the concrete recording job, intended user, action, result, and facts at both target sizes. | first-screen tests; ROUTES; SCREENSHOTS |
| B-02 | `?demo=1` and `/demo/` enter the isolated, populated one-click sample with banner, Reset demo, and Start for real. | `@claim:demo-isolation`, `@claim:demo-entry`, `@claim:demo-reset`; CLEAN; LIVE-CLAIMS |
| B-03 | The registry has 20 concrete claims, each with exactly one tagged observable test. | claims-registry test; 20 exact claim commands in CLEAN |
| B-04 | The deployed static host serves a styled true 404 page with a return route. | `@claim:designed-404`; ROUTES; LIVE; 404 screenshot |
| H-01 | Each real route has its own short title, description, canonical, social metadata, language, and theme color. | six-route metadata test; ROUTES; VERIFY |
| H-02 | Route changes move focus to the one page heading and announce the route; Back restores route state. | route focus/Back test; ROUTES |
| H-03 | Interactive controls meet the 44 px touch-target baseline with designed visible focus. | target-size and keyboard tests; ROUTES |
| M-01 | Header, skip link, footer, legal links, wordmark home link, and limited navigation appear on all site routes. | route semantic-link test; ROUTES |
| M-02 | README documents the extension, demo URL, isolation, build/test/install/deploy flow, and privacy behavior. | README and demo tests; CLEAN |
| N-01 | Product art retains meaningful text alternative and all decorative images are excluded from the accessibility tree. | Axe scans; ROUTES; VERIFY |

## Review 1 — public-claim findings

| Finding | Change retained or rechecked | Evidence |
| --- | --- | --- |
| UC-01 | Export contains keyboard actions, focus/page data, and nearby snapshots. | `@claim:trace-export-content`; CLEAN; LIVE-CLAIMS |
| UC-02 | The three first-screen facts are separate, short, supportable statements. | first-screen and copy-audit tests; CLEAN; ROUTES |
| UC-03 | Recorded actions remain chronological in UI, storage, and downloaded sample. | `@claim:chronological-order`; CLEAN; LIVE-CLAIMS |
| UC-04 | Shift+Tab and Escape are captured and displayed as keyboard actions. | keyboard recorder test; CLEAN |
| UC-05 | Pre-start input is absent from stored and downloaded traces. | `@claim:explicit-recording`; CLEAN |
| UC-06 | Recording state is visible through bar, badge, dock, and popup controls. | explicit-recording test; CLEAN |
| UC-07 | Typed characters are represented as `Character` without storing their literal text. | key privacy test; CLEAN |
| UC-08 | Sensitive screenshot regions are masked in all saved captures. | `@claim:sensitive-mask`; CLEAN |
| UC-09 | Screenshot capture is opt-in and visibly disabled when off. | screenshot toggle test; CLEAN |
| UC-10 | The sample visibly contains the promised trace length and usable states. | demo-entry test; CLEAN; LIVE-CLAIMS |
| UC-11 | The exported trace includes the documented fields and readable file structure. | `@claim:trace-export-content`; CLEAN; LIVE-CLAIMS |
| UC-12 | The real downloaded sample and all documented site routes work in the stated offline scenario. | `@claim:offline-export`, `@claim:offline-site`; CLEAN; ROUTES; LIVE-CLAIMS |
| UC-13 | Reset and exit clear demo-only data without changing real storage. | `@claim:demo-reset`, `@claim:demo-isolation`; CLEAN; LIVE-CLAIMS |
| UC-14 | Demo recording/export sends no remote requests. | `@claim:local-no-upload`; CLEAN |
| UC-15 | The selected-DOM snapshot scope is named and limited in the UI and export. | `@claim:snapshot-scope`; CLEAN; LIVE-CLAIMS |
| UC-16 | README maps each advertised action to the shipped extension/site surface. | README coverage test; CLEAN |
| UC-17 | Unsupported external-performance language is absent. | copy-audit test; CLEAN |
| UC-18 | Manifest permissions are minimal and test-checked. | `@claim:manifest-permissions`; CLEAN |
| UC-19 | Unsupported browser-internal guarantees are absent. | copy-audit test; CLEAN |
| UC-20 | The recorder enforces the documented action cap. | action-cap test; CLEAN |
| UC-21 | Build/package artifacts are reproducible and inspected. | `@claim:packaged-build`, `@claim:chromium-package`; CLEAN |
| UC-22 | Unsupported architecture claims are absent. | copy-audit test; CLEAN |
| UC-23 | Demo exports are marked as sample content and retain sandbox scope. | `@claim:demo-isolation`, `@claim:trace-export-content`; CLEAN; LIVE-CLAIMS |
| UC-24 | Cross-origin capture promises are absent; only the selected page DOM scope is described. | copy-audit and snapshot-scope tests; CLEAN |
| UC-25 | Shadow-DOM and iframe capture promises are absent. | copy-audit test; CLEAN |
| UC-26 | Generated/product assets have recorded provenance. | `@claim:provenance`; CLEAN |
| UC-27 | The free/MIT statement is backed by license and package checks. | `@claim:free-mit`; CLEAN; LIVE-CLAIMS |
| UC-28 | Action-to-focus association is recorded and shown. | trace-export-content and recorder tests; CLEAN |
| UC-29 | The product explains the concrete bug-report use of a trace. | first-screen/copy-audit tests; CLEAN; SCREENSHOTS |
| UC-30 | Unsupported Node-version requirements are absent from visitor copy. | copy-audit test; CLEAN |

## Review 1 — copy findings

| Finding | Change retained or rechecked | Evidence |
| --- | --- | --- |
| C-01 | The hero names the recording job in user words. | first-screen test; ROUTES |
| C-02 | The eyebrow is descriptive rather than promotional. | copy-audit test; CLEAN |
| C-03 | Heading hierarchy is meaningful and does not repeat the product name as the job headline. | semantic heading/Axe tests; ROUTES |
| C-04 | Close/exit wording names its actual outcome. | demo-isolation test; CLEAN |
| C-05 | Export wording names the trace contents rather than vague output. | trace-export-content test; CLEAN |
| C-06 | Sequence language matches actual event order. | chronological-order test; CLEAN |
| C-07 | Subjective marketing wording was removed. | copy-audit test; CLEAN |
| C-08 | Local-only behavior is tied to the bug-report purpose. | local-no-upload and copy-audit tests; CLEAN |
| C-09 | ZIP/download names match the packaged artifact. | packaged-build test; CLEAN; LIVE |
| C-10 | README identifies the accessibility and QA audience in plain words. | README coverage test; CLEAN |
| C-11 | Opening copy explains what data starts in the sample. | demo-entry test; CLEAN; LIVE-CLAIMS |
| C-12 | Lab wording says what the controls do. | lab keyboard-flow test; ROUTES |
| C-13 | Storage effects are stated for demo reset and exit. | demo-isolation/reset tests; CLEAN |
| C-14 | “Nearby control snapshot” is the consistent non-jargon term. | snapshot-scope test; CLEAN; LIVE-CLAIMS |
| C-15 | Recording and trace terms remain consistent across site, lab, and README. | copy-audit/README tests; CLEAN |
| C-16 | “Current trace” labels the actual current state. | recorder UI test; CLEAN |
| C-17 | Recorder-bar Stop labels its action. | explicit-recording test; CLEAN |
| C-18 | Controls name the signals they expose. | keyboard recorder test; CLEAN |
| C-19 | Screenshot wording describes literal masked captures. | sensitive-mask test; CLEAN |
| C-20 | Manual installation instructions use plain browser language. | README test; CLEAN |
| C-21 | Character and sensitive-field wording makes the privacy behavior concrete. | key-privacy and sensitive-mask tests; CLEAN |
| C-22 | Facts use concrete supported behavior rather than generic claims. | copy-audit and claims-registry tests; CLEAN |

## Final status

No reviewed finding remains open. The repaired product preserves the concrete-and-moss extension identity, uses real isolated demo storage and a real downloaded sample, and has claim coverage for every visitor-facing promise in the registry.
