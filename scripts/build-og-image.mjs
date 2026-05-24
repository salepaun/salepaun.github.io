// Convert public/og-image.svg → public/og-image.png at 1200x630.
// Run after editing the SVG: `node scripts/build-og-image.mjs`.
// The PNG is what's referenced by OG/Twitter meta tags (better cross-platform
// support than SVG — Twitter in particular won't preview SVG).
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = resolve(__dirname, '..', 'public', 'og-image.svg');
const pngPath = resolve(__dirname, '..', 'public', 'og-image.png');

const svg = readFileSync(svgPath);
await sharp(svg, { density: 144 }).resize(1200, 630).png({ quality: 92 }).toFile(pngPath);
console.log(`✓ ${pngPath} written (1200x630, PNG)`);
