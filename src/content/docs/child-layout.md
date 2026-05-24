---
title: "Child Layout"
description: Overview of the CHILD LAYOUT inspector group — properties that arrange and constrain the children of an element.
sidebar:
  order: 19
  label: Overview
---

The properties in the **CHILD LAYOUT** inspector group control how *children* of this element are arranged. Each property has its own reference page; this is just the index.

## Layout types

The **Layout Type** selector picks the algorithm:

| Type | Behaviour | Page |
|---|---|---|
| **None** | No arrangement — children manage their own positioning. | — |
| **Row** | Horizontal flow with main/cross alignment, gap, wrap. | [Row & Column](/row-column/) |
| **Column** | Vertical flow, same controls as Row. | [Row & Column](/row-column/) |
| **Grid** | CSS-grid-style 2D — tracks, spans, auto-fit, dense flow. | [Grid](/grid/) |
| **Absolute** | Children all use absolute positioning by default. | [Absolute](/absolute/) |
| **Custom** | Plug in your own algorithm (Ring, radial, hex, …). | [Custom Layouts](/custom-layouts/) |

See [Layout Type](/layout-type/) for the picker reference.

## Spacing & clipping (any layout type)

| Property | What it does | Page |
|---|---|---|
| **Padding** | Inset between this element's bounds and its children's content area | [Padding](/padding/) |
| **Overflow** | Visible / Hidden / Scroll — clip behaviour for children outside the bounds | [Overflow](/overflow/) |

For everything that controls how *this* element is sized and placed, see [Size & Position](/size-position/).
