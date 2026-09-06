# A11y Interaction Trace — repair 2 handoff

## Result

Repair 2 is complete. The installed extension popup now names the recording job and uses only concrete, registered privacy statements. The metaphorical privacy promise and “Private by design” label are removed.

- Implementation SHA: `38344dfea8a1a63bbcea2bdabb1295f9ab7095a4`
- Review input SHA: `c545db6ef708eaab2e1449790ebcb46136064a10`
- Deployment ID: `cee96b9f-ee8d-47ac-a517-db1bf8748891`
- Live origin: <https://a11y-interaction-trace.sociobot.in>
- Live extension ZIP SHA-256: `0810928e3861dadd8e63b9e0e0aa920c1d0bbba6fe6bde199be117ae998e993a`

This handoff is a documentation-only commit after the implementation SHA. The final documentation SHA is recorded in the delivery message and repository history.

## Changes

- Popup title: “A11y Interaction Trace — record keyboard focus bugs.”
- Popup h1: “Record keyboard focus changes.”
- Popup privacy note now states typed-key replacement, screenshot masking, no upload, and the instruction to review a trace before sharing.
- Idle toolbar title and manifest action title use the job-naming title.
- Manifest description names optional screenshots instead of the ambiguous “visible UI.”
- The copy audit now includes 12 popup sentences and their registered claim mappings.
- A browser regression loads the built extension and checks the popup title, one h1, one main, first action, 380 × 600 fit, default-off screenshot switch, focus outline, privacy facts, toolbar title, and Axe results.

## Finding disposition

Review 8 finding F-8-1 is closed at its source. The removed slogan is not replaced with another unregistered privacy promise. The remaining popup privacy facts map to `key-privacy`, `sensitive-mask`, `screenshot-boundary`, and `local-no-upload`.

All earlier review findings were rechecked through their outcome tests. This includes the isolated sample, true 404, route focus, mobile targets, sample semantics, screenshot masking under concurrency, chronological serialization, pre-start exclusion, real downloaded-file offline use, all-route offline use, and exact permissions.

## Clean verification

Fresh clone: `/tmp/a11y-repair-2-clean-uysNSa/repo`.

- `npm ci`: passed; 235 packages audited and zero vulnerabilities.
- Every exact command in `.factory/claims.json`: 20/20 passed independently.
- `npm test`: 11/11 passed.
- `npm run check`: passed.
- `npm run build`: passed; unpacked extension, packaged ZIP, `dist/site`, and public download produced.
- `npm run test:a11y`: 32/32 passed.
- `npm audit --omit=dev`: passed.
- Extension ZIP integrity: passed.

The full browser suite includes six site-route Axe checks and the installed-popup Axe regression. No serious or critical violation was found.

## Live verification

- Deployment wrapper completed successfully and managed TLS returned HTTP 200.
- Live route, keyboard, focus, phone target, offline, Axe, and 404 suite: 13/13 passed.
- Live sample/export/order/scope/offline subset: 8/8 passed.
- `verify-url.sh`: HTTP 200, correct title, `lang=en`, one h1, one main, no missing alt text, no unnamed buttons, and no console errors.
- Unknown path returned the designed HTTP 404 and a working return link.
- `/`, `/demo/`, `/lab/`, `/privacy/`, and `/terms/` returned their route-specific documents.
- CSP, Permissions-Policy, Referrer-Policy, HSTS, and `X-Content-Type-Options` are present. Fingerprinted assets use one-year immutable caching.
- The live ZIP is byte-for-byte identical to the local build. A fresh consumer profile loaded its popup with the repaired copy, default-off screenshot switch, first action within 380 × 600, and no console errors.
- Invalid start on `chrome://version/` returned the recovery instruction. Empty export returned the required record-first instruction.

Fresh phone and desktop browsers showed the job, audience, and first action before scrolling:

- Job: record keyboard focus failures for a team.
- Audience: web developers and accessibility testers needing reproducible keyboard evidence.
- First action: “Try it with sample data.”

The live sample showed the checkout dialog and four ordered events. Replay changed only demo state, Reset restored the seed byte-for-byte, and Start for real removed demo keys while preserving a real-data sentinel.

## Performance

Fresh live mobile Lighthouse:

- Performance: 100
- Accessibility: 100
- Best Practices: 100
- SEO: 100
- LCP: 1.1 s
- TBT: 90 ms
- CLS: 0

Build sizes remain below budget: main site JavaScript 2.15 kB, demo JavaScript 8.18 kB, CSS 14.69 kB, and phone hero image 25.01 kB.

## Evidence and remaining work

The verb-first catalog description is 71 characters before its newline and was copied to `/work/.evidence/catalog-description.txt`. Phone, desktop, demo, popup, and Lighthouse evidence are also in `/work/.evidence/`.

No known product finding remains. Backend, tenant, health, rate-limit, SQLite, and billing checks do not apply to this static site and free browser extension. No AI feature is added because network inference would not improve the local trace-capture job.

The work order referenced `/work/.evidence/qa-result.json`, but that file was not present in this container. The committed review history and newly generated clean/live evidence were used instead.
