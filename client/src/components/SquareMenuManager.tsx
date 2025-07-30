import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface SquareMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
}

interface FeaturedItemConfig {
  localId: number;
  squareId?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  featured: boolean;
  inStock: boolean;
  displayOrder?: number;
}

export default function SquareMenuManager() {
  const [selectedSquareItem, setSelectedSquareItem] = useState<SquareMenuItem | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all Square menu items
  const { data: squareMenu, isLoading: squareLoading } = useQuery({
    queryKey: ['/api/menu'],
  });

  // Fetch current featured items
  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ['/api/featured-items'],
  });

  // Sync featured items with Square
  const syncMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/featured-items/sync', { method: 'POST' });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/featured-items'] });
      toast({
        title: "Sync Complete",
        description: `Updated ${data.syncedItems?.length || 0} items with Square data`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Sync Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Add Square item as featured
  const addFeaturedMutation = useMutation({
    mutationFn: async ({ squareId, localId }: { squareId: string; localId: number }) => {
      return apiRequest('/api/featured-items/add-square-item', { 
        method: 'POST', 
        body: { squareId, localId } 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/featured-items'] });
      setSelectedSquareItem(null);
      toast({
        title: "Featured Item Added",
        description: "Square item successfully added to featured items",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Remove featured item
  const removeFeaturedMutation = useMutation({
    mutationFn: async (localId: number) => {
      return apiRequest(`/api/featured-items/${localId}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/featured-items'] });
      toast({
        title: "Item Removed",
        description: "Featured item removed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Remove Item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update stock status
  const updateStockMutation = useMutation({
    mutationFn: async ({ localId, inStock }: { localId: number; inStock: boolean }) => {
      return apiRequest(`/api/featured-items/${localId}/stock`, {
        method: 'PATCH',
        body: { inStock },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/featured-items'] });
      toast({
        title: "Stock Updated",
        description: "Item stock status updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Stock",
        description: error.message || "Could not update stock status",
        variant: "destructive",
      });
    },
  });

  const handleAddSquareItem = () => {
    if (!selectedSquareItem) return;
    
    const featuredItems = (featuredData as any)?.items || [];
    const nextLocalId = Math.max(...featuredItems.map((item: FeaturedItemConfig) => item.localId), 0) + 1;
    addFeaturedMutation.mutate({
      squareId: selectedSquareItem.id,
      localId: nextLocalId
    });
  };

  const squareItems = (squareMenu as any)?.items || [];
  const featuredItems = (featuredData as any)?.items || [];
  const currentFeaturedCount = featuredItems.filter((item: FeaturedItemConfig) => item.featured).length;

  if (squareLoading || featuredLoading) {
    return <div className="text-sm text-gray-500">Loading menu data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Sync Controls */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-blue-900">Square Synchronization</h3>
          <button
            onClick={() => syncMutation.mutate()}
            disabled={syncMutation.isPending}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {syncMutation.isPending ? 'Syncing...' : 'Sync with Square'}
          </button>
        </div>
        <p className="text-sm text-blue-700">
          Sync featured items with Square catalog to update prices and stock status.
        </p>
      </div>

      {/* Current Featured Items */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">
          Current Featured Items ({currentFeaturedCount}/6)
        </h3>
        
        {featuredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredItems.map((item: FeaturedItemConfig) => (
              <div key={item.localId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-lg font-bold text-green-600">${item.price}</span>
                      {item.squareId && (
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          Square ID: {item.squareId.slice(-8)}
                        </span>
                      )}
                      <div className="flex flex-col">
                        <span className={`text-xs px-2 py-1 rounded ${
                          item.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        {item.available !== null && item.available !== undefined && (
                          <span className="text-xs text-gray-500 mt-1 text-center">
                            Qty: {item.available}
                          </span>
                        )}
                        {(item.available === null || item.available === undefined) && (
                          <span className="text-xs text-blue-500 mt-1 text-center">
                            Unlimited
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFeaturedMutation.mutate(item.localId)}
                    disabled={removeFeaturedMutation.isPending}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="flex items-center gap-2 mt-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.inStock}
                      onChange={(e) => updateStockMutation.mutate({
                        localId: item.localId,
                        inStock: e.target.checked
                      })}
                      className="rounded border-gray-300"
                    />
                    In Stock
                  </label>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 p-4 border border-gray-200 rounded-lg text-center">
            No featured items configured
          </div>
        )}
      </div>

      {/* Add Square Items */}
      {currentFeaturedCount < 6 && (
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Add Square Menu Items</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
              {squareItems.length > 0 ? (
                squareItems.map((item: SquareMenuItem) => {
                  const isAlreadyFeatured = featuredItems.some((featured: FeaturedItemConfig) => 
                    featured.squareId === item.id
                  );

                  return (
                    <div
                      key={item.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        selectedSquareItem?.id === item.id
                          ? 'border-blue-500 bg-blue-50'
                          : isAlreadyFeatured
                          ? 'border-gray-200 bg-gray-50 opacity-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => !isAlreadyFeatured && setSelectedSquareItem(item)}
                    >
                      <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-medium text-green-600">${item.price}</span>
                        <div className="flex flex-col items-end">
                          <span className={`text-xs px-2 py-1 rounded ${
                            item.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {item.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                          {item.available !== null && item.available !== undefined && (
                            <span className="text-xs text-gray-500 mt-1">
                              Qty: {item.available}
                            </span>
                          )}
                          {(item.available === null || item.available === undefined) && (
                            <span className="text-xs text-blue-500 mt-1">
                              Unlimited
                            </span>
                          )}
                        </div>
                      </div>
                      {isAlreadyFeatured && (
                        <div className="text-xs text-gray-500 mt-2">Already featured</div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-sm text-gray-500 text-center py-8">
                  No Square menu items found
                </div>
              )}
            </div>

            {selectedSquareItem && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Selected: {selectedSquareItem.name}</h4>
                    <p className="text-sm text-gray-600">${selectedSquareItem.price} • {selectedSquareItem.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedSquareItem(null)}
                      className="px-3 py-1 text-sm text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddSquareItem}
                      disabled={addFeaturedMutation.isPending}
                      className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {addFeaturedMutation.isPending ? 'Adding...' : 'Add to Featured'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}