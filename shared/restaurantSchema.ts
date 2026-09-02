/**
 * Canonical restaurant facts + JSON-LD builder.
 * Single source of truth for NAP/geo/hours used by server-side head injection.
 * Keep in sync with Google Business Profile: Mon closed, Tue-Thu 9-2,
 * Fri-Sat 9-9 (Jealous Burger menu from 3 PM), Sun 9-3.
 */

export const RESTAURANT = {
  name: "Jealous Fork",
  legalName: "Jealous Fork Restaurant 1 LLC",
  phone: "+1-305-699-1430",
  phoneDisplay: "(305) 699-1430",
  street: "14417 SW 42nd St",
  city: "Miami",
  region: "FL",
  postalCode: "33175",
  latitude: 25.7295,
  longitude: -80.4282,
  origin: "https://www.jealousfork.com",
  hoursText: "Mon closed · Tue–Thu 9 AM–2 PM · Fri–Sat 9 AM–9 PM · Sun 9 AM–3 PM",
} as const;

const OPENING_HOURS = [
  { dayOfWeek: "Tuesday", opens: "09:00", closes: "14:00" },
  { dayOfWeek: "Wednesday", opens: "09:00", closes: "14:00" },
  { dayOfWeek: "Thursday", opens: "09:00", closes: "14:00" },
  { dayOfWeek: "Friday", opens: "09:00", closes: "21:00" },
  { dayOfWeek: "Saturday", opens: "09:00", closes: "21:00" },
  { dayOfWeek: "Sunday", opens: "09:00", closes: "15:00" },
];

export function buildRestaurantJsonLd(): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${RESTAURANT.origin}/#restaurant`,
    name: RESTAURANT.name,
    description:
      "Award-winning artisan pancakes & gourmet burgers in Kendall, Miami. Miami's original artisan pancake restaurant. Open Tuesday-Sunday from 9 AM; Jealous Burger menu Friday and Saturday from 3 PM.",
    url: RESTAURANT.origin,
    telephone: RESTAURANT.phone,
    image: `${RESTAURANT.origin}/images/og/jealous-fork-og.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: RESTAURANT.street,
      addressLocality: RESTAURANT.city,
      addressRegion: RESTAURANT.region,
      postalCode: RESTAURANT.postalCode,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: RESTAURANT.latitude,
      longitude: RESTAURANT.longitude,
    },
    openingHoursSpecification: OPENING_HOURS.map((h) => ({
      "@type": "OpeningHoursSpecification",
      ...h,
    })),
    servesCuisine: ["American", "Breakfast", "Brunch", "Pancakes", "Burgers"],
    priceRange: "$$",
    acceptsReservations: "True",
    menu: `${RESTAURANT.origin}/full-menu`,
    sameAs: [
      "https://www.yelp.com/biz/jealous-fork-miami",
      "https://www.tripadvisor.com/Restaurant_Review-g34438-d19668618-Reviews-Jealous_Fork-Miami_Florida.html",
      "https://www.facebook.com/JealousEats/",
      "https://www.instagram.com/jealousfork/",
    ],
  };
  return JSON.stringify(schema);
}
