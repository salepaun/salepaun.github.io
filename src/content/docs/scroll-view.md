---
title: ScrollView
description: Scrollable container with inertia, elastic bounds, and snap-to-page.
sidebar:
  order: 30
---

Scrollable container with inertia, elastic bounds, and optional scrollbar handles. Automatically manages a content child that can be a Column, Row, or manual layout.

## Inspector Setup

1. Add `AutoLayout` to a container GameObject.
2. Add **AutoLayout Scroll View** to the same GameObject.
3. Content child is created automatically. Children added to the scroll view are reparented to the content container.
4. Optionally assign scrollbar handle RectTransforms.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| Scroll Sensitivity | float | 20 | Mouse wheel multiplier |
| Scroll Wheel Axis | int | 1 | 0 = horizontal, 1 = vertical |
| Enable Inertia | bool | true | Momentum after drag |
| Enable Elastic Bounds | bool | true | Bounce at edges |
| Deceleration Rate | float | 0.135 | Inertia decay (0.01-0.5) |
| Elasticity Duration | float | 0.3 | Bounce duration |
| Snap Enabled | bool | false | Enable snap-to-interval after scroll ends |
| Snap Interval | float | 0 | Snap interval in pixels (0 = viewport size = page snap) |
| Snap Alignment | ScrollSnapAlignment | Start | Start or Center alignment within interval |
| Snap Speed | float | 400 | Snap animation duration in ms |
| Vertical Scrollbar Handle | RectTransform | - | Optional vertical scrollbar thumb |
| Horizontal Scrollbar Handle | RectTransform | - | Optional horizontal scrollbar thumb |

## Code Usage

### AutoUI Builder

```csharp
// Vertical scroll view (Column content)
AutoUI.Create()
    .WidthFill().HeightFill()
    .ScrollViewVertical()
    .Children(
        AutoUI.Create().WidthFill().Height(100).Background(Color.red),
        AutoUI.Create().WidthFill().Height(100).Background(Color.green),
        AutoUI.Create().WidthFill().Height(100).Background(Color.blue)
        // ... many children
    )
    .Build();

// Horizontal scroll view
AutoUI.Create()
    .WidthFill().Height(200)
    .ScrollViewHorizontal()
    .Children(
        AutoUI.Create().Width(200).HeightFill().Background(Color.red),
        AutoUI.Create().Width(200).HeightFill().Background(Color.green)
    )
    .Build();
```

`AutoUI.ScrollView()` (static) is also available as a shortcut for `AutoUI.Create().ScrollViewVertical()`.

### Configuring ScrollView

```csharp
AutoUI.Create()
    .WidthFill().HeightFill()
    .ScrollView(sv =>
    {
        sv.ScrollSensitivity = 30f;
        sv.EnableInertia = true;
        sv.EnableElasticBounds = true;
        sv.DecelerationRate = 0.1f;
    })
    .Children(/* ... */)
    .Build();
```

### Page Snap

```csharp
AutoUI.Create()
    .WidthFill().HeightFill()
    .ScrollView(sv =>
    {
        sv.SnapEnabled = true;
        // SnapInterval = 0 means page snap (viewport size)
    })
    .Children(
        AutoUI.Create().WidthFill().HeightFill().Background(Color.red),
        AutoUI.Create().WidthFill().HeightFill().Background(Color.green),
        AutoUI.Create().WidthFill().HeightFill().Background(Color.blue)
    )
    .Build();

// Custom interval snap (every 100px)
AutoUI.Create()
    .WidthFill().HeightFill()
    .ScrollView(sv =>
    {
        sv.SnapEnabled = true;
        sv.SnapInterval = 100f;
        sv.SnapAlignment = ScrollSnapAlignment.Center;
        sv.SnapSpeed = 300f;
    })
    .Children(/* ... */)
    .Build();
```

### Programmatic Scrolling

```csharp
var scrollView = go.GetComponent<AutoLayoutScrollView>();

// Scroll to position
scrollView.ScrollTo(new Vector2(0, 500), animated: true);
scrollView.ScrollTo(500f, animated: true);  // Single axis

// Scroll by delta
scrollView.ScrollBy(new Vector2(0, 100));

// Scroll to child
scrollView.ScrollToChild(childTransform, animated: true);

// Stop scrolling
scrollView.StopScrolling();

// Refresh content size after adding/removing children
scrollView.RefreshContentSize();
```

## Methods

| Method | Description |
|--------|-------------|
| `ScrollTo(Vector2 position, bool animated = true)` | Scroll to absolute position |
| `ScrollTo(float position, bool animated = true)` | Scroll single axis |
| `ScrollBy(Vector2 delta)` | Scroll by relative delta |
| `ScrollBy(float delta)` | Scroll single axis by delta |
| `ScrollToChild(Transform child, bool animated = true)` | Scroll to make child visible |
| `RefreshContentSize()` | Recalculate content dimensions |
| `StopScrolling()` | Stop inertia/animation |
| `ExcludeFromReparenting(Transform child)` | Prevent child from being reparented to content |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `Content` | RectTransform | Auto-managed content container |
| `ContentMode` | ScrollContentMode | Column, Row, or Manual |
| `ScrollOffset` | Vector2 | Current 2D scroll offset |
| `IsScrolling` | bool | Scroll in progress |
| `IsDragging` | bool | User is dragging |
| `CanScrollHorizontal` | bool | Content wider than viewport |
| `CanScrollVertical` | bool | Content taller than viewport |
| `ScrollSensitivity` | float | Mouse wheel multiplier |
| `EnableInertia` | bool | Momentum after drag |
| `EnableElasticBounds` | bool | Edge bounce |
| `DecelerationRate` | float | Inertia decay rate |
| `ElasticityDuration` | float | Bounce animation duration |
| `Physics` | ScrollPhysics | Physics simulation instance |
| `SnapEnabled` | bool | Snap-to-interval enabled |
| `SnapInterval` | float | Snap interval (0 = page) |
| `SnapAlignment` | ScrollSnapAlignment | Start or Center |
| `SnapSpeed` | float | Snap duration in ms |
| `IsSnapping` | bool | Snap animation in progress |
| `Controller` | ScrollController | Headless controller |

## Content Modes

| Mode | Description |
|------|-------------|
| `Column` | Content arranged vertically (default for vertical scroll) |
| `Row` | Content arranged horizontally (default for horizontal scroll) |
| `Manual` | Custom content layout |

## Notes

- Children added to the scroll view are automatically reparented to the content container.
- Use `ExcludeFromReparenting()` for children that should stay as direct children (e.g., scrollbar overlays).
- The scroll view integrates with `IUGUILayoutDependent` to refresh content size after layout.
- Implements `IScrollHandler`, `IBeginDragHandler`, `IDragHandler`, `IEndDragHandler`.
- Scrollbar handles auto-resize based on content-to-viewport ratio.
