# Polish round 4 — zero-finding closure

Completed 2026-08-28. Repair implementation: `e88e26c8aab4b31fe75ecde6cbae8757368c79ef`. Reviewed records: every `review-1.md` through `review-4.md` and every `polish-1.md` through `polish-3.md`.

The only reopened defect was F-4-1 / F-2-6. Its four counts are corrected, and the unit regression now parses and verifies all 34 numeric audit rows. Every earlier finding was rechecked in the clean repair commit and on the deployed product rather than accepted from an earlier handoff.

## Evidence key

- **HOME-M** — `.factory/evidence-live-polish-4-home-mobile.png`; cold 390 × 844 check of <https://a11y-interaction-trace.sociobot.in/>.
- **HOME-D** — `.factory/evidence-live-polish-4-home-desktop.png`; cold 1440 × 900 check of <https://a11y-interaction-trace.sociobot.in/>.
- **DEMO-M** — `.factory/evidence-live-polish-4-demo-mobile.png`; one-click sample at <https://a11y-interaction-trace.sociobot.in/demo/>.
- **404-M** — `.factory/evidence-live-polish-4-not-found-mobile.png`; HTTP 404 at <https://a11y-interaction-trace.sociobot.in/round-4-cold-missing-route>.
- **ROUTES** — live `tests/e2e/site.spec.ts`: 13/13, including six Axe route checks, first-screen bounds, route focus/Back, 44 px targets, focus lab, 404 mapping, and offline reload.
- **CLAIMS** — every command in `.factory/claims.json` run separately from clean clone `/tmp/a11y-polish-4-clean-9Uo4SY/repo`: 19/19.
- **LIVE-CLAIMS** — eight deployed demo/export/scope/offline claim checks: 8/8.

## Review 4

| Finding | Change made | Current evidence |
| --- | --- | --- |
| F-4-1 / F-2-6 | Corrected the four false counts to 12, 13, 11, and 12. Replaced the two-row regression with a parser that verifies all 34 numeric rows. Refreshed the catalog sentence and its 12-word audit row. | Test: `copy audit › records the verified word count for every numeric audit row`; clean `npm test` 10/10; HOME-M and HOME-D; live `/` 200. |

## Review 3

| Finding | Change retained and rechecked | Current evidence |
| --- | --- | --- |
| F-3-1 / UC-08 | Recorder waits for the painted-mask acknowledgement and holds masks through capture; every sensitive rectangle in every JPEG and concurrent sessions remain covered. | Tests: `@claim:sensitive-mask` and `sensitive screenshot masks stay painted during concurrent capture sessions`; passed in two full 31-test runs plus its separate CLAIMS run; DEMO-M; live `/privacy/` 200. |
| F-3-2 | Registry retains separate populated-no-install entry and byte-identical reset claims. | Tests: `@claim:demo-entry`, `@claim:demo-reset`, and registry one-to-one test; CLAIMS and LIVE-CLAIMS; DEMO-M; live `/demo/` 200. |

## Review 2

| Finding | Change retained and rechecked | Current evidence |
| --- | --- | --- |
| F-2-1 / B-01 | Desktop heading stays within the design scale; job, audience, action, outcome, and facts fit at both required viewports. | Tests: `390px first screen…` and `1440px first screen…`; ROUTES; HOME-M/HOME-D; live `/` 200. |
| F-2-2 | Project name remains serialized as `input` / `textbox`; each exported tag, role, name, and selector matches the sample surface. | Test: `@claim:snapshot-scope`; CLAIMS/LIVE-CLAIMS; DEMO-M; live `/demo/` 200. |
| F-2-3 / C-14 / UC-15 | Exported selected-DOM evidence consistently uses “nearby control snapshot.” | Test: `@claim:snapshot-scope`; CLAIMS/LIVE-CLAIMS; DEMO-M; live `/demo/` 200. |
| F-2-4 | The untestable screen-recording comparison remains absent. | Test: copy-audit row parser; repository copy search; HOME-M; live `/` 200. |
| F-2-5 | The broad, untested permission/page-policy assertion remains absent. | Test: claims-registry one-to-one test; README/Terms search; HOME-M; live `/terms/` 200. |
| F-2-6 | Superseded by F-4-1 and now protected across every numeric row. | Test: `copy audit › records the verified word count for every numeric audit row`; clean `npm test`; HOME-M; live `/` 200. |

## Review 1 — structure and discovery

| Finding | Change retained and rechecked | Current evidence |
| --- | --- | --- |
| B-01 | First screen states the job, named audience, sample action, outcome, and three facts; copy precedes art on phones. | First-screen tests in ROUTES; HOME-M/HOME-D; live `/` 200. |
| B-02 | `?demo=1` and the landing action enter a seeded, isolated demo with persistent banner, Reset demo, and Start for real. | `@claim:demo-isolation`, `@claim:demo-entry`, `@claim:demo-reset`; CLAIMS/LIVE-CLAIMS; DEMO-M; live `/?demo=1` → `/demo/`. |
| B-03 | Registry has 19 complete IDs and exactly one matching tagged test per ID. | `claims registry › has unique complete entries with one matching tagged browser test each`; CLAIMS 19/19; DEMO-M; live `/demo/` 200. |
| B-04 | Unknown documents return the styled concrete-and-moss 404 with HTTP 404. | `static host maps unknown paths…`; live curl status 404; 404-M; live missing route. |
| H-01 | Every route retains its scoped title, description, canonical where indexable, OG/Twitter fields, favicon, touch icon, and theme color. | Six ROUTES semantic/metadata/Axe tests; HOME-M, DEMO-M, 404-M; live `/`, `/demo/`, `/lab/`, `/privacy/`, `/terms/`, `/404.html` all checked. |
| H-02 | Route entry and browser Back focus the h1 and announce its text. | `route navigation and Back focus and announce the new h1`; ROUTES; HOME-M/DEMO-M; live `/` ↔ `/demo/`. |
| H-03 | Visible mobile links, buttons, and inputs remain at least 44 × 44 px. | `visible mobile links and buttons provide at least 44px targets`; ROUTES; HOME-M/DEMO-M/404-M; all live routes checked. |
| M-01 | Shared header/footer retain stable navigation, purpose line, legal links, source label, version, and Param Factory credit. | Six ROUTES checks plus 15-link live crawl; DEMO-M; live `/privacy/` and `/terms/` 200. |
| M-02 | README retains sample URL, isolation/reset behavior, build output, deployment root, deploy command, and live checks. | `@claim:demo-isolation`, `@claim:packaged-build`; CLAIMS; DEMO-M; live `/demo/` and ZIP 200. |
| N-01 | Decorative hero retains `alt=""`. | ROUTES Axe checks and `verify-url.sh` (`imgsMissingAlt: 0`); HOME-D; live `/` 200. |

## Review 1 — public claims

| Finding | Change retained and rechecked | Current evidence |
| --- | --- | --- |
| UC-01 | Export contains ordered actions, focus, page details, and nearby control snapshots. | `@claim:trace-export-content`; CLAIMS/LIVE-CLAIMS; DEMO-M; live `/demo/`. |
| UC-02 | Free, Chromium packaging, and no-account/upload facts remain separately registered. | `@claim:free-mit`, `@claim:chromium-package`, `@claim:local-no-upload`; CLAIMS; HOME-M; live `/`. |
| UC-03 | Visible and serialized events remain timestamp ordered. | `@claim:chronological-order`; CLAIMS/LIVE-CLAIMS; DEMO-M; live `/demo/`. |
| UC-04 | Shift+Tab escapes the dialog and Escape restores the opener. | `@claim:seeded-focus-defect`; clean and live ROUTES; DEMO-M; live `/lab/`. |
| UC-05 | Capture starts only after an explicit Start request. | `@claim:explicit-recording`; CLAIMS; DEMO-M; live `/`. |
| UC-06 | Toolbar badge, recorder bar, and both stop paths remain exercised. | `@claim:explicit-recording`; CLAIMS; HOME-M; live `/`. |
| UC-07 | Typed keys become Character while navigation keys remain identifiable. | `@claim:key-privacy`; CLAIMS; HOME-M; live `/privacy/`. |
| UC-08 | Structured data omits secrets and all optional JPEG captures paint every sensitive mask. | `@claim:sensitive-mask` plus concurrent capture regression; CLAIMS/full suites; DEMO-M; live `/privacy/`. |
| UC-09 | Screenshots remain off for a fresh recording. | `@claim:screenshot-boundary`; CLAIMS; HOME-M; live `/privacy/`. |
| UC-10 | Optional screenshots use visible-tab capture and stop at 12 with a named limit result. | `@claim:screenshot-boundary`; CLAIMS; HOME-M; live `/privacy/`. |
| UC-11 | Export includes timing, focus, role, name, state, page, and scope details. | `@claim:trace-export-content`; CLAIMS/LIVE-CLAIMS; DEMO-M; live `/demo/`. |
| UC-12 | Export opens with zero network requests and a visited site reloads offline. | `@claim:offline-export`, `@claim:offline-site`; CLAIMS/ROUTES/LIVE-CLAIMS; HOME-M; live `/`. |
| UC-13 | Trace uses extension storage and Clear removes it. | `@claim:local-no-upload`; CLAIMS; HOME-M; live `/privacy/`. |
| UC-14 | Demo/extension checks find no account, tracker, analytics, API, upload, or remote runtime call. | `@claim:local-no-upload`; CLAIMS; DEMO-M; live `/demo/` request check. |
| UC-15 | The UI/export label selected DOM context as a nearby control snapshot, not a platform tree. | `@claim:snapshot-scope`; CLAIMS/LIVE-CLAIMS; DEMO-M; live `/demo/`. |
| UC-16 | README outcomes remain covered by key, export, screenshot, and metadata tests. | `@claim:key-privacy`, `@claim:trace-export-content`, `@claim:screenshot-boundary`; CLAIMS; DEMO-M; live `/demo/`. |
| UC-17 | The external browser-platform assertion remains removed; only observed product scope is stated. | `@claim:snapshot-scope`; copy search; DEMO-M; live `/demo/`. |
| UC-18 | Built manifest contains exactly `activeTab`, `downloads`, `scripting`, and `storage`, with no hosts. | `@claim:manifest-permissions`; CLAIMS; HOME-M; live `/privacy/`. |
| UC-19 | The untested browser-internal-page promise remains absent from public copy. | Claims-registry test plus README/copy search; HOME-M; live `/`. |
| UC-20 | The thirteenth eligible capture produces an explicit 12-capture limit result. | `@claim:screenshot-boundary`; CLAIMS; HOME-M; live `/privacy/`. |
| UC-21 | Build creates the extension directory, versioned ZIP, deployable site, and public ZIP. | `@claim:packaged-build`; CLAIMS; HOME-M; live ZIP 200 and SHA-256 matches local. |
| UC-22 | Architecture-only promises remain outside public outcome copy. | Claims-registry test plus README search; HOME-M; live `/`. |
| UC-23 | Demo and export state the selected-DOM limitation. | `@claim:snapshot-scope`; CLAIMS/LIVE-CLAIMS; DEMO-M; live `/demo/`. |
| UC-24 | The untested cross-origin grant statement remains absent. | Claims-registry test plus README search; HOME-M; live `/`. |
| UC-25 | The untested Shadow DOM/iframe assertion remains absent. | Claims-registry test plus README search; HOME-M; live `/`. |
| UC-26 | Generated-art source/prompt and authored-mark provenance remain recorded. | `@claim:provenance`; CLAIMS; HOME-D; live `/`. |
| UC-27 | MIT/free/no-billing evidence remains registered. | `@claim:free-mit`; CLAIMS/LIVE-CLAIMS; HOME-M; live `/terms/`. |
| UC-28 | Public copy uses the observable action-to-focus pairing. | `@claim:chronological-order`; CLAIMS/LIVE-CLAIMS; HOME-D; live `/`. |
| UC-29 | Public copy names the local accessibility bug-report job without subjective marketing. | Copy-audit all-row test; HOME-M; live `/`. |
| UC-30 | The unverified Node minimum-version promise remains absent. | Copy-audit all-row test plus README search; HOME-M; live `/`. |

## Review 1 — copy

| Finding | Change retained and rechecked | Current evidence |
| --- | --- | --- |
| C-01 | Hero remains short, job-led, and within the sentence cap. | Copy-audit all-row test and first-screen ROUTES tests; HOME-M/HOME-D; live `/`. |
| C-02 | “Keyboard and focus evidence” remains in place of unexplained MV3 jargon. | Copy audit; HOME-M; live `/`. |
| C-03 | Section heading still names what changes after each key. | Copy audit; HOME-D; live `/`. |
| C-04 | Closing action remains “Share the trace.” | Copy audit; HOME-M; live `/`. |
| C-05 | File copy names timing, focus, role, name, state, and scope. | `@claim:trace-export-content`; DEMO-M; live `/demo/`. |
| C-06 | Closing steps name the focus bug, recording, and trace. | Copy audit; HOME-M; live `/`. |
| C-07 | Subjective attachment/actionability wording remains absent. | Copy-audit all-row test and copy search; HOME-M; live `/`. |
| C-08 | Copy retains the concrete local-extension bug-report sentence with corrected 13-word evidence. | Copy-audit all-row test; HOME-M; live `/`. |
| C-09 | ZIP actions name the extension result. | Mobile target test; HOME-M; live `/` and ZIP 200. |
| C-10 | README names its audience in short sentences. | Copy-audit all-row test; HOME-M; live `/`. |
| C-11 | README opening names recorded evidence and the HTML trace without subjective adjectives. | Copy audit and claims-registry test; DEMO-M; live `/demo/`. |
| C-12 | Lab describes a deliberately broken dialog and its Escape exit. | `@claim:seeded-focus-defect`; DEMO-M; live `/lab/`. |
| C-13 | README states user-visible storage and permission effects before API names. | `@claim:manifest-permissions`, `@claim:local-no-upload`; HOME-M; live `/privacy/`. |
| C-14 | “Nearby control snapshot” remains the single selected-DOM term. | `@claim:snapshot-scope`; DEMO-M; live `/demo/`. |
| C-15 | Recording, trace, and trace file remain distinct terms. | Copy-audit terminology table plus claim tests; DEMO-M; live `/demo/`. |
| C-16 | “Current trace” remains standardized. | Copy audit and README search; HOME-M; live `/privacy/`. |
| C-17 | Stop wording names the recorder bar. | `@claim:explicit-recording`; HOME-D; live `/`. |
| C-18 | Copy names keys, focus, page, and controls. | `@claim:trace-export-content`; HOME-D; live `/`. |
| C-19 | Screenshot wording remains literal and optional. | `@claim:screenshot-boundary`; HOME-M; live `/privacy/`. |
| C-20 | Manual installation wording remains plain. | Copy audit; HOME-M; live `/#install`. |
| C-21 | Character masking wording matches storage, export, and screenshot behavior. | `@claim:key-privacy`, `@claim:sensitive-mask`; CLAIMS; HOME-M; live `/privacy/`. |
| C-22 | Free and browser-storage facts remain concrete. | `@claim:free-mit`, `@claim:local-no-upload`; HOME-M; live `/`. |

## Final verification

- Clean repair commit: `e88e26c8aab4b31fe75ecde6cbae8757368c79ef` in `/tmp/a11y-polish-4-clean-9Uo4SY/repo`.
- Clean clone: `npm ci` found zero vulnerabilities; `npm test` passed 10/10; `npm run check` passed; `npm run build` produced the MV3 extension, 24.83 kB ZIP, and `dist/site`; `npm run test:a11y` passed 31/31.
- Claims: all 19 exact registry commands passed separately in the clean clone.
- Local Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.2 s, TBT 0 ms, CLS 0.
- Deployment: Azure Static Web Apps deployment `81a4d40f-21bc-4d6c-ae95-2d70f90ee383`; custom domain returned 200 after managed TLS check.
- Live: ROUTES 13/13; LIVE-CLAIMS 8/8; all 15 unique discovered links and hash targets passed; `/`, `/demo/`, `/lab/`, `/privacy/`, `/terms/`, and the ZIP returned 200; the cold unknown route returned 404.
- Live `verify-url.sh`: title, `lang=en`, one h1, main, alt, button-label, and console checks passed with no errors.
- Live Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.1 s, TBT 70 ms, CLS 0.
- Local and deployed ZIP SHA-256: `f44101682b7df28e3094a48b56cb370720a0337e96195eeae9d5a2981bd6e887`.

No review finding remains open.
