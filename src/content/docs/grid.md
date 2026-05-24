---
title: Grid
description: CSS-grid-style layouts — template tracks, repeat(), spans, dense packing, auto-fit, per-item placement.
sidebar:
  order: 22
---

Grid layout arranges children in 2D rows and columns, much like CSS Grid. Use it when content is naturally tabular or when you need a card grid with consistent cell sizes. Inspector: **CHILD LAYOUT → Grid controls** (appears when Layout Type is Grid).

> Note: this is the **layout engine's** Grid. For a virtualised, scrollable grid of many items (like a long photo gallery), use the [GridView](/grid-view/) component instead.

## Quick start

```csharp
AutoUI.Create().Grid().WidthFill().HeightHug()
    .GridColumns(3).Gap(8)
    .Children(
        AutoUI.Create().Height(80).Background(Color.red),
        AutoUI.Create().Height(80).Background(Color.green),
        AutoUI.Create().Height(80).Background(Color.blue),
        AutoUI.Create().Height(80).Background(Color.yellow)
    )
    .Build();
```

Three columns with 8px gap. Items flow left-to-right, top-to-bottom; the fourth item starts a new row.

## Dimensions

Track count fields. `0` (or `auto` in the inspector) means "as many as needed."

| Property | Builder | Notes |
|---|---|---|
| Columns | `.GridColumns(n)` | 0 = auto (one column) |
| Rows | `.GridRows(n)` | 0 = auto (rows expand to fit) |

If you only set `GridColumns(3)` and leave `GridRows` at auto, rows expand as items overflow. Setting both gives a fixed grid that clips additional items.

## Track sizes

Instead of a count, you can specify **per-track sizes** as a string template — just like CSS Grid. Tracks can be pixels, fractions (`1f`, `2f`), percentages, content-sized (`auto`), or responsive (`repeat(auto-fit, …)`).

```csharp
AutoUI.Create().Grid()
    .ColumnSizes("200 1f 1f")            // 200px sidebar, two equal-fraction columns
    .RowSizes("60 1f")                   // 60px header row, content row fills
    .Build();
```

| Token | Meaning |
|---|---|
| `200` | Fixed pixels |
| `1f`, `2f` | Fractional unit (shares remaining space proportionally) |
| `25%` | Percentage of container |
| `auto` | Sized to content (intrinsic) |
| `repeat(3, 1f)` | `1f 1f 1f` — counted repeat |
| `repeat(3, 100 1f)` | `100 1f 100 1f 100 1f` — multi-track repeat |
| `repeat(auto-fit, minmax(200, 1f))` | Responsive: as many columns as fit, each ≥ 200px |

### Auto-fit columns

The most-used responsive pattern. Column count changes with container width.

```csharp
AutoUI.Create().Grid().WidthFill()
    .GridAutoFit(200)                    // shorthand for repeat(auto-fit, minmax(200, 1f))
    .Gap(8)
    .Each(items, item => Card(item))
    .Build();
```

Or by percentage:

```csharp
AutoUI.Create().Grid().WidthFill()
    .GridAutoFitPercent(25)              // at most 4 columns (each ≥ 25% of container)
    .Build();
```

## Horizontal align

How items sit *horizontally* in their cells (container default for every cell).

| Value | Effect |
|---|---|
| `Stretch` (default) | Items fill the full track width |
| `Start` | Pin to the left of the cell |
| `Center` | Center horizontally in the cell |
| `End` | Pin to the right of the cell |

```csharp
AutoUI.Create().Grid().GridColumns(3)
    .GridHorizontalAlign(GridAlignment.Center)
    .Children(...)
    .Build();
```

Override per item via [Grid item → Horizontal Align Override](#grid-item).

## Vertical align

How items sit *vertically* in their cells. Same four values as Horizontal Align, applied to the row direction.

```csharp
AutoUI.Create().Grid().GridColumns(3)
    .GridVerticalAlign(GridAlignment.Center)
    .Build();
```

Override per item via [Grid item → Vertical Align Override](#grid-item).

## Flow

How items fill empty cells when not explicitly placed via [Grid item → Column / Row](#grid-item).

| Value | Effect |
|---|---|
| `Row` (default) | Fill row by row, left to right |
| `Column` | Fill column by column, top to bottom |
| `RowDense` | Like Row, but backfill earlier holes when a span doesn't fit |
| `ColumnDense` | Like Column, but backfill |

```csharp
AutoUI.Create().Grid().GridColumns(4).GridFlow(GridAutoFlow.RowDense)
    .Children(...)
    .Build();
```

Dense flow is useful when items have spans (see [Grid item](#grid-item)) and would otherwise leave gaps.

## Column gap and row gap

Spacing between cells. Independent per axis.

```csharp
AutoUI.Create().Grid().GridColumns(3)
    .ColumnGap(12)                       // horizontal spacing
    .RowGap(8)                           // vertical spacing
    .Build();
```

`.Gap(12)` is shorthand for both:

```csharp
AutoUI.Create().Grid().GridColumns(3)
    .Gap(12)                             // sets ColumnGap AND RowGap
    .Build();
```

`Padding` on a Grid container works the same as on Row/Column — it's the inset between the grid bounds and the cell area. See [Padding](/padding/).

## Grid item

Per-item properties that control cell placement, spans, and alignment overrides. Inspector: **SIZE & POSITION → Grid Item** (appears on the *child*, not the Grid container).

### Column / Row

Explicit placement. Negative = auto-place.

```csharp
AutoUI.Create().Grid().GridColumns(3).GridRows(3)
    .Children(
        AutoUI.Create()
            .GridColumn(0).GridRow(0)
            .Background(Color.red),
        AutoUI.Create()
            .GridColumn(2).GridRow(2)         // skip to bottom-right
            .Background(Color.green)
    )
    .Build();
```

If `Column` or `Row` is negative (the inspector default), the grid's auto-flow places the item — see [Flow](#flow).

### Column span / Row span

How many tracks the item occupies. Default `1`.

```csharp
AutoUI.Create().Grid().GridColumns(3)
    .Children(
        AutoUI.Create().GridColumnSpan(2).Background(Color.red),    // spans 2 columns
        AutoUI.Create().Background(Color.green),
        AutoUI.Create().GridRowSpan(2).Background(Color.blue)        // spans 2 rows
    )
    .Build();
```

Combine spans with `Flow.RowDense` to backfill gaps.

### Horizontal Align Override / Vertical Align Override

Per-item override of the grid's container-level alignment. Defaults to `Auto` (inherit from parent).

```csharp
AutoUI.Create().Grid().GridColumns(3)
    .GridHorizontalAlign(GridAlignment.Center)        // all cells horizontally centered
    .Children(
        AutoUI.Create().Width(80).Height(80),
        AutoUI.Create().Width(80).Height(80)
            .GridItemHorizontalAlign(GridAlignment.End),      // override: pin this one to the right
        AutoUI.Create().Width(80).Height(80)
    )
    .Build();
```

`GridAlignment` values: `Auto` · `Stretch` · `Start` · `Center` · `End`.

## Common patterns

### Photo gallery (responsive)

```csharp
AutoUI.Create().Grid().WidthFill()
    .GridAutoFit(160).Gap(8)
    .Each(photos, p =>
        AutoUI.Create().HeightAspect(1f)            // square cells
            .Background(p.Sprite))
    .Build();
```

### Sidebar + content + inspector

```csharp
AutoUI.Create().Grid().WidthFill().HeightFill()
    .ColumnSizes("200 1f 240")
    .RowSizes("1f")
    .Children(
        Sidebar(),
        Content(),
        Inspector()
    )
    .Build();
```

### Form (label / field rows)

```csharp
AutoUI.Create().Grid().WidthFill().HeightHug()
    .ColumnSizes("auto 1f")
    .Gap(8)
    .Each(fields, f => AutoUI.Create().Children(
        AutoUI.Create().TextSize().Text(f.Label),
        AutoUI.Create().WidthFill().Height(28)        // input field
    ))
    .Build();
```

The `auto` track sizes to the widest label; the `1f` track fills remaining width.

## Related

- [Sizing](/sizing/) — track sizing units explained
- [Row & Column](/row-column/) — for simpler 1D layouts
- [GridView](/grid-view/) — virtualised grid for large datasets
- [AutoUI](/auto-ui/) — builder reference
