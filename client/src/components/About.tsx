export default function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              From Food Truck to <span className="text-gray-600">Culinary Destination</span>
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              After the tremendous success of Jealous Fork, the first artisan pancake food truck in the country, best friends Joaquin Ortiz and Henrik Telle needed more space. Their rise was evident by the line that consistently stretched around the block.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              People waited for hours just to get a taste of their Instagram-worthy pancakes. Jealous Fork has been featured by foodies and influencers across the country, with content creators traveling from out of state to experience our unique creations.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="text-3xl font-bold text-gray-900 mb-2">4.7★</div>
                <div className="text-gray-600">Google Rating</div>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div className="text-3xl font-bold text-gray-900 mb-2">400+</div>
                <div className="text-gray-600">Reviews</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/images/about/JO_HT Food Truck.jpg"
              alt="Jealous Fork Food Truck - where it all started"
              className="rounded-xl shadow-lg object-cover h-48 w-full"
              loading="lazy"
            />
            <img
              src="/images/about/Restaurant Telemundo National.jpg"
              alt="Jealous Fork featured on Telemundo National"
              className="rounded-xl shadow-lg mt-8 object-cover h-48 w-full"
              loading="lazy"
            />
            <img
              src="/images/about/PSX_20231111_065623.jpg"
              alt="Jealous Fork restaurant experience"
              className="rounded-xl shadow-lg -mt-8 object-cover h-48 w-full"
              loading="lazy"
            />
            <img
              src="/images/about/GGG1.jpg"
              alt="Jealous Fork signature dishes"
              className="rounded-xl shadow-lg object-cover h-48 w-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
