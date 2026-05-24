---
title: AutoUI Builder
description: Code-first builder reference — composition, conditional UI, captures, widget builders, extensibility.
sidebar:
  order: 20
---

`AutoUI` is the static entry point for building UI hierarchies in code. It returns a `LayoutBuilder` that you chain method calls on, then finalise with `.Build()`.

```csharp
using AutoLayoutPRO.Builder;

AutoUI.Create(parent)
    .Column().Padding(16).Gap(8)
    .Children(
        AutoUI.Create().Text("Hello"),
        AutoUI.Create().Text("World")
    )
    .Build();
```

## Lifecycle

A `LayoutBuilder` is **single-use**:

1. `AutoUI.Create()` rents a builder from a thread-local pool.
2. You configure it via chained methods. Add children with `.Children(...)` / `.Child(...)` / `.Each(...)`.
3. `.Build()` materialises the entire tree, returns the root GameObject, and recycles all builders back to the pool.

After `Build()`, the builder is invalid. Calling any method on it (or `Build()` again) throws `InvalidOperationException`.

The pool is thread-static. The first build allocates; subsequent builds reuse — a 100-node UI is roughly **zero builder allocations** after warmup.

## Entry points

### `AutoUI.Create()`

Most common entry. Returns a fresh `LayoutBuilder` with no parent — typically nested inside `.Children(...)`.

```csharp
AutoUI.Create()
    .Row()
    .Children(
        AutoUI.Create().Text("Inner")        // nested
    );
```

### `AutoUI.Create(Transform parent)`

Top-level call when you have a parent transform. The built tree is reparented under it.

```csharp
AutoUI.Create(transform)         // 'transform' = MonoBehaviour's transform
    .Column()
    .Build();
```

### Convenience factories

Shorthand for the most common roots:

| Method | Equivalent to |
|---|---|
| `AutoUI.Row()` | `AutoUI.Create().Row()` |
| `AutoUI.Column()` | `AutoUI.Create().Column()` |
| `AutoUI.Grid()` | `AutoUI.Create().Grid()` |
| `AutoUI.GridAutoFit(minColWidth)` | `AutoUI.Create().Grid().GridAutoFit(...)` |
| `AutoUI.ScrollView()` | `AutoUI.Create().ScrollViewVertical()` |
| `AutoUI.ListView(direction?, configure?)` | `AutoUI.Create().ListView(direction?, configure?)` |
| `AutoUI.GridView(direction?, configure?)` | `AutoUI.Create().GridView(direction?, configure?)` |
| `AutoUI.Carousel(direction?, configure?)` | `AutoUI.Create().Carousel(direction?, configure?)` |
| `AutoUI.Dropdown(configure?)` | `AutoUI.Create().Dropdown(configure?)` |
| `AutoUI.ProgressBar(mode?, direction?, configure?)` | `AutoUI.Create().ProgressBar(mode?, direction?, configure?)` |

All widget overloads accept an optional `configure` lambda — see [Widgets](#widgets--the-configure-lambda-pattern) below.

### `AutoUI.CreateCanvas(name)`

Creates a new Canvas + CanvasScaler + GraphicRaycaster (and an EventSystem at runtime if needed). Returns a `CanvasBuilder` for further config; `.UI()` returns a `LayoutBuilder` rooted at the canvas.

```csharp
AutoUI.CreateCanvas("MainCanvas")
    .ReferenceResolution(1920, 1080)
    .UI()
        .Column().Padding(20)
        .Children(...)
        .Build();
```

## The chain — what's available

`LayoutBuilder` is a `partial class` with methods grouped into eight files. Find a property in the right area:

| Topic | What's there | See |
|---|---|---|
| **Layout type** | `Row()` / `Column()` / `Grid()` / `None()` / `Layout(LayoutType)` | [Layout Type](/layout-type/) |
| **Sizing** | `Width(...)` / `Height(...)` and per-mode shortcuts (`WidthFill`, `WidthHug`, `WidthPercent`, `WidthAspect`, `WidthTextSize`); `Size`, `Fill`, `Hug`, `TextSize`; `MinWidth`/`MaxWidth`/`MinHeight`/`MaxHeight` | [Sizing](/sizing/) |
| **Spacing** | `Padding(...)` (1/2/4-arg) / `Margin(...)` / `Gap(...)` / `GapPercent` / `PaddingPercent` / `Wrap()` / `WrapGap(...)` | [Padding](/padding/) · [Margin](/margin/) · [Row & Column → Gap](/row-column/#gap) |
| **Direction** | `Direction(LayoutDirection)` / `RTL()` / `LTR()` / `ReverseChildren(bool)` / `Overflow(UIOverflow)` | [Row & Column → Direction](/row-column/#direction) |
| **Alignment** | `MainAlign(...)` / `CrossAlign(...)` / `MainDistribute(...)` / `Center()` / `CrossAxisSelfAlign(...)` | [Row & Column → Alignment](/row-column/#alignment) |
| **Grid container** | `GridColumns(int)` / `GridRows(int)` / `ColumnGap` / `RowGap` / `GridFlow` / `GridHorizontalAlign` / `GridVerticalAlign` / `GridAutoFit(min)` / `GridAutoFitPercent(pct)` / `ColumnSizes(string)` / `RowSizes(string)` | [Grid](/grid/) |
| **Grid item** | `GridColumn` / `GridRow` / `GridColumnSpan` / `GridRowSpan` / `GridItemHorizontalAlign` / `GridItemVerticalAlign` | [Grid → Grid item](/grid/#grid-item) |
| **Placement** | `Absolute()` / `Cover()` / `Ignored()` / `Order(int)` / `Visibility(...)` / `Hidden()` / `Collapsed()` / `Left/Right/Top/Bottom/LeftRight/TopBottom(UIPosition)` / `HorizontalConstraint` / `VerticalConstraint` | [Absolute](/absolute/) |
| **Children** | `Children(params)` / `Children(IEnumerable)` / `Children(int, Func<int, LayoutBuilder>)` / `Child(LayoutBuilder)` / `Child(GameObject)` / `If(bool, Action)` / `Each<T>(...)` | This page |
| **Components** | `Text(...)` / `Background(Color\|Sprite)` / `Icon(Sprite)` / `RawImage(Texture)` / `Alpha(float)` / `AddComponent<T>(...)` / `OnClick(...)` / `Button(label, action)` / `OnPointerEnter/Exit/Down/Up` / `Draggable` / `OnBeginDrag` / `OnEndDrag` | This page |
| **Capture** | `Capture(Action<GameObject>)` / `CaptureLayout(Action<AutoLayout>)` | This page |
| **Widget builders** | `ScrollViewVertical/Horizontal/ScrollView` / `ListView` / `Carousel` / `Dropdown` / `ProgressBar` / `GridView` / `Inertia` / `ElasticBounds` | per-widget docs |
| **Transitions** | `Transition(targets, duration, ease, delay)` — declarative CSS-style property animations | [Transitions](/transitions/) |
| **Identity** | `Name(string)` | — |
| **Build** | `Build()` returns the root GameObject | This page |

## Children — composition

There are five ways to add children:

### Static list

```csharp
.Children(a, b, c)             // params LayoutBuilder[]; null entries filtered
```

### Single child

```csharp
.Child(b)                      // single, no array allocation
```

### IEnumerable

```csharp
.Children(items.Select(x => Card(x)))    // no .ToArray() needed
```

### Indexed factory

```csharp
.Children(10, i =>             // build 10 items by index
    AutoUI.Create().Text($"Row {i}"))
```

### Each (data-driven, most common)

```csharp
.Each(items, item =>
    AutoUI.Create().Text(item.Name))

.Each(items, (item, i) =>      // with index
    AutoUI.Create().Text($"{i}: {item.Name}"))
```

### Adopt an existing GameObject

```csharp
.Child(somePrefabInstance)     // reparented under this node at Build()
```

### Conditional

```csharp
.Children(
    a,
    showAdvanced ? b : null,   // null entries are filtered out
    c
)
.If(isMobile, b => b.Padding(8))    // apply config conditionally
```

## Capturing references

Need a reference to the built GameObject or component? Two options:

```csharp
AutoLayout m_Card;
GameObject m_Root;

AutoUI.Create()
    .Column()
    .Capture(go => m_Root = go)               // raw GameObject
    .CaptureLayout(layout => m_Card = layout) // typed AutoLayout
    .Children(...)
    .Build();
```

Use `CaptureLayout` for the AutoLayout component (most common); `Capture` if you need the GameObject for other reasons.

For widget-specific component captures (e.g. the `ListView` instance), use `.Capture` on the *widget builder*:

```csharp
ListView m_List;

AutoUI.Create().WidthFill().HeightFill()
    .ListView(ListViewDirection.Vertical, lv => lv
        .Prefab(rowPrefab, 20)
        .ItemCount(items.Count)
        .GetItem(i => items[i])
        .BindItem(BindRow)
        .Capture(list => m_List = list))
    .Build();
```

## Components

Common components have one-line shortcuts; anything else uses `AddComponent<T>`.

```csharp
.Text("Hello", 24f, Color.white)         // TMP, sized by node's TextSize/Hug
.Background(Color.gray)                  // Image with solid color
.Background(spriteAsset)                 // Image with sprite
.Background(spriteAsset, Color.white)    // sprite + tint
.Icon(spriteAsset)                       // Image with PreserveAspect
.RawImage(textureAsset)                  // RawImage (e.g. RenderTexture)
.Alpha(0.5f)                             // CanvasGroup alpha (auto-added)
.OnClick(() => Debug.Log("clicked"))     // Button + click handler (Image auto-added if no Graphic)
.Button("Save", OnSave)                  // styled button: Padding(12,8) + Center + Background + Text + OnClick
.AddComponent<MyCustomComponent>(c => c.MyField = 42)
```

## Widgets — the configure-lambda pattern

Widget builder methods (`ListView`, `Carousel`, `Dropdown`, `ProgressBar`, `GridView`) take an optional `configure` lambda that runs against the widget's own builder. The widget is added to the current node, and the chain returns to the same `LayoutBuilder` so you can keep going.

```csharp
AutoUI.Create()
    .WidthFill().HeightFill()
    .ListView(ListViewDirection.Vertical, lv => lv
        .Prefab(rowPrefab, 20)
        .ItemCount(data.Count)
        .GetItem(i => data[i])
        .BindItem(...))
    .Build();
```

The configure lambda is optional. Omit it to add an empty widget you'll configure later through a captured reference:

```csharp
ListView m_List;

AutoUI.Create()
    .WidthFill().HeightFill()
    .ListView(lv => lv.Capture(view => m_List = view))
    .Build();

// later
m_List.Setup(prefab, data.Count, BindRow, i => data[i]);
```

The widget method does NOT mutate parent sizing/padding (with two exceptions noted in the per-widget docs: `.Dropdown(...)` sets the parent to `Row + CrossAlign(Center)` because the dropdown header needs it). Set Width/Height/Padding on the parent yourself before the call.

## Extending the API

Two ways to add your own chainable methods:

### Extension methods (recommended for most cases)

Anyone in any assembly can add chainable methods to `LayoutBuilder`:

```csharp
namespace MyGame.UI
{
    public static class MyAutoUIExtensions
    {
        public static LayoutBuilder PrimaryButton(this LayoutBuilder b, string label, Action onClick)
        {
            return b.Padding(12, 8)
                    .Center()
                    .Background(new Color(0.18f, 0.36f, 0.96f))
                    .Text(label, 14f, Color.white)
                    .OnClick(() => onClick());
        }
    }
}

// Usage:
AutoUI.Create().PrimaryButton("Save", OnSave).Build();
```

### Partial class

If you're in the `AutoLayoutPRO` package itself (or a same-assembly fork), add a new `LayoutBuilder.MyStuff.cs` file:

```csharp
namespace AutoLayoutPRO.Builder
{
    public partial class LayoutBuilder
    {
        public LayoutBuilder MyMethod() { /* access private state */; return this; }
    }
}
```

For widget-style builders (your own analogous to `CarouselBuilder`), follow the existing pattern: a builder class with chainable methods, an `End()` returning `LayoutBuilder`, and an entry method on `LayoutBuilder` (or extension method) to construct it.

## Pooling and performance

After warmup, the builder pool eliminates per-build allocations. Things to know:

- The pool is thread-static. Builds on background threads use a separate pool.
- A builder cannot escape `Build()`. If you keep a reference and try to use it later, you'll get an `InvalidOperationException` (the same builder may have been re-rented elsewhere).
- Component-action lambdas (e.g. `.OnClick(() => ...)`) still allocate closures. For very-hot rebuilds (per-frame UI), prefer setting state on captured references instead of rebuilding.

## Common patterns

See [GettingStarted](/getting-started/) for a starting point and [Overview](/overview/) for the AutoLayout component reference. Per-widget docs live under Components in the sidebar.
