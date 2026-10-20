// Square Menu Synchronization Service
// Handles real-time sync between Square catalog and local menu items

export interface Modifier {
  id: string;
  name: string;
  price: number;
}

export interface ModifierList {
  id: string;
  name: string;
  selectionType: 'SINGLE' | 'MULTIPLE';
  modifiers: Modifier[];
}

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
  modifierLists?: ModifierList[];
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


// ---- Availability filtering (what is actually sellable at our Square location) ----
const MENU_CACHE_TTL_MS = 5 * 60 * 1000; // auto-refresh: at most 5 min stale

function presentAt(obj: any, locationId?: string): boolean {
  if (!locationId) return true;
  if (obj.is_deleted) return false;
  if (obj.present_at_all_locations) {
    return !(obj.absent_at_location_ids || []).includes(locationId);
  }
  return (obj.present_at_location_ids || []).includes(locationId);
}

function variationSoldOut(v: any, locationId?: string): boolean {
  return (v.item_variation_data?.location_overrides || []).some(
    (o: any) => (!locationId || o.location_id === locationId) && o.sold_out === true
  );
}

// Variations a guest can actually order right now (present at location, not sold out)
export function getSellableVariations(item: any, locationId = process.env.SQUARE_LOCATION_ID): any[] {
  return (item.item_data?.variations || []).filter(
    (v: any) => presentAt(v, locationId) && !variationSoldOut(v, locationId)
  );
}

// Item shows on the website only if live in Square: not deleted/archived, present at our
// location, not hidden from online (ecom_visibility), has a real name, and at least one
// variation is present and not sold out.
export function isItemSellable(item: any, locationId = process.env.SQUARE_LOCATION_ID): boolean {
  const d = item?.item_data;
  if (!d || item.is_deleted || d.is_archived) return false;
  if (!presentAt(item, locationId)) return false;
  if (d.ecom_visibility === 'HIDDEN' || d.ecom_visibility === 'UNAVAILABLE') return false;
  const name = (d.name || '').trim();
  if (name.length < 2 || /^[.\-_\s]+$/.test(name)) return false;
  return getSellableVariations(item, locationId).length > 0;
}

let menuCache: { items: SquareMenuItem[]; ts: number } | null = null;
let menuInflight: Promise<SquareMenuItem[]> | null = null;

// Called by the Square catalog.version.updated webhook so changes show up immediately
export function invalidateMenuCache() {
  menuCache = null;
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

  // Square /catalog/list returns ~100 objects per page; follow the cursor to get everything
  private async listAll(type: string): Promise<{ objects: any[] }> {
    const objects: any[] = [];
    let cursor: string | undefined;
    do {
      const url = `${this.baseUrl}/v2/catalog/list?types=${type}` + (cursor ? `&cursor=${encodeURIComponent(cursor)}` : '');
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Square-Version': '2024-06-04',
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error(`Square API error: ${res.status} (${type})`);
      const data = await res.json();
      objects.push(...(data.objects || []));
      cursor = data.cursor;
    } while (cursor);
    return { objects };
  }

  // Fetch all menu items from Square catalog with images, categories, and modifiers
  async fetchSquareMenuItems(): Promise<SquareMenuItem[]> {
    if (menuCache && Date.now() - menuCache.ts < MENU_CACHE_TTL_MS) return menuCache.items;
    if (menuInflight) return menuInflight;
    menuInflight = this.fetchSquareMenuItemsUncached()
      .then(items => { menuCache = { items, ts: Date.now() }; return items; })
      .catch(err => {
        if (menuCache) { console.error('Square fetch failed, serving last good menu:', err); return menuCache.items; }
        throw err;
      })
      .finally(() => { menuInflight = null; });
    return menuInflight;
  }

  private async fetchSquareMenuItemsUncached(): Promise<SquareMenuItem[]> {
    try {
      // Fetch items, images, categories, and modifier lists in parallel
      const [itemsData, imagesData, categoriesData, modifierListsData] = await Promise.all([
        this.listAll('ITEM'),
        this.listAll('IMAGE'),
        this.listAll('CATEGORY'),
        this.listAll('MODIFIER_LIST')
      ]);

      // Build image map from Square images
      const imageMap = new Map<string, string>();
      {
        (imagesData.objects || []).forEach((image: any) => {
          if (image.image_data?.url) {
            imageMap.set(image.id, image.image_data.url);
          }
        });
        console.log(`Found ${imageMap.size} Square images for menu items`);
      }

      // Build category map from Square categories
      const categoryMap = new Map<string, string>();
      {
        (categoriesData.objects || []).forEach((cat: any) => {
          if (cat.category_data?.name) {
            categoryMap.set(cat.id, cat.category_data.name);
          }
        });
        console.log(`Found ${categoryMap.size} Square categories`);
      }

      // Build modifier list map from Square modifier lists
      const modifierListMap = new Map<string, ModifierList>();
      {
        const modListData = modifierListsData;
        (modListData.objects || []).forEach((modList: any) => {
          const modListInfo = modList.modifier_list_data;
          if (modListInfo) {
            modifierListMap.set(modList.id, {
              id: modList.id,
              name: modListInfo.name || 'Options',
              selectionType: modListInfo.selection_type === 'SINGLE' ? 'SINGLE' : 'MULTIPLE',
              modifiers: (modListInfo.modifiers || []).map((mod: any) => ({
                id: mod.id,
                name: mod.modifier_data?.name || 'Option',
                price: (mod.modifier_data?.price_money?.amount || 0) / 100
              }))
            });
          }
        });
        console.log(`Found ${modifierListMap.size} Square modifier lists`);
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

      const sellable = (itemsData.objects || []).filter((item: any) => isItemSellable(item));
      console.log(`Square menu: ${sellable.length} sellable of ${(itemsData.objects || []).length} catalog items`);

      return sellable.map((item: any) => {
        const itemData = item.item_data;
        const liveVariations = getSellableVariations(item);
        const firstVariation = liveVariations[0];
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

        // Get modifier lists for this item
        const modifierListInfo = itemData?.modifier_list_info || [];
        const itemModifierLists = modifierListInfo
          .map((mlInfo: any) => modifierListMap.get(mlInfo.modifier_list_id))
          .filter((ml: ModifierList | undefined): ml is ModifierList => ml !== undefined);

        return {
          id: item.id,
          name: itemData?.name || 'Unknown Item',
          description: itemData?.description || '',
          price: price / 100, // Convert from cents
          category: categoryName,
          categoryId: categoryId,
          variations: liveVariations,
          inStock: true, // Default to in stock, check inventory separately
          imageUrl: realImageUrl || itemData?.image_url, // Use Square image first, fallback to any existing URL
          imageIds: imageIds,
          hasSquareImage: !!realImageUrl,
          modifierLists: itemModifierLists.length > 0 ? itemModifierLists : undefined
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
  } catch (error: any) {
    console.error('Square menu sync failed:', error);
    return {
      success: false,
      error: error.message || 'Sync failed'
    };
  }
}