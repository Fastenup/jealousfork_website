import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface SquareMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  available?: number | null;
  image?: string | null;
  squareId: string;
  variations: Array<{
    id: string;
    name?: string;
    price: number;
    sku?: string;
  }>;
}

export interface MenuResponse {
  success: boolean;
  items: SquareMenuItem[];
  error?: string;
}

// Hook to fetch dynamic menu from Square API
export function useSquareMenu() {
  return useQuery({
    queryKey: ['/api/menu'],
    queryFn: async (): Promise<SquareMenuItem[]> => {
      try {
        const response = await apiRequest('GET', '/api/menu');
        const data: MenuResponse = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch menu');
        }
        
        return data.items;
      } catch (error) {
        console.warn('Square API unavailable, falling back to static menu');
        // Fallback to empty array - components will handle this gracefully
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
}

// Hook to fetch menu by category
export function useSquareMenuCategory(category: string) {
  return useQuery({
    queryKey: ['/api/menu', category],
    queryFn: async (): Promise<SquareMenuItem[]> => {
      try {
        const response = await apiRequest('GET', `/api/menu/${category}`);
        const data: MenuResponse = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch category menu');
        }
        
        return data.items;
      } catch (error) {
        console.warn(`Square API unavailable for category ${category}`);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 2,
  });
}

// Hook to check inventory for specific items
export function useInventoryCheck() {
  const queryClient = useQueryClient();
  
  return {
    checkInventory: async (itemIds: string[]) => {
      try {
        const response = await apiRequest('POST', '/api/inventory/check', { itemIds });
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to check inventory');
        }
        
        return data.inventory;
      } catch (error) {
        console.warn('Inventory check failed:', error);
        return {};
      }
    },
    
    invalidateMenuCache: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu'] });
    }
  };
}

// Helper to convert Square menu item to legacy format for compatibility
export function convertSquareItemToLegacy(item: SquareMenuItem) {
  return {
    id: parseInt(item.id.replace(/[^0-9]/g, '')) || Math.floor(Math.random() * 10000),
    name: item.name,
    slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: item.description,
    price: item.price,
    category: item.category,
    image: item.image || `https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center`,
    inStock: item.inStock,
    available: item.available,
    squareId: item.squareId
  };
}