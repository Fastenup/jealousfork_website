import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import SEOHead from '@/components/SEOHead';
import { useCart } from '@/contexts/CartContext';
import { Modifier, generateCartLineId } from '@/services/squareService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ModifierList {
  id: string;
  name: string;
  selectionType: 'SINGLE' | 'MULTIPLE';
  modifiers: Modifier[];
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  categoryId?: string;
  inStock: boolean;
  imageUrl?: string;
  modifierLists?: ModifierList[];
}

interface CategoryInfo {
  id: string;
  name: string;
  description?: string;
  operatingHours?: string;
  operatingDays?: string;
}

// Category configuration with display info - keys match Square category names (lowercased)
const categoryConfig: Record<string, CategoryInfo> = {
  // Jealous Fork Food Categories
  'starters & shareable': { id: 'starters', name: 'Starters & Shareable', description: 'Perfect for sharing or starting your meal' },
  'award-winning pancakes': { id: 'pancakes', name: 'Award-Winning Pancakes', description: 'Our signature pancakes that made us famous' },
  'sandwiches, buns, & bread': { id: 'sandwiches', name: 'Sandwiches, Buns & Bread', description: 'Hearty sandwiches and gourmet burgers' },
  // Jealous Burger Categories (Fri-Sat 3PM-9PM)
  'apps': { id: 'apps', name: 'Appetizers', description: 'Start your evening right', operatingHours: '3PM-9PM', operatingDays: 'Fri-Sat' },
  'burgers': { id: 'burgers', name: 'Gourmet Burgers', description: 'Our signature evening burgers', operatingHours: '3PM-9PM', operatingDays: 'Fri-Sat' },
  'fries': { id: 'fries', name: 'Fries', description: 'Perfect sides for any burger', operatingHours: '3PM-9PM', operatingDays: 'Fri-Sat' },
  // Beverage Categories
  'cocktails': { id: 'cocktails', name: 'Cocktails', description: 'Unique sake-based cocktails and classic favorites' },
  'hot & cold n/a bev': { id: 'na-bev', name: 'Hot & Cold Beverages', description: 'Coffee, tea, and non-alcoholic drinks' },
  // Beer Categories
  'pilsner, lager & misc': { id: 'pilsner-lager', name: 'Pilsner, Lager & More', description: 'Crisp, refreshing beers' },
  'ale': { id: 'ale', name: 'Ales', description: 'Hoppy and flavorful ales' },
  'porter & stout': { id: 'porter-stout', name: 'Porter & Stout', description: 'Rich, dark beers' },
  'wit, weiss & wheat': { id: 'wheat', name: 'Wheat Beers', description: 'Light and refreshing wheat beers' },
  // Wine Categories
  'sparkling & white wine': { id: 'white-wine', name: 'Sparkling & White Wine', description: 'Light and refreshing wines' },
  // Non-alcoholic
  'soda & water': { id: 'soda-water', name: 'Soda & Water', description: 'Refreshing non-alcoholic options' },
  // Fallback
  'menu items': { id: 'menu-items', name: 'Menu Items', description: 'More delicious options' },
};

// Default fallback image
const fallbackImage = 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop';

export default function FullMenuPage() {
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState<string>('');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const navRef = useRef<HTMLDivElement>(null);

  // Customization dialog state
  const [customizeItem, setCustomizeItem] = useState<MenuItem | null>(null);
  const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Fetch all menu items with real-time Square sync
  const { data: menuData, isLoading, error } = useQuery({
    queryKey: ['/api/menu'],
    refetchInterval: false,
  });

  const menuItems: MenuItem[] = menuData?.items || [];

  // Group items by category
  const categorizedItems = menuItems.reduce<Record<string, MenuItem[]>>((acc, item) => {
    const category = item.category?.toLowerCase() || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  // Get ordered categories that have items - matches actual Square category names (lowercased)
  const orderedCategories = [
    // Jealous Fork Food (Tue-Sun daytime)
    'starters & shareable', 'award-winning pancakes', 'sandwiches, buns, & bread',
    // Jealous Burger (Fri-Sat evening)
    'apps', 'burgers', 'fries',
    // Beverages
    'cocktails', 'hot & cold n/a bev',
    // Beer
    'pilsner, lager & misc', 'ale', 'porter & stout', 'wit, weiss & wheat',
    // Wine
    'sparkling & white wine',
    // Non-alcoholic
    'soda & water',
    // Fallback
    'menu items'
  ];
  const activeCategories = orderedCategories.filter(cat => categorizedItems[cat]?.length > 0);

  // Also add any categories not in our ordered list
  Object.keys(categorizedItems).forEach(cat => {
    if (!activeCategories.includes(cat) && categorizedItems[cat]?.length > 0) {
      activeCategories.push(cat);
    }
  });

  // Set initial active category
  useEffect(() => {
    if (activeCategories.length > 0 && !activeCategory) {
      setActiveCategory(activeCategories[0]);
    }
  }, [activeCategories, activeCategory]);

  // Scroll spy for active category
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset for sticky nav

      for (const category of activeCategories) {
        const section = sectionRefs.current[category];
        if (section) {
          const { offsetTop, offsetHeight } = section;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveCategory(category);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeCategories]);

  const scrollToCategory = (category: string) => {
    const section = sectionRefs.current[category];
    if (section) {
      const navHeight = navRef.current?.offsetHeight || 120;
      const offsetTop = section.offsetTop - navHeight - 20;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      setActiveCategory(category);
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    // If item has modifiers, open customization dialog
    if (item.modifierLists && item.modifierLists.length > 0) {
      setCustomizeItem(item);
      setSelectedModifiers([]);
      setSpecialInstructions('');
    } else {
      // Direct add (no modifiers)
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        cartLineId: String(item.id),
      });
    }
  };

  const handleConfirmCustomization = () => {
    if (!customizeItem) return;
    const cartLineId = generateCartLineId(customizeItem.id, selectedModifiers);
    addItem({
      id: customizeItem.id,
      name: customizeItem.name,
      price: customizeItem.price,
      cartLineId,
      modifiers: selectedModifiers.length > 0 ? selectedModifiers : undefined,
      specialInstructions: specialInstructions.trim() || undefined,
    });
    setCustomizeItem(null);
  };

  const handleModifierToggle = (modList: ModifierList, mod: Modifier, checked: boolean) => {
    if (modList.selectionType === 'SINGLE') {
      // Replace any existing selection from this list
      setSelectedModifiers(prev => [
        ...prev.filter(m => !modList.modifiers.some(lm => lm.id === m.id)),
        ...(checked ? [mod] : [])
      ]);
    } else {
      // Toggle for MULTIPLE selection
      setSelectedModifiers(prev =>
        checked
          ? [...prev, mod]
          : prev.filter(m => m.id !== mod.id)
      );
    }
  };

  const getTotalWithModifiers = () => {
    if (!customizeItem) return 0;
    const modifierTotal = selectedModifiers.reduce((sum, m) => sum + m.price, 0);
    return customizeItem.price + modifierTotal;
  };

  const getCategoryDisplayName = (category: string): string => {
    return categoryConfig[category]?.name || category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getCategoryDescription = (category: string): string | undefined => {
    return categoryConfig[category]?.description;
  };

  return (
    <>
      <SEOHead
        title="Full Menu - Jealous Fork Miami | Pancakes, Burgers & More"
        description="Browse our complete menu featuring artisan pancakes, gourmet burgers (Fri-Sat), flatbreads, and more. Real-time pricing and availability from Square."
        canonical="https://www.jealousfork.com/full-menu"
        keywords="Jealous Fork menu, Miami pancakes menu, gourmet burgers menu, artisan pancakes, breakfast Miami"
      />

      <div className="min-h-screen bg-gray-50">
        <Navigation />

        {/* Hero Section - Simplified */}
        <section className="bg-black text-white pt-20 pb-8 sm:pt-24 sm:pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Our Menu
            </h1>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto">
              Fresh ingredients, real-time availability
            </p>
          </div>
        </section>

        {/* Sticky Category Navigation */}
        <div
          ref={navRef}
          className="sticky top-16 z-40 bg-white border-b shadow-sm"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex overflow-x-auto scrollbar-hide gap-1 sm:gap-2 py-3 px-3 sm:px-6 lg:px-8 lg:justify-center">
              {activeCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => scrollToCategory(category)}
                  className={`flex-shrink-0 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-all whitespace-nowrap min-h-[44px] ${
                    activeCategory === category
                      ? 'bg-gray-900 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getCategoryDisplayName(category)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Content */}
        <section className="py-6 sm:py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-4 text-gray-600">Loading menu...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-600">Failed to load menu. Please try again.</p>
              </div>
            )}

            {/* Menu Categories */}
            {!isLoading && !error && (
              <div className="space-y-10 sm:space-y-12 lg:space-y-16">
                {activeCategories.map((category) => (
                  <section
                    key={category}
                    ref={(el) => (sectionRefs.current[category] = el)}
                    id={`category-${category}`}
                    className="scroll-mt-40"
                  >
                    {/* Category Header */}
                    <div className="mb-4 sm:mb-6">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                          {getCategoryDisplayName(category)}
                        </h2>
                        {categoryConfig[category]?.operatingDays && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-amber-100 text-amber-800">
                            {categoryConfig[category].operatingDays} {categoryConfig[category].operatingHours}
                          </span>
                        )}
                      </div>
                      {getCategoryDescription(category) && (
                        <p className="text-gray-600 mt-1 text-sm sm:text-base">
                          {getCategoryDescription(category)}
                        </p>
                      )}
                    </div>

                    {/* Items Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                      {categorizedItems[category]?.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
                        >
                          {/* Item Image */}
                          <div className="relative h-40 sm:h-48 bg-gray-200 overflow-hidden">
                            <img
                              src={item.imageUrl || fallbackImage}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = fallbackImage;
                              }}
                            />
                            {!item.inStock && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                  Sold Out
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Item Details */}
                          <div className="p-4 flex-1 flex flex-col">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
                              {item.description || 'Delicious house specialty'}
                            </p>

                            <div className="flex items-center justify-between gap-3 mt-auto">
                              <span className="text-lg sm:text-xl font-bold text-green-600">
                                ${item.price.toFixed(2)}
                              </span>
                              <button
                                onClick={() => handleAddToCart(item)}
                                disabled={!item.inStock}
                                className={`flex-shrink-0 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px] min-w-[100px] ${
                                  item.inStock
                                    ? 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                              >
                                {item.inStock ? 'Add to Cart' : 'Sold Out'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}

            {/* No Items State */}
            {!isLoading && !error && activeCategories.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No menu items available at this time.</p>
                <p className="text-gray-500 mt-2">Please check back later.</p>
              </div>
            )}
          </div>
        </section>

        {/* Operating Hours Footer */}
        <section className="bg-gray-900 text-white py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-center">Operating Hours</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-center">
              <div className="p-4">
                <h4 className="text-base sm:text-lg font-semibold text-green-400 mb-2">Jealous Fork</h4>
                <p className="text-gray-300 text-sm sm:text-base">Tuesday - Sunday</p>
                <p className="text-gray-300 text-sm sm:text-base">9:00 AM - 3:00 PM</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-2">Artisan Pancakes & Breakfast</p>
              </div>
              <div className="p-4">
                <h4 className="text-base sm:text-lg font-semibold text-green-400 mb-2">Jealous Burger</h4>
                <p className="text-gray-300 text-sm sm:text-base">Friday - Saturday</p>
                <p className="text-gray-300 text-sm sm:text-base">3:00 PM - 9:00 PM</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-2">Gourmet Burgers + Pancakes</p>
              </div>
              <div className="p-4 sm:col-span-2 lg:col-span-1">
                <h4 className="text-base sm:text-lg font-semibold text-green-400 mb-2">Beverages</h4>
                <p className="text-gray-300 text-sm sm:text-base">Tuesday - Sunday</p>
                <p className="text-gray-300 text-sm sm:text-base">During operating hours</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-2">Cocktails, Coffee & More</p>
              </div>
            </div>
            <p className="text-center text-red-400 mt-6 font-medium text-sm sm:text-base">
              CLOSED MONDAYS
            </p>
          </div>
        </section>
      </div>

      {/* Custom scrollbar hide utility */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Item Customization Dialog */}
      <Dialog open={!!customizeItem} onOpenChange={(open) => !open && setCustomizeItem(null)}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{customizeItem?.name}</DialogTitle>
            <DialogDescription>
              ${customizeItem?.price.toFixed(2)} - Customize your order
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Modifier Lists */}
            {customizeItem?.modifierLists?.map((modList) => (
              <div key={modList.id} className="space-y-3">
                <h4 className="font-medium text-sm text-gray-900">
                  {modList.name}
                  {modList.selectionType === 'SINGLE' && (
                    <span className="text-gray-500 font-normal ml-2">(Choose one)</span>
                  )}
                </h4>
                <div className="space-y-2">
                  {modList.modifiers.map((mod) => (
                    <label
                      key={mod.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedModifiers.some(m => m.id === mod.id)}
                        onCheckedChange={(checked) =>
                          handleModifierToggle(modList, mod, !!checked)
                        }
                      />
                      <span className="flex-1 text-sm">{mod.name}</span>
                      {mod.price > 0 && (
                        <span className="text-sm text-gray-500">+${mod.price.toFixed(2)}</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {/* Special Instructions */}
            <div className="space-y-2">
              <Label htmlFor="special-instructions" className="text-sm font-medium">
                Special Instructions (optional)
              </Label>
              <Textarea
                id="special-instructions"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g., No onions, extra sauce..."
                rows={2}
                maxLength={200}
                className="resize-none"
              />
              <p className="text-xs text-gray-400">{specialInstructions.length}/200</p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleConfirmCustomization} className="w-full">
              Add to Cart - ${getTotalWithModifiers().toFixed(2)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
