import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { menuItems } from '@/data/menuData';
import { jealousForkMenuItems, jealousForkCategories } from '@/data/jealousForkmenuData';
import { jealousBurgerMenuItems, jealousBurgerCategories } from '@/data/jealousBurgerMenuData';
import { beverageMenuItems, beverageCategories } from '@/data/beverageMenuData';
import SEOHead from '@/components/SEOHead';

type MenuType = 'featured' | 'jealous-fork' | 'jealous-burger' | 'beverages';

export default function FullMenuPage() {
  const [selectedMenu, setSelectedMenu] = useState<MenuType>('featured');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get current time to determine which menu to show by default
  const currentHour = new Date().getHours();
  const currentDay = new Date().getDay(); // 0 = Sunday, 5 = Friday, 6 = Saturday
  const isJealousForkTime = currentHour >= 9 && currentHour < 15 && currentDay !== 1; // 9 AM - 3 PM, not Monday
  const isJealousBurgerTime = (currentHour >= 17 && currentHour < 21) && (currentDay === 5 || currentDay === 6); // Fri/Sat 5-9 PM

  const getMenuData = () => {
    switch (selectedMenu) {
      case 'jealous-fork':
        return {
          items: jealousForkMenuItems,
          categories: jealousForkCategories,
          title: 'Jealous Fork Menu',
          subtitle: 'Tuesday - Sunday: 9:00 AM - 3:00 PM',
          description: 'Award-winning pancakes, signature sandwiches, and brunch favorites'
        };
      case 'jealous-burger':
        return {
          items: jealousBurgerMenuItems,
          categories: jealousBurgerCategories,
          title: 'Jealous Burger Menu',
          subtitle: 'Friday & Saturday: 5:00 PM - 9:00 PM',
          description: 'Gourmet burgers and evening favorites'
        };
      case 'beverages':
        return {
          items: beverageMenuItems,
          categories: beverageCategories,
          title: 'Beverages & Coffee',
          subtitle: 'Available during all operating hours',
          description: 'Craft cocktails, specialty coffee, beer & wine'
        };
      default:
        return {
          items: menuItems,
          categories: [
            { id: 'all', name: 'Featured Items', description: 'Our most popular dishes' },
            { id: 'pancakes', name: 'Pancakes', description: 'Sweet breakfast favorites' },
            { id: 'burgers', name: 'Burgers', description: 'Gourmet burger selections' },
            { id: 'breakfast', name: 'Breakfast', description: 'Morning specialties' }
          ],
          title: 'Featured Menu',
          subtitle: 'Our most popular dishes',
          description: 'Highlighting the best from both our day and evening menus'
        };
    }
  };

  const { items, categories, title, subtitle, description } = getMenuData();
  
  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  return (
    <>
      <SEOHead
        title="Full Menu - Jealous Fork | Miami's Premier Pancake Restaurant"
        description="Explore our complete menu of award-winning pancakes, gourmet burgers, and specialty beverages. Made fresh daily with premium ingredients in Miami, FL."
        canonical="/full-menu"
        keywords="pancakes menu, burgers, breakfast, Miami restaurant menu, artisan pancakes, cocktails, coffee"
      />
      
      <Navigation />
      
      <main className="pt-16">
        <div className="min-h-screen bg-white">
          {/* Header */}
          <div className="bg-gray-50 py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="font-playfair text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                {title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                {subtitle}
              </p>
              <p className="text-lg text-gray-500 leading-relaxed">
                {description}
              </p>
              
              {/* Operating Hours Notice */}
              <div className="mt-8 p-4 bg-gray-100 rounded-lg inline-block">
                <div className="text-sm text-gray-700">
                  <p><strong>Jealous Fork:</strong> Tuesday - Sunday: 9:00 AM - 3:00 PM</p>
                  <p><strong>Jealous Burger:</strong> Friday & Saturday: 5:00 PM - 9:00 PM</p>
                  <p className="text-gray-500 mt-1">Closed Mondays</p>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Menu Type Selector */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                { id: 'featured', label: 'Featured Items', available: true },
                { id: 'jealous-fork', label: 'Jealous Fork Menu', available: true, highlight: isJealousForkTime },
                { id: 'jealous-burger', label: 'Jealous Burger Menu', available: true, highlight: isJealousBurgerTime },
                { id: 'beverages', label: 'Beverages & Coffee', available: true }
              ].map((menu) => (
                <button
                  key={menu.id}
                  onClick={() => {
                    setSelectedMenu(menu.id as MenuType);
                    setSelectedCategory('all');
                  }}
                  className={`px-6 py-3 rounded-full font-semibold transition-colors relative ${
                    selectedMenu === menu.id
                      ? 'bg-gray-900 text-white'
                      : menu.highlight
                      ? 'bg-gray-600 text-white hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {menu.label}
                  {menu.highlight && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      OPEN
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Menu Items Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  <div className="aspect-w-16 aspect-h-12">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-playfair text-xl font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <span className="font-bold text-gray-900 text-lg">
                        ${typeof item.price === 'number' ? item.price : item.price}
                      </span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                    
                    {/* Dietary indicators for Jealous Fork items */}
                    {'dietary' in item && item.dietary && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.dietary.map((diet) => (
                          <span key={diet} className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            {diet === 'gluten-free-option' ? 'GF Option' : diet === 'vegan' ? 'Vegan' : diet}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Beverage type indicators */}
                    {'type' in item && item.type && (
                      <div className="mt-3">
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                          {item.type}
                        </span>
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        item.category === 'pancakes' ? 'bg-blue-100 text-blue-800' :
                        item.category === 'burgers' ? 'bg-red-100 text-red-800' :
                        item.category === 'starters' ? 'bg-purple-100 text-purple-800' :
                        item.category === 'sandwiches' ? 'bg-orange-100 text-orange-800' :
                        item.category === 'cocktails' ? 'bg-pink-100 text-pink-800' :
                        item.category === 'coffee' ? 'bg-yellow-100 text-yellow-800' :
                        item.category === 'beer' ? 'bg-amber-100 text-amber-800' :
                        item.category === 'wine' ? 'bg-red-100 text-red-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1).replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No items found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
}