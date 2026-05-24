# salepaun.github.io

Documentation site for [AutoLayout PRO](https://github.com/salepaun/auto_layout) — built with [Astro Starlight](https://starlight.astro.build/) and deployed to GitHub Pages.

**Live site:** https://autolayoutpro.com/

## Stack

- **Astro 5** + **Starlight 0.30** — content collections, MDX support, responsive sidebar, dark/light mode
- **Pagefind** — client-side search, indexed at build time, no external services
- **Expressive Code** — syntax highlighting (GitHub Dark/Light themes)
- **Pages-by-GitHub Actions** — auto-deploy on push to `master`

## Project structure

```
.
├── astro.config.mjs            Site, sidebar, branding, edit-link
├── public/
│   ├── favicon.svg             Figma-style icon (transparent bg)
│   └── logo.svg                Figma-style icon (with dark bg)
├── src/
│   ├── content.config.ts       Starlight content collection setup
│   ├── content/docs/           Markdown source — 17 docs + index.mdx landing page
│   └── styles/custom.css       Figma palette overrides
└── .github/workflows/deploy.yml  Build + Pages deploy
```

## Local development

```bash
npm install
npm run dev          # http://localhost:4321/
npm run build        # outputs static site to dist/
npm run preview      # serve dist/ locally
npm run pdf          # generates dist/AutoLayoutPRO-v<version>.pdf (~10MB, 200+ pages)
```

## PDF generation

`npm run pdf` produces a single PDF of the entire site for offline distribution
(Asset Store, archive, etc.). The script:

1. Boots `astro preview` on port 4322
2. Renders each page in headless Chromium with print-friendly CSS
3. Concatenates the per-page PDFs via `pdf-lib`
4. Outputs `dist/AutoLayoutPRO-v<version>.pdf` (filename pulls version from
   [`src/version.ts`](./src/version.ts) so each release ships a versioned artifact)

The script is at [`scripts/build-pdf.mjs`](./scripts/build-pdf.mjs); the page
list and order live there as a constant — add new docs to that array when you
want them included in the PDF.

Requires Chromium (`npx playwright install chromium`, ~165 MB download). Only
needed for PDF generation, not for site builds.

## Editing content

All docs are plain Markdown with [Starlight frontmatter](https://starlight.astro.build/reference/frontmatter/):

```markdown
---
title: Sizing
description: Six sizing modes...
sidebar:
  order: 11
---

## Body of the doc
```

Each Markdown file lives at `src/content/docs/<slug>.md`. The slug becomes the URL: `src/content/docs/sizing.md` → `/sizing/`.

Sidebar grouping is **declared explicitly** in [`astro.config.mjs`](./astro.config.mjs) — adding a new doc means:
1. Drop the `.md` file into `src/content/docs/`
2. Add a `{ slug: 'your-slug' }` entry under the right sidebar group in `astro.config.mjs`

Internal links between docs use relative `.md` paths (e.g. `[Sizing](sizing.md)`) — Starlight resolves these to the right URLs at build time.

## Deployment

Pushing to `master` triggers `.github/workflows/deploy.yml`, which:
1. Installs deps with `npm ci`
2. Runs `astro build` → `dist/`
3. Uploads `dist/` as a Pages artifact
4. Deploys via `actions/deploy-pages@v4`

GitHub repository settings must have **Pages → Build and deployment → Source** set to **GitHub Actions** (not "Deploy from a branch").

### Custom domain

The site serves at `autolayoutpro.com` via the `CNAME` file in [`public/CNAME`](./public/CNAME). Astro copies anything in `public/` into `dist/`, so each deploy preserves the custom-domain configuration. If you ever want to verify or change the domain, edit `public/CNAME` and redeploy.

DNS for the apex domain should point to GitHub Pages' four `A` records:
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```
plus an optional `CNAME` record for `www.autolayoutpro.com` → `salepaun.github.io`.

## Brand

The icon is the Figma-style 4-color rectangle layout used throughout AutoLayout PRO (Editor inspector, Welcome window, Smart Library). Palette draws on the same source — purple (#A259FF) primary accent, with orange / green / cyan from the Figma logo as secondary highlights.

Typography: **Inter** for prose, **JetBrains Mono** for code.
