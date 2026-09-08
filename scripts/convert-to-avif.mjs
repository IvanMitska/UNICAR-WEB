/**
 * Converts every raster image under public/ to AVIF.
 *
 * Rules:
 *  - For each existing .webp (including -thumb.webp) a sibling .avif is written
 *    with the exact same basename, so any URL that resolves to a .webp can
 *    resolve to an .avif by swapping the extension.
 *  - AVIF is encoded from the original .jpg/.jpeg/.png when one exists next to
 *    the .webp (better quality than transcoding an already-lossy webp),
 *    otherwise from the .webp itself.
 *  - Source images that have no .webp sibling get both .webp and .avif.
 *  - Favicons and the og-image are skipped: social crawlers and some browsers
 *    still need the raw png/jpg.
 *
 * Usage:  node scripts/convert-to-avif.mjs [--force] [--quality=50]
 */
import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import { join, extname } from 'path';
import os from 'os';

const ROOTS = ['public'];
const SOURCE_EXT = ['.jpg', '.jpeg', '.png'];
const SKIP = [
  'public/favicon-32.png',
  'public/favicon-192.png',
  'public/favicon-512.png',
  'public/apple-touch-icon.png',
  'public/og-image.jpg',
];

const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const QUALITY = Number(args.find((a) => a.startsWith('--quality='))?.split('=')[1] ?? 50);
const EFFORT = Number(args.find((a) => a.startsWith('--effort='))?.split('=')[1] ?? 5);
const CONCURRENCY = Math.max(1, os.cpus().length - 1);

// sharp itself is multi-threaded; keep it to one thread per job so our own
// concurrency controls the load instead of oversubscribing the CPU.
sharp.concurrency(1);
sharp.cache(false);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

/** Original raster that a .webp was derived from, if it is still around. */
function originalFor(webpPath) {
  const withoutWebp = webpPath.slice(0, -'.webp'.length);
  // "photo.JPG.webp" -> "photo.JPG"
  if (SOURCE_EXT.includes(extname(withoutWebp).toLowerCase()) && existsSync(withoutWebp)) {
    return withoutWebp;
  }
  // "photo.webp" -> "photo.jpg" / "photo.png" / ...
  for (const ext of [...SOURCE_EXT, '.JPG', '.JPEG', '.PNG']) {
    if (existsSync(withoutWebp + ext)) return withoutWebp + ext;
  }
  return null;
}

function buildJobs(files) {
  const jobs = [];
  const seen = new Set();

  // 1. One AVIF per existing WebP, same basename.
  for (const file of files) {
    if (extname(file).toLowerCase() !== '.webp') continue;
    const target = file.slice(0, -'.webp'.length) + '.avif';
    if (seen.has(target)) continue;
    seen.add(target);
    // Thumbnails were downscaled during webp generation, so re-encode the thumb
    // from the thumb; full-size ones go back to the untouched original.
    const isThumb = file.endsWith('-thumb.webp');
    jobs.push({ from: isThumb ? file : originalFor(file) ?? file, to: target });
  }

  // 2. Sources that never got a WebP at all -> make both.
  //    A stem shared by two different sources (e.g. cta-bg.jpg + cta-bg.png are
  //    two unrelated photos) would collide, so the non-jpg one is disambiguated
  //    as "<stem>-<ext>.avif".
  const stems = new Map();
  for (const file of files) {
    if (!SOURCE_EXT.includes(extname(file).toLowerCase())) continue;
    const stem = file.slice(0, -extname(file).length);
    stems.set(stem, (stems.get(stem) ?? 0) + 1);
  }

  for (const file of files) {
    const ext = extname(file).toLowerCase();
    if (!SOURCE_EXT.includes(ext)) continue;
    if (SKIP.includes(file.split('\\').join('/'))) continue;

    const stem = file.slice(0, -extname(file).length);
    const collides = stems.get(stem) > 1;
    // The plain stem stays with the jpg; other formats get the suffix.
    const base = collides && ext === '.png' ? `${stem}-png` : stem;

    if (!collides && (existsSync(stem + '.webp') || existsSync(file + '.webp'))) continue;
    // A colliding stem may already hold a .webp built from the *other* source by
    // the older pipeline, so its outputs are always rewritten to stay in sync.
    if (!seen.has(base + '.avif')) {
      seen.add(base + '.avif');
      jobs.push({ from: file, to: base + '.avif', force: collides });
    }
    jobs.push({ from: file, to: base + '.webp', force: collides });
  }

  return jobs;
}

async function convert({ from, to, force = false }) {
  if (!FORCE && !force && existsSync(to)) {
    const [src, dst] = await Promise.all([stat(from), stat(to)]);
    if (dst.mtimeMs >= src.mtimeMs) return { skipped: true, from, to };
  }

  const pipeline = sharp(from).rotate();
  if (to.endsWith('.avif')) {
    await pipeline.avif({ quality: QUALITY, effort: EFFORT, chromaSubsampling: '4:2:0' }).toFile(to);
  } else {
    await pipeline.webp({ quality: 80 }).toFile(to);
  }

  const [src, dst] = await Promise.all([stat(from), stat(to)]);
  return { from, to, before: src.size, after: dst.size };
}

async function main() {
  const files = (await Promise.all(ROOTS.map(walk))).flat();
  const jobs = buildJobs(files);

  console.log(`Found ${jobs.length} conversions (concurrency ${CONCURRENCY}, quality ${QUALITY}, effort ${EFFORT})\n`);

  let done = 0;
  let skipped = 0;
  let before = 0;
  let after = 0;
  let failed = 0;

  let cursor = 0;
  const worker = async () => {
    while (cursor < jobs.length) {
      const job = jobs[cursor++];
      try {
        const res = await convert(job);
        if (res.skipped) {
          skipped++;
        } else {
          before += res.before;
          after += res.after;
          done++;
          if (done % 25 === 0) console.log(`  ... ${done} converted`);
        }
      } catch (err) {
        failed++;
        console.error(`✗ ${job.from} -> ${job.to}: ${err.message}`);
      }
    }
  };

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const mb = (n) => (n / 1024 / 1024).toFixed(1) + ' MB';
  console.log(`\n✅ Done. converted=${done} skipped=${skipped} failed=${failed}`);
  if (done) {
    console.log(`   Source bytes: ${mb(before)} -> AVIF/WebP: ${mb(after)} (${(100 - (after / before) * 100).toFixed(0)}% smaller)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
