import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import SEOHead from '@/components/SEOHead';
import { useCart } from '@/contexts/CartContext';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
}

export default function FullMenuPage() {
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Fetch all menu items with real-time Square sync
  const { data: menuData, isLoading, error } = useQuery({
    queryKey: ['/api/menu'],
    refetchInterval: 60000, // Refresh every minute for menu updates
  });

  const menuItems: MenuItem[] = menuData?.items || [];
  const categories = ['all', ...new Set(menuItems.map(item => item.category))];
  
  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      squareId: item.id,
      inStock: item.inStock
    });
  };

  return (
    <>
      <SEOHead 
        title="Full Menu - Jealous Fork Miami"
        description="Browse our complete menu of artisan pancakes, gourmet burgers, and breakfast specialties. Real-time pricing and availability."
      />
      
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        {/* Hero Section */}
        <section className="bg-black text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our Complete Menu
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Real-time menu with current pricing and availability
            </p>
            {menuData?.source && (
              <div className="mt-4 text-sm text-green-400">
                Live sync with Square: {menuData.source} • {menuData.count} items
              </div>
            )}
          </div>
        </section>

        {/* Menu Categories */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {category === 'all' ? 'All Items' : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                <p className="mt-4 text-gray-600">Loading menu items...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-600">Failed to load menu items. Please try again.</p>
              </div>
            )}

            {/* Menu Items Grid */}
            {!isLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-green-600">
                            ${item.price}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            item.inStock
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>

                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.inStock}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            item.inStock
                              ? 'bg-black text-white hover:bg-gray-800'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {item.inStock ? 'Add to Cart' : 'Unavailable'}
                        </button>
                      </div>

                      {/* Square ID for ordering reference */}
                      <div className="mt-3 text-xs text-gray-400">
                        Item ID: {item.id.slice(-8)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No items found in this category.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}