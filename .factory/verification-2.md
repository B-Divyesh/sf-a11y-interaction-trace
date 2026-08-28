# Independent verification — PASS

**Work order:** `a11y-interaction-trace-verify-2`  
**Candidate:** `71081152a4eebbff64be44729d79fde5d10a2d3e`  
**Live URL:** <https://a11y-interaction-trace.sociobot.in>  
**Verified:** 2026-08-28 UTC

## Result

**PASS.** Fresh evidence confirms that the repaired candidate meets the
researched brief's smallest useful product: a locally stored, explicitly
started trace records the seeded keyboard focus-containment defect, presents a
visible recorder state, masks the sensitive fixture before screenshot capture,
and exports an offline viewer. The live site is an exact byte-level match for
the candidate's deployable root page and extension ZIP; the earlier defect was
not deployment-only, and its repair is present both locally and live.

No release-blocking defects were found. Severity summary: **Critical: 0;
High: 0; Medium: 0; Low: 0.**

## Clean checkout and quality gates

The worktree started clean at the candidate SHA. I ran:

```bash
npm ci
npm test
npm run check
npm run build
npx playwright install chromium
npm run test:a11y
npm audit --omit=dev
unzip -t dist/site/downloads/a11y-interaction-trace.zip
```

Results:

- `npm ci` completed with 0 audited vulnerabilities.
- `npm test`: 7/7 Vitest tests passed.
- `npm run check`: passed (`tsc --noEmit`). The repository has no lint script.
- Exact production build `npm run build`: passed. It produced a 41.65 KB
  unpacked MV3 extension, a valid 24,802-byte extension ZIP, and `dist/site/`.
- `npm run test:a11y`: 7/7 Playwright + axe tests passed after installing the
  locked Playwright Chromium revision. This includes the offline reload,
  keyboard defect/recovery, and ARIA-labelled sensitive screenshot/viewer
  regression.
- ZIP integrity check and `npm audit --omit=dev` passed.

The shipped manifest contains exactly `activeTab`, `storage`, `downloads`, and
`scripting`, with no host permissions. Source and built-artifact scans found
no analytics, CDN assets, upload endpoint, or non-product runtime request.

## End-to-end extension evidence

I loaded the built MV3 extension in Chromium and drove its popup and in-page
recorder. Chromium automation cannot synthesize the browser-toolbar user
gesture that grants `activeTab`; to exercise the same built code end-to-end, a
temporary copy outside the repository added `<all_urls>` **only for the test
harness**. The shipped manifest above was separately inspected and was not
changed. This affects the test grant, not recorder/background/popup code.

- Normal seeded case: Start showed the persistent `TRACE REC` dock. Stop
  removed it. The stopped local session had exactly six ordered steps: start;
  focus **Open quick edit** (button); focus **Project name** (textbox);
  `Shift+Tab` on **Background help** (link); `Escape` on **Open quick edit**
  (button); stop. Each interaction had a narrowed semantic snapshot. The
  live lab itself restored focus to the opener after Escape.
- Export: the actual popup reached `READY TO EXPORT`, created a completed
  download through `chrome.downloads`, and reported six timeline steps.
- Invalid/recovery: starting on `chrome://version/` showed `Open a regular web
  page, then start recording again.` A subsequent regular tab immediately
  showed the recorder dock.
- Boundary/privacy: with screenshot opt-in and 13 repeated inputs, the session
  retained exactly 12 JPEG captures and recorded two explicit
  `Screenshot skipped after 12 captures...` errors. A visible
  `type=text aria-label=Password` fixture was masked in actual captured JPEGs:
  sampled mask pixel was RGBA `[26,29,36,255]`; structured trace data did not
  contain `SENSITIVE-ARIA-PASSWORD-8472`. Typed input was recorded as
  `Masked character`, never as the value.

This specifically retests the prior high-severity screenshot issue. The
candidate uses one selector for metadata and visual masking, including
`[aria-label*="password" i]`, and sends the visual mask immediately before
`captureVisibleTab`, removing it in `finally`.

## Live deployment, accessibility, and privacy

Fresh SHA-256 checks prove the live deployment is the candidate:

| Artifact | SHA-256 (local = live) |
| --- | --- |
| `index.html` | `ddecce79693be662068e243e0f5c22ac097c024ef26ff41c85c5a6dc422fb8a6` |
| `downloads/a11y-interaction-trace.zip` | `011e88985cd6430f42c76dbd37f85e14afaf4f42a5520719a187f5a63a8b5010` |

At both 1366 × 900 and 390 × 844, live `/`, `/privacy/`, `/terms/`, and
`/lab/` returned one `main` and one `h1`, had no horizontal overflow, no
console/page errors, no serious or critical axe findings, and no external
runtime request origins. Keyboard-first use exposed the skip link at
`12px,12px` with a visible `3px solid #3e631d` focus outline. With reduced
motion, scroll behavior was `auto` and no animation was running.

The site service worker has an active root scope, accepted `registration.update()`,
and served the landing page after an offline reload. The site is not presented
as a PWA; this checks its supplied offline shell cache.

Live responses have a restrictive CSP and Permissions-Policy. Fingerprinted
assets return `public, max-age=31536000, immutable`; `sw.js` returns
`no-cache, no-store, must-revalidate`; the stable downloadable ZIP returns
five-minute revalidation caching. No CSP violation or unexpected outbound
request appeared in the browser checks.

## Performance

Build output is well inside the supplied static budgets: initial main JS is
287 B (all emitted site JS 1,777 B), CSS is 9,819 B, mobile hero WebP is
25,008 B, and desktop hero WebP is 77,316 B. No third-party fonts are loaded.

Fresh mobile Lighthouse against the live URL scored **100 Performance, 100
Accessibility, 100 Best Practices, 100 SEO**; LCP was **1.06 s**, CLS **0**,
and TBT **77 ms**.

## Known boundaries

- Chromium browsers only; the trace's semantic snapshot is correctly described
  as DOM-derived/narrowed, not the browser or OS accessibility tree.
- Shadow DOM and cross-origin iframe internals are outside scope; cross-origin
  navigation ends the temporary grant.
- Screenshots are opt-in and users should still review an export before sharing.

