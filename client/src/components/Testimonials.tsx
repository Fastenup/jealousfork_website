export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah M.",
      source: "Yelp Review",
      rating: 5,
      text: "Absolutely incredible! The pancakes are truly Instagram-worthy and taste even better than they look. Worth the wait and definitely worth traveling for!",
      initial: "S"
    },
    {
      id: 2,
      name: "Mike R.",
      source: "Google Review",
      rating: 5,
      text: "From food truck to restaurant, these guys haven't lost their touch. The burgers are amazing and the atmosphere is perfect for brunch with friends.",
      initial: "M"
    },
    {
      id: 3,
      name: "Amanda K.",
      source: "TripAdvisor",
      rating: 5,
      text: "Best breakfast spot in Miami! The vegan options are fantastic and the service is always friendly. I drive 30 minutes just to eat here!",
      initial: "A"
    }
  ];

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            What People Are <span className="text-gray-600">Saying</span>
          </h2>
          <p className="text-xl text-gray-600">Loved by foodies and influencers across the country</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                <div className="flex text-gray-900">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.initial}
                </div>
                <div className="ml-3">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.source}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
