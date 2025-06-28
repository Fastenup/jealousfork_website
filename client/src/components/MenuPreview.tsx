import { Link } from "wouter";
import { menuItems } from "@/data/menuData";

interface MenuPreviewProps {
  showAll?: boolean;
}

export default function MenuPreview({ showAll = false }: MenuPreviewProps) {
  const displayItems = showAll ? menuItems : menuItems.slice(0, 6);

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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
              <Link href={`/menu/${item.slug}`}>
                <a className="block">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </a>
              </Link>
              <div className="p-6">
                <Link href={`/menu/${item.slug}`}>
                  <a>
                    <h3 className="font-playfair text-2xl font-semibold mb-2 hover:text-gray-600 transition-colors">
                      {item.name}
                    </h3>
                  </a>
                </Link>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">${item.price}</span>
                  <button className="bg-gray-900 text-white px-4 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors">
                    Order Now
                  </button>
                </div>
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
      </div>
    </section>
  );
}
