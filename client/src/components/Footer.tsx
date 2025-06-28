import { Link } from "wouter";

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
            Ready to Experience <span className="text-warm-amber">Jealous Fork</span>?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Book your table now or order online for pickup and delivery
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://resy.com/cities/miami-fl/jealous-fork" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-warm-amber text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-warm-amber/90 transition-all transform hover:scale-105"
            >
              Make Reservation
            </a>
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
                className="font-playfair font-bold text-3xl text-white hover:text-warm-amber transition-colors"
              >
                Jealous Fork
              </button>
              <p className="mt-4 text-gray-400 leading-relaxed">
                Miami's original artisan pancake restaurant. From our humble beginnings as a food truck to our current restaurant, we continue to serve Instagram-worthy pancakes and gourmet burgers with passion and creativity.
              </p>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="text-gray-400 hover:text-warm-amber transition-colors" aria-label="Twitter">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-warm-amber transition-colors" aria-label="Pinterest">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.22.083.339-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.162-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z.017-.001z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-warm-amber transition-colors" aria-label="Instagram">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
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
                    className="text-gray-400 hover:text-warm-amber transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('about')}
                    className="text-gray-400 hover:text-warm-amber transition-colors"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('menu')}
                    className="text-gray-400 hover:text-warm-amber transition-colors"
                  >
                    Menu
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="text-gray-400 hover:text-warm-amber transition-colors"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <Link href="/gallery">
                    <a className="text-gray-400 hover:text-warm-amber transition-colors">Gallery</a>
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
                    <a className="text-gray-400 hover:text-warm-amber transition-colors">South Beach</a>
                  </Link>
                </li>
                <li>
                  <Link href="/near/coral-gables">
                    <a className="text-gray-400 hover:text-warm-amber transition-colors">Coral Gables</a>
                  </Link>
                </li>
                <li>
                  <Link href="/near/coconut-grove">
                    <a className="text-gray-400 hover:text-warm-amber transition-colors">Coconut Grove</a>
                  </Link>
                </li>
                <li>
                  <Link href="/near/brickell">
                    <a className="text-gray-400 hover:text-warm-amber transition-colors">Brickell</a>
                  </Link>
                </li>
                <li>
                  <Link href="/near/downtown-miami">
                    <a className="text-gray-400 hover:text-warm-amber transition-colors">Downtown Miami</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Jealous Fork. All rights reserved. | <Link href="/privacy"><a className="hover:text-warm-amber transition-colors">Privacy Policy</a></Link> | <Link href="/terms"><a className="hover:text-warm-amber transition-colors">Terms of Service</a></Link></p>
          </div>
        </div>
      </footer>
    </>
  );
}
