---
title: Sizing
description: Width and Height each pick one of six sizing modes — Pixels, Hug, Fill, Percentage, AspectRatio, TextSize.
sidebar:
  order: 11
---

Width and Height are independent — a node can be `WidthFill` + `HeightHug` (a row that fills horizontally and shrinks to its tallest child). Each axis picks a **sizing mode** plus, for some modes, a value. Inspector: **SIZE & POSITION → Size**.

## Width

The width-axis size. Pick a sizing mode (see [Sizing modes](#sizing-modes) below).

```csharp
AutoUI.Create().Width(200).Build();             // 200 px
AutoUI.Create().WidthFill().Build();            // share of parent's free space
AutoUI.Create().WidthHug().Build();             // wrap children
AutoUI.Create().WidthPercent(50).Build();       // 50% of parent
AutoUI.Create().WidthAspect(1.5f).Build();      // 1.5× height
AutoUI.Create().WidthTextSize().Build();        // intrinsic TMP text width
```

## Height

The height-axis size. Same six modes, mirrored.

```csharp
AutoUI.Create().Height(60).Build();
AutoUI.Create().HeightFill().Build();
AutoUI.Create().HeightHug().Build();
AutoUI.Create().HeightPercent(25).Build();
AutoUI.Create().HeightAspect(1f).Build();       // square (1× width)
AutoUI.Create().HeightTextSize().Build();
```

## Sizing modes

The six modes shared by Width and Height:

| Mode | Inspector | Builder | Resolves to |
|---|---|---|---|
| Pixels | `Pixels` + value | `.Width(120f)` / `.Height(40f)` | The literal pixel value |
| Hug | `Hug` | `.WidthHug()` / `.HeightHug()` / `.Hug()` | Sum of children + padding |
| Fill | `Fill` + weight | `.WidthFill()` / `.HeightFill(2f)` / `.Fill()` | Share of parent's free space, by weight |
| Percentage | `Percentage` + value | `.WidthPercent(50)` / `.HeightPercent(25)` | A percentage (0–100) of parent size |
| AspectRatio | `AspectRatio` + ratio | `.WidthAspect(1.5f)` / `.HeightAspect(1f)` | width × ratio (or height × ratio for HeightAspect) |
| TextSize | `TextSize` | `.WidthTextSize()` / `.TextSize()` | Intrinsic bounds of the element's TMP text |

**Pixels** — fixed-size elements (icons, dividers, sized buttons).

**Hug** — wraps children's combined size plus the element's own padding. A Hug *leaf* with no children resolves to its padding alone (or 0×0 if no padding). For text-only leaves, use `TextSize` instead.

**Fill** — shares the parent's *remaining* space with other Fill siblings, proportional to the `weight` argument (default `1f`). Cross-axis: `WidthFill` inside a Column means "fill the column's full width."

**Percentage** — a fixed fraction of parent's size on the same axis. Use Fill when siblings should share leftover space; use Percentage when you want a specific fraction independent of siblings.

**AspectRatio** — locks one axis to a multiple of the other. `WidthAspect(2f)` is "twice as wide as it is tall." Make sure at least one axis has a definite size (Pixels, Fill, Percentage, or Hug-with-content).

**TextSize** — measures TMP text and uses those bounds. Text-only (no equivalent for images). `TextSize()` sets both axes; `WidthTextSize()` / `HeightTextSize()` set one and let you pick the other (e.g. `.WidthFill().HeightTextSize()` for full-width text that shrinks vertically to its wrapped content). If a TextSize element has `MaxWidth` set, TMP wraps and Height grows to fit.

### Cheatsheet

- I know the exact size → **Pixels**
- This element should grow to fit → **Hug** (children) or **TextSize** (text)
- I want it to fill remaining space → **Fill**
- I want a specific fraction of parent → **Percentage**
- It must keep a width:height ratio → **AspectRatio**
- I have a TMP text and want its natural size → **TextSize**

## Min and Max

Every mode can be clamped per-axis:

```csharp
AutoUI.Create().WidthFill().MinWidth(120).MaxWidth(400)
    .HeightHug().MinHeight(40)
    .Build();
```

`MinWidth` / `MaxWidth` / `MinHeight` / `MaxHeight` are pure floats in pixels. Use them to bound a Fill so it doesn't collapse below or grow above sensible limits, or to give a Hug element a sensible floor.

## Inspector input

Width and Height inspector fields parse unit suffixes and math — type `120px`, `50%`, `1.5x`, `fill`, `hug`, `100+50px`, or `(1920/3)px` and the field switches modes in one shot. See [Inspector Input](/inspector-input/) for the full syntax.

## Related

- [Inspector Input](/inspector-input/) — type units and math directly into sizing fields
- [Absolute](/absolute/) — how Width/Height interact with absolute constraints
- [Row & Column](/row-column/) — how Fill/Hug interact inside Row and Column
- [Grid](/grid/) — how track sizing interacts with cell content sizing
- [AutoUI](/auto-ui/) — builder reference
