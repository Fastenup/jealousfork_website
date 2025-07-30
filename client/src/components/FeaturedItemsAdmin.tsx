import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface FeaturedItemsAdminProps {
  onClose: () => void;
  embedded?: boolean;
}

export default function FeaturedItemsAdmin({ onClose, embedded = false }: FeaturedItemsAdminProps) {
  const { toast } = useToast();

  // Fetch real-time featured items from API
  const { data: featuredData, isLoading } = useQuery({
    queryKey: ['/api/featured-items'],
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

  const items = (featuredData as any)?.items || [];
  const featuredCount = items.filter((item: any) => item.featured).length;

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading featured items...</div>;
  }

  if (embedded) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const isFeatured = item.featured;
            const featuredCount = items.filter(i => i.featured).length;

            return (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-green-600">${item.price}</span>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={item.inStock}
                        onChange={(e) => updateStockMutation.mutate({ 
                          localId: item.localId, 
                          inStock: e.target.checked 
                        })}
                        disabled={updateStockMutation.isPending}
                        className="rounded border-gray-300"
                      />
                      In Stock
                    </label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {item.squareId && (
                    <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded text-center">
                      Square ID: {item.squareId.slice(-8)}
                    </div>
                  )}
                  <button
                    onClick={() => removeFeaturedMutation.mutate(item.localId)}
                    disabled={removeFeaturedMutation.isPending}
                    className="w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    Remove from Featured
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Featured Items Management</h2>
              <p className="text-gray-600 mt-1">
                Control which items appear on homepage ({featuredCount}/6 featured)
              </p>
              <div className="text-xs text-green-600 mt-1 font-medium">
                ✓ Admin Authenticated
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-4">
            {items.map((item: any) => (
              <div
                key={item.localId}
                className="border border-green-300 bg-green-50 rounded-lg p-4 transition-all"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <span className="text-lg font-bold text-gray-900">${item.price}</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={item.inStock}
                          onChange={(e) => updateStockMutation.mutate({ 
                            localId: item.localId, 
                            inStock: e.target.checked 
                          })}
                          disabled={updateStockMutation.isPending}
                          className="rounded border-gray-300"
                        />
                        In Stock
                      </label>
                      
                      <div className="flex items-center gap-2">
                        {item.squareId && (
                          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                            Square ID: {item.squareId.slice(-8)}
                          </span>
                        )}
                        <button
                          onClick={() => removeFeaturedMutation.mutate(item.localId)}
                          disabled={removeFeaturedMutation.isPending}
                          className="px-3 py-1 rounded text-sm font-medium transition-colors bg-red-100 text-red-700 hover:bg-red-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Square API Integration Notes:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Real-time sync: Menu changes update immediately when Square API is connected</li>
              <li>• Manual override: You can manually set stock status until next Square sync</li>
              <li>• Pricing: Prices sync automatically from Square when API is available</li>
              <li>• Inventory: Stock levels update in real-time from your Square dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}