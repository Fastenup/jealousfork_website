import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import ShoppingCart from './ShoppingCart';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const scrollToSection = (sectionId: string) => {
    if (location !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <a className="font-playfair font-bold text-xl sm:text-2xl lg:text-3xl text-gray-900 hover:text-gray-600 transition-colors">
                Jealous Fork
              </a>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-4 xl:space-x-8">
              <button 
                onClick={() => scrollToSection('home')}
                className="px-2 xl:px-3 py-2 text-sm xl:text-base font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')}
                className="px-2 xl:px-3 py-2 text-sm xl:text-base font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection('menu')}
                className="px-2 xl:px-3 py-2 text-sm xl:text-base font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Menu
              </button>
              <Link href="/full-menu">
                <a className="px-2 xl:px-3 py-2 text-sm xl:text-base font-medium text-gray-700 hover:text-gray-900 transition-colors">
                  Full Menu
                </a>
              </Link>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="px-2 xl:px-3 py-2 text-sm xl:text-base font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Reviews
              </button>
              <button 
                onClick={() => scrollToSection('faq')}
                className="px-2 xl:px-3 py-2 text-sm xl:text-base font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                FAQ
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="px-2 xl:px-3 py-2 text-sm xl:text-base font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Contact
              </button>
            </div>
          </div>
          
          {/* Cart and CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <ShoppingCart onCheckout={() => setLocation('/checkout')} />
            <button 
              onClick={() => scrollToSection('reservations')}
              className="bg-gray-900 text-white px-4 xl:px-6 py-2 rounded-full text-sm xl:text-base font-medium hover:bg-gray-800 transition-colors"
            >
              Reserve Table
            </button>
          </div>
          
          {/* Mobile cart and menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <ShoppingCart onCheckout={() => setLocation('/checkout')} />
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-sm border-t shadow-lg">
          <div className="px-4 pt-4 pb-6 space-y-2">
            <button 
              onClick={() => {
                scrollToSection('home');
                setIsMenuOpen(false);
              }}
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left rounded-lg transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => {
                scrollToSection('about');
                setIsMenuOpen(false);
              }}
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left rounded-lg transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => {
                scrollToSection('menu');
                setIsMenuOpen(false);
              }}
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left rounded-lg transition-colors"
            >
              Menu
            </button>
            <Link href="/full-menu">
              <span 
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left cursor-pointer rounded-lg transition-colors"
              >
                Full Menu
              </span>
            </Link>
            <button 
              onClick={() => {
                scrollToSection('testimonials');
                setIsMenuOpen(false);
              }}
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left rounded-lg transition-colors"
            >
              Reviews
            </button>
            <button 
              onClick={() => {
                scrollToSection('faq');
                setIsMenuOpen(false);
              }}
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left rounded-lg transition-colors"
            >
              FAQ
            </button>
            <button 
              onClick={() => {
                scrollToSection('contact');
                setIsMenuOpen(false);
              }}
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 w-full text-left rounded-lg transition-colors"
            >
              Contact
            </button>
            <button 
              onClick={() => {
                scrollToSection('reservations');
                setIsMenuOpen(false);
              }}
              className="block px-4 py-3 text-base font-medium bg-gray-900 text-white rounded-lg mt-4 text-center hover:bg-gray-800 transition-colors"
            >
              Reserve Table
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
