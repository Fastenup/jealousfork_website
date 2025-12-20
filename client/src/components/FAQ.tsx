import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What makes Jealous Fork Miami's original artisan pancake restaurant?",
    answer: "We started as a food truck in 2018 and opened our brick-and-mortar restaurant in 2022. We were among the first in Miami to focus exclusively on artisan, made-from-scratch pancakes using premium ingredients and creative flavor combinations."
  },
  {
    question: "What are your operating hours and days?",
    answer: "Jealous Fork operates Tuesday-Sunday 9AM-3PM for breakfast and brunch. Jealous Burger expands our menu Friday-Saturday 3PM-9PM with gourmet burgers - and yes, pancakes are still available during burger hours! We're closed Mondays to ensure our team is rested and our ingredients are always fresh."
  },
  {
    question: "Do you take reservations for breakfast and brunch?",
    answer: "Yes! We accept reservations through Resy for both breakfast and brunch. We highly recommend booking ahead, especially for weekend brunch, as we're a popular destination for families throughout Miami-Dade."
  },
  {
    question: "What areas do you serve in Miami-Dade County?",
    answer: "We're located in Westchester at 14417 SW 42nd St and serve the entire Miami-Dade area. We're closest to Westchester, Tamiami, Fontainebleau, Sweetwater, Kendall West, and other western suburbs. We also welcome guests from downtown Miami, Coral Gables, and beyond."
  },
  {
    question: "Do you offer gluten-free or vegan pancake options?",
    answer: "Yes! We offer gluten-free pancake options and several vegan-friendly choices. Our kitchen is experienced in accommodating dietary restrictions. Please inform your server about any allergies or dietary needs when ordering."
  },
  {
    question: "What's the difference between Jealous Fork and Jealous Burger?",
    answer: "Jealous Fork is our breakfast and brunch concept (Tue-Sun 9AM-3PM) featuring artisan pancakes, gourmet breakfast items, and craft beverages. Jealous Burger is our evening concept (Fri-Sat 3PM-9PM) that expands our menu with 9 gourmet burgers crafted with the same creativity as our pancakes. During burger hours, you can order from BOTH menus!"
  },
  {
    question: "Do you have parking available?",
    answer: "Yes, we provide convenient parking for our guests. Located in suburban Westchester, parking is readily available and free, unlike many downtown Miami restaurants."
  },
  {
    question: "Are you family-friendly?",
    answer: "Absolutely! We're a family-owned restaurant that welcomes families with children. Our relaxed suburban atmosphere, kid-friendly menu options, and spacious seating make us perfect for family breakfast and brunch outings."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and cash. We also accept mobile payments including Apple Pay and Google Pay for your convenience."
  },
  {
    question: "Can I order takeout or delivery?",
    answer: "Yes! We offer takeout for both our breakfast/brunch and burger menus. We're also available on major delivery platforms including Uber Eats, DoorDash, and Grubhub for the Miami-Dade area."
  },
  {
    question: "Do you cater events or private parties?",
    answer: "We offer catering services for events throughout Miami-Dade County. Our breakfast and brunch catering is perfect for corporate events, family gatherings, and special occasions. Contact us directly to discuss your catering needs."
  },
  {
    question: "What are your most popular menu items?",
    answer: "Our signature artisan pancakes are our most popular items, especially our Instagram-worthy creations. For burgers, our gourmet beef patties and creative toppings are customer favorites. Our craft coffee and fresh juices are also highly rated."
  },
  {
    question: "Do you have outdoor seating?",
    answer: "Yes, we offer outdoor seating in our suburban location. It's perfect for enjoying Miami's beautiful weather while having breakfast or brunch with family and friends."
  },
  {
    question: "Are you hiring? How can I apply for a job?",
    answer: "We're always looking for passionate team members! You can apply in person at our Westchester location or follow us on social media @jealousfork for job postings. We value team members who share our commitment to quality and customer service."
  },
  {
    question: "What makes your pancakes 'Instagram-worthy'?",
    answer: "Our pancakes are crafted with artistic presentation, vibrant colors, creative toppings, and premium ingredients. Each plate is designed to be both delicious and visually stunning, perfect for sharing on social media."
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section id="faq" className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about Miami's original artisan pancake restaurant
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {item.question}
                </h3>
                <ChevronDown 
                  className={`h-5 w-5 text-gray-500 transition-transform flex-shrink-0 ${
                    openItems.includes(index) ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${
                openItems.includes(index) ? 'max-h-96' : 'max-h-0'
              }`}>
                <div className="px-6 pb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </section>
  );
}