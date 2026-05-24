---
title: Why AutoLayout?
description: What problem AutoLayout solves, how it relates to Unity's LayoutGroup stack and UI Toolkit, and why the sizing model looks the way it does.
sidebar:
  order: 0
---

If you've used Figma, you already know what you want your Unity UI to look like. The hard part is getting from that mockup to a Canvas hierarchy. That's the gap I built AutoLayout PRO to close.

## The problem with vanilla uGUI

Unity's built-in layout stack (`LayoutGroup` + `ContentSizeFitter` + `LayoutElement`) speaks a different language than your design tool. You think in Hug content, Fill container, Fixed size, Percent of parent. Unity gives you anchors, pivots, `minWidth`, `preferredWidth`, `flexibleWidth`, `controlChildSize`, `childForceExpandWidth`. To translate one to the other, you stack three components on every element and hope the resolution order does what you intended.

A few patterns are flat-out tedious without writing your own components:

- A button that hugs its text but never falls below 96px wide.
- A row where the title hugs, the spacer fills, and the price stays its natural width, with one gap between all three.
- A list that auto-sizes to its content and stops at a max height before scrolling kicks in.

You can build all of these with the stock stack. You probably have. The cost is a layered configuration that's hard to predict, hard to teach, and brittle when designs change.

## Why not just use UI Toolkit?

UI Toolkit (formerly UIElements) is a real answer to the same problem. A flexbox-based layout system, USS for styling, UXML for hierarchy. It's also a different UI system. If you've already shipped a uGUI project, switching means:

- Learning USS, UXML, and the data-binding model from scratch.
- Porting every screen, every custom component, every tween, every prefab.
- Replacing your shader-based UI effects with whatever UI Toolkit's renderer supports.
- Re-onboarding designers who already know Unity uGUI.

For some teams that's the right move. Across the studios I worked at before building this, the answer kept being something else.

Every studio I worked at had a custom UI framework. Some sat on top of uGUI, the way AutoLayout does. Some were completely separate, with their own renderer, input layer, and component model, the way UI Toolkit is separate. The custom ones were almost always better to work in than native uGUI. The reason was always the same: better layout controls. Hug/Fill/Stretch primitives that matched how I thought about a UI, not anchors + min + preferred + flexible smeared across three components. Same screen, fraction of the time.

AutoLayout is built on that observation. uGUI's renderer, input system, and component ecosystem are fine; the layout layer is what's painful. Replace just that layer with the right primitives and uGUI becomes good. You don't need to leave the framework. You need to fix the part that's broken.

UI Toolkit is one path (separate framework, full rewrite). AutoLayout is the other (same framework, better layout). Pick whichever fits your project.

## How AutoLayout fits in

AutoLayout is one MonoBehaviour you add to a UI GameObject. On screens where you use it, it replaces the `LayoutGroup` + `ContentSizeFitter` + `LayoutElement` stack. On screens where you don't, your existing UI keeps working. The two coexist on the same Canvas.

This means you can:

- **One screen at a time.** Pick the worst-offending layout in your project, replace it with AutoLayout, leave the rest alone. The painful screens get the upgrade; the boring ones don't.
- **End-to-end on new UI.** No `LayoutGroup` anywhere. Full Figma sizing model, real Grid, virtualized List/Carousel/Dropdown.
- **Mix the two.** Outer layout in `LayoutGroup`, inner in AutoLayout, or vice versa. They don't fight.

There's no flag to flip, no migration path you have to commit to. You install the package and start using it where you need it.

## The sizing model, in one table

| You want | Figma calls it | AutoLayout calls it | uGUI equivalent |
|---|---|---|---|
| Wrap to content | Hug contents | `Hug` / `WidthHug()` | `ContentSizeFitter` |
| Fill remaining space | Fill container | `Fill` / `WidthFill()` | `flexibleWidth` on `LayoutElement` (sort of) |
| Specific size | Fixed | `Pixels` / `Width(120)` | `RectTransform.sizeDelta` |
| Fraction of parent | (no built-in equivalent) | `Percentage` / `WidthPercent(50)` | Anchor stretch + offsets |
| Locked aspect ratio | Constraint plugin | `AspectRatio` / `WidthAspect(16f/9f)` | `AspectRatioFitter` |
| Natural text size | Auto | `TextSize` | `preferredWidth` on TMP |

Every property is set per-axis, on each element, and the engine does the rest. Sizes propagate bottom-up (Hug, TextSize); space distributes top-down (Fill, Percent); positions resolve last. Three deterministic phases, all in Burst.

## Lineage

The Hug / Fill / Stretch model isn't novel and I'm not claiming it is. The same primitives showed up in [Subform](https://subformapp.com/) (Kevin Lynagh's experimental layout tool) years ago, and ship today in the Rust [Morphorm](https://github.com/vizia/morphorm) library. Same vocabulary, similar algorithm. The model predates Figma's Auto Layout feature; Figma is what made it mainstream.

AutoLayout brings that model to Unity uGUI specifically, with:

- A Burst-compiled core for performance on large UIs.
- Incremental rebuilds via LayoutIslands so a leaf change doesn't recompute the world.
- Tight Unity Editor integration (gizmos, inspector, smart library, bug-report flow).
- A code-first builder (`AutoUI`) that handles all the RectTransform plumbing.

If you've used a layout system that thinks in Hug/Fill (Flutter, modern design tools, certain web frameworks), the model will feel familiar. If you haven't, [Sizing → Sizing modes](/sizing/#sizing-modes) walks through every mode with examples.

## What's next

- [Getting Started](/getting-started/) — install, run the demos, write your first layout.
- [Overview](/overview/) — the full property reference.
- [Roadmap](/roadmap/) — what's shipping next, and how to tell me what to build.
