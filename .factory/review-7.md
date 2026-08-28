# Adversarial first-read review 7 — A11y Interaction Trace

**Verdict: PASS**

Reviewed 2026-08-28 against <https://a11y-interaction-trace.sociobot.in>
and clean commit `a2c8e14cf1a28b59b5869d5be97786148c44929b`.

There are zero blocking, high, medium, or minor findings. Every registered
claim was tested independently from a fresh clone. No public claim remains
untested.

## Cold first read

Fresh Chromium contexts were opened at 390 × 844 and 1440 × 900 with no
cookies, storage, or prior navigation. Nothing was scrolled before recording
the answers.

| Viewport | What does this do? | For whom? | What should I click first? | Result |
| --- | --- | --- | --- | --- |
| 390 × 844 | Records keyboard-focus failures as evidence for a team. | Web developers and accessibility testers. | **Try it with sample data.** | Pass; the headline, audience, action, outcome, and all three facts end above the fold. |
| 1440 × 900 | Records keyboard-focus failures as evidence for a team. | Web developers and accessibility testers. | **Try it with sample data.** | Pass; the same required content is visible before the artwork strip. |

The exact text that supplies those answers is “Record keyboard focus failures
for your team.”, “For web developers and accessibility testers who need
reproducible keyboard evidence without uploading a recording.”, and “Try it
with sample data.” The adjacent outcome says, “Opens a checkout dialog with a
completed sample trace. Nothing is saved to your real data.” No first-screen
text failed the three-question check.

## Findings

None.

## Copy audit

Counts are whitespace-delimited; hyphenated, slash-connected, quoted, and code
tokens each count as one word. The hidden offline status is included because it
is landing-page copy. No sentence exceeds 22 words, no banned marketing word
appears, and the average is below 14 words.

### Landing-page sentences

| ID | Words | Exact sentence | Audit |
| --- | ---: | --- | --- |
| L-01 | 2 | You’re offline. | Pass. |
| L-02 | 5 | The cached pages still work. | `offline-site`. |
| L-03 | 5 | Downloads may need a connection. | Plain limitation. |
| L-04 | 7 | Record keyboard focus failures for your team. | Pass; job-led h1. |
| L-05 | 15 | For web developers and accessibility testers who need reproducible keyboard evidence without uploading a recording. | Pass; audience and outcome. |
| L-06 | 9 | Opens a checkout dialog with a completed sample trace. | `demo-entry`. |
| L-07 | 7 | Nothing is saved to your real data. | `demo-isolation`. |
| L-08 | 1 | Free. | `free-mit`. |
| L-09 | 4 | Packaged for Chromium browsers. | `chromium-package`. |
| L-10 | 6 | Stores traces only in your browser. | `local-no-upload`. |
| L-11 | 11 | This trace pairs each keyboard action with its next focus target. | `chronological-order`. |
| L-12 | 7 | Events stay in the order they happened. | `chronological-order`. |
| L-13 | 10 | Three keyboard actions show when focus moves behind the dialog. | `seeded-focus-defect`. |
| L-14 | 6 | Recording starts when you select Start. | `explicit-recording`. |
| L-15 | 11 | The toolbar badge and recorder bar show when capture is active. | `explicit-recording`. |
| L-16 | 4 | Printable keys become “Character.” | `key-privacy`. |
| L-17 | 8 | Sensitive field values do not enter the trace. | `sensitive-mask`. |
| L-18 | 3 | Screenshots start off. | `screenshot-boundary`. |
| L-19 | 8 | When enabled, capture uses the visible tested tab. | `screenshot-boundary`. |
| L-20 | 12 | The exported file includes timing, focus, role, name, state, and scope notes. | `trace-export-content`. |
| L-21 | 8 | The extension stores traces in browser extension storage. | `local-no-upload`. |
| L-22 | 10 | The extension has no account, analytics, tracker, or upload service. | `local-no-upload`. |
| L-23 | 8 | Exported trace files open without a network connection. | `offline-export`. |
| L-24 | 12 | Nearby control snapshots are selected DOM details, not an operating-system accessibility tree. | `snapshot-scope`. |
| L-25 | 5 | Download and unzip the extension. | Plain instruction. |
| L-26 | 9 | Open your browser’s Extensions page and enable Developer mode. | Plain instruction. |
| L-27 | 12 | Choose “Load unpacked,” select the extracted folder, then pin the moss-path icon. | Plain instruction. |
| L-28 | 4 | Reproduce the focus bug. | Pass. |
| L-29 | 2 | Record it. | Clear from the preceding sentence. |
| L-30 | 3 | Share the trace. | Pass. |
| L-31 | 13 | Use one local extension to capture an accessibility failure for a bug report. | Pass. |
| L-32 | 11 | Record keyboard actions and focus changes for an accessibility bug report. | Pass. |
| L-33 | 7 | Version 1.0.0 · Built by Param Factory. | `packaged-build`; ownership/build label. |
| L-34 | 7 | The hero artwork is original generated imagery. | `provenance`. |
| L-35 | 9 | Interface marks and diagrams are hand-authored for this product. | `provenance`. |

### README sentences

| ID | Words | Exact sentence | Audit |
| --- | ---: | --- | --- |
| R-01 | 14 | This Chromium extension records keyboard actions, focus changes, nearby control snapshots, and optional screenshots. | Covered by recording, snapshot, and screenshot claims. |
| R-02 | 6 | It exports one HTML trace file. | `trace-export-content`. |
| R-03 | 10 | For web developers, accessibility testers, QA engineers, and issue triagers. | Pass. |
| R-04 | 12 | Use it to record keys and focus changes in a bug report. | Pass. |
| R-05 | 5 | Open the sample link once. | Instruction. |
| R-06 | 12 | It shows a checkout dialog and four ordered events without an install. | `demo-entry`. |
| R-07 | 5 | The banner identifies demo mode. | `demo-isolation`. |
| R-08 | 7 | Reset demo restores the original four-event sample. | `demo-reset`. |
| R-09 | 7 | Start for real removes all demo data. | `demo-isolation`. |
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
| R-26 | 6 | Select **Clear local trace** when finished. | Instruction covered by `local-no-upload`. |
| R-27 | 9 | The current trace stays in browser extension storage (`chrome.storage.local`). | `local-no-upload`. |
| R-28 | 11 | The extension has no account, analytics, tracker, API, or upload service. | `local-no-upload`. |
| R-29 | 5 | Its manifest requests four permissions. | `manifest-permissions`. |
| R-30 | 11 | `activeTab` and `scripting` run the recorder in the tab you choose. | `manifest-permissions` and `explicit-recording`. |
| R-31 | 8 | `storage` keeps the current trace in the browser. | `manifest-permissions` and `local-no-upload`. |
| R-32 | 5 | `downloads` saves the trace file. | `manifest-permissions` and export tests. |
| R-33 | 6 | The manifest has no host permissions. | `manifest-permissions`. |
| R-34 | 10 | Sensitive field values are excluded before optional screenshots are captured. | `sensitive-mask`. |
| R-35 | 7 | The commands below use Node.js and npm. | Development context. |
| R-36 | 14 | The production build creates the unpacked extension, packaged ZIP, deployable site, and public download. | `packaged-build`. |
| R-37 | 5 | Claim `packaged-build` verifies every artifact. | Registry pointer. |
| R-38 | 6 | The static deployment root is `dist/site`. | Build/deploy instruction. |
| R-39 | 12 | Build it with `npm ci && npm test && npm run build:site`. | Instruction. |
| R-40 | 9 | The factory deploys that directory with `/opt/fleet/lib/deploy-static.sh a11y-interaction-trace dist/site`. | Internal instruction. |
| R-41 | 6 | Infrastructure changes happen outside this repository. | Scope instruction. |
| R-42 | 12 | After deployment, check `/`, `/demo/`, `/lab/`, `/privacy/`, `/terms/`, and an unknown path. | Instruction. |
| R-43 | 9 | The unknown path must return the styled 404 response. | `designed-404`. |
| R-44 | 7 | Version 1 is packaged for Chromium browsers. | `chromium-package`. |
| R-45 | 7 | Nearby control snapshots contain selected DOM details. | `snapshot-scope`. |
| R-46 | 7 | Review each trace file before sharing it. | Advice. |
| R-47 | 6 | The source uses the MIT License. | `free-mit`. |
| R-48 | 11 | Generated hero provenance and the visual system are documented in `.factory/design.md`. | `provenance`. |

### Headings, actions, jargon, and terminology

Landing headings identify their content without decorative context, including
“Record what changed after each key,” “Focus leaves a dialog,” “Record only
when you choose,” “Typed words stay private,” “Screenshots are optional,”
“Open the trace file offline,” “Keep the trace on your machine,” and “Install
the extension ZIP.” README headings name the sample, recording, installation,
privacy, development, deployment, limits, and license sections.

Every product action names its result or destination: **Try it with sample
data**, **Download extension ZIP**, **Open the sample trace**, **Download A11y
Interaction Trace v1**, **Replay sample**, **Reset demo**, and **Download sample
trace**. **Start for real** is the prescribed demo-exit label. Technical tokens
such as `activeTab`, `chrome.storage.local`, DOM, Chromium, and Developer mode
appear only where the named developer/tester audience needs the exact platform
term. Core terms remain consistent: `recording`, `trace`, `trace file`, `nearby
control snapshot`, `Chromium browser`, and `demo`. No rewrite is proposed
because there is no copy flag.

## Demo and sandbox verification

- The landing action reached `/demo/` in one click and the first rendered view
  already showed the checkout dialog, Project name field, escaped-focus state,
  and the four realistic events: Recording started, Enter, Shift + Tab, and
  Escape.
- The persistent banner said “Demo — sample data, nothing is saved,” followed
  by “Real traces are never read or changed,” with **Reset demo** and **Start
  for real** controls.
- Replay changed the demo state. Reset restored the original 1,790-byte state
  byte-for-byte and removed an added demo-prefixed mutation.
- `real:review7-sentinel=preserve-me` and
  `a11y-interaction-trace:real-trace=real-trace-value` remained byte-identical
  through replay, reset, offline reload, and exit. Exit removed every `demo:`
  key.
- After one visit, `/demo/` reloaded offline and both Replay and Reset remained
  operable. Network interception observed only the product origin.
- The registered test downloaded the production sample file, opened that saved
  file in a fresh offline browser context, checked representative focus and
  snapshot content, and observed zero HTTP(S), console, or page errors.

## Claims verification

Fresh clone: `/tmp/a11y-review7-clean-VtYsXB/repo`. Each exact `test` command
from `.factory/claims.json` was invoked independently after `npm ci`.

| Claim ID | Result | Observable coverage checked |
| --- | --- | --- |
| demo-isolation | Pass | Prefix-only writes, reset/exit, deletion, and real sentinels. |
| demo-entry | Pass | Landing click, canonical route, dialog, field, four events, no extension runtime. |
| demo-reset | Pass | Mutated state returns byte-for-byte to the original seed. |
| trace-export-content | Pass | Downloaded HTML contains actions, focus, page, and snapshot evidence. |
| chronological-order | Pass | Visible, stored, and downloaded action/time pairs match. |
| seeded-focus-defect | Pass | Shift+Tab escapes; Escape restores the opener. |
| explicit-recording | Pass | Pre-start input is absent from storage/export; indicators and both Stop paths work. |
| key-privacy | Pass | Typed input becomes Character; navigation keys remain named. |
| sensitive-mask | Pass | Structured secrets are absent and all four sensitive regions are masked in every JPEG. |
| screenshot-boundary | Pass | Default-off, visible-tab capture, and 12-image cap. |
| offline-export | Pass | Actual downloaded file opens offline with no network request or error. |
| offline-site | Pass | Five routes reload offline; demo Replay and Reset work offline. |
| local-no-upload | Pass | Extension storage/clear, same-origin traffic, and no transfer code. |
| snapshot-scope | Pass | Accurate selected DOM tag/role/name/selector data and explicit limitation. |
| manifest-permissions | Pass | Exact four permissions and no host permissions. |
| chromium-package | Pass | Loadable Chromium MV3 action and service worker package. |
| packaged-build | Pass | Unpacked extension, ZIP, site, and public download exist and are non-empty. |
| free-mit | Pass | Visible free fact, MIT grant, and no billing integration. |
| provenance | Pass | Generated source/prompt, authored SVG, and design provenance. |
| designed-404 | Pass | Unknown built path returns HTTP 404 with styled heading and working return link. |

All landing and README claim-like sentences map to the entries shown in the
copy audit. No unlisted claim was found.

## Earlier finding closure

Every `review-1.md` through `review-6.md`, every `polish-1.md` through
`polish-6.md`, and the prior handoff were read. Each item below was checked in
the current code and, where applicable, on the byte-matching live deployment.

### Review 1: discovery and structure

| ID | Current confirmation |
| --- | --- |
| B-01 | Both first screens expose job, audience, sample action, outcome, and facts. |
| B-02 | One-click populated demo, banner, Reset, exit, isolated namespace, and demo documentation work. |
| B-03 | The registry has 20 complete unique entries and one matching tagged test each; all pass. |
| B-04 | The live unknown route and built-site test return the designed HTTP 404. |
| H-01 | Route titles, descriptions, canonicals where indexable, social metadata, icons, and theme colors are complete. |
| H-02 | Direct entry, link navigation, and Back focus and announce the h1; Back also restored the measured 5,330 px scroll position. |
| H-03 | The live 390 px target-size check passes on every route. |
| M-01 | Stable header/footer, purpose, legal/source links, version, and Param Factory credit remain. |
| M-02 | README documents demo, isolation, build, test, deploy, and live checks. |
| N-01 | Decorative hero art retains `alt=""`; all six Axe scans report zero violations. |

### Review 1: unlisted/public claims

| ID | Current confirmation |
| --- | --- |
| UC-01 | Downloaded sample contains actions, focus, page details, and snapshots. |
| UC-02 | Free, Chromium, and no-account/upload facts are separately tested. |
| UC-03 | Visible, stored, and downloaded events retain complete action/time order. |
| UC-04 | Shift+Tab escape and Escape recovery work in the keyboard lab. |
| UC-05 | A pre-start action is absent from storage and export. |
| UC-06 | Badge, recorder bar, and both Stop paths are exercised. |
| UC-07 | Typed characters are masked while navigation keys stay identifiable. |
| UC-08 | Structured secrets and every tested screenshot region remain masked. |
| UC-09 | Screenshots start off. |
| UC-10 | Capture uses the visible tab and enforces the 12-image cap. |
| UC-11 | Export contains the named evidence fields and scope note. |
| UC-12 | The real downloaded trace and all visited public routes work in the tested offline scenario. |
| UC-13 | Trace data uses extension storage; Clear, demo Reset, and exit affect only their intended namespaces. |
| UC-14 | Demo and extension flows show no tracking, account, API, upload, or third-party runtime request. |
| UC-15 | UI/export consistently name and limit the nearby control snapshot. |
| UC-16 | README outcomes map to recording, key, export, snapshot, and screenshot claims. |
| UC-17 | The unsupported external browser-platform assertion remains absent. |
| UC-18 | The built manifest retains the exact four permissions and no hosts. |
| UC-19 | The untested browser-internal-page promise remains absent. |
| UC-20 | The thirteenth capture receives the explicit 12-capture limit result. |
| UC-21 | All documented build artifacts are created and checked. |
| UC-22 | Architecture-only marketing promises remain absent. |
| UC-23 | Demo/export retain the selected-DOM limitation. |
| UC-24 | The untested cross-origin-grant assertion remains absent. |
| UC-25 | The untested Shadow DOM/iframe assertion remains absent. |
| UC-26 | Generated-art source/prompt and authored-mark provenance remain recorded. |
| UC-27 | MIT, free, and no-billing evidence pass. |
| UC-28 | Copy uses the observable keyboard-action-to-focus statement. |
| UC-29 | Copy names the concrete local bug-report job. |
| UC-30 | The unverified Node-version promise remains absent. |

### Review 1: copy

| ID | Current confirmation |
| --- | --- |
| C-01 | Hero copy is short and job-led. |
| C-02 | “Keyboard and focus evidence” replaces unexplained MV3 jargon. |
| C-03 | The evidence heading names what changes after each key. |
| C-04 | “Share the trace” names the artifact. |
| C-05 | Export copy names timing, focus, role, name, state, and scope. |
| C-06 | Closing steps name the focus bug, recording, and trace. |
| C-07 | Subjective attachment/actionability wording remains absent. |
| C-08 | The local-extension bug-report sentence remains concrete. |
| C-09 | ZIP actions name the extension result. |
| C-10 | README identifies its audience in short sentences. |
| C-11 | README opening names concrete recorded evidence and output. |
| C-12 | Lab copy names the deliberately broken dialog and Escape exit. |
| C-13 | Storage and permission copy leads with user-visible effects. |
| C-14 | “Nearby control snapshot” remains the single selected-DOM term. |
| C-15 | Recording, trace, and trace file retain distinct meanings. |
| C-16 | “Current trace” remains standardized. |
| C-17 | Stop wording names the recorder bar. |
| C-18 | Copy names keys, focus, page, and controls. |
| C-19 | Screenshot wording remains literal and optional. |
| C-20 | Manual installation wording remains plain. |
| C-21 | Character/sensitive-value wording matches tested behavior. |
| C-22 | Free and browser-storage facts remain concrete. |

### Reviews 2–6

| ID | Current confirmation |
| --- | --- |
| F-2-1 | Desktop first-read content fits inside 1440 × 900. |
| F-2-2 | Project name exports as `input` / `textbox`. |
| F-2-3 | Snapshot terminology is consistent in live UI, docs, storage, and export. |
| F-2-4 | The untestable screen-recording comparison remains absent. |
| F-2-5 | The broad untested capture-limit statement remains absent. |
| F-2-6 | Every numeric row in the shipped copy audit passes its count regression. |
| F-3-1 | Painted-mask acknowledgement and concurrent screenshot coverage pass in the full suite. |
| F-3-2 | Separate demo-entry and demo-reset registry entries and tests pass. |
| F-4-1 | Corrected audit counts remain accurate and regression-tested. |
| F-5-1 | Chronology compares actual UI, demo storage, and downloaded production data. |
| F-5-2 | Offline-site covers all five routes plus interactive demo controls. |
| F-6-1 | Pre-start input is absent from actual stored and downloaded traces. |
| F-6-2 | Offline-export opens the actual file emitted by the demo. |
| F-6-3 | The registry explicitly states and tests Start for real deleting demo data. |
| F-6-4 | Styled 404 behavior has a registry entry and tagged HTTP-level test. |
| F-6-5 | “Seeded dialog” was replaced by the concrete checkout-dialog outcome. |

No earlier finding is unfixed, half-fixed, or regressed.

## Structure, accessibility, and visual identity

| Check | Result and evidence |
| --- | --- |
| Titles | Pass. Home is “A11y Interaction Trace — record keyboard focus bugs”; inner routes use “Route — A11y Interaction Trace”; all are under 60 characters. |
| Semantic structure | Pass. Each of `/`, `/demo/`, `/lab/`, `/privacy/`, `/terms/`, and `/404.html` has `lang=en`, one h1, and one main. |
| Metadata | Pass. Each real route has a description, canonical, OG/Twitter metadata, favicon, touch icon, and palette theme color. The noindex 404 intentionally has no canonical. |
| Routing | Pass. Deep links load correctly; route entry and Back focus/announce the h1; Back restored scroll; unknown paths return the styled 404. |
| Links | Pass. Every discovered document, fragment, download, and labelled external-source target resolved; the ZIP and GitHub source returned 200. |
| Header/footer | Pass. The wordmark, bounded navigation, skip link, purpose, Privacy, Terms, source label, version, and Param Factory credit are consistent. |
| Accessibility | Pass. Live Playwright/Axe produced zero violations across all six routes; 44 px targets, keyboard lab flow, visible focus, reduced motion, contrast, and responsive overflow checks pass. |
| Console/security | Pass. Real routes logged no errors and send CSP, Referrer-Policy, and X-Content-Type-Options. The expected browser resource message for the main document’s deliberate HTTP 404 is not a script error. |
| Assets/performance | Pass. Site JavaScript totals 11,105 uncompressed bytes; images reserve dimensions; fonts/scripts are local; build emits `dist/`. |
| Discovery files | Pass. `robots.txt` and `sitemap.xml` are live and list all indexable routes. |
| Identity | Pass. Concrete grid, moss trace seam, hard slab outlines, compressed type, original slab art, and bespoke 404 match `.factory/design.md`; this is not a generic SaaS template. |

The deployed HTML for all five indexable routes and the 404 is byte-identical
to the current build. The live and clean ZIP SHA-256 is
`f44101682b7df28e3094a48b56cb370720a0337e96195eeae9d5a2981bd6e887`.

## Verification summary

- `npm ci` in the fresh clone — pass; zero audit vulnerabilities.
- All 20 exact `.factory/claims.json` commands — 20/20 pass independently.
- `npm test` — 11/11 pass.
- `npm run check` — pass.
- `npm run build` — pass; extension, ZIP, and `dist/site/` produced.
- `npm run test:a11y` — 31/31 pass.
- Live route/Axe/offline suite after building its local 404 fixture — 13/13
  pass.
- `/opt/fleet/lib/verify-url.sh` — HTTP 200, correct title, `lang=en`, one h1,
  one main, no missing alt text or unnamed buttons, and no console errors.
- Independent live Axe scan — zero violations on all six routes.
- Live crawl — every unique link/fragment passed; unknown path returned 404.

## Missed leverage

No missing AI, import, export, or sync feature is implied by the brief. The
self-contained HTML export already supplies the expected handoff. AI or sync
would add network, key, and privacy costs without improving capture fidelity;
trace-file import is unnecessary because each exported file is its own viewer.

## What would make this perfect

Nothing remains to change or test within this work order. Preserve the current
claim-to-test mapping, isolated demo namespace, offline downloaded-file check,
and concrete-and-moss identity in future changes.
