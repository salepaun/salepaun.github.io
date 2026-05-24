---
title: Changelog
description: Release notes for AutoLayout PRO — what changed, what's new, what's deprecated.
sidebar:
  order: 95
---

Release notes for the AutoLayout PRO Unity package. The version pill in the footer of every page tells you which release these docs target.

> **Offline copy.** A single PDF of the entire docs site is published with each release: **[Download AutoLayoutPRO-v1.0.0.pdf](https://autolayoutpro.com/AutoLayoutPRO-v1.0.0.pdf)** (~10 MB, 200+ pages). Generated via `npm run pdf` and shipped alongside the build artifact.

> **Versioning policy.** Until v2.0, AutoLayout PRO ships single-version docs. Releases are additive or backwards-compatible by default; breaking changes go in a major version with a dedicated migration page. When v2 lands, this site will gain a version dropdown via [`starlight-versions`](https://github.com/HiDeoo/starlight-versions) — older docs accessible at e.g. `/v1/sizing/`.

## v1.0.0 — Public release (current)

The first public release. API surface is locked under semantic versioning from here on.

### Core

- Three-phase layout pipeline (Gather / Intrinsic / Distribute+Position) with Burst-compiled kernels
- Six sizing modes: Pixels, Hug, Fill, Percentage, AspectRatio, TextSize
- All layout types: Row · Column · Grid · Wrap · Absolute · None · Custom
- Incremental rebuilds via LayoutIslands and per-node dirty tracking
- Zero-GC contract on all hot paths

### Code-first builder: AutoUI

- `AutoUI.Create()` entry point + `AutoUI.Row()`/`Column()`/`Grid()`/etc. shortcuts
- `LayoutBuilder` is a `partial` class split across 8 topic files
- Pooled — after warmup, building a 100-node UI is approximately zero allocations
- `Build()` re-entry guard, default-Absolute footgun warning
- Composition: `Children(params)`, `Children(IEnumerable)`, `Children(int, Func)`, `Child`, `If`, `Each<T>`
- Visuals: `Background(Color/Sprite)`, `Icon`, `RawImage`, `Alpha`
- `Button(label, action)` one-liner, `CaptureLayout(Action<AutoLayout>)` typed capture

### Components

- **ScrollView** — inertia, elastic bounds, snap-to-page
- **ListView** — virtualized, multi-prefab, zero-GC `VirtualListView<T>` generic
- **GridView** — virtualized, uniform / non-uniform cell sizing
- **Carousel** — slide / loop / fade modes, snap-to-center
- **Dropdown** — popup options selector with optional search filtering
- **ProgressBar** — Linear (any direction) + Radial
- **Tweening** — extension methods on AutoLayout (TweenWidth/Size/Gap/Padding/Margin), CanvasGroup alpha helper

### Editor tooling

- Welcome window with Overview, Examples, Docs, and Get Started tabs
- Smart Library widget palette
- "Report a Bug…" + "Copy Layout YAML" CONTEXT menu items on AutoLayout components
- In-editor markdown doc renderer with C# syntax highlighting (legacy — being phased out in favor of this site)
- Layout YAML serialization / deserialization (`LayoutExporter`, `LayoutYamlSerializer`)

### Distribution

- UPM via `package.json`
- Legacy `.unitypackage` via `AutoLayoutPackageExporter.cs`
- Public bug tracker: [autolayoutpro-issues](https://github.com/salepaun/autolayoutpro-issues)
- Documentation site (this site) at https://autolayoutpro.com/

### Recent updates (May 2026)

- **Added: Transitions** — declarative CSS-style property animations. New `LayoutTransition` rules on every `AutoLayout` component, `.Transition(targets, duration, ease)` builder method, and `TransitionTarget` flag enum (`Width / Height / Position / Gap / Padding / Margin / Opacity / Size / Spacing / All`). See [Transitions](/transitions/).
- **Added: `CrossAxisItemAlign`** — dedicated enum for per-item cross-axis override in Row/Column. Replaces the previous reuse of `GridAlignment` (intentionally no `Stretch` value — set the cross-axis size to `Fill` or `Percentage` instead). See [Row & Column → Linear item](/row-column/#linear-item).
- **Changed: AutoUI widget configure lambdas now optional** — `.ListView(...)`, `.Carousel(...)`, `.Dropdown(...)`, `.ProgressBar(...)`, `.GridView(...)` all accept an optional `configure` lambda. The fluent `.End()` chain has been removed; configure widgets inside the lambda or via a captured reference.
- **Docs: tutorial set trimmed to three essentials** — Toolbar, Settings Menu, Game HUD. The other tutorials have been removed pending a redesigned set; see git history for the previous versions.

### Known limitations

- `Documentation~/site/` (offline-shipping docs inside the package) is not active for v1.0 — docs are web-only
- Some inspector polish pending for the Smart Library

---

## How to upgrade

For future major bumps (v1.x → v2): a dedicated **Migrating to v2** page will appear in the sidebar with side-by-side before/after examples.

For minor releases (v1.x → v1.y) within the v1 line: re-import via UPM or `.unitypackage`; back up your project first as a precaution.

---

## Reporting issues against a specific version

The [in-editor "Report a Bug" button](/reporting-bugs/) auto-fills the version field with whatever's set in your installed package config. If you're filing manually, include the version explicitly — it's the first piece of information triage needs.
