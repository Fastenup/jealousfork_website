export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Jealous Fork",
    "description": "Award-winning artisan pancakes & gourmet burgers in Kendall, Miami. Miami's original artisan pancake restaurant — Instagram-worthy breakfast, fluffy pancake stacks, and creative brunch dishes. 4.7★ Google, 4.6★ Yelp.",
    "url": "https://www.jealousfork.com",
    "telephone": "+1-305-699-1430",
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
    "openingHoursSpecification": [
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Tuesday", "opens": "09:00", "closes": "14:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Wednesday", "opens": "09:00", "closes": "14:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Thursday", "opens": "09:00", "closes": "14:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Friday", "opens": "09:00", "closes": "21:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Saturday", "opens": "09:00", "closes": "21:00" },
      { "@type": "OpeningHoursSpecification", "dayOfWeek": "Sunday", "opens": "09:00", "closes": "15:00" }
    ],
    "servesCuisine": ["American", "Breakfast", "Brunch", "Pancakes", "Burgers"],
    "priceRange": "$$",
    "acceptsReservations": "True",
    "menu": "https://www.jealousfork.com/full-menu",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "reviewCount": "400",
      "bestRating": "5",
      "worstRating": "1"
    },
    "hasMenu": {
      "@type": "Menu",
      "name": "Jealous Fork Menu",
      "description": "Artisan pancakes, gourmet burgers, and specialty beverages",
      "hasMenuSection": [
        {
          "@type": "MenuSection",
          "name": "Signature Pancakes",
          "description": "Award-winning artisan pancakes - Available Tue-Sun 9AM-3PM",
          "hasMenuItem": [
            {
              "@type": "MenuItem",
              "name": "Hot Maple Flatbread",
              "description": "Cup and char pepperoni, double cream mozzarella, and red chili-black pepper maple",
              "offers": { "@type": "Offer", "price": "16", "priceCurrency": "USD" }
            },
            {
              "@type": "MenuItem",
              "name": "Chocolate Oreo Chip Pancake",
              "description": "Crushed Oreos, chocolate chips, Oreo whipped cream, chocolate ganache",
              "offers": { "@type": "Offer", "price": "17", "priceCurrency": "USD" }
            },
            {
              "@type": "MenuItem",
              "name": "Peanut Butter Cup Pancake",
              "description": "Reese's cups, nutter butter whipped cream, peanut butter maple syrup",
              "offers": { "@type": "Offer", "price": "17", "priceCurrency": "USD" }
            },
            {
              "@type": "MenuItem",
              "name": "Lemon Curd and Blueberry Pancake",
              "description": "Fresh blueberries and tangy lemon curd",
              "offers": { "@type": "Offer", "price": "15", "priceCurrency": "USD" }
            }
          ]
        },
        {
          "@type": "MenuSection",
          "name": "Gourmet Burgers (Jealous Burger)",
          "description": "Available Friday-Saturday 3PM-9PM",
          "hasMenuItem": [
            {
              "@type": "MenuItem",
              "name": "The Classic",
              "description": "Cheddar Cheese, That Secret Sauce, Tomato, Onion, Spring Greens",
              "offers": { "@type": "Offer", "price": "13", "priceCurrency": "USD" }
            },
            {
              "@type": "MenuItem",
              "name": "Jesse James",
              "description": "Applewood Smoked Bacon, Crispy Onions, BBQ Sauce, Cheddar Cheese",
              "offers": { "@type": "Offer", "price": "16", "priceCurrency": "USD" }
            },
            {
              "@type": "MenuItem",
              "name": "Que Bola Meng",
              "description": "Guava & Queso, Caramelized Onions, Papitas",
              "offers": { "@type": "Offer", "price": "16", "priceCurrency": "USD" }
            }
          ]
        }
      ]
    },
    "founder": [
      { "@type": "Person", "name": "Joaquin Ortiz" },
      { "@type": "Person", "name": "Henrik Telle" }
    ],
    "sameAs": [
      "https://www.instagram.com/jealousfork",
      "https://www.tiktok.com/@jealousfork",
      "https://www.youtube.com/channel/UCQD6sE0iElxYQeD4V-rDcNw"
    ]
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.jealousfork.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Menu",
        "item": "https://www.jealousfork.com/full-menu"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Burgers",
        "item": "https://www.jealousfork.com/burgers"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
    </>
  );
}
