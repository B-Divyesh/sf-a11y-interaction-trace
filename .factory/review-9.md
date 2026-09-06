# Record keyboard focus failures — review 9

**Verdict: PASS — 0 findings and 0 untested claims.**

Reviewed on 2026-09-06.

- Live URL: <https://a11y-interaction-trace.sociobot.in>
- Implementation candidate: `38344dfea8a1a63bbcea2bdabb1295f9ab7095a4`
- Documentation baseline reviewed: `6cfc569eb1d2f0868c76fd00668b3fa1957fbb2a`
- Review scope: static landing site and packaged Chromium MV3 extension. No
  backend, tenant, SQLite, health, or rate-limit surface exists.

The later baseline commit is documentation-only. A fresh clean build of that
baseline has the same product source as the implementation candidate.

## First screen before scrolling

I opened the live home page in new Chromium contexts with no product storage.
I recorded these answers before scrolling.

| Viewport | Job | Audience | First action | Result |
| --- | --- | --- | --- | --- |
| 390 × 844 phone | Record keyboard focus failures for a team. | Web developers and accessibility testers. | **Try it with sample data** | Visible at y=461 with a 48 px target. |
| 1440 × 900 desktop | Record keyboard focus failures for a team. | Web developers and accessibility testers. | **Try it with sample data** | Visible at y=532 with a 48 px target. |

The live heading is “Record keyboard focus failures for your team.” Both first
screens include the audience sentence and the action before scrolling. There
was no horizontal overflow or browser console/page error.

## Sample trace and data isolation

The first action opened the canonical `/demo/` page in one click. It showed the
persistent label **“Demo — sample data, nothing is saved”**, a checkout dialog
with Project name “Concrete audit,” and four ordered events:

1. Recording started, +0.00 s
2. Enter, +0.24 s
3. Shift + Tab, +1.42 s, focus on Background help outside the dialog
4. Escape, +2.18 s, focus returned to Open quick edit

Replay followed by **Reset demo** restored the identical four-event sample. A
seeded non-demo `real:review9-sentinel` kept the value `unchanged` throughout.
**Start for real** removed all `demo:` keys and left that real sentinel
unchanged. The sample download contained Checkout settings, keyboard event
data including `Shift+Tab`, Background help focus evidence, and the nearby
control snapshot scope note. The live sample made requests only to the product
origin.

## Clean build and declared claims

I cloned the reviewed documentation baseline into
`/tmp/a11y-review9-clean-oinuX1/repo`, ran `npm ci`, and then ran the declared
commands there.

- `npm test` — 11/11 passed.
- `npm run check` — passed.
- `npm run build` — passed; produced the unpacked extension, ZIP, deployable
  site, and public ZIP download.
- `npm audit --omit=dev` — zero vulnerabilities.
- `npm run test:a11y` — 32/32 passed.

Each exact command in `.factory/claims.json` was run independently from that
clean checkout: `npm run test:claims -- --grep @claim:<id>`. All passed.

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
| designed-404 | Pass |

The registry has 20 unique IDs and one matching tagged browser test per ID.
I also read the landing page, demo, legal pages, popup, README, and claims
registry for additional visitor-facing promises. Each observable public claim
is registered and tested; instructions and stated limits do not make new
untested promises.

## Product paths and accessibility

Fresh live checks found the following.

- `/`, `/demo/`, `/lab/`, `/privacy/`, and `/terms/` each returned 200, had
  their own title, `lang="en"`, one h1, one main landmark, no mobile overflow,
  and no console/page error.
- The deliberate missing path returned HTTP 404 with title “Page not found —
  A11y Interaction Trace,” one styled h1, and a working Return to product link.
  This expected 404 is not a defect.
- All nine unique discovered live links, including the download and labelled
  source link, returned 200.
- `/opt/fleet/lib/verify-url.sh` passed against the live home page: title,
  language, h1, main, image alternatives, button names, and console checks all
  passed. Its captures are in `/work/.evidence/review9-verify-live/`.
- The full Playwright Axe integration in `npm run test:a11y` passed for every
  site document and the installed popup, with no serious or critical issues.
  The standalone Axe CLI could not start its Selenium-managed browser in this
  worker image; the supplied Playwright Axe integration is the applicable
  alternative and passed.
- Keyboard tests cover the skip link, route focus and announcement, Back,
  dialog focus escape/recovery, and visible focus. The 390 px suite checks every
  visible link, button, and input is at least 44 × 44 px.
- Reduced-motion checks found no running animation. The fresh phone and desktop
  checks showed no horizontal overflow.

## Privacy, offline use, recovery, and package checks

The installed-extension suite exercised the normal recording path and the
important boundaries: pre-start input is excluded, typed characters become
`Character`, sensitive fields stay out of data and screenshots, screenshots
start off and stop at 12, clear/reset affect only their named storage, and the
export contains the recorded evidence. It uses a clean consumer-style Chromium
profile and the production MV3 build.

For the live site, a fresh demo visit registered a controlling service worker
at the root scope. `registration.update()` completed, cache
`a11y-trace-site-v9` was active, and an offline reload still displayed the
demo. Offline Replay and Reset worked and retained four events, with no error.

The clean built ZIP and the live download have the same SHA-256:
`0810928e3861dadd8e63b9e0e0aa920c1d0bbba6fe6bde199be117ae998e993a`.
All 23 published product files from the clean build matched live byte-for-byte.
`staticwebapp.config.json` was deliberately excluded because the hosting
platform consumes it and does not publish it as a document.

The current-candidate verification also records fresh mobile Lighthouse 100
Performance, 100 Accessibility, 100 Best Practices, and 100 SEO. The current
review independently reran the executable accessibility, structure, and live
runtime checks above.

## Earlier findings

I inspected `review-1.md` through `review-8.md` and all three verification
reports. The present checks prove every prior finding remains closed.

| Earlier finding IDs | Current disposition |
| --- | --- |
| B-01–B-04 | Closed: first screens identify job/audience/action; the isolated populated demo and true HTTP 404 work; all registered claims pass. |
| H-01–H-03 | Closed: route metadata, route focus/announcement, and phone target sizes pass. |
| M-01–M-02, N-01 | Closed: shared skeleton, documentation, and decorative-art handling remain correct. |
| UC-01–UC-30 | Closed: export evidence, chronology, focus recovery, recording indicators, masking, capture boundary, offline use, local-only storage, scope, manifest, package, free/MIT status, provenance, and removed unsupported promises are covered by the 20 passing claims. |
| C-01–C-22 | Closed: copy remains job-led, short, plain, and consistent about recording, trace, trace file, and nearby control snapshot. |
| F-2-1–F-2-6 | Closed: desktop first read, textbox semantics, terminology, removed unlisted claims, and count-checked copy audit pass. |
| F-3-1–F-3-2, F-4-1 | Closed: concurrent sensitive masking, separate demo entry/reset coverage, and corrected copy counts pass. |
| F-5-1–F-5-2 | Closed: UI/storage/download chronology and all-route offline behavior pass. |
| F-6-1–F-6-5 | Closed: pre-start exclusion, actual downloaded-file offline use, demo deletion, tagged 404, and concrete sample wording pass. |
| F-8-1 | Closed: the popup now names the recording job and uses concrete, tested privacy boundaries. |

## Evidence and result

Fresh live screenshots are in `/work/.evidence/review9-live-phone-home.png`,
`/work/.evidence/review9-live-desktop-home.png`, and their demo counterparts.
The required machine result is `/work/.evidence/qa-result.json`.

**PASS — 0 findings and 0 untested claims.**
