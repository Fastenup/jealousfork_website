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

interface MenuSection {
  id: number;
  name: string;
  description: string;
  operatingHours: string;
  operatingDays: string;
  isOpen: boolean;
  items: MenuItem[];
}

function isTimeInRange(startTime: string, endTime: string, currentTime: Date): boolean {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const start = new Date(currentTime);
  start.setHours(startHour, startMin, 0, 0);
  
  const end = new Date(currentTime);
  end.setHours(endHour, endMin, 0, 0);
  
  return currentTime >= start && currentTime <= end;
}

function isDayInRange(operatingDays: string, currentDay: number): boolean {
  const dayMap = { 0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday' };
  const currentDayName = dayMap[currentDay as keyof typeof dayMap];
  
  if (operatingDays.includes('Monday') && currentDay === 1) return false; // Closed Mondays
  if (operatingDays.includes('Tuesday - Sunday') && currentDay >= 2) return true;
  if (operatingDays.includes('Friday - Saturday') && (currentDay === 5 || currentDay === 6)) return true;
  
  return operatingDays.includes(currentDayName);
}

export default function FullMenuPage() {
  const { addItem } = useCart();
  const [currentTime] = useState(new Date());
  
  // Fetch all menu items with real-time Square sync
  const { data: menuData, isLoading, error } = useQuery({
    queryKey: ['/api/menu'],
    refetchInterval: false, // Disable automatic polling
  });

  const menuItems: MenuItem[] = menuData?.items || [];

  // Create time-based menu sections with Square items
  const menuSections: MenuSection[] = [
    {
      id: 1,
      name: "Jealous Fork",
      description: "Miami's Original Artisan Pancake Restaurant",
      operatingHours: "9:00 AM - 3:00 PM",
      operatingDays: "Tuesday - Sunday",
      isOpen: isDayInRange("Tuesday - Sunday", currentTime.getDay()) && 
              isTimeInRange("09:00", "15:00", currentTime),
      items: menuItems.filter(item => 
        item.category === 'pancakes' || 
        item.category === 'flatbread' || 
        item.name.toLowerCase().includes('pancake') ||
        item.name.toLowerCase().includes('flatbread')
      )
    },
    {
      id: 2,
      name: "Jealous Burger",
      description: "Gourmet Burgers & Evening Specialties",
      operatingHours: "5:00 PM - 9:00 PM",
      operatingDays: "Friday - Saturday",
      isOpen: isDayInRange("Friday - Saturday", currentTime.getDay()) && 
              isTimeInRange("17:00", "21:00", currentTime),
      items: menuItems.filter(item => 
        item.category === 'burgers' || 
        item.name.toLowerCase().includes('burger')
      )
    },
    {
      id: 3,
      name: "Beverages",
      description: "Cocktails, Coffee, Beer & Wine",
      operatingHours: "Variable by location",
      operatingDays: "Tuesday - Sunday",
      isOpen: isDayInRange("Tuesday - Sunday", currentTime.getDay()),
      items: menuItems.filter(item => 
        item.category === 'beverages' || 
        item.category === 'cocktails' ||
        item.category === 'coffee' ||
        item.name.toLowerCase().includes('drink') ||
        item.name.toLowerCase().includes('coffee')
      )
    }
  ];

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
        description="Browse our complete menu featuring Jealous Fork artisan pancakes (Tue-Sun 9AM-3PM), Jealous Burger gourmet selections (Fri-Sat 5PM-9PM), and beverages. Real-time pricing and availability."
        canonical="https://jealousfork.com/menu"
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
              Time-based menus with real-time pricing and availability
            </p>
          </div>
        </section>

        {/* Menu Sections */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                <p className="mt-4 text-gray-600">Loading menu sections...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-600">Failed to load menu. Please try again.</p>
              </div>
            )}

            {/* Menu Sections */}
            {!isLoading && !error && (
              <div className="space-y-16">
                {menuSections.map((section) => (
                  <div key={section.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Section Header */}
                    <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white p-8">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-3xl font-bold mb-2">{section.name}</h2>
                          <p className="text-gray-300 mb-4">{section.description}</p>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">Hours:</span>
                              <span>{section.operatingHours}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400">Days:</span>
                              <span>{section.operatingDays}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                            section.isOpen
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                          }`}>
                            {section.isOpen ? 'OPEN NOW' : 'CLOSED'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section Items */}
                    <div className="p-8">
                      {section.items.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {section.items.map((item) => (
                            <div key={item.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
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
                                    {item.inStock ? 'Available' : 'Out of Stock'}
                                  </span>
                                </div>

                                <button
                                  onClick={() => handleAddToCart(item)}
                                  disabled={!item.inStock || !section.isOpen}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    item.inStock && section.isOpen
                                      ? 'bg-black text-white hover:bg-gray-800'
                                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                  }`}
                                >
                                  {!section.isOpen ? 'Closed' : 
                                   !item.inStock ? 'Unavailable' : 'Add to Cart'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-gray-600">
                            No items available in this section. Check back during operating hours.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Operating Hours Info */}
            <div className="mt-16 bg-gray-900 text-white rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Operating Hours</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <h4 className="text-lg font-semibold text-green-400 mb-2">Jealous Fork</h4>
                  <p className="text-gray-300">Tuesday - Sunday</p>
                  <p className="text-gray-300">9:00 AM - 3:00 PM</p>
                  <p className="text-sm text-gray-400 mt-2">Artisan Pancakes & Breakfast</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-400 mb-2">Jealous Burger</h4>
                  <p className="text-gray-300">Friday - Saturday</p>
                  <p className="text-gray-300">5:00 PM - 9:00 PM</p>
                  <p className="text-sm text-gray-400 mt-2">Gourmet Burgers & Dinner</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-400 mb-2">Beverages</h4>
                  <p className="text-gray-300">Tuesday - Sunday</p>
                  <p className="text-gray-300">Variable Hours</p>
                  <p className="text-sm text-gray-400 mt-2">Cocktails, Coffee, Beer & Wine</p>
                </div>
              </div>
              <p className="text-center text-red-400 mt-6 font-medium">
                CLOSED MONDAYS
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}