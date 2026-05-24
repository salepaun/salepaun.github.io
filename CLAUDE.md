# salepaun.github.io — Astro Starlight docs site

Documentation site for **AutoLayout PRO**, a Figma-like Unity UI layout engine. Live at https://autolayoutpro.com/.

## Stack

- **Astro 5** + **Starlight 0.30** — content collections, MDX, responsive sidebar, dark/light mode
- **Pagefind** — client-side search, indexed at build time
- **Expressive Code** — syntax highlighting (GitHub Dark + Light themes)
- **GitHub Actions → GitHub Pages** — auto-deploy on push to `master`

## Quick reference

| Command | What it does |
|---|---|
| `npm install` | Install deps (one-time) |
| `npm run dev` | Local dev server at http://localhost:4321/ |
| `npm run build` | Build to `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `node scripts/build-og-image.mjs` | Re-generate `public/og-image.png` from the SVG |

## Project layout

```
.
├── astro.config.mjs            Site, sidebar, branding, edit-link, OG meta
├── public/
│   ├── favicon.svg / logo.svg  Figma-style icon (4-color rect logo)
│   ├── og-image.svg/png        Social-preview image
│   └── CNAME                   autolayoutpro.com
├── src/
│   ├── content.config.ts       Starlight content collection setup
│   ├── content/docs/           ALL Markdown source — sidebar maps to filenames
│   │   ├── index.mdx           Landing page (hero + feature cards)
│   │   ├── tutorials/          11 worked examples (Toolbar, WhatsApp Chat, Ability Wheel, etc.)
│   │   └── *.md                17 reference pages + faq + reporting-bugs + 404
│   └── styles/custom.css       Figma palette overrides
└── .github/workflows/deploy.yml  Build + Pages deploy
```

## Sidebar groups (declared in `astro.config.mjs`)

- **Getting Started** — `getting-started.md`
- **Tutorials** — 11 worked examples (`tutorials/*.md`)
- **Core Layout** — Overview, Sizing, RowColumn, Grid, Spacing, Alignment, Absolute, CustomLayouts
- **Builders** — AutoUI
- **Components** — ScrollView, ListView, GridView, Carousel, Dropdown, ProgressBar, Tweening
- **Support** — FAQ, Reporting Bugs, Browse Open Issues (external)

Adding a new doc means: drop the `.md` file into `src/content/docs/` (or `tutorials/`) AND add a `{ slug: 'your-slug' }` entry under the right group in `astro.config.mjs`.

## Frontmatter convention

```yaml
---
title: Sizing
description: Six sizing modes — used as <meta description> + OG description.
sidebar:
  order: 11        # numerical sort within the sidebar group
---
```

## Internal links

Use relative `.md` paths between docs: `[Sizing](sizing.md)`. Starlight resolves these to URLs at build time. Don't link to absolute URLs for in-site pages — relative paths get the cross-repo edit-link infrastructure for free.

## Related repositories

The AutoLayout PRO ecosystem spans three local repos under `/Users/salepaun/Git/unity/`.

### `auto_layout` — Unity package source · **PRIVATE**

- **Local:** `/Users/salepaun/Git/unity/auto_layout`
- **Remote:** `git@github.com:salepaun/auto_layout.git`
- **Role:** the Unity package itself. Source code, demos, tests, package exporter.
- **Cross-link:** the in-editor "Report a Bug…" CONTEXT menu (in `Assets/AutoLayoutPRO/Editor/Tools/Welcome/BugReporter.cs`) opens an issue on the issues repo with `layout-yaml` pre-filled — the field IDs must match `bug_report.yml` in the issues repo.

### `autolayoutpro-issues` — Public bug tracker · **PUBLIC**

- **Local:** `/Users/salepaun/Git/unity/autolayoutpro-issues`
- **Remote:** `git@github.com:salepaun/autolayoutpro-issues.git`
- **URL:** https://github.com/salepaun/autolayoutpro-issues
- **Role:** public issue tracker since `auto_layout` is private. Issue templates pre-fill the bug-report fields the editor button targets.
- **Linked from this site:** sidebar Support group ("Browse Open Issues"), header GitHub icon, landing page CTA.

## Cross-repo workflows

| Action | Where |
|---|---|
| Write/edit any doc | **Here**, `src/content/docs/<slug>.md`. Push to master → live in ~2 min. |
| Update sidebar | `astro.config.mjs` sidebar config |
| Update brand colors | `src/styles/custom.css` |
| Update OG image | `public/og-image.svg` then `node scripts/build-og-image.mjs` |
| Edit issue template fields | `autolayoutpro-issues/.github/ISSUE_TEMPLATE/bug_report.yml` (don't change field IDs without coordinating with `BugReporter.cs` in the package repo) |
| Change live domain | `public/CNAME` + `astro.config.mjs` (`site:` field) + GitHub repo settings → Pages |

## When working in this repo

Pure docs work — no Unity, no C#. The only Unity reference is via screenshots / GIFs (none yet recorded). Tutorials are designed with the GIF placement in mind: each tutorial's "Inspector approach" `<Aside>` is the storyboard for a future GIF.
