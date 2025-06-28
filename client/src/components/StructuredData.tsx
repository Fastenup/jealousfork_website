export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Jealous Fork",
    "description": "Miami's original artisan pancake restaurant serving Instagram-worthy pancakes and gourmet burgers since our food truck days.",
    "url": "https://jealousfork.com",
    "telephone": "+1-305-555-0123",
    "email": "info@jealousfork.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2000 N Bayshore Dr",
      "addressLocality": "Miami",
      "addressRegion": "FL",
      "postalCode": "33137",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 25.7965,
      "longitude": -80.1935
    },
    "openingHours": [
      "Tu-Su 09:00-15:00"
    ],
    "servesCuisine": ["American", "Breakfast", "Brunch"],
    "priceRange": "$$",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "reviewCount": "1247",
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
          "name": "Jealous Fork - Day Menu",
          "description": "Available Tuesday-Sunday 9AM-3PM",
          "hasMenuItem": [
            {
              "@type": "MenuItem",
              "name": "Signature Stack",
              "description": "Three fluffy pancakes with maple syrup and butter",
              "offers": {
                "@type": "Offer",
                "price": "14.99",
                "priceCurrency": "USD"
              }
            }
          ]
        },
        {
          "@type": "MenuSection", 
          "name": "Jealous Burger - Evening Menu",
          "description": "Available Friday-Saturday 5PM-9PM",
          "hasMenuItem": [
            {
              "@type": "MenuItem",
              "name": "Jealous Burger",
              "description": "Signature beef burger with special sauce",
              "offers": {
                "@type": "Offer",
                "price": "16.99",
                "priceCurrency": "USD"
              }
            }
          ]
        }
      ]
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Sarah M."
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Absolutely incredible! The pancakes are truly Instagram-worthy and taste even better than they look."
      }
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
        "item": "https://jealousfork.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Menu",
        "item": "https://jealousfork.com/full-menu"
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