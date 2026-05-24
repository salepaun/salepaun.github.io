---
title: "Row & Column"
description: Row, Column, and Wrap auto-layout containers — alignment, distribution, gap, RTL, per-child overrides.
sidebar:
  order: 21
---

`Row` and `Column` are directional auto-layout containers. A Row arranges children left-to-right; a Column arranges them top-to-bottom. They're the most common layouts you'll use. Inspector: **CHILD LAYOUT → Row/Column controls** (appears when Layout Type is Row or Column).

## The mental model

Each container has a **main axis** and a **cross axis**:

| Container | Main axis | Cross axis |
|---|---|---|
| Row | Horizontal | Vertical |
| Column | Vertical | Horizontal |

Children flow along the main axis with `Gap` between them, then position on the cross axis according to `CrossAlign`. Extra main-axis space is distributed by `MainDistribute`.

## Basic Row

```csharp
AutoUI.Create()
    .Row()
    .WidthFill().HeightHug()
    .Gap(8).Padding(12)
    .Children(
        AutoUI.Create().Text("Left"),
        AutoUI.Create().WidthFill(),         // spacer pushes everything after it right
        AutoUI.Create().Text("Right")
    )
    .Build();
```

A `WidthFill()` element with no other content is the canonical "spacer." Insert it between siblings to push them apart.

## Basic Column

```csharp
AutoUI.Create()
    .Column()
    .WidthFill().HeightFill()
    .Gap(12).Padding(16)
    .Children(
        AutoUI.Create().Row().HeightHug().Children(...),     // header row
        AutoUI.Create().WidthFill().HeightFill(),            // body fills remaining space
        AutoUI.Create().Row().HeightHug().Children(...)      // footer row
    )
    .Build();
```

Three vertically stacked sections — header (Hug height), body (Fill), footer (Hug). The body absorbs all extra vertical space.

## Alignment

`MainAlign` and `CrossAlign` set how the *whole content block* sits within the container.

| Property | Values | Effect |
|---|---|---|
| `MainAlign` | `Start` · `Center` · `End` | Position of the children block along the main axis |
| `CrossAlign` | `Start` · `Center` · `End` · `Stretch` | Position along the cross axis; `Stretch` grows children to fill the cross axis |

```csharp
AutoUI.Create()
    .Row().WidthFill().Height(60)
    .MainAlign(Alignment.Center)         // children clustered horizontally in the middle
    .CrossAlign(Alignment.Center)        // children vertically centered
    .Build();
```

`Center()` is shorthand for `.MainAlign(Center).CrossAlign(Center)`.

## Main-axis distribution

When children don't fill the main axis, `MainDistribute` decides how the leftover space is spread *between* children.

| Value | Effect | Picture |
|---|---|---|
| `Packed` (default) | Children clustered, gap = `Gap` literal | `[A][B][C]_____` |
| `SpaceBetween` | Equal gaps between children, none at edges | `[A]___[B]___[C]` |
| `SpaceAround` | Equal gaps including half-gaps at edges | `_[A]__[B]__[C]_` |
| `SpaceEvenly` | Equal gaps including full-gaps at edges | `__[A]__[B]__[C]__` |

```csharp
AutoUI.Create().Row().WidthFill()
    .MainDistribute(Distribution.SpaceBetween)
    .Children(
        AutoUI.Create().Text("A"),
        AutoUI.Create().Text("B"),
        AutoUI.Create().Text("C")
    )
    .Build();
```

When `MainDistribute` is anything other than `Packed`, `MainAlign` is effectively ignored — distribution decides where children sit.

## Wrap

Set `.Wrap()` on a Row or Column to let children flow onto new lines when they overflow the main axis.

```csharp
AutoUI.Create().Row().WidthFill().HeightHug()
    .Wrap()
    .Gap(8).WrapGap(8)               // WrapGap sets cross-axis gap between wrap lines
    .Children(
        AutoUI.Create().Width(120).Height(80),
        AutoUI.Create().Width(120).Height(80),
        AutoUI.Create().Width(120).Height(80),
        AutoUI.Create().Width(120).Height(80)
    )
    .Build();
```

A wrapped Column flows children top-to-bottom, then wraps into new columns. (Less common but supported.)

## Reverse children

Flip the visual order of children without changing alignment semantics. Row + ReverseChildren = right-to-left iteration; `Alignment.Start` still means "the start of the main axis" (the left edge).

```csharp
AutoUI.Create().Row().ReverseChildren()
    .Children(a, b, c)              // renders as c, b, a
    .Build();
```

Orthogonal to [Direction](#direction) — the two can be combined.

## Direction

`Direction(LayoutDirection.RightToLeft)` (or shorthand `.RTL()`) flips Row/Wrap visually right-to-left, AND remaps `Alignment.Start` to the right edge. This is the correct way to support Arabic/Hebrew layouts. Inherits down the tree.

```csharp
AutoUI.Create().Row().RTL()
    .Children(...)
    .Build();
```

Values: `Inherit` (default — uses parent's direction) · `LeftToRight` · `RightToLeft`. Has no effect on Column.

## Gap

The space between adjacent children. Has no effect on Grid — use [Grid → Column Gap and Row Gap](/grid/#column-gap-and-row-gap) instead.

```csharp
AutoUI.Create()
    .Row().WidthFill().HeightHug()
    .Gap(8)
    .Children(
        AutoUI.Create().Width(100).Height(40),
        AutoUI.Create().Width(100).Height(40),    // 8px to the left of this
        AutoUI.Create().Width(100).Height(40)
    )
    .Build();
```

Percentage variant: `.GapPercent(2)` is "2% of parent's main-axis size."

The Gap inspector field accepts unit suffixes, math, and `auto`/`even` distribution shorthands — type `auto` for `SpaceBetween`, `even` for `SpaceAround`. See [Inspector Input](/inspector-input/).

## Wrap Gap

The cross-axis spacing between wrap lines. Only appears in the inspector when [Wrap](#wrap) is enabled.

```csharp
AutoUI.Create().Row().WidthFill().HeightHug()
    .Wrap().Gap(8).WrapGap(12)               // 8px between cards on a line, 12px between lines
    .Children(...)
    .Build();
```

`WrapGap(-1)` (the default) means "use the same value as Gap."

## Linear item

Cross-axis alignment for a single child can override the parent's `CrossAlign`. Inspector: **SIZE & POSITION → Linear Item → Cross Align Override** (appears on the *child*, not the Row/Column container).

```csharp
AutoUI.Create()
    .Row().HeightHug().CrossAlign(Alignment.Start)
    .Children(
        AutoUI.Create().Text("Top-aligned"),
        AutoUI.Create().Text("Override").CrossAxisSelfAlign(CrossAxisItemAlign.End),
        AutoUI.Create().Text("Top-aligned again")
    )
    .Build();
```

`CrossAxisSelfAlign` takes a `CrossAxisItemAlign`:

| Value | Effect |
|---|---|
| `Inherit` (default) | Use the parent's `CrossAlign` |
| `Start` | Pin to the cross-axis start (top in Row, left in Column) |
| `Center` | Center on the cross axis |
| `End` | Pin to the cross-axis end |

There is intentionally no `Stretch` value — to stretch a single child across the parent's cross axis, set its cross-axis size to `Fill` or `Percentage` instead.

## Common patterns

### Toolbar (left + right)

```csharp
AutoUI.Create().Row().WidthFill().HeightHug().Padding(8).Gap(4)
    .Children(
        AutoUI.Create().Text("Brand"),
        AutoUI.Create().WidthFill(),                // spacer
        AutoUI.Create().Button("Login", OnLogin),
        AutoUI.Create().Button("Sign up", OnSignup)
    )
    .Build();
```

### Page shell (header / body / footer)

```csharp
AutoUI.Create().Column().WidthFill().HeightFill()
    .Children(
        AutoUI.Create().Row().HeightHug().Padding(12).Background(Color.gray)
            .Children(AutoUI.Create().Text("Header")),
        AutoUI.Create().WidthFill().HeightFill().Padding(16)
            .Children(AutoUI.Create().Text("Body")),
        AutoUI.Create().Row().HeightHug().Padding(12).Background(Color.gray)
            .Children(AutoUI.Create().Text("Footer"))
    )
    .Build();
```

### Card grid (wrapped row of cards)

```csharp
AutoUI.Create().Row().WidthFill().HeightHug()
    .Wrap().Gap(12).WrapGap(12)
    .Each(items, item =>
        AutoUI.Create().Width(200).HeightHug()
            .Background(Color.gray).Padding(12)
            .Children(AutoUI.Create().Text(item.Title)))
    .Build();
```

For dense, performant grids of many items, prefer the [GridView](/grid-view/) virtualised component.

## Related

- [Sizing](/sizing/) — Fill/Hug behaviour in Row & Column
- [Padding](/padding/) · [Margin](/margin/) — spacing knobs
- [Grid](/grid/) — for true 2D grids instead of wrapping rows
- [AutoUI](/auto-ui/) — builder reference
