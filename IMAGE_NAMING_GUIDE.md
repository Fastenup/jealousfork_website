# Image Upload Naming Convention Guide

## Quick Start

1. **Name your images** according to the patterns below
2. **Drop them** in `JealousForkWebsite/public/images/upload/`
3. **Refresh admin page** or click "Scan Upload Folder" to process
4. **Done!** Images are automatically placed and old versions archived

---

## Naming Patterns

### Landing Page Images

#### Hero Background
```
Pattern: hero-{name}.jpg
Example: hero-sunset.jpg
Result:  Updates main hero section background
Destination: /images/restaurant/interior.jpg
```

#### Banners
```
Pattern: banner-{name}.jpg
Example: banner-summer-special.jpg
Result:  Creates promotional banner image
Destination: /images/restaurant/banner-{name}.jpg
```

#### Interior Photos
```
Pattern: interior-{name}.jpg
Example: interior-dining-room.jpg
Result:  Adds restaurant interior photo
Destination: /images/restaurant/interior-{name}.jpg
```

---

## Product Images

### Method 1: By Product ID (1-6)
```
Pattern: product-{id}-{descriptive-name}.jpg
Examples:
  - product-1-oreo.jpg
  - product-2-burger.jpg
  - product-3-peanut-butter.jpg
```

### Method 2: By Exact Slug
```
Pattern: {exact-product-slug}.jpg
Examples:
  - chocolate-oreo-chip-pancakes.jpg
  - jesse-james-burger.jpg
  - peanut-butter-maple-pancakes.jpg
```

---

## Product Reference Table

| ID | Product Name | Slug | Naming Examples |
|----|--------------|------|-----------------|
| 1 | Chocolate Oreo Chip Pancakes | `chocolate-oreo-chip-pancakes` | `product-1-oreo.jpg`<br>`chocolate-oreo-chip-pancakes.jpg` |
| 2 | Jesse James Burger | `jesse-james-burger` | `product-2-burger.jpg`<br>`jesse-james-burger.jpg` |
| 3 | Peanut Butter Maple Pancakes | `peanut-butter-maple-pancakes` | `product-3-pb.jpg`<br>`peanut-butter-maple-pancakes.jpg` |
| 4 | Brunch And Still Hungover | `brunch-still-hungover` | `product-4-brunch.jpg`<br>`brunch-still-hungover.jpg` |
| 5 | Banana Walnut Smoked Maple | `banana-walnut-smoked-maple` | `product-5-banana.jpg`<br>`banana-walnut-smoked-maple.jpg` |
| 6 | Viking Telle | `viking-telle` | `product-6-viking.jpg`<br>`viking-telle.jpg` |

---

## File Requirements

- **Formats**: `.jpg`, `.jpeg`, `.png`, `.webp`
- **Size**: Under 10MB recommended
- **Resolution**: 1920x1080 or higher for hero images, 800x600 for products
- **Naming**: Case-insensitive (both `Hero-Sunset.jpg` and `hero-sunset.jpg` work)

---

## Process Flow

```
┌─────────────────────────┐
│  1. Upload images to    │
│  /public/images/upload/ │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  2. System scans and    │
│     parses filenames    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  3. Images copied to    │
│     correct location    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  4. Originals archived  │
│     to /processed/      │
└─────────────────────────┘
```

---

## Examples

### Updating Hero Image
```bash
# 1. Name your file
hero-new-interior.jpg

# 2. Upload to folder
cp hero-new-interior.jpg JealousForkWebsite/public/images/upload/

# 3. Process (automatic or manual scan)
# Result: Hero section now shows your new image
```

### Updating Product #1 (Oreo Pancakes)
```bash
# Option A: By ID
cp new-photo.jpg JealousForkWebsite/public/images/upload/product-1-fresh.jpg

# Option B: By Slug
cp new-photo.jpg JealousForkWebsite/public/images/upload/chocolate-oreo-chip-pancakes.jpg

# Both work the same way!
```

### Adding Multiple Products at Once
```bash
cd JealousForkWebsite/public/images/upload/

# Upload multiple files
cp ~/photos/pancake1.jpg ./product-1-update.jpg
cp ~/photos/burger1.jpg ./product-2-update.jpg
cp ~/photos/pancake2.jpg ./product-3-update.jpg

# Scan once to process all
# All three images will be processed together
```

---

## Troubleshooting

### Image Not Processing?
- ✅ Check filename matches pattern exactly
- ✅ Verify file is in `/upload/` folder
- ✅ Ensure file extension is `.jpg`, `.jpeg`, `.png`, or `.webp`
- ✅ Check file isn't corrupted
- ✅ Try manual scan via admin panel

### Wrong Image Showing?
- Clear browser cache
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check `/processed/` folder for timestamped original

### Restore Previous Image?
- Look in `/processed/` folder
- Files are named: `{timestamp}-{original-name}.jpg`
- Copy back to `/upload/` and process again

---

## Advanced Tips

### Batch Processing
Upload all images at once to the `/upload/` folder, then click "Scan Upload Folder" in the admin panel. All valid images will be processed in one go.

### Naming Best Practices
- Use descriptive names for future reference
- Keep names short but meaningful
- Use hyphens, not spaces: `product-1-new` ✅ not `product 1 new` ❌

### Backup Strategy
Original files are automatically backed up to `/processed/` with timestamps, so you can always revert changes.

---

## Admin Panel Integration

Access the **Photo Manager** in your admin panel to:
- View files in upload folder
- See what each file will map to
- Manually trigger processing
- View naming guide
- Check processing history

---

## API Endpoints (for developers)

```
GET  /api/images/naming-guide    - Get this guide as JSON
GET  /api/images/upload-status   - View files in upload folder
POST /api/images/scan            - Process all files in upload folder
POST /api/images/process/:file   - Process specific file
```

---

**Need help?** Check the admin panel's Photo Manager section or contact support.
