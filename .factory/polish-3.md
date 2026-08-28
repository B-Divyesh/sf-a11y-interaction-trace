# Polish round 3 — complete closure

Repair implementation: `2d0019bb523941ecfa5d5ac426554cdc42a71314`.
Reviewed records: `review-1.md`, `review-2.md`, `review-3.md`, `polish-1.md`, and `polish-2.md`.

All evidence below is current rather than inherited from a prior polish. “Live” means the deployed production URL was cold-opened on 2026-08-28.

- Clean clone: `/tmp/a11y-polish-3-clean-wKkDIC/repo`; `npm ci`, `npm test` (10), `npm run check`, and `npm run build` passed. Every 19 `claims.json` command passed separately; its full browser suite passed 31/31.
- Local stability: `npm run test:a11y` passed 31/31 three consecutive times. The sensitive-mask claim covers every sensitive rectangle in every stored capture, and a concurrent-capture regression also passes.
- Live: route/axe/focus/mobile/offline suite passed 13/13; live demo/export/privacy subset passed 8/8; `/`, `/demo/`, `/lab/`, `/privacy/`, `/terms/`, and the ZIP return 200, while `/definitely-not-a-route` returns 404. See `evidence-live-polish-3-*.png`, `verify-live-polish-3/verify.json`, and `lighthouse-polish-3.json`.

## Review 3

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-3-1 / UC-08 | Replaced the fixed 40 ms screenshot delay with an injected recorder acknowledgement after two animation frames. The mask remains until capture settles. Expanded the claim to inspect all four fields in all stored JPEGs and added concurrent-capture coverage. | `@claim:sensitive-mask`; `sensitive screenshot masks stay painted during concurrent capture sessions`; three local 31/31 runs; clean-clone 31/31; live privacy suite. |
| F-3-2 | Added separately registered `demo-entry` and `demo-reset` claims. The first clicks the landing action in a regular browser and proves the populated no-install sample; the second compares the complete restored seed byte-for-byte. Updated README, demo docs, audit, and registry. | `@claim:demo-entry`; `@claim:demo-reset`; `evidence-live-polish-3-demo-mobile.png`; live `/` → `/demo/`. |

## Review 2

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 / B-01 | Kept the 48–56 px desktop heading, readable copy column, and first-screen bounds regressions. | `1440px first screen identifies…`; `evidence-polish-3-home-desktop.png`; live `/`. |
| F-2-2 | Demo serializes Project name as `input` / `textbox` and export checks every tag, role, name, and selector. | `@claim:snapshot-scope`; live `/demo/`. |
| F-2-3 / C-14 / UC-15 | Uses “nearby control snapshot(s)” consistently in UI, docs, export, and claims. | `@claim:snapshot-scope`; copy audit; live `/demo/`. |
| F-2-4 | Removed the untestable screen-recording comparison. | copy audit; README review; clean clone. |
| F-2-5 | Removed the untested broad permission/page-policy limitation. | README/Terms review; claims registry; clean clone. |
| F-2-6 | Keeps generated/count-regressed 15- and 12-word corrections. | `tests/copy-audit.test.ts`; `npm test` 10/10. |

## Review 1: structure and discovery

| Finding | Change made | Evidence |
| --- | --- | --- |
| B-01 | First screen names the job, audience, sample action, outcome, and three facts; mobile keeps copy before art. | first-screen tests; `evidence-live-polish-3-home-mobile.png`; live `/`. |
| B-02 | Direct `?demo=1` / `/demo/` uses a seeded four-event sample, banner, reset, real exit, and demo-only namespace. | `@claim:demo-entry`, `@claim:demo-reset`, `@claim:demo-isolation`; demo screenshot; live `/demo/`. |
| B-03 | `claims.json` now has 19 unique one-to-one tagged claim tests, all clean-clone runnable. | registry test; clean-clone 19/19 commands. |
| B-04 | Styled concrete-and-moss 404 and Static Web Apps 404 override stay deployed. | static config test; `evidence-live-polish-3-not-found-mobile.png`; live unknown URL 404. |
| H-01 | Each route has scoped title/description/canonical/social metadata, icons, and theme color. | six-route live axe/metadata suite; live `/`, `/demo/`, `/privacy/`, `/terms/`, `/lab/`. |
| H-02 | Route entry and Back focus the h1 and announce it politely. | `route navigation and Back focus…`; live suite. |
| H-03 | All visible mobile targets retain 44 px minimums. | `visible mobile links and buttons…`; live suite and mobile screenshots. |
| M-01 | Shared header/footer retain wordmark, nav, legal links, version, source label, and Param Factory credit. | six-route live suite; live `/privacy/`, `/terms/`. |
| M-02 | README documents demo, reset/isolation, build, deployment output, and live checks. | README; `@claim:demo-isolation`; clean clone. |
| N-01 | Decorative hero remains `alt=""`. | route Axe suite; `verify-live-polish-3/verify.json`; live `/`. |

## Review 1: claims

| Finding | Change made | Evidence |
| --- | --- | --- |
| UC-01 | Sample export proves ordered actions, focus, page detail, and nearby control snapshots. | `@claim:trace-export-content`; live `/demo/`. |
| UC-02 | Free, Chromium package, and no account/upload statements are separately registered. | `@claim:free-mit`, `@claim:chromium-package`, `@claim:local-no-upload`; live `/`. |
| UC-03 | Timeline and serialized timestamps are asserted in order. | `@claim:chronological-order`; live `/demo/`. |
| UC-04 | Deliberate Shift+Tab escape and Escape recovery stay keyboard reproducible. | `@claim:seeded-focus-defect`; live `/lab/`. |
| UC-05 | Capture begins only after Start. | `@claim:explicit-recording`; clean extension harness. |
| UC-06 | Toolbar badge, recorder bar, and both stop controls are exercised. | `@claim:explicit-recording`; clean extension harness. |
| UC-07 | Printable keys become Character while navigation keys stay identifiable. | `@claim:key-privacy`; clean extension harness. |
| UC-08 | Sensitive values are excluded from structured data and every JPEG capture after deterministic paint acknowledgement. | `@claim:sensitive-mask`; repeated full suite; clean clone. |
| UC-09 | Screenshots default off. | `@claim:screenshot-boundary`; clean extension harness. |
| UC-10 | Capture is visible-tab-only and stops at 12 images. | `@claim:screenshot-boundary`; clean extension harness. |
| UC-11 | Export includes timing, focus, role, name, state, and scope note. | `@claim:trace-export-content`; live `/demo/`. |
| UC-12 | Export and visited site load offline. | `@claim:offline-export`, `@claim:offline-site`; live suite. |
| UC-13 | Trace uses browser extension storage and Clear removes it. | `@claim:local-no-upload`; clean extension harness. |
| UC-14 | No account, tracker, analytics, API, or upload path is present. | `@claim:local-no-upload`; live demo request check. |
| UC-15 | Scope is consistently labeled as a nearby control snapshot and limited to selected DOM details. | `@claim:snapshot-scope`; live `/demo/`. |
| UC-16 | README outcomes map to keyboard, focus, snapshots, metadata, and opt-in screenshot claims. | `key-privacy`, `trace-export-content`, `screenshot-boundary`; clean clone. |
| UC-17 | External browser-platform assertion remains removed. | copy audit; README review. |
| UC-18 | Built manifest checks the exact four permissions and no hosts. | `@claim:manifest-permissions`; clean build. |
| UC-19 | Untested browser-internal-page promise remains absent from public copy. | README/copy audit review. |
| UC-20 | Twelfth-capture limit is asserted with a named skipped result. | `@claim:screenshot-boundary`; clean extension harness. |
| UC-21 | Build proves extension, ZIP, site, and staged public download. | `@claim:packaged-build`; clean build. |
| UC-22 | Architecture-only promises remain removed from public copy. | README review; claims registry. |
| UC-23 | Demo/export state the selected-DOM scope limitation. | `@claim:snapshot-scope`; live `/demo/`. |
| UC-24 | Untested cross-origin grant assertion remains removed. | README/copy audit review. |
| UC-25 | Untested Shadow DOM/iframe assertion remains removed. | README/copy audit review. |
| UC-26 | Generated-art and authored-mark provenance remain documented and tested. | `@claim:provenance`; `design.md`. |
| UC-27 | MIT/free/no-billing facts remain tested. | `@claim:free-mit`; live `/`. |
| UC-28 | Copy makes the observable action-to-focus comparison. | `@claim:chronological-order`; live `/`. |
| UC-29 | Copy names the concrete local-extension bug-report job. | copy audit; live `/`. |
| UC-30 | Untested Node-version promise remains removed. | README review; clean clone. |

## Review 1: copy

| Finding | Change made | Evidence |
| --- | --- | --- |
| C-01 | Hero is short and job-led. | first-screen tests; home screenshots; live `/`. |
| C-02 | “Keyboard and focus evidence” replaces unexplained MV3. | copy audit; live `/`. |
| C-03 | Section heading names what changes after each key. | copy audit; live `/`. |
| C-04 | Closing action says “Share the trace.” | copy audit; live `/`. |
| C-05 | Export copy names timing, focus, role, name, state, and scope. | `@claim:trace-export-content`; live `/`. |
| C-06 | Closing sequence names focus bug, recording, and trace. | copy audit; live `/`. |
| C-07 | Subjective size/actionability copy remains removed. | copy audit; live `/`. |
| C-08 | Concrete local-extension bug-report wording remains. | copy audit; live `/`. |
| C-09 | ZIP actions name the result. | mobile target test; live `/`. |
| C-10 | README names audience in short sentences. | README review; copy audit. |
| C-11 | README opening names concrete recorded evidence. | README review; copy audit. |
| C-12 | Lab describes a deliberate broken dialog and Escape exit. | `@claim:seeded-focus-defect`; live `/lab/`. |
| C-13 | README states user-visible storage/permission effects before APIs. | README review; clean clone. |
| C-14 | One term, “nearby control snapshot,” is used everywhere. | `@claim:snapshot-scope`; live `/demo/`. |
| C-15 | Recording, trace, and trace file terminology stay distinct. | copy audit; README review. |
| C-16 | “Current trace” remains standardized. | README review. |
| C-17 | Stop wording names the recorder bar. | `@claim:explicit-recording`; live `/`. |
| C-18 | Copy names keys, focus, page, and controls. | copy audit; live `/`. |
| C-19 | Screenshot wording is literal and optional. | `@claim:screenshot-boundary`; live `/`. |
| C-20 | Manual-install wording is plain. | copy audit; live `/`. |
| C-21 | Character masking words match behavior, including screenshot privacy. | `@claim:key-privacy`, `@claim:sensitive-mask`; clean clone. |
| C-22 | Free and browser-storage facts stay concrete. | `@claim:free-mit`, `@claim:local-no-upload`; live `/`. |

No listed finding remains open.
