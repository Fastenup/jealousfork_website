import { useSquareMenu, convertSquareItemToLegacy } from '@/hooks/useSquareMenu';
import { jealousForkMenuItems } from '@/data/jealousForkmenuData';
import { useState, useEffect } from 'react';

interface MenuItemProps {
  item: any;
  onAddToCart: (item: any) => void;
}

function MenuItemCard({ item, onAddToCart }: MenuItemProps) {
  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${!item.inStock ? 'opacity-75' : ''}`}>
      <img 
        src={item.image} 
        alt={item.name} 
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-playfair text-xl font-semibold text-gray-900">{item.name}</h3>
          <span className="text-2xl font-bold text-gray-900">${item.price}</span>
        </div>
        <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>
        
        {/* Stock Status */}
        {!item.inStock ? (
          <div className="mb-4 px-3 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium">
            Out of Stock
          </div>
        ) : item.available && item.available < 5 ? (
          <div className="mb-4 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium">
            Only {item.available} left!
          </div>
        ) : null}
        
        <button 
          onClick={() => onAddToCart(item)}
          disabled={!item.inStock}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
            item.inStock 
              ? 'bg-gray-900 text-white hover:bg-gray-800' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {item.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}

interface DynamicMenuDisplayProps {
  category?: string;
  onAddToCart: (item: any) => void;
}

export default function DynamicMenuDisplay({ category, onAddToCart }: DynamicMenuDisplayProps) {
  const { data: squareItems, isLoading, error } = useSquareMenu();
  const [menuItems, setMenuItems] = useState(jealousForkMenuItems);
  const [isUsingSquareAPI, setIsUsingSquareAPI] = useState(false);

  useEffect(() => {
    if (squareItems && squareItems.length > 0) {
      // Successfully got data from Square API
      const convertedItems = squareItems.map(convertSquareItemToLegacy);
      setMenuItems(convertedItems);
      setIsUsingSquareAPI(true);
    } else if (!isLoading && error) {
      // Fallback to static menu data
      setMenuItems(jealousForkMenuItems);
      setIsUsingSquareAPI(false);
    }
  }, [squareItems, isLoading, error]);

  // Filter by category if specified
  const filteredItems = category 
    ? menuItems.filter(item => item.category === category)
    : menuItems;

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
            <div className="w-full h-48 bg-gray-200"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* API Status Indicator */}
      <div className="mb-6">
        {isUsingSquareAPI ? (
          <div className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium inline-block">
            ✓ Live menu with real-time inventory
          </div>
        ) : (
          <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium inline-block">
            ⚠ Using static menu data (Square API unavailable)
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <MenuItemCard 
            key={item.squareId || item.id} 
            item={item} 
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}