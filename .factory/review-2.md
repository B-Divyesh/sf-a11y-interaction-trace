# Adversarial first-read review 2 — A11y Interaction Trace

**Verdict: FAIL**

Reviewed 2026-08-28 against production at <https://a11y-interaction-trace.sociobot.in> and clean checkout `911a8ddd7ce410b730af65ac2d6217ab91e51565`.

## Cold first read

Fresh contexts used no previous cookies or storage.

| Viewport | What does it do? | For whom? | What should I click first? | Result |
| --- | --- | --- | --- | --- |
| 390 × 844 | Records keyboard-focus failures as evidence. | Web developers and accessibility testers. | **Try it with sample data.** | Pass. The primary action and three facts fit before the artwork. |
| 1440 × 900 | The visible headline says it records keyboard-focus failures. | Cannot answer without scrolling. | Cannot identify the primary action without scrolling; only the secondary header download is visible. | **Fail.** |

At desktop size, the `h1` occupies y=205–866. The audience sentence starts at y=894, the sample-data action at y=1015, the outcome note at y=1143, and the facts at y=1195. The exact visible headline, “RECORD KEYBOARD FOCUS FAILURES FOR YOUR TEAM.”, does not identify the audience or the first action.

## Findings, ordered by severity

### BLOCKING F-2-1 — B-01 has regressed on desktop: the first screen does not identify the audience or first action

**Location and quote:** `/`, desktop 1440 × 900. “RECORD KEYBOARD FOCUS FAILURES FOR YOUR TEAM.” The required audience sentence, “For web developers and accessibility testers who need reproducible keyboard evidence without uploading a recording.”, and the primary “Try it with sample data” action are below the viewport.

**Why a visitor is lost:** The desktop visitor sees a headline and an unrelated header “Download ZIP” button, but neither the audience, outcome, nor try-first path. They cannot answer all three cold-read questions in one screen.

**Concrete fix:** Keep the wording but constrain the desktop hero heading to the design-system 48–56 px range (not its current 8vw / 7.4rem maximum), use a wider readable copy column, and require the heading, audience, primary action, outcome, and facts to fit at 1440 × 900. Add a desktop counterpart to the existing mobile first-screen test that asserts every required element ends at or above y=900.

### BLOCKING F-2-2 — The sample export records a textbox as a button

**Location and quote:** `/demo/` → **Download sample trace**. The downloaded `a11y-trace-sample-checkout.html` serializes “Project name” as `"tag":"button","role":"textbox"` in both the event and its nearby-control snapshot. The rendered sample labels it “textbox · Project name”.

**Why a visitor is misled:** The brief’s success measure requires correct keyboard actions and focus targets in a reproducible handoff. A native `button` is not this text entry control. The required realistic demo teaches the visitor to trust a structurally false trace, contradicting the claim that snapshots contain selected DOM details.

**Concrete fix:** Make the demo fixture emit `tag: "input"` for Project name (or derive it from a rendered input). Extend `@claim:snapshot-scope` to download the demo file and assert each event’s tag, role, name, and selector match the sample surface.

### BLOCKING F-2-3 — C-14 / UC-15 are not fully fixed: the scoped snapshot has inconsistent names

**Location and quote:** README opening: “This Chromium extension records keyboard actions, focus changes, **nearby controls**, and optional screenshots.” Demo lead: “A seeded trace shows the broken step, **nearby controls**, and the exported file…” Demo export preview: “Includes page details, timing, focus, **nearby controls**, and the scope note above.” Elsewhere the same thing is “a **nearby control snapshot**”.

**Why a visitor is lost:** “Nearby controls” can mean arbitrary page controls. “Nearby control snapshot” names the limited selected-DOM evidence actually exported. The prior closure says all variants were standardized, but the live demo and README retain both terms. This is an unfixed earlier terminology finding and is blocking under the work order.

**Concrete fix:** Use “nearby control snapshot” for the exported selected-DOM evidence everywhere. For example: “This Chromium extension records keyboard actions, focus changes, nearby control snapshots, and optional screenshots.” Update both demo strings and add their text to the terminology assertion.

### HIGH F-2-4 — README makes an unlisted comparative claim about screen recordings

**Location and quote:** README opening: “Use it when a screen recording does not show enough.”

**Why a visitor is misled:** This asks the visitor to rely on an unmeasured comparison. No `claims.json` entry names it, and no test can establish what “enough” means across screen recordings.

**Concrete fix:** Remove the comparison. Replace it with the covered, plain statement “Use it to record the keys and focus changes in a bug report.”

### HIGH F-2-5 — README states an unlisted capture-limit claim

**Location and quote:** README, **Limits**: “Browser permissions and page security policies can limit capture.”

**Why a visitor is misled:** This product boundary determines whether the extension works, but it has neither a `claims.json` entry nor a tagged test. The current start-boundary test does not exercise browser permission or page-policy failure.

**Concrete fix:** Remove it, or add a `capture-limits` claim and tagged extension test that attempts a restricted page, observes a plain recovery message, and proves no trace starts. State that specific boundary rather than the broad “security policies” phrase.

### MINOR F-2-6 — The shipped copy-audit proof has incorrect word counts

**Location and quote:** `.factory/copy-audit.md` counts the hero audience sentence as 14 words and “Nearby control snapshots are selected DOM details, not an operating-system accessibility tree.” as 11 words.

**Why this matters:** Their actual counts are 15 and 12. Neither exceeds the 22-word cap, but the document is presented as proof of the copy check and is cited by the handoff.

**Concrete fix:** Correct the counts and generate them from source text, or add a count test.

## Copy audit

Counts treat whitespace-separated words as words. No landing or README sentence exceeds 22 words; the longest is 16. No banned marketing adjective was found. Headings are understandable out of context. Buttons name their result: “Try it with sample data”, “Download extension ZIP”, “Open the sample trace”, and “Download A11y Interaction Trace v1”. “Start for real” follows the required demo-sandbox wording.

### Landing-page sentences

| # | Words | Sentence |
| ---: | ---: | --- |
| 1 | 7 | Record keyboard focus failures for your team. |
| 2 | 15 | For web developers and accessibility testers who need reproducible keyboard evidence without uploading a recording. |
| 3 | 7 | Opens a seeded dialog and sample trace. |
| 4 | 7 | Nothing is saved to your real data. |
| 5 | 11 | This trace pairs each keyboard action with its next focus target. |
| 6 | 7 | Events stay in the order they happened. |
| 7 | 10 | Three keyboard actions show when focus moves behind the dialog. |
| 8 | 6 | Recording starts when you select Start. |
| 9 | 11 | The toolbar badge and recorder bar show when capture is active. |
| 10 | 4 | Printable keys become “Character.” |
| 11 | 8 | Sensitive field values do not enter the trace. |
| 12 | 3 | Screenshots start off. |
| 13 | 8 | When enabled, capture uses the visible tested tab. |
| 14 | 12 | The exported file includes timing, focus, role, name, state, and scope notes. |
| 15 | 8 | The extension stores traces in browser extension storage. |
| 16 | 10 | The extension has no account, analytics, tracker, or upload service. |
| 17 | 8 | Exported trace files open without a network connection. |
| 18 | 12 | Nearby control snapshots are selected DOM details, not an operating-system accessibility tree. |
| 19 | 5 | Download and unzip the extension. |
| 20 | 9 | Open your browser’s Extensions page and enable Developer mode. |
| 21 | 12 | Choose “Load unpacked,” select the extracted folder, then pin the moss-path icon. |
| 22 | 4 | Reproduce the focus bug. |
| 23 | 2 | Record it. |
| 24 | 3 | Share the trace. |
| 25 | 13 | Use one local extension to capture an accessibility failure for a bug report. |
| 26 | 11 | Record keyboard actions and focus changes for an accessibility bug report. |
| 27 | 7 | The hero artwork is original generated imagery. |
| 28 | 9 | Interface marks and diagrams are hand-authored for this product. |

### README sentences

| # | Words | Sentence |
| ---: | ---: | --- |
| 1 | 13 | This Chromium extension records keyboard actions, focus changes, nearby controls, and optional screenshots. |
| 2 | 6 | It exports one HTML trace file. |
| 3 | 10 | For web developers, accessibility testers, QA engineers, and issue triagers. |
| 4 | 10 | Use it when a screen recording does not show enough. |
| 5 | 5 | Open the sample link once. |
| 6 | 12 | It shows a checkout dialog and four ordered events without an install. |
| 7 | 5 | The banner identifies demo mode. |
| 8 | 14 | Reset demo restores the original sample, and Start for real removes all demo data. |
| 9 | 8 | Demo data uses local-storage keys beginning with `demo:a11y-interaction-trace:`. |
| 10 | 9 | The demo never reads or changes other storage keys. |
| 11 | 10 | The snapshot is not the browser or operating-system accessibility tree. |
| 12 | 16 | Run `npm ci` and `npm run build`, or download the extension ZIP from the live site. |
| 13 | 2 | Unzip `dist/site/downloads/a11y-interaction-trace.zip`. |
| 14 | 6 | Open your Chromium browser’s Extensions page. |
| 15 | 7 | Enable Developer mode and choose Load unpacked. |
| 16 | 8 | Select the extracted directory and pin the extension. |
| 17 | 5 | Open the page under test. |
| 18 | 14 | The included `/lab/` page has a deliberately broken dialog with an Escape key exit. |
| 19 | 3 | Open the extension. |
| 20 | 10 | Screenshots are off until you enable them for that recording. |
| 21 | 12 | Select Start on this tab, then reproduce the issue with the keyboard. |
| 22 | 9 | Stop from the recorder bar or the extension popup. |
| 23 | 12 | Select Export trace file, then attach the HTML file to the issue. |
| 24 | 6 | Select Clear local trace when finished. |
| 25 | 9 | The current trace stays in browser extension storage (`chrome.storage.local`). |
| 26 | 11 | The extension has no account, analytics, tracker, API, or upload service. |
| 27 | 5 | Its manifest requests four permissions. |
| 28 | 11 | `activeTab` and `scripting` run the recorder in the tab you choose. |
| 29 | 8 | `storage` keeps the current trace in the browser. |
| 30 | 5 | `downloads` saves the trace file. |
| 31 | 6 | The manifest has no host permissions. |
| 32 | 10 | Sensitive field values are excluded before optional screenshots are captured. |
| 33 | 7 | The commands below use Node.js and npm. |
| 34 | 14 | The production build creates the unpacked extension, packaged ZIP, deployable site, and public download. |
| 35 | 5 | Claim `packaged-build` verifies every artifact. |
| 36 | 6 | The static deployment root is `dist/site`. |
| 37 | 12 | Build it with `npm ci`, `npm test`, and `npm run build:site`. |
| 38 | 9 | The factory deploys that directory with `/opt/fleet/lib/deploy-static.sh a11y-interaction-trace dist/site`. |
| 39 | 6 | Infrastructure changes happen outside this repository. |
| 40 | 12 | After deployment, check `/`, `/demo/`, `/lab/`, `/privacy/`, `/terms/`, and an unknown path. |
| 41 | 9 | The unknown path must return the styled 404 response. |
| 42 | 7 | Version 1 is packaged for Chromium browsers. |
| 43 | 7 | Nearby control snapshots contain selected DOM details. |
| 44 | 9 | Browser permissions and page security policies can limit capture. |
| 45 | 7 | Review each trace file before sharing it. |
| 46 | 6 | The source uses the MIT License. |
| 47 | 11 | Generated hero provenance and the visual system are documented in `.factory/design.md`. |

Technical terms in installation and permission instructions are appropriate for the named developer/tester audience. `DOM` is only clear in that context; the visitor-facing demo should retain the plainer “nearby control snapshot” label.

## Demo, privacy, and claims verification

- Entered `/?demo=1` from a fresh 390 px context. It redirected to `/demo/` and immediately showed the checkout dialog, a stopped trace instrument, and four ordered events. The persistent banner says “Demo — sample data, nothing is saved”, exposes **Reset demo** and **Start for real**, and Reset restored the seed.
- Seeded `real:sentinel=immutable` and `trace=real-trace` before demo. Replay and Reset left both values byte-for-byte unchanged; only `demo:a11y-interaction-trace:state` was written. Requests during the flow were same-origin only.
- Loaded `/` once, waited for the service worker, set the context offline, and reloaded. The landing `h1` and offline notice remained available with no console errors.
- Ran all 17 distinct commands in `.factory/claims.json` from `/tmp/a11y-review-clean`, a fresh clone at the reviewed commit. They passed. A final clean `npm run test:claims` passed 27 Playwright tests; `test-results/.last-run.json` records `status: passed`. Thus no listed claim test failed. F-2-2 identifies a gap in an observable assertion, not a command failure.

## Structure and accessibility verification

- `/`, `/demo/`, `/lab/`, `/privacy/`, `/terms/`, and the ZIP returned 200. An unknown route returned the designed page with HTTP 404.
- All discovered links resolved: home, hash anchors, demo, lab, privacy, terms, ZIP, the 404 return link, and the GitHub source.
- Routes have their own titles, descriptions, canonicals, Open Graph/Twitter metadata, favicon, `lang=en`, a single `h1`, and a `main` landmark. The header/footer, skip link, legal links, route focus, polite route announcement, and 404 return path are present.
- `npm test` (8 tests), `npm run check`, `npm run build`, and `npm run test:a11y` (27 tests) passed in the clean clone. The browser suite includes axe serious/critical checks. The live first-read checks showed no console errors; mobile had no horizontal overflow; visible links/buttons meet 44 px.
- The concrete-and-moss art direction is distinct and matches `.factory/design.md`; it is not a generic SaaS template. The failure is its desktop typography scale, not its visual identity.

## Earlier finding closure check

Every earlier review/polish/handoff item was rechecked live and in code; no prior “fixed” label was accepted without evidence.

| Earlier item(s) | Current result |
| --- | --- |
| B-01 | **Regressed — F-2-1.** Desktop hides audience and primary demo action. |
| B-02 | Confirmed: direct demo entry, populated trace, banner, reset, start-for-real, prefix-only storage, and demo documentation exist. |
| B-03 | Confirmed: `claims.json` has 17 IDs and one distinct tagged command per ID; all passed clean. |
| B-04 | Confirmed: unknown production route responds 404 with the styled page. |
| H-01, H-02, H-03 | Confirmed: metadata, route focus/announcement, and mobile target checks are present and tested. |
| M-01, M-02, N-01 | Confirmed: shared route skeleton/footer, README demo/deploy details, and decorative-image empty alt are present. |
| C-01–C-13, C-15–C-22 | Confirmed. The copy is short, action-labelled, and uses repaired terms where those concepts appear. |
| C-14 | **Unfixed/regressed — F-2-3.** “Nearby controls” remains in the README and live demo copy. |
| UC-01–UC-14, UC-16–UC-30 | Confirmed by current copy and claim behavior, apart from the newly identified unlisted claims F-2-4 and F-2-5. |
| UC-15 | **Unfixed/regressed — F-2-3.** The claimed all-variants terminology replacement is incomplete. |
| Polish-1 final verification/handoff | Rechecked rather than accepted at face value. Its desktop evidence missed the 1440 px first-screen regression, and its terminology assertion is contradicted by current live copy. |

## What would make this perfect

Fit the entire desktop first-read contract in one viewport, make the sample export semantically true, use one name for selected-DOM evidence, and remove or test every remaining public boundary statement. Then add the specified regressions, regenerate the copy audit, and repeat the complete review with zero findings.
