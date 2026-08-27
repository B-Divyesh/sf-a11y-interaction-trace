# A11y Interaction Trace

A privacy-first Chrome/Edge extension for turning a broken keyboard interaction into a compact, reproducible handoff. It records sanitized keyboard actions, focus targets, selected DOM-derived accessibility state, and optional screenshots, then exports one self-contained HTML viewer.

Live site: <https://a11y-interaction-trace.sociobot.in>

## Who it is for

Web developers, accessibility testers, QA engineers, and issue triagers who need more evidence than a screen recording but do not want to upload a session to a third-party service.

## What v1 records

- Keyboard actions, preserving navigation keys and shortcut shape while replacing printable input with `Character`
- The focused element’s role, accessible name, stable selector, and relevant ARIA state
- A narrow semantic snapshot of nearby interactive controls
- Page URL/title, viewport, timing, and browser metadata
- Visible-tab JPEG screenshots only when explicitly enabled for that session

The browser does not expose its full platform accessibility tree to a normal cross-browser extension. The UI and export therefore call this a **narrowed semantic snapshot** rather than overstating the result.

## Install the packaged extension

1. Run `npm ci && npm run build`, or download the release zip from the site.
2. Unzip `dist/site/downloads/a11y-interaction-trace.zip`.
3. Open `chrome://extensions` or `edge://extensions`.
4. Enable Developer mode and choose **Load unpacked**.
5. Select the extracted directory and pin the extension.

## Record a trace

1. Open the page under test. The included `/lab/` route has a safe, seeded focus-containment defect.
2. Open the extension. Screenshots are off by default; opt in only when the visible page is safe to capture.
3. Select **Start on this tab** and reproduce the issue with the keyboard.
4. Stop from the always-visible in-page dock or the extension popup.
5. Select **Export offline viewer** and attach the resulting HTML file to the issue.
6. Use **Clear local trace** when finished.

## Privacy and permissions

All session data stays in `chrome.storage.local`; there is no account, API, analytics, or upload. The extension requests:

- `activeTab` and `scripting` to inject the recorder only into the tab where the toolbar action was invoked
- `storage` for the current/local trace
- `downloads` for the exported viewer

There is no `<all_urls>` host permission. Recording cannot run on browser-internal pages. Screenshots are rate-limited and capped at 12 per trace to limit local storage growth. See [`site/privacy/index.html`](site/privacy/index.html) for the full policy.

## Development

Requirements: Node.js 20+ and npm.

```bash
npm ci
npm run dev          # WXT extension development
npm run dev:site     # landing site at localhost:5173
npm run check        # TypeScript
npm test             # unit tests
npm run test:a11y    # Playwright + axe (install Chromium first; see below)
npm run build        # exact production build command
```

`npm run build` produces:

- `.output/chrome-mv3/` — unpacked MV3 extension
- `.output/a11y-interaction-trace-1.0.0-chrome.zip` — packaged extension
- `dist/site/index.html` — deploy root
- `dist/site/downloads/a11y-interaction-trace.zip` — public download

To run browser checks for the first time:

```bash
npx playwright install chromium
npm run test:a11y
```

## Architecture

- WXT + TypeScript, Manifest V3
- An on-demand isolated recorder injected with `activeTab`
- A background service worker for ordered persistence, screenshot capture, badge state, and export
- A dependency-free offline HTML viewer embedded into each export
- Vite static site, privacy/terms pages, test lab, and service-worker shell cache

## Limits

- Chromium browsers only in v1.
- Snapshots approximate accessible names/roles from the DOM; they are not the browser/OS accessibility tree.
- Cross-origin navigation ends the effective `activeTab` grant. Stop the current trace and start another on the new origin.
- Shadow DOM and cross-origin iframe internals are outside the recorder’s current scope.

## License

MIT. Generated hero provenance and the complete visual system are documented in [`.factory/design.md`](.factory/design.md).
