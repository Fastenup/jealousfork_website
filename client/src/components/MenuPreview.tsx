import { Link, useLocation } from "wouter";
import { featuredItemsConfig, getFeaturedItems } from "@/data/featuredItems";
import { useCart } from "@/contexts/CartContext";
import SquareStatusIndicator from "@/components/SquareStatusIndicator";
import FeaturedItemsAdmin from "@/components/FeaturedItemsAdmin";
import AdminLogin from "@/components/AdminLogin";
import { useState } from "react";

interface MenuPreviewProps {
  showAll?: boolean;
}

export default function MenuPreview({ showAll = false }: MenuPreviewProps) {
  // Always show exactly 6 featured items on homepage (including out-of-stock)
  const featuredItems = getFeaturedItems();
  const displayItems = showAll ? featuredItemsConfig : featuredItems;
  const { addItem } = useCart();
  const [, setLocation] = useLocation();
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Admin password (in production, this should be environment variable)
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'jealous2025';

  const handleAdminLogin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setShowLogin(false);
      setShowAdmin(true);
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    setShowAdmin(false);
  };

  const handleManageClick = () => {
    if (isAuthenticated) {
      setShowAdmin(true);
    } else {
      setShowLogin(true);
    }
  };

  const handleOrderNow = (item: typeof featuredItemsConfig[0]) => {
    if (!item.inStock) {
      // Still allow adding out-of-stock items to cart with notification
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category,
        description: item.description
      });
      setLocation('/full-menu');
      return;
    }
    
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description
    });
    setLocation('/full-menu');
  };

  return (
    <section id="menu" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Our Signature <span className="text-gray-600">Creations</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            From Instagram-worthy pancakes to gourmet burgers, every dish is crafted with passion and artisan attention to detail.
          </p>
          <div className="flex flex-col items-center gap-4">
            <SquareStatusIndicator />
            <button
              onClick={handleManageClick}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors underline"
            >
              {isAuthenticated ? 'Manage Featured Items' : 'Admin Login'}
            </button>
          </div>
        </div>
        
        {/* Show exactly 6 featured items with static fallback */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayItems.map((item, index) => (
            <div key={index} className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${!item.inStock ? 'opacity-75' : ''}`}>
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
                {!item.inStock && (
                  <div className="mb-4 px-3 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium">
                    Out of Stock - Still Available to Order
                  </div>
                )}
                
                <button 
                  onClick={() => handleOrderNow(item)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    item.inStock 
                      ? 'bg-gray-900 text-white hover:bg-gray-800' 
                      : 'bg-yellow-600 text-white hover:bg-yellow-700'
                  }`}
                >
                  {item.inStock ? 'Add to Cart' : 'Order (Out of Stock)'}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {!showAll && (
          <div className="text-center">
            <Link href="/full-menu">
              <a className="inline-flex items-center bg-gray-900 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-colors">
                View Full Menu
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </a>
            </Link>
          </div>
        )}
        
        {showLogin && (
          <AdminLogin 
            onLogin={handleAdminLogin}
            onCancel={() => setShowLogin(false)}
          />
        )}
        
        {showAdmin && isAuthenticated && (
          <FeaturedItemsAdmin 
            onClose={handleAdminLogout}
          />
        )}
      </div>
    </section>
  );
}
