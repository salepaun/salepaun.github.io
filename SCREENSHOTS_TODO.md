# Documentation Screenshot / GIF Checklist

Minimum viable set of visuals — the ones where prose genuinely fails. ~23 captures total.

**Target directory:** `public/images/docs/` (create on first commit).
**Convention:** `<page>-<topic>.{png,gif}` · [GIF] = motion required · [PNG] = static is enough.

**Priority — ranked by reader understanding, not by existing promises in the docs:**
- **P0** — without this, the doc fails at its job. The concept literally can't be conveyed in prose.
- **P1** — high impact. The visual is what makes the concept "click."
- **P2** — orientation and walkthroughs. Page works without it; visual speeds comprehension.
- **P3** — component polish. Pages survive without them.

Any existing "GIF coming soon" callouts in the docs can be rewritten if we de-prioritize the corresponding asset — don't let past promises drive the priority.

---

## P0 — Concept-critical

Without these, readers will close the doc still confused. The sizing model is AutoLayout's core abstraction and prose can't carry it.

- [ ] **[P0]** `sizing-fill-weights.gif` [GIF] — Row with three Fill children at 1f/2f/1f; parent resizes; children re-share space proportionally — `sizing.md`
- [ ] **[P0]** `sizing-hug.gif` [GIF] — Text inside Hug container; text length changes; container grows/shrinks to fit — `sizing.md`
- [ ] **[P0]** `sizing-percentage.gif` [GIF] — Child at 50% parent; parent resizes; child scales with it — `sizing.md`
- [ ] **[P0]** `sizing-aspect.gif` [GIF] — AspectRatio=16:9 card; height changes manually; width tracks — `sizing.md`
- [ ] **[P0]** `grid-autofit-responsive.gif` [GIF] — `repeat(auto-fit, minmax(200, 1f))`; container resizes; column count drops 5→4→3→2→1 — `grid.md`
- [ ] **[P0]** `row-wrap-reflow.gif` [GIF] — Row with Wrap=true; container narrows; chips reflow to new lines — `row-column.md`
- [ ] **[P0]** `transitions-gap-with-without.gif` [GIF] — Gap changes 8→32; left half snaps, right half eases — `transitions.md`

## P1 — Makes it click

High-leverage demonstrations and the first-impression visual.

- [ ] **[P1]** `landing-hero.png` or `.gif` [PNG/GIF] — Figma↔Unity side-by-side, or 5s clip of a layout responding to window resize — `index.mdx`
- [ ] **[P1]** `getting-started-first-layout.gif` [GIF] — Row + children with WidthHug/HeightHug; toggle Fill on one child, watch it claim leftover space — the "aha" moment — `getting-started.mdx`
- [ ] **[P1]** `inspector-live-update.gif` [GIF] — Type `100+50px` and `fill` into Width field; math evaluates, mode flips, value retained — `inspector-input.md`
- [ ] **[P1]** `row-distribution-modes.gif` [GIF] — Same Row cycling Packed → SpaceBetween → SpaceAround → SpaceEvenly — `row-column.md` + reused in `alignment.md`
- [ ] **[P1]** `tutorial-game-hud-full.gif` [GIF] — Full HUD assembled (vitals/score/minimap/hotbar); proves AutoLayout handles non-trivial layouts — `tutorials/game-hud.mdx`

## P2 — Orientation and walkthroughs

Static reference shots + tutorial recordings. Useful but not blocking comprehension.

- [ ] **[P2]** `overview-inspector-annotated.png` [PNG] — Full AutoLayout Inspector with call-outs labeling each section — `overview.md`
- [ ] **[P2]** `alignment-matrix.png` [PNG] — 3×3 matrix of MainAlign × CrossAlign combinations in one image — `alignment.md`
- [ ] **[P2]** `absolute-placement-modes.png` [PNG] — 2×2: Normal / Absolute / CoverParent / Ignored, same child in each — `absolute.md`
- [ ] **[P2]** `getting-started-context-menu.gif` [GIF] — Right-click in Hierarchy → AutoLayout PRO → Row; child appears pre-configured — `getting-started.mdx`
- [ ] **[P2]** `tutorial-toolbar-walkthrough.gif` [GIF] — Empty Row → brand Text → WidthFill spacer → two buttons → resize — `tutorials/toolbar.mdx`
- [ ] **[P2]** `tutorial-settings-walkthrough.gif` [GIF] — Header + scrollable body + sticky footer; scroll to show pin behavior — `tutorials/settings-menu.mdx`

## P3 — Component heroes

One hero GIF per component doc. Skip if time-constrained — the pages read fine without them.

- [ ] **[P3]** `scroll-view-inertia-bounce.gif` [GIF] — Flick → inertia → drag past edge → elastic bounce — `scroll-view.md`
- [ ] **[P3]** `list-view-recycle.gif` [GIF] — Long list scrolling; visible item count stays constant; GOs reused — `list-view.md`
- [ ] **[P3]** `grid-view-autocolumns.gif` [GIF] — Container resizes; grid column count adapts in real time — `grid-view.md`
- [ ] **[P3]** `carousel-modes.gif` [GIF] — Same carousel cycling Slide → Loop → Fade — `carousel.md`
- [ ] **[P3]** `dropdown-open-direction.gif` [GIF] — Dropdown near top opens downward; near bottom opens upward — `dropdown.md`
- [ ] **[P3]** `progress-bar-modes.gif` [GIF] — Linear LTR + radial bars filling 0→100% — `progress-bar.md`
- [ ] **[P3]** `tweening-width-tween.gif` [GIF] — Width 200→400 with OutQuad easing — `tweening.md`

---

**Total: 24 captures** · P0=7 · P1=5 · P2=6 · P3=7

Dropped from the previous list: `getting-started-add-component.gif` (trivial Inspector shot, replaceable with text). All Unity recordings — no illustration work. ScreenToGif or QuickTime + Gifski, drop into `public/images/docs/`.
