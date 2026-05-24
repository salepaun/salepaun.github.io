---
title: Tweening
description: Animation extensions for AutoLayout properties.
sidebar:
  order: 36
---

Animation extension methods and components for tweening AutoLayout properties (width, height, gap, margin, padding).

:::tip[Looking for declarative animation?]
[Transitions](/transitions/) animate property changes automatically (CSS-style). Use Transitions when *any change* to a property should animate; use Tweening when you want to fire a specific animation imperatively.
:::

## Overview

The tweening system provides two ways to animate layout properties:

1. **Extension Methods** — Call directly on any `AutoLayout` component from code.
2. **Tween Components** — Add MonoBehaviours in the Inspector for inspector-driven animations.

## Extension Methods

### Code Usage

```csharp
var layout = GetComponent<AutoLayout>();

// Tween width
layout.TweenWidth(300f, 0.5f, EasePreset.OutQuad, () => Debug.Log("Done"));

// Tween height
layout.TweenHeight(200f, 0.3f);

// Tween size (both axes)
layout.TweenSize(new Vector2(300, 200), 0.5f);

// Tween gap
layout.TweenGap(16f, 0.3f, EasePreset.OutCubic);

// Tween margin (uniform)
layout.TweenMargin(20f, 0.4f);

// Tween margin (per-side)
layout.TweenMargin(new Spacing(10, 20, 10, 20), 0.4f);

// Tween padding (uniform)
layout.TweenPadding(16f, 0.3f);

// Tween padding (per-side)
layout.TweenPadding(new Spacing(8, 8, 12, 12), 0.3f);

// With custom AnimationCurve
layout.TweenWidth(400f, 0.5f, myCustomCurve);
```

### Controlling Tweens

```csharp
ITweenHandle handle = layout.TweenWidth(300f, 0.5f);
handle.Play();
handle.Pause();
handle.Stop();
handle.Complete();  // Jump to end value
```

## Available Extension Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `TweenWidth` | `(float end, float duration, EasePreset, Action onComplete)` | Animate width |
| `TweenWidth` | `(float end, float duration, AnimationCurve, Action onComplete)` | Width with custom curve |
| `TweenHeight` | `(float end, float duration, EasePreset, Action onComplete)` | Animate height |
| `TweenHeight` | `(float end, float duration, AnimationCurve, Action onComplete)` | Height with custom curve |
| `TweenSize` | `(Vector2 end, float duration, EasePreset, Action onComplete)` | Animate both axes |
| `TweenGap` | `(float end, float duration, EasePreset, Action onComplete)` | Animate gap |
| `TweenMargin` | `(Spacing end, float duration, EasePreset, Action onComplete)` | Animate margin (per-side) |
| `TweenMargin` | `(float uniform, float duration, EasePreset, Action onComplete)` | Animate margin (uniform) |
| `TweenPadding` | `(Spacing end, float duration, EasePreset, Action onComplete)` | Animate padding (per-side) |
| `TweenPadding` | `(float uniform, float duration, EasePreset, Action onComplete)` | Animate padding (uniform) |

All methods default to `EasePreset.OutQuad` if no easing is specified.

## Tween Components (Inspector)

### AutoLayoutTweenSize

Add to any `AutoLayout` GameObject. Animates Width and/or Height from Inspector.

### AutoLayoutTweenGap

Animates the Gap property.

### AutoLayoutTweenMargin

Animates Margin (all four sides).

### AutoLayoutTweenPadding

Animates Padding (all four sides).

### AutoLayoutTweenSequence

Chains multiple tweens in sequence. Add child tween components and configure the order.

## Tween Provider

All tweening routes through `AutoLayoutTweenSettings.Provider`:

```csharp
// Check if a tween provider is available
if (AutoLayoutTweenSettings.HasProvider)
{
    // Provider is ready
}
```

The built-in `BuiltInTweenProvider` is registered automatically. Custom providers can implement `IAutoLayoutTweenProvider`.

## Ease Presets

| Preset | Description |
|--------|-------------|
| `Linear` | No easing |
| `InQuad` / `OutQuad` / `InOutQuad` | Quadratic |
| `InCubic` / `OutCubic` / `InOutCubic` | Cubic |
| `InExpo` / `OutExpo` / `InOutExpo` | Exponential |
| `InBack` / `OutBack` / `InOutBack` | Overshoot |
| `InBounce` / `OutBounce` / `InOutBounce` | Bounce |
| `InElastic` / `OutElastic` / `InOutElastic` | Elastic |

## ITweenHandle

| Method | Description |
|--------|-------------|
| `Play()` | Start or resume playback |
| `Pause()` | Pause playback |
| `Stop()` | Stop and reset |
| `Complete()` | Jump to end value immediately |

## Notes

- All tween methods return `ITweenHandle` for playback control.
- Tweens mark `DirtyType.FullRecalc` on the AutoLayout component each frame to trigger relayout.
- You can use `AnimationCurve` for custom easing via the overloads.
- The tween system is decoupled from specific animation libraries via `IAutoLayoutTweenProvider`.
