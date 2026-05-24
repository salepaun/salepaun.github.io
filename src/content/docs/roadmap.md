---
title: Roadmap
description: What's shipping in AutoLayout PRO, what's in design, what's planned, and how to tell me what to build next.
sidebar:
  order: 20
---

I'm one developer building AutoLayout PRO. This page is honest about where things stand: what you can use today, what I'm actively prototyping, and what's on the wishlist. If something here would unblock real work for you, [say so](#tell-me-what-to-build-next). That's how the priority list moves.

**Scope:** AutoLayout PRO is — and will stay — a **layout engine**. Adapters that put the engine in front of new hosts (UI Toolkit, IMGUI), more layout types, layout-aware animation, and a profiler that explains layout cost all belong here. Broader UI-development concerns (markup authoring, design-tool importers, full design systems) are real problems I want to help with — but they belong in separate companion products, not bolted onto the layout asset. See [Companion tools](#companion-tools-separate-products-that-integrate) below.

## Shipped today

These are part of the package and supported.

- **uGUI adapter** — Unity 2023.2 or newer, persistent NativeArray pool, incremental rebuilds via LayoutIslands.
- **Layout types** — Row, Column, Wrap, Grid, Absolute, None.
- **Sizing model** — Hug, Fill, Pixels, Percentage, AspectRatio, TextSize.
- **Grid** — template tracks, `repeat()`, column/row spans, dense auto-flow, per-item alignment override.
- **AutoUI builder** — code-first, pooled, single-use builder for constructing trees without manual GameObject setup.
- **Components** — virtualized [ListView](/list-view/) (typed `VirtualListView<T>`), [GridView](/grid-view/), [Carousel](/carousel/), [ScrollView](/scroll-view/), [Dropdown](/dropdown/), [ProgressBar](/progress-bar/), [Tweening](/tweening/).
- **Editor integration** — UIElements inspector, gizmos, Welcome window, [Report a Bug](/reporting-bugs/) with auto-filled layout YAML.

## In design (part of the package)

Active prototyping, not yet in a release. Both items extend the layout engine to a new Unity host without changing the math.

- **UI Toolkit adapter.** Drive `VisualElement` style/layout using the same headless engine. Useful if you want the Hug/Fill model inside UI Toolkit without USS's flexbox. This is the primary in-design item.
- **IMGUI adapter.** Wire the same engine into Unity's IMGUI editor-tools layer for editor windows and inspectors. Same algorithm, different host.

The engine is platform-agnostic — both adapters share the same core code as the uGUI one. The work is in the gather/apply layers, not the math.

## On the roadmap (part of the package)

What I want to build next inside AutoLayout PRO itself, all staying within the layout-engine remit. Roughly in priority order. None of these are committed dates.

- **Performance tooling.** A profiler overlay that highlights which islands rebuilt, why, and how long each phase took. The dirty-tracking metrics already exist internally; the work is exposing them in the Editor as a panel you can leave open.
- **Animation primitives beyond Tweening.** Layout-aware transitions: animating the addition or removal of a child without snapping; cross-fading between two layout configurations; spring-physics-driven moves. Some of this is doable with the current Tweening stack, but it should be easier.
- **More custom layouts.** Radial, polar, hex, list-with-headers, masonry. Patterns that don't fit Row/Column/Grid but show up often enough to ship.
- **Minimal first-party component set, to some extent.** Buttons, panels, modals, and the handful of primitives needed to demo AutoLayout's behavior at scale, built on the layout engine itself. *Not* a styled or themed design system — that's a separate problem, addressed by the companion track below.

## Companion tools (separate products that integrate)

These aren't part of the AutoLayout PRO asset and won't be folded into it. They're things I'm planning to build to help with **other aspects of UI development** in Unity — areas that sit outside layout but where I think a well-shaped tool would help. Each would ship as its own product with first-class AutoLayout PRO integration (read/write AutoLayout trees, share the sizing model, plug into the same editor surfaces).

- **XML / markup-based layout authoring.** AutoUI is great if you like building UI in code, less great if you don't. A markup format that compiles to AutoLayout trees would unlock two things: (1) AI tools (Claude, Cursor, Copilot) can generate full layouts without writing builder code, which is much easier to review than C#; (2) non-coders can author layouts directly. The format would be a thin layer over AutoUI; same primitives, different syntax.
- **Figma importer.** The sizing model is already aligned with Figma's Auto Layout, so importing should be tractable: read the Figma file, walk the auto-layout tree, emit AutoLayout components or markup. Not a 1:1 visual-fidelity tool — a *layout-fidelity* tool that gets you 80% of the way and leaves you to wire up data and styling.
- **Full styled / themed component library.** A real design system — themeable buttons, form controls, modals, tabs, accordions, toasts, navigation bars — built on AutoLayout PRO but shipped separately so the layout asset stays focused. The minimal set in the asset itself stays small; the comprehensive library lives here.

## Tell me what to build next

I'm one developer. The roadmap above is what *I* think is most valuable. You know your project better than I do; what would actually unblock you might not be on this list.

No form to fill out, no template — just tell me what's hard about your real UI:

- **Drop a note** on the [issue tracker](https://github.com/salepaun/autolayoutpro-issues/issues/new). One sentence is fine. A paragraph is fine. The only thing that matters is that I can tell what you're trying to build and where AutoLayout PRO got in your way.
- **Comment on an existing issue.** A "+1, this would save me a week" on someone else's request is a strong signal. I prioritize issues with multiple voices.
- **Email me at salepaun@autolayoutpro.com.** For longer conversations, NDA'd projects, or "would you build X if my company sponsored it?" See also [Enterprise](/enterprise/) if your team needs source licensing, SLA support, or sponsored work.
- **Found a bug?** Right-click the AutoLayout component → **Report a Bug**. Auto-fills the layout YAML so I can reproduce. See [Reporting Bugs](/reporting-bugs/).

I read every issue and every email. Tone matters less than the underlying problem; a frustrated "this is broken because…" is more useful to me than a polite vague request. Tell me what's hard about your real UI, and I'll tell you whether it's a fix, a workaround, or something I should build next.
