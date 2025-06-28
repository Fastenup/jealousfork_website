import { Link } from "wouter";
import ResyWidget from "./ResyWidget";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Reservation Section */}
      <section id="reservation" className="py-16 md:py-24 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
            Ready to Experience <span className="text-gray-300">Jealous Fork</span>?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Book your table now or order online for pickup and delivery
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <ResyWidget className="mb-4 sm:mb-0" />
            <a 
              href="tel:(305)699-1430" 
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all"
            >
              Call (305) 699-1430
            </a>
          </div>
          <p className="mt-8 text-gray-400">
            For large parties (8+), please call us directly
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <button 
                onClick={() => scrollToSection('home')}
                className="font-playfair font-bold text-3xl text-white hover:text-gray-300 transition-colors"
              >
                Jealous Fork
              </button>
              <p className="mt-4 text-gray-400 leading-relaxed">
                Miami's original artisan pancake restaurant. From our humble beginnings as a food truck to our current restaurant, we continue to serve Instagram-worthy pancakes and gourmet burgers with passion and creativity.
              </p>
              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-white mb-2">Hours</h4>
                <div className="text-gray-300 text-sm space-y-1">
                  <p><strong>Jealous Fork:</strong> Tue-Sun 9:00 AM - 3:00 PM</p>
                  <p><strong>Jealous Burger:</strong> Fri-Sat 5:00 PM - 9:00 PM</p>
                  <p className="text-gray-400">Closed Mondays</p>
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <a href="https://www.instagram.com/jealousfork" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-200 transition-colors" aria-label="Instagram">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://www.youtube.com/channel/UCQD6sE0iElxYQeD4V-rDcNw" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-200 transition-colors" aria-label="YouTube">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@jealousfork" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-200 transition-colors" aria-label="TikTok">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => scrollToSection('home')}
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('about')}
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('menu')}
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    Menu
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="text-gray-400 hover:text-gray-200 transition-colors"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <Link href="/gallery">
                    <a className="text-gray-400 hover:text-gray-200 transition-colors">Gallery</a>
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Local Areas */}
            <div>
              <h3 className="font-semibold text-lg mb-4">We Serve</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/near/south-beach">
                    <a className="text-gray-400 hover:text-gray-200 transition-colors">South Beach</a>
                  </Link>
                </li>
                <li>
                  <Link href="/near/coral-gables">
                    <a className="text-gray-400 hover:text-gray-200 transition-colors">Coral Gables</a>
                  </Link>
                </li>
                <li>
                  <Link href="/near/coconut-grove">
                    <a className="text-gray-400 hover:text-gray-200 transition-colors">Coconut Grove</a>
                  </Link>
                </li>
                <li>
                  <Link href="/near/brickell">
                    <a className="text-gray-400 hover:text-gray-200 transition-colors">Brickell</a>
                  </Link>
                </li>
                <li>
                  <Link href="/near/downtown-miami">
                    <a className="text-gray-400 hover:text-gray-200 transition-colors">Downtown Miami</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Jealous Fork. All rights reserved. | <Link href="/privacy"><a className="hover:text-gray-200 transition-colors">Privacy Policy</a></Link> | <Link href="/terms"><a className="hover:text-gray-200 transition-colors">Terms of Service</a></Link></p>
          </div>
        </div>
      </footer>
    </>
  );
}
