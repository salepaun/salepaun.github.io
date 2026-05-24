---
title: Margin
description: Outset between an element and its siblings — when to use it instead of Padding or Gap.
sidebar:
  order: 14
---

Margin is an **outset** between this element and its siblings. It pushes siblings apart without changing the parent's `Gap`. Inspector: **SIZE & POSITION → Margin**.

```csharp
.Margin(8)                                  // all four sides
.Margin(8, 4)                               // horizontal (L+R), vertical (T+B)
.Margin(8, 8, 0, 0)                         // left, right, top, bottom
.Margin(new Spacing(left, right, top, bottom))
```

## When to use Margin

- Only one or two children need extra spacing — push the second child away from the first without affecting the rest.
- A child needs to bleed past its container (negative margin).
- You want a "stuck to one edge" feel that Gap doesn't give you.

For *every* child to be evenly spaced, use the parent's [Gap](/row-column/#gap). For space *inside* this element, use [Padding](/padding/).

## Padding vs Margin vs Gap

- **Padding** — space *inside* this element, between its bounds and its children. Lives on the parent.
- **Margin** — space *outside* this specific child. Lives on the child.
- **Gap** — even spacing between *all* children of a Row/Column. Lives on the parent.

## Inspector

The Margin inspector field accepts the same unit/math syntax as Padding and Gap — type `16px`, `5%`, `8+4`, etc. See [Inspector Input](/inspector-input/).

## Related

- [Padding](/padding/) — the inside counterpart
- [Row & Column → Gap](/row-column/#gap) — even spacing between siblings
- [Render Offset](/render-offset/) — visual-only nudge that *doesn't* affect siblings (vs Margin, which does)
- [Inspector Input](/inspector-input/) — unit and math syntax
