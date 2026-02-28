import sharp from 'sharp';
import { readdir, stat, mkdir, unlink } from 'fs/promises';
import { join, extname, basename, dirname } from 'path';

const PUBLIC_DIR = './public';
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const QUALITY = 80;

// Directories to process
const DIRS_TO_PROCESS = [
  'public/images/cars',
  'public/images/brands',
  'public/images',
  'public/imager-web'
];

let totalSaved = 0;
let processedCount = 0;

async function getFilesRecursively(dir) {
  const files = [];

  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        const subFiles = await getFilesRecursively(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase();
        if (['.jpg', '.jpeg', '.png'].includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err.message);
  }

  return files;
}

async function optimizeImage(filePath) {
  try {
    const stats = await stat(filePath);
    const originalSize = stats.size;
    const ext = extname(filePath).toLowerCase();
    const name = basename(filePath, ext);
    const dir = dirname(filePath);

    // Skip already optimized webp files
    if (ext === '.webp') return;

    // Skip thumbnails
    if (name.includes('-thumb') || name.includes('_thumb')) return;

    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Calculate new dimensions
    let width = metadata.width;
    let height = metadata.height;

    if (width > MAX_WIDTH) {
      height = Math.round((height * MAX_WIDTH) / width);
      width = MAX_WIDTH;
    }

    if (height > MAX_HEIGHT) {
      width = Math.round((width * MAX_HEIGHT) / height);
      height = MAX_HEIGHT;
    }

    // Output path for WebP
    const webpPath = join(dir, `${name}.webp`);

    // Convert to WebP with auto-rotation based on EXIF
    await sharp(filePath)
      .rotate() // Auto-rotate based on EXIF orientation
      .resize(width, height, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(webpPath);

    const newStats = await stat(webpPath);
    const saved = originalSize - newStats.size;
    totalSaved += saved;
    processedCount++;

    console.log(`✓ ${filePath}`);
    console.log(`  Original: ${(originalSize / 1024).toFixed(0)}KB → WebP: ${(newStats.size / 1024).toFixed(0)}KB (saved ${(saved / 1024).toFixed(0)}KB)`);

    // Also optimize original JPG/PNG in place with auto-rotation
    if (ext === '.jpg' || ext === '.jpeg') {
      await sharp(filePath)
        .rotate() // Auto-rotate based on EXIF orientation
        .resize(width, height, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(filePath + '.tmp');

      await unlink(filePath);
      const { rename } = await import('fs/promises');
      await rename(filePath + '.tmp', filePath);
    } else if (ext === '.png') {
      await sharp(filePath)
        .rotate() // Auto-rotate based on EXIF orientation
        .resize(width, height, { fit: 'inside', withoutEnlargement: true })
        .png({ quality: QUALITY, compressionLevel: 9 })
        .toFile(filePath + '.tmp');

      await unlink(filePath);
      const { rename } = await import('fs/promises');
      await rename(filePath + '.tmp', filePath);
    }

  } catch (err) {
    console.error(`✗ Error processing ${filePath}:`, err.message);
  }
}

async function main() {
  console.log('🖼️  Starting image optimization...\n');

  const allFiles = [];

  for (const dir of DIRS_TO_PROCESS) {
    const files = await getFilesRecursively(dir);
    allFiles.push(...files);
  }

  // Remove duplicates
  const uniqueFiles = [...new Set(allFiles)];

  console.log(`Found ${uniqueFiles.length} images to process\n`);

  for (const file of uniqueFiles) {
    await optimizeImage(file);
  }

  console.log('\n✅ Optimization complete!');
  console.log(`   Processed: ${processedCount} images`);
  console.log(`   Total saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
}

main().catch(console.error);
