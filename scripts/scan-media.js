import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const DATA_FILE = path.join(__dirname, '..', 'src', 'data', 'portfolioData.ts');

// Image extensions to look for
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];

// Folders to scan (for gallery images)
const FOLDERS = {
  images: path.join(PUBLIC_DIR, 'images'),
  photographs: path.join(PUBLIC_DIR, 'photographs'),
};

// Format filename to title
function formatTitle(filename) {
  return filename
    .replace(/\.[^/.]+$/, '')  // Remove extension
    .replace(/[-_]/g, ' ')      // Replace dashes/underscores with spaces
    .replace(/\b\w/g, l => l.toUpperCase());  // Capitalize words
}

// Extract desktop items from portfolioData.ts
function extractDesktopItems(content) {
  const match = content.match(/export const desktopItems: DesktopItem\[\] = (\[[\s\S]*?\]);/);
  if (!match) return [];
  
  try {
    // Parse the array (safely eval the JSON-like structure)
    return eval(match[1]);
  } catch (e) {
    console.log('⚠️ Could not parse desktopItems');
    return [];
  }
}

// Convert desktop items to gallery images (skip duplicates)
function desktopItemsToGallery(desktopItems, existingUrls) {
  const galleryImages = [];
  let index = 1000; // Start at high index to avoid conflicts
  
  for (const item of desktopItems) {
    // Map category to gallery category
    const categoryMap = {
      'images': 'Images',
      'photographs': 'Photographs',
      'videos': 'Images', // Videos use thumbnails
    };
    
    const category = categoryMap[item.category] || 'Images';
    
    // Skip if no image
    if (!item.image) continue;
    
    // Skip if already in gallery (duplicate)
    if (existingUrls.has(item.image)) continue;
    
    galleryImages.push({
      id: String(index++),
      url: item.image,
      caption: item.title,
      category: category,
    });
  }
  
  return galleryImages;
}

// Scan a folder and return file list
function scanFolder(folderPath) {
  if (!fs.existsSync(folderPath)) {
    return [];
  }
  
  const files = fs.readdirSync(folderPath);
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return IMAGE_EXTENSIONS.includes(ext) || VIDEO_EXTENSIONS.includes(ext);
  });
}

// Generate gallery images (from folders + desktop items)
function generateGalleryImages(desktopItems = []) {
  let allImages = [];
  let imageIndex = 1;
  const existingUrls = new Set(); // Track URLs to avoid duplicates

  // Only images and photographs for gallery
  const galleryFolders = {
    Images: { path: FOLDERS.images, urlPrefix: '/images' },
    Photographs: { path: FOLDERS.photographs, urlPrefix: '/photographs' },
  };

  for (const [category, folderData] of Object.entries(galleryFolders)) {
    const files = scanFolder(folderData.path);
    
    for (const file of files) {
      const relativePath = `${folderData.urlPrefix}/${file}`;
      
      allImages.push({
        id: String(imageIndex),
        url: relativePath,
        caption: formatTitle(file),
        category: category,
      });
      
      existingUrls.add(relativePath);
      imageIndex++;
    }
  }
  
  // Add desktop items to gallery (skip duplicates)
  const desktopGallery = desktopItemsToGallery(desktopItems, existingUrls);
  allImages = allImages.concat(desktopGallery);

  return allImages;
}

// Update the portfolioData.ts file
function updateDataFile() {
  // Read current file first to get desktop items
  let content = fs.readFileSync(DATA_FILE, 'utf8');
  const desktopItems = extractDesktopItems(content);
  
  // Generate gallery including desktop items
  const galleryImages = generateGalleryImages(desktopItems);

  // Replace galleryImages array (desktopItems stays manual)
  const galleryImagesStr = JSON.stringify(galleryImages, null, 2);
  content = content.replace(
    /export const galleryImages: GalleryImage\[\] = \[[\s\S]*?\];/,
    `export const galleryImages: GalleryImage[] = ${galleryImagesStr};`
  );

  // Write back
  fs.writeFileSync(DATA_FILE, content);

  console.log(`✅ Gallery updated:`);
  console.log(`   - ${galleryImages.length} gallery images`);
  console.log(`   - ${desktopItems.length} desktop items included`);
  console.log(`\n📁 Folders scanned:`);
  for (const [name, folder] of Object.entries(FOLDERS)) {
    const count = scanFolder(folder).length;
    console.log(`   - ${name}: ${count} files`);
  }
}

// Create folders if they don't exist
function ensureFolders() {
  for (const folder of Object.values(FOLDERS)) {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
      console.log(`📁 Created folder: ${folder}`);
    }
  }
}

// Main
console.log('🔍 Scanning media folders...\n');
ensureFolders();
updateDataFile();
console.log('\n✨ Done! Restart your dev server to see changes.');
