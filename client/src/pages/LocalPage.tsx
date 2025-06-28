import { useParams } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import MenuPreview from "@/components/MenuPreview";
import Contact from "@/components/Contact";
import SEOHead from "@/components/SEOHead";
import { localAreas } from "@/data/localAreas";

export default function LocalPage() {
  const params = useParams();
  const area = params.area;
  
  const areaInfo = localAreas.find(loc => loc.slug === area) || {
    name: area?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Miami Area',
    slug: area || 'miami',
    description: `Experience Miami's best artisan pancakes and gourmet burgers in ${area?.replace(/-/g, ' ')}. Jealous Fork delivers exceptional dining experiences across all Miami neighborhoods.`
  };

  const title = `Best Pancakes & Burgers in ${areaInfo.name} | Jealous Fork Miami`;
  const description = `Craving artisan pancakes in ${areaInfo.name}? Jealous Fork serves Instagram-worthy pancakes, gourmet burgers, and exceptional breakfast in Miami, FL. Order online or visit us today!`;

  return (
    <>
      <SEOHead 
        title={title}
        description={description}
        canonical={`https://jealousfork.com/near/${areaInfo.slug}`}
        ogImage="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630"
      />
      <Navigation />
      
      <main>
        {/* Local Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
            style={{backgroundImage: 'url(https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080)'}}
          ></div>
          <div className="absolute inset-0 bg-black/50"></div>
          
          <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Best Pancakes in<br>
              <span className="text-warm-amber">{areaInfo.name}</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light">
              Miami's original artisan pancake restaurant now serving {areaInfo.name}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="#menu" 
                className="bg-warm-amber text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-warm-amber/90 transition-all transform hover:scale-105"
              >
                View Menu
              </a>
              <a 
                href="#contact" 
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all"
              >
                Get Directions
              </a>
            </div>
          </div>
        </section>

        {/* Local SEO Content */}
        <section className="py-16 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                  Serving <span className="text-warm-amber">{areaInfo.name}</span> Since 2018
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {areaInfo.description}
                </p>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Whether you're looking for the perfect brunch spot in {areaInfo.name}, Instagram-worthy pancakes for your social media, or simply the best breakfast in Miami, Jealous Fork delivers an unforgettable culinary experience.
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-gray-50 rounded-xl">
                    <div className="text-3xl font-bold text-warm-amber mb-2">15 min</div>
                    <div className="text-gray-600">Delivery to {areaInfo.name}</div>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-xl">
                    <div className="text-3xl font-bold text-warm-amber mb-2">4.5★</div>
                    <div className="text-gray-600">Customer Rating</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Artisan pancakes" 
                  className="rounded-xl shadow-lg"
                  loading="lazy"
                />
                <img 
                  src="https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Gourmet burger" 
                  className="rounded-xl shadow-lg mt-8"
                  loading="lazy"
                />
                <img 
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Restaurant interior" 
                  className="rounded-xl shadow-lg -mt-8"
                  loading="lazy"
                />
                <img 
                  src="https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Fresh ingredients" 
                  className="rounded-xl shadow-lg"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        <MenuPreview />
        <Contact />
      </main>
      
      <Footer />
    </>
  );
}
