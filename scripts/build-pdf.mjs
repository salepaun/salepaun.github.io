// Generate a single PDF from the built Starlight site by rendering each page
// in headless Chromium and concatenating the per-page PDFs.
//
// Usage:
//   npm run build      # produces dist/
//   npm run pdf        # produces dist/AutoLayoutPRO-v<version>.pdf
//
// The output filename embeds the version from src/version.ts so successive
// releases produce side-by-side artifacts (e.g. AutoLayoutPRO-v0.9.0.pdf,
// AutoLayoutPRO-v1.0.0.pdf).

import { chromium } from 'playwright';
import { PDFDocument, PDFName, PDFArray, PDFNumber, PDFNull, PDFDict, PDFString, PDFHexString } from 'pdf-lib';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const DIST_DIR = resolve(REPO_ROOT, 'dist');
const PORT = 4322;
const BASE_URL = `http://localhost:${PORT}`;
// Public URL the PDF should link to. All internal `/foo/` hrefs in the rendered
// HTML get rewritten to `${PUBLIC_URL}/foo/` before printing — so links inside
// the PDF actually work when the reader clicks them in a PDF viewer.
const PUBLIC_URL = 'https://autolayoutpro.com';

// ---- Pages to render, in the same order as the sidebar ----
//
// Adding a new doc means adding it here too. (Could be derived from
// astro.config.mjs sidebar in a future iteration.)
const PAGES = [
  { path: '/',                             title: 'AutoLayout PRO' },

  // Getting Started
  { path: '/getting-started/',             title: 'Getting Started' },

  // Tutorials
  { path: '/tutorials/toolbar/',           title: 'Tutorial: Toolbar' },
  { path: '/tutorials/settings-menu/',     title: 'Tutorial: Settings Menu' },
  { path: '/tutorials/inventory-grid/',    title: 'Tutorial: Inventory Grid' },
  { path: '/tutorials/modal-dialog/',      title: 'Tutorial: Modal Dialog' },
  { path: '/tutorials/tab-bar/',           title: 'Tutorial: Tab Bar' },
  { path: '/tutorials/tag-filter/',        title: 'Tutorial: Tag Filter' },
  { path: '/tutorials/notification-toast/',title: 'Tutorial: Notification Toast' },
  { path: '/tutorials/game-hud/',          title: 'Tutorial: Game HUD' },
  { path: '/tutorials/image-gallery/',     title: 'Tutorial: Image Gallery' },
  { path: '/tutorials/whatsapp-chat/',     title: 'Tutorial: WhatsApp Chat' },
  { path: '/tutorials/ability-wheel/',     title: 'Tutorial: Ability Wheel' },

  // Core Layout
  { path: '/overview/',                    title: 'AutoLayout — Overview' },
  { path: '/sizing/',                      title: 'Sizing' },
  { path: '/row-column/',                  title: 'Row & Column' },
  { path: '/grid/',                        title: 'Grid' },
  { path: '/spacing/',                     title: 'Spacing' },
  { path: '/alignment/',                   title: 'Alignment' },
  { path: '/absolute/',                    title: 'Absolute Positioning' },
  { path: '/custom-layouts/',              title: 'Custom Layouts' },

  // Builders
  { path: '/auto-ui/',                     title: 'AutoUI Builder' },

  // Components
  { path: '/scroll-view/',                 title: 'ScrollView' },
  { path: '/list-view/',                   title: 'ListView' },
  { path: '/grid-view/',                   title: 'GridView' },
  { path: '/carousel/',                    title: 'Carousel' },
  { path: '/dropdown/',                    title: 'Dropdown' },
  { path: '/progress-bar/',                title: 'Progress Bar' },
  { path: '/tweening/',                    title: 'Tweening' },

  // Support
  { path: '/faq/',                         title: 'FAQ' },
  { path: '/reporting-bugs/',              title: 'Reporting Bugs' },
  { path: '/changelog/',                   title: 'Changelog' },
];

// Print CSS — hide site chrome (sidebar, nav, search, mobile bits) so each page
// renders as pure content with normal page breaks. Applied after each goto.
const PRINT_CSS = `
  /* Hide site chrome */
  header.header,
  .sidebar-pane,
  starlight-menu-button,
  mobile-starlight-toc,
  .right-sidebar-container,
  starlight-tabs-restore,
  .pagination-links,
  .copy { display: none !important; }

  /* Strip layout offsets so content fills the page */
  .main-frame { padding-top: 0 !important; padding-inline-start: 0 !important; }
  .main-pane  { width: 100% !important; max-width: none !important; }
  body        { background: white !important; color: #111 !important; }
  .content    { max-width: none !important; }

  /* Force light-on-white for print regardless of theme */
  :root, [data-theme="dark"] {
    --sl-color-bg: #ffffff;
    --sl-color-text: #1a1a1a;
    --sl-color-text-accent: #5b1ed6;
    --sl-color-bg-sidebar: #ffffff;
    --sl-color-bg-nav: #ffffff;
    color-scheme: light;
  }

  /* Page breaks before top-level headings (each H1 starts a fresh page after the first) */
  h1 { page-break-before: always; }
  h1:first-of-type { page-break-before: avoid; }

  /* Code blocks: keep on one page where possible */
  pre, .expressive-code { page-break-inside: avoid; }

  /* Tabs in PDF: show both tab panels stacked instead of one-at-a-time */
  starlight-tabs [role="tabpanel"] { display: block !important; }
  starlight-tabs [role="tabpanel"][hidden] { display: block !important; }
  starlight-tabs [role="tabpanel"]::before {
    display: block;
    content: attr(aria-labelledby);
    font-weight: 700;
    margin-top: 1.25rem;
    font-size: 0.95rem;
    color: var(--sl-color-text-accent);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  starlight-tabs [role="tablist"] { display: none !important; }
`;

async function readVersion() {
  const text = await readFile(resolve(REPO_ROOT, 'src', 'version.ts'), 'utf-8');
  const match = text.match(/PACKAGE_VERSION\s*=\s*['"]([^'"]+)['"]/);
  return match ? match[1] : 'unknown';
}

async function waitForServer(url, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch { /* not yet */ }
    await new Promise(r => setTimeout(r, 250));
  }
  throw new Error(`Preview server did not start within ${timeoutMs}ms`);
}

async function main() {
  if (!existsSync(DIST_DIR)) {
    console.error('✗ dist/ not found — run `npm run build` first.');
    process.exit(1);
  }

  const version = await readVersion();
  const outPath = resolve(DIST_DIR, `AutoLayoutPRO-v${version}.pdf`);

  // Boot Astro preview as a child process.
  console.log(`Starting preview server on :${PORT}…`);
  const server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], {
    cwd: REPO_ROOT,
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  server.stdout.on('data', () => {}); // drain to avoid backpressure

  try {
    await waitForServer(`${BASE_URL}/`);
    console.log('✓ Preview server ready');

    const browser = await chromium.launch();
    const context = await browser.newContext({ colorScheme: 'light' });
    const page = await context.newPage();

    const pdfBuffers = [];
    let i = 0;
    for (const { path, title } of PAGES) {
      i++;
      console.log(`[${i}/${PAGES.length}] ${title} (${path})`);

      await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle' });
      await page.addStyleTag({ content: PRINT_CSS });

      // Rewrite relative hrefs to absolute autolayoutpro.com URLs. The
      // post-merge step below converts in-site URLs to internal PDF GoTo
      // actions; external URLs (github.com etc.) stay as-is.
      await page.evaluate((publicUrl) => {
        for (const a of document.querySelectorAll('a[href]')) {
          const href = a.getAttribute('href');
          if (!href) continue;
          if (href.startsWith('/') && !href.startsWith('//')) {
            a.setAttribute('href', publicUrl + href);
          }
        }
      }, PUBLIC_URL);

      // Give layout a tick to settle after CSS injection
      await page.waitForTimeout(200);

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '18mm', right: '15mm', bottom: '18mm', left: '15mm' },
        displayHeaderFooter: true,
        headerTemplate: `<div></div>`,
        footerTemplate: `
          <div style="font-size:9px; width:100%; padding:0 15mm; color:#888;
                       display:flex; justify-content:space-between;">
            <span>AutoLayout PRO v${version}</span>
            <span>autolayoutpro.com</span>
            <span class="pageNumber"></span>
          </div>`,
      });
      pdfBuffers.push({ path, pdf });
    }

    await browser.close();

    // Merge per-page PDFs into one document.
    console.log('Merging…');
    const merged = await PDFDocument.create();
    merged.setTitle('AutoLayout PRO Documentation');
    merged.setAuthor('Aleksandar Paunovic');
    merged.setSubject(`AutoLayout PRO v${version} — Unity layout engine docs`);
    merged.setProducer('Astro Starlight + Playwright');

    // Track where each doc starts in the merged PDF so we can rewrite in-site
    // link annotations to internal GoTo actions.
    const slugToPage = new Map();   // canonical slug like 'sizing' → 0-based page index
    let cumulative = 0;

    for (const { path: docPath, pdf: buf } of pdfBuffers) {
      const doc = await PDFDocument.load(buf);
      const slug = canonicalSlug(docPath);
      slugToPage.set(slug, cumulative);

      const copied = await merged.copyPages(doc, doc.getPageIndices());
      copied.forEach(p => merged.addPage(p));
      cumulative += copied.length;
    }

    // Rewrite link annotations: in-site URLs → internal GoTo, external → keep.
    console.log('Rewriting cross-doc links to internal GoTo actions…');
    const stats = rewriteAnnotationsToInternal(merged, slugToPage, PUBLIC_URL);
    console.log(`  ${stats.internal} internal, ${stats.external} external, ${stats.unmatched} unmatched`);

    // Build a clickable PDF outline (Acrobat / Preview "bookmarks" sidebar).
    addOutline(merged, slugToPage, PAGES);

    const bytes = await merged.save();
    await writeFile(outPath, bytes);
    console.log(`\n✓ ${outPath} (${(bytes.length / 1024 / 1024).toFixed(2)} MB, ${merged.getPageCount()} pages)`);
  } finally {
    server.kill();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

// ===== Helpers for cross-doc link rewriting + PDF outline =====

/** Returns the canonical slug for a doc path: '/' → 'index', '/foo/bar/' → 'foo/bar'. */
function canonicalSlug(path) {
  const trimmed = path.replace(/^\/|\/$/g, '');
  return trimmed === '' ? 'index' : trimmed;
}

/**
 * Walks every link annotation in the merged PDF. If the URL points at the
 * docs site (PUBLIC_URL/<slug>/), replaces the /URI action with a /GoTo
 * action that jumps to the page where that slug starts. External URLs and
 * unmatched in-site URLs (e.g. PDF download self-link) stay as URIs.
 */
function rewriteAnnotationsToInternal(merged, slugToPage, publicUrl) {
  const stats = { internal: 0, external: 0, unmatched: 0 };
  const inSiteRe = new RegExp('^' + publicUrl.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&') + '/([^?#]*?)/?(?:[?#].*)?$');

  for (let pageIdx = 0; pageIdx < merged.getPageCount(); pageIdx++) {
    const pageNode = merged.getPage(pageIdx).node;
    const annots = pageNode.Annots();
    if (!annots) continue;

    for (const ref of annots.asArray()) {
      const annot = merged.context.lookup(ref, PDFDict);
      if (!annot) continue;
      const a = annot.get(PDFName.of('A'));
      if (!a) continue;
      const action = merged.context.lookup(a, PDFDict);
      if (!action) continue;
      const uri = action.get(PDFName.of('URI'));
      if (!uri) continue;

      const url = uri.decodeText ? uri.decodeText() : uri.toString();
      const m = url.match(inSiteRe);
      if (!m) {
        stats.external++;
        continue;
      }

      // In-site URL — find the matching slug.
      const slugFromUrl = m[1] || 'index';
      const targetPage = slugToPage.get(slugFromUrl);
      if (targetPage === undefined) {
        // No matching slug (e.g. the PDF download URL or a typo)
        stats.unmatched++;
        continue;
      }

      // Build /Dest = [pageRef /XYZ null null null]  → "go to page, preserve view"
      const targetPageRef = merged.getPage(targetPage).ref;
      const dest = PDFArray.withContext(merged.context);
      dest.push(targetPageRef);
      dest.push(PDFName.of('XYZ'));
      dest.push(PDFNull);
      dest.push(PDFNull);
      dest.push(PDFNull);

      // Replace URI action with GoTo
      action.delete(PDFName.of('URI'));
      action.set(PDFName.of('S'), PDFName.of('GoTo'));
      action.set(PDFName.of('D'), dest);

      stats.internal++;
    }
  }
  return stats;
}

/**
 * Adds a top-level PDF outline (a.k.a. bookmarks) so readers can navigate via
 * the sidebar in Preview / Acrobat / browsers. One entry per page in PAGES,
 * grouped by category prefix in the path (Tutorials get nested).
 */
function addOutline(merged, slugToPage, pages) {
  const ctx = merged.context;

  // Group entries — top-level + Tutorials nested.
  const groups = [];
  let currentGroup = null;

  for (const { path, title } of pages) {
    const slug = canonicalSlug(path);
    const pageIdx = slugToPage.get(slug);
    if (pageIdx === undefined) continue;

    const isTutorial = path.startsWith('/tutorials/');
    if (isTutorial) {
      if (!currentGroup || currentGroup.title !== 'Tutorials') {
        currentGroup = { title: 'Tutorials', pageIdx, children: [] };
        groups.push(currentGroup);
      }
      currentGroup.children.push({ title: title.replace(/^Tutorial:\s*/, ''), pageIdx });
    } else {
      groups.push({ title, pageIdx, children: [] });
      currentGroup = null;
    }
  }

  // Build outline tree as PDFDict refs.
  const outlinesDict = ctx.obj({ Type: 'Outlines' });
  const outlinesRef = ctx.register(outlinesDict);

  let firstChildRef = null;
  let prevRef = null;
  let totalCount = 0;

  for (const group of groups) {
    const dest = makeDest(merged, group.pageIdx);
    const itemDict = ctx.obj({
      Title: PDFHexString.fromText(group.title),
      Parent: outlinesRef,
      Dest: dest,
    });
    const itemRef = ctx.register(itemDict);

    if (!firstChildRef) firstChildRef = itemRef;
    if (prevRef) {
      itemDict.set(PDFName.of('Prev'), prevRef);
      ctx.lookup(prevRef, PDFDict).set(PDFName.of('Next'), itemRef);
    }
    prevRef = itemRef;
    totalCount++;

    // Children (Tutorials)
    if (group.children.length > 0) {
      let firstChildItemRef = null;
      let prevChildRef = null;
      let childCount = 0;
      for (const child of group.children) {
        const childDict = ctx.obj({
          Title: PDFHexString.fromText(child.title),
          Parent: itemRef,
          Dest: makeDest(merged, child.pageIdx),
        });
        const childRef = ctx.register(childDict);
        if (!firstChildItemRef) firstChildItemRef = childRef;
        if (prevChildRef) {
          childDict.set(PDFName.of('Prev'), prevChildRef);
          ctx.lookup(prevChildRef, PDFDict).set(PDFName.of('Next'), childRef);
        }
        prevChildRef = childRef;
        childCount++;
      }
      itemDict.set(PDFName.of('First'), firstChildItemRef);
      itemDict.set(PDFName.of('Last'), prevChildRef);
      itemDict.set(PDFName.of('Count'), PDFNumber.of(childCount));
      totalCount += childCount;
    }
  }

  outlinesDict.set(PDFName.of('First'), firstChildRef);
  outlinesDict.set(PDFName.of('Last'), prevRef);
  outlinesDict.set(PDFName.of('Count'), PDFNumber.of(totalCount));

  merged.catalog.set(PDFName.of('Outlines'), outlinesRef);
  // Hint to viewers that the outlines pane should open by default.
  merged.catalog.set(PDFName.of('PageMode'), PDFName.of('UseOutlines'));
}

function makeDest(merged, pageIdx) {
  const dest = PDFArray.withContext(merged.context);
  dest.push(merged.getPage(pageIdx).ref);
  dest.push(PDFName.of('XYZ'));
  dest.push(PDFNull);
  dest.push(PDFNull);
  dest.push(PDFNull);
  return dest;
}
