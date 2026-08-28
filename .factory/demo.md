# Demo sandbox

## Entry points

- Catalog and verifier URL: <https://a11y-interaction-trace.sociobot.in/?demo=1>
- Canonical route: <https://a11y-interaction-trace.sociobot.in/demo/>
- Local route: <http://127.0.0.1:4173/?demo=1>

The query entry redirects to the canonical demo. The first rendered demo screen already contains a completed sample trace.

## Sample data

The sample represents a checkout-settings dialog. Its four ordered events are recording start, Enter, Shift+Tab, and Escape.

Shift+Tab moves focus from “Project name” to “Background help” outside the dialog. Escape closes the dialog and returns focus to “Open quick edit.”

The trace includes page details, timings, focus roles and names, states, selectors, and nearby control snapshots. Screenshots are off.

## Isolation and reset

Demo state uses only the `demo:a11y-interaction-trace:` local-storage prefix. Demo code never reads, writes, or clears keys outside that prefix.

**Reset demo** deletes only prefixed keys and restores the complete original four-event seed. **Start for real** deletes only prefixed keys before opening installation instructions.

The claim test `@claim:demo-entry` clicks the landing action in a regular browser context and proves the populated sample opens without an extension install. `@claim:demo-reset` mutates replay state, resets the demo, and compares the complete stored seed byte-for-byte. `@claim:demo-isolation` seeds unrelated real-data sentinels, mutates and resets the demo, then proves both sentinels remain byte-identical.
