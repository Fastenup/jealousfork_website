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

  // Fetch all menu items from Square catalog
  async fetchSquareMenuItems(): Promise<SquareMenuItem[]> {
    try {
      const response = await fetch(`${this.baseUrl}/v2/catalog/list?types=ITEM`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Square-Version': '2024-06-04',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Square API error: ${response.status}`);
      }

      const data = await response.json();
      
      return (data.objects || []).map((item: any) => {
        const itemData = item.item_data;
        const firstVariation = itemData?.variations?.[0];
        const price = firstVariation?.item_variation_data?.price_money?.amount || 0;
        
        return {
          id: item.id,
          name: itemData?.name || 'Unknown Item',
          description: itemData?.description || '',
          price: price / 100, // Convert from cents
          category: this.getCategoryName(itemData?.category_id),
          categoryId: itemData?.category_id,
          variations: itemData?.variations || [],
          inStock: true, // Default to in stock, check inventory separately
          imageUrl: itemData?.image_url
        };
      });
    } catch (error) {
      console.error('Failed to fetch Square menu items:', error);
      throw error;
    }
  }

  // Get inventory counts for items
  async getInventoryCounts(itemIds: string[]): Promise<Map<string, number>> {
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
      const inventoryMap = new Map<string, number>();
      
      (data.counts || []).forEach((count: any) => {
        inventoryMap.set(count.catalog_object_id, parseFloat(count.quantity || '0'));
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
          const inventoryCount = inventory.get(squareItem.id) || 0;
          syncedItems.push({
            ...localItem,
            squareId: squareItem.id,
            price: squareItem.price, // Use Square price
            inStock: inventoryCount > 0,
            lastSync: new Date().toISOString()
          });
        } else {
          // Keep local item but mark sync issue
          syncedItems.push(localItem);
          errors.push(`No Square match found for: ${localItem.name}`);
        }
      }

      // Update Square items with inventory status
      const availableSquareItems = squareItems.map(item => ({
        ...item,
        inStock: (inventory.get(item.id) || 0) > 0
      }));

      return {
        syncedItems,
        availableSquareItems,
        errors
      };
    } catch (error: any) {
      throw new Error(`Menu sync failed: ${error.message}`);
    }
  }

  private getCategoryName(categoryId?: string): string {
    // Map category IDs to readable names
    const categoryMap: Record<string, string> = {
      'pancakes': 'Pancakes',
      'burgers': 'Burgers', 
      'flatbread': 'Flatbreads',
      'appetizers': 'Appetizers',
      'drinks': 'Beverages'
    };
    
    return categoryMap[categoryId || ''] || 'Menu Items';
  }

  private normalizeItemName(name: string): string {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}