# Adversarial first-read review 5 — A11y Interaction Trace

**Verdict: FAIL**

Reviewed 2026-08-28 against <https://a11y-interaction-trace.sociobot.in> and a fresh clone of commit `53af30e402de1d313498864cdf0b7e290f01d38c`.

The product is clear, tryable, visually distinct, and functionally sound in the flows exercised. All 19 registered commands pass. The review still fails because two named claim tests do not assert the full claims they are assigned to. These are reopened historical claim-coverage findings, so they are blocking under the work order.

## Findings, ordered by severity

### BLOCKING F-5-1 / UC-03 — The chronological-order test never inspects the demo's stored or downloaded trace

**Exact location:** `.factory/claims.json`, `chronological-order`; and `tests/e2e/claims.spec.ts:75–81`.

**Public quote:** “Events stay in the order they happened.”

**Registry promise:** “fresh seeded demo; compare visible and serialized event order and timestamps.”

**Observed test:** The test checks the four static headings and timestamps in the page, then checks `sample.events.map(event => event.at)` on a separate constant declared inside the test file. It does not read `demo:a11y-interaction-trace:state`, click **Download sample trace**, parse the downloaded `trace-data`, or compare either production serialization path with the visible order. The command passes even if `sampleSession()` or the export path serializes actions or timestamps in the wrong order.

**Why a visitor can be misled:** Event order is the core handoff claim. A green claim test that is disconnected from the production stored/exported trace cannot prove the promise a reviewer relies on.

**Concrete fix:** In the one `@claim:chronological-order` test, enter `/demo/`, read the production demo key, download the production sample trace, parse its `trace-data`, and compare the complete action/timestamp pairs from the visible timeline, stored trace, and downloaded trace. Remove the independent `sample` constant from this assertion. A deliberate reversal in either production serialization path must fail the test.

### BLOCKING F-5-2 / UC-12 — The plural offline-pages claim is tested only on the landing page after an extra online reload

**Exact location:** `.factory/claims.json`, `offline-site`; and `tests/e2e/site.spec.ts:107–114`.

**Public quote:** Offline status on `/`: “The cached pages still work.”

**Registry claim:** “Visited site pages remain available offline.”

**Observed test:** The named test opens `/`, waits for the service worker, reloads `/` online, then goes offline and reloads `/` again. It never checks `/demo/`, `/lab/`, `/privacy/`, or `/terms/`; it also does not prove the required demo remains operable offline. The registered sandbox description itself narrows the plural claim to “reload landing.”

**Current live behavior:** A manual fresh-context check did successfully reload all five routes offline. The offline demo also replayed and reset its sample. That confirms the current deployment, but the assigned claim test would not catch a route-specific or demo-script caching regression.

**Why a visitor can be misled:** “Pages” promises more than the one landing document in the test. The sample is the product's try-before-install path, so a passing offline test must fail when that sample becomes unavailable or inert.

**Concrete fix:** Parameterize `@claim:offline-site` over `/`, `/demo/`, `/lab/`, `/privacy/`, and `/terms/` in fresh contexts. Visit each route once, wait for service-worker control, go offline without a preparatory online reload, reload the route, and assert its h1. On `/demo/`, also replay and reset the sample and verify the demo key changes and returns to its original value. Keep the network interception and assert no third-party request.

## Cold first read

Fresh Chromium contexts were opened before scrolling.

| Viewport | What it does | For whom | What to click first | Result |
| --- | --- | --- | --- | --- |
| 390 × 844 | Records keyboard-focus failures as evidence for a team. | Web developers and accessibility testers. | **Try it with sample data.** | Pass. The headline, audience, action, outcome, and three facts end at `y=699.4`; no horizontal overflow. |
| 1440 × 900 | Records keyboard-focus failures as evidence for a team. | Web developers and accessibility testers. | **Try it with sample data.** | Pass. The same required content ends at `y=712.6`. |

The exact first-screen text that answers the three questions is “Record keyboard focus failures for your team.”, “For web developers and accessibility testers who need reproducible keyboard evidence without uploading a recording.”, and “Try it with sample data.” No console error occurred.

## Copy audit

Counts are whitespace-delimited; hyphenated and quoted terms count as one word. No sentence exceeds 22 words. No banned marketing word, inconsistent core term, unclear heading, or generic resultless product action was found.

### Landing-page sentences

| ID | Words | Sentence |
| --- | ---: | --- |
| L-01 | 2 | You’re offline. |
| L-02 | 5 | The cached pages still work. |
| L-03 | 5 | Downloads may need a connection. |
| L-04 | 7 | Record keyboard focus failures for your team. |
| L-05 | 15 | For web developers and accessibility testers who need reproducible keyboard evidence without uploading a recording. |
| L-06 | 7 | Opens a seeded dialog and sample trace. |
| L-07 | 7 | Nothing is saved to your real data. |
| L-08 | 1 | Free. |
| L-09 | 4 | Packaged for Chromium browsers. |
| L-10 | 6 | Stores traces only in your browser. |
| L-11 | 11 | This trace pairs each keyboard action with its next focus target. |
| L-12 | 7 | Events stay in the order they happened. |
| L-13 | 10 | Three keyboard actions show when focus moves behind the dialog. |
| L-14 | 6 | Recording starts when you select Start. |
| L-15 | 11 | The toolbar badge and recorder bar show when capture is active. |
| L-16 | 4 | Printable keys become “Character.” |
| L-17 | 8 | Sensitive field values do not enter the trace. |
| L-18 | 3 | Screenshots start off. |
| L-19 | 8 | When enabled, capture uses the visible tested tab. |
| L-20 | 12 | The exported file includes timing, focus, role, name, state, and scope notes. |
| L-21 | 8 | The extension stores traces in browser extension storage. |
| L-22 | 10 | The extension has no account, analytics, tracker, or upload service. |
| L-23 | 8 | Exported trace files open without a network connection. |
| L-24 | 12 | Nearby control snapshots are selected DOM details, not an operating-system accessibility tree. |
| L-25 | 5 | Download and unzip the extension. |
| L-26 | 9 | Open your browser’s Extensions page and enable Developer mode. |
| L-27 | 12 | Choose “Load unpacked,” select the extracted folder, then pin the moss-path icon. |
| L-28 | 4 | Reproduce the focus bug. |
| L-29 | 2 | Record it. |
| L-30 | 3 | Share the trace. |
| L-31 | 13 | Use one local extension to capture an accessibility failure for a bug report. |
| L-32 | 11 | Record keyboard actions and focus changes for an accessibility bug report. |
| L-33 | 7 | The hero artwork is original generated imagery. |
| L-34 | 9 | Interface marks and diagrams are hand-authored for this product. |

Headings and fragments were checked separately. “Keyboard and focus evidence,” “Record what changed after each key,” “Focus leaves a dialog,” “Record only when you choose,” “Typed words stay private,” “Screenshots are optional,” “Open the trace file offline,” “Keep the trace on your machine,” and “Install the extension ZIP” make sense out of context. Product actions name their result: **Try it with sample data**, **Download extension ZIP**, **Open the sample trace**, and **Download A11y Interaction Trace v1**.

### README sentences

| ID | Words | Sentence |
| --- | ---: | --- |
| R-01 | 14 | This Chromium extension records keyboard actions, focus changes, nearby control snapshots, and optional screenshots. |
| R-02 | 6 | It exports one HTML trace file. |
| R-03 | 10 | For web developers, accessibility testers, QA engineers, and issue triagers. |
| R-04 | 12 | Use it to record keys and focus changes in a bug report. |
| R-05 | 5 | Open the sample link once. |
| R-06 | 12 | It shows a checkout dialog and four ordered events without an install. |
| R-07 | 5 | The banner identifies demo mode. |
| R-08 | 7 | Reset demo restores the original four-event sample. |
| R-09 | 7 | Start for real removes all demo data. |
| R-10 | 8 | Demo data uses local-storage keys beginning with `demo:a11y-interaction-trace:`. |
| R-11 | 9 | The demo never reads or changes other storage keys. |
| R-12 | 9 | See `.factory/demo.md` for the exact seed and isolation checks. |
| R-13 | 10 | The snapshot is not the browser or operating-system accessibility tree. |
| R-14 | 16 | Run `npm ci && npm run build`, or download the extension ZIP from the live site. |
| R-15 | 2 | Unzip `dist/site/downloads/a11y-interaction-trace.zip`. |
| R-16 | 6 | Open your Chromium browser’s Extensions page. |
| R-17 | 7 | Enable Developer mode and choose Load unpacked. |
| R-18 | 8 | Select the extracted directory and pin the extension. |
| R-19 | 5 | Open the page under test. |
| R-20 | 14 | The included `/lab/` page has a deliberately broken dialog with an Escape key exit. |
| R-21 | 3 | Open the extension. |
| R-22 | 10 | Screenshots are off until you enable them for that recording. |
| R-23 | 12 | Select Start on this tab, then reproduce the issue with the keyboard. |
| R-24 | 9 | Stop from the recorder bar or the extension popup. |
| R-25 | 12 | Select Export trace file, then attach the HTML file to the issue. |
| R-26 | 6 | Select Clear local trace when finished. |
| R-27 | 9 | The current trace stays in browser extension storage (`chrome.storage.local`). |
| R-28 | 11 | The extension has no account, analytics, tracker, API, or upload service. |
| R-29 | 5 | Its manifest requests four permissions. |
| R-30 | 11 | `activeTab` and `scripting` run the recorder in the tab you choose. |
| R-31 | 8 | `storage` keeps the current trace in the browser. |
| R-32 | 5 | `downloads` saves the trace file. |
| R-33 | 6 | The manifest has no host permissions. |
| R-34 | 10 | Sensitive field values are excluded before optional screenshots are captured. |
| R-35 | 7 | The commands below use Node.js and npm. |
| R-36 | 14 | The production build creates the unpacked extension, packaged ZIP, deployable site, and public download. |
| R-37 | 5 | Claim `packaged-build` verifies every artifact. |
| R-38 | 6 | The static deployment root is `dist/site`. |
| R-39 | 12 | Build it with `npm ci && npm test && npm run build:site`. |
| R-40 | 9 | The factory deploys that directory with `/opt/fleet/lib/deploy-static.sh a11y-interaction-trace dist/site`. |
| R-41 | 6 | Infrastructure changes happen outside this repository. |
| R-42 | 12 | After deployment, check `/`, `/demo/`, `/lab/`, `/privacy/`, `/terms/`, and an unknown path. |
| R-43 | 9 | The unknown path must return the styled 404 response. |
| R-44 | 7 | Version 1 is packaged for Chromium browsers. |
| R-45 | 7 | Nearby control snapshots contain selected DOM details. |
| R-46 | 7 | Review each trace file before sharing it. |
| R-47 | 6 | The source uses the MIT License. |
| R-48 | 11 | Generated hero provenance and the visual system are documented in `.factory/design.md`. |

README headings identify their sections. The installation labels are browser terms appropriate for the named developer/tester audience. The product's own controls use result-naming verbs. No copy finding remains.

## Demo, sandbox, privacy, and offline behavior

- The first-screen action entered `/demo/` in one click and immediately showed a checkout dialog plus Recording started, Enter, Shift + Tab, and Escape.
- The persistent banner says “Demo — sample data, nothing is saved,” states that real traces are never read or changed, and exposes **Reset demo** and **Start for real**.
- `real:sentinel=immutable` and `traceSession=real-trace` remained byte-for-byte unchanged through replay, reset, and exit. Only `demo:a11y-interaction-trace:state` changed; exit removed it.
- Live interception observed only `https://a11y-interaction-trace.sociobot.in`. No console error occurred.
- Manual offline checks reloaded `/`, `/demo/`, `/lab/`, `/privacy/`, and `/terms/`. The offline demo replayed and reset its seed. F-5-2 concerns the narrower permanent claim test, not a current live failure.

## Claims verification

Fresh clone: `/tmp/a11y-review5-OLiRRO/repo` at the reviewed commit. Every exact command from `.factory/claims.json` was run independently after `npm ci`.

| Claim | Command result | Coverage result |
| --- | --- | --- |
| demo-isolation | Pass | Pass |
| demo-entry | Pass | Pass |
| demo-reset | Pass | Pass |
| trace-export-content | Pass | Pass |
| chronological-order | Pass | **Insufficient — F-5-1 / UC-03** |
| seeded-focus-defect | Pass | Pass |
| explicit-recording | Pass | Pass |
| key-privacy | Pass | Pass |
| sensitive-mask | Pass | Pass |
| screenshot-boundary | Pass | Pass |
| offline-export | Pass | Pass |
| offline-site | Pass | **Insufficient — F-5-2 / UC-12** |
| local-no-upload | Pass | Pass |
| snapshot-scope | Pass | Pass |
| manifest-permissions | Pass | Pass |
| chromium-package | Pass | Pass |
| packaged-build | Pass | Pass |
| free-mit | Pass | Pass |
| provenance | Pass | Pass |

No claim-like landing or README sentence lacks a registry entry. The two findings concern whether the assigned tests prove their listed claims, not missing IDs or failed commands.

## Structure, accessibility, and visual identity

- `/`, `/demo/`, `/lab/`, `/privacy/`, `/terms/`, and `/404.html` each have `lang=en`, one h1, one main, a route-scoped title and description, Open Graph and Twitter metadata, SVG favicon, touch icon, and theme color. Indexable routes have canonicals; the noindex 404 intentionally does not.
- The home title follows “Product — what it does.” Inner titles follow the required “Route — Product” form. The unknown path returns the designed 404 with HTTP 404.
- All 15 discovered document, hash, download, and labelled external-source links resolved. The downloaded live ZIP is byte-identical to the clean build (`f44101682b7df28e3094a48b56cb370720a0337e96195eeae9d5a2981bd6e887`).
- Route navigation and Back focus and announce the new h1. Mobile targets, keyboard focus, reduced motion, semantic structure, and serious/critical Axe checks pass.
- The concrete-and-moss workbench, hard outlines, compressed display type, chronological moss seam, generated slab, and bespoke 404 are recognisably product-specific. This is not a generic SaaS template.
- `verify-url.sh` reports HTTP 200, `lang=en`, one h1, main, zero missing alts, zero unnamed buttons, and no console errors.

## Earlier finding closure

Every earlier review, polish record, and handoff was read. Each prior ID was checked against current live behavior and code rather than accepted from its status label.

| Earlier ID | Current confirmation | Status |
| --- | --- | --- |
| B-01 | Both required viewports expose job, audience, sample action, outcome, and facts. | Confirmed |
| B-02 | One-click seeded demo, banner, reset, exit, and isolated namespace work. | Confirmed |
| B-03 | Registry has 19 unique IDs and 19 independently runnable commands. | Confirmed; assertion quality exceptions are UC-03 and UC-12 below. |
| B-04 | Unknown live path returns the designed page with HTTP 404. | Confirmed |
| H-01 | Route metadata, social image, icons, and theme colors are complete. | Confirmed |
| H-02 | Link navigation and Back focus and announce the h1. | Confirmed |
| H-03 | Tested visible 390 px targets meet 44 × 44 px. | Confirmed |
| M-01 | Shared header/footer, legal links, version, credit, and source label remain. | Confirmed |
| M-02 | README retains demo, build, deployment, and live-check instructions. | Confirmed |
| N-01 | Decorative hero retains empty alt text. | Confirmed |
| UC-01 | Production sample export contains actions, focus, page details, and snapshots. | Confirmed |
| UC-02 | Free, Chromium, and no-account/upload facts remain separately registered. | Confirmed |
| UC-03 | Named test does not inspect production stored/downloaded order. | **Reopened — F-5-1** |
| UC-04 | Shift+Tab escape and Escape recovery work in the lab. | Confirmed |
| UC-05 | Recorder is absent before explicit Start. | Confirmed |
| UC-06 | Recorder bar, badge, and both stop paths are exercised. | Confirmed |
| UC-07 | Printable keys become Character; navigation keys remain named. | Confirmed |
| UC-08 | Structured secrets are absent and every tested JPEG field is masked. | Confirmed |
| UC-09 | Screenshots default off. | Confirmed |
| UC-10 | Visible-tab capture and 12-image cap pass. | Confirmed |
| UC-11 | Export includes the named evidence fields and scope. | Confirmed |
| UC-12 | Export offline test passes, but the plural site/demo offline scope is not in its assigned test. | **Reopened — F-5-2** |
| UC-13 | Trace uses extension storage and Clear removes it. | Confirmed |
| UC-14 | Live/demo and extension checks find no remote upload or tracking path. | Confirmed |
| UC-15 | UI/export use “nearby control snapshot” and state the selected-DOM limit. | Confirmed |
| UC-16 | README record/export outcomes retain claim mappings. | Confirmed |
| UC-17 | External browser-platform assertion remains absent. | Confirmed |
| UC-18 | Built manifest has the exact four permissions and no host permissions. | Confirmed |
| UC-19 | Untested browser-internal-page promise remains absent. | Confirmed |
| UC-20 | The 13th capture produces the named 12-image limit result. | Confirmed |
| UC-21 | Build creates extension, ZIP, site, and public ZIP. | Confirmed |
| UC-22 | Architecture-only marketing promises remain absent. | Confirmed |
| UC-23 | Demo/export retain the selected-DOM scope note. | Confirmed |
| UC-24 | Untested cross-origin grant assertion remains absent. | Confirmed |
| UC-25 | Untested Shadow DOM/iframe assertion remains absent. | Confirmed |
| UC-26 | Generated source/prompt and authored mark provenance remain present. | Confirmed |
| UC-27 | MIT/free/no-billing check passes. | Confirmed |
| UC-28 | Copy uses the observable action-to-focus statement. | Confirmed |
| UC-29 | Copy names the concrete bug-report job without subjective wording. | Confirmed |
| UC-30 | Untested Node-version promise remains absent. | Confirmed |
| C-01 | Hero sentence remains short and job-led. | Confirmed |
| C-02 | Unexplained MV3 eyebrow remains replaced. | Confirmed |
| C-03 | Main evidence heading makes sense out of context. | Confirmed |
| C-04 | “Share the trace” retains a concrete object. | Confirmed |
| C-05 | Export copy names its contents. | Confirmed |
| C-06 | Closing steps name bug, recording, and trace. | Confirmed |
| C-07 | Subjective size/actionability wording remains absent. | Confirmed |
| C-08 | Local-extension bug-report wording remains concrete. | Confirmed |
| C-09 | ZIP actions name their result. | Confirmed |
| C-10 | README names its audience in short sentences. | Confirmed |
| C-11 | README opening names concrete recorded evidence. | Confirmed |
| C-12 | Lab description names the deliberate defect and Escape exit. | Confirmed |
| C-13 | Storage/permission copy states user-visible effects. | Confirmed |
| C-14 | “Nearby control snapshot” remains the selected-DOM term. | Confirmed |
| C-15 | Recording, trace, and trace file retain distinct meanings. | Confirmed |
| C-16 | “Current trace” remains standardized. | Confirmed |
| C-17 | Stop wording names the recorder bar. | Confirmed |
| C-18 | Keys, focus, page, and controls remain named. | Confirmed |
| C-19 | Screenshot copy is literal and optional. | Confirmed |
| C-20 | Manual installation wording remains plain. | Confirmed |
| C-21 | Character/sensitive-value wording matches current behavior. | Confirmed |
| C-22 | Free and browser-storage facts remain concrete. | Confirmed |
| F-2-1 | Desktop first screen remains within 1440 × 900. | Confirmed |
| F-2-2 | Project name exports as `input` / `textbox`. | Confirmed |
| F-2-3 | Snapshot term is consistent in live UI, docs, and export. | Confirmed |
| F-2-4 | Untestable screen-recording comparison remains absent. | Confirmed |
| F-2-5 | Broad untested permission/page-policy claim remains absent. | Confirmed |
| F-2-6 | All 34 numeric copy-audit rows are count-checked and pass. | Confirmed |
| F-3-1 | Sensitive-mask command and full concurrent suite pass. | Confirmed |
| F-3-2 | Separate demo-entry and demo-reset entries and tests remain. | Confirmed |
| F-4-1 | Corrected counts 12, 13, 11, and 12 remain accurate. | Confirmed |

## Verification evidence

- `npm ci` — pass; 235 packages audited, zero vulnerabilities.
- Every exact `.factory/claims.json` command — 19/19 command passes.
- `npm test` — 10/10 pass.
- `npm run check` — pass.
- `npm run build` — pass; unpacked extension, 24.83 kB ZIP, and `dist/site` produced.
- `npm run test:a11y` — 31/31 pass, including the prior concurrent masking regression.
- Live route/Axe/focus/mobile/offline suite — 13/13 pass.
- Live crawl — 15/15 targets pass; expected unknown path returns 404.
- Production HTML for all six routes and the extension ZIP are byte-identical to the clean build.

## Missed leverage

No additional AI, import, export, or sync feature is implied. The brief asks for a local reproducibility artifact, and the self-contained HTML export is the obvious handoff. AI would add privacy and key-management cost without improving the core recording job.

## What would make this perfect

Make `chronological-order` compare the actual visible, stored, and downloaded production trace. Expand `offline-site` to prove every promised route and the interactive demo after one visit. Then rerun the 19 exact claim commands and the full suite. Those two durable test repairs are the only remaining work identified in this round.
