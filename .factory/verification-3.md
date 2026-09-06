# Verification 3 — record keyboard focus failures

**Verdict: PASS**

Verified on 2026-09-06 against
<https://a11y-interaction-trace.sociobot.in>.

- Implementation candidate: `38344dfea8a1a63bbcea2bdabb1295f9ab7095a4`
- Documentation SHA reviewed: `8dba2465a1818aac51cab529a3158238a1a0145b`
- Findings: 0
- Untested public claims: 0

The live browser extension and site complete the real recording and handoff job.
No critical, high, medium, or minor finding remains.

## First screen before scrolling

Fresh Chromium phone and desktop contexts had no stored product data. Nothing
was scrolled before these answers were recorded.

| Viewport | Job | Audience | First action | Result |
| --- | --- | --- | --- | --- |
| 390 × 844 | Record keyboard focus failures for a team. | Web developers and accessibility testers. | **Try it with sample data.** | Pass. The heading, audience, action, and facts fit before the fold with no horizontal overflow. |
| 1440 × 900 | Record keyboard focus failures for a team. | Web developers and accessibility testers. | **Try it with sample data.** | Pass. The same content fits before the fold. |

The exact heading is “Record keyboard focus failures for your team.” The first
action opens the sample in one click.

## Findings

None.

## Sample and real-data isolation

- The one-click action opened the canonical `/demo/` route.
- The first sample screen showed the checkout dialog, Project name value
  “Concrete audit,” and four ordered events: Recording started, Enter,
  Shift + Tab, and Escape.
- The persistent label said “Demo — sample data, nothing is saved” and kept
  **Reset demo** and **Start for real** available.
- Replay changed only the demo-prefixed state. Reset restored the original
  state byte-for-byte.
- Seeded non-demo keys kept their exact values through entry, replay, reset,
  and exit.
- Start for real removed every demo-prefixed key and did not change the
  non-demo keys.
- The sample download contained the page, keyboard, focus, timing, and nearby
  control snapshot evidence. The downloaded file opened offline with no
  HTTP(S) request.

## Installed extension and recovery paths

- A clean Chromium profile loaded the built MV3 extension and its popup.
- The popup names the job with “Record keyboard focus changes.” Its first
  action, screenshot default, privacy facts, focus outline, and 380 × 600 fit
  passed. Axe found no serious or critical issue.
- The normal lab flow recorded start, focus changes, Shift+Tab, Escape, and
  stop in order. The stopped trace persisted byte-for-byte after Chromium was
  closed and reopened with the same profile.
- A keyboard action before Start did not enter storage or the exported trace.
- Starting on `chrome://version/` returned “Open a regular web page, then
  start recording again.” Recording then started and stopped on a regular page.
- Export with no trace returned “Record at least one interaction before
  exporting.”
- Screenshots started off. Enabled capture used the visible tab and stopped at
  12 images with an explicit limit result.
- Password, payment, one-time-code, and author-marked values were absent from
  structured trace data and masked in every checked screenshot.
- The manifest contains only `activeTab`, `scripting`, `storage`, and
  `downloads`, with no host permissions.

## Claims

After `npm ci` in a fresh checkout, every exact command in
`.factory/claims.json` ran independently.

| Claim | Result |
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

The registry has 20 unique entries and exactly one tagged browser test per
entry. The landing site, legal pages, README, demo, and installed popup were
checked for additional claim-like statements. Every public claim is registered
and tested, or is a plain instruction or limitation.

## Accessibility, privacy, offline use, and routes

- `npm run test:a11y` passed 32/32. This includes six route scans and the
  installed popup scan.
- The live route suite passed 13/13. It covers page structure, route focus and
  Back behavior, the keyboard lab, phone target sizes, offline use, and 404.
- Each public document has `lang=en`, one h1, one main landmark, a route title,
  and required metadata. `verify-url.sh` found no missing image alternatives,
  unnamed buttons, or console errors.
- Keyboard navigation exposes the skip link, has visible focus, restores focus
  after the sample dialog closes, and has no trap. Phone controls meet the
  44 × 44 px target requirement.
- Axe found no serious or critical issue. The reduced-motion context had no
  non-zero animation, transition, or smooth-scroll behavior.
- `/`, `/demo/`, `/lab/`, `/privacy/`, and `/terms/` returned 200 with their
  own titles. All discovered internal, download, and labelled source links
  returned 200.
- The deliberate missing route returned HTTP 404, title “Page not found —
  A11y Interaction Trace,” and the styled return path. This expected 404 is
  not a defect.
- All five visited routes reloaded offline. Demo Replay and Reset worked
  offline. Service-worker update completed and cache `a11y-trace-site-v9`
  remained controlled.
- The complete sample request log used only the product origin and had no
  console or page error. Extension checks found no account, analytics,
  tracker, API, upload, or billing path.
- The privacy and terms pages are live. The response includes a self-only CSP,
  Permissions-Policy, Referrer-Policy, HSTS, and X-Content-Type-Options.

## Clean build and live runtime

Fresh checkout: `/tmp/a11y-verify3-clean-1FW9y7/repo` at the documentation SHA.

- `npm ci`: pass; 235 packages audited, zero vulnerabilities.
- `npm test`: pass, 11/11.
- `npm run check`: pass.
- `npm run build`: pass; unpacked extension, ZIP, deployable site, and public
  download produced.
- `npm run test:a11y`: pass, 32/32.
- `npm audit --omit=dev`: pass.
- All 20 exact claim commands: pass independently.
- Live routes: 13/13. Live sample/export subset: 8/8.
- All 23 public files match the clean build byte-for-byte.
- Local and live ZIP SHA-256:
  `0810928e3861dadd8e63b9e0e0aa920c1d0bbba6fe6bde199be117ae998e993a`.

The only file changed between implementation `38344df` and documentation
`8dba246` is `.factory/handoff.md`. The live product therefore matches the last
implementation candidate; no later report-only commit needs a product image.

Build sizes are 2.15 kB main JavaScript, 8.18 kB demo JavaScript, 14.69 kB
CSS, and 25.01 kB for the phone hero image. Fresh mobile Lighthouse results:

- Performance: 100
- Accessibility: 100
- Best Practices: 100
- SEO: 100
- LCP: 1.1 s
- TBT: 0 ms
- CLS: 0

## Earlier finding disposition

Every earlier review, verification, polish report, and handoff was inspected.
The current clean and live evidence proves these dispositions.

| Earlier IDs | Current disposition |
| --- | --- |
| B-01–B-04 | Closed. Both first screens identify the job, audience, action, result, and facts; the isolated sample and true 404 work; every claim command passes. |
| H-01–H-03 | Closed. Metadata, route focus and announcement, and 44 px phone targets pass. |
| M-01–M-02, N-01 | Closed. Shared structure, documentation, and decorative-image treatment remain correct. |
| UC-01–UC-06 | Closed. Export content, facts, event order, focus recovery, pre-start exclusion, and recording indicators pass. |
| UC-07–UC-11 | Closed. Key replacement, sensitive masking, screenshot boundaries, and export fields pass. |
| UC-12–UC-16 | Closed. Downloaded-file and site offline behavior, local storage, no-upload behavior, snapshot scope, and README outcomes pass. |
| UC-17–UC-25 | Closed. Unsupported promises remain absent; exact permissions, capture cap, packages, and scope boundaries are checked. |
| UC-26–UC-30 | Closed. Provenance, MIT/free status, action-to-focus wording, bug-report purpose, and removal of an untested Node promise remain proven. |
| C-01–C-22 | Closed. Job-led plain copy, short sentences, action labels, and the terms recording, trace, trace file, and nearby control snapshot remain consistent. |
| F-2-1–F-2-6 | Closed. Desktop first read, textbox semantics, terminology, claim removal, and copy counts pass. |
| F-3-1–F-3-2 | Closed. Sensitive-mask concurrency and separate demo entry/reset coverage pass. |
| F-4-1 | Closed. All 46 numeric copy-audit rows pass their count regression. |
| F-5-1–F-5-2 | Closed. UI/storage/download chronology and all-route offline use pass. |
| F-6-1–F-6-5 | Closed. Pre-start exclusion, actual downloaded-file offline use, demo deletion, tagged 404, and plain sample wording pass. |
| F-8-1 | Closed. The popup now names the recording job, removes the metaphor and broad promise, and uses tested privacy statements. |
| Earlier ARIA password finding | Closed. The ARIA-labelled password and all other sensitive fixtures are masked in structured data and screenshots. |

## Scope

Backend tenant isolation, SQLite restart persistence, health routes, and
429/Retry-After do not apply to this static site and local browser extension.
No account or backend exists. The installed extension was exercised in a clean
consumer profile instead. No AI feature is missing: network inference would
not improve the local evidence-capture job, while export already provides the
needed handoff.

## Final result

**PASS — 0 findings and 0 untested claims.**
