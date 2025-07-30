import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function InventoryDebugPanel() {
  const { toast } = useToast();

  // Fetch debug inventory data
  const { data: debugData, isLoading, refetch } = useQuery({
    queryKey: ['/api/debug-inventory'],
    queryFn: async () => {
      const response = await fetch('/api/debug-inventory', { method: 'POST' });
      return response.json();
    },
  });

  // Trigger debug
  const debugMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/debug-inventory', { method: 'POST' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/debug-inventory'] });
      toast({
        title: "Debug Complete",
        description: "Inventory debug data refreshed",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Debug Failed",
        description: error.message || "Could not fetch debug data",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading debug data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Inventory Debug Panel</h3>
        <button
          onClick={() => debugMutation.mutate()}
          disabled={debugMutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {debugMutation.isPending ? 'Refreshing...' : 'Refresh Debug Data'}
        </button>
      </div>

      {debugData && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Debug Summary</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <div>Catalog Items: {debugData.catalogItemsCount}</div>
              <div>Test IDs: {debugData.testIds?.length || 0}</div>
              <div>Inventory Records: {Object.keys(debugData.inventoryMap || {}).length}</div>
            </div>
          </div>

          {/* Test IDs */}
          {debugData.testIds && debugData.testIds.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Test IDs</h4>
              <div className="text-xs text-gray-600 space-y-1">
                {debugData.testIds.map((id: string, index: number) => (
                  <div key={index} className="font-mono">{id}</div>
                ))}
              </div>
            </div>
          )}

          {/* Sample Items */}
          {debugData.sampleItems && debugData.sampleItems.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Sample Items with Inventory</h4>
              {debugData.sampleItems.map((item: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="font-medium text-gray-900">{item.name}</h5>
                      <div className="text-sm text-gray-600">${item.price}</div>
                    </div>
                    <div className="text-xs text-gray-500 font-mono">{item.id}</div>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    {typeof item.inventoryData === 'object' && item.inventoryData !== null ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            item.inventoryData.inStock 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.inventoryData.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                          
                          {item.inventoryData.available !== null && item.inventoryData.available !== undefined ? (
                            <span className="text-blue-600 font-medium">
                              Qty: {item.inventoryData.available}
                            </span>
                          ) : (
                            <span className="text-green-600 font-medium">
                              Unlimited
                            </span>
                          )}
                          
                          <span className="text-gray-500 text-xs">
                            Tracked: {item.inventoryData.isTracked ? 'Yes' : 'No'}
                          </span>
                        </div>
                        
                        {item.inventoryData.rawQuantity !== null && item.inventoryData.rawQuantity !== undefined && (
                          <div className="text-xs text-gray-400">
                            Raw Value: "{item.inventoryData.rawQuantity}"
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-red-600 text-xs">
                        No inventory data: {JSON.stringify(item.inventoryData)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Raw Inventory Map */}
          {debugData.inventoryMap && Object.keys(debugData.inventoryMap).length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Raw Inventory Map</h4>
              <pre className="text-xs text-gray-600 overflow-auto max-h-48">
                {JSON.stringify(debugData.inventoryMap, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {!debugData && (
        <div className="text-center text-gray-500 py-8">
          No debug data available. Click "Refresh Debug Data" to fetch current inventory status.
        </div>
      )}
    </div>
  );
}