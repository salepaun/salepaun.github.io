---
title: Progress Bar
description: Linear or radial progress indicator with customizable colors and labels.
sidebar:
  order: 35
---

Linear or radial progress indicator with customizable colors and optional label.

## Inspector Setup

1. Add **AutoLayout Progress Bar** to a GameObject with `AutoLayout`.
2. Choose **Linear** or **Radial** mode.
3. Set the initial value and customize colors.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| Mode | ProgressBarMode | Linear | Linear or Radial |
| Value | float | 0 | Progress value (0-1) |
| Track Color | Color | Dark gray | Background track color |
| Fill Color | Color | Light blue | Progress fill color |
| Show Label | bool | false | Display percentage label |
| Label Format | string | "{0:0%}" | Label format string |

### Linear Mode

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| Fill Direction | LinearFillDirection | LeftToRight | Fill direction |

### Radial Mode

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| Start Angle | float | 90 | Arc start angle (0-360) |
| Clockwise | bool | true | Fill direction |
| Arc Range | float | 360 | Total arc range (0-360) |

## Code Usage

### AutoUI Builder

```csharp
// Horizontal linear progress bar — set Width/Height on the parent
AutoUI.Create()
    .WidthFill().Height(20)
    .ProgressBar(ProgressBarMode.Linear, pb => pb
        .Value(0.65f)
        .FillColor(Color.green)
        .TrackColor(Color.gray)
        .ShowLabel()
        .Capture(bar => m_LinearBar = bar))
    .Build();

// Vertical linear progress bar — pass direction in the entry call
AutoUI.Create()
    .Width(20).HeightFill()
    .ProgressBar(ProgressBarMode.Linear, LinearFillDirection.BottomToTop, pb => pb
        .Value(0.4f)
        .FillColor(Color.cyan))
    .Build();

// Radial progress bar
AutoUI.Create()
    .Size(100, 100)
    .ProgressBar(ProgressBarMode.Radial, pb => pb
        .Value(0.75f)
        .FillColor(Color.cyan)
        .TrackColor(new Color(0.2f, 0.2f, 0.2f))
        .ShowLabel()
        .LabelFormat("{0:0}%")
        .Capture(bar => m_RadialBar = bar))
    .Build();
```

The configure lambda is **optional**. Omit it to add a default bar you'll set values on later:

```csharp
AutoUI.Create().WidthFill().Height(20).ProgressBar().Build();
```

> **Sizing note:** `.ProgressBar(...)` does **not** set Width/Height on the parent — set them yourself before the call. Pick orientation via `.ProgressBar(mode, direction, configure)` — Linear bars need `Width(W).Height(H)` for horizontal or `Width(W).HeightFill()` for vertical.

### Runtime Updates

```csharp
// Update value (fires OnValueChanged)
m_LinearBar.Value = 0.8f;

// Change colors
m_LinearBar.FillColor = Color.red;
m_LinearBar.TrackColor = Color.black;

// Toggle label
m_LinearBar.ShowLabel = true;

// Rebuild visuals (e.g., after switching mode)
m_LinearBar.Mode = ProgressBarMode.Radial;
m_LinearBar.RebuildVisuals();
```

## Methods

| Method | Description |
|--------|-------------|
| `RebuildVisuals()` | Destroy and recreate children based on current mode |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `Value` | float | Progress (0-1), clamped |
| `Mode` | ProgressBarMode | Linear or Radial |
| `TrackColor` | Color | Background track color |
| `FillColor` | Color | Fill color |
| `ShowLabel` | bool | Show/hide percentage label |
| `LabelFormat` | string | Label format string |
| `FillDirection` | LinearFillDirection | Linear fill direction |
| `StartAngle` | float | Radial start angle |
| `Clockwise` | bool | Radial fill direction |
| `ArcRange` | float | Radial arc range |

## Events

| Event | Signature | Description |
|-------|-----------|-------------|
| `OnValueChanged` | `Action<float>` | Fires when Value changes |

## Builder API

| Method | Description |
|--------|-------------|
| `.Value(float)` | Set initial value (0-1) |
| `.FillColor(Color)` | Set fill color |
| `.TrackColor(Color)` | Set track color |
| `.ShowLabel()` | Enable percentage label |
| `.LabelFormat(string)` | Set label format |
| `.FillDirection(LinearFillDirection)` | Set linear fill direction |
| `.StartAngle(float)` | Set radial start angle |
| `.Clockwise(bool)` | Set radial direction |
| `.ArcRange(float)` | Set radial arc range |
| `.Capture(Action<AutoLayoutProgressBar>)` | Capture reference |

## Notes

- The bar takes whatever Width/Height you set on the parent. There are no auto-defaults — set sizing explicitly before the `.ProgressBar(...)` call.
- Label uses zero-GC `SetText("{0}", value * 100f)` internally.
- Linear mode uses `Image.Type.Filled` with Horizontal/Vertical fill method.
- Radial mode uses `Image.Type.Filled` with Radial360 fill method.
- Changing `Mode` at runtime requires calling `RebuildVisuals()`.
