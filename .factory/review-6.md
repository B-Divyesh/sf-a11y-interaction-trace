# Adversarial first-read review 6 — A11y Interaction Trace

**Verdict: FAIL**

Reviewed 2026-08-28 against <https://a11y-interaction-trace.sociobot.in> and a clean clone of commit `d04c244b9fddf3a8c36cbf6f1d7b9b57edfdc5fe`.

The live product is clear, tryable, visually distinct, and currently works in the exercised flows. It still fails because two passing claim commands do not exercise their complete promises, two README promises are not stated in the claims registry, and one first-screen phrase uses avoidable testing jargon. A PASS requires zero findings and no untested claim.

## Findings, ordered by severity

### BLOCKING F-6-1 / UC-05 — The explicit-recording test does not prove that pre-start actions stay out of the trace

**Quote/location:** Landing: “Recording starts when you select Start.” Registry: `explicit-recording`, “Recording starts only on request and shows a toolbar badge and recorder bar.” Test: `tests/e2e/claims.spec.ts`, `@claim:explicit-recording`.

The test checks that the recorder bar is absent before Start, then checks the bar, badge, and two Stop paths. It never performs a keyboard action before Start or inspects storage/export to prove that action was not captured. A hidden or prematurely active capture path could pass.

This is blocking because no-capture-before-consent is a privacy boundary. It reopens the unproven part of `UC-05`.

**Concrete fix:** Send a distinctive action before Start and assert extension storage has no trace. Start, send a second action, stop, and assert storage and export contain only the post-start action. Retain the indicator and both Stop-path assertions.

### BLOCKING F-6-2 / UC-12 — The offline-export test bypasses the downloaded trace file

**Quote/location:** Landing: “Exported trace files open without a network connection.” Registry: `offline-export`. Test: `tests/e2e/claims.spec.ts`, `@claim:offline-export`.

The test calls `buildViewerHtml(sample)` and injects the string with `page.setContent()` after setting the context offline. It never enters the demo, activates **Download sample trace**, saves the emitted file, or opens it. The command can pass if the actual download path emits an empty, truncated, or unopenable artifact.

Current live behavior passed a manual check: the downloaded `a11y-trace-sample-checkout.html` opened from `file://` in a fresh offline context, rendered “Interaction trace” and “Background help,” made no HTTP(S) request, and logged no error. The durable claim regression remains incomplete, reopening the test-coverage part of `UC-12`.

**Concrete fix:** Enter `/demo/`, download the production sample trace, save it, create a fresh offline context, open the saved file, and assert its heading and representative focus/snapshot content. Require zero HTTP(S) requests and zero console/page errors.

### HIGH F-6-3 — “Start for real removes all demo data” is not stated by a claims entry

**Quote/location:** README, **Try the sample trace**: “Start for real removes all demo data.”

`@claim:demo-isolation` verifies removal, but its registry claim says only that reset and exit do not change real data. No `claim` field states the separate deletion promise, so a verifier cannot account for the sentence from `claims.json`.

**Concrete fix:** Expand `demo-isolation` to say, “The sample uses a demo-only storage namespace; Start for real removes demo data, and reset or exit does not change real data.” Keep the existing exit assertion and make `where`/`sandbox` explicit.

### HIGH F-6-4 — The README's styled-404 promise has no claims entry

**Quote/location:** README, **Deploy**: “The unknown path must return the styled 404 response.”

The behavior works live, and an untagged structural test checks host configuration. No registry entry names this public, verifiable deployment promise.

**Concrete fix:** Add a `designed-404` entry and tag the existing test. Its sandbox must request an unknown built-site path and assert HTTP 404, the 404 title/h1, and a working return link. Alternatively, remove the promise from public README copy and retain it as an internal deployment check.

### MINOR F-6-5 — “Seeded dialog” is testing jargon on the first screen

**Quote/location:** Landing action note: “Opens a seeded dialog and sample trace.” The demo also says “A seeded trace shows the broken step…”

“Seeded” describes fixture setup, not what the visitor will see. Rewrite the first sentence as “Opens a checkout dialog with a completed sample trace.” On the demo: “The sample trace shows the broken step, nearby control snapshots, and the exported file before you install anything.”

## Cold first read

Fresh Chromium contexts were opened before scrolling.

| Viewport | What it does | For whom | What to click first | Result |
| --- | --- | --- | --- | --- |
| 390 × 844 | Records keyboard-focus failures for a team. | Web developers and accessibility testers. | **Try it with sample data.** | Pass. Headline, audience, action, outcome, and facts end at `y=699.4`; no overflow or console error. |
| 1440 × 900 | Records keyboard-focus failures for a team. | Web developers and accessibility testers. | **Try it with sample data.** | Pass. The required content ends at `y=712.6`; no console error. |

The exact answering text is “Record keyboard focus failures for your team.”, “For web developers and accessibility testers who need reproducible keyboard evidence without uploading a recording.”, and “Try it with sample data.” The first screen is not blocking; F-6-5 concerns the adjacent outcome note.

## Copy audit

Counts are whitespace-delimited; hyphenated and quoted terms count as one word. No sentence exceeds 22 words and no banned marketing adjective appears. Headings are contextual, core terminology is consistent, and actions name a destination or result. F-6-5 is the only jargon flag. F-6-3/F-6-4 are registration findings.

### Landing-page sentences

| ID | Words | Exact sentence | Audit |
| --- | ---: | --- | --- |
| L-01 | 2 | You’re offline. | Pass. |
| L-02 | 5 | The cached pages still work. | `offline-site`. |
| L-03 | 5 | Downloads may need a connection. | Honest limitation. |
| L-04 | 7 | Record keyboard focus failures for your team. | Pass; job-led h1. |
| L-05 | 15 | For web developers and accessibility testers who need reproducible keyboard evidence without uploading a recording. | Pass. |
| L-06 | 7 | Opens a seeded dialog and sample trace. | **F-6-5.** |
| L-07 | 7 | Nothing is saved to your real data. | `demo-isolation`. |
| L-08 | 1 | Free. | `free-mit`. |
| L-09 | 4 | Packaged for Chromium browsers. | `chromium-package`. |
| L-10 | 6 | Stores traces only in your browser. | `local-no-upload`. |
| L-11 | 11 | This trace pairs each keyboard action with its next focus target. | `chronological-order`. |
| L-12 | 7 | Events stay in the order they happened. | `chronological-order`. |
| L-13 | 10 | Three keyboard actions show when focus moves behind the dialog. | `seeded-focus-defect`. |
| L-14 | 6 | Recording starts when you select Start. | **F-6-1 / `explicit-recording`.** |
| L-15 | 11 | The toolbar badge and recorder bar show when capture is active. | `explicit-recording`. |
| L-16 | 4 | Printable keys become “Character.” | `key-privacy`. |
| L-17 | 8 | Sensitive field values do not enter the trace. | `sensitive-mask`. |
| L-18 | 3 | Screenshots start off. | `screenshot-boundary`. |
| L-19 | 8 | When enabled, capture uses the visible tested tab. | `screenshot-boundary`. |
| L-20 | 12 | The exported file includes timing, focus, role, name, state, and scope notes. | `trace-export-content`. |
| L-21 | 8 | The extension stores traces in browser extension storage. | `local-no-upload`. |
| L-22 | 10 | The extension has no account, analytics, tracker, or upload service. | `local-no-upload`. |
| L-23 | 8 | Exported trace files open without a network connection. | **F-6-2 / `offline-export`.** |
| L-24 | 12 | Nearby control snapshots are selected DOM details, not an operating-system accessibility tree. | `snapshot-scope`. |
| L-25 | 5 | Download and unzip the extension. | Pass. |
| L-26 | 9 | Open your browser’s Extensions page and enable Developer mode. | Pass. |
| L-27 | 12 | Choose “Load unpacked,” select the extracted folder, then pin the moss-path icon. | Pass. |
| L-28 | 4 | Reproduce the focus bug. | Pass. |
| L-29 | 2 | Record it. | Clear from the preceding sentence. |
| L-30 | 3 | Share the trace. | Pass. |
| L-31 | 13 | Use one local extension to capture an accessibility failure for a bug report. | Pass. |
| L-32 | 11 | Record keyboard actions and focus changes for an accessibility bug report. | Pass. |
| L-33 | 7 | The hero artwork is original generated imagery. | `provenance`. |
| L-34 | 9 | Interface marks and diagrams are hand-authored for this product. | `provenance`. |

### README sentences

| ID | Words | Exact sentence | Audit |
| --- | ---: | --- | --- |
| R-01 | 14 | This Chromium extension records keyboard actions, focus changes, nearby control snapshots, and optional screenshots. | Covered by recording/snapshot/screenshot claims. |
| R-02 | 6 | It exports one HTML trace file. | `trace-export-content`. |
| R-03 | 10 | For web developers, accessibility testers, QA engineers, and issue triagers. | Pass. |
| R-04 | 12 | Use it to record keys and focus changes in a bug report. | Pass. |
| R-05 | 5 | Open the sample link once. | Instruction. |
| R-06 | 12 | It shows a checkout dialog and four ordered events without an install. | `demo-entry`. |
| R-07 | 5 | The banner identifies demo mode. | Exercised by `demo-isolation`. |
| R-08 | 7 | Reset demo restores the original four-event sample. | `demo-reset`. |
| R-09 | 7 | Start for real removes all demo data. | **F-6-3.** |
| R-10 | 8 | Demo data uses local-storage keys beginning with `demo:a11y-interaction-trace:`. | `demo-isolation`. |
| R-11 | 9 | The demo never reads or changes other storage keys. | `demo-isolation`. |
| R-12 | 9 | See `.factory/demo.md` for the exact seed and isolation checks. | Documentation pointer. |
| R-13 | 10 | The snapshot is not the browser or operating-system accessibility tree. | `snapshot-scope`. |
| R-14 | 16 | Run `npm ci && npm run build`, or download the extension ZIP from the live site. | Instruction. |
| R-15 | 2 | Unzip `dist/site/downloads/a11y-interaction-trace.zip`. | Instruction. |
| R-16 | 6 | Open your Chromium browser’s Extensions page. | Instruction. |
| R-17 | 7 | Enable Developer mode and choose **Load unpacked**. | Instruction. |
| R-18 | 8 | Select the extracted directory and pin the extension. | Instruction. |
| R-19 | 5 | Open the page under test. | Instruction. |
| R-20 | 14 | The included `/lab/` page has a deliberately broken dialog with an Escape key exit. | `seeded-focus-defect`. |
| R-21 | 3 | Open the extension. | Instruction. |
| R-22 | 10 | Screenshots are off until you enable them for that recording. | `screenshot-boundary`. |
| R-23 | 12 | Select **Start on this tab**, then reproduce the issue with the keyboard. | `explicit-recording`. |
| R-24 | 9 | Stop from the recorder bar or the extension popup. | `explicit-recording`. |
| R-25 | 12 | Select **Export trace file**, then attach the HTML file to the issue. | `trace-export-content`. |
| R-26 | 6 | Select **Clear local trace** when finished. | `local-no-upload`. |
| R-27 | 9 | The current trace stays in browser extension storage (`chrome.storage.local`). | `local-no-upload`. |
| R-28 | 11 | The extension has no account, analytics, tracker, API, or upload service. | `local-no-upload`. |
| R-29 | 5 | Its manifest requests four permissions. | `manifest-permissions`. |
| R-30 | 11 | `activeTab` and `scripting` run the recorder in the tab you choose. | `manifest-permissions`/`explicit-recording`. |
| R-31 | 8 | `storage` keeps the current trace in the browser. | `manifest-permissions`/`local-no-upload`. |
| R-32 | 5 | `downloads` saves the trace file. | Permission/export implementation. |
| R-33 | 6 | The manifest has no host permissions. | `manifest-permissions`. |
| R-34 | 10 | Sensitive field values are excluded before optional screenshots are captured. | `sensitive-mask`. |
| R-35 | 7 | The commands below use Node.js and npm. | Development context, not a version promise. |
| R-36 | 14 | The production build creates the unpacked extension, packaged ZIP, deployable site, and public download. | `packaged-build`. |
| R-37 | 5 | Claim `packaged-build` verifies every artifact. | Registry pointer. |
| R-38 | 6 | The static deployment root is `dist/site`. | Build/deploy instruction. |
| R-39 | 12 | Build it with `npm ci && npm test && npm run build:site`. | Instruction. |
| R-40 | 9 | The factory deploys that directory with `/opt/fleet/lib/deploy-static.sh a11y-interaction-trace dist/site`. | Internal instruction. |
| R-41 | 6 | Infrastructure changes happen outside this repository. | Scope instruction. |
| R-42 | 12 | After deployment, check `/`, `/demo/`, `/lab/`, `/privacy/`, `/terms/`, and an unknown path. | Instruction. |
| R-43 | 9 | The unknown path must return the styled 404 response. | **F-6-4.** |
| R-44 | 7 | Version 1 is packaged for Chromium browsers. | `chromium-package`. |
| R-45 | 7 | Nearby control snapshots contain selected DOM details. | `snapshot-scope`. |
| R-46 | 7 | Review each trace file before sharing it. | Advice. |
| R-47 | 6 | The source uses the MIT License. | `free-mit`. |
| R-48 | 11 | Generated hero provenance and the visual system are documented in `.factory/design.md`. | `provenance`. |

### Headings, terminology, and actions

Landing headings such as “Record what changed after each key,” “Focus leaves a dialog,” “Record only when you choose,” “Typed words stay private,” “Screenshots are optional,” “Open the trace file offline,” “Keep the trace on your machine,” and “Install the extension ZIP” make sense alone. README headings clearly identify the sample, records, installation, privacy, development, deployment, limits, and license sections.

Product actions name results or destinations: **Try it with sample data**, **Download extension ZIP**, **Open the sample trace**, **Download A11y Interaction Trace v1**, **Replay sample**, **Reset demo**, and **Download sample trace**. **Start for real** is the required sandbox-exit label. Terms remain consistent: `recording`, `trace`, `trace file`, `nearby control snapshot`, `Chromium browser`, and `demo`.

## Demo, sandbox, privacy, and offline behavior

- The first-screen action reached `/demo/` in one click and immediately showed the checkout dialog plus Recording started, Enter, Shift + Tab, and Escape.
- The banner read “Demo — sample data, nothing is saved,” stated real traces are never read or changed, and exposed Reset demo and Start for real.
- Replay changed only `demo:a11y-interaction-trace:state`; Reset restored its complete original value; exit removed it. `real:sentinel=immutable` and `traceSession=real-trace` remained byte-identical.
- The demo flow requested only the product origin and logged no request, console, or page error.
- Fresh contexts for `/`, `/demo/`, `/lab/`, `/privacy/`, and `/terms/` each reloaded offline with the correct h1. The offline demo replayed and reset.
- The live downloaded trace opened from disk offline with expected content and no HTTP(S) request. F-6-2 concerns the registered regression, not current behavior.

## Claims verification

Clean clone: `/tmp/a11y-review6-clean-h4DMvA/repo` at `d04c244`. `npm ci` reported zero vulnerabilities. Every exact command in `.factory/claims.json` ran independently.

| Claim ID | Command | Coverage result |
| --- | --- | --- |
| demo-isolation | Pass | Behavior passes; exit-deletion wording is not in the registry (F-6-3). |
| demo-entry | Pass | Pass. |
| demo-reset | Pass | Pass. |
| trace-export-content | Pass | Pass. |
| chronological-order | Pass | Pass; visible, stored, and downloaded pairs are compared. |
| seeded-focus-defect | Pass | Pass. |
| explicit-recording | Pass | **Insufficient for the pre-start capture boundary (F-6-1).** |
| key-privacy | Pass | Pass. |
| sensitive-mask | Pass | Pass, including all fields in every stored JPEG. |
| screenshot-boundary | Pass | Pass. |
| offline-export | Pass | **Insufficient because it bypasses the downloaded artifact (F-6-2).** |
| offline-site | Pass | Pass across all routes and demo controls. |
| local-no-upload | Pass | Pass. |
| snapshot-scope | Pass | Pass. |
| manifest-permissions | Pass | Pass. |
| chromium-package | Pass | Pass. |
| packaged-build | Pass | Pass. |
| free-mit | Pass | Pass. |
| provenance | Pass | Pass for recorded sources/provenance. |

Additional clean gates passed: `npm test` 11/11, `npm run check`, `npm run build`, and `npm run test:a11y` 31/31. The build produced the unpacked extension, 24.83 kB ZIP, and `dist/site`.

## Structure, accessibility, routing, and visual identity

- `/`, `/demo/`, `/lab/`, `/privacy/`, `/terms/`, and `/404.html` have `lang=en`, one h1, one main, scoped titles/descriptions, OG/Twitter metadata, SVG favicon, touch icon, and theme color. Indexable routes have canonicals; the noindex 404 intentionally does not.
- `/review-6-missing-route` returned HTTP 404 with “This path has no recorded step.” `/404.html` returned 200 as the static asset.
- The deployed route/Axe suite passed 13/13, covering six route scans, route focus/announcement and Back, first-screen bounds, 44 px targets, the keyboard lab, 404 mapping, and offline routes/demo. `verify-url.sh` found no console/accessibility-basics error.
- All 15 document, hash, download, and labelled external-source targets resolved. `robots.txt` and `sitemap.xml` are live and complete.
- Deployed HTML/ZIP hashes match the clean build. ZIP SHA-256: `f44101682b7df28e3094a48b56cb370720a0337e96195eeae9d5a2981bd6e887`.
- The concrete-and-moss workbench, hard outlines, compressed type, moss seam, original slab, and bespoke 404 match `.factory/design.md` and are not a generic SaaS template.

## Earlier finding closure check

Every `review-1.md` through `review-5.md`, every `polish-1.md` through `polish-5.md`, and the prior handoff were read. Status is based on current live/code checks.

### Review 1 — structure and discovery

| ID | Current status |
| --- | --- |
| B-01 | Confirmed: both first screens expose job, audience, sample action, outcome, and facts. |
| B-02 | Confirmed: one-click populated demo, banner, Reset, exit, and isolated namespace work. |
| B-03 | Structurally fixed: 19 unique IDs/commands; coverage exceptions are UC-05 and UC-12. |
| B-04 | Confirmed: unknown live path returns the designed HTTP 404; new registry gap is F-6-4. |
| H-01 | Confirmed: route metadata, social image, icons, and theme colors are complete. |
| H-02 | Confirmed: navigation and Back focus and announce the h1. |
| H-03 | Confirmed: tested 390 px controls meet 44 × 44 px. |
| M-01 | Confirmed: shared header/footer, legal/source links, version, purpose, and credit remain. |
| M-02 | Confirmed: README retains demo/build/deploy/live-check instructions. |
| N-01 | Confirmed: decorative hero retains `alt=""`. |

### Review 1 — claims

| ID | Current status |
| --- | --- |
| UC-01 | Confirmed: sample export contains actions, focus, page details, and snapshots. |
| UC-02 | Confirmed: free, Chromium, and no-account/upload facts are registered. |
| UC-03 | Confirmed: visible, stored, and downloaded action/timestamp pairs match. |
| UC-04 | Confirmed: Shift+Tab escapes and Escape restores focus. |
| UC-05 | **Reopened — F-6-1:** no assertion excludes a pre-start action from storage/export. |
| UC-06 | Confirmed: badge, recorder bar, and both Stop paths are exercised. |
| UC-07 | Confirmed: typed keys become Character; navigation keys remain named. |
| UC-08 | Confirmed: structured secrets are absent and screenshot fields are masked. |
| UC-09 | Confirmed: screenshots default off. |
| UC-10 | Confirmed: visible-tab capture and 12-image cap pass. |
| UC-11 | Confirmed: export contains named evidence fields/scope. |
| UC-12 | **Reopened — F-6-2:** exported-file test never opens the downloaded artifact. |
| UC-13 | Confirmed: trace uses extension storage and Clear removes it. |
| UC-14 | Confirmed: no remote upload/tracking/account/API path was found. |
| UC-15 | Confirmed: UI/export use the selected-DOM scope term. |
| UC-16 | Partially confirmed, subject to F-6-1/F-6-2. |
| UC-17 | Confirmed: external platform assertion remains absent. |
| UC-18 | Confirmed: exact four permissions and no hosts. |
| UC-19 | Confirmed: browser-internal-page promise remains absent. |
| UC-20 | Confirmed: 13th capture gets the 12-image limit result. |
| UC-21 | Confirmed: all build artifacts exist. |
| UC-22 | Confirmed: architecture-only marketing claims remain absent. |
| UC-23 | Confirmed: demo/export retain the selected-DOM limitation. |
| UC-24 | Confirmed: cross-origin grant assertion remains absent. |
| UC-25 | Confirmed: Shadow DOM/iframe assertion remains absent. |
| UC-26 | Confirmed: generated source/prompt and authored mark remain. |
| UC-27 | Confirmed: MIT/free/no-billing check passes. |
| UC-28 | Confirmed: copy uses the action-to-focus statement. |
| UC-29 | Confirmed: copy names the local bug-report job. |
| UC-30 | Confirmed: untested Node-version promise remains absent. |

### Review 1 — copy

| ID | Current status |
| --- | --- |
| C-01 | Confirmed: hero is short and job-led. |
| C-02 | Confirmed: unexplained MV3 eyebrow remains replaced. |
| C-03 | Confirmed: evidence heading works out of context. |
| C-04 | Confirmed: “Share the trace” names the artifact. |
| C-05 | Confirmed: export copy names its contents. |
| C-06 | Confirmed: closing steps name bug, recording, and trace. |
| C-07 | Confirmed: subjective size/actionability wording remains absent. |
| C-08 | Confirmed: local-extension bug-report wording is concrete. |
| C-09 | Confirmed: download actions name the result. |
| C-10 | Confirmed: README audience sentences are short. |
| C-11 | Confirmed: README opening names recorded evidence. |
| C-12 | Confirmed for the lab; new first-screen jargon is F-6-5. |
| C-13 | Confirmed: storage/permission copy leads with effects. |
| C-14 | Confirmed: “nearby control snapshot” remains consistent. |
| C-15 | Confirmed: recording/trace/trace-file meanings remain distinct. |
| C-16 | Confirmed: “current trace” remains standardized. |
| C-17 | Confirmed: Stop wording names the recorder bar. |
| C-18 | Confirmed: keys, focus, page, and controls are named. |
| C-19 | Confirmed: screenshot wording is literal/optional. |
| C-20 | Confirmed: manual-install wording is plain. |
| C-21 | Confirmed: Character/sensitive-value wording matches behavior. |
| C-22 | Confirmed: free/browser-storage facts are concrete. |

### Reviews 2–5

| ID | Current status |
| --- | --- |
| F-2-1 | Confirmed: desktop first-screen content ends at 713 px. |
| F-2-2 | Confirmed: Project name exports as `input` / `textbox`. |
| F-2-3 | Confirmed: snapshot terminology is consistent. |
| F-2-4 | Confirmed: untestable screen-recording comparison is absent. |
| F-2-5 | Confirmed: broad permission/page-policy statement is absent. |
| F-2-6 | Confirmed: all 34 numeric audit rows are count-checked. |
| F-3-1 | Confirmed: masking/concurrent regression passes. |
| F-3-2 | Confirmed: demo-entry/reset claims remain; exit registry wording is F-6-3. |
| F-4-1 | Confirmed: corrected counts remain accurate. |
| F-5-1 | Confirmed: chronology compares production visible/stored/downloaded pairs. |
| F-5-2 | Confirmed: offline-site covers all routes and demo replay/reset. |

## Missed leverage

No missing AI, import, export, or sync feature is implied. The core job is a local, privacy-limited interaction record, and self-contained HTML export supplies the expected handoff. AI would add network/key/disclosure cost without improving capture fidelity; sync would conflict with the local-only boundary.

## What would make this perfect

Prove that pre-start input is absent from the stored/exported trace. Open the actual downloaded demo file in the offline-export claim. Register exit deletion and styled 404. Replace “seeded dialog” with the checkout example. Then rerun all 19 claim commands and this full review. Nothing else was found.
