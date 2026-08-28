# Adversarial first-read review 3 — A11y Interaction Trace

**Verdict: FAIL**

Reviewed 2026-08-28 against <https://a11y-interaction-trace.sociobot.in> and repository commit `b3b702cec6585c7436337ccc18e9b6c5c1702b81`.

The cold first read, live demo, routing, accessibility scan, and all 17 individually invoked claim commands work. This is still a FAIL: the privacy-critical `sensitive-mask` claim test is intermittent in the full browser suite, so its promised screenshot protection cannot be accepted as a reliable quality gate. The README also makes two distinct demo promises that do not have matching claims-registry entries or assertions.

## Cold first read

Fresh Chromium contexts were opened at 390 × 844 and 1440 × 900 before scrolling. Both showed the headline, audience sentence, demo action, outcome note, and three facts. The primary action was fully visible at 390 px (`y` 460.9, height 48) and there was no horizontal overflow.

| Viewport | What it does | For whom | What to click first | Result |
| --- | --- | --- | --- | --- |
| 390 × 844 | Records keyboard-focus failures and gives the team an evidence trace. | Web developers and accessibility testers. | “Try it with sample data.” | Answerable from the first screen. |
| 1440 × 900 | Records keyboard-focus failures and gives the team an evidence trace. | Web developers and accessibility testers. | “Try it with sample data.” | Answerable from the first screen. |

The exact first-screen copy that made this answerable was “Record keyboard focus failures for your team.”, “For web developers and accessibility testers who need reproducible keyboard evidence without uploading a recording.”, and “Opens a seeded dialog and sample trace. Nothing is saved to your real data.”

## Findings, ordered by severity

### BLOCKING F-3-1 / UC-08 — The sensitive-screenshot claim is flaky in the full quality gate

**Location:** `tests/e2e/claims.spec.ts:100–142`, specifically the `@claim:sensitive-mask` pixel assertion at line 139; capture sequencing in `entrypoints/background.ts` waits a fixed 40 ms after `TRACE_MASK_SENSITIVE`.

**Exact failure:** a clean-clone `npm run test:a11y` run failed with `Expected: < 60; Received: 255` at `expect(pixel[0]).toBeLessThan(60)`. The failing assertion samples the claimed mask over a sensitive input. An immediate standalone rerun of the exact registered command passed, and a second full run passed 28/28. The first full run's `test-results/.last-run.json` was `status: failed`; this is therefore an intermittent, not resolved, claim-test failure.

**Why this is blocking:** the public claim says “Sensitive field values are excluded from structured trace data and optional screenshots.” A white pixel where the dark mask should be means the test can observe a capture without its expected privacy cover when the suite is under normal parallel load. A test that occasionally cannot prove a privacy boundary is not a release-quality proof of that boundary. Per the claims contract, a failing claim test is blocking.

**Concrete fix:** make `TRACE_MASK_SENSITIVE` acknowledge only after all mask nodes have been inserted and painted (for example, await two animation frames in the recorder), then capture only after that acknowledgement rather than after a fixed 40 ms sleep. Keep the fields masked until the capture promise has settled. Add a repeat/parallel regression that runs this claim with the rest of the extension screenshot work and asserts every sensitive field rectangle is covered in every stored JPEG. `npm run test:a11y` must pass repeatedly, not only when the claim is isolated.

### HIGH F-3-2 — Two README demo promises are not represented by claim entries

**Quote and location:** README, “It shows a checkout dialog and four ordered events without an install.” README, “Reset demo restores the original sample, and Start for real removes all demo data.” The landing action note also says, “Opens a seeded dialog and sample trace.”

**Evidence:** `.factory/claims.json` has `demo-isolation`, whose stated claim is only “The sample uses a demo-only storage namespace; reset and exit do not change real data.” Its test verifies the banner, namespace, and real-data sentinels. It does not assert that the landing action opens a populated dialog and four-event trace without an extension, nor that Reset restores the original seed contents. `trace-export-content` opens `/demo/` directly and checks a download; it does not exercise the landing action or Reset's restored seed.

**Why this matters:** a first-time visitor is asked to rely on the sample as the try-before-install path. The stated no-install and reset outcomes are useful product promises, but the registry does not name or prove them. This is an unlisted-claim finding under the claims contract.

**Concrete fix:** add a `demo-entry` claim such as “The sample opens without installing the extension and immediately shows the checkout dialog and four ordered events.” Its fresh-context test must click the landing action and assert `/demo/`, the dialog, all four events, and no loaded extension. Extend `demo-isolation` or add `demo-reset` to assert the complete seed object after Reset, then list that exact promise in the entry. Alternatively remove the two unverified phrases from the README and landing action note.

## Copy audit

Counts are whitespace-delimited, with hyphenated terms counted as one word. Every visible landing and README sentence is listed below. No sentence exceeds 22 words. The audit found no banned marketing adjective, inconsistent core term, or non-result-naming action button. The two claim-registration gaps are reported separately as F-3-2.

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
| L-11 | 6 | Record what changed after each key. |
| L-12 | 11 | This trace pairs each keyboard action with its next focus target. |
| L-13 | 7 | Events stay in the order they happened. |
| L-14 | 10 | Three keyboard actions show when focus moves behind the dialog. |
| L-15 | 5 | Record only when you choose. |
| L-16 | 6 | Recording starts when you select Start. |
| L-17 | 11 | The toolbar badge and recorder bar show when capture is active. |
| L-18 | 4 | Typed words stay private. |
| L-19 | 4 | Printable keys become “Character.” |
| L-20 | 8 | Sensitive field values do not enter the trace. |
| L-21 | 3 | Screenshots are optional. |
| L-22 | 3 | Screenshots start off. |
| L-23 | 8 | When enabled, capture uses the visible tested tab. |
| L-24 | 5 | Open the trace file offline. |
| L-25 | 12 | The exported file includes timing, focus, role, name, state, and scope notes. |
| L-26 | 6 | Keep the trace on your machine. |
| L-27 | 8 | The extension stores traces in browser extension storage. |
| L-28 | 10 | The extension has no account, analytics, tracker, or upload service. |
| L-29 | 8 | Exported trace files open without a network connection. |
| L-30 | 12 | Nearby control snapshots are selected DOM details, not an operating-system accessibility tree. |
| L-31 | 4 | Install the extension ZIP. |
| L-32 | 5 | Download and unzip the extension. |
| L-33 | 9 | Open your browser’s Extensions page and enable Developer mode. |
| L-34 | 12 | Choose “Load unpacked,” select the extracted folder, then pin the moss-path icon. |
| L-35 | 4 | Reproduce the focus bug. |
| L-36 | 2 | Record it. |
| L-37 | 3 | Share the trace. |
| L-38 | 13 | Use one local extension to capture an accessibility failure for a bug report. |
| L-39 | 11 | Record keyboard actions and focus changes for an accessibility bug report. |
| L-40 | 7 | The hero artwork is original generated imagery. |
| L-41 | 9 | Interface marks and diagrams are hand-authored for this product. |

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
| R-08 | 14 | Reset demo restores the original sample, and Start for real removes all demo data. |
| R-09 | 8 | Demo data uses local-storage keys beginning with `demo:a11y-interaction-trace:`. |
| R-10 | 9 | The demo never reads or changes other storage keys. |
| R-11 | 9 | See `.factory/demo.md` for the exact seed and isolation checks. |
| R-12 | 10 | The snapshot is not the browser or operating-system accessibility tree. |
| R-13 | 15 | Run `npm ci && npm run build`, or download the extension ZIP from the live site. |
| R-14 | 2 | Unzip `dist/site/downloads/a11y-interaction-trace.zip`. |
| R-15 | 6 | Open your Chromium browser’s Extensions page. |
| R-16 | 7 | Enable Developer mode and choose Load unpacked. |
| R-17 | 8 | Select the extracted directory and pin the extension. |
| R-18 | 5 | Open the page under test. |
| R-19 | 14 | The included `/lab/` page has a deliberately broken dialog with an Escape key exit. |
| R-20 | 3 | Open the extension. |
| R-21 | 10 | Screenshots are off until you enable them for that recording. |
| R-22 | 12 | Select Start on this tab, then reproduce the issue with the keyboard. |
| R-23 | 9 | Stop from the recorder bar or the extension popup. |
| R-24 | 12 | Select Export trace file, then attach the HTML file to the issue. |
| R-25 | 6 | Select Clear local trace when finished. |
| R-26 | 9 | The current trace stays in browser extension storage (`chrome.storage.local`). |
| R-27 | 11 | The extension has no account, analytics, tracker, API, or upload service. |
| R-28 | 5 | Its manifest requests four permissions. |
| R-29 | 11 | `activeTab` and `scripting` run the recorder in the tab you choose. |
| R-30 | 8 | `storage` keeps the current trace in the browser. |
| R-31 | 5 | `downloads` saves the trace file. |
| R-32 | 6 | The manifest has no host permissions. |
| R-33 | 10 | Sensitive field values are excluded before optional screenshots are captured. |
| R-34 | 7 | The commands below use Node.js and npm. |
| R-35 | 14 | The production build creates the unpacked extension, packaged ZIP, deployable site, and public download. |
| R-36 | 5 | Claim `packaged-build` verifies every artifact. |
| R-37 | 6 | The static deployment root is `dist/site`. |
| R-38 | 12 | Build it with `npm ci && npm test && npm run build:site`. |
| R-39 | 9 | The factory deploys that directory with `/opt/fleet/lib/deploy-static.sh a11y-interaction-trace dist/site`. |
| R-40 | 6 | Infrastructure changes happen outside this repository. |
| R-41 | 12 | After deployment, check `/`, `/demo/`, `/lab/`, `/privacy/`, `/terms/`, and an unknown path. |
| R-42 | 9 | The unknown path must return the styled 404 response. |
| R-43 | 7 | Version 1 is packaged for Chromium browsers. |
| R-44 | 7 | Nearby control snapshots contain selected DOM details. |
| R-45 | 7 | Review each trace file before sharing it. |
| R-46 | 6 | The source uses the MIT License. |
| R-47 | 11 | Generated hero provenance and the visual system are documented in `.factory/design.md`. |

Visible fragments, headings, and controls were also checked. “Keyboard and focus evidence,” “Keys, focus, page, controls,” “Capture boundaries,” “Focus leaves a dialog,” and all README headings identify their content without depending on decorative context. Product buttons use result-naming verbs: “Try it with sample data,” “Download extension ZIP,” “Open the sample trace,” “Replay sample,” “Reset demo,” and “Download sample trace.” “Start for real” is the prescribed demo-exit action and is paired with an explicit outcome in the banner.

## Demo, sandbox, and privacy checks

- The first-screen “Try it with sample data” link redirected directly to `/demo/` in a fresh context.
- Its first screen showed the populated checkout dialog and the four ordered events: Recording started, Enter, Shift + Tab, and Escape.
- The persistent banner read “Demo — sample data, nothing is saved,” with Reset demo and Start for real controls.
- After Replay sample and Reset demo, only `demo:a11y-interaction-trace:state` was changed. A seeded `real:sentinel=leave alone` key remained byte-for-byte unchanged.
- A live demo context made requests only to `https://a11y-interaction-trace.sociobot.in`; no third-party origin was observed. The fresh-context claim tests also intercepted demo and extension traffic.
- Offline export and visited-site reload are exercised by their registered browser tests. The standalone commands passed; F-3-1 concerns the full-suite screenshot-mask race, not the offline checks.

## Claims verification

A fresh clone at `/tmp/a11y-review-3-clean-2O4VLX/repo`, at the reviewed commit, received `npm ci`. Each command exactly as listed in `.factory/claims.json` was then invoked independently and passed:

| Claim ID | Result |
| --- | --- |
| demo-isolation | Pass |
| trace-export-content | Pass |
| chronological-order | Pass |
| seeded-focus-defect | Pass |
| explicit-recording | Pass |
| key-privacy | Pass |
| sensitive-mask | Pass in isolation; see F-3-1 for full-suite failure. |
| screenshot-boundary | Pass |
| offline-export | Pass |
| offline-site | Pass |
| local-no-upload | Pass |
| snapshot-scope | Pass |
| manifest-permissions | Pass |
| chromium-package | Pass |
| packaged-build | Pass |
| free-mit | Pass |
| provenance | Pass |

`npm test` passed 9 tests, `npm run check` passed, and `npm run build` passed in that clone. The first `npm run test:a11y` failed only the `@claim:sensitive-mask` test described in F-3-1; the immediate second full run passed 28/28. The nondeterministic first result remains a failure of the quality gate.

## Structure, accessibility, and live-site checks

- `BASE_URL=https://a11y-interaction-trace.sociobot.in npx playwright test tests/e2e/site.spec.ts --workers=2` passed 13/13. This included serious/critical axe checks on `/`, `/demo/`, `/privacy/`, `/terms/`, `/lab/`, and `/404.html`; 390-px targets; route focus and Back; 390/1440 first-screen bounds; the designed 404; and offline reload.
- Live link crawl checked every discovered anchor on those routes: all internal documents, hash targets, the ZIP, and the labeled external source returned 200. There were no console errors.
- Live unknown route `/definitely-not-a-route` returned HTTP 404 and the product-styled “This path has no recorded step.” page.
- The title, description, canonical (except the intentionally noindex 404), Open Graph/Twitter metadata, SVG favicon, apple-touch icon, `lang`, and one `h1` were present per route. `robots.txt`, `sitemap.xml`, CSP, referrer policy, and content-type protection were present.
- Header/footer and Privacy/Terms links were consistent. The concrete-and-moss evidence slab, hard outlines, moss seam, compact evidence type, and bespoke 404 follow `.factory/design.md`; this is not a generic SaaS card/gradient layout.

## Earlier finding closure check

All earlier review, polish, verification, and handoff records were read. The following is a current live/code confirmation, not acceptance of their prior status labels. “Fixed” means the current check passed; UC-08 is the one exception and is reopened by F-3-1.

| Earlier ID | Current confirmation | Status |
| --- | --- | --- |
| B-01 | Mobile and desktop first screens expose job, named audience, primary demo action, outcome, and three facts. | Fixed |
| B-02 | Direct `/demo/` and `?demo=1`, realistic seed, persistent banner, Reset, Start for real, and isolated prefix exist. | Fixed |
| B-03 | 17 complete, unique registry entries have individually runnable tagged tests. | Fixed |
| B-04 | Static-host override returns the designed 404 with status 404. | Fixed |
| H-01 | Route titles, descriptions, canonical/OG/Twitter metadata, icons, and theme colors are live. | Fixed |
| H-02 | Link navigation and Back move focus to the new h1 and announce it. | Fixed |
| H-03 | Tested visible mobile controls meet 44 × 44 px. | Fixed |
| M-01 | Shared header/footer, product one-liner, version, Param Factory credit, Privacy, and Terms are present. | Fixed |
| M-02 | README documents sample, namespace, build, deploy, and live checks. | Fixed |
| N-01 | Decorative artwork has empty alt text; axe reports no serious/critical violation. | Fixed |
| UC-01 | Sample export includes actions, focus, page details, and nearby control snapshots. | Fixed |
| UC-02 | Free, Chromium, account/upload facts map to separate tested claims. | Fixed |
| UC-03 | Visible and serialized events are timestamp ordered. | Fixed |
| UC-04 | Shift+Tab escapes and Escape restores the lab opener. | Fixed |
| UC-05 | Recorder starts only after explicit Start. | Fixed |
| UC-06 | Toolbar badge, recorder bar, and both Stop paths are exercised. | Fixed |
| UC-07 | Typed keys become Character while navigation keys remain identifiable. | Fixed |
| UC-08 | Structured masking is tested, but screenshot-mask proof fails intermittently in the full suite. | **Reopened: F-3-1** |
| UC-09 | Screenshots default off. | Fixed |
| UC-10 | Visible-tab capture and 12-image cap are tested. | Fixed |
| UC-11 | Export includes timing, focus, role, name, state, and scope note. | Fixed |
| UC-12 | Export and visited site work offline in registered tests. | Fixed |
| UC-13 | Trace resides in extension storage and Clear removes it. | Fixed |
| UC-14 | Demo/extension request checks find no remote service, analytics, or upload. | Fixed |
| UC-15 | UI/export use “nearby control snapshot” and state DOM-only scope. | Fixed |
| UC-16 | README outcomes map to keyboard, focus, snapshot, metadata, and screenshot behavior. | Fixed |
| UC-17 | Unverifiable browser-platform claim is absent. | Fixed |
| UC-18 | Built manifest has exactly four named permissions and no host permissions. | Fixed |
| UC-19 | Browser-internal-page promise is absent from public copy. | Fixed |
| UC-20 | The twelfth-capture boundary is tested. | Fixed |
| UC-21 | Build creates unpacked extension, ZIP, site, and public download. | Fixed |
| UC-22 | Architecture-only public promises are absent. | Fixed |
| UC-23 | Demo/export state the selected-DOM limitation. | Fixed |
| UC-24 | Cross-origin activeTab assertion is absent. | Fixed |
| UC-25 | Shadow-DOM/iframe scope assertion is absent. | Fixed |
| UC-26 | Generated source/prompt and authored mark provenance are recorded. | Fixed |
| UC-27 | MIT/free and no-billing facts are checked. | Fixed |
| UC-28 | Copy makes the observable key-to-focus comparison. | Fixed |
| UC-29 | Copy names the concrete bug-report use. | Fixed |
| UC-30 | Unverified Node-version promise is absent. | Fixed |
| C-01 | Hero body is short and plain. | Fixed |
| C-02 | “Keyboard and focus evidence” replaces unexplained MV3. | Fixed |
| C-03 | “Record what changed after each key” is self-explanatory. | Fixed |
| C-04 | “Share the trace” names the handoff artifact. | Fixed |
| C-05 | Export copy names its contents. | Fixed |
| C-06 | Three close steps have concrete objects. | Fixed |
| C-07 | Untestable size/actionability adjectives are absent. | Fixed |
| C-08 | Concrete local-extension wording is present. | Fixed |
| C-09 | ZIP/download labels name the result. | Fixed |
| C-10 | README audience sentences are short. | Fixed |
| C-11 | README opening uses concrete recorded content. | Fixed |
| C-12 | Lab describes the deliberately broken dialog and Escape exit. | Fixed |
| C-13 | README leads with user-visible storage/permission effects. | Fixed |
| C-14 | “Nearby control snapshot” is consistent in landing, demo, README, and export. | Fixed |
| C-15 | recording / trace / trace file terminology is consistent. | Fixed |
| C-16 | “Current trace” replaces slash wording. | Fixed |
| C-17 | Stop wording names the recorder bar. | Fixed |
| C-18 | Keys, focus, page, and controls are named. | Fixed |
| C-19 | “Screenshots are optional” is plain. | Fixed |
| C-20 | Manual install wording is plain. | Fixed |
| C-21 | Character masking wording matches tested behavior. | Fixed, subject to F-3-1 screenshot proof |
| C-22 | Free/browser-storage facts are concrete. | Fixed |
| F-2-1 | 1440 × 900 first screen contains all required information. | Fixed |
| F-2-2 | Sample export serializes Project name as `input` / `textbox`. | Fixed |
| F-2-3 | Current public copy consistently says nearby control snapshot(s). | Fixed |
| F-2-4 | Screen-recording comparison is absent from README. | Fixed |
| F-2-5 | Broad untested capture-limit statement is absent. | Fixed |
| F-2-6 | Current copy-audit count regression test passes. | Fixed |

The previous polish-2/handoff assertion of a fully passing browser suite is not currently reliable because of F-3-1. It is not accepted as closure.

## Missed leverage

No missing AI feature is identified. The brief calls for a local, reproducibility-focused raw interaction record; AI would not improve the first-order job and would weaken the privacy posture. The shipped product has the obvious export capability: a self-contained HTML trace file.

## What would make this perfect

Make screenshot masking acknowledge a completed paint and prove it reliably under the normal parallel browser suite. Then register and exercise the no-install populated-demo and reset-seed promises, or remove those promises. After repeated clean-clone full-suite passes, rerun this entire review with no remaining findings.
