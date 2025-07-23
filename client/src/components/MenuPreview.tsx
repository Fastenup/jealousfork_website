import { Link, useLocation } from "wouter";
import { menuItems } from "@/data/menuData";
import { useCart } from "@/contexts/CartContext";
import DynamicMenuDisplay from "@/components/DynamicMenuDisplay";

interface MenuPreviewProps {
  showAll?: boolean;
}

export default function MenuPreview({ showAll = false }: MenuPreviewProps) {
  // Always show exactly 6 featured items on homepage (including out-of-stock)
  const featuredItems = menuItems.filter(item => item.featured).slice(0, 6);
  const displayItems = showAll ? menuItems : featuredItems;
  const { addItem } = useCart();
  const [, setLocation] = useLocation();

  const handleOrderNow = (item: typeof menuItems[0]) => {
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
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From Instagram-worthy pancakes to gourmet burgers, every dish is crafted with passion and artisan attention to detail.
          </p>
        </div>
        
        <DynamicMenuDisplay 
          onAddToCart={handleOrderNow}
          maxItems={6}
        />
        
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
      </div>
    </section>
  );
}
