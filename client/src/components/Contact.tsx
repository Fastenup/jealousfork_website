import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const { toast } = useToast();

  // Initialize Resy widget
  useEffect(() => {
    // Load Resy widget script if not already loaded
    if (!document.querySelector('script[src="https://widgets.resy.com/embed.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://widgets.resy.com/embed.js';
      script.async = true;
      document.head.appendChild(script);
      
      script.onload = () => {
        initializeWidget();
      };
    } else {
      // Script already loaded, initialize widget
      initializeWidget();
    }

    function initializeWidget() {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const button = document.getElementById('resyButton-P9CmnE96lqIg1Nk1WphHD');
        if (button && (window as any).resyWidget) {
          (window as any).resyWidget.addButton(button, {
            venueId: 90707,
            apiKey: "Xyco1xMNKGCe2FaoSs5GAcr5dVh5gvSA",
            replace: true
          });
        }
      }, 100);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Success message
    toast({
      title: "Message sent successfully!",
      description: "We'll get back to you soon.",
    });
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Visit Us <span className="text-gray-600">Today</span>
          </h2>
          <p className="text-xl text-gray-600">Located in the heart of Miami - Easy parking and accessible by public transport</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="font-playfair text-2xl font-semibold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-900 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-gray-600">14417 SW 42nd Street, Miami, FL 33175</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-900 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-gray-600">(305) 699-1430</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-900 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p className="font-semibold">Hours</p>
                    <div className="text-gray-600">
                      <p><strong>Jealous Fork:</strong> Tuesday - Sunday: 9:00 AM - 3:00 PM</p>
                      <p><strong>Jealous Burger:</strong> Friday & Saturday: 5:00 PM - 9:00 PM</p>
                      <p className="text-sm text-gray-500 mt-1">Closed Mondays</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Map */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[400px]">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3595.7280444847775!2d-80.43037368508314!3d25.729462283679888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b92e2e4ad5f5%3A0x123456789abcdef!2s14417%20SW%2042nd%20St%2C%20Miami%2C%20FL%2033175!5e0!3m2!1sen!2sus!4v1640995200000!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Jealous Fork Location"
              ></iframe>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="font-playfair text-2xl font-semibold mb-6">Send Us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input 
                      type="text" 
                      id="firstName" 
                      name="firstName" 
                      required 
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-warm-amber focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input 
                      type="text" 
                      id="lastName" 
                      name="lastName" 
                      required 
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-warm-amber focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-warm-amber focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone (Optional)
                  </label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-warm-amber focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message *
                  </label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={4} 
                    required 
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-warm-amber focus:border-transparent"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Local Business Information - Enhanced for SEO */}
        <div className="mt-16 bg-gray-50 rounded-3xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Visit Miami's Original Artisan Pancake Restaurant</h3>
            <p className="text-xl text-gray-600">Serving Southwest Miami, Kendall, Westchester, and Greater Miami-Dade</p>
          </div>
          
          {/* Service Areas - Updated for actual location */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h4 className="font-bold text-2xl text-gray-900 mb-6 text-center">We Deliver To Your Neighborhood</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-3 text-lg">Close Proximity (Under 15 min)</h5>
                <div className="space-y-1 text-gray-700">
                  <p>• Westchester (5 min)</p>
                  <p>• Olympia Heights (8 min)</p>
                  <p>• Sunset (10 min)</p>
                  <p>• Kendall Lakes (12 min)</p>
                  <p>• Flagami (12 min)</p>
                  <p>• Tamiami (14 min)</p>
                </div>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-3 text-lg">Greater Kendall Area (15-25 min)</h5>
                <div className="space-y-1 text-gray-700">
                  <p>• Kendall (15 min)</p>
                  <p>• Kendall West (18 min)</p>
                  <p>• The Hammocks (20 min)</p>
                  <p>• Kendale Lakes (22 min)</p>
                  <p>• Fontainebleau (22 min)</p>
                  <p>• Westwood Lakes (24 min)</p>
                </div>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-3 text-lg">Extended Miami-Dade (25+ min)</h5>
                <div className="space-y-1 text-gray-700">
                  <p>• Coral Gables (25 min)</p>
                  <p>• Doral (28 min)</p>
                  <p>• Sweetwater (30 min)</p>
                  <p>• The Crossings (32 min)</p>
                  <p>• Little Havana (35 min)</p>
                  <p>• Pinecrest (38 min)</p>
                </div>
              </div>
            </div>
            
            {/* Delivery Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid md:grid-cols-2 gap-6 text-center">
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="text-2xl font-bold text-gray-900 mb-2">$4.99</div>
                  <div className="text-gray-600">Delivery Fee</div>
                  <div className="text-sm text-gray-500 mt-1">All areas within 45 minutes</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="text-2xl font-bold text-gray-900 mb-2">30-45 min</div>
                  <div className="text-gray-600">Delivery Time</div>
                  <div className="text-sm text-gray-500 mt-1">Fresh & hot guaranteed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Resy Reservation Widget Section */}
        <div id="reservations" className="mt-16 bg-white rounded-3xl p-8 md:p-12 shadow-lg">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Make a Reservation</h3>
            <p className="text-xl text-gray-600 mb-8">Book your table directly through Resy</p>
            <div className="flex justify-center">
              <a 
                href="https://resy.com/cities/miami-fl/venues/jealous-fork" 
                id="resyButton-P9CmnE96lqIg1Nk1WphHD"
                className="inline-block bg-gray-900 text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
              >
                Book your Jealous Fork reservation on Resy
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
