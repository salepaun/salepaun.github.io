---
title: FAQ
description: Common gotchas and answers to questions that come up while learning AutoLayout PRO.
sidebar:
  order: 80
---

Quick answers to the questions that come up most often. If your problem isn't here, [search open issues](https://github.com/salepaun/autolayoutpro-issues/issues) or [file a new one](/reporting-bugs/).

## Sizing

### Why is my Hug element 0×0?

`Hug` measures the element to fit its **children**. If the element has no children, the result is its padding alone — `0×0` if no padding either. For text-only leaves, use `TextSize` instead.

**Fix:** for text-only elements, use `.TextSize()` (or `.WidthTextSize()` / `.HeightTextSize()`) instead of `.Hug()`. That measures the TMP/Image content rather than children.

```csharp
// ❌ Empty 0x0
AutoUI.Create().Hug().Text("Hello").Build();

// ✅ Sizes to text intrinsics
AutoUI.Create().TextSize().Text("Hello").Build();
```

See [Sizing → Sizing modes](/sizing/#sizing-modes) for the full mode reference.

### Why doesn't `WidthFill` make my element grow?

`Fill` shares **remaining** space inside its parent. If the parent's main-axis size isn't known (e.g. parent is also `Hug` along the same axis), there's nothing to share.

**Fix:** ensure the parent has a definite size on the axis you're filling — Pixels, Fill, Percentage, or AspectRatio.

```csharp
// ❌ Parent Hug + child Fill → child collapses
AutoUI.Create().Row().HeightHug()
    .Children(AutoUI.Create().HeightFill())
    .Build();

// ✅ Parent has a definite height; child fills it
AutoUI.Create().Row().Height(60)
    .Children(AutoUI.Create().HeightFill())
    .Build();
```

### When should I use Fill vs Percentage?

- **Fill** — share *remaining* space with other Fill siblings, weighted. Use when you have multiple Fill siblings (sidebar + main pane, header / body / footer).
- **Percentage** — a *fixed fraction* of the parent's axis, independent of siblings. Use when you want a specific ratio (modal at 50% width, hero at 30% of viewport height).

Rule of thumb: if you have more than one stretchable sibling on the axis, you almost always want Fill.

### How do I make my Width depend on a Percentage of Height (or vice versa)?

Use `WidthAspect(ratio)` or `HeightAspect(ratio)`. The axis with the aspect mode resolves *after* the other axis is known.

```csharp
// 16:9 thumbnail, 240px tall
AutoUI.Create().Height(240).WidthAspect(16f / 9f).Build();
```

At least one axis must have a definite size for AspectRatio to resolve.

## Layout

### Why does `.Children(...)` overlap my children?

The default `LayoutType` for `AutoUI.Create()` is `Absolute` — it's optimised for the centered-text case `.Center().Text(...)`. With multiple children it overlaps them.

The builder warns in the Editor when it detects this — look for `[AutoUI] ... has 2 children but no explicit Row()/Column()/Grid()` in the Console.

**Fix:** call `.Row()`, `.Column()`, or `.Grid()` before `.Children(...)`.

```csharp
// ❌ Overlapping
AutoUI.Create().Children(a, b, c).Build();

// ✅ Stacked vertically
AutoUI.Create().Column().Children(a, b, c).Build();
```

### Why doesn't my Grid expand when I add more items?

If `GridRows` is set to a fixed number, items beyond `GridColumns × GridRows` are clipped.

**Fix:** leave `GridRows` at `0` (auto). Rows expand as items overflow.

```csharp
AutoUI.Create().Grid().GridColumns(3)   // GridRows defaults to 0 = auto-grow
    .Children(/* any number of children */)
    .Build();
```

### How do I center a single child?

Use `.Center()` on the parent — shorthand for `.MainAlign(Center).CrossAlign(Center)`.

```csharp
AutoUI.Create()
    .WidthFill().HeightFill()
    .Center()
    .Children(AutoUI.Create().Width(200).Height(100).Text("Centered"))
    .Build();
```

### What's the difference between `LayoutType.Absolute` and `Placement.Absolute`?

Two different concepts that share a name:

- **`LayoutType.Absolute`** (on the *container*) — "my children all use absolute positioning by default."
- **`Placement.Absolute`** (on a *child*, set via `.Absolute()`) — "I am absolutely positioned inside my parent, regardless of my parent's layout type."

A Row container with one Absolute child gets two children laid out via Row, plus the absolute one floating freely.

See [Absolute](/absolute/) for the full breakdown.

## Code-side

### Why does `.Build()` throw on the second call?

A `LayoutBuilder` is **single-use**. After `.Build()` the builder is recycled into a thread-local pool — calling any method on it (including `.Build()` again) throws `InvalidOperationException`.

**Fix:** start a fresh chain via `AutoUI.Create()` each time you build. Don't store the builder in a field for reuse.

```csharp
// ❌ Reuses the same builder — second call throws
var b = AutoUI.Create().Column().Text("Hello");
b.Build();
b.Build();   // throws

// ✅ Fresh builder each time
AutoUI.Create().Column().Text("Hello").Build();
AutoUI.Create().Column().Text("Hello").Build();
```

### How do I capture a reference to a built component?

`.CaptureLayout(layout => myField = layout)` for the AutoLayout component, or `.Capture(go => myField = go)` for the GameObject. For widget components (ListView, Carousel, etc.) the widget builder has its own typed `.Capture(view => myField = view)`.

```csharp
AutoLayout m_Card;
ListView m_List;

AutoUI.Create()
    .Column().CaptureLayout(layout => m_Card = layout)
    .Children(
        AutoUI.Create().WidthFill().HeightFill()
            .ListView(ListViewDirection.Vertical, lv => lv
                .Prefab(rowPrefab, 20)
                .ItemCount(items.Count)
                .GetItem(i => items[i])
                .BindItem(BindRow)
                .Capture(list => m_List = list))
    )
    .Build();
```

### Why isn't my layout updating when I change a property?

AutoLayout uses dirty tracking — changes are picked up automatically on the next layout pass (typically the next frame). Three things break this:

1. **You modified the underlying RectTransform directly** (e.g. `.sizeDelta = ...`). The engine re-derives sizes each frame and overwrites your changes. Set the AutoLayout property instead (`.Width = ...`).
2. **You changed a serialized field via reflection or in OnValidate** without notifying the engine. Call `LayoutAdapter.MarkDirty(layout, DirtyType.All)` to force a recompute.
3. **You're inside Edit Mode and the engine is paused** (e.g. when not in Play Mode and Auto-Refresh is disabled). The engine only ticks during Editor frames; force one with `EditorApplication.QueuePlayerLoopUpdate()`.

If you've ruled out the above and the layout still won't update, [file a bug](/reporting-bugs/) with the layout YAML — that's the kind of thing the bug-report button was made for.

## Components

### Why does my ScrollView show no scrollbar?

The package has no built-in scrollbar visuals — you provide the scrollbar handle yourself and assign it to `ScrollView.VerticalScrollbarHandle` / `HorizontalScrollbarHandle`. Without an assignment, scrolling works but no thumb is rendered.

See [ScrollView](/scroll-view/) for the setup.

### Why does my ListView item stay the same size when I change its content?

By default ListView assumes uniform item sizes for performance. After dynamically resizing an item, call `m_ListView.InvalidateItemSize(index)` (or `InvalidateItemSizesFrom(index)` for batch updates).

### Why doesn't the Dropdown popup open in the right direction?

Set `DropdownDirection.Auto` (the default) — it measures available space above/below at open time and picks the larger side. Override with `Up` / `Down` only if you want forced behavior.

## Distribution

### Should I use UPM or `.unitypackage` for Asset Store distribution?

Both work. UPM is the modern recommendation — it ships `Documentation~`, supports samples imported via the Package Manager UI, and integrates with semantic versioning. Legacy `.unitypackage` is simpler for teams not on UPM but loses `~` folders entirely (which means no offline docs).

See the package's [Distribution section](https://github.com/salepaun/autolayoutpro-issues/blob/main/README.md#distribution) for the trade-offs.

### How do I report a bug with my exact layout?

Right-click the AutoLayout component header in the Inspector → **Report a Bug…**. The component's subtree gets serialized to YAML and pre-filled into a new GitHub issue. See [Reporting Bugs](/reporting-bugs/).
