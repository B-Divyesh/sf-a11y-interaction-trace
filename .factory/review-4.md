# Adversarial first-read review 4 — A11y Interaction Trace

**Verdict: FAIL**

Reviewed 2026-08-28 against <https://a11y-interaction-trace.sociobot.in> and a
fresh clone of commit `77d8e2dfcc3c9dcfbed32c5c7a56682bad321f25`.

One finding remains. The live product, demo, claims, routing, and interaction
checks pass, but the shipped copy-audit proof has regressed: four stated word
counts are incorrect. This repeats F-2-6; the work order makes that regression
blocking.

## Finding

### BLOCKING F-4-1 — F-2-6 has regressed: the shipped copy-audit proof has four incorrect word counts

**Location and exact text:** `.factory/copy-audit.md`, “Remaining landing
sentences” and “Demo, README, and catalog promises.”

| Copy | Stated | Actual |
| --- | ---: | ---: |
| “Choose ‘Load unpacked,’ select the extracted folder, then pin the moss-path icon.” | 11 | 12 |
| “Use one local extension to capture an accessibility failure for a bug report.” | 12 | 13 |
| “Record keyboard actions and focus changes for an accessibility bug report.” | 10 | 11 |
| “Record keyboard focus failures and export a local trace for your team.” | 11 | 12 |

**Why this fails the review:** The plain-words proof is meant to be a
verifiable inventory. These rows say “Pass” with false counts. The public copy
is still below 22 words, but the evidence stating that every sentence was
counted is unreliable. It is exactly the accuracy defect previously closed as
F-2-6, so it is blocking under the history requirement.

**Concrete fix:** Change the counts to 12, 13, 11, and 12. Extend
`tests/copy-audit.test.ts` to parse every numeric audit row and compare it to
the whitespace-delimited source text, then regenerate the audit.

## Cold first read

Fresh Chromium contexts were opened at 390 × 844 and 1440 × 900 before
scrolling.

| Viewport | What it does | For whom | What to click first | Result |
| --- | --- | --- | --- | --- |
| 390 × 844 | Records a keyboard-focus failure as evidence for a bug report. | Web developers and accessibility testers. | “Try it with sample data.” | Pass; headline, audience, action, outcome, and three facts were visible with no horizontal overflow. |
| 1440 × 900 | Records a keyboard-focus failure as evidence for a bug report. | Web developers and accessibility testers. | “Try it with sample data.” | Pass; the outcome note and final fact ended above 900 px. |

The first screen says “Record keyboard focus failures for your team.”, “For web
developers and accessibility testers who need reproducible keyboard evidence
without uploading a recording.”, and “Try it with sample data.” It answers all
three cold-read questions without scrolling. No console error occurred.

## Copy audit

Counts use whitespace-delimited words; hyphenated or quoted tokens count as one.
Every actual landing/README sentence is listed below. No actual count exceeds
22. No banned marketing adjective, inconsistent core term, unclear heading, or
non-result-naming action was found. The count-document defect is F-4-1.

### Landing page

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

Checked heading/label fragments: “Keyboard and focus evidence,” “Record what
changed after each key,” “Focus leaves a dialog,” “Capture boundaries,” “Record
only when you choose,” “Typed words stay private,” “Screenshots are optional,”
“Open the trace file offline,” “Keep the trace on your machine,” and “Install
the extension ZIP.” They make sense out of context. “Try it with sample data,”
“Download extension ZIP,” “Open the sample trace,” and “Download A11y
Interaction Trace v1” name their result.

### README

| ID | Words | Sentence |
| --- | ---: | --- |
| R-01 | 14 | This Chromium extension records keyboard actions, focus changes, nearby control snapshots, and optional screenshots. |
| R-02 | 6 | It exports one HTML trace file. |
| R-03 | 10 | For web developers, accessibility testers, QA engineers, and issue triagers. |
| R-04 | 12 | Use it to record keys and focus changes in a bug report. |
| R-05 | 5 | Open the sample link once. |
| R-06 | 12 | It shows a checkout dialog and four ordered events without an install. |
| R-07 | 5 | The banner identifies demo mode. |
| R-08 | 14 | Reset demo restores the original four-event sample, and Start for real removes all demo data. |
| R-09 | 8 | Demo data uses local-storage keys beginning with `demo:a11y-interaction-trace:`. |
| R-10 | 9 | The demo never reads or changes other storage keys. |
| R-11 | 10 | See `.factory/demo.md` for the exact seed and isolation checks. |
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

README headings (“Try the sample trace,” “What version 1 records,” “Install the
extension,” “Record a trace,” “Privacy and permissions,” “Develop and verify,”
“Deploy,” “Limits,” and “License and visual assets”) identify their content.
No generic action label was found.

## Demo, sandbox, and privacy checks

- The first-screen action entered `/demo/` in one click and immediately
  showed a checkout dialog, Project name field, escaped-focus state, and the
  four ordered events: Recording started, Enter, Shift + Tab, and Escape.
- The persistent banner read “Demo — sample data, nothing is saved,” stated
  real traces are never read or changed, and exposed Reset demo and Start for
  real.
- After seeding `real:sentinel=immutable` and `trace=real-data`, replay and
  reset changed only `demo:a11y-interaction-trace:state`. Both real values
  remained byte-identical. Start for real removed the demo key and retained both
  real values.
- Live interception saw only the product origin during this flow. Registered
  privacy/offline tests intercept the demo and extension flows; offline export
  observes zero requests and offline-site reloads after going offline.

## Claims verification

A fresh clone at `/tmp/a11y-review-4-clean` passed `npm ci`, `npm test`
(10), `npm run check`, and `npm run build`. Every exact command listed in
`.factory/claims.json` was invoked independently; all passed. A subsequent
`npm run test:a11y` passed 31/31, including the prior parallel
sensitive-screenshot regression.

| Claim ID | Result |
| --- | --- |
| demo-isolation | Pass |
| demo-entry | Pass |
| demo-reset | Pass |
| trace-export-content | Pass |
| chronological-order | Pass |
| seeded-focus-defect | Pass |
| explicit-recording | Pass |
| key-privacy | Pass |
| sensitive-mask | Pass |
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

Landing and README behavior claims map to these entries; no unlisted
claim-like sentence was found. “Review each trace file before sharing it” is
advice, not a promise of product behavior.

## Structure, routing, and accessibility

- Live `/`, `/demo/`, `/lab/`, `/privacy/`, `/terms/`, and
  `/404.html` each had `lang=en`, one main, one h1, route-specific title,
  description, Open Graph/Twitter metadata, favicon, apple-touch icon, and
  theme color. Indexable routes had canonicals; the non-indexed 404
  intentionally does not.
- Crawled internal documents and the extension ZIP returned 200. The external
  Source link is labelled. An unknown live path returned HTTP 404 and the
  designed “This path has no recorded step.” page with a Return to product
  action.
- `BASE_URL=https://a11y-interaction-trace.sociobot.in npx playwright test
  tests/e2e/site.spec.ts --workers=2` passed 13/13: route Axe checks, focus/
  Back, mobile targets, first-screen bounds, 404 mapping, and offline reload.
- CSP, `X-Content-Type-Options`, and `Referrer-Policy` headers are live;
  `robots.txt` and `sitemap.xml` are present. The concrete/moss workbench,
  bespoke slab art, hard outlines, and 404 match `.factory/design.md` and are
  not a generic SaaS template.

## Earlier finding closure check

Every prior review, polish record, and handoff was read and rechecked in current
code and on the live product.

| Earlier IDs | Current result |
| --- | --- |
| B-01, F-2-1 | Confirmed: both first screens expose job, audience, demo action, outcome, and facts. |
| B-02 | Confirmed: direct populated demo, banner, reset, exit, isolated namespace, and documentation. |
| B-03 | Confirmed: 19 complete unique tagged claims passed from a clean clone. |
| B-04 | Confirmed: styled live HTTP 404. |
| H-01, H-02, H-03 | Confirmed: metadata, route focus/announcement, and mobile targets. |
| M-01, M-02, N-01 | Confirmed: shared skeleton/footer, README handoff, and decorative empty alt. |
| UC-01–UC-07 | Confirmed: export/order, lab defect, explicit recording, and key privacy. |
| UC-08, F-3-1 | Confirmed: full 31-test suite passed sensitive masking and concurrent capture. |
| UC-09–UC-15 | Confirmed: screenshot, offline, local-only/no-upload, and scope checks. |
| UC-16–UC-30 | Confirmed: README outcomes, permissions, artifacts, free/MIT, provenance, and removal of untestable assertions. |
| C-01–C-14 | Confirmed: plain first-read wording, audience, lab wording, and snapshot terminology. |
| C-15–C-22 | Confirmed: vocabulary, stop/evidence/screenshot/install wording, masking, and storage facts. |
| F-2-2–F-2-5 | Confirmed: correct textbox export, consistent snapshot term, and no unlisted README comparisons/boundaries. |
| F-2-6 | **Regressed: F-4-1.** Four copy-audit counts are inaccurate. |
| F-3-2 | Confirmed: separate `demo-entry` and `demo-reset` claims passed. |

## Missed leverage

No additional AI, import, export, or sync feature is implied. The brief calls
for a local privacy-limited reproducibility artifact; the existing
self-contained HTML export is the obvious useful handoff.

## What would make this perfect

Correct the four count values, add complete row-by-row audit-count coverage,
and repeat this review. No other product or visitor-facing finding remains.
