# A11y Interaction Trace

This Chromium extension records keyboard actions, focus changes, nearby control snapshots, and optional screenshots. It exports one HTML trace file.

For web developers, accessibility testers, QA engineers, and issue triagers. Use it to record keys and focus changes in a bug report.

- Live site: <https://a11y-interaction-trace.sociobot.in>
- Sample trace: <https://a11y-interaction-trace.sociobot.in/?demo=1>

## Try the sample trace

Open the sample link once. It shows a checkout dialog and four ordered events without an install.

The banner identifies demo mode. **Reset demo** restores the original four-event sample. **Start for real** removes all demo data.

Demo data uses local-storage keys beginning with `demo:a11y-interaction-trace:`. The demo never reads or changes other storage keys.

See [`.factory/demo.md`](.factory/demo.md) for the exact seed and isolation checks.

## What version 1 records

- Keyboard actions, with typed characters replaced by `Character`
- Focus role, name, stable selector, and relevant state
- A nearby control snapshot with selected DOM details
- Page URL, title, viewport, timing, and browser details
- Visible-tab JPEG screenshots when you enable them

The snapshot is not the browser or operating-system accessibility tree.

## Install the extension

1. Run `npm ci && npm run build`, or download the extension ZIP from the live site.
2. Unzip `dist/site/downloads/a11y-interaction-trace.zip`.
3. Open your Chromium browser’s Extensions page.
4. Enable Developer mode and choose **Load unpacked**.
5. Select the extracted directory and pin the extension.

## Record a trace

1. Open the page under test. The included `/lab/` page has a deliberately broken dialog with an Escape key exit.
2. Open the extension. Screenshots are off until you enable them for that recording.
3. Select **Start on this tab**, then reproduce the issue with the keyboard.
4. Stop from the recorder bar or the extension popup.
5. Select **Export trace file**, then attach the HTML file to the issue.
6. Select **Clear local trace** when finished.

## Privacy and permissions

The current trace stays in browser extension storage (`chrome.storage.local`). The extension has no account, analytics, tracker, API, or upload service.

Its manifest requests four permissions:

- `activeTab` and `scripting` run the recorder in the tab you choose.
- `storage` keeps the current trace in the browser.
- `downloads` saves the trace file.

The manifest has no host permissions. Sensitive field values are excluded before optional screenshots are captured.

## Develop and verify

The commands below use Node.js and npm.

```bash
npm ci
npm run dev          # extension development
npm run dev:site     # local site at http://localhost:5173
npm run check        # TypeScript
npm test             # unit and static tests
npm run test:claims  # one test for every public claim
npm run test:a11y    # browser, accessibility, privacy, and offline tests
npm run build        # production extension and site
```

The production build creates the unpacked extension, packaged ZIP, deployable site, and public download. Claim `packaged-build` verifies every artifact.

## Deploy

The static deployment root is `dist/site`. Build it with `npm ci && npm test && npm run build:site`.

The factory deploys that directory with `/opt/fleet/lib/deploy-static.sh a11y-interaction-trace dist/site`. Infrastructure changes happen outside this repository.

After deployment, check `/`, `/demo/`, `/lab/`, `/privacy/`, `/terms/`, and an unknown path. The unknown path must return the styled 404 response.

## Limits

- Version 1 is packaged for Chromium browsers.
- Nearby control snapshots contain selected DOM details.
- Review each trace file before sharing it.

## License and visual assets

The source uses the MIT License. Generated hero provenance and the visual system are documented in [`.factory/design.md`](.factory/design.md).
