---
title: "Size & Position"
description: Overview of the SIZE & POSITION inspector group — properties that size and place a single element.
sidebar:
  order: 10
  label: Overview
---

The properties in the **SIZE & POSITION** inspector group control how *this* element is sized and where it sits in its parent. Each property has its own reference page; this is just the index.

| Property | What it does | Page |
|---|---|---|
| **Placement** | How this element relates to its parent's layout flow (Normal / Absolute / Cover / Ignored) | [Absolute](/absolute/) |
| **Width / Height** | Pick a sizing mode per axis — Pixels, Hug, Fill, Percentage, AspectRatio, TextSize | [Sizing](/sizing/) |
| **Min / Max Constraints** | Clamp the resolved size on either axis | [Sizing → Min and Max](/sizing/#min-and-max) |
| **Absolute Position** | For `Placement.Absolute`: Top / Bottom / Left / Right edge offsets | [Absolute](/absolute/) |
| **Margin** | Outset between this element and its siblings | [Margin](/margin/) |
| **Render Offset** | Visual-only translation applied after layout — for shake/hover animations | [Render Offset](/render-offset/) |
| **Grid Item** | When parent is Grid: explicit Column/Row, spans, per-item alignment | [Grid → Grid item](/grid/#grid-item) |
| **Linear Item** | When parent is Row/Column: per-child cross-axis alignment override | [Row & Column → Linear item](/row-column/#linear-item) |

For everything that controls how *children* are arranged, see [Child Layout](/child-layout/).
