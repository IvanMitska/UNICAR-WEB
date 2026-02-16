#!/usr/bin/env node

/**
 * Image Optimization Script
 *
 * This script converts images to WebP format and creates optimized thumbnails.
 * Original files are preserved.
 *
 * Usage: node scripts/optimize-images.js
 *
 * Requirements: npm install sharp
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '../public');
const QUALITY = 85; // WebP quality (80-90 is good balance)
const THUMB_WIDTH = 600; // Thumbnail width for car cards

const IMAGE_DIRS = [
  'images/cars',
  'cars/menu',
  'images/brands',
  'images',
];

async function getImageFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...await getImageFiles(fullPath));
    } else if (/\.(jpg|jpeg|png)$/i.test(item.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

async function optimizeImage(inputPath) {
  const ext = path.extname(inputPath);
  const baseName = path.basename(inputPath, ext);
  const dir = path.dirname(inputPath);

  const webpPath = path.join(dir, `${baseName}.webp`);
  const thumbPath = path.join(dir, `${baseName}-thumb.webp`);

  // Skip if already processed
  if (fs.existsSync(webpPath)) {
    console.log(`  Skipping (exists): ${baseName}.webp`);
    return { skipped: true };
  }

  const originalSize = fs.statSync(inputPath).size;

  try {
    // Create WebP version (full size) with auto-rotation from EXIF
    await sharp(inputPath)
      .rotate() // Auto-rotate based on EXIF orientation
      .webp({ quality: QUALITY })
      .toFile(webpPath);

    const webpSize = fs.statSync(webpPath).size;

    // Create thumbnail for car cards
    const metadata = await sharp(inputPath).metadata();
    if (metadata.width > THUMB_WIDTH) {
      await sharp(inputPath)
        .rotate() // Auto-rotate based on EXIF orientation
        .resize(THUMB_WIDTH, null, { withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(thumbPath);
    }

    const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
    console.log(`  ✓ ${baseName}${ext} → .webp (${formatSize(originalSize)} → ${formatSize(webpSize)}, -${savings}%)`);

    return {
      original: originalSize,
      optimized: webpSize,
      saved: originalSize - webpSize
    };
  } catch (error) {
    console.error(`  ✗ Error processing ${inputPath}:`, error.message);
    return { error: true };
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

async function main() {
  console.log('🖼️  Image Optimization Script\n');
  console.log('This will create WebP versions of all images.');
  console.log('Original files will be preserved.\n');

  let totalOriginal = 0;
  let totalOptimized = 0;
  let processedCount = 0;
  let skippedCount = 0;

  for (const relDir of IMAGE_DIRS) {
    const dir = path.join(PUBLIC_DIR, relDir);
    if (!fs.existsSync(dir)) {
      console.log(`Directory not found: ${relDir}`);
      continue;
    }

    console.log(`\n📁 Processing: ${relDir}`);
    const files = await getImageFiles(dir);

    for (const file of files) {
      const result = await optimizeImage(file);
      if (result.skipped) {
        skippedCount++;
      } else if (!result.error) {
        totalOriginal += result.original;
        totalOptimized += result.optimized;
        processedCount++;
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   Processed: ${processedCount} files`);
  console.log(`   Skipped: ${skippedCount} files (already optimized)`);
  if (processedCount > 0) {
    console.log(`   Original size: ${formatSize(totalOriginal)}`);
    console.log(`   Optimized size: ${formatSize(totalOptimized)}`);
    console.log(`   Total saved: ${formatSize(totalOriginal - totalOptimized)} (${((totalOriginal - totalOptimized) / totalOriginal * 100).toFixed(1)}%)`);
  }
  console.log('\n✅ Done! Now update your components to use .webp images.');
}

main().catch(console.error);
