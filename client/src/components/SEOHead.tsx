import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  keywords?: string;
}

// Restaurant structured data for AI/LLM search optimization (GEO/AEO)
const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Jealous Fork",
  "image": "https://jealousfork.com/images/restaurant/interior.jpg",
  "description": "Miami's original artisan pancake restaurant serving Instagram-worthy pancakes and gourmet burgers. Founded by Joaquin Ortiz and Henrik Telle.",
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
  "url": "https://jealousfork.com",
  "telephone": "(305) 699-1430",
  "servesCuisine": ["American", "Breakfast", "Brunch", "Pancakes", "Burgers"],
  "priceRange": "$$",
  "acceptsReservations": "True",
  "menu": "https://jealousfork.com/full-menu",
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Tuesday", "opens": "09:00", "closes": "15:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Wednesday", "opens": "09:00", "closes": "15:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Thursday", "opens": "09:00", "closes": "15:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Friday", "opens": "09:00", "closes": "21:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "09:00", "closes": "21:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "09:00", "closes": "15:00" }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "reviewCount": "400",
    "bestRating": "5"
  },
  "founder": [
    { "@type": "Person", "name": "Joaquin Ortiz" },
    { "@type": "Person", "name": "Henrik Telle" }
  ],
  "hasMenu": {
    "@type": "Menu",
    "hasMenuSection": [
      {
        "@type": "MenuSection",
        "name": "Signature Pancakes",
        "hasMenuItem": [
          { "@type": "MenuItem", "name": "Hot Maple Flatbread", "description": "Cup and char pepperoni, double cream mozzarella, and red chili-black pepper maple", "offers": { "@type": "Offer", "price": "16", "priceCurrency": "USD" } },
          { "@type": "MenuItem", "name": "Chocolate Oreo Chip Pancake", "description": "Crushed Oreos, chocolate chips, Oreo whipped cream, chocolate ganache", "offers": { "@type": "Offer", "price": "17", "priceCurrency": "USD" } },
          { "@type": "MenuItem", "name": "Peanut Butter Cup Pancake", "description": "Reese's cups, nutter butter whipped cream, peanut butter maple syrup", "offers": { "@type": "Offer", "price": "17", "priceCurrency": "USD" } }
        ]
      },
      {
        "@type": "MenuSection",
        "name": "Gourmet Burgers",
        "hasMenuItem": [
          { "@type": "MenuItem", "name": "Jesse James Burger", "description": "Premium beef patty with bacon, aged cheddar, and BBQ sauce", "offers": { "@type": "Offer", "price": "18", "priceCurrency": "USD" } }
        ]
      }
    ]
  }
};

export default function SEOHead({
  title,
  description,
  canonical,
  ogImage = "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630",
  keywords = "pancakes Miami, artisan pancakes, gourmet burgers, Miami restaurant, Instagram food, pancake restaurant, food truck, Miami dining"
}: SEOHeadProps) {
  useEffect(() => {
    // Add JSON-LD structured data for AI/LLM crawlers
    let scriptElement = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }
    scriptElement.textContent = JSON.stringify(restaurantSchema);

    // Set document title
    document.title = title;
    
    // Set meta tags
    const setMetaTag = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.name = name;
        document.head.appendChild(element);
      }
      element.content = content;
    };

    const setMetaProperty = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('property', property);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // Basic meta tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    
    // Open Graph tags
    setMetaProperty('og:type', 'website');
    setMetaProperty('og:url', canonical);
    setMetaProperty('og:title', title);
    setMetaProperty('og:description', description);
    setMetaProperty('og:image', ogImage);
    
    // Twitter Card tags
    setMetaProperty('twitter:card', 'summary_large_image');
    setMetaProperty('twitter:url', canonical);
    setMetaProperty('twitter:title', title);
    setMetaProperty('twitter:description', description);
    setMetaProperty('twitter:image', ogImage);
    
    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonical;
    
  }, [title, description, canonical, ogImage, keywords]);

  return null;
}
