// Square Menu Synchronization Service
// Handles real-time sync between Square catalog and local menu items

export interface SquareMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  variations: any[];
  categoryId?: string;
  inStock: boolean;
  imageUrl?: string;
  imageIds?: string[];
  hasSquareImage?: boolean;
}

export interface LocalMenuItem {
  localId: number;
  squareId?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  featured: boolean;
  inStock: boolean;
  lastSync?: string;
}

export class SquareMenuSyncService {
  private accessToken: string;
  private baseUrl: string;

  constructor() {
    this.accessToken = process.env.SQUARE_ACCESS_TOKEN!;
    const environment = this.accessToken?.startsWith('sandbox') ? 'sandbox' : 'production';
    this.baseUrl = environment === 'sandbox' 
      ? 'https://connect.squareupsandbox.com' 
      : 'https://connect.squareup.com';
  }

  // Fetch all menu items from Square catalog with images and categories
  async fetchSquareMenuItems(): Promise<SquareMenuItem[]> {
    try {
      // Fetch items, images, and categories in parallel
      const [itemsResponse, imagesResponse, categoriesResponse] = await Promise.all([
        fetch(`${this.baseUrl}/v2/catalog/list?types=ITEM`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Square-Version': '2024-06-04',
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${this.baseUrl}/v2/catalog/list?types=IMAGE`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Square-Version': '2024-06-04',
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${this.baseUrl}/v2/catalog/list?types=CATEGORY`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Square-Version': '2024-06-04',
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (!itemsResponse.ok) {
        throw new Error(`Square API error: ${itemsResponse.status}`);
      }

      const itemsData = await itemsResponse.json();

      // Build image map from Square images
      const imageMap = new Map<string, string>();
      if (imagesResponse.ok) {
        const imagesData = await imagesResponse.json();
        (imagesData.objects || []).forEach((image: any) => {
          if (image.image_data?.url) {
            imageMap.set(image.id, image.image_data.url);
          }
        });
        console.log(`Found ${imageMap.size} Square images for menu items`);
      }

      // Build category map from Square categories
      const categoryMap = new Map<string, string>();
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        (categoriesData.objects || []).forEach((cat: any) => {
          if (cat.category_data?.name) {
            categoryMap.set(cat.id, cat.category_data.name);
          }
        });
        console.log(`Found ${categoryMap.size} Square categories`);
      }

      // Log first item's category fields for debugging
      if (itemsData.objects && itemsData.objects.length > 0) {
        const sampleItem = itemsData.objects[0].item_data;
        console.log('Sample item category fields:', {
          name: sampleItem?.name,
          category_id: sampleItem?.category_id,
          categories: sampleItem?.categories,
          reporting_category: sampleItem?.reporting_category
        });
      }

      return (itemsData.objects || []).map((item: any) => {
        const itemData = item.item_data;
        const firstVariation = itemData?.variations?.[0];
        const price = firstVariation?.item_variation_data?.price_money?.amount || 0;

        // Find the first image URL from imageIds
        let realImageUrl: string | undefined;
        const imageIds = itemData?.image_ids || [];
        for (const imageId of imageIds) {
          const url = imageMap.get(imageId);
          if (url) {
            realImageUrl = url;
            break;
          }
        }

        // Get category name from Square categories
        // Check both category_id (legacy) and categories array (newer API)
        let categoryName = 'Menu Items';
        let categoryId = itemData?.category_id;

        // Try legacy category_id first
        if (categoryId && categoryMap.has(categoryId)) {
          categoryName = categoryMap.get(categoryId)!;
        }
        // Try categories array (newer Square API uses this)
        else if (itemData?.categories && itemData.categories.length > 0) {
          categoryId = itemData.categories[0].id;
          if (categoryMap.has(categoryId)) {
            categoryName = categoryMap.get(categoryId)!;
          }
        }
        // Try reporting_category
        else if (itemData?.reporting_category?.id && categoryMap.has(itemData.reporting_category.id)) {
          categoryId = itemData.reporting_category.id;
          categoryName = categoryMap.get(categoryId)!;
        }

        return {
          id: item.id,
          name: itemData?.name || 'Unknown Item',
          description: itemData?.description || '',
          price: price / 100, // Convert from cents
          category: categoryName,
          categoryId: categoryId,
          variations: itemData?.variations || [],
          inStock: true, // Default to in stock, check inventory separately
          imageUrl: realImageUrl || itemData?.image_url, // Use Square image first, fallback to any existing URL
          imageIds: imageIds,
          hasSquareImage: !!realImageUrl
        };
      });
    } catch (error) {
      console.error('Failed to fetch Square menu items:', error);
      throw error;
    }
  }

  // Get inventory counts for items
  async getInventoryCounts(itemIds: string[]): Promise<Map<string, { quantity: number, inStock: boolean, isTracked: boolean }>> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/inventory/counts/batch-retrieve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Square-Version': '2024-06-04',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          catalog_object_ids: itemIds,
          location_ids: [process.env.SQUARE_LOCATION_ID]
        })
      });

      if (!response.ok) {
        console.log('Inventory API not available, defaulting to in-stock');
        return new Map();
      }

      const data = await response.json();
      const inventoryMap = new Map<string, { quantity: number, inStock: boolean, isTracked: boolean }>();
      
      (data.counts || []).forEach((count: any) => {
        const rawQuantity = count.quantity;
        const isTracked = rawQuantity !== null && rawQuantity !== undefined && rawQuantity !== '';
        const numericQuantity = parseFloat(rawQuantity || '0');
        
        // Inventory logic: blank/null = in stock (unlimited), 0/negative = out of stock (tracked/depleted)
        
        inventoryMap.set(count.catalog_object_id, {
          quantity: numericQuantity,
          // Logic: blank/null = in stock (unlimited), 0 or negative = out of stock
          inStock: !isTracked || numericQuantity > 0,
          isTracked: isTracked
        });
      });

      return inventoryMap;
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      return new Map();
    }
  }

  // Sync Square items with local configuration
  async syncMenuItems(localItems: LocalMenuItem[]): Promise<{
    syncedItems: LocalMenuItem[];
    availableSquareItems: SquareMenuItem[];
    errors: string[];
  }> {
    try {
      const squareItems = await this.fetchSquareMenuItems();
      const itemIds = squareItems.map(item => item.id);
      const inventory = await this.getInventoryCounts(itemIds);
      
      const syncedItems: LocalMenuItem[] = [];
      const errors: string[] = [];

      // Update existing local items with Square data
      for (const localItem of localItems) {
        let squareItem: SquareMenuItem | undefined;

        // Find matching Square item by ID or name
        if (localItem.squareId) {
          squareItem = squareItems.find(item => item.id === localItem.squareId);
        }
        
        if (!squareItem) {
          // Try to match by name
          squareItem = squareItems.find(item => 
            this.normalizeItemName(item.name) === this.normalizeItemName(localItem.name)
          );
        }

        if (squareItem) {
          // Sync with Square data
          const inventoryInfo = inventory.get(squareItem.id) || { quantity: 0, inStock: true, isTracked: false };
          syncedItems.push({
            ...localItem,
            squareId: squareItem.id,
            price: squareItem.price, // Use Square price
            image: squareItem.imageUrl || localItem.image, // Use Square image if available
            inStock: inventoryInfo.inStock, // Use correct logic: null/blank = in stock, 0/negative = out of stock
            lastSync: new Date().toISOString()
          });
        } else {
          // Keep local item but mark sync issue
          syncedItems.push(localItem);
          errors.push(`No Square match found for: ${localItem.name}`);
        }
      }

      // Update Square items with inventory status
      const availableSquareItems = squareItems.map(item => {
        const inventoryInfo = inventory.get(item.id) || { quantity: 0, inStock: true, isTracked: false };
        return {
          ...item,
          inStock: inventoryInfo.inStock // Use correct logic: null/blank = in stock, 0/negative = out of stock
        };
      });

      return {
        syncedItems,
        availableSquareItems,
        errors
      };
    } catch (error: any) {
      throw new Error(`Menu sync failed: ${error.message}`);
    }
  }

  private normalizeItemName(name: string): string {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

// Export function for scheduled syncing
export async function syncMenuWithSquare() {
  try {
    console.log('Starting Square menu sync...');
    const syncService = new SquareMenuSyncService();
    
    // Get current featured items to sync
    const { storage } = await import('./storage');
    const featuredItems = await storage.getFeaturedItems();
    
    // Convert to LocalMenuItem format
    const localItems = featuredItems.map(item => ({
      localId: item.localId,
      squareId: item.squareId || '',
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      featured: item.featured,
      inStock: item.inStock,
      lastSync: item.lastSync
    }));

    const syncResult = await syncService.syncMenuItems(localItems);
    
    // Update featured items with sync results
    const updatedFeatured = syncResult.syncedItems.map(item => ({
      localId: item.localId,
      squareId: item.squareId || '',
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      featured: item.featured,
      inStock: item.inStock,
      lastSync: item.lastSync,
      displayOrder: featuredItems.find(f => f.localId === item.localId)?.displayOrder || 0
    }));

    await storage.setFeaturedItems(updatedFeatured);
    
    console.log('Square menu sync completed successfully');
    return {
      success: true,
      syncedItems: syncResult.syncedItems.length,
      message: 'Menu items synced successfully'
    };
  } catch (error) {
    console.error('Square menu sync failed:', error);
    return {
      success: false,
      error: error.message || 'Sync failed'
    };
  }
}