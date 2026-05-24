// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
  site: 'https://autolayoutpro.com',
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'AutoLayout PRO',
      description:
        'Figma-style auto-layout engine for Unity uGUI — Burst-compiled core, incremental rebuilds, and a sizing model designers already think in.',
      logo: {
        src: './public/logo.svg',
        replacesTitle: false,
      },
      favicon: '/favicon.svg',
      customCss: ['./src/styles/custom.css'],
      social: {
        // Header icon links to the public bug-tracker repo (main code repo is private).
        github: 'https://github.com/salepaun/autolayoutpro-issues',
      },
      editLink: {
        baseUrl:
          'https://github.com/salepaun/salepaun.github.io/edit/master/',
      },
      lastUpdated: true,
      pagination: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      components: {
        // Wraps the default footer + appends a version badge.
        Footer: './src/components/Footer.astro',
      },
      head: [
        // Open Graph + Twitter Card — gives polished link previews when the URL is
        // shared in Discord / Slack / GitHub / Twitter. PNG is preferred (Twitter
        // doesn't preview SVG); the SVG sibling exists for crawlers that support it.
        { tag: 'meta', attrs: { property: 'og:image', content: 'https://autolayoutpro.com/og-image.png' } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: 'https://autolayoutpro.com/og-image.png' } },
      ],
      expressiveCode: {
        themes: ['github-dark', 'github-light'],
        styleOverrides: {
          borderRadius: '0.4rem',
          codeFontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace",
        },
      },
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { slug: 'why-autolayout' },
            { slug: 'getting-started' },
            { slug: 'examples' },
          ],
        },
        {
          label: 'Tutorials',
          items: [
            { slug: 'tutorials/toolbar' },
            { slug: 'tutorials/settings-menu' },
            { slug: 'tutorials/game-hud' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { slug: 'overview' },
            { slug: 'inspector-input' },
            {
              label: 'Size & Position',
              items: [
                { slug: 'size-position' },
                { slug: 'sizing' },
                { slug: 'absolute' },
                { slug: 'margin' },
                { slug: 'render-offset' },
              ],
            },
            {
              label: 'Child Layout',
              items: [
                { slug: 'child-layout' },
                { slug: 'layout-type' },
                { slug: 'row-column' },
                { slug: 'grid' },
                { slug: 'custom-layouts' },
                { slug: 'padding' },
                { slug: 'overflow' },
              ],
            },
            { slug: 'transitions' },
          ],
        },
        {
          label: 'Builders',
          items: [{ slug: 'auto-ui' }],
        },
        {
          label: 'Components',
          items: [
            { slug: 'scroll-view' },
            { slug: 'list-view' },
            { slug: 'grid-view' },
            { slug: 'carousel' },
            { slug: 'dropdown' },
            { slug: 'progress-bar' },
            { slug: 'tweening' },
            { slug: 'animator-support' },
          ],
        },
        {
          label: 'Support',
          items: [
            { slug: 'faq' },
            { slug: 'reporting-bugs' },
            { slug: 'roadmap' },
            { slug: 'enterprise' },
            { slug: 'changelog' },
            {
              label: 'Browse Open Issues',
              link: 'https://github.com/salepaun/autolayoutpro-issues/issues',
              attrs: { target: '_blank', rel: 'noopener' },
              badge: { text: 'GitHub', variant: 'note' },
            },
          ],
        },
      ],
    }),
  ],
});
