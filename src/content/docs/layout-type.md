---
title: Layout Type
description: Five algorithms for arranging children — None, Row, Column, Grid, Absolute, Custom.
sidebar:
  order: 20
---

Picks the algorithm used to arrange children. Inspector: **CHILD LAYOUT → Layout Type** (the segmented button row at the top of the group).

| Value | Behaviour | Full reference |
|---|---|---|
| **None** | This element doesn't arrange children. Children manage their own positioning (anchors/offsets like vanilla Unity UI). | — |
| **Row** | Horizontal auto-layout — children flow left to right. | [Row & Column](/row-column/) |
| **Column** | Vertical auto-layout — children flow top to bottom. | [Row & Column](/row-column/) |
| **Grid** | CSS-grid-style 2D layout — explicit tracks, spans, auto-fit. | [Grid](/grid/) |
| **Absolute** | Children use absolute positioning relative to this container's content rect. Different from `None`: this container is itself sized normally; only the *children* are absolute. | [Absolute](/absolute/) |
| **Custom** | Pick a registered custom layout algorithm — radial, hex, anything you implement. | [Custom Layouts](/custom-layouts/) |

The inspector shows different sub-sections depending on which Layout Type is active — Row/Column controls for Row and Column, Grid controls for Grid, a custom-settings drawer for Custom.

## Related

- [Row & Column](/row-column/) — main/cross axis, alignment, wrap, distribution
- [Grid](/grid/) — tracks, spans, auto-fit, dense flow
- [Absolute](/absolute/) — Placement modes and per-edge anchor offsets
- [Custom Layouts](/custom-layouts/) — write your own algorithm
- [Padding](/padding/) · [Overflow](/overflow/) — independent of Layout Type
