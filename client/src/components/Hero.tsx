import { useEffect } from "react";
import { Link } from "wouter";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Initialize Resy widget for hero button
  useEffect(() => {
    // Load Resy widget script if not already loaded
    if (!document.querySelector('script[src="https://widgets.resy.com/embed.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://widgets.resy.com/embed.js';
      script.async = true;
      document.head.appendChild(script);
      
      script.onload = () => {
        initializeHeroWidget();
      };
    } else {
      // Script already loaded, initialize widget
      setTimeout(initializeHeroWidget, 100);
    }

    function initializeHeroWidget() {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const heroButton = document.getElementById('resyButtonHero');
        if (heroButton && (window as any).resyWidget) {
          const resyApiKey = import.meta.env.VITE_RESY_API_KEY;
          const resyVenueId = import.meta.env.VITE_RESY_VENUE_ID || 90707;
          
          if (!resyApiKey) {
            console.warn('VITE_RESY_API_KEY environment variable is not set');
            return;
          }
          
          (window as any).resyWidget.addButton(heroButton, {
            venueId: resyVenueId,
            apiKey: resyApiKey,
            replace: true
          });
        }
      }, 100);
    }
  }, []);

  return (
    <section id="home" className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Hero background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: 'url(/images/restaurant/interior.jpg)'
        }}
      ></div>
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Miami's Original<br />
          <span className="text-gray-300">Artisan Pancakes</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 font-light">
          From food truck to restaurant - Florida's best pancakes & gourmet burgers
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full px-4 sm:px-0">
          <Link href="/full-menu">
            <a className="bg-gray-900 text-white py-3 px-8 rounded-full font-semibold text-lg hover:bg-gray-800 hover:shadow-lg transition-all w-full sm:w-auto min-w-[180px] text-center block">
              Order Online
            </a>
          </Link>
          <div
            id="resyButtonHero"
            className="border-2 border-white text-white py-3 px-8 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 hover:shadow-lg transition-all cursor-pointer text-center flex items-center justify-center w-full sm:w-auto min-w-[180px]"
          >
            Reserve Table
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
}
