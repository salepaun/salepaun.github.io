---
title: Overflow
description: How a container clips children that exceed its bounds — Visible, Hidden, Scroll.
sidebar:
  order: 26
---

Controls clipping behaviour for children that exceed this element's bounds. Inspector: **CHILD LAYOUT → Overflow**.

| Value | Effect |
|---|---|
| `Visible` (default) | Children that overflow draw outside the bounds. |
| `Hidden` | Adds a `RectMask2D` so children clip at the element's bounds. |
| `Scroll` | Clips at the bounds **and** wires this element as a `ScrollRect` viewport (content auto-sized). |

## Visible

The default. Children that exceed the parent's size keep drawing — they just spill out visually. Useful for badges, popovers, and shadow effects that need to extend past their container.

## Hidden

Adds a `RectMask2D` to the GameObject. Anything outside the parent's bounds is clipped. No scroll interaction.

```csharp
AutoUI.Create()
    .Column().Width(200).Height(120)
    .Overflow(UIOverflow.Hidden)
    .Children(
        AutoUI.Create().Width(400).Height(60)    // overflows horizontally — gets clipped
    )
    .Build();
```

## Scroll

Wires a `ScrollRect` automatically. The element becomes a viewport, content gets a child viewport rect, and pointer drag scrolls. Adequate for one-off scrolling rects.

For richer scrolling — virtualised content, snap-to-page, inertia, elastic bounds, paginated navigation — use the dedicated components:

- [ScrollView](/scroll-view/) — feature-rich scroll container with optional snap/inertia/elastic.
- [ListView](/list-view/) — virtualised scrolling list for large datasets.
- [GridView](/grid-view/) — virtualised scrolling grid.
- [Carousel](/carousel/) — paged horizontal scroller.

## Related

- [ScrollView](/scroll-view/) · [ListView](/list-view/) · [GridView](/grid-view/) · [Carousel](/carousel/) — when `Overflow.Scroll` isn't enough
