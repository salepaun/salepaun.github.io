---
title: Padding
description: Inset between an element's bounds and its content area — pixel and percentage variants.
sidebar:
  order: 25
---

Padding is the **inset** between this element's bounds and its children's content area. Reduces the "free" space children can occupy. Inspector: **CHILD LAYOUT → Padding**.

```csharp
AutoUI.Create()
    .Column().WidthFill().HeightHug()
    .Padding(16)                              // 16 on all sides
    .Background(Color.gray)
    .Children(
        AutoUI.Create().Text("Hello")
    )
    .Build();
```

## Overloads

Four overloads, in order of common-ness:

```csharp
.Padding(16)                                  // all four sides
.Padding(16, 12)                              // horizontal (L+R), vertical (T+B)
.Padding(16, 16, 8, 12)                       // left, right, top, bottom
.Padding(new Spacing(left, right, top, bottom)) // explicit Spacing struct
```

## Percentage padding

```csharp
.PaddingPercent(5)                            // 5% of parent dimensions on each side
```

Percentage padding scales with screen size — `5%` on a 1920-wide canvas is 96px; on 1280, it's 64px. Useful for responsive layouts.

## Padding on Grid containers

On a Grid container, Padding is the inset between the grid bounds and the first cell — works the same as on Row/Column.

## Padding vs Margin vs Gap

- **Padding** — space *inside* this element (between its bounds and its children).
- **Margin** ([Margin](/margin/)) — space *outside* a specific child that depends on that child only.
- **Gap** ([Row & Column → Gap](/row-column/#gap)) — even spacing between *all* children of a Row/Column.

## Inspector input

The Padding fields accept unit suffixes and math — type `16px`, `5%`, `8+4`, etc. See [Inspector Input](/inspector-input/).

## Related

- [Margin](/margin/) — the outside counterpart
- [Row & Column → Gap](/row-column/#gap) — even spacing between siblings
- [Inspector Input](/inspector-input/) — unit and math syntax
