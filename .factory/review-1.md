# Adversarial first-read review 1 — A11y Interaction Trace

**Verdict: FAIL**

Reviewed 2026-08-28 against live production at
`https://a11y-interaction-trace.sociobot.in` and repository commit
`bbcc27187318377310450a1d91940c53d157ef2b`.

The product has four blocking findings. It does not identify its user on the
first screen, it has no one-click sandbox demo, it has no claims registry or
claim-tagged tests, and unknown routes silently render the home page instead of
a designed 404. A PASS requires zero blocking findings and no more than three
minor findings.

## Findings, ordered by severity

### BLOCKING B-01 — The first screen does not say who the product is for

**Quote:** “Make focus failures visible.” “Local interaction evidence / MV3.”
“Record the keyboard path, focused control, visible page, and narrowed semantic
state—then hand off one offline HTML trace instead of another ‘can you
reproduce?’ thread.”

**Observed:** In a fresh 390 × 844 context, the artwork precedes the copy and the
first text does not start until 368 px; the headline starts at 407 px, the
26-word description ends at 781 px,
and the primary “Download extension” action is clipped at the bottom
(813–861 px). The four facts are combined into one line below the fold instead
of presented as three short lines. On desktop, the headline, description,
actions, and facts are visible. Neither viewport names web developers,
accessibility testers, QA engineers, or issue triagers.

**First-read answers before scrolling:**

| Viewport | What does it do? | For whom? | What should I click first? |
| --- | --- | --- | --- |
| 390 × 844 | Records keyboard/focus information and exports an HTML trace. | Cannot tell. | The header says “Download .zip”; the main action is only partly visible. |
| 1440 × 900 | Records keyboard/focus evidence for a bug report. | Cannot tell. | “Download extension,” although the required sample-data action is absent. |

**Why this loses a first-time visitor:** “Focus failures” and “MV3” assume prior
knowledge, while the audience is omitted. The mobile composition puts the art
before the explanation and trial path. The visitor cannot answer all three
required questions from the first screen.

**Concrete fix:** Put copy before artwork at 390 px and use:

- Headline: “Record keyboard focus failures for your team.”
- Audience sentence: “For web developers and accessibility testers who need
  reproducible keyboard evidence without uploading a session.”
- Primary action: “Try it with sample data.”
- Adjacent outcome: “Opens a seeded dialog and sample trace. Nothing is saved.”
- Facts: “Free.” “Works in Chrome and Edge.” “Stores traces only in your
  browser.”

Keep “Download extension” as the secondary action. Add claim tests before
publishing the facts.

### BLOCKING B-02 — There is no one-click demo or isolated demo namespace

**Quote:** The live actions are “Download .zip,” “Download extension,” “Install
instructions,” and “Test lab.” The lab begins: “Start A11y Interaction Trace on
this tab.”

**Observed:** There is no “Try it with sample data” action. On mobile, “Test lab”
is hidden in the header. The lab requires installing and manually starting the
extension; it does not open with a trace already in use. It has no “Demo —
sample data, nothing is saved” banner, “Reset demo,” or “Start for real.”
`/demo` and `/?demo=1` both render the ordinary home page. `.factory/demo.md` is
missing. A seeded `real:sentinel` and `trace` in site localStorage survived a
lab visit, but the lab did not read or write any sample data, so this does not
verify extension-storage isolation.

**Why this loses or misleads a first-time visitor:** The only product trial
requires download, unpacking, browser developer mode, and extension setup. The
“Test lab” is a target page, not a working product demo. Reset behavior and the
promise that demo activity cannot touch real traces cannot be checked.

**Concrete fix:** Add `/demo` and link it from the first screen as “Try it with
sample data.” Open directly on a realistic seeded trace showing the dialog,
three keyboard events, changing focus, semantic context, and an export preview.
Keep a persistent “Demo — sample data, nothing is saved” banner with “Reset
demo” and “Start for real.” Store all demo state under a `demo:` namespace,
delete it on exit, and add tests that seed real storage, mutate/reset the demo,
and prove the real sentinel is unchanged. Document the URL, seed, reset, and
namespace in `.factory/demo.md`.

### BLOCKING B-03 — Every public claim is unlisted and has no required claim test

**Quote:** `.factory/claims.json` does not exist. `rg '@claim:'` finds no tagged
test.

**Observed:** A clean clone at the specified base commit passes `npm test`
(7 tests), `npm run check`, `npm run build`, and `npm run test:a11y` (7 tests).
Those are useful general checks, but there are zero listed claim commands and
zero tests tied one-to-one to public claims. The existing offline and masking
tests are not claim-tagged and do not run through a demo entry point.

**Why this misleads a first-time visitor:** Privacy, offline behavior, capture
scope, export behavior, browser support, and screenshot limits are presented as
facts without the required auditable mapping. Passing unrelated or untagged
tests cannot establish that every visitor-facing promise is continuously
verified.

**Concrete fix:** Add `.factory/claims.json`. Give each row below one stable ID,
one exact `@claim:<id>` test, its copy locations, and a clean demo sandbox. Remove
subjective claims that cannot be tested.

#### Unlisted claim findings

Every row is an unlisted-claim finding because the registry is absent.

| ID | Exact public claim(s) and location | Test or copy fix required |
| --- | --- | --- |
| UC-01 | Landing: “Record the keyboard path, focused control, visible page, and narrowed semantic state—then hand off one offline HTML trace…” README: “A privacy-first Chrome/Edge extension for turning a broken keyboard interaction into a compact, reproducible handoff.” and “It records sanitized keyboard actions, focus targets, selected DOM-derived accessibility state, and optional screenshots, then exports one self-contained HTML viewer.” | Remove the subjective adjectives. In the demo, record a fixed keyboard sequence and assert the exported trace contains each action, focus target, page evidence, and snapshot in order. |
| UC-02 | Landing facts: “FREE · CHROME / EDGE · NO ACCOUNT · NO UPLOAD.” README: “Chromium browsers only in v1.” | Split into price, browser-support, account, and upload claim IDs. Test supported builds; intercept network and prove no authentication/upload request. Change “Chrome / Edge” to “Chromium” unless both named browsers are exercised. |
| UC-03 | Landing: “A11y Interaction Trace records the human interaction between them, in the order it happened.” | Record known events and assert chronological order in stored data and export. |
| UC-04 | Landing: “Three keystrokes show exactly when focus leaves a dialog.” README: “The included `/lab/` route has a safe, seeded focus-containment defect.” | Enter the demo, send the stated keys, and assert focus leaves at the documented event and Escape recovers it. |
| UC-05 | Landing: “The recorder only runs after you start it.” | Interact before and after Start; assert only post-start events are recorded. |
| UC-06 | Landing: “A toolbar badge and page dock stay visible.” README: “Stop from the always-visible in-page dock or the extension popup.” | Start recording and assert both indicators are visible; stop independently from each control. |
| UC-07 | Landing: “Printable keys become ‘Character.’” README repeats the printable-key replacement. | Type known printable keys and assert neither the stored trace nor export contains them; assert the label is `Character`. |
| UC-08 | Landing: “Password and payment fields are marked sensitive; values never enter the trace.” | Exercise password, payment, one-time-code, and author-marked fields; inspect metadata, storage, screenshots, and export for the secret. |
| UC-09 | Landing: “Screenshots start off.” README: “Screenshots are off by default…” | Start a fresh session without changing settings and assert no screenshot is captured. |
| UC-10 | Landing: “When enabled, the extension captures only the visible tested tab—not your desktop or other tabs.” README: “Visible-tab JPEG screenshots only…” | Open distinct visible/background tabs, capture, and pixel-check that only the selected tab appears. |
| UC-11 | Landing: “The exported viewer includes timing, focus, role/name/state context, and honest scope notes.” | Export the seeded trace and assert every named field and the scope note are rendered. |
| UC-12 | Landing: “It needs no hosted app.” “Works offline after installation; exports open offline anywhere.” README: “A dependency-free offline HTML viewer embedded into each export.” | Open the exported file in a fresh offline context and assert it renders with zero network requests. |
| UC-13 | Landing: “Everything stays in browser-local storage until you clear it.” README: “All session data stays in `chrome.storage.local`…” and “Use ‘Clear local trace’ when finished.” | Intercept all traffic, inspect extension storage before/after record and Clear, and assert no other persistence or transmission. |
| UC-14 | Landing: “No analytics, trackers, account, or third-party runtime.” README repeats “no account, API, analytics, or upload.” | Intercept the entire demo and extension flow; permit only documented same-origin static requests and assert no telemetry/auth/upload code or calls. |
| UC-15 | Landing: “Narrow snapshots are labeled—not passed off as a full OS accessibility tree.” README: “The UI and export therefore call this a narrowed semantic snapshot…” | Assert the UI and export use the agreed label and never use “accessibility tree” without the limitation. |
| UC-16 | README’s five “What v1 records” bullets. | Assert keyboard action, focus metadata, nearby-control snapshot, URL/title/viewport/timing/browser metadata, and opt-in screenshot behavior in one seeded flow. |
| UC-17 | README: “The browser does not expose its full platform accessibility tree to a normal cross-browser extension.” | This is an external platform assertion, not a product outcome. Rewrite as the product’s observed scope: “This extension records selected DOM information, not the browser or operating system accessibility tree.” Then cover it under UC-15. |
| UC-18 | README: “There is no `<all_urls>` host permission.” The permissions list names `activeTab`, `scripting`, `storage`, and `downloads`. | Parse the built manifest and assert the exact permissions and absence of host permissions. |
| UC-19 | README: “Recording cannot run on browser-internal pages.” | Attempt Start on a browser-internal page and assert a named, actionable error. |
| UC-20 | README: “Screenshots are rate-limited and capped at 12 per trace…” | Trigger at least 13 eligible captures and assert exactly 12 images plus an explicit limit result. |
| UC-21 | README: “`npm run build` produces” the four listed extension/site artifacts. | Run the command from a clean clone and assert each listed artifact exists and is non-empty. |
| UC-22 | README architecture bullets: isolated on-demand recorder, background service worker, offline viewer, and service-worker shell cache. | Add static manifest/build checks and a browser flow for injection isolation and offline behavior, or move implementation-only detail to developer documentation that does not read as a user promise. |
| UC-23 | README: “Snapshots approximate accessible names/roles from the DOM…” | Use a fixed fixture and assert the snapshot is DOM-derived, limited, and labeled as approximate. |
| UC-24 | README: “Cross-origin navigation ends the effective `activeTab` grant.” | Navigate the recording tab cross-origin and assert recording stops or reports the documented boundary. |
| UC-25 | README: “Shadow DOM and cross-origin iframe internals are outside the recorder’s current scope.” | Exercise both fixtures and assert internals are excluded while the limitation is surfaced. |
| UC-26 | Landing: “Hero artwork was generated…; interface marks and diagrams are original authored assets.” README: “Generated hero provenance and the complete visual system are documented…” | Add a repository provenance check for the named source asset/prompt and design record, or keep this solely as documented provenance outside product claims. |
| UC-27 | README: “MIT.” | Assert `LICENSE` exists and contains the MIT grant; keep this as a static claim. |
| UC-28 | Landing: “Automated audits find rules. Screen recordings show pixels.” | Remove this overbroad comparison, or narrow it to an observable contrast such as “This trace pairs each keyboard action with its next focus target.” |
| UC-29 | Landing: “One purpose-built local utility for the gap between an accessibility failure and a fix.” | Remove the subjective “purpose-built” claim and use the concrete C-08 rewrite. |
| UC-30 | README: “Requirements: Node.js 20+ and npm.” | Run the clean build/test matrix on the oldest claimed Node 20 release and current supported Node; record the command under a compatibility claim. |

The subjective landing copy “Small enough to attach. Specific enough to act
on.”, “The file explains itself,” “Evidence, not surveillance,” and README
adjective “privacy-first” are not suitable for `claims.json` as written. Remove
them or replace them with observable statements mapped to the relevant rows.

### BLOCKING B-04 — Unknown routes masquerade as the product home page

**Quote:** A request to `/definitely-not-a-route` returns HTTP 200 with the title
“A11y Interaction Trace — local keyboard and focus evidence” and h1 “Make focus
failures visible.” `/demo` behaves the same way.

**Why this misleads a first-time visitor:** A mistyped, obsolete, or promised
demo URL looks valid. There is no “page not found” state and no reliable signal
for visitors, crawlers, or automated checks.

**Concrete fix:** Add a designed 404 in the concrete-and-moss system with title
“Page not found — A11y Interaction Trace,” one h1, and a “Return to product”
link. Configure the host so unknown document paths resolve to that page with a
404 response while known deep links continue to work.

### HIGH H-01 — Required discovery and sharing metadata is missing on every route

**Quote:** Each page has a title, description, and `/trace-mark.svg` favicon,
but no canonical link, Open Graph fields, Twitter card fields, apple-touch icon,
or theme color.

**Why this matters:** Shared links have no controlled title, description, or
product image; duplicate route forms have no canonical URL; installed mobile
bookmarks have no required touch icon or palette.

**Concrete fix:** Add route-specific canonicals, Open Graph and Twitter title /
description / image metadata, a product-derived 1200 × 630 share image, a
180 × 180 apple-touch icon, and the palette theme color. Keep the current title
and description lengths within their limits.

### HIGH H-02 — Route changes do not move focus or announce the new page

**Quote:** After activating “Test lab,” `document.activeElement` is `<body>`;
after Back it is also `<body>`. The home page has no polite live region for route
announcements.

**Why this matters:** Keyboard and screen-reader users do not receive the
required programmatic route context. Deep-link loading and browser Back do
change the URL correctly, but that is only part of the routing contract.

**Concrete fix:** On route entry, focus the new h1 using `tabindex="-1"` and
announce its text in a persistent `aria-live="polite"` region. Add a browser
test for direct load, link navigation, Back, URL, scroll restoration, focus,
and announcement.

### HIGH H-03 — Several mobile touch targets are below 44 px

**Quote:** At 390 px, the brand link is 42 px high, “Reproduce this seeded
defect” is 19 px high, and footer “Privacy,” “Terms,” and “Source” links are
25 px high. Legal-route footer links have the same 25 px height.

**Why this matters:** These links do not meet the product’s stated 44 px touch
target baseline and are harder to activate on a phone.

**Concrete fix:** Give every interactive target a minimum 44 × 44 px hit area,
including inline and footer links, without relying on text height. Add a 390 px
bounding-box assertion.

### MEDIUM M-01 — Header/footer structure is not consistent across routes

**Quote:** Home navigation is “How it works / Test lab / Download .zip”; lab is
“Product / Privacy / Download .zip”; legal pages are “Product / Test lab /
Download .zip.” The home footer contains the product disclosure and Source;
other footers only show “© 2026 Sociobot · MIT licensed / Privacy / Terms.” No
footer says “Built by Param Factory” or shows a version/build ID.

**Why this matters:** The navigation model changes by route and required
ownership/version context disappears on inner pages.

**Concrete fix:** Use one shared header and footer on every route. Include the
wordmark, no more than four stable nav links, product one-line description,
Privacy, Terms, “Built by Param Factory,” and a version/build ID. Label the
GitHub link “Source (external).”

### MEDIUM M-02 — README omits the demo and deployment handoff

**Quote:** README links only to the live site and gives development/build
commands. It has no `/demo` entry or deployment procedure.

**Why this matters:** A verifier cannot discover the required sandbox from the
documentation, and the documented handoff is incomplete.

**Concrete fix:** Add “Try the demo” with the direct URL and isolation/reset
behavior. Add the exact static deployment output/root and deployment check,
while retaining the instruction that infrastructure changes happen outside the
repository.

### MINOR N-01 — A declared decorative hero image is announced as content

**Quote:** Alt text: “Abstract concrete testing slab with a moss path connecting
inset focus targets.” `.factory/design.md` calls the hero “decorative editorial
evidence.”

**Why this matters:** The decorative image adds a long, non-actionable stop for
screen-reader users next to an already descriptive hero.

**Concrete fix:** Use `alt=""` if the image remains decorative. If it conveys
required meaning, revise the design note and give the image a purpose-based alt
that explains information not already present in the copy.

## Copy audit

Word count treats a hyphenated or slash-connected token as one word. Markdown
syntax is excluded. The landing list covers every visible sentence; headings,
actions, labels, and alt text are audited separately because most are fragments.
The README list also includes headings and list items so no instructional copy
is skipped.

### Flagged copy findings and proposed rewrites

| ID | Severity | Flag | Proposed rewrite |
| --- | --- | --- | --- |
| C-01 | Blocking (B-01) | The hero sentence is 26 words, over the 22-word cap, and uses “narrowed semantic state” and “offline HTML trace.” | “Record keyboard actions, focus changes, and the visible page. Export one trace file that opens offline.” |
| C-02 | High | “Local interaction evidence / MV3” uses unexplained platform jargon. | “Keyboard and focus evidence / Chrome and Edge.” |
| C-03 | Medium | “The missing middle of a bug report.” does not identify the missing evidence out of context. | “Record what automated audits and video miss.” |
| C-04 | Medium | “Built for handoff” uses an abstract noun and does not name what is handed off. | “Share one trace file with your team.” |
| C-05 | Medium | “The file explains itself” is vague out of context. | “Read timing and focus details in the exported file.” |
| C-06 | Medium | “Reproduce it. Record it. Hand it off.” uses an undefined pronoun and “handoff” jargon. | “Reproduce the focus bug. Record it. Share the trace.” |
| C-07 | Medium | “Small enough to attach. Specific enough to act on.” is subjective marketing copy with no measurable threshold. | “Export one HTML file with keyboard, timing, and focus details.” |
| C-08 | Minor | “One purpose-built local utility…” uses the marketing adjective “purpose-built” and the abstract “gap.” | “Use one local extension to capture an accessibility failure for a bug report.” |
| C-09 | Medium | “Download .zip” and “Download v1 .zip” name a format, not the result. | “Download extension ZIP” and “Download A11y Interaction Trace v1.” |
| C-10 | High | README’s audience sentence is 29 words, over the 22-word cap. | “For web developers, accessibility testers, QA engineers, and issue triagers. Use it when a screen recording does not show enough.” |
| C-11 | Medium | README opens with “privacy-first,” “compact, reproducible handoff,” “sanitized,” and “DOM-derived accessibility state.” | “This Chrome and Edge extension records keyboard actions, focus changes, nearby controls, and optional screenshots. It exports one HTML trace file.” |
| C-12 | Medium | “safe, seeded focus-containment defect” is dense specialist wording. | “The included `/lab/` page has a deliberately broken dialog with a safe Escape key exit.” |
| C-13 | Medium | README uses implementation terms without a plain introduction: `chrome.storage.local`, `activeTab`, `scripting`, “ordered persistence,” and “service-worker shell cache.” | Name the user-visible effect first, then put the API term in parentheses; for example, “The trace stays in the browser’s extension storage (`chrome.storage.local`).” |
| C-14 | Medium | One concept changes names: “narrowed semantic state,” “narrow semantic snapshot,” “DOM-derived accessibility state,” and “narrowed semantic snapshot.” | Use “nearby control snapshot” everywhere, followed once by the precise limitation. |
| C-15 | Medium | The recorded/exported artifact changes among “session,” “trace,” “offline HTML trace,” “viewer,” “evidence file,” and “bundle.” | Use “recording” while capture is active, “trace” for saved data, and “trace file” for the exported HTML. |
| C-16 | Minor | README says “the current/local trace,” a slash construction that leaves the term unresolved. | “the current trace.” |
| C-17 | Minor | “Stop visibly” names a quality, not the available control. | “Stop from the recorder bar.” |
| C-18 | Minor | “One timeline, four signals” does not name the four signals. | “One timeline with keys, focus, page, and controls.” |
| C-19 | Minor | “Pixels are opt-in” uses a metaphor where the product means screenshots. | “Screenshots are optional.” |
| C-20 | Minor | “Install unpacked / v1” is compressed release jargon. | “Install version 1 manually.” |
| C-21 | Minor | README’s “shortcut shape” does not say which information remains. | “Keyboard actions, keeping navigation keys and modifier keys while replacing typed characters with `Character`.” |
| C-22 | Minor | “Free and local-first” uses an undefined privacy label. | “Free. Stores traces only in your browser.” |

No banned words from the supplied list appear. “Download extension” and
“Reproduce this seeded defect” are result-naming actions; “Install instructions”
and “Test lab” are destination links rather than action buttons.

### Landing page sentences

| # | Exact sentence | Words | Audit |
| --- | --- | ---: | --- |
| L-01 | “You’re offline.” | 2 | Unflagged. |
| L-02 | “The page is cached; downloads may need a connection.” | 9 | UC-12 scope. |
| L-03 | “Make focus failures visible.” | 4 | Headline length passes; B-01 because no audience sentence accompanies it. |
| L-04 | “Record the keyboard path, focused control, visible page, and narrowed semantic state—then hand off one offline HTML trace instead of another ‘can you reproduce?’ thread.” | 26 | C-01; UC-01. |
| L-05 | “Automated audits find rules.” | 4 | Unflagged. |
| L-06 | “Screen recordings show pixels.” | 4 | Unflagged. |
| L-07 | “A11y Interaction Trace records the human interaction between them, in the order it happened.” | 14 | UC-03. |
| L-08 | “Three keystrokes show exactly when focus leaves a dialog.” | 9 | UC-04. |
| L-09 | “The recorder only runs after you start it.” | 8 | UC-05. |
| L-10 | “A toolbar badge and page dock stay visible.” | 8 | UC-06. |
| L-11 | “Stop from either place.” | 4 | UC-06. |
| L-12 | “Printable keys become ‘Character.’” | 4 | UC-07. |
| L-13 | “Password and payment fields are marked sensitive; values never enter the trace.” | 12 | UC-08. |
| L-14 | “Screenshots start off.” | 3 | UC-09. |
| L-15 | “When enabled, the extension captures only the visible tested tab—not your desktop or other tabs.” | 16 | UC-10. |
| L-16 | “The exported viewer includes timing, focus, role/name/state context, and honest scope notes.” | 12 | UC-11; terminology C-14/C-15. |
| L-17 | “It needs no hosted app.” | 5 | UC-12. |
| L-18 | “Small enough to attach.” | 4 | C-07; untestable marketing claim. |
| L-19 | “Specific enough to act on.” | 5 | C-07; untestable marketing claim. |
| L-20 | “Everything stays in browser-local storage until you clear it.” | 9 | UC-13. |
| L-21 | “No analytics, trackers, account, or third-party runtime.” | 7 | UC-14. |
| L-22 | “Works offline after installation; exports open offline anywhere.” | 8 | UC-12. |
| L-23 | “Narrow snapshots are labeled—not passed off as a full OS accessibility tree.” | 13 | UC-15; terminology C-14. |
| L-24 | “Download and unzip.” | 3 | Unflagged. |
| L-25 | “In Chrome or Edge, open the Extensions page, enable Developer mode, choose ‘Load unpacked,’ and select the extracted folder.” | 19 | Unflagged. |
| L-26 | “Pin the moss-path icon, open your test page, and press Start.” | 11 | Unflagged. |
| L-27 | “Reproduce it.” | 2 | C-06. |
| L-28 | “Record it.” | 2 | C-06. |
| L-29 | “Hand it off.” | 3 | C-06. |
| L-30 | “One purpose-built local utility for the gap between an accessibility failure and a fix.” | 14 | C-08. |
| L-31 | “Free and local-first.” | 3 | C-22; UC-02/UC-13. |
| L-32 | “Hero artwork was generated for this product with the Param Factory image model; interface marks and diagrams are original authored assets.” | 21 | UC-26. |

### Landing headings, actions, labels, and alt text

| Exact text | Words | Audit |
| --- | ---: | --- |
| “Skip to main content” | 4 | Clear. |
| “A11Y INTERACTION TRACE” | 3 | Product wordmark; repeated in header/footer. |
| “How it works” | 3 | Clear destination. |
| “Test lab” | 2 | Clear destination, but not a demo; B-02. |
| “Download .zip” | 2 | C-09. |
| “Local interaction evidence / MV3” | 4 | C-02. |
| “Download extension” | 2 | Clear action. |
| “Install instructions” | 2 | Clear destination. |
| “FREE · CHROME / EDGE · NO ACCOUNT · NO UPLOAD” | 7 | UC-02. |
| “EVIDENCE PATH / 01—04” | 4 | Decorative label; understandable with the adjacent list. |
| “01 Explicitly start” | 3 | Clear. |
| “02 Reproduce with keys” | 4 | Clear. |
| “03 Stop visibly” | 3 | C-17. |
| “04 Export one file” | 4 | Clear. |
| “One timeline, four signals” | 4 | C-18. |
| “The missing middle of a bug report.” | 7 | C-03. |
| “Example trace” | 2 | Clear. |
| “Focus containment failure” | 3 | Domain-specific but appropriate for the named audience. |
| “Reproduce this seeded defect” | 4 | C-12 applies to “seeded”; the action otherwise names its result. |
| “Enter” / “Shift + Tab” / “Escape” | 1 / 2 / 1 | Clear key labels. |
| “Built for handoff” | 3 | C-04. |
| “Evidence, not surveillance.” | 3 | Clear privacy contrast. |
| “Words stay private” | 3 | Clear, subject to UC-07/UC-08. |
| “Pixels are opt-in” | 3 | C-19. |
| “The file explains itself” | 4 | C-05. |
| “Install unpacked / v1” | 3 | C-20. |
| “From zip to first trace.” | 5 | Clear in the install section. |
| “Reproduce it. Record it. Hand it off.” | 7 | C-06. |
| “Download v1 .zip” | 3 | C-09. |
| “Privacy” / “Terms” / “Source” | 1 / 1 / 1 | Clear destinations; Source needs an external-site cue. |
| Hero alt: “Abstract concrete testing slab with a moss path connecting inset focus targets” | 12 | N-01. |

### README sentences and content units

| # | Exact sentence or unit | Words | Audit |
| --- | --- | ---: | --- |
| R-01 | “A11y Interaction Trace” | 3 | Product-name heading is clear. |
| R-02 | “A privacy-first Chrome/Edge extension for turning a broken keyboard interaction into a compact, reproducible handoff.” | 15 | C-11. |
| R-03 | “It records sanitized keyboard actions, focus targets, selected DOM-derived accessibility state, and optional screenshots, then exports one self-contained HTML viewer.” | 20 | C-11; UC-01. |
| R-04 | “Live site: https://a11y-interaction-trace.sociobot.in” | 4 | Clear. |
| R-05 | “Who it is for” | 4 | Clear heading. |
| R-06 | “Web developers, accessibility testers, QA engineers, and issue triagers who need more evidence than a screen recording but do not want to upload a session to a third-party service.” | 29 | C-10. |
| R-07 | “What v1 records” | 3 | Clear heading. |
| R-08 | “Keyboard actions, preserving navigation keys and shortcut shape while replacing printable input with `Character`” | 14 | C-21; UC-07/UC-16. |
| R-09 | “The focused element’s role, accessible name, stable selector, and relevant ARIA state” | 12 | UC-16. |
| R-10 | “A narrow semantic snapshot of nearby interactive controls” | 8 | C-14; UC-16. |
| R-11 | “Page URL/title, viewport, timing, and browser metadata” | 7 | UC-16. |
| R-12 | “Visible-tab JPEG screenshots only when explicitly enabled for that session” | 10 | UC-09/UC-10/UC-16. |
| R-13 | “The browser does not expose its full platform accessibility tree to a normal cross-browser extension.” | 15 | UC-17. |
| R-14 | “The UI and export therefore call this a narrowed semantic snapshot rather than overstating the result.” | 16 | C-14; UC-15. |
| R-15 | “Install the packaged extension” | 4 | Clear heading. |
| R-16 | “Run `npm ci && npm run build`, or download the release zip from the site.” | 14 | Clear. |
| R-17 | “Unzip `dist/site/downloads/a11y-interaction-trace.zip`.” | 2 | Clear. |
| R-18 | “Open `chrome://extensions` or `edge://extensions`.” | 6 | Clear. |
| R-19 | “Enable Developer mode and choose Load unpacked.” | 7 | Clear. |
| R-20 | “Select the extracted directory and pin the extension.” | 8 | Clear. |
| R-21 | “Record a trace” | 3 | Clear heading. |
| R-22 | “Open the page under test.” | 5 | Clear. |
| R-23 | “The included `/lab/` route has a safe, seeded focus-containment defect.” | 10 | C-12; UC-04. |
| R-24 | “Open the extension.” | 3 | Clear. |
| R-25 | “Screenshots are off by default; opt in only when the visible page is safe to capture.” | 16 | UC-09. |
| R-26 | “Select Start on this tab and reproduce the issue with the keyboard.” | 12 | UC-01. |
| R-27 | “Stop from the always-visible in-page dock or the extension popup.” | 10 | UC-06. |
| R-28 | “Select Export offline viewer and attach the resulting HTML file to the issue.” | 13 | UC-01/UC-12. |
| R-29 | “Use Clear local trace when finished.” | 6 | UC-13. |
| R-30 | “Privacy and permissions” | 3 | Clear heading. |
| R-31 | “All session data stays in `chrome.storage.local`; there is no account, API, analytics, or upload.” | 14 | C-13/C-15; UC-13/UC-14. |
| R-32 | “The extension requests:” | 3 | Clear. |
| R-33 | “`activeTab` and `scripting` to inject the recorder only into the tab where the toolbar action was invoked” | 17 | C-13; UC-18. |
| R-34 | “`storage` for the current/local trace” | 5 | C-16; UC-18. |
| R-35 | “`downloads` for the exported viewer” | 5 | C-15; UC-18. |
| R-36 | “There is no `<all_urls>` host permission.” | 7 | UC-18. |
| R-37 | “Recording cannot run on browser-internal pages.” | 6 | UC-19. |
| R-38 | “Screenshots are rate-limited and capped at 12 per trace to limit local storage growth.” | 14 | UC-20. |
| R-39 | “See `site/privacy/index.html` for the full policy.” | 6 | Clear. |
| R-40 | “Development” | 1 | Clear heading. |
| R-41 | “Requirements: Node.js 20+ and npm.” | 5 | Clear. |
| R-42 | “`npm run build` produces:” | 4 | UC-21. |
| R-43 | “`.output/chrome-mv3/` — unpacked MV3 extension” | 4 | UC-21; MV3 is acceptable in developer output. |
| R-44 | “`.output/a11y-interaction-trace-1.0.0-chrome.zip` — packaged extension” | 3 | UC-21. |
| R-45 | “`dist/site/index.html` — deploy root” | 3 | UC-21. |
| R-46 | “`dist/site/downloads/a11y-interaction-trace.zip` — public download” | 3 | UC-21. |
| R-47 | “To run browser checks for the first time:” | 8 | Clear. |
| R-48 | “Architecture” | 1 | Clear heading. |
| R-49 | “WXT + TypeScript, Manifest V3” | 4 | Appropriate developer terminology. |
| R-50 | “An on-demand isolated recorder injected with `activeTab`” | 7 | C-13; UC-22. |
| R-51 | “A background service worker for ordered persistence, screenshot capture, badge state, and export” | 13 | C-13; UC-22. |
| R-52 | “A dependency-free offline HTML viewer embedded into each export” | 9 | UC-12/UC-22. |
| R-53 | “Vite static site, privacy/terms pages, test lab, and service-worker shell cache” | 11 | C-13; UC-22. |
| R-54 | “Limits” | 1 | Clear heading. |
| R-55 | “Chromium browsers only in v1.” | 5 | UC-02. |
| R-56 | “Snapshots approximate accessible names/roles from the DOM; they are not the browser/OS accessibility tree.” | 14 | UC-23. |
| R-57 | “Cross-origin navigation ends the effective `activeTab` grant.” | 7 | C-13; UC-24. |
| R-58 | “Stop the current trace and start another on the new origin.” | 11 | Clear recovery instruction. |
| R-59 | “Shadow DOM and cross-origin iframe internals are outside the recorder’s current scope.” | 12 | Technical but precise; UC-25. |
| R-60 | “License” | 1 | Clear heading. |
| R-61 | “MIT.” | 1 | UC-27. |
| R-62 | “Generated hero provenance and the complete visual system are documented in `.factory/design.md`.” | 12 | UC-26. |

The README command blocks contain commands and short code comments, not prose
sentences; they were executed rather than word-counted.

## Demo and sandbox evidence

- Fresh mobile and desktop contexts opened the live home page with no prior
  cookies or site data.
- The closest path, `/lab/`, shows a deliberately flawed dialog and a manual
  recipe. It does not show a running trace, seeded trace data, a demo banner, a
  reset control, or a route back to a real-data mode.
- `/demo` and `/?demo=1` do not enter a demo.
- A `real:sentinel=keep` and `trace=real-trace` placed in site localStorage
  remained unchanged after visiting the lab. This only proves the static lab
  did not touch site localStorage; it does not prove a missing demo cannot touch
  `chrome.storage.local`.
- A live landing → lab → dialog interaction captured only same-origin network
  requests and no console errors.
- After a priming load, the live landing page reloaded with network access
  disabled and returned the expected h1. This verifies the site shell cache,
  not the uninstalled extension or an absent demo.

## Structure, accessibility, and visual checks

| Check | Result | Evidence |
| --- | --- | --- |
| Titles | Pass on four real routes | Home title is 58 characters; Privacy, Terms, and Lab use route-specific titles. `/demo` and unknown paths fail under B-02/B-04. |
| One h1, `lang`, `main`, alt presence | Pass on `/`, `/lab/`, `/privacy/`, `/terms/` | Live `verify-url.sh` reports title, `lang=en`, one h1, main present, zero missing alts, and zero console errors. |
| Meta description | Pass on four real routes | Descriptions are 33–117 characters. |
| Canonical / OG / Twitter / apple-touch / theme-color | Fail | All are absent; H-01. |
| Designed 404 | Blocking fail | Unknown route returns the home page with 200; B-04. |
| Deep links and browser Back | Partial | `/lab/`, `/privacy/`, and `/terms/` open directly and Back changes URL, but focus/announcement fail; H-02. |
| Dead-link crawl | Pass | Every unique home/lab/privacy/terms link returned 200, including the ZIP and GitHub Source. |
| Header/footer skeleton | Fail | Route variants omit required stable content; M-01. |
| Visual identity | Pass | The concrete grid, moss path, hard outlines, compressed display type, authored mark, and generated slab art match `.factory/design.md` and do not resemble a generic SaaS card/gradient layout. |
| Axe | Pass | Live 390 px scans of all four real routes returned zero violations; clean-clone Playwright/axe suite passed 7/7. |
| Keyboard focus | Partial | Tab order is usable and every tested focused control shows a 3 px green outline; route-entry focus fails under H-02. |
| Touch targets | Fail | Several links are 19–42 px high; H-03. |
| Reduced motion | Pass | At `prefers-reduced-motion: reduce`, computed scroll behavior is `auto` and no element has a non-zero animation or transition duration. |
| Contrast | Pass in automated scan | Axe reported no contrast violations on all tested routes. |
| Console / remote runtime | Pass | No console errors; loaded scripts, styles, images, and the service worker are same-origin. |
| First-load JavaScript | Pass | Production build emits approximately 0.6 kB gzip of site JavaScript, below the 150/200 kB thresholds. |
| Security headers | Pass | Live CSP, HSTS, Referrer-Policy, X-Content-Type-Options, and Permissions-Policy are present. |
| Robots and sitemap | Pass | `robots.txt` allows crawling and points to a sitemap containing `/`, `/lab/`, `/privacy/`, and `/terms/`. |

## Verification commands and results

Run from a clean clone of the base commit:

| Command | Result |
| --- | --- |
| `npm ci` | Pass; 233 packages, zero audit vulnerabilities. |
| `npm test` | Pass; 3 files, 7 tests. |
| `npm run check` | Pass. |
| `npm run build` | Pass; extension ZIP and `dist/site/` produced. |
| `npm run test:a11y` | Pass; 7 Playwright tests. |
| `/opt/fleet/lib/verify-url.sh https://a11y-interaction-trace.sociobot.in <temp-dir>` | Pass; 200, title/lang/main/alt/console basics. |
| Live Playwright + axe on `/`, `/lab/`, `/privacy/`, `/terms/` at 390 px | Pass; zero axe violations. |
| Live link crawl | Pass; every unique linked target returned 200. |
| Live unknown route | Fail; returns home page with HTTP 200. |
| Claim commands from `.factory/claims.json` | Blocking: no file and no commands exist. |

No product code was modified during this review.
