# Copy audit — polish round 1

Audited 2026-08-28. Counts treat hyphenated terms as one word. All landing-page sentences are 22 words or fewer, and none uses a banned marketing word.

## First screen

| Copy | Words | Result |
| --- | ---: | --- |
| Record keyboard focus failures for your team. | 7 | Pass; job-led headline under nine words. |
| For web developers and accessibility testers who need reproducible keyboard evidence without uploading a recording. | 14 | Pass; audience and changed situation are explicit. |
| Opens a seeded dialog and sample trace. | 7 | Pass. |
| Nothing is saved to your real data. | 7 | Pass. |
| Free. | 1 | Pass; `free-mit` claim. |
| Packaged for Chromium browsers. | 4 | Pass; `chromium-package` claim. |
| Stores traces only in your browser. | 6 | Pass; `local-no-upload` claim. |

Primary action: “Try it with sample data.” Secondary action: “Download extension ZIP.”

## Remaining landing sentences

| Copy | Words | Result |
| --- | ---: | --- |
| This trace pairs each keyboard action with its next focus target. | 11 | Pass; `chronological-order` claim. |
| Events stay in the order they happened. | 7 | Pass; `chronological-order` claim. |
| Three keyboard actions show when focus moves behind the dialog. | 10 | Pass; `seeded-focus-defect` claim. |
| Recording starts when you select Start. | 6 | Pass; `explicit-recording` claim. |
| The toolbar badge and recorder bar show when capture is active. | 11 | Pass; `explicit-recording` claim. |
| Printable keys become “Character.” | 4 | Pass; `key-privacy` claim. |
| Sensitive field values do not enter the trace. | 8 | Pass; `sensitive-mask` claim. |
| Screenshots start off. | 3 | Pass; `screenshot-boundary` claim. |
| When enabled, capture uses the visible tested tab. | 8 | Pass; `screenshot-boundary` claim. |
| The exported file includes timing, focus, role, name, state, and scope notes. | 12 | Pass; `trace-export-content` claim. |
| The extension stores traces in browser extension storage. | 8 | Pass; `local-no-upload` claim. |
| The extension has no account, analytics, tracker, or upload service. | 10 | Pass; `local-no-upload` claim. |
| Exported trace files open without a network connection. | 8 | Pass; `offline-export` claim. |
| Nearby control snapshots are selected DOM details, not an operating-system accessibility tree. | 11 | Pass; `snapshot-scope` claim. |
| Download and unzip the extension. | 5 | Pass. |
| Open your browser’s Extensions page and enable Developer mode. | 9 | Pass. |
| Choose “Load unpacked,” select the extracted folder, then pin the moss-path icon. | 11 | Pass. |
| Use one local extension to capture an accessibility failure for a bug report. | 12 | Pass. |
| Record keyboard actions and focus changes for an accessibility bug report. | 10 | Pass. |
| The hero artwork is original generated imagery. | 7 | Pass; `provenance` claim. |
| Interface marks and diagrams are hand-authored for this product. | 9 | Pass; `provenance` claim. |

Fragments, headings, navigation labels, and button labels were checked separately. No flagged term remains.

## Terminology

| Concept | Required term |
| --- | --- |
| Active capture | recording |
| Saved event set | trace |
| Exported HTML | trace file |
| Selected DOM context | nearby control snapshot |
| Browser target | Chromium browser |
| Trial state | demo |

The same terms are used on the landing page, demo, extension popup, README, privacy page, terms page, and exported trace file.
