# A11y Interaction Trace — visual system

## Thesis: brutalist concrete and moss

The product turns a fleeting interaction into durable evidence. Its visual world pairs poured-concrete utility with a living moss-green trace: concrete represents an unambiguous record; moss represents the focus path growing across it. It should feel like a field instrument used at a workbench, not a dashboard template or an automated audit report.

## Palette

The light treatment is explicit and primary. The extension popup uses the same tokens in a tighter, darker concrete instrument panel.

| Token | Value | Use |
| --- | --- | --- |
| Chalk | `#F2F0E8` | page background |
| Paper | `#FBFAF4` | raised working surface |
| Concrete | `#D7D4C8` | boundaries and quiet regions |
| Rebar | `#222520` | primary text |
| Weathered | `#5A5F55` | muted text (7:1 on chalk) |
| Moss | `#3E631D` | action and focus path |
| Acid moss | `#CBEF45` | recorder signal on dark concrete |
| Dark slab | `#1B1E1A` | extension instrument background |
| Rust | `#A84224` | errors and destructive actions |
| Amber | `#B96B08` | warnings |
| Field green | `#28613B` | confirmed/success state |

Color never carries state alone: recording, warning, and success always include a word and/or symbol. Focus is a two-part ring: 3 px acid moss with a dark offset shadow, exceeding 3:1 in both treatments.

## Type

- Display: `Arial Narrow`, `Roboto Condensed`, `Franklin Gothic Condensed`, system sans-serif. Tall, compressed headings evoke stamped site labels without adding a font payload.
- Working text: `Inter`, `Aptos`, `Segoe UI`, system sans-serif. Clear at 16 px and familiar inside a browser utility.
- Evidence: `ui-monospace`, `SFMono-Regular`, `Consolas`, monospace. Used only for timing, keys, roles, and selectors with tabular numerals.

Scale: 56/48 hero, 36/40 section, 24/30 subsection, 18/28 lead, 16/25 body, 13/18 evidence label. The landing page keeps reading measures below 72 characters.

## Spacing and shape

An 8 px base rhythm with 4 px for tight evidence metadata. Main gaps: 8, 16, 24, 32, 48, 72, 96. Corners are deliberately small (0, 2, or 4 px), with hard 2 px outlines and offset shadows rather than soft cards. Independent trace steps are separated by a vertical moss line; grouping is mostly by proximity.

Touch targets are at least 44 × 44 px. Desktop content caps at 1180 px. At 390 px, comparison layouts stack, secondary decoration disappears, and actions become full-width while the trace itself retains horizontal clarity.

## Interaction grammar

- Primary action: dark slab with acid-moss face or moss fill, direct verb label.
- Recording: persistent `REC` badge in the toolbar plus an in-page dock with elapsed time and Stop. This cannot be mistaken for a background process.
- Trace: a numbered, chronological seam. Keyboard action is the large label; focus and semantics are its evidence.
- Screenshots: opt-in, visibly labeled, and paired with a privacy note before recording.
- Destructive clear: named confirmation; stopping is always reversible until a separate clear.
- Errors state what failed and the next action. Empty state begins with a three-keystroke recipe.

## Motion

UI transitions last 160–220 ms and only animate opacity or transform. Trace rows enter 8 px from their chronological origin and the recorder dot pulses once when capture starts; nothing loops. With `prefers-reduced-motion: reduce`, all movement and smooth scrolling are removed and state changes are instantaneous. Depth still comes from outlines, stacking, and offset shadows.

## Original asset plan and prompt sheet

One generated hero illustration provides the product world; authored SVG marks and CSS trace diagrams handle precise interface explanation. The hero is decorative editorial evidence, not a fabricated screenshot.

**Prompt sheet**

- Use case: stylized-concept
- Asset type: wide landing-page hero illustration
- Subject: an abstract keyboard interaction path crossing a monolithic concrete testing slab, with precise inset rectangles suggesting focus targets and a single vivid moss-green route connecting them
- World/materials: board-formed concrete, oxidized rebar marks, compressed moss, graphite registration ticks, tactile paper grain
- Light/lens: soft overcast side light, orthographic three-quarter view, crisp depth, editorial product still life
- Palette words: chalk, warm concrete, charcoal rebar, deep forest moss, restrained acid-lime highlights
- Composition: wide 3:2, main slab centered-right, calm negative space, no real interface text
- Negative list: no people, hands, faces, logos, brands, readable text, letters, watermarks, gradients, glassmorphism, neon cyberpunk, generic laptop mockup, fake browser UI

### Provenance

- `assets/src/trace-slab.png` and derived site formats: generated for this product on 2026-08-27 with the Param Factory Azure image deployment via `/opt/fleet/lib/gen-image.sh`, using the prompt above. Original generated work; no third-party asset or brand input.
- `public/trace-mark.svg`: hand-authored for this product from geometric primitives; MIT with the repository.

The footer discloses generated imagery. No remote fonts, scripts, imagery, or icon sets are loaded.
