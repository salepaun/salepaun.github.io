---
title: AutoLayout Overview
description: The AutoLayout component, every property explained, the three-phase algorithm, and common gotchas.
sidebar:
  order: 10
---

The `AutoLayout` MonoBehaviour is the single component you add to UI GameObjects to participate in layout. It can fully replace Unity's built-in `LayoutGroup` + `ContentSizeFitter` + `LayoutElement` stack, or coexist with it on the same Canvas so you can adopt it screen-by-screen without rewriting your existing UI.

When you add it to a Canvas-rooted RectTransform and set its **Layout Type**, AutoLayout takes over sizing and positioning of itself and its children. Child GameObjects with their own `AutoLayout` participate in the same pass; child GameObjects without one are positioned but not measured.

## Property reference

The Inspector groups properties into sections. Each section has its own dedicated doc; this page is the index.

### Layout type

- **None** — the component participates in measurement but doesn't arrange children. Children use absolute positioning (anchors/offsets like vanilla Unity UI).
- **Row** — horizontal auto-layout container. See [Row & Column](/row-column/).
- **Column** — vertical auto-layout container. See [Row & Column](/row-column/).
- **Grid** — CSS-grid-style. See [Grid](/grid/).
- **Absolute** — children use absolute positioning relative to this container's content rect. Different from `None`: this container is itself sized normally; only the *children* are absolute.

### Sizing

- **Width** + **Height** — pick a sizing mode per axis: Pixels, Hug, Fill, Percentage, AspectRatio, TextSize. Full reference: [Sizing](/sizing/).
- **MinWidth / MaxWidth / MinHeight / MaxHeight** — clamp the resolved size on either axis. See [Sizing → Min and Max](/sizing/#min-and-max).

### Spacing

- **Padding** — inset between this element's bounds and its content area. See [Padding](/padding/).
- **Margin** — outset between this element and its siblings. See [Margin](/margin/).
- **Gap** — spacing between children in Row/Column. Set as pixels or percentage. See [Row & Column → Gap](/row-column/#gap).

### Alignment

- **Main Axis Align** / **Cross Axis Align** — where children sit on each axis (Start, Center, End, Stretch). See [Row & Column → Alignment](/row-column/#alignment).
- **Main Axis Distribution** — how extra space is shared (Packed, SpaceBetween, SpaceAround, SpaceEvenly).
- **Cross Axis Self Align** — per-child override of parent's CrossAxisAlign. See [Row & Column → Linear item](/row-column/#linear-item).

### Placement

- **Normal** (default) — participates in parent layout flow.
- **Absolute** — anchored to parent's content rect via Top/Bottom/Left/Right; ignored by Row/Column flow.
- **CoverParent** — stretches to match parent size, ignoring padding/margin. Useful for backgrounds.
- **Ignored** — sized by AutoLayout but positioned externally (used by ListView/GridView for pooled items).

### Direction (RTL)

- **LeftToRight** (default) / **RightToLeft** / **Inherit** — flips Row/Wrap/Grid children right-to-left and resolves Alignment.Start to the right edge. No effect on Column.

### Overflow

- **Visible** (default) / **Hidden** — `Hidden` adds a RectMask2D so children clip at the bounds.

### Visibility

- **Visible** / **Hidden** (invisible but takes space) / **Collapsed** (out of layout flow entirely).

### Reverse children

A bool that flips sibling iteration order without changing alignment semantics. Row + ReverseChildren = render right-to-left while still resolving Alignment.Start to the left edge.

### Layout order

An integer that overrides visual sibling order. Lower comes first; 0 = use hierarchy order. Negatives allowed.

## How it computes a layout

AutoLayout runs a **three-phase algorithm** on the dirty subtree:

1. **Gather** — adapter scans the RectTransform tree, builds an array of `UINode` structs.
2. **Intrinsic Sizing** (bottom-up) — Hug/TextSize sizes propagate up from leaves.
3. **Space Distribution + Positioning** (top-down) — Fill/% sizes resolve, then positions are written to RectTransforms.

The engine tracks dirty state per node (size changes, position changes, child changes, layout settings changes) and rebuilds only what's affected. A change to a leaf node's size doesn't recompute the entire tree.

For most users the only thing that matters is: **set sizing modes correctly and the engine handles the rest**. The engine never modifies anchors or pivots; they're set once at GameObject creation (always `(0, 1)` for AutoLayout-managed elements).

## Lineage

The Hug / Fill / Fixed / Percent sizing model isn't novel. It's the same one [Subform](https://subformapp.com/) prototyped years ago and the Rust [Morphorm](https://github.com/vizia/morphorm) library ships today. AutoLayout adapts those primitives to Unity's RectTransform world, runs the math in Burst, and adds incremental rebuilds. The model is *not* CSS flexbox; it's older, simpler, and matches how designers describe layouts.

## Performance, precisely

The Burst-compiled three-phase pass that resolves sizes and positions is zero-allocation. That's the hot path during a layout. Outside that pass, applying the result to Unity (writing to `RectTransform`, marking the Canvas dirty, and any internal `Canvas.ForceUpdateCanvases` work that triggers) can still allocate. The win is that AutoLayout's own code adds nothing to the GC pile; what Unity does after we hand off is on Unity.

## Common gotchas

- **Anchors must be `(0, 1)`** at creation time. The `AutoUI` builder handles this automatically. Manual `new GameObject` + `AddComponent<RectTransform>` setup must set `anchorMin = anchorMax = pivot = new Vector2(0, 1)` before adding `AutoLayout`.
- **Hug on a leaf with no content = 0×0**. A leaf that uses `Hug()` measures its children to find a size. If there are no children, the result is zero. Use `TextSize()` for text-only leaves, or set explicit `Width`/`Height`.
- **Mixing layout types and Placement.Absolute**. An Absolute child still has a size resolved by the engine (via Width/Height or anchor stretch); it just doesn't participate in Row/Column flow.

## Code example

The same configuration as the Inspector. Every property has a corresponding builder method:

```csharp
AutoUI.Create()
    .Column()                         // LayoutType
    .WidthFill().HeightHug()          // Sizing
    .MinHeight(100).MaxHeight(400)    // Constraints
    .Padding(16, 12)                  // 16 horizontal, 12 vertical
    .Gap(8)
    .MainAlign(Alignment.Start)
    .CrossAlign(Alignment.Center)
    .Background(new Color(0.95f, 0.95f, 0.95f))
    .Children(
        AutoUI.Create().Text("Title", 24f),
        AutoUI.Create().Text("Body text")
    )
    .Build();
```

## Related

- [Sizing](/sizing/) · [Absolute](/absolute/) · [Margin](/margin/) · [Render Offset](/render-offset/) — SIZE & POSITION inspector group
- [Layout Type](/layout-type/) · [Row & Column](/row-column/) · [Grid](/grid/) · [Padding](/padding/) · [Overflow](/overflow/) — CHILD LAYOUT inspector group
- [Transitions](/transitions/) · [Custom Layouts](/custom-layouts/) · [Inspector Input](/inspector-input/)
- [AutoUI](/auto-ui/) — the code-first builder
