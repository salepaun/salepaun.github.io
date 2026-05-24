---
title: "Absolute Positioning & Placement"
description: Placement modes, anchor constraints, badges, modals, sticky footers.
sidebar:
  order: 13
---

For everything that **doesn't** flow with Row/Column/Grid: badges, overlays, popovers, backgrounds, and per-side anchored panels. AutoLayout handles these via two related concepts:

- **Placement** — how this element relates to its parent's layout flow. Inspector: **SIZE & POSITION → Placement**.
- **Absolute axis constraints** — for `Placement.Absolute`, where exactly it sits. Inspector: **SIZE & POSITION → Absolute Position**.

## Placement modes

Set via `.Absolute()`, `.Cover()`, `.Ignored()`, or `.Layout(LayoutType.X)` on the parent.

| Mode | Behaviour | Use it for |
|---|---|---|
| **Normal** (default) | Participates in parent's Row/Column/Grid flow | Most children |
| **Absolute** | Sized normally, positioned relative to parent's content rect via Top/Bottom/Left/Right | Badges, popovers, anchored UI |
| **CoverParent** | Stretches to match parent's full bounds (ignores parent's padding) | Backgrounds, overlays, modal scrims |
| **Ignored** | Sized by AutoLayout, positioned externally | ListView/GridView pooled items (don't use directly) |

The container's `LayoutType` is separate — see [Layout Type](/layout-type/).

## Absolute children — the four constraints

When a child has `Placement.Absolute`, you anchor it to one or two edges per axis.

### Single-edge anchor

```csharp
AutoUI.Create()
    .Row().WidthFill().HeightFill()                 // parent
    .Children(
        AutoUI.Create()
            .Width(200).Height(60)                   // sized normally
            .Absolute()                              // placement = Absolute
            .Top(UIPosition.Pixels(20))              // 20px from top
            .Right(UIPosition.Pixels(20))            // 20px from right
            .Background(Color.red)                   // a 200x60 floating panel pinned to top-right
    )
    .Build();
```

Each `Top`/`Bottom`/`Left`/`Right` takes a `UIPosition`:

```csharp
UIPosition.Pixels(20)         // 20px offset
UIPosition.Percentage(10)     // 10% of parent's axis
UIPosition.None()             // no constraint on this side (use opposite anchor)
```

### Stretch (two-edge anchor)

To stretch an absolute element across an axis, anchor both edges via `LeftRight` or `TopBottom`:

```csharp
AutoUI.Create()
    .HeightHug()                                    // height from content
    .Absolute()
    .LeftRight(UIPosition.Pixels(16), UIPosition.Pixels(16))   // 16px in from both sides
    .Top(UIPosition.Pixels(0))                                  // pinned to top
    .Background(Color.gray)
    .Build();
```

`LeftRight` and `TopBottom` set the anchor to `Stretch` so the element grows to fill the space between the two offsets — its `Width`/`Height` is ignored on that axis.

### Combinations

| Want | Constraint setup |
|---|---|
| Pinned to top-left corner | `.Top(...)` + `.Left(...)` (Width/Height from sizing) |
| Pinned to bottom-right | `.Bottom(...)` + `.Right(...)` |
| Stretched horizontally, pinned to top | `.LeftRight(a, b)` + `.Top(...)` |
| Stretched both axes (= Cover with margin) | `.LeftRight(a, b)` + `.TopBottom(c, d)` |
| Centered horizontally | `.Width(X)` + don't set `.Left`/`.Right` (positions at center by default), or compute via percentages |

## CoverParent — the simplest overlay

When you just want "fill my parent completely," use `.Cover()`:

```csharp
AutoUI.Create()
    .Column().WidthFill().HeightFill()
    .Padding(40)
    .Children(
        // Backdrop — covers full parent INCLUDING the padding region
        AutoUI.Create()
            .Cover()
            .Background(new Color(0, 0, 0, 0.6f)),

        // Card — sits inside the padded area
        AutoUI.Create()
            .WidthFill().HeightFill()
            .Background(Color.white)
    )
    .Build();
```

`Cover()` ignores the parent's padding. Useful for full-bleed backgrounds and modal scrims that should darken the entire parent including its padded region.

## Ignored placement

`.Ignored()` tells AutoLayout: "size this element, but I'll position it myself externally." This is what `ListView` and `GridView` use for pooled items — they reuse the same item GameObjects across many positions, AutoLayout sizes them, and the View moves them around manually.

Don't use this directly unless you're writing a virtualised list/grid.

## Order and Visibility

Two related properties for "this child exists but I want to control its visibility/order":

```csharp
AutoUI.Create()
    .Order(-1)                                  // render before its hierarchy siblings
    .Visibility(Visibility.Hidden)              // invisible but still occupies space
    .Build();
```

| Property | Values | Behaviour |
|---|---|---|
| `Order(int)` | any int (default 0) | Override visual order. Lower = earlier. |
| `Visibility(...)` / `Hidden()` / `Collapsed()` | Visible / Hidden / Collapsed | Visible: normal. Hidden: invisible but takes layout space. Collapsed: removed from layout entirely. |

`Hidden` is useful for tabs/panels you want to keep mounted but not draw. `Collapsed` is for fully removing an element without re-layout cost on the next show.

## Common patterns

### Badge in the corner of a card

```csharp
AutoUI.Create()
    .Column().WidthHug().HeightHug()
    .Padding(12)
    .Background(Color.gray)
    .Children(
        AutoUI.Create().Text("Card Body"),

        // Badge — pinned to top-right of card, ignores Row/Column flow
        AutoUI.Create()
            .Width(20).Height(20)
            .Absolute()
            .Top(UIPosition.Pixels(-8))         // negative offset = sticks out
            .Right(UIPosition.Pixels(-8))
            .Background(Color.red)
    )
    .Build();
```

### Modal scrim with centered card

```csharp
AutoUI.Create().WidthFill().HeightFill()
    .Children(
        // Full-bleed dark backdrop
        AutoUI.Create().Cover().Background(new Color(0, 0, 0, 0.7f)),

        // Centered card
        AutoUI.Create()
            .WidthFill().HeightFill()
            .Center()
            .Children(
                AutoUI.Create().Size(400, 300).Background(Color.white)
                    .Children(...)
            )
    )
    .Build();
```

### Overlapping sticky footer

```csharp
AutoUI.Create().WidthFill().HeightFill()
    .Children(
        AutoUI.Create().WidthFill().HeightFill().ScrollViewVertical().Children(...),
        AutoUI.Create()
            .HeightHug()
            .Absolute()
            .LeftRight(UIPosition.Pixels(0), UIPosition.Pixels(0))
            .Bottom(UIPosition.Pixels(0))
            .Background(Color.gray)
            .Children(...)
    )
    .Build();
```

## Related

- [Layout Type](/layout-type/) — `LayoutType.Absolute` on the container makes *every* child default to absolute
- [Sizing](/sizing/) — how Width/Height interact with absolute constraints
- [AutoUI](/auto-ui/) — builder reference
