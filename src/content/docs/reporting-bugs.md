---
title: Reporting Bugs
description: How to file a bug report — including the one-click in-editor button that attaches your layout's YAML automatically.
sidebar:
  order: 90
---

Bug reports go to the public **[autolayoutpro-issues](https://github.com/salepaun/autolayoutpro-issues)** repository. The main package source is private; the issue tracker is the canonical channel for bug reports and feature requests.

## Fastest path: the AutoLayout component's gear menu

When the bug is in a specific layout, **right-click the AutoLayout component header** in the Inspector (or use the gear / 3-dot menu on the right of the header). Two items are available:

| Menu item | What it does |
|---|---|
| **Report a Bug…** | Opens a new GitHub issue with the YAML of *this component's subtree* pre-filled, plus your AutoLayout PRO version, Unity version, and editor platform. Falls back to clipboard for very large subtrees. |
| **Copy Layout YAML** | Copies the YAML of this subtree to your clipboard. Use this for sharing in chats, gists, or pasting into a manually-filed issue. |

The subtree starts at the component you clicked, so you can scope the report — right-click the AutoLayout you suspect is buggy, not the whole scene.

## Alternative: the Welcome window button

If you don't have a specific component in mind, or the bug isn't tied to a single layout:

1. In Unity, open **`Window → AutoLayout PRO → Welcome`**.
2. (Optional) Select a GameObject in the Hierarchy — the reporter walks up to its layout island root. With nothing selected, it picks the first AutoLayout root in the active scene.
3. In **Quick Links**, click **"Report a Bug"**.

Same pre-filling behavior as the component menu, just with a fuzzier root resolution.

## What gets pre-filled

| Field | Value |
|---|---|
| AutoLayout PRO version | from the package config |
| Unity version | `Application.unityVersion` |
| Platform | `Editor (macOS / Windows / Linux)` |
| Layout YAML | serialized YAML dump of the selected subtree |

You only need to describe the symptom and the reproduction steps. Everything else is filled in.

## What the YAML looks like

The `Layout YAML` field receives output from the package's `LayoutYamlSerializer` — the same format used by **Window → AutoLayout PRO → Export Layout**. A typical fragment:

```yaml
- name: Root
  type: Column
  width: { unit: Fill, value: 1 }
  height: { unit: Fill, value: 1 }
  padding: { left: 16, right: 16, top: 16, bottom: 16 }
  gap: 8
  children:
    - name: Header
      type: Row
      width: { unit: Fill, value: 1 }
      height: { unit: Hug }
      ...
```

This gives the maintainer enough information to reconstruct your layout in a clean test scene.

## Clipboard fallback for large layouts

GitHub's issue-form URL is limited to roughly 8 KB. For deep trees the YAML may not fit, in which case the button:

1. Copies the **full YAML to your clipboard**
2. Opens the issue with a placeholder in the Layout YAML field telling you to paste
3. Shows a notification dialog confirming the clipboard copy

Just paste (`Cmd/Ctrl + V`) into the Layout YAML field before submitting.

## Filing manually

If you can't use the editor button (e.g. an exception prevents the Welcome window from opening):

1. **Check the docs** — many questions are answered in the existing pages.
2. **Search [existing issues](https://github.com/salepaun/autolayoutpro-issues/issues?q=is%3Aissue)** — your bug may already be tracked.
3. **Try the latest version** — your bug may already be fixed.
4. File via the **[bug-report form](https://github.com/salepaun/autolayoutpro-issues/issues/new?template=bug_report.yml)**.

When filing manually, include:

- AutoLayout PRO version + Unity version + platform
- A **minimal reproduction** scene (zip the project, or describe the steps to build one from scratch)
- **Exact console output** (full stack trace, not the headline)
- **Screenshots or a short video** of the unexpected behavior
- **Layout YAML** — easiest path is to right-click the AutoLayout component → **Copy Layout YAML**, then paste into the issue's Layout YAML field

## Feature requests / ideas

No structured form, no required fields. Just open an issue and describe the situation in your own words — what you're trying to build and where AutoLayout PRO got in your way. Use the **[feature-request template](https://github.com/salepaun/autolayoutpro-issues/issues/new?template=feature_request.yml)** if you'd like the prompt, or [start from a blank issue](https://github.com/salepaun/autolayoutpro-issues/issues/new). Both are fine.

Lead with the use case ("I'm trying to build X and current API doesn't support Y") rather than a proposed solution — I can often suggest a workaround or a smaller API addition than you'd reach for.

Prefer email for longer or private conversations? `salepaun@autolayoutpro.com`. For source licensing, SLA support, or sponsored feature work, see [Enterprise](/enterprise/).

## Response time

This is a one-person project. Triage happens in batches; please be patient. Issues with **clean repros and layout YAML attached** get prioritised — the bug-report button delivers both for free.
