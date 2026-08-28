# Polish round 2 — complete finding closure

Completed 2026-08-28. Repair implementation: `cbda128497c3bc207b507467f09fa87d36ba7634`. It is pushed and deployed at <https://a11y-interaction-trace.sociobot.in>.

Evidence labels below refer to the clean-clone claim run (17/17), local browser suite (28/28), live route suite (13/13), live demo/export suite (6/6), and the screenshots in `.factory/evidence-polish-2-*.png`.

## Review 2 findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-2-1 / B-01 | Constrained desktop hero to 48–56 px, widened copy column, reduced vertical spacing, and added 1440 × 900 bounds regression. | `1440px first screen…` local/live; home desktop screenshot |
| F-2-2 | Demo Project name now serializes as `input` / `textbox`; downloaded export compares each tag/role/name/selector to sample controls. | `@claim:snapshot-scope` clean/live; demo URL |
| F-2-3 / C-14 / UC-15 | Replaced remaining “nearby controls” UI, README, demo, manifest, and claims text with “nearby control snapshot(s)”. | terminology search; `@claim:snapshot-scope`; live demo |
| F-2-4 | Removed untestable screen-recording comparison from README. | README review; export claim |
| F-2-5 | Removed broad, untestable permission/page-policy capture limit from README and Terms. | README/Terms review; claims registry |
| F-2-6 | Corrected 15- and 12-word audit values and added a count regression. | `npm test` (9 passed) |

## Earlier blocking, high, minor, and unlisted-claim findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| B-02 | Direct demo entry, realistic seed, banner, reset, real-mode exit, prefix isolation, and demo documentation remain live. | `@claim:demo-isolation`; demo screenshot |
| B-03 | Registry retains 17 IDs with one tagged test each; every command was run independently from a clean clone. | clean clone 17/17; claims-registry unit test |
| B-04 | Styled concrete-and-moss 404 and static host 404 override remain configured. | live unknown URL HTTP 404; 404 screenshot |
| H-01 | Route-specific titles, descriptions, canonical, social metadata, icons, and theme colors remain complete. | live route suite |
| H-02 | Heading focus and polite announcement remain on direct navigation and Back. | route-focus local/live test |
| H-03 | 44 px target sizing remains across mobile routes. | mobile target local/live test |
| M-01 | Consistent header/footer, legal/source links, version, and Param Factory credit remain. | live route suite |
| M-02 | README retains demo namespace, build, deploy, and live-check instructions. | README; demo isolation claim |
| N-01 | Decorative hero continues to use empty alt text. | live axe suite |
| UC-01 | Fixed sample actions, focus, page details, and nearby control snapshots remain exported. | `@claim:trace-export-content` |
| UC-02 | Free, Chromium package, and no-account/upload facts remain separately tested. | `free-mit`, `chromium-package`, `local-no-upload` |
| UC-03 | Event order remains serialized and displayed in time order. | `@claim:chronological-order` |
| UC-04 | Shift+Tab escape and Escape recovery remain reproducible. | `@claim:seeded-focus-defect` |
| UC-05 | Capture still begins only after explicit Start. | `@claim:explicit-recording` |
| UC-06 | Toolbar badge, recorder bar, and both stop paths remain checked. | `@claim:explicit-recording` |
| UC-07 | Printable key masking and navigation-key retention remain checked. | `@claim:key-privacy` |
| UC-08 | Sensitive structured data and screenshot masking remain checked. | `@claim:sensitive-mask` |
| UC-09 | Screenshots remain unchecked by default. | `@claim:screenshot-boundary` |
| UC-10 | Visible-tab-only capture and 12-image cap remain checked. | `@claim:screenshot-boundary` |
| UC-11 | Export fields remain timing, focus, role, name, state, and scope. | `@claim:trace-export-content` |
| UC-12 | Export and cached landing remain usable offline. | `offline-export`, `offline-site` |
| UC-13 | Browser-only storage and clear behavior remain checked. | `@claim:local-no-upload` |
| UC-14 | No account, analytics, tracker, API, or upload behavior remains checked. | `@claim:local-no-upload` |
| UC-16 | README outcomes remain mapped to the matching tests. | key/privacy/export/screenshot claims |
| UC-17 | Only selected-DOM scope wording remains. | `@claim:snapshot-scope` |
| UC-18 | Exact four-permission manifest stays checked. | `@claim:manifest-permissions` |
| UC-19 | Untested browser-internal-page assertion remains removed. | copy review |
| UC-20 | Explicit 12-capture limit result remains checked. | `@claim:screenshot-boundary` |
| UC-21 | All production artifacts remain checked. | `@claim:packaged-build` |
| UC-22 | Architecture-only public claims remain removed. | copy review |
| UC-23 | DOM-only scope limitation remains in demo and export. | `@claim:snapshot-scope` |
| UC-24 | Untested cross-origin grant statement remains removed. | copy review |
| UC-25 | Untested Shadow DOM/iframe statement remains removed. | copy review |
| UC-26 | Source-art provenance and authored mark record remain present. | `@claim:provenance`; design.md |
| UC-27 | MIT/free and no-billing evidence remains checked. | `@claim:free-mit` |
| UC-28 | Concrete action-to-focus language remains. | `@claim:chronological-order` |
| UC-29 | Concrete bug-report wording remains. | copy audit; live home |
| UC-30 | Untested Node-version promise remains removed. | README review |
| C-01 | Short hero body remains. | copy audit; 390/1440 tests |
| C-02 | “Keyboard and focus evidence” eyebrow remains. | live home |
| C-03 | “Record what changed after each key” remains. | live home |
| C-04 | “Share the trace” wording remains. | copy audit |
| C-05 | Named export contents remain. | `@claim:trace-export-content` |
| C-06 | Concrete three-step close remains. | copy audit |
| C-07 | Subjective size/actionability wording remains removed. | copy audit |
| C-08 | Concrete local bug-report wording remains. | copy audit |
| C-09 | Explicit extension ZIP/download labels remain. | live mobile checks |
| C-10 | Named-audience README sentences remain short. | README review |
| C-11 | Concrete README opening now also uses the scope term consistently. | README review |
| C-12 | Deliberately broken lab description remains. | seeded-defect claim |
| C-13 | Storage/permission effects remain before API details. | README review |
| C-15 | Recording/trace/trace-file terms remain standardized. | copy audit |
| C-16 | “Current trace” remains standardized. | README review |
| C-17 | Recorder-bar stop wording remains. | live home |
| C-18 | Named keys/focus/page/controls evidence remains. | live home |
| C-19 | “Screenshots are optional” remains. | live home |
| C-20 | Plain manual-install wording remains. | live home |
| C-21 | `Character` wording and behavior remain. | `@claim:key-privacy` |
| C-22 | Free/browser-storage facts remain concrete. | `free-mit`, `local-no-upload` |

All earlier items were rechecked rather than accepted from the previous handoff. No item remains unresolved.
