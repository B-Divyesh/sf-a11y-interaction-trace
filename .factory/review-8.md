# Review 8 — record keyboard focus failures

**Verdict: FAIL**

Reviewed 2026-09-06 against
<https://a11y-interaction-trace.sociobot.in>.

- Implementation candidate: `de448fb7f0a9891079c2e1abecb34b33f4dedd5c`
- Documentation SHA reviewed: `954036a05c4918d39f602e209e22eb753d340a88`
- Findings: 1 medium
- Untested public claims: 1

The recording, sample, export, privacy controls, offline behavior, and live
deployment work. All 20 registered claim commands pass. The product cannot
receive a PASS because the installed extension popup contains one unlisted
privacy statement and does not meet the plain-words first-screen contract.

## Finding

### MEDIUM F-8-1 — The installed popup uses a metaphor as an untested privacy promise

**Location:** `entrypoints/popup/index.html:5`, `:16`, and `:25` in the
implementation candidate and the byte-matching live extension ZIP.

The popup document title is only “A11y Interaction Trace.” Its main heading is
“Capture the path, not the person.” The nearby label “Private by design” is
also promotional rather than a concrete behavior.

The heading does not name the recording job. It is a metaphor, which the
plain-words contract forbids. “Not the person” also reads as a privacy promise.
That promise is broader than the product's tested behavior: optional
screenshots can contain page information, and the terms correctly tell users
to review each trace before sharing it. The phrase appears only in the popup;
it is absent from `.factory/claims.json`, the copy audit, and all claim tests.

This does not stop recording, but it can give an installed user the wrong
privacy expectation at the point where screenshot capture is enabled. It is
therefore a medium finding and one untested public claim.

**Required change:** use a job-naming title and heading, such as “A11y
Interaction Trace — record keyboard focus bugs” and “Record keyboard focus
changes.” Remove “Private by design.” Keep only the concrete, registered
masking, storage, screenshot, and upload statements. Add the popup text to the
copy/claims audit, then rerun every claim command and the installed-extension
checks.

## First screen before scrolling

Fresh Chromium contexts had no cookies, storage, or earlier navigation.
Nothing was scrolled before these answers were recorded.

| Viewport | Job | Audience | First action | Evidence |
| --- | --- | --- | --- | --- |
| 390 × 844 | Record keyboard focus failures for a team. | Web developers and accessibility testers. | **Try it with sample data.** | Heading, audience, action, outcome, and all three facts ended at 700 px or above. |
| 1440 × 900 | Record keyboard focus failures for a team. | Web developers and accessibility testers. | **Try it with sample data.** | The same content ended at 713 px or above. |

The home title is “A11y Interaction Trace — record keyboard focus bugs.” The
page had no horizontal overflow or console error in either fresh context.

## Sample and real-data isolation

- The home action opened `/demo/` in one click.
- The first demo view already showed the checkout dialog, Project name value
  “Concrete audit,” and four events: Recording started, Enter, Shift + Tab,
  and Escape.
- The persistent banner said “Demo — sample data, nothing is saved,” named the
  real-data boundary, and kept Reset demo and Start for real available after
  scrolling.
- Replay changed the 1,790-byte demo state. Reset restored the original value
  byte-for-byte.
- `real:review8-sentinel` and `a11y-interaction-trace:real-trace` stayed
  byte-identical through replay, reset, and exit.
- Start for real removed every `demo:` key and kept both real-data sentinels.
- Download sample trace produced a 7,895-byte HTML file containing the page,
  action, focus, and nearby-control evidence.
- The complete live sample flow used only the product origin and logged no
  console or page errors.

## Normal, invalid, boundary, and recovery paths

- Normal installed use recorded the lab interaction and stopped with six
  ordered steps: start, two focus changes, Shift+Tab, Escape, and stop.
- Starting on `chrome://extensions/` returned “Open a regular web page, then
  start recording again.” A regular page could start and stop immediately
  afterward.
- Export with no trace returned “Record at least one interaction before
  exporting.”
- The thirteenth eligible screenshot received the documented 12-capture limit
  result. All four sensitive fixtures were absent from structured data and
  masked in every checked JPEG.
- The stopped trace remained in extension storage after Chromium closed and
  reopened with the same clean consumer profile.
- The lab's Shift+Tab focus escape is intentional sample input. Escape restored
  focus to Open quick edit, so it is not a product defect.

## Claims

Every exact `test` command in `.factory/claims.json` ran independently from
fresh clone `/tmp/a11y-review8-clean-nvFxTH/repo` after `npm ci`.

| Registered claim | Result |
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
| designed-404 | Pass |

The registry has 20 unique IDs and one matching tagged test per ID. The popup
statement in F-8-1 is the only unlisted or untested public claim found.

## Accessibility, routes, privacy, and offline behavior

- The live route suite passed 13/13. It covers titles, semantics, route focus,
  Back behavior, phone targets, the keyboard lab, offline use, and the styled
  404.
- Independent full Axe scans found zero violations on `/`, `/demo/`, `/lab/`,
  `/privacy/`, `/terms/`, `/404.html`, and the installed popup.
- `verify-url.sh` found `lang=en`, one h1, one main, no missing image text
  alternatives, no unnamed buttons, and no console errors.
- Keyboard entry focused the page heading, exposed the skip link, and continued
  with the first main action after activation. Focus indicators are visible.
- Every visible phone link, button, and input passed the 44 × 44 px test.
- Reduced-motion contexts had no non-zero animation or transition duration.
- The responsive 390 px layout and the equivalent 200%-zoom desktop layout had
  no horizontal content loss. Zoom is not disabled.
- The privacy and terms pages returned 200 with route-specific titles and the
  shared header, footer, legal links, version, and factory credit.
- A fresh service worker accepted `registration.update()`. Cache
  `a11y-trace-site-v9` then served the controlled home page offline. The full
  test also reloaded all five public routes and operated demo Replay and Reset
  offline.
- Live requests in the demo stayed same-origin. Extension runtime checks found
  no account, analytics, tracker, API, or upload request.
- Security headers include the self-only CSP, Permissions-Policy,
  Referrer-Policy, and `X-Content-Type-Options`.

## Links, metadata, and expected 404

All 20 discovered page, asset, fragment, download, and labelled source links
resolved. `robots.txt` points to the sitemap. The sitemap lists `/`, `/demo/`,
`/lab/`, `/privacy/`, and `/terms/`.

The deliberate unknown path `/review-8-deliberate-missing-path` returned HTTP
404 with title “Page not found — A11y Interaction Trace,” one main heading,
and a working Return to product link. This expected 404 is not a defect.

## Build, runtime match, and performance

The clean clone was at documentation SHA
`954036a05c4918d39f602e209e22eb753d340a88`. Commits after implementation
candidate `de448fb7f0a9891079c2e1abecb34b33f4dedd5c` change only review and
verification evidence, so no later product image is required.

- `npm ci`: pass; 235 packages audited, zero vulnerabilities.
- `npm test`: 11/11 pass.
- `npm run check`: pass.
- `npm run build`: pass; unpacked MV3 extension, ZIP, and `dist/site/` created.
- `npm run test:a11y`: 31/31 pass.
- `npm audit --omit=dev`: pass.
- ZIP integrity: pass.
- Live route suite: 13/13 pass.
- Served build comparison: all 23 public files matched the clean build
  byte-for-byte. `staticwebapp.config.json` correctly remained host
  configuration and returned the designed 404 rather than being public.
- Local and live ZIP SHA-256:
  `f44101682b7df28e3094a48b56cb370720a0337e96195eeae9d5a2981bd6e887`.
- Initial site JS: 2.15 kB; demo JS: 8.18 kB; CSS: 14.69 kB; phone hero:
  25.01 kB. All are below their budgets.
- Fresh mobile Lighthouse: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.1 s, TBT 20 ms, CLS 0.

## Earlier finding dispositions

Every earlier review, polish record, verification report, and handoff was read.
The current clean and live evidence below proves each prior disposition.

### Review 1 structure and discovery

| ID | Current disposition |
| --- | --- |
| B-01 | Closed: both first screens state the job, audience, action, result, and facts. |
| B-02 | Closed: one-click populated demo, persistent label, reset, exit, and namespace isolation work. |
| B-03 | Closed for the registered landing/README claims: 20/20 commands pass. F-8-1 is a newly found popup claim gap. |
| B-04 | Closed: an unknown live path returns the designed HTTP 404. |
| H-01 | Closed: all six site documents have route titles and required metadata. |
| H-02 | Closed: route navigation and Back focus and announce the h1. |
| H-03 | Closed: the live 390 px target-size test passes every route. |
| M-01 | Closed: the shared site header/footer and legal links remain complete. |
| M-02 | Closed: README retains demo, install, build, test, deploy, and privacy instructions. |
| N-01 | Closed: decorative art has empty alt text; all Axe scans have zero violations. |

### Review 1 public claims

| IDs | Current disposition and evidence |
| --- | --- |
| UC-01–UC-06 | Closed: export contents, facts, event order, lab recovery, pre-start exclusion, and recording indicators pass their tagged tests. |
| UC-07–UC-11 | Closed: key masking, sensitive screenshot masking, screenshot default/cap, and export fields pass. |
| UC-12–UC-16 | Closed: downloaded-file and site offline tests, storage/clear, no-upload, snapshot scope, and README outcome mappings pass. |
| UC-17–UC-20 | Closed: unsupported platform wording remains absent; exact permissions, removed internal-page promise, and 12-image boundary were checked. |
| UC-21–UC-25 | Closed: all package artifacts exist; architecture, cross-origin, Shadow DOM, and iframe promises remain absent; demo scope is explicit. |
| UC-26–UC-30 | Closed: provenance, MIT/free, action-to-focus wording, bug-report purpose, and removal of an unverified Node-version promise remain proven. |

### Review 1 copy

| IDs | Current disposition and evidence |
| --- | --- |
| C-01–C-06 | Closed on the site and README: job-led home copy, plain headings, named export fields, and ordered steps remain. |
| C-07–C-12 | Closed: subjective size/action wording is absent; download, audience, opening, and lab text remain concrete. |
| C-13–C-18 | Closed: storage, snapshot, recording, trace-file, current-trace, Stop, and evidence terms remain consistent. |
| C-19–C-22 | Closed: screenshot, manual-install, masking, free, and browser-storage wording remains concrete. F-8-1 is a separate installed-popup omission from those earlier audits. |

### Reviews 2–6

| ID | Current disposition |
| --- | --- |
| F-2-1 | Closed: desktop first-read content remains above the fold. |
| F-2-2 | Closed: Project name exports as `input` / `textbox`. |
| F-2-3 | Closed: nearby control snapshot terminology is consistent. |
| F-2-4 | Closed: the untestable screen-recording comparison remains absent. |
| F-2-5 | Closed: the broad permission/page-policy promise remains absent. |
| F-2-6 | Closed: every numeric copy-audit row passes its regression. |
| F-3-1 | Closed: painted-mask and concurrent screenshot tests pass. |
| F-3-2 | Closed: demo-entry and demo-reset have separate passing claims. |
| F-4-1 | Closed: corrected copy counts remain accurate. |
| F-5-1 | Closed: UI, storage, and download chronology match completely. |
| F-5-2 | Closed: offline-site covers five routes and live demo controls. |
| F-6-1 | Closed: pre-start input is absent from storage and export. |
| F-6-2 | Closed: offline-export opens the actual downloaded file. |
| F-6-3 | Closed: Start for real deletion is registered and tested. |
| F-6-4 | Closed: the styled 404 has a tagged HTTP-level test. |
| F-6-5 | Closed: “seeded dialog” remains replaced with a concrete outcome. |

Review 7 reported no findings. Its functional evidence was reproduced, but its
zero-finding conclusion is superseded by F-8-1.

### Earlier verification findings

| Earlier finding | Current disposition |
| --- | --- |
| ARIA-labelled password screenshot leak | Closed: all four sensitive fixtures and concurrent painted masks pass; checked JPEG pixels are masked. |
| 30-second cache policy on immutable assets | Closed: fingerprinted assets return the configured immutable one-year policy. |
| Missing CSP and Permissions-Policy | Closed: both headers are present with the expected restrictions. |

## Scope notes

This is a static site plus a Chromium extension. It has no backend, tenant,
rate limit, payment path, shared database, or SQLite state to test. Backend
health, restart, 429, and Retry-After checks do not apply. The extension was
exercised as an installed artifact in a fresh consumer profile. No additional
AI, import, or sync feature is implied by the local trace-handoff brief.

## Final count

- Blocking: 0
- High: 0
- Medium: 1
- Minor: 0
- Total findings: 1
- Untested public claims: 1

**Final verdict: FAIL.**
