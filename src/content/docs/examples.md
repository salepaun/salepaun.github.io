---
title: Examples
description: Every demo scene that ships inside AutoLayout PRO, grouped by tier. Open one and press Play to inspect the layout live.
---

These scenes ship inside the package at **`Assets/AutoLayoutPRO/Demos/Scenes/`**. They are baked from C# builder scripts so every layout is read-the-source-friendly — open the matching tutorial below each scene for the line-by-line walkthrough.

The Welcome window (`Window → AutoLayout PRO → Welcome`) groups these by tier and lets you open each scene in one click.

## Tier 1 — Layout Primitives

Single-feature scenes. Open one to see exactly what `Hug`, `Fill`, `WrapRow`, or a grid span does on its own.

| Scene | Shows | Tutorial |
|---|---|---|
| `SizingHug.unity` | Hug shrinks to wrap content; Pixels stays fixed | — |
| `SizingFill.unity` | Fill consumes remaining space along the main axis | [Toolbar](/tutorials/toolbar/) |
| `SizingPercentage.unity` | 30 / 70 split via `WidthPercent` | — |
| `SizingAspect.unity` | Cards locked to 16:9 / 1:1 / 4:5 | — |
| `RowColumnAlignment.unity` | Every Main × Cross axis combination side-by-side | — |
| `PaddingGap.unity` | Two sliders drive container padding and gap in real time | — |
| `WrapRow.unity` | Chips reflow as the row narrows | — |
| `GridAutoFit.unity` | Auto-fit columns adapt to container width | — |
| `GridSpans.unity` | Bento layout with custom column and row spans | — |
| `AbsoluteOverlay.unity` | Badges and toasts pinned via `Absolute` | — |
| `CustomLayout.unity` | Radial / fan arrangement via `ICustomLayoutAlgorithm` | — |

## Tier 2 — Component Spotlight

One scene per shipped component. Use them as a starting point for your own integrations.

| Scene | Shows | Tutorial |
|---|---|---|
| `GridViewInventory.unity` | 48-slot virtualized inventory | — |
| `CarouselGallery.unity` | Snapping image carousel with rewind | — |
| `DropdownAnchored.unity` | Dropdown with absolutely-anchored popup | — |
| `ProgressTweening.unity` | Linear + radial progress driven by a coroutine | [Game HUD](/tutorials/game-hud/) |
| `ScrollViewBasic.unity` | Plain vertical scroll, fifty stacked cards | — |

## Tier 3 — Complete Apps

The "wow" scenes. Each one combines several Tier 1 + Tier 2 ideas into a production-shaped layout.

| Scene | Shows | Tutorials |
|---|---|---|
| `SettingsMenu.unity` | Tabbed settings: Display, Audio, Controls with scroll, dropdown, modal confirm | [Settings Menu](/tutorials/settings-menu/) |
| `ChatApp.unity` | Virtualized chat with two bubble styles, variable-height messages, input bar, sidebar | — |

## Polished promo variants

The promo videos and the GIFs on each tutorial page render from **polished** variants of the same scenes — same layouts, but with rounded corners, blur, and procedural backgrounds courtesy of [FlexibleUI by JeffGrawAssets](https://assetstore.unity.com/). FlexibleUI is **not bundled** with AutoLayout PRO; the polished assets live outside the package and are used only to dress promotional material.

The basic scenes shipped inside `Assets/AutoLayoutPRO/Demos/Scenes/` use flat colors only — zero third-party dependencies.
