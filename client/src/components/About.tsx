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
                <div className="text-3xl font-bold text-gray-900 mb-2">461</div>
                <div className="text-gray-600">Reviews</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
              alt="Modern restaurant interior" 
              className="rounded-xl shadow-lg"
              loading="lazy"
            />
            <img 
              src="https://images.unsplash.com/photo-1506084868230-bb9d95c24759?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
              alt="Artisan pancakes with berries" 
              className="rounded-xl shadow-lg mt-8"
              loading="lazy"
            />
            <img 
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
              alt="Chef preparing food" 
              className="rounded-xl shadow-lg -mt-8"
              loading="lazy"
            />
            <img 
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
              alt="Gourmet burger" 
              className="rounded-xl shadow-lg"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
