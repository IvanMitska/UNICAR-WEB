/**
 * Guards the AVIF pipeline: every image path referenced from src/ or index.html
 * must have the .avif and .webp siblings that <picture>/image-set() point at.
 *
 * A missing variant is not a graceful degradation — the browser picks a
 * <source> by MIME type and shows a broken image if that URL 404s.
 *
 * Usage: node scripts/verify-image-variants.mjs
 */
import { readdir, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, extname } from 'path';

const CODE_ROOTS = ['src'];
const EXTRA_FILES = ['index.html'];
const CODE_EXT = ['.ts', '.tsx', '.css', '.html'];
// Kept as-is on purpose: social crawlers and older browsers need these.
const EXEMPT = new Set([
  '/og-image.jpg',
  '/favicon-32.png',
  '/favicon-192.png',
  '/favicon-512.png',
  '/apple-touch-icon.png',
]);

const IMAGE_REF = /['"`(](\/[^'"`()\s]+?\.(?:jpg|jpeg|png|JPG))(?:\?[^'"`()\s]*)?['"`)]/g;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (CODE_EXT.includes(extname(entry.name))) out.push(full);
  }
  return out;
}

const files = [...(await Promise.all(CODE_ROOTS.map(walk))).flat(), ...EXTRA_FILES];
const refs = new Map();

for (const file of files) {
  const text = await readFile(file, 'utf8');
  for (const m of text.matchAll(IMAGE_REF)) {
    if (EXEMPT.has(m[1])) continue;
    if (!refs.has(m[1])) refs.set(m[1], file);
  }
}

const problems = [];
for (const [ref, file] of refs) {
  const onDisk = join('public', ref);
  const stem = onDisk.slice(0, -extname(onDisk).length);
  if (!existsSync(onDisk)) {
    problems.push(`${ref} — original missing (referenced from ${file})`);
    continue;
  }
  for (const variant of ['.avif', '.webp']) {
    if (!existsSync(stem + variant)) {
      problems.push(`${ref} — ${variant} missing (referenced from ${file})`);
    }
  }
}

console.log(`Checked ${refs.size} referenced images.`);
if (problems.length) {
  console.error(`\n✗ ${problems.length} problem(s):`);
  for (const p of problems) console.error('  ' + p);
  process.exit(1);
}
console.log('✅ Every referenced image has .avif and .webp siblings.');
