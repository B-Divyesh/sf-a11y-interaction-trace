# Polish round 1 — finding closure

Completed 2026-08-28 against review commit `1f83806cb08482ae4f5e42bd6b3b84b420f4c1cc`. The implementation commit is `614c868f`. Live checks use <https://a11y-interaction-trace.sociobot.in>.

Evidence shorthand:

- `browser suite`: `npm run test:a11y` — 27 passed.
- `clean claims`: every command in `.factory/claims.json` — 17/17 passed from `/tmp/a11y-polish-clean-qRiwsx/repo`.
- `live suite`: 16 selected browser, axe, demo, routing, mobile, and offline checks — 16 passed against production.
- `live verify`: `.factory/verify-live/verify.json`; no console errors, one h1, title/lang/main/alt checks passed.
- Screenshots: `.factory/evidence-live-home-mobile.png`, `.factory/evidence-live-demo-mobile.png`, and `.factory/evidence-live-404-mobile.png`.

## Review findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| B-01 | Replaced the first screen with the requested job-led headline, named audience, sample-data primary action, outcome note, and three separate facts. Copy precedes art at 390 px. | `390px first screen identifies job…`; live home screenshot; `/` live suite. |
| B-02 | Added direct `?demo=1` entry and `/demo/`, a populated four-event trace, persistent demo banner, replay, reset, export, and real-mode exit. Only `demo:a11y-interaction-trace:*` is touched. | `@claim:demo-isolation`, `@claim:trace-export-content`; live demo screenshot and URL. |
| B-03 | Added `.factory/claims.json` with 17 one-to-one tagged tests. Each listed command passed independently from a clean clone. | `claims registry`; clean claims 17/17. |
| B-04 | Added the styled concrete-and-moss 404 and a Static Web Apps 404 response override. | `static host maps unknown paths…`; live `/definitely-not-a-route` returned 404; live 404 screenshot. |
| H-01 | Added route-specific canonical, Open Graph, Twitter, theme-color, SVG favicon, 180 px touch icon, and 1200×630 social art metadata. | Per-route semantic/metadata tests; `identify` verified asset dimensions; live suite. |
| H-02 | Added h1 focus and polite route announcements on direct entry, link navigation, and Back. | `route navigation and Back focus and announce the new h1`; local and live pass. |
| H-03 | Set 44×44 minimum target sizing for navigation, footer, inline links, buttons, and inputs. | `visible mobile links and buttons provide at least 44px targets`; local and live pass. |
| M-01 | Standardized the same four-link header and full footer on home, demo, lab, legal, and 404 pages. Added one-line purpose, Param Factory, version, legal links, and external-source label. | Six-route browser suite and live link/status checks. |
| M-02 | README now links the sample URL, explains namespace/reset, and documents `dist/site` plus the factory deployment command and live checks. | README inspection; demo isolation claim. |
| N-01 | Changed the declared decorative hero image to `alt=""`. | Axe suite; live verify reports zero images missing alt. |

## Unlisted-claim findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| UC-01 | Removed subjective wording and standardized `recording`, `trace`, and `trace file`; sample export asserts actions, focus, page, and nearby controls. | `@claim:trace-export-content`. |
| UC-02 | Split free, Chromium packaging, and no-account/upload statements into separately testable registry entries. | `@claim:free-mit`, `@claim:chromium-package`, `@claim:local-no-upload`. |
| UC-03 | Kept the chronological statement and verifies visible, serialized, and timestamp order. | `@claim:chronological-order`. |
| UC-04 | Demo and lab show the known Shift+Tab escape and Escape recovery. | `@claim:seeded-focus-defect`. |
| UC-05 | Built-extension test proves no recorder exists before Start and capture begins only after the command. | `@claim:explicit-recording`. |
| UC-06 | Built-extension test checks recorder bar, toolbar badge, and stop behavior from both the bar and popup. | `@claim:explicit-recording`. |
| UC-07 | Built-extension test types a printable key and Shift+Tab, then inspects extension storage and exported HTML. | `@claim:key-privacy`. |
| UC-08 | Added password, payment, one-time-code, and author-marked fixtures; checks actions, storage, four screenshot pixels, and export for secrets. | `@claim:sensitive-mask`. |
| UC-09 | Fresh built popup is asserted unchecked before recording. | `@claim:screenshot-boundary`. |
| UC-10 | Built-extension capture uses a green visible tested tab while a red tab is backgrounded; the captured pixel is asserted green. | `@claim:screenshot-boundary`. |
| UC-11 | Downloaded sample trace is inspected for timing, focus, role, name, state, page details, and scope note. | `@claim:trace-export-content`. |
| UC-12 | Generated trace HTML is opened offline with zero requests; visited site reload is also tested offline. | `@claim:offline-export`, `@claim:offline-site`. |
| UC-13 | A real extension recording is found only in `chrome.storage.local`; Clear removes it. | `@claim:local-no-upload`. |
| UC-14 | Demo request origins and the full built-extension flow are checked for remote calls; runtime sources are scanned for transfer/telemetry paths. | `@claim:local-no-upload`. |
| UC-15 | Replaced all variants with “nearby control snapshot” and states the DOM-only limitation in UI and export. | `@claim:snapshot-scope`. |
| UC-16 | The README list now uses the same separately tested outcomes for keys, focus, nearby controls, metadata, and opt-in screenshots. | `@claim:key-privacy`, `@claim:trace-export-content`, `@claim:screenshot-boundary`. |
| UC-17 | Removed the external browser-platform assertion; copy now describes only this extension’s observed snapshot scope. | `@claim:snapshot-scope`; copy audit. |
| UC-18 | Built manifest is parsed for the exact four permissions and empty host permissions. | `@claim:manifest-permissions`. |
| UC-19 | Removed the untested browser-internal-page claim from public copy. The actionable runtime error remains product behavior, not marketing. | Copy search; README. |
| UC-20 | A real recording requests 13 captures and asserts exactly 12 images plus one explicit limit result. | `@claim:screenshot-boundary`. |
| UC-21 | A clean production build verifies the unpacked manifest, packaged ZIP, site root, and public ZIP. | `@claim:packaged-build`. |
| UC-22 | Removed implementation architecture bullets from public claims; user-visible outcomes remain independently tested. | README; claims registry audit. |
| UC-23 | Demo and export identify snapshots as selected DOM details with an explicit non-OS-tree limitation. | `@claim:snapshot-scope`. |
| UC-24 | Removed the untested cross-origin grant statement from public copy. | Copy search; README. |
| UC-25 | Removed the untested Shadow DOM and iframe scope statement from public copy. | Copy search; README. |
| UC-26 | Recorded source art, prompt, derivative social image, touch icon, authored SVG, dates, and licenses. | `@claim:provenance`; `.factory/design.md`. |
| UC-27 | Registry checks the MIT grant and absence of billing integration. | `@claim:free-mit`. |
| UC-28 | Replaced the overbroad audit/video comparison with the observable action-to-focus pairing. | `@claim:chronological-order`; copy audit. |
| UC-29 | Replaced “purpose-built” with a concrete bug-report use sentence. | `.factory/copy-audit.md`; live `/`. |
| UC-30 | Removed the untested minimum Node-version promise; development copy now only identifies the tools used. | README and copy search. |

## Copy findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| C-01 | Hero body is now two short sentences in plain terms. | First-screen test; copy audit. |
| C-02 | Replaced “MV3” eyebrow with “Keyboard and focus evidence.” | Live home screenshot. |
| C-03 | Replaced the abstract “missing middle” heading with “Record what changed after each key.” | Copy audit; live `/`. |
| C-04 | Replaced handoff wording with “Share the trace.” | Copy audit. |
| C-05 | Replaced vague file copy with named timing, focus, role, name, state, and scope contents. | `@claim:trace-export-content`. |
| C-06 | Rewrote undefined pronouns as “Reproduce the focus bug. Record it. Share the trace.” | Copy audit. |
| C-07 | Removed both subjective size/actionability lines; uses one HTML file with named contents. | Copy audit; `@claim:trace-export-content`. |
| C-08 | Replaced “purpose-built” and “gap” with a concrete local-extension bug-report sentence. | Copy audit. |
| C-09 | Download labels now name “extension ZIP” or “A11y Interaction Trace v1.” | Mobile and desktop screenshots. |
| C-10 | Split the README audience into two sentences, each under 22 words. | README; copy audit. |
| C-11 | README opening now names concrete recorded data and the HTML trace file without subjective adjectives. | README; copy audit. |
| C-12 | Lab description now says “deliberately broken dialog with an Escape key exit.” | README and `/lab/`. |
| C-13 | README leads with user-visible storage and permission effects before API names; removed architecture jargon. | README. |
| C-14 | Standardized all selected DOM context to “nearby control snapshot.” | `@claim:snapshot-scope`; repository copy search. |
| C-15 | Standardized active capture, saved data, and exported HTML to “recording,” “trace,” and “trace file.” | Copy audit; repository copy search. |
| C-16 | Replaced “current/local trace” with “current trace.” | README. |
| C-17 | Replaced “Stop visibly” with “Stop from the recorder bar.” | Live `/`; home screenshots. |
| C-18 | Replaced the unnamed “four signals” with “Keys, focus, page, controls.” | Live `/`; home screenshots. |
| C-19 | Replaced “Pixels are opt-in” with “Screenshots are optional.” | Live `/`; copy audit. |
| C-20 | Replaced compressed install jargon with “Install version 1 manually.” | Live `/`; copy audit. |
| C-21 | README now says typed characters are replaced by `Character`; the actual storage/export behavior is tested. | `@claim:key-privacy`. |
| C-22 | Replaced “local-first” with “Free” and “Stores traces only in your browser.” | First-screen test; `@claim:free-mit`, `@claim:local-no-upload`. |

## Final verification

- Local: `npm test` 8/8, `npm run check`, `npm run build`, and `npm run test:a11y` 27/27.
- Clean clone: all 17 commands in `.factory/claims.json` passed independently.
- Live: 16/16 selected browser/axe/demo/offline tests passed; `/`, `/demo/`, `/lab/`, `/privacy/`, `/terms/`, and the ZIP return 200.
- Unknown live path returns HTTP 404 with the designed page.
- Live Lighthouse mobile: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.1 s, TBT 0 ms, CLS 0.
- Live response has CSP, Permissions-Policy, Referrer-Policy, HSTS, and X-Content-Type-Options.

No finding from review 1 remains open.
