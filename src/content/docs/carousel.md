---
title: Carousel
description: Slide, loop, or fade carousel with snap and pooling.
sidebar:
  order: 33
---

Snap-to-item scrollable container with slide, loop, and fade modes. A single `CarouselView` component handles both static-children and virtualized-with-pooling cases — virtualization kicks in when you register prefabs and an item count.

## Inspector Setup

1. Create a container with `AutoLayout` and `AutoLayoutScrollView`.
2. Add the **CarouselView** component.
3. For **static** mode: add child items as direct children of the carousel.
4. For **virtualized** mode: register prefabs in the **Prefabs** list and set `ItemCount` via code.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| Direction | CarouselDirection | Horizontal | Scroll axis |
| Type | CarouselType | Slide | Slide, Loop, or Fade |
| Per Page | int | 1 | Visible slides at once |
| Focus | FocusMode | Center | Snap alignment (Start, Center, End) |
| Padding | float | 0 | Edge padding in pixels |
| Gap | float | 0 | Gap between items |
| Speed | float | 400 | Transition speed in ms |
| Is Rewind | bool | false | Wrap from last to first |
| Uniform Item Size | float | 0 | Fixed item size (0 = auto) |
| Virtualized | bool | true | Enable object pooling (only effective when prefabs are registered) |
| Overscan Count | int | 2 | Extra items rendered offscreen |
| Default Pool Capacity | int | 10 | Initial pool size per prefab type |
| Prefabs | List | - | Prefab registrations (typeId + prefab + capacity) |

## Code Usage

### AutoUI Builder — virtualized

```csharp
AutoUI.Create()
    .WidthFill().Height(300)
    .Carousel(CarouselDirection.Horizontal, c => c
        .Type(CarouselType.Loop)
        .PerPage(3)
        .Focus(FocusMode.Center)
        .Gap(16)
        .Speed(400)
        .Prefab(cardPrefab, 6)
        .ItemCount(items.Count)
        .GetItem(i => items[i])
        .BindItem((go, index, data) =>
        {
            var label = go.GetComponentInChildren<TMP_Text>();
            label.text = ((MyItem)data).Name;
        })
        .Capture(view =>
        {
            m_Carousel = view;
            m_Carousel.OnFocusChanged += i => Debug.Log($"Focused: {i}");
        }))
    .Build();
```

The configure lambda is **optional**. Omit it to add an empty carousel and configure it later:

```csharp
AutoUI.Create().WidthFill().Height(200).Carousel().Build();
```

### AutoUI Builder — static children

When you don't register prefabs, the carousel hosts its declared `.Children(...)` directly:

```csharp
AutoUI.Create()
    .WidthFill().Height(200)
    .Carousel(CarouselDirection.Horizontal, c => c
        .Focus(FocusMode.Center)
        .Gap(12)
        .Speed(300)
        .Capture(view => m_Carousel = view))
    .Children(
        AutoUI.Create().Size(200, 180).Background(Color.red),
        AutoUI.Create().Size(200, 180).Background(Color.blue),
        AutoUI.Create().Size(200, 180).Background(Color.green)
    )
    .Build();
```

### AddComponent Pattern

If you'd rather configure the `CarouselView` component directly:

```csharp
AutoUI.Create()
    .WidthFill().Height(380)
    .Overflow(UIOverflow.Hidden)
    .ScrollView(sv => { })
    .AddComponent<CarouselView>(cv =>
    {
        cv.Direction = CarouselDirection.Horizontal;
        cv.Type = CarouselType.Loop;
        cv.PerPage = 3;
        cv.Focus = FocusMode.Center;
        cv.Gap = 20;
        cv.RegisterPrefab(0, cardPrefab, 6);
        cv.ItemCount = items.Count;
        cv.BindItemCallback = (go, index, data) => { /* bind */ };
        cv.RefreshItems();
    })
    .Build();
```

## Methods

| Method | Description |
|--------|-------------|
| `GoToItem(int index, bool animated = true)` | Navigate to specific item |
| `GoToNext(bool animated = true)` | Navigate forward |
| `GoToPrevious(bool animated = true)` | Navigate backward |
| `AddEffect(ICarouselEffect effect)` | Add visual scroll effect |
| `RemoveEffect(ICarouselEffect effect)` | Remove visual effect |
| `RefreshItems()` | Refresh after data change (virtualized only) |
| `RefreshItemsImmediate()` | Synchronous refresh (virtualized only) |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `FocusedIndex` | int | Currently focused item index |
| `IsSnapping` | bool | Snap animation in progress |
| `IsDragging` | bool | User is dragging |
| `ItemCount` | int | Total number of items |
| `ScrollProgress` | float | Continuous scroll progress |

## Events (CarouselView component)

Subscribe via `Capture` after building:

| Event | Signature | Description |
|-------|-----------|-------------|
| `OnFocusChanged` | `Action<int>` | Fires when focused item changes |
| `OnFocusChanging` | `Action<int, int>` | Fires during transition (from, to) |
| `OnScrollProgress` | `Action<float>` | Continuous scroll progress updates |

## Callbacks (virtualized mode)

| Callback | Signature | Description |
|----------|-----------|-------------|
| `GetItemCallback` | `Func<int, object>` | Return data for index |
| `GetItemTypeCallback` | `Func<int, int>` | Return prefab type for index |
| `BindItemCallback` | `Action<GameObject, int, object>` | Bind data to item |
| `UnbindItemCallback` | `Action<GameObject, int>` | Cleanup on recycle |

## Builder API

| Method | Description |
|--------|-------------|
| `.Type(CarouselType)` | Slide, Loop, or Fade |
| `.Focus(FocusMode)` | Start, Center, End |
| `.PerPage(int)` | Visible slides at once |
| `.Gap(float)` | Gap between items |
| `.Padding(float)` | Edge padding |
| `.Speed(float)` | Transition speed in ms |
| `.Rewind(bool)` | Wrap from last to first |
| `.Easing(CarouselEasingFunction)` | Custom easing |
| `.PoolCapacity(int)` | Default pool size per prefab |
| `.Prefab(GameObject, int)` | Register type-0 prefab |
| `.Prefab(int, GameObject, int)` | Register typed prefab |
| `.Effect(ICarouselEffect)` | Add visual effect |
| `.Delegate(ICarouselViewDelegate)` | Set delegate (overrides callbacks) |
| `.ItemCount(int)` | Set total items |
| `.GetItem(Func<int, object>)` | Set data callback |
| `.BindItem(Action<GameObject, int, object>)` | Set bind callback |
| `.UnbindItem(Action<GameObject, int>)` | Set unbind callback |
| `.Capture(Action<CarouselView>)` | Capture reference (e.g. `.Capture(view => m_Carousel = view)`) |

## Interfaces

- **`ICarouselItem`** — Implement on prefab root for auto-binding.
- **`ICarouselViewDelegate`** — Full data source control (overrides callbacks).
- **`ICarouselEffect`** — Custom visual effects applied during scroll.

## Notes

- `.Carousel(direction, configure)` configures the parent in place and returns the parent `LayoutBuilder` — keep chaining or call `.Build()` to materialise the tree.
- Use `Focus = Center` for typical snap-to-center carousels; `Start` snaps the leading edge; `End` snaps the trailing edge.
- `.Type(CarouselType.Loop)` enables wrap-around scrolling; `Slide` clamps at boundaries; `Fade` cross-fades between items.
