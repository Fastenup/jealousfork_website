import React, { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Modifier, generateCartLineId } from "@/services/squareService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
  inStock: boolean;
  imageUrl?: string;
  modifierLists?: ModifierList[];
}

// Default fallback image for burgers
const fallbackImage = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center';

// Generate dynamic burger schema from menu data
function generateBurgerSchema(burgers: MenuItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Jealous Burger",
    "alternateName": "Jealous Fork Burgers",
    "image": "https://jealousfork.com/images/food/jesse-james-burger.jpg",
    "description": "Miami's best gourmet burgers. Classic patties with creative toppings, served Friday and Saturday nights. From The Classic to our signature Jesse James burger.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "14417 SW 42nd St",
      "addressLocality": "Miami",
      "addressRegion": "FL",
      "postalCode": "33175",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 25.7323,
      "longitude": -80.4168
    },
    "url": "https://jealousfork.com/burgers",
    "telephone": "(305) 699-1430",
    "servesCuisine": ["Burgers", "American", "Gourmet Burgers"],
    "priceRange": "$$",
    "acceptsReservations": "True",
    "menu": "https://jealousfork.com/burgers",
    "openingHoursSpecification": [
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Friday", "opens": "15:00", "closes": "21:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "15:00", "closes": "21:00" }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "reviewCount": "400",
      "bestRating": "5"
    },
    "hasMenu": {
      "@type": "Menu",
      "name": "Gourmet Burger Menu",
      "hasMenuSection": {
        "@type": "MenuSection",
        "name": "Gourmet Burgers",
        "hasMenuItem": burgers.map(burger => ({
          "@type": "MenuItem",
          "name": burger.name,
          "description": burger.description,
          "offers": {
            "@type": "Offer",
            "price": burger.price.toString(),
            "priceCurrency": "USD"
          }
        }))
      }
    }
  };
}

export default function BurgersPage() {
  const { addItem } = useCart();

  // Customization dialog state
  const [customizeItem, setCustomizeItem] = useState<MenuItem | null>(null);
  const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Fetch menu from Square API
  const { data: menuData, isLoading } = useQuery({
    queryKey: ['/api/menu'],
    refetchInterval: false,
  });

  // Filter for burgers category from Square data
  const menuItems: MenuItem[] = menuData?.items || [];
  const burgers = menuItems.filter(item => item.category?.toLowerCase() === 'burgers');

  // Generate dynamic schema based on actual menu data
  const burgerSchema = useMemo(() => generateBurgerSchema(burgers), [burgers]);

  useEffect(() => {
    // Set page title and meta tags - optimized for CTR and AI search
    document.title = "Best Gourmet Burgers in Kendall & Miami FL | Jealous Burger | Fri-Sat 3PM-9PM";

    // Set meta description - optimized for CTR with rating and USPs
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Miami's best gourmet burgers. Unique creations including The Classic, Jesse James & Miami-inspired Que Bola Meng. 4.7 star Rating. Fri-Sat 3PM-9PM. Order online at Jealous Burger!";

    // Set keywords - optimized for local search and AI
    let metaKeywords = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = "best burgers Miami, gourmet burgers Miami FL, burgers near me, best burgers Kendall, burgers near Kendall, classic burgers Miami, Friday night burgers Miami, burger restaurant Miami, Jealous Burger, Miami burger joint, burgers 33175";

    // Set canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = 'https://jealousfork.com/burgers';

    // Scroll to top
    window.scrollTo(0, 0);
  }, []);

  // Update schema when burgers data changes
  useEffect(() => {
    if (burgers.length > 0) {
      let scriptElement = document.querySelector('script[data-burger-schema]') as HTMLScriptElement;
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.type = 'application/ld+json';
        scriptElement.setAttribute('data-burger-schema', 'true');
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(burgerSchema);
    }
  }, [burgerSchema, burgers.length]);

  const handleAddToCart = (burger: MenuItem) => {
    // If item has modifiers, open customization dialog
    if (burger.modifierLists && burger.modifierLists.length > 0) {
      setCustomizeItem(burger);
      setSelectedModifiers([]);
      setSpecialInstructions('');
    } else {
      // Direct add (no modifiers)
      addItem({
        id: burger.id,
        name: burger.name,
        price: burger.price,
        cartLineId: String(burger.id),
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
      setSelectedModifiers(prev => [
        ...prev.filter(m => !modList.modifiers.some(lm => lm.id === m.id)),
        ...(checked ? [mod] : [])
      ]);
    } else {
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

  return (
    <>
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1920&h=1080&fit=crop)'
          }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="font-playfair text-4xl md:text-6xl font-bold mb-4 leading-tight">
            Gourmet Burgers in Miami
          </h1>
          <p className="text-xl md:text-2xl mb-6 font-light">
            Classic patties, creative toppings, unforgettable flavors
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/full-menu">
              <a className="bg-white text-gray-900 py-3 px-8 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all">
                Order Online
              </a>
            </Link>
            <a
              href="tel:(305)699-1430"
              className="border-2 border-white text-white py-3 px-8 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all"
            >
              Call to Reserve
            </a>
          </div>
        </div>
      </section>

      {/* Hours Banner */}
      <section className="bg-gray-900 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg">
            <span className="font-semibold">Jealous Burger:</span> Friday & Saturday 3:00 PM - 9:00 PM
            <span className="text-gray-400 ml-2">| Pancakes still available!</span>
          </p>
        </div>
      </section>

      {/* Burger Menu Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Our Burger Menu
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Gourmet burgers crafted with premium ingredients. From our classic cheeseburger to Miami-inspired creations like the Que Bola Meng.
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600">Loading menu...</p>
            </div>
          )}

          {/* No Burgers State */}
          {!isLoading && burgers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No burgers available at this time.</p>
              <p className="text-gray-500 mt-2">Please check back later or view our full menu.</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {burgers.map((burger) => (
              <article
                key={burger.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                itemScope
                itemType="https://schema.org/MenuItem"
              >
                <img
                  src={burger.imageUrl || fallbackImage}
                  alt={`${burger.name} - gourmet burger Miami`}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                  itemProp="image"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = fallbackImage;
                  }}
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3
                      className="font-playfair text-xl font-semibold text-gray-900"
                      itemProp="name"
                    >
                      {burger.name}
                    </h3>
                    <span
                      className="text-2xl font-bold text-gray-900"
                      itemProp="offers"
                      itemScope
                      itemType="https://schema.org/Offer"
                    >
                      <span itemProp="price">${burger.price}</span>
                      <meta itemProp="priceCurrency" content="USD" />
                    </span>
                  </div>
                  <p
                    className="text-gray-600 mb-4 leading-relaxed"
                    itemProp="description"
                  >
                    {burger.description}
                  </p>
                  <button
                    onClick={() => handleAddToCart(burger)}
                    className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* About Jealous Burger Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            About Jealous Burger
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Jealous Burger is our evening concept at Jealous Fork, expanding our menu every Friday and Saturday from 3PM-9PM.
            We brought the same creativity from our award-winning pancakes to craft unique gourmet burgers with chef-driven toppings.
            From traditional American classics to Miami-inspired flavors like our Que Bola Meng with guava and queso.
            And yes, you can still order our famous pancakes during burger hours!
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="text-3xl font-bold text-gray-900 mb-2">{burgers.length || '-'}</div>
              <div className="text-gray-600">Gourmet Burgers</div>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {burgers.length > 0
                  ? `$${Math.min(...burgers.map(b => b.price))}-${Math.max(...burgers.map(b => b.price))}`
                  : '-'}
              </div>
              <div className="text-gray-600">Price Range</div>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <div className="text-3xl font-bold text-gray-900 mb-2">Fri-Sat</div>
              <div className="text-gray-600">Burger Nights</div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
                Visit Us in Miami
              </h2>
              <div className="space-y-4">
                <p className="text-lg">
                  <strong>Address:</strong><br />
                  14417 SW 42nd St<br />
                  Miami, FL 33175
                </p>
                <p className="text-lg">
                  <strong>Jealous Burger Hours:</strong><br />
                  Friday & Saturday: 3:00 PM - 9:00 PM<br />
                  <span className="text-gray-400 text-sm">(Pancakes available all day!)</span>
                </p>
                <p className="text-lg">
                  <strong>Phone:</strong><br />
                  <a href="tel:(305)699-1430" className="hover:text-gray-300 transition-colors">
                    (305) 699-1430
                  </a>
                </p>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <a
                  href="https://maps.google.com/?q=14417+SW+42nd+St+Miami+FL+33175"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-white text-gray-900 py-3 px-6 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  Get Directions
                </a>
                <Link href="/full-menu">
                  <a className="inline-flex items-center justify-center border-2 border-white text-white py-3 px-6 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition-colors">
                    View Full Menu
                  </a>
                </Link>
              </div>
            </div>
            <div className="h-80 rounded-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3594.123456789!2d-80.4168!3d25.7323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDQzJzU2LjMiTiA4MMKwMjQnNTkuOSJX!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Jealous Burger location in Miami"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section for SEO */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-playfair text-3xl font-bold mb-8 text-center text-gray-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                What are the best burgers in Miami?
              </h3>
              <p className="text-gray-600">
                Jealous Burger serves some of Miami's best gourmet burgers. Our most popular include the Jesse James
                with applewood bacon and BBQ sauce, and the Que Bola Meng featuring guava and queso - a true Miami flavor.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                When is Jealous Burger open?
              </h3>
              <p className="text-gray-600">
                Jealous Burger serves gourmet burgers Friday and Saturday from 3:00 PM to 9:00 PM at our Miami location
                (14417 SW 42nd St). During burger hours, we serve BOTH our full burger menu AND our award-winning pancakes -
                so you can have the best of both worlds!
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Do you have vegetarian burger options?
              </h3>
              <p className="text-gray-600">
                Yes! Our VEGburger features a black bean-chipotle patty with aged white cheddar, tomato, onion, and
                spring greens for $16.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Are these smash burgers?
              </h3>
              <p className="text-gray-600">
                No, we serve classic gourmet patties, not smash burgers. Our burgers are thick, juicy, and cooked to
                perfection with premium toppings.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

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
