import { useState } from 'react';
import { featuredItemsConfig, setItemFeatured, setItemStock } from '@/data/featuredItems';

interface FeaturedItemsAdminProps {
  onClose: () => void;
}

export default function FeaturedItemsAdmin({ onClose }: FeaturedItemsAdminProps) {
  const [items, setItems] = useState(featuredItemsConfig);

  const handleToggleFeatured = (itemId: number) => {
    setItemFeatured(itemId, !items.find(item => item.id === itemId)?.featured);
    setItems([...featuredItemsConfig]); // Trigger re-render
  };

  const handleToggleStock = (itemId: number) => {
    setItemStock(itemId, !items.find(item => item.id === itemId)?.inStock);
    setItems([...featuredItemsConfig]); // Trigger re-render
  };

  const featuredCount = items.filter(item => item.featured).length;

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
            {items.map((item) => (
              <div
                key={item.id}
                className={`border rounded-lg p-4 transition-all ${
                  item.featured ? 'border-green-300 bg-green-50' : 'border-gray-200'
                }`}
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
                    
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={item.featured}
                          onChange={() => handleToggleFeatured(item.id)}
                          className="rounded text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm font-medium">Featured on Homepage</span>
                      </label>
                      
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={item.inStock}
                          onChange={() => handleToggleStock(item.id)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium">In Stock</span>
                      </label>
                      
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {item.category}
                      </span>
                      
                      {item.lastUpdated && (
                        <span className="text-xs text-gray-500">
                          Updated: {item.lastUpdated}
                        </span>
                      )}
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