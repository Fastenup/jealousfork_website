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
// Questions aligned with actual GSC search queries for featured snippet targeting
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the best breakfast near me in Kendall, Miami?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Jealous Fork is the best breakfast restaurant in Kendall, Miami. Located at 14417 SW 42nd St, Miami, FL 33175, we serve award-winning artisan pancakes, fluffy breakfast stacks, and creative brunch dishes. Rated 4.7 stars on Google and 4.6 on Yelp, we're open Tuesday-Sunday from 9AM. Our signature pancakes — including the Chocolate Oreo Chip, Peanut Butter Cup, and Hot Maple Flatbread — have been featured on Telemundo National."
      }
    },
    {
      "@type": "Question",
      "name": "Where can I find the best pancakes in Miami?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The best pancakes in Miami are at Jealous Fork in Kendall. We started as Miami's first artisan pancake food truck and now serve the most Instagram-worthy pancake creations in South Florida. Top picks: Chocolate Oreo Chip Pancake ($17), Peanut Butter Cup Pancake ($17), Hot Maple Flatbread ($16), and Lemon Curd & Blueberry Pancake ($15). We use premium ingredients and scratch-made batter daily. 4.7★ Google rating with 400+ reviews."
      }
    },
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
      "name": "Where is the best brunch in Kendall?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Jealous Fork is Kendall's top-rated brunch destination, located at 14417 SW 42nd St, Miami, FL 33175. We serve artisan pancakes, fluffy Japanese-style stacks, fresh breakfast plates, and craft coffee. Weekend brunch is our specialty — reserve on Resy or call (305) 699-1430. Dog-friendly patio seating available. Just minutes from West Kendall, Westchester, Tamiami, and Kendale Lakes."
      }
    },
    {
      "@type": "Question",
      "name": "Does Jealous Fork have gluten-free pancakes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Jealous Fork offers gluten-free pancake options for guests with dietary restrictions. We also have vegan-friendly choices. Just let your server know about any allergies or dietary needs, and we'll be happy to accommodate you."
      }
    },
    {
      "@type": "Question",
      "name": "Is Jealous Fork dog-friendly?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Jealous Fork is a dog-friendly restaurant in Kendall, Miami. Well-behaved dogs are welcome on our outdoor patio area. It's a popular spot for brunch with your furry friend — many Miami pet owners love our relaxed patio vibe."
      }
    },
    {
      "@type": "Question",
      "name": "Does Jealous Fork take reservations?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Jealous Fork accepts reservations through Resy or by calling (305) 699-1430. Walk-ins are also welcome, but reservations are recommended for weekend brunch as we're one of the most popular breakfast spots in Kendall."
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
      "name": "Does Jealous Fork deliver breakfast in Miami?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Jealous Fork offers breakfast delivery across Miami through Uber Eats, DoorDash, and Grubhub. You can also order online for pickup directly from our website at jealousfork.com. We deliver to Kendall, West Kendall, Westchester, Coral Gables, Doral, and most of Miami-Dade County."
      }
    },
    {
      "@type": "Question",
      "name": "What are the best burgers in Kendall?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Jealous Burger at Jealous Fork serves some of the best gourmet burgers in Kendall every Friday and Saturday from 3PM-9PM. Top picks include the Jesse James (applewood bacon, BBQ, cheddar), Que Bola Meng (guava & queso — a true Miami flavor), Lé French (brie, caramelized onions), and The OG JB (smoked gouda, tomato-poblano jam). Prices range from $13-$17. You can still order pancakes during burger hours!"
      }
    }
  ]
};

// Restaurant structured data for AI/LLM search optimization (GEO/AEO)
const restaurantSchema = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Jealous Fork",
  "image": "https://www.jealousfork.com/images/restaurant/interior.jpg",
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
  "url": "https://www.jealousfork.com",
  "telephone": "(305) 699-1430",
  "servesCuisine": ["American", "Breakfast", "Brunch", "Pancakes", "Burgers"],
  "priceRange": "$$",
  "acceptsReservations": "True",
  "menu": "https://www.jealousfork.com/full-menu",
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
