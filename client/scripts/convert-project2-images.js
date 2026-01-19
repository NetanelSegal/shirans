import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../src/data/project2/new');
const outputDir = path.join(__dirname, '../src/data/project2/images/output');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Get all image files from source directory
const imageExtensions = ['.png', '.jpg', '.jpeg', '.PNG', '.JPG', '.JPEG'];
const files = fs.readdirSync(sourceDir)
    .filter(file => {
        const ext = path.extname(file);
        return imageExtensions.includes(ext);
    })
    .map(file => ({
        name: file,
        path: path.join(sourceDir, file),
        size: fs.statSync(path.join(sourceDir, file)).size
    }));

if (files.length === 0) {
    console.log('No image files found in', sourceDir);
    process.exit(1);
}

console.log(`Found ${files.length} image files`);

// Find the largest file (main image)
const mainImage = files.reduce((largest, current) =>
    current.size > largest.size ? current : largest
);

console.log(`Main image identified: ${mainImage.name} (${(mainImage.size / 1024 / 1024).toFixed(2)} MB)`);

// Sort other images by name (alphabetically)
const otherImages = files
    .filter(file => file.name !== mainImage.name)
    .sort((a, b) => a.name.localeCompare(b.name));

console.log(`Other images: ${otherImages.length}`);

// Convert main image
async function convertMainImage() {
    const outputPath = path.join(outputDir, 'main_desktop.webp');
    const metadata = await sharp(mainImage.path).metadata();
    const maxWidth = 1200;

    await sharp(mainImage.path)
        .resize(maxWidth, null, {
            withoutEnlargement: true,
            fit: 'inside'
        })
        .webp({ quality: 80 })
        .toFile(outputPath);
    console.log(`✓ Converted main image: main_desktop.webp (${metadata.width}x${metadata.height} -> max ${maxWidth}px width)`);
}

// Convert other images
async function convertOtherImages() {
    const maxWidth = 1200;

    for (let i = 0; i < otherImages.length; i++) {
        const image = otherImages[i];
        const outputPath = path.join(outputDir, `${i + 1}_desktop.webp`);
        const metadata = await sharp(image.path).metadata();

        await sharp(image.path)
            .resize(maxWidth, null, {
                withoutEnlargement: true,
                fit: 'inside'
            })
            .webp({ quality: 80 })
            .toFile(outputPath);
        console.log(`✓ Converted image ${i + 1}/${otherImages.length}: ${image.name} -> ${i + 1}_desktop.webp (${metadata.width}x${metadata.height} -> max ${maxWidth}px width)`);
    }
}

// Run conversions
async function convertAll() {
    try {
        console.log('\nStarting image conversion...\n');
        await convertMainImage();
        await convertOtherImages();
        console.log(`\n✓ Successfully converted ${files.length} images!`);
        console.log(`Main image: main_desktop.webp`);
        console.log(`Other images: 1_desktop.webp through ${otherImages.length}_desktop.webp`);
    } catch (error) {
        console.error('Error converting images:', error);
        process.exit(1);
    }
}

convertAll();
