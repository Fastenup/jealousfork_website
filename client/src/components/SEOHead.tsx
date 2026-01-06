import { useEffect } from "react";
import { useOperatingHours, getOpeningHoursSpecification } from "@/hooks/useOperatingHours";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  keywords?: string;
  includeFAQ?: boolean;
  areaName?: string;
}

// FAQ Schema for AI/LLM search optimization (GEO/AEO) and featured snippets
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What are Jealous Fork's hours?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Jealous Fork is open Tuesday-Thursday 9AM-2PM and Sunday 9AM-3PM for pancakes and breakfast. On Friday and Saturday, we're open 9AM-9PM and serve Jealous Burger (gourmet burgers from 3PM-9PM). You can order both pancakes AND burgers during evening hours. We are closed on Mondays."
      }
    },
    {
      "@type": "Question",
      "name": "Where is Jealous Fork located?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Jealous Fork is located at 14417 SW 42nd St, Miami, FL 33175, in the Kendall area of Miami-Dade County. We serve breakfast and brunch to all Miami neighborhoods including Kendall, West Kendall, Westchester, Doral, Coral Gables, and surrounding areas."
      }
    },
    {
      "@type": "Question",
      "name": "Does Jealous Fork have gluten-free options?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Jealous Fork offers gluten-free pancake options. Please inform your server about any dietary restrictions or allergies, and we'll accommodate your needs."
      }
    },
    {
      "@type": "Question",
      "name": "Is Jealous Fork dog-friendly?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Jealous Fork welcomes well-behaved dogs on our outdoor patio area. It's a great spot for brunch with your furry friend!"
      }
    },
    {
      "@type": "Question",
      "name": "Does Jealous Fork take reservations?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Jealous Fork accepts reservations through Resy or by calling (305) 699-1430. Walk-ins are also welcome, but reservations are recommended for weekend brunch."
      }
    },
    {
      "@type": "Question",
      "name": "What is Jealous Fork known for?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Jealous Fork is known for award-winning artisan pancakes and Instagram-worthy breakfast creations. We started as the first artisan pancake food truck in the country and are now a Miami institution. Our signature pancakes include the Chocolate Oreo Chip Pancake, Peanut Butter Cup Pancake, and Hot Maple Flatbread. We've been featured on Telemundo National and have a 4.7 star Google rating."
      }
    },
    {
      "@type": "Question",
      "name": "What are the best pancakes at Jealous Fork?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our most popular pancakes include: 1) Chocolate Oreo Chip Pancake ($17) - crushed Oreos, chocolate chips, Oreo whipped cream, chocolate ganache. 2) Peanut Butter Cup Pancake ($17) - Reese's cups, nutter butter whipped cream, peanut butter maple syrup. 3) Hot Maple Flatbread ($16) - cup and char pepperoni, double cream mozzarella, red chili-black pepper maple. 4) Lemon Curd and Blueberry Pancake ($15) - fresh blueberries and tangy lemon curd."
      }
    },
    {
      "@type": "Question",
      "name": "Does Jealous Fork offer delivery?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Jealous Fork offers delivery through major delivery platforms. You can also order online for pickup directly from our website at jealousfork.com."
      }
    }
  ]
};

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
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Tuesday", "opens": "09:00", "closes": "14:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Wednesday", "opens": "09:00", "closes": "14:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": "Thursday", "opens": "09:00", "closes": "14:00" },
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
          { "@type": "MenuItem", "name": "The Classic", "description": "Cheddar Cheese, That Secret Sauce, Tomato, Onion, Spring Greens", "offers": { "@type": "Offer", "price": "13", "priceCurrency": "USD" } },
          { "@type": "MenuItem", "name": "Jesse James", "description": "Applewood Smoked Bacon, Crispy Onions, BBQ Sauce, Cheddar Cheese", "offers": { "@type": "Offer", "price": "16", "priceCurrency": "USD" } },
          { "@type": "MenuItem", "name": "La La Land", "description": "Guac, Tomato, Cilantro, Sunflower Seeds, Dried Cranberries, White Cheddar, Spring Greens", "offers": { "@type": "Offer", "price": "16", "priceCurrency": "USD" } },
          { "@type": "MenuItem", "name": "The Devil's Advocate", "description": "Smokehouse Chili, Cheddar Cheese, Hot Hot Shake First, Fried Egg", "offers": { "@type": "Offer", "price": "17", "priceCurrency": "USD" } },
          { "@type": "MenuItem", "name": "Lé French", "description": "Brie Cheese, Caramelized Onions, Framboise, Spring Greens", "offers": { "@type": "Offer", "price": "17", "priceCurrency": "USD" } },
          { "@type": "MenuItem", "name": "The OG JB", "description": "Pickled Onions, Smoked Gouda, Tomato-Poblano Jam", "offers": { "@type": "Offer", "price": "17", "priceCurrency": "USD" } },
          { "@type": "MenuItem", "name": "Billie Holiday", "description": "Maytag Blue Cheese, Caramelized Onions, Spring Greens", "offers": { "@type": "Offer", "price": "16", "priceCurrency": "USD" } },
          { "@type": "MenuItem", "name": "Que Bola Meng", "description": "Guava & Queso, Caramelized Onions, Papitas", "offers": { "@type": "Offer", "price": "16", "priceCurrency": "USD" } },
          { "@type": "MenuItem", "name": "VEGburger", "description": "Black Bean-Chipotle Patty, Aged White Cheddar, Tomato, Onion, Spring Greens", "offers": { "@type": "Offer", "price": "16", "priceCurrency": "USD" } }
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
  keywords = "pancakes Miami, artisan pancakes, gourmet burgers, Miami restaurant, Instagram food, pancake restaurant, food truck, Miami dining",
  includeFAQ = true,
  areaName
}: SEOHeadProps) {
  // Fetch dynamic operating hours
  const { data: hours } = useOperatingHours();

  useEffect(() => {
    // Generate dynamic restaurant schema with current hours
    const dynamicRestaurantSchema = {
      ...restaurantSchema,
      openingHoursSpecification: hours ? getOpeningHoursSpecification(hours) : restaurantSchema.openingHoursSpecification
    };

    // Add JSON-LD structured data for AI/LLM crawlers (Restaurant schema)
    let restaurantScript = document.querySelector('script[data-schema="restaurant"]') as HTMLScriptElement;
    if (!restaurantScript) {
      restaurantScript = document.createElement('script');
      restaurantScript.type = 'application/ld+json';
      restaurantScript.setAttribute('data-schema', 'restaurant');
      document.head.appendChild(restaurantScript);
    }
    restaurantScript.textContent = JSON.stringify(dynamicRestaurantSchema);

    // Add FAQ schema for AI answer engines and featured snippets
    if (includeFAQ) {
      let faqScript = document.querySelector('script[data-schema="faq"]') as HTMLScriptElement;
      if (!faqScript) {
        faqScript = document.createElement('script');
        faqScript.type = 'application/ld+json';
        faqScript.setAttribute('data-schema', 'faq');
        document.head.appendChild(faqScript);
      }
      faqScript.textContent = JSON.stringify(faqSchema);
    }

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
    
  }, [title, description, canonical, ogImage, keywords, includeFAQ, areaName, hours]);

  return null;
}
