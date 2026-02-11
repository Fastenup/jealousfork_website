import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

export default function PrivacyPage() {
  return (
    <>
      <SEOHead 
        title="Privacy Policy | Jealous Fork Miami"
        description="Privacy Policy for Jealous Fork restaurant. Learn how we protect your personal information and data when you visit our website or restaurant."
        canonical="https://www.jealousfork.com/privacy"
      />
      <Navigation />
      
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-8 text-gray-900">
            Privacy Policy
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              <strong>Effective Date:</strong> January 1, 2025<br />
              <strong>Last Updated:</strong> December 28, 2024
            </p>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">1. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Personal Information</h3>
              <p className="mb-4 text-gray-700">
                When you make a reservation, place an order, or contact us, we may collect:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Name and contact information (email, phone number)</li>
                <li>Reservation details and dining preferences</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Special dietary requirements or accessibility needs</li>
              </ul>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Website Usage Information</h3>
              <p className="mb-4 text-gray-700">
                We automatically collect certain information when you visit our website:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>IP address and browser type</li>
                <li>Pages visited and time spent on our site</li>
                <li>Device information and screen resolution</li>
                <li>Referral source (how you found our website)</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">2. How We Use Your Information</h2>
              <p className="mb-4 text-gray-700">We use your information to:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Process reservations and fulfill your dining requests</li>
                <li>Communicate about your reservation or special events</li>
                <li>Improve our menu, service, and website experience</li>
                <li>Send promotional emails (only with your consent)</li>
                <li>Comply with legal obligations and food safety requirements</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">3. Information Sharing</h2>
              <p className="mb-4 text-gray-700">
                We do not sell, rent, or share your personal information with third parties except:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>With reservation platforms (Resy) to manage bookings</li>
                <li>With payment processors to handle transactions securely</li>
                <li>When required by law or to protect our legal rights</li>
                <li>With service providers who help us operate our business (under strict confidentiality)</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">4. Data Security</h2>
              <p className="mb-6 text-gray-700">
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction. However, no internet 
                transmission is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">5. Your Rights</h2>
              <p className="mb-4 text-gray-700">You have the right to:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Access and review your personal information</li>
                <li>Request corrections to inaccurate information</li>
                <li>Opt-out of promotional communications</li>
                <li>Request deletion of your personal information (subject to legal requirements)</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">6. Cookies and Tracking</h2>
              <p className="mb-6 text-gray-700">
                Our website uses cookies to enhance your browsing experience, analyze site traffic, 
                and remember your preferences. You can control cookie settings through your browser, 
                though this may affect website functionality.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">7. Children's Privacy</h2>
              <p className="mb-6 text-gray-700">
                Our website is not directed to children under 13. We do not knowingly collect 
                personal information from children under 13. If we discover such information 
                has been collected, we will delete it promptly.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">8. Changes to Privacy Policy</h2>
              <p className="mb-6 text-gray-700">
                We may update this Privacy Policy periodically. We will notify you of significant 
                changes by posting the updated policy on our website with a new effective date.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">9. Contact Information</h2>
              <p className="mb-4 text-gray-700">
                For questions about this Privacy Policy or to exercise your rights, contact us:
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