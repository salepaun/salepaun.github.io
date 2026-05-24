---
title: Unity Animator Support
description: Animate AutoLayout's layout properties (width, padding, gap, …) with Unity's Animator and the layout reflows every frame — no glue code.
sidebar:
  order: 36
---

AutoLayout responds to Unity's Animator the same way `LayoutGroup` does: drop an Animator on the GameObject, record curves against the AutoLayout fields you want to animate, and the layout reflows on every Animator update. Play mode *and* the Animation Window scrub-preview in the Editor both work.

```text
Animator clip ──▶ writes m_Linear.Gap ──▶ OnDidApplyAnimationProperties
                                        ─▶ AutoLayout diffs against snapshot
                                        ─▶ marks PositionX dirty
                                        ─▶ adapter reflows children
```

## What you can animate

Anything Unity's Animator can keyframe on the `AutoLayout` component:

| Category | Fields (Animation Window property path) |
|---|---|
| **Size** | `m_Width.Value`, `m_Width.Type`, `m_Height.Value`, `m_Height.Type` |
| **Spacing** | `m_Padding.Left/Right/Top/Bottom`, `m_Margin.Left/Right/Top/Bottom` |
| **Linear** | `m_Linear.Gap`, `m_Linear.WrapGap`, `m_Linear.MainAxisAlign`, `m_Linear.CrossAxisAlign`, `m_Linear.Wrap`, `m_Linear.ReverseChildren` |
| **Grid** | `m_Grid.Columns`, `m_Grid.Rows`, `m_Grid.ColumnGap`, `m_Grid.RowGap`, `m_Grid.Flow`, `m_Grid.HorizontalAlign`, `m_Grid.VerticalAlign` |
| **Grid item** | `m_GridItem.Column`, `m_GridItem.Row`, `m_GridItem.ColumnSpan`, `m_GridItem.RowSpan` |
| **Constraints** | `m_Constraints.MinWidth/MaxWidth/MinHeight/MaxHeight` |
| **Structural** | `m_LayoutType`, `m_Placement`, `m_Visibility`, `m_Overflow`, `m_LayoutOrder` |

Float curves work as expected. Enum fields like `m_LayoutType` and `m_Visibility` can be keyframed with discrete (`Tangent → Constant`) curves.

## Setting up a clip

1. Add an `Animator` to the GameObject that has `AutoLayout`.
2. Create an `AnimationClip` (or open the Animation Window with the GO selected).
3. Pick the property you want to animate from the **Add Property** dropdown — Unity exposes the serialized fields under the AutoLayout entry.
4. Record curves. Loop the clip. Done.

Everything that follows is just nice-to-haves.

## Animate AutoLayout fields, not the RectTransform

AutoLayout drives the RectTransform's `sizeDelta` and `anchoredPosition` via [`DrivenRectTransformTracker`](https://docs.unity3d.com/ScriptReference/DrivenRectTransformTracker.html). If you animate the RectTransform directly, AutoLayout's next reflow overwrites the keyframe.

**Wrong:**

```text
RectTransform.m_SizeDelta.x  ───▶ overwritten by AutoLayout
RectTransform.m_AnchoredPosition.x ───▶ overwritten by AutoLayout
```

**Right:**

```text
AutoLayout.m_Width.Value  ───▶ AutoLayout reads this and applies to sizeDelta
AutoLayout.m_Margin.Left  ───▶ AutoLayout reads this and applies to anchoredPosition
```

If you need to animate a property AutoLayout doesn't control (scale, rotation, color), keep using the RectTransform / Image / TMP_Text bindings — those aren't driven.

## Animator vs declarative Transitions

AutoLayout has a [declarative Transitions](/transitions) system for CSS-style animations that fire when you change a property from code. Per property, **pick one or the other** — not both:

| | Use **Animator** when… | Use **Transitions** when… |
|---|---|---|
| Workflow | You're a designer who lives in the Animation Window | You're a programmer writing setter-driven UI |
| Trigger | Animator state transitions, timeline events | Property setter from script |
| Curve authoring | Visual, key-framed | `EasePreset` / `AnimationCurve` per rule |
| What it animates | Inputs *and* outputs (anything serialized) | Engine-aware: Width/Height even reflow siblings during the tween |

If you keyframe `m_Linear.Gap` in an Animator clip **and** set a Transition rule on `Gap`, the Animator wins — it writes the field directly, bypassing the setter the transition system intercepts.

## Calling from non-Animator animation libraries

DOTween, FairyGUI, custom tween systems — anything that mutates the private backing fields directly — won't trigger a layout rebuild by itself. Call the public hook after your write:

```csharp
DOTween.To(() => layout.m_Linear.Gap, x =>
{
    // Direct field write via reflection or unsafe code — bypasses setter.
    SetGapFieldDirectly(layout, x);
    layout.NotifyAnimatorPropertiesApplied();
}, 50f, 0.4f);
```

For 95% of DOTween use cases you don't need this — just animate through the public setter (`layout.Gap = x`), which already calls `MarkLayoutDirty`. `NotifyAnimatorPropertiesApplied` is the escape hatch when something else (typically a clip-driven system) writes the field for you.

## Performance

The hook fires every frame the Animator is updating the component — typically 60Hz. Each fire runs a structural diff (~50 field comparisons) against a per-component snapshot, then emits the **narrowest** `DirtyType` mask covering the changes (`SizeX`, `LayoutSettings`, `PositionY`, …). On clip plateaus where the curve produces an unchanged value, the diff short-circuits and no dirty mark is emitted — the loop pause cost is just the comparison itself.

Sizing-type flips (e.g. `Fill` ↔ `Pixels` via a discrete curve) route through the dependency-flag invalidation path so sibling Fill redistribution stays coherent. Structural flips (`LayoutType`, `Placement`, `Visibility.Collapsed`) escalate to a full island recalc.

## Edit-mode preview

`OnDidApplyAnimationProperties` fires in the Editor too — the Animation Window scrub-preview shows the layout reflowing in real time as you drag the timeline. No need to enter Play mode just to check that a clip looks right.

## Demo scene

`Tools → AutoLayout PRO → Generate Animator Demo Scene` builds a minimal example: a Row container with `m_Linear.Gap` and `m_Padding.Left` pulsing on a 2-second loop. Open the generated scene and press Play to see the breathe effect.
