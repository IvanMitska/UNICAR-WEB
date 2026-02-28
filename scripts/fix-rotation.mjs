import sharp from 'sharp';
import { readdir, stat, unlink, rename } from 'fs/promises';
import { join, extname } from 'path';

// Folders with rotated images that need to be fixed
const FOLDERS_TO_FIX = [
  'public/images/cars/raptor-2024',
  'public/images/cars/everest-2024',
];

async function rotateImage(filePath) {
  const ext = extname(filePath).toLowerCase();

  // Skip non-image files
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;

  console.log(`Rotating: ${filePath}`);

  try {
    const tmpPath = filePath + '.rotated';

    // Rotate 180 degrees to flip upside-down images
    await sharp(filePath)
      .rotate(180)
      .toFile(tmpPath);

    await unlink(filePath);
    await rename(tmpPath, filePath);

    console.log(`  ✓ Fixed`);
  } catch (err) {
    console.error(`  ✗ Error: ${err.message}`);
  }
}

async function processFolder(folder) {
  try {
    const entries = await readdir(folder, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile()) {
        const filePath = join(folder, entry.name);
        await rotateImage(filePath);
      }
    }
  } catch (err) {
    console.error(`Error processing ${folder}: ${err.message}`);
  }
}

async function main() {
  console.log('🔄 Fixing image rotation...\n');

  for (const folder of FOLDERS_TO_FIX) {
    console.log(`\nProcessing: ${folder}`);
    await processFolder(folder);
  }

  console.log('\n✅ Done!');
}

main().catch(console.error);
