# Polish round 5 — zero-finding closure

Completed 2026-08-28. Review target: `53af30e402de1d313498864cdf0b7e290f01d38c`. Repair code: `1c3fc97`, `fbeb262`, `b4988a3`, and `2697ef6`. Deployment: `1de44946-68f3-48c7-bc21-d5a92e265e62` at <https://a11y-interaction-trace.sociobot.in>.

Every `review-1.md` through `review-5.md` and `polish-1.md` through `polish-4.md` was read and rechecked. No earlier closure label was accepted without a current test and live check.

## Evidence key

- **CLEAN** — fresh clone `/tmp/a11y-polish-5-clean-zFzl4ouL/repo` at `2697ef6`: `npm ci` found zero vulnerabilities; all 19 exact `.factory/claims.json` commands passed independently; `npm test` passed 11/11; `npm run check` passed; `npm run build` produced the extension, ZIP, and `dist/site`; `npm run test:a11y` passed 31/31.
- **ROUTES** — deployed `tests/e2e/site.spec.ts`: 13/13. This includes six route metadata/console/Axe checks, focus and Back, both first-screen viewports, 44 px targets, the keyboard lab, 404 configuration, five offline routes, cached module/CSS checks, and offline demo replay/reset.
- **LIVE-CLAIMS** — eight deployed demo/export/order/offline/scope/free claim checks: 8/8.
- **VERIFY** — live `verify-url.sh`: HTTP 200, correct title, `lang=en`, one h1, one main, zero missing alts, zero unnamed buttons, and no console errors.
- **LIGHTHOUSE** — local 100/100/100/100, LCP 1.2 s, TBT 0 ms, CLS 0; live 100/100/100/100, LCP 1.1 s, TBT 30 ms, CLS 0.
- **HOME-M** — `.factory/evidence-live-polish-5-home-mobile.png`, cold 390 × 844 <https://a11y-interaction-trace.sociobot.in/>.
- **HOME-D** — `.factory/evidence-live-polish-5-home-desktop.png`, cold 1440 × 900 <https://a11y-interaction-trace.sociobot.in/>.
- **DEMO-M** — `.factory/evidence-live-polish-5-demo-mobile.png`, cold <https://a11y-interaction-trace.sociobot.in/?demo=1> → `/demo/`.
- **404-M** — `.factory/evidence-live-polish-5-not-found-mobile.png`, cold HTTP 404 at <https://a11y-interaction-trace.sociobot.in/round-5-cold-missing-route>.
- **CRAWL** — 15/15 live document, hash, download, and labelled external-source links passed. `/`, `/demo/`, `/lab/`, `/privacy/`, `/terms/`, the ZIP, `robots.txt`, and `sitemap.xml` returned 200; the unknown path returned 404.

## Review 5

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-5-1 / UC-03 | Replaced the detached fixture assertion with a production-path comparison. The test reads action/time pairs from the rendered timeline, `demo:a11y-interaction-trace:state`, and downloaded `trace-data`, then requires all three to equal the expected event order. | Test `@claim:chronological-order`; CLEAN and LIVE-CLAIMS; DEMO-M; live `/demo/` 200. |
| F-5-2 / UC-12 | Expanded the offline test to fresh contexts for `/`, `/demo/`, `/lab/`, `/privacy/`, and `/terms/` after one visit and no preparatory online reload. It verifies each h1, required cached modules/CSS, no runtime or third-party failures, and offline demo replay/reset. A real `Vary` cache miss found during the full suite was fixed with `ignoreVary`; the duplicate inline fallback was removed and CSP returned to `script-src 'self'`. | Test `@claim:offline-site` plus `static deployment response policy › keeps executable site scripts external`; three repeated offline passes, CLEAN 31/31, ROUTES 13/13; HOME-M and DEMO-M; every named live route reloaded offline. |

## Reviews 2–4

| Finding | Change retained or rechecked | Evidence |
| --- | --- | --- |
| F-2-1 | The desktop heading stays within the 48–56 px design scale; job, audience, sample action, outcome, and facts fit both required first screens. | Tests `390px first screen…` and `1440px first screen…`; ROUTES; HOME-M/HOME-D; live `/` 200. |
| F-2-2 | Project name serializes as `input` / `textbox`; exported tag, role, name, and selector match the sample surface. | Test `@claim:snapshot-scope`; CLEAN/LIVE-CLAIMS; DEMO-M; live `/demo/` 200. |
| F-2-3 | “Nearby control snapshot” remains the single selected-DOM term in UI, docs, claims, and export. | Test `@claim:snapshot-scope`; CLEAN/LIVE-CLAIMS; DEMO-M; live `/demo/` 200. |
| F-2-4 | The untestable screen-recording comparison remains removed. | Test `copy audit › records the verified word count for every numeric audit row`; CLEAN; HOME-M; live `/` 200. |
| F-2-5 | The broad untested permission/page-policy claim remains removed. | Test `claims registry › has unique complete entries with one matching tagged browser test each`; CLEAN; HOME-M; live `/terms/` 200. |
| F-2-6 | Every numeric audit row is parsed and word-counted; the corrected 15- and 12-word rows remain accurate. | Test `copy audit › records the verified word count for every numeric audit row`; CLEAN 11/11; HOME-M; live `/` 200. |
| F-3-1 | Sensitive masks wait for two painted frames and stay present until capture settles; every sensitive rectangle in every stored JPEG and concurrent sessions is checked. | Tests `@claim:sensitive-mask` and `sensitive screenshot masks stay painted during concurrent capture sessions`; CLEAN 31/31; HOME-M; live `/privacy/` 200. |
| F-3-2 | Separate `demo-entry` and `demo-reset` claims prove the populated no-install path and byte-identical reset seed. | Tests `@claim:demo-entry` and `@claim:demo-reset`; CLEAN/LIVE-CLAIMS; DEMO-M; live `/?demo=1`. |
| F-4-1 | Counts 12, 13, 11, and 12 remain corrected, and all 34 numeric rows remain covered. | Test `copy audit › records the verified word count for every numeric audit row`; CLEAN; HOME-M/HOME-D; live `/` 200. |

## Review 1 — structure and discovery

| Finding | Change retained or rechecked | Evidence |
| --- | --- | --- |
| B-01 | The first screen names the job, audience, sample action, outcome, and three facts; phone layout keeps copy before art. | First-screen tests in ROUTES; HOME-M/HOME-D; live `/` 200. |
| B-02 | `?demo=1` and the primary action open a seeded, isolated demo with banner, Reset demo, and Start for real. | Tests `@claim:demo-isolation`, `@claim:demo-entry`, `@claim:demo-reset`; CLEAN/LIVE-CLAIMS; DEMO-M; live demo 200. |
| B-03 | `.factory/claims.json` has 19 unique complete entries and exactly one matching tagged test per ID. | Test `claims registry › has unique complete entries with one matching tagged browser test each`; CLEAN 19/19; DEMO-M; live `/demo/` 200. |
| B-04 | Unknown paths use the designed concrete-and-moss 404 with a real 404 response. | Test `static host maps unknown paths to the designed 404 response`; ROUTES; 404-M; live unknown path 404. |
| H-01 | Route titles, descriptions, canonicals where indexable, OG/Twitter metadata, favicon, touch icon, and theme color remain complete. | Six `has semantic structure and no serious axe findings` tests; ROUTES/VERIFY; HOME-M, DEMO-M, 404-M; all six live routes checked. |
| H-02 | Direct entry, link navigation, and Back focus and announce each h1. | Test `route navigation and Back focus and announce the new h1`; ROUTES; HOME-M/DEMO-M; live `/` ↔ `/demo/`. |
| H-03 | Visible mobile links, buttons, and inputs stay at least 44 × 44 px. | Test `visible mobile links and buttons provide at least 44px targets`; ROUTES; HOME-M/DEMO-M/404-M; all live routes checked. |
| M-01 | Every route shares stable navigation and a footer with purpose, legal links, source label, version, and Param Factory credit. | Six route structure tests and CRAWL; DEMO-M; live `/privacy/` and `/terms/` 200. |
| M-02 | README retains the sample URL, namespace/reset rules, build output, deployment root/command, and live checks. | Tests `@claim:demo-isolation` and `@claim:packaged-build`; CLEAN; DEMO-M; live demo and ZIP 200. |
| N-01 | Decorative hero art retains `alt=""`. | Route Axe tests and VERIFY; HOME-D; live `/` 200. |

## Review 1 — claims

| Finding | Change retained or rechecked | Evidence |
| --- | --- | --- |
| UC-01 | Production sample export contains actions, focus, page details, and nearby control snapshots. | Test `@claim:trace-export-content`; CLEAN/LIVE-CLAIMS; DEMO-M; live `/demo/`. |
| UC-02 | Free, Chromium packaging, and no-account/upload facts remain separately registered. | Tests `@claim:free-mit`, `@claim:chromium-package`, `@claim:local-no-upload`; CLEAN; HOME-M; live `/`. |
| UC-03 | Production visible, stored, and downloaded event action/time pairs must match. | Test `@claim:chronological-order`; CLEAN/LIVE-CLAIMS; DEMO-M; live `/demo/`. |
| UC-04 | Shift+Tab escapes the sample dialog and Escape restores its opener. | Test `@claim:seeded-focus-defect`; CLEAN/ROUTES; DEMO-M; live `/lab/`. |
| UC-05 | Recorder injection and trace capture begin only after Start. | Test `@claim:explicit-recording`; CLEAN; HOME-M; live `/`. |
| UC-06 | Toolbar badge, recorder bar, and both Stop paths remain exercised. | Test `@claim:explicit-recording`; CLEAN; HOME-M; live `/`. |
| UC-07 | Typed keys become Character while navigation keys remain identifiable in storage and export. | Test `@claim:key-privacy`; CLEAN; HOME-M; live `/privacy/`. |
| UC-08 | Structured traces exclude secrets and every tested JPEG masks password, card, one-time-code, and author-marked fields. | Test `@claim:sensitive-mask` plus concurrent masking test; CLEAN; HOME-M; live `/privacy/`. |
| UC-09 | Screenshots remain off in a fresh recording. | Test `@claim:screenshot-boundary`; CLEAN; HOME-M; live `/privacy/`. |
| UC-10 | Optional capture uses the visible tab and caps at 12 with a named limit result. | Test `@claim:screenshot-boundary`; CLEAN; HOME-M; live `/privacy/`. |
| UC-11 | Export includes timing, focus, role, name, state, page, and scope details. | Test `@claim:trace-export-content`; CLEAN/LIVE-CLAIMS; DEMO-M; live `/demo/`. |
| UC-12 | Export opens with zero requests; all five visited site routes and the interactive demo now reload offline. | Tests `@claim:offline-export` and `@claim:offline-site`; CLEAN/ROUTES/LIVE-CLAIMS; HOME-M/DEMO-M; all five live routes checked offline. |
| UC-13 | Trace data uses extension storage and Clear removes it. | Test `@claim:local-no-upload`; CLEAN; HOME-M; live `/privacy/`. |
| UC-14 | Demo and extension flows have no account, tracker, analytics, API, upload, or third-party runtime call. | Test `@claim:local-no-upload` and same-origin assertions in `@claim:offline-site`; CLEAN/ROUTES; DEMO-M; live demo flow. |
| UC-15 | UI/export identify selected DOM context as a nearby control snapshot, not a platform tree. | Test `@claim:snapshot-scope`; CLEAN/LIVE-CLAIMS; DEMO-M; live `/demo/`. |
| UC-16 | README record/export outcomes map to key, export, screenshot, and metadata tests. | Tests `@claim:key-privacy`, `@claim:trace-export-content`, `@claim:screenshot-boundary`; CLEAN; DEMO-M; live `/demo/`. |
| UC-17 | The external browser-platform assertion stays removed; copy states only observed product scope. | Test `@claim:snapshot-scope`; CLEAN; DEMO-M; live `/demo/`. |
| UC-18 | Built manifest has exactly `activeTab`, `downloads`, `scripting`, and `storage`, with no host permissions. | Test `@claim:manifest-permissions`; CLEAN; HOME-M; live `/privacy/`. |
| UC-19 | The untested browser-internal-page marketing promise remains absent. | Claims-registry and copy-audit tests; CLEAN; HOME-M; live `/`. |
| UC-20 | The thirteenth eligible screenshot produces the explicit 12-capture limit result. | Test `@claim:screenshot-boundary`; CLEAN; HOME-M; live `/privacy/`. |
| UC-21 | Build creates the unpacked extension, versioned ZIP, deployable site, and public ZIP. | Test `@claim:packaged-build`; CLEAN; HOME-M; live ZIP 200 with matching SHA-256. |
| UC-22 | Architecture-only marketing promises remain outside public copy. | Claims-registry and copy-audit tests; CLEAN; HOME-M; live `/`. |
| UC-23 | Demo and export retain the selected-DOM limitation. | Test `@claim:snapshot-scope`; CLEAN/LIVE-CLAIMS; DEMO-M; live `/demo/`. |
| UC-24 | The untested cross-origin grant assertion remains absent. | Claims-registry and copy-audit tests; CLEAN; HOME-M; live `/`. |
| UC-25 | The untested Shadow DOM/iframe assertion remains absent. | Claims-registry and copy-audit tests; CLEAN; HOME-M; live `/`. |
| UC-26 | Generated-art source/prompt and authored-mark provenance remain documented. | Test `@claim:provenance`; CLEAN; HOME-D; live `/`. |
| UC-27 | MIT, free, and no-billing evidence remains registered. | Test `@claim:free-mit`; CLEAN/LIVE-CLAIMS; HOME-M; live `/terms/`. |
| UC-28 | Public copy makes the observable action-to-focus statement. | Test `@claim:chronological-order`; CLEAN/LIVE-CLAIMS; HOME-D; live `/`. |
| UC-29 | Public copy names the local accessibility bug-report job without subjective wording. | Copy-audit all-row test; CLEAN; HOME-M; live `/`. |
| UC-30 | The unverified Node minimum-version promise remains absent. | Copy-audit all-row test; CLEAN; HOME-M; live `/`. |

## Review 1 — copy

| Finding | Change retained or rechecked | Evidence |
| --- | --- | --- |
| C-01 | Hero copy remains short, job-led, and below the sentence limit. | Copy-audit all-row and first-screen tests; CLEAN/ROUTES; HOME-M/HOME-D; live `/`. |
| C-02 | “Keyboard and focus evidence” remains in place of unexplained MV3 jargon. | Copy-audit test; HOME-M; live `/`. |
| C-03 | The section heading says what changes after each key. | Copy-audit test; HOME-D; live `/`. |
| C-04 | The close remains “Share the trace.” | Copy-audit test; HOME-M; live `/`. |
| C-05 | File copy names timing, focus, role, name, state, and scope. | Test `@claim:trace-export-content`; DEMO-M; live `/demo/`. |
| C-06 | Closing steps name the focus bug, recording, and trace. | Copy-audit test; HOME-M; live `/`. |
| C-07 | Subjective attachment/actionability wording remains absent. | Copy-audit test; HOME-M; live `/`. |
| C-08 | Copy keeps the concrete local-extension bug-report sentence. | Copy-audit all-row test; HOME-M; live `/`. |
| C-09 | ZIP actions name the extension result. | Mobile target test; HOME-M; live `/` and ZIP 200. |
| C-10 | README names its audience in short sentences. | Copy-audit all-row test; HOME-M; live repository README. |
| C-11 | README opening names recorded evidence and the HTML trace without subjective adjectives. | Copy-audit and claims-registry tests; DEMO-M; live `/demo/`. |
| C-12 | Lab wording names the deliberately broken dialog and Escape exit. | Test `@claim:seeded-focus-defect`; DEMO-M; live `/lab/`. |
| C-13 | README states user-visible storage and permission effects before API names. | Tests `@claim:manifest-permissions` and `@claim:local-no-upload`; HOME-M; live `/privacy/`. |
| C-14 | “Nearby control snapshot” remains the only selected-DOM term. | Test `@claim:snapshot-scope`; DEMO-M; live `/demo/`. |
| C-15 | Recording, trace, and trace file retain separate meanings. | Copy-audit terminology table and claim tests; DEMO-M; live `/demo/`. |
| C-16 | “Current trace” remains standardized. | Copy-audit test; HOME-M; live `/privacy/`. |
| C-17 | Stop wording names the recorder bar. | Test `@claim:explicit-recording`; HOME-D; live `/`. |
| C-18 | Copy names keys, focus, page, and controls. | Test `@claim:trace-export-content`; HOME-D; live `/`. |
| C-19 | Screenshot wording stays literal and optional. | Test `@claim:screenshot-boundary`; HOME-M; live `/privacy/`. |
| C-20 | Manual installation wording remains plain. | Copy-audit test; HOME-M; live `/#install`. |
| C-21 | Character/sensitive-value wording matches storage, export, and screenshot behavior. | Tests `@claim:key-privacy` and `@claim:sensitive-mask`; CLEAN; HOME-M; live `/privacy/`. |
| C-22 | Free and browser-storage facts remain concrete. | Tests `@claim:free-mit` and `@claim:local-no-upload`; HOME-M; live `/`. |

## Additional current-round quality repair

The home trace legend used an `aside` inside another complementary region, which created a nested landmark. It is now a neutral `div`. Six deployed Axe scans report no serious or critical findings. The offline repair also removed the emergency inline demo duplicate; the one TypeScript implementation now powers online and offline replay/reset under a self-only CSP.

## Final result

No blocking, high, medium, or minor finding remains. The original WXT + TypeScript MV3 extension and static deployment class are unchanged. The concrete-and-moss visual system is preserved. The live ZIP is byte-identical to the local build: `f44101682b7df28e3094a48b56cb370720a0337e96195eeae9d5a2981bd6e887`.
