import { useParams, Link } from "wouter";
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
    description: `Experience Miami's best artisan pancakes and gourmet burgers in ${area?.replace(/-/g, ' ')}. Jealous Fork delivers exceptional dining experiences across all Miami neighborhoods.`,
    distance: "nearby"
  };

  // SEO-optimized title targeting "[breakfast/brunch] [neighborhood]" searches
  const title = `Best Breakfast & Brunch Near ${areaInfo.name} | Pancakes & Burgers | Jealous Fork Miami`;
  const description = `Looking for breakfast near ${areaInfo.name}? Jealous Fork serves the best pancakes & brunch in Miami — just ${areaInfo.distance || "minutes"} away. ★4.7 Google ★4.6 Yelp. Artisan pancakes, gourmet burgers. Open Tue-Sun 9AM. Reserve on Resy!`;

  // Location-specific keywords targeting actual GSC search queries
  const keywords = `breakfast ${areaInfo.name.toLowerCase()}, brunch ${areaInfo.name.toLowerCase()}, best breakfast ${areaInfo.name.toLowerCase()}, best brunch ${areaInfo.name.toLowerCase()}, pancakes near ${areaInfo.name.toLowerCase()}, breakfast near me, pancakes near me, brunch near me, best pancakes ${areaInfo.name.toLowerCase()}, restaurants ${areaInfo.name.toLowerCase()}, breakfast places ${areaInfo.name.toLowerCase()}`;

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        canonical={`https://www.jealousfork.com/near/${areaInfo.slug}`}
        ogImage="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630"
        keywords={keywords}
        includeFAQ={true}
        areaName={areaInfo.name}
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
              Best Pancakes in<br />
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
                    <div className="text-3xl font-bold text-warm-amber mb-2">{areaInfo.distance || "nearby"}</div>
                    <div className="text-gray-600">From {areaInfo.name}</div>
                  </div>
                  <div className="text-center p-6 bg-gray-50 rounded-xl">
                    <div className="text-3xl font-bold text-warm-amber mb-2">4.7★</div>
                    <div className="text-gray-600">Google Rating</div>
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

        {/* Local FAQ Section for AI/LLM and Featured Snippets */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900">
              Frequently Asked Questions About Pancakes Near {areaInfo.name}
            </h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  What are the best pancakes near {areaInfo.name}?
                </h3>
                <p className="text-gray-600">
                  Jealous Fork serves award-winning artisan pancakes just {areaInfo.distance || "minutes"} from {areaInfo.name}. Our most popular items include the Chocolate Oreo Chip Pancake, Peanut Butter Cup Pancake, and our signature Hot Maple Flatbread. We're known for Instagram-worthy presentations and have been featured on Telemundo National.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  What are Jealous Fork's hours for {areaInfo.name} residents?
                </h3>
                <p className="text-gray-600">
                  We're open Tuesday through Sunday from 9AM to 3PM for breakfast and brunch. On Friday and Saturday, we extend our hours to 9PM and also serve Jealous Burger (gourmet burgers from 3PM-9PM). You can enjoy both pancakes AND burgers during evening hours. We're closed on Mondays.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  Does Jealous Fork deliver to {areaInfo.name}?
                </h3>
                <p className="text-gray-600">
                  Yes! We offer delivery to {areaInfo.name} through major delivery platforms. You can also order online for pickup at jealousfork.com. Our restaurant is located at 14417 SW 42nd St, Miami, FL 33175, just {areaInfo.distance || "a short drive"} from {areaInfo.name}.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  Does Jealous Fork have gluten-free pancakes?
                </h3>
                <p className="text-gray-600">
                  Yes! We offer gluten-free pancake options for guests with dietary restrictions. Just let your server know about any allergies or dietary needs, and we'll be happy to accommodate you.
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  Is Jealous Fork good for families with kids?
                </h3>
                <p className="text-gray-600">
                  Absolutely! Jealous Fork is a family-friendly restaurant perfect for {areaInfo.name} families. Kids love our creative pancake presentations, and we have options for all ages. We also have outdoor patio seating that's dog-friendly.
                </p>
              </div>
            </div>
          </div>
        </section>

        <MenuPreview />

        {/* Internal Links Section - Cross-linking for SEO */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-playfair text-3xl font-bold mb-8 text-center text-gray-900">
              Explore Our Menus
            </h2>
            <div className="grid sm:grid-cols-3 gap-6 mb-12">
              <Link href="/full-menu">
                <a className="block p-6 bg-gray-50 rounded-xl text-center hover:bg-gray-100 transition-colors">
                  <h3 className="font-playfair text-xl font-semibold text-gray-900 mb-2">Full Breakfast Menu</h3>
                  <p className="text-gray-600">Award-winning artisan pancakes, starters, sandwiches & craft beverages</p>
                </a>
              </Link>
              <Link href="/burgers">
                <a className="block p-6 bg-gray-50 rounded-xl text-center hover:bg-gray-100 transition-colors">
                  <h3 className="font-playfair text-xl font-semibold text-gray-900 mb-2">Gourmet Burgers</h3>
                  <p className="text-gray-600">Jealous Burger — creative gourmet burgers every Friday & Saturday 3-9PM</p>
                </a>
              </Link>
              <Link href="/">
                <a className="block p-6 bg-gray-50 rounded-xl text-center hover:bg-gray-100 transition-colors">
                  <h3 className="font-playfair text-xl font-semibold text-gray-900 mb-2">About Jealous Fork</h3>
                  <p className="text-gray-600">Our story, from Miami's first artisan pancake food truck to your favorite restaurant</p>
                </a>
              </Link>
            </div>

            <h3 className="font-playfair text-2xl font-bold mb-6 text-center text-gray-900">
              We Also Serve These Miami Neighborhoods
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {localAreas
                .filter(a => a.slug !== area)
                .slice(0, 12)
                .map(nearbyArea => (
                  <Link key={nearbyArea.slug} href={`/near/${nearbyArea.slug}`}>
                    <a className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-warm-amber hover:text-white transition-colors">
                      {nearbyArea.name}
                    </a>
                  </Link>
                ))
              }
            </div>
          </div>
        </section>

        <Contact />
      </main>

      <Footer />
    </>
  );
}
