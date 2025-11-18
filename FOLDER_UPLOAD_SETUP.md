# Folder-Based Photo Upload System

## Overview

This system allows you to easily add photos to your landing page and products by simply dropping files with specific naming patterns into a folder. No need to manually upload through the admin UI—just name your files correctly and process them!

## Quick Start

1. **Name your photo** using the naming convention (see below)
2. **Drop it** in `JealousForkWebsite/public/images/upload/`
3. **Go to** Admin Panel → "Folder Upload" tab
4. **Click** "Process All Images"
5. **Done!** Photos are automatically placed

## Folder Structure

```
public/images/
├── upload/      ← Drop new images here
├── processed/   ← Archive of processed images (automatic)
├── food/        ← Product images (automatic)
└── restaurant/  ← Landing page images (automatic)
```

## Naming Conventions

### Landing Page Images

| Pattern | Description | Example | Destination |
|---------|-------------|---------|-------------|
| `hero-{name}.jpg` | Hero section background | `hero-sunset.jpg` | `/images/restaurant/interior.jpg` |
| `banner-{name}.jpg` | Banner images | `banner-special.jpg` | `/images/restaurant/banner-{name}.jpg` |
| `interior-{name}.jpg` | Restaurant photos | `interior-dining.jpg` | `/images/restaurant/interior-{name}.jpg` |

### Product Images (Two Methods)

**Method 1: By Product ID (1-6)**
```
product-1-{descriptive-name}.jpg → Chocolate Oreo Chip Pancakes
product-2-{descriptive-name}.jpg → Jesse James Burger
product-3-{descriptive-name}.jpg → Peanut Butter Maple Pancakes
product-4-{descriptive-name}.jpg → Brunch And Still Hungover
product-5-{descriptive-name}.jpg → Banana Walnut Smoked Maple
product-6-{descriptive-name}.jpg → Viking Telle
```

**Method 2: By Exact Slug**
```
chocolate-oreo-chip-pancakes.jpg
jesse-james-burger.jpg
peanut-butter-maple-pancakes.jpg
brunch-still-hungover.jpg
banana-walnut-smoked-maple.jpg
viking-telle.jpg
```

## Examples

### Update Hero Background
```bash
# Copy your image with the correct name
cp my-photo.jpg public/images/upload/hero-new-interior.jpg

# Or rename and copy in one step
mv restaurant-photo.jpg public/images/upload/hero-evening.jpg
```

### Update Product #1 (Oreo Pancakes)
```bash
# Option A: By ID
cp pancake-photo.jpg public/images/upload/product-1-fresh.jpg

# Option B: By slug
cp pancake-photo.jpg public/images/upload/chocolate-oreo-chip-pancakes.jpg
```

### Batch Update Multiple Products
```bash
cd public/images/upload/

# Add multiple files
cp ~/photos/pancake1.jpg ./product-1-update.jpg
cp ~/photos/burger.jpg ./product-2-update.jpg
cp ~/photos/pancake2.jpg ./product-3-update.jpg

# Process all at once via admin panel
```

## How It Works

1. **File Detection**: System scans `/upload/` folder
2. **Name Parsing**: Extracts destination from filename pattern
3. **Image Placement**: Copies to correct location (`/food/` or `/restaurant/`)
4. **Archive**: Moves original to `/processed/` with timestamp
5. **Display**: Changes appear immediately on website

## Admin Panel Features

### Folder Upload Tab
- View all files in upload folder
- See what each file will map to
- Process images individually or in batch
- View processing results
- Access naming guide

### Features:
- ✅ Real-time upload folder status
- ✅ File validation before processing
- ✅ Clear success/error messages
- ✅ Automatic archival of originals
- ✅ Integrated naming convention guide

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/images/naming-guide` | GET | Get naming convention guide |
| `/api/images/upload-status` | GET | Check files in upload folder |
| `/api/images/scan` | POST | Process all files in upload |
| `/api/images/process/:filename` | POST | Process single file |

## File Requirements

- **Formats**: `.jpg`, `.jpeg`, `.png`, `.webp`
- **Size**: Under 10MB recommended
- **Naming**: Case-insensitive
- **Location**: Must be in `/upload/` folder

## Troubleshooting

### Image Not Processing?
1. Check filename matches pattern exactly
2. Verify file is in `/upload/` folder
3. Check file extension is supported
4. Try manual scan in admin panel

### Wrong Image Appearing?
1. Clear browser cache
2. Hard refresh page (Ctrl+Shift+R)
3. Check `/processed/` for archived versions

### Restore Previous Image?
1. Find original in `/processed/` folder
2. Files named: `{timestamp}-{original-name}.jpg`
3. Copy back to `/upload/` and reprocess

## Benefits

✅ **Simple**: Drop files, name them right, process them
✅ **Fast**: No complex upload UI needed
✅ **Safe**: Originals archived automatically
✅ **Flexible**: Two naming methods for products
✅ **Clear**: Immediate feedback on what will happen
✅ **Batch**: Process multiple images at once

## Files Created

- `server/fileWatcher.ts` - File processing service
- `client/src/components/FolderUploadManager.tsx` - Admin UI component
- `IMAGE_NAMING_GUIDE.md` - Detailed documentation
- `public/images/upload/` - Upload folder
- `public/images/processed/` - Archive folder

## Next Steps

1. Access admin panel at `/admin`
2. Go to "Folder Upload" tab
3. Read the built-in naming guide
4. Start uploading photos!

---

For complete documentation, see [IMAGE_NAMING_GUIDE.md](./IMAGE_NAMING_GUIDE.md)
