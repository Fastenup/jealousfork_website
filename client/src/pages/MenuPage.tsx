import { useParams } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MenuPreview from "@/components/MenuPreview";
import SEOHead from "@/components/SEOHead";
import { menuItems } from "@/data/menuData";

export default function MenuPage() {
  const params = useParams();
  const slug = params.slug;

  const menuItem = slug ? menuItems.find(item => item.slug === slug) : null;

  const title = menuItem 
    ? `${menuItem.name} - Menu | Jealous Fork Miami`
    : "Full Menu - Jealous Fork Miami";
  
  const description = menuItem
    ? `${menuItem.description} - Order online from Jealous Fork, Miami's premier artisan pancake restaurant.`
    : "Explore our full menu of artisan pancakes, gourmet burgers, and breakfast specialties at Jealous Fork Miami.";

  return (
    <>
      <SEOHead 
        title={title}
        description={description}
        canonical={`https://jealousfork.com/menu${slug ? `/${slug}` : ''}`}
        ogImage={menuItem?.image || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630"}
      />
      <Navigation />
      <main className="pt-16">
        {menuItem ? (
          /* Individual Menu Item Page */
          (<section className="py-16 md:py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <img 
                    src={menuItem.image} 
                    alt={menuItem.name}
                    className="w-full h-96 object-cover rounded-2xl shadow-lg"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                    {menuItem.name}
                  </h1>
                  <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                    {menuItem.description}
                  </p>
                  <div className="text-3xl font-bold text-warm-amber mb-8">
                    ${menuItem.price}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-warm-amber/90 transition-all bg-[#000000e3]">
                      Order Now
                    </button>
                    <a 
                      href="#reservation" 
                      className="border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-900 hover:text-white transition-all text-center"
                    >
                      Dine In
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>)
        ) : (
          /* Full Menu Page */
          (<section className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                  Our Complete <span className="text-warm-amber">Menu</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  From Instagram-worthy pancakes to gourmet burgers, every dish is crafted with passion and artisan attention to detail.
                </p>
              </div>
            </div>
          </section>)
        )}
        
        <MenuPreview showAll={!menuItem} />
      </main>
      <Footer />
    </>
  );
}
