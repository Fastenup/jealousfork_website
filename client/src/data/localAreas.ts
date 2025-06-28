export interface LocalArea {
  name: string;
  slug: string;
  description: string;
  distance?: string;
}

export const localAreas: LocalArea[] = [
  {
    name: "South Beach",
    slug: "south-beach",
    description: "Bringing our famous artisan pancakes and gourmet burgers to the vibrant heart of South Beach. Whether you're looking for the perfect post-beach brunch or Instagram-worthy breakfast, Jealous Fork delivers an exceptional dining experience.",
    distance: "25 min"
  },
  {
    name: "Coral Gables",
    slug: "coral-gables",
    description: "Serving the elegant community of Coral Gables with our signature pancake creations. From our humble food truck beginnings to our brick-and-mortar restaurant, we bring the same passion and quality to every neighborhood in Miami.",
    distance: "15 min"
  },
  {
    name: "Coconut Grove",
    slug: "coconut-grove",
    description: "The bohemian charm of Coconut Grove meets the artisan excellence of Jealous Fork. Experience Miami's original pancake restaurant with delivery and pickup options available throughout the Grove.",
    distance: "20 min"
  },
  {
    name: "Brickell",
    slug: "brickell",
    description: "Fueling the business district with premium breakfast and brunch options. Our Instagram-worthy pancakes and gourmet burgers are perfect for business meetings, weekend brunches, or solo dining experiences.",
    distance: "18 min"
  },
  {
    name: "Downtown Miami",
    slug: "downtown-miami",
    description: "Bringing artisan quality to the urban core of Miami. Whether you're a downtown resident or just visiting, experience why food critics and influencers travel from across the country to try our pancakes.",
    distance: "22 min"
  },
  {
    name: "Wynwood",
    slug: "wynwood",
    description: "The artistic spirit of Wynwood pairs perfectly with our creative pancake artistry. Join the foodie culture that has made Jealous Fork a must-visit destination for locals and tourists alike.",
    distance: "25 min"
  },
  {
    name: "Little Havana",
    slug: "little-havana",
    description: "Adding our American breakfast classics to the rich culinary landscape of Little Havana. Our fusion of traditional pancake techniques with innovative flavors creates a unique dining experience.",
    distance: "12 min"
  },
  {
    name: "Aventura",
    slug: "aventura",
    description: "Serving the upscale Aventura community with our premium breakfast and brunch offerings. From vegan options to indulgent dessert pancakes, we have something for every palate.",
    distance: "35 min"
  }
];
