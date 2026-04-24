import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MenuPreview from "@/components/MenuPreview";
import Contact from "@/components/Contact";
import SEOHead from "@/components/SEOHead";

const breakfastHighlights = [
  {
    name: "Chocolate Oreo Chip Pancake",
    description: "Crushed Oreos, chocolate chips, Oreo whipped cream, chocolate ganache",
    price: "$17",
    tag: "Most Popular"
  },
  {
    name: "Peanut Butter Cup Pancake",
    description: "Reese's cups, nutter butter whipped cream, peanut butter maple syrup",
    price: "$17",
    tag: "Fan Favorite"
  },
  {
    name: "Hot Maple Flatbread",
    description: "Cup and char pepperoni, double cream mozzarella, red chili-black pepper maple",
    price: "$16",
    tag: "Savory Pick"
  },
  {
    name: "Lemon Curd & Blueberry Pancake",
    description: "Fresh blueberries, tangy lemon curd, fluffy artisan batter",
    price: "$15",
    tag: "Fresh & Light"
  },
  {
    name: "Eggs Benedict",
    description: "Poached eggs, hollandaise, choice of protein on toasted English muffin",
    price: "$16",
    tag: "Classic"
  },
  {
    name: "Breakfast Burrito",
    description: "Scrambled eggs, cheese, chorizo, peppers, salsa, sour cream",
    price: "$14",
    tag: "Hearty"
  }
];

const reviews = [
  {
    text: "Best breakfast in Miami, hands down. The pancakes are insane — we come every weekend.",
    author: "Maria G.",
    rating: 5,
    source: "Google"
  },
  {
    text: "If you're searching for breakfast near me in Kendall, stop looking. This is the place.",
    author: "Carlos R.",
    rating: 5,
    source: "Yelp"
  },
  {
    text: "The Chocolate Oreo pancake changed my life. Worth the drive from anywhere in Miami.",
    author: "Jessica T.",
    rating: 5,
    source: "Google"
  }
];

export default function BreakfastNearMePage() {
  const title = "Best Brunch Kendall & Best Pancakes Miami | Jealous Fork"
  const description =
    "Searching best brunch Kendall, best pancakes Miami, or pancakes near me? Jealous Fork serves 4.7★ favorites. Check Jealous Fork photos, hours, and order now.";
  const keywords =
    "breakfast near me, best breakfast near me, breakfast near me Kendall, breakfast near me Miami, breakfast places near me, pancakes near me, brunch near me, best breakfast Miami, breakfast restaurant Kendall";

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        canonical="https://www.jealousfork.com/breakfast-near-me"
        ogImage="https://www.jealousfork.com/images/og/jealous-fork-og.jpg"
        keywords={keywords}
        includeFAQ={true}
      />

      {/* Breakfast-specific structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            name: "Jealous Fork",
            description:
              "Miami's best breakfast restaurant in Kendall. Award-winning artisan pancakes, classic breakfast plates, and brunch served daily.",
            image:
              "https://www.jealousfork.com/images/og/jealous-fork-og.jpg",
            address: {
              "@type": "PostalAddress",
              streetAddress: "14417 SW 42nd St",
              addressLocality: "Miami",
              addressRegion: "FL",
              postalCode: "33175",
              addressCountry: "US",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 25.7323,
              longitude: -80.4168,
            },
            url: "https://www.jealousfork.com/breakfast-near-me",
            telephone: "(305) 699-1430",
            servesCuisine: ["Breakfast", "Brunch", "Pancakes", "American"],
            priceRange: "$$",
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.7",
              reviewCount: "400",
              bestRating: "5",
            },
            openingHoursSpecification: [
              { "@type": "OpeningHoursSpecification", dayOfWeek: "Tuesday", opens: "09:00", closes: "14:00" },
              { "@type": "OpeningHoursSpecification", dayOfWeek: "Wednesday", opens: "09:00", closes: "14:00" },
              { "@type": "OpeningHoursSpecification", dayOfWeek: "Thursday", opens: "09:00", closes: "14:00" },
              { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "09:00", closes: "21:00" },
              { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "09:00", closes: "21:00" },
              { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "09:00", closes: "15:00" },
            ],
            hasMenu: {
              "@type": "Menu",
              name: "Breakfast Menu",
              hasMenuSection: {
                "@type": "MenuSection",
                name: "Breakfast Highlights",
                hasMenuItem: breakfastHighlights.map((item) => ({
                  "@type": "MenuItem",
                  name: item.name,
                  description: item.description,
                  offers: {
                    "@type": "Offer",
                    price: item.price.replace("$", ""),
                    priceCurrency: "USD",
                  },
                })),
              },
            },
          }),
        }}
      />

      <Navigation />

      <main>
        {/* Hero */}
        <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080)",
            }}
          ></div>
          <div className="absolute inset-0 bg-black/55"></div>

          <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Best Breakfast Near Me
              <span className="block text-2xl md:text-3xl font-normal mt-2 text-yellow-300">
                Kendall &amp; Miami, FL
              </span>
            </h1>
            <p className="text-lg md:text-xl mb-4 max-w-2xl mx-auto opacity-90">
              Award-winning artisan pancakes, classic breakfast plates, and the best brunch in
              Kendall. Rated 4.7★ on Google with 400+ reviews.
            </p>
            <p className="text-sm md:text-base mb-8 max-w-2xl mx-auto text-white/85">
              Order online for fast pickup, get delivery across Miami-Dade, or reserve a table for weekend brunch.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/full-menu"
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-3 rounded-lg transition-colors text-lg"
              >
                Order Pickup & Delivery
              </Link>
              <a
                href="https://resy.com/cities/mia/venues/jealous-fork"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white hover:bg-white hover:text-black text-white font-bold px-8 py-3 rounded-lg transition-colors text-lg"
              >
                Reserve a Table
              </a>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-white/90">
              <span className="rounded-full bg-white/10 px-4 py-2">Pickup in 15–20 min</span>
              <span className="rounded-full bg-white/10 px-4 py-2">Delivery available</span>
              <span className="rounded-full bg-white/10 px-4 py-2">Secure checkout</span>
            </div>
          </div>
        </section>

        {/* Quick Info Bar */}
        <section className="bg-yellow-500 text-black py-4">
          <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-6 md:gap-12 text-center font-medium">
            <div>
              <span className="font-bold">📍 Location:</span> 14417 SW 42nd St, Miami, FL 33175
            </div>
            <div>
              <span className="font-bold">🕘</span> Pickup in 15–20 min
            </div>
            <div>
              <span className="font-bold">🚗</span> Delivery available
            </div>
            <div>
              <span className="font-bold">⭐ Rating:</span> 4.7★ (400+ reviews)
            </div>
            <div>
              <span className="font-bold">📞</span>{" "}
              <a href="tel:+13056991430" className="underline">
                (305) 699-1430
              </a>
            </div>
          </div>
        </section>

        {/* Breakfast Menu Highlights */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Our Breakfast Menu Highlights
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              From our famous artisan pancakes to classic breakfast plates — here's what makes
              Jealous Fork the best breakfast near you.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {breakfastHighlights.map((item) => (
                <div
                  key={item.name}
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {item.tag}
                    </span>
                    <span className="text-xl font-bold text-yellow-600">{item.price}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/full-menu"
                className="inline-block bg-black text-white font-bold px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                See Full Breakfast Menu →
              </Link>
            </div>
          </div>
        </section>

        {/* Why Jealous Fork */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Why Jealous Fork Is the Best Breakfast Near You
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🥞</div>
                <h3 className="font-bold text-lg mb-2">Artisan Pancakes</h3>
                <p className="text-gray-600 text-sm">
                  Miami's original artisan pancake restaurant. Every batter scratch-made daily with
                  premium ingredients.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="font-bold text-lg mb-2">4.7★ on Google</h3>
                <p className="text-gray-600 text-sm">
                  400+ verified reviews. Featured on Telemundo National. Miami's most-loved
                  breakfast spot.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🐕</div>
                <h3 className="font-bold text-lg mb-2">Dog-Friendly Patio</h3>
                <p className="text-gray-600 text-sm">
                  Bring your furry friend! Our relaxed outdoor patio welcomes well-behaved dogs.
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🚗</div>
                <h3 className="font-bold text-lg mb-2">Easy Access</h3>
                <p className="text-gray-600 text-sm">
                  Located on SW 42nd St in Kendall with free parking. Quick drive from West Kendall,
                  Doral, Coral Gables & more.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">
              What Breakfast Lovers Say
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {reviews.map((review) => (
                <div key={review.author} className="bg-gray-50 rounded-xl p-6">
                  <div className="flex mb-3">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i} className="text-yellow-500 text-xl">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-4">"{review.text}"</p>
                  <p className="font-semibold text-sm">
                    — {review.author}{" "}
                    <span className="text-gray-400 font-normal">via {review.source}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hours & Location */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">Hours &amp; Location</h2>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h3 className="text-xl font-bold mb-4">Breakfast &amp; Brunch Hours</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex justify-between">
                    <span>Monday</span>
                    <span className="text-red-500 font-medium">Closed</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Tuesday – Thursday</span>
                    <span className="font-medium">9:00 AM – 2:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Friday – Saturday</span>
                    <span className="font-medium">9:00 AM – 9:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-medium">9:00 AM – 3:00 PM</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-500 mt-4">
                  🍔 Jealous Burger menu available Fri &amp; Sat from 3 PM.
                </p>

                <h3 className="text-xl font-bold mt-8 mb-4">Getting Here</h3>
                <address className="text-gray-700 not-italic">
                  <p className="font-semibold">Jealous Fork</p>
                  <p>14417 SW 42nd St</p>
                  <p>Miami, FL 33175</p>
                  <p className="mt-2">
                    <a href="tel:+13056991430" className="text-yellow-600 hover:underline font-medium">
                      (305) 699-1430
                    </a>
                  </p>
                </address>
              </div>

              <div className="rounded-xl overflow-hidden shadow-lg">
                <iframe
                  title="Jealous Fork Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3596.4!2d-80.4168!3d25.7323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9c1e7b7e7e7e7%3A0x0!2sJealous+Fork!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Nearby Areas */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              Serving Breakfast Across Miami
            </h2>
            <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
              Whether you're searching for "breakfast near me" from Kendall, West Kendall, Doral,
              Coral Gables, or anywhere in Miami — Jealous Fork is worth the trip.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "kendall",
                "west-kendall",
                "doral",
                "coral-gables",
                "south-miami",
                "wynwood",
                "brickell",
                "coconut-grove",
                "midtown-miami",
              ].map((area) => (
                <Link
                  key={area}
                  href={`/near/${area}`}
                  className="bg-gray-100 hover:bg-yellow-100 text-gray-700 hover:text-yellow-800 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  Breakfast near {area.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-black text-white text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready for Miami's Best Breakfast?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Start your order now for fast pickup or delivery, or reserve a table for a full brunch experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/full-menu"
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-8 py-3 rounded-lg transition-colors text-lg"
              >
                Order Pickup & Delivery
              </Link>
              <a
                href="https://resy.com/cities/mia/venues/jealous-fork"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white hover:bg-white hover:text-black font-bold px-8 py-3 rounded-lg transition-colors text-lg"
              >
                Reserve on Resy
              </a>
              <a
                href="tel:+13056991430"
                className="border-2 border-white hover:bg-white hover:text-black font-bold px-8 py-3 rounded-lg transition-colors text-lg"
              >
                Call (305) 699-1430
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
