import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import MenuPreview from "@/components/MenuPreview";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

export default function Home() {
  return (
    <>
      <SEOHead
        title="Best Pancakes & Breakfast in Kendall, Miami | Jealous Fork — Brunch & Burgers"
        description="Jealous Fork — Miami's #1 artisan pancake restaurant in Kendall. Best pancakes near you, fluffy breakfast stacks & gourmet burgers. ★4.7 Google ★4.6 Yelp. Open Tue-Sun 9AM. Order online or reserve on Resy!"
        canonical="https://www.jealousfork.com/"
        ogImage="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=630"
        keywords="best pancakes in miami, pancakes near me, breakfast near me, brunch near me, breakfast kendall, brunch kendall, best breakfast kendall, best pancakes miami, artisan pancakes Miami, fluffy pancakes miami, breakfast miami, brunch miami, gourmet burgers Miami, Jealous Fork, pancake restaurant miami"
        includeFAQ={true}
      />
      <Navigation />
      <Hero />
      <About />
      <MenuPreview />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
      
      {/* Sticky CTA Buttons */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
        <button 
          onClick={() => {
            const element = document.getElementById('reservations');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="bg-warm-amber text-white p-4 rounded-full shadow-lg hover:bg-warm-amber/90 transition-all transform hover:scale-110"
          aria-label="Make a reservation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </button>
        <a 
          href="tel:(305)699-1430" 
          className="bg-gray-900 text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-all transform hover:scale-110"
          aria-label="Call restaurant"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
        </a>
      </div>
    </>
  );
}
