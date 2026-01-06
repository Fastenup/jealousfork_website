// Aggressive server-side caching to reduce Square API costs
// Cache menu data for hours, only refresh on scheduled syncs

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, ttlMinutes: number = 60): void {
    const ttl = ttlMinutes * 60 * 1000; // Convert to milliseconds
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
    console.log(`Cached ${key} for ${ttlMinutes} minutes`);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
    console.log(`Invalidated cache for ${key}`);
  }

  invalidatePattern(pattern: string): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => 
      key.includes(pattern)
    );
    
    keysToDelete.forEach(key => this.cache.delete(key));
    console.log(`Invalidated ${keysToDelete.length} cache entries matching ${pattern}`);
  }

  clear(): void {
    this.cache.clear();
    console.log('Cleared all cache entries');
  }

  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Global cache instance
export const serverCache = new MemoryCache();

// Cache keys
export const CACHE_KEYS = {
  SQUARE_CATALOG: 'square_catalog_items',
  SQUARE_INVENTORY: 'square_inventory_',
  FEATURED_ITEMS: 'featured_items',
  MENU_CATEGORY: 'menu_category_',
  SQUARE_STATUS: 'square_status',
  OPERATING_HOURS: 'operating_hours'
} as const;