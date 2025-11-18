import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const UPLOAD_DIR = path.join(__dirname, '../public/images/upload');
const PROCESSED_DIR = path.join(__dirname, '../public/images/processed');
const FOOD_DIR = path.join(__dirname, '../public/images/food');
const RESTAURANT_DIR = path.join(__dirname, '../public/images/restaurant');

interface ImageMapping {
  filename: string;
  type: 'hero' | 'banner' | 'interior' | 'product-id' | 'product-slug' | 'unknown';
  target?: string;
  productId?: number;
  slug?: string;
}

// Product mapping from featuredItems config
const PRODUCT_MAPPINGS = {
  ids: {
    1: 'chocolate-oreo-chip-pancakes',
    2: 'jesse-james-burger',
    3: 'peanut-butter-maple-pancakes',
    4: 'brunch-still-hungover',
    5: 'banana-walnut-smoked-maple',
    6: 'viking-telle'
  },
  slugs: [
    'chocolate-oreo-chip-pancakes',
    'jesse-james-burger',
    'peanut-butter-maple-pancakes',
    'brunch-still-hungover',
    'banana-walnut-smoked-maple',
    'viking-telle'
  ]
};

/**
 * Parse filename to determine what it should map to
 */
export function parseFilename(filename: string): ImageMapping {
  const nameLower = filename.toLowerCase();
  const nameWithoutExt = path.parse(filename).name;

  // Hero images: hero-{name}.jpg
  if (nameLower.startsWith('hero-')) {
    return {
      filename,
      type: 'hero',
      target: 'interior.jpg' // Hero uses interior.jpg
    };
  }

  // Banner images: banner-{name}.jpg
  if (nameLower.startsWith('banner-')) {
    return {
      filename,
      type: 'banner',
      target: nameWithoutExt + path.extname(filename)
    };
  }

  // Interior/restaurant images: interior-{name}.jpg
  if (nameLower.startsWith('interior-')) {
    return {
      filename,
      type: 'interior',
      target: nameWithoutExt + path.extname(filename)
    };
  }

  // Product by ID: product-{id}-{name}.jpg
  const productIdMatch = nameLower.match(/^product-(\d+)-/);
  if (productIdMatch) {
    const productId = parseInt(productIdMatch[1]);
    if (productId >= 1 && productId <= 6) {
      return {
        filename,
        type: 'product-id',
        productId,
        slug: PRODUCT_MAPPINGS.ids[productId as keyof typeof PRODUCT_MAPPINGS.ids],
        target: `product-${productId}${path.extname(filename)}`
      };
    }
  }

  // Product by slug: {slug}.jpg (exact match)
  const filenameSlug = nameWithoutExt.toLowerCase();
  if (PRODUCT_MAPPINGS.slugs.includes(filenameSlug)) {
    return {
      filename,
      type: 'product-slug',
      slug: filenameSlug,
      target: filename
    };
  }

  return {
    filename,
    type: 'unknown'
  };
}

/**
 * Process a single image file
 */
export async function processImage(filename: string): Promise<{
  success: boolean;
  message: string;
  mapping?: ImageMapping;
}> {
  const sourcePath = path.join(UPLOAD_DIR, filename);

  // Check if file exists
  if (!fs.existsSync(sourcePath)) {
    return {
      success: false,
      message: `File not found: ${filename}`
    };
  }

  // Parse filename
  const mapping = parseFilename(filename);

  if (mapping.type === 'unknown') {
    return {
      success: false,
      message: `Unknown naming pattern: ${filename}. Check naming conventions.`,
      mapping
    };
  }

  let destinationPath: string;

  // Determine destination based on type
  switch (mapping.type) {
    case 'hero':
      destinationPath = path.join(RESTAURANT_DIR, 'interior.jpg');
      break;
    case 'banner':
    case 'interior':
      destinationPath = path.join(RESTAURANT_DIR, mapping.target!);
      break;
    case 'product-id':
    case 'product-slug':
      destinationPath = path.join(FOOD_DIR, mapping.target!);
      break;
    default:
      return {
        success: false,
        message: `Cannot process type: ${mapping.type}`,
        mapping
      };
  }

  try {
    // Copy file to destination
    fs.copyFileSync(sourcePath, destinationPath);

    // Move original to processed folder with timestamp
    const timestamp = Date.now();
    const processedPath = path.join(
      PROCESSED_DIR,
      `${timestamp}-${filename}`
    );
    fs.renameSync(sourcePath, processedPath);

    return {
      success: true,
      message: `Successfully processed ${filename} → ${path.basename(destinationPath)}`,
      mapping
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Error processing ${filename}: ${error.message}`,
      mapping
    };
  }
}

/**
 * Scan upload folder and process all images
 */
export async function scanAndProcessImages(): Promise<{
  processed: number;
  failed: number;
  results: Array<{
    filename: string;
    success: boolean;
    message: string;
    mapping?: ImageMapping;
  }>;
}> {
  // Ensure directories exist
  [UPLOAD_DIR, PROCESSED_DIR, FOOD_DIR, RESTAURANT_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Get all files in upload directory
  const files = fs.readdirSync(UPLOAD_DIR).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });

  if (files.length === 0) {
    return {
      processed: 0,
      failed: 0,
      results: []
    };
  }

  const results = await Promise.all(
    files.map(file => processImage(file))
  );

  const processed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  return {
    processed,
    failed,
    results: results.map((r, i) => ({
      filename: files[i],
      ...r
    }))
  };
}

/**
 * Get list of files in upload folder with their mappings
 */
export function getUploadFolderStatus(): {
  count: number;
  files: Array<{
    filename: string;
    size: number;
    mapping: ImageMapping;
  }>;
} {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  const files = fs.readdirSync(UPLOAD_DIR).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });

  const fileDetails = files.map(filename => {
    const filePath = path.join(UPLOAD_DIR, filename);
    const stats = fs.statSync(filePath);
    return {
      filename,
      size: stats.size,
      mapping: parseFilename(filename)
    };
  });

  return {
    count: files.length,
    files: fileDetails
  };
}

/**
 * Get naming convention guide
 */
export function getNamingGuide() {
  return {
    title: "Image Naming Convention Guide",
    patterns: [
      {
        pattern: "hero-{name}.jpg",
        description: "Hero section background image",
        example: "hero-sunset.jpg",
        destination: "/images/restaurant/interior.jpg"
      },
      {
        pattern: "banner-{name}.jpg",
        description: "Banner images for promotional sections",
        example: "banner-summer-special.jpg",
        destination: "/images/restaurant/banner-{name}.jpg"
      },
      {
        pattern: "interior-{name}.jpg",
        description: "Restaurant interior photos",
        example: "interior-dining-room.jpg",
        destination: "/images/restaurant/interior-{name}.jpg"
      },
      {
        pattern: "product-{id}-{name}.jpg",
        description: "Product image by ID (1-6)",
        example: "product-1-oreo.jpg",
        destination: "/images/food/product-{id}.jpg",
        validIds: "1-6"
      },
      {
        pattern: "{slug}.jpg",
        description: "Product image by exact slug match",
        example: "chocolate-oreo-chip-pancakes.jpg",
        destination: "/images/food/{slug}.jpg",
        validSlugs: PRODUCT_MAPPINGS.slugs
      }
    ],
    products: Object.entries(PRODUCT_MAPPINGS.ids).map(([id, slug]) => ({
      id: parseInt(id),
      slug,
      patterns: [
        `product-${id}-{name}.jpg`,
        `${slug}.jpg`
      ]
    }))
  };
}
