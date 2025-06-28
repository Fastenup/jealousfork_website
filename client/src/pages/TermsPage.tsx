import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

export default function TermsPage() {
  return (
    <>
      <SEOHead 
        title="Terms of Service | Jealous Fork Miami"
        description="Terms of Service for Jealous Fork restaurant. Read our terms and conditions for dining, reservations, and website use."
        canonical="https://jealousfork.com/terms"
      />
      <Navigation />
      
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-8 text-gray-900">
            Terms of Service
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              <strong>Effective Date:</strong> January 1, 2025<br />
              <strong>Last Updated:</strong> December 28, 2024
            </p>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">1. Acceptance of Terms</h2>
              <p className="mb-6 text-gray-700">
                By accessing our website, making a reservation, or dining at Jealous Fork, you agree 
                to be bound by these Terms of Service. If you do not agree with any part of these terms, 
                please do not use our services.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">2. Restaurant Services</h2>
              
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Operating Hours</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li><strong>Jealous Fork (Day Menu):</strong> Tuesday - Sunday, 9:00 AM - 3:00 PM</li>
                <li><strong>Jealous Burger (Evening Menu):</strong> Friday - Saturday, 5:00 PM - 9:00 PM</li>
                <li><strong>Closed:</strong> Mondays</li>
              </ul>
              
              <p className="mb-6 text-gray-700">
                Hours may vary during holidays or special events. Please check our website or call 
                ahead to confirm current operating hours.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">3. Reservations and Cancellations</h2>
              
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Reservation Policy</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Reservations are managed through Resy and are subject to availability</li>
                <li>We hold reservations for 15 minutes past the reserved time</li>
                <li>Large parties (6+ people) may require a deposit</li>
                <li>Special dietary requirements should be noted during reservation</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Cancellation Policy</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Please cancel at least 2 hours before your reservation time</li>
                <li>Late cancellations or no-shows may incur charges for large parties</li>
                <li>We reserve the right to charge a cancellation fee for repeated no-shows</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">4. Dining Policies</h2>
              
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Food Safety</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Please inform staff of any food allergies or dietary restrictions</li>
                <li>We cannot guarantee complete allergen-free preparation</li>
                <li>Consumption of raw or undercooked foods may increase risk of foodborne illness</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Conduct</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>We maintain a family-friendly environment</li>
                <li>Disruptive behavior may result in removal from the premises</li>
                <li>Proper attire is required; we reserve the right to refuse service</li>
                <li>Outside food and beverages are not permitted</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">5. Payment and Pricing</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Prices are subject to change without notice</li>
                <li>We accept cash and major credit cards</li>
                <li>Gratuity is not included unless noted for large parties</li>
                <li>Split checks available for parties of 6 or fewer</li>
                <li>We reserve the right to add an automatic gratuity for parties of 8 or more</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">6. Website Use</h2>
              
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Permitted Use</h3>
              <p className="mb-4 text-gray-700">
                Our website is provided for informational purposes and to facilitate reservations. 
                You may not:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Use the site for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Upload malicious content or spam</li>
                <li>Collect information about other users</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">7. Intellectual Property</h2>
              <p className="mb-6 text-gray-700">
                All content on this website, including text, images, logos, and recipes, is the 
                property of Jealous Fork and is protected by copyright and trademark laws. 
                Unauthorized use is prohibited.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">8. Limitation of Liability</h2>
              <p className="mb-6 text-gray-700">
                Jealous Fork shall not be liable for any indirect, incidental, special, or 
                consequential damages arising from your use of our services or website. Our 
                total liability shall not exceed the amount paid for services.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">9. Force Majeure</h2>
              <p className="mb-6 text-gray-700">
                We are not responsible for any failure to perform our obligations due to 
                circumstances beyond our reasonable control, including but not limited to 
                natural disasters, government actions, or public health emergencies.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">10. Modifications</h2>
              <p className="mb-6 text-gray-700">
                We reserve the right to modify these Terms of Service at any time. Changes 
                will be posted on our website with an updated effective date. Continued use 
                of our services constitutes acceptance of modified terms.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">11. Governing Law</h2>
              <p className="mb-6 text-gray-700">
                These terms are governed by the laws of the State of Florida. Any disputes 
                shall be resolved in the courts of Miami-Dade County, Florida.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">12. Contact Information</h2>
              <p className="mb-4 text-gray-700">
                For questions about these Terms of Service, contact us:
              </p>
              <div className="bg-gray-100 p-6 rounded-lg">
                <p className="mb-2 text-gray-700"><strong>Jealous Fork</strong></p>
                <p className="mb-2 text-gray-700">14417 SW 42nd St</p>
                <p className="mb-2 text-gray-700">Miami, FL 33175</p>
                <p className="mb-2 text-gray-700">Phone: (305) 699-1430</p>
                <p className="text-gray-700">Email: info@jealousfork.com</p>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}