export interface LocalArea {
  name: string;
  slug: string;
  description: string;
  distance?: string;
}

export const localAreas: LocalArea[] = [
  {
    name: "Edgewater",
    slug: "edgewater",
    description: "Located right in the heart of Edgewater, we're Miami's original artisan pancake restaurant serving our local neighborhood with Instagram-worthy pancakes and gourmet burgers daily.",
    distance: "1 min"
  },
  {
    name: "Midtown Miami",
    slug: "midtown-miami", 
    description: "Just minutes from the vibrant Midtown district, our artisan pancakes and craft burgers are perfect for Midtown professionals, shoppers, and Design District visitors.",
    distance: "5 min"
  },
  {
    name: "Wynwood",
    slug: "wynwood",
    description: "The perfect brunch destination after exploring Wynwood's world-famous street art. Our Instagram-worthy pancakes complement the district's creative energy and artistic spirit.",
    distance: "8 min"
  },
  {
    name: "Design District",
    slug: "design-district",
    description: "Where luxury meets comfort food. Our artistic pancake presentations and gourmet burgers complement the Design District's sophisticated shopping and gallery atmosphere.",
    distance: "6 min"
  },
  {
    name: "Upper East Side",
    slug: "upper-east-side",
    description: "Serving Miami's trendy Upper East Side with our signature breakfast and lunch offerings. A neighborhood favorite for young professionals and families.",
    distance: "8 min"
  },
  {
    name: "Downtown Miami",
    slug: "downtown-miami",
    description: "Bringing artisan quality to Miami's business district. Our famous pancakes and burgers fuel downtown professionals, residents, and tourists exploring the urban core.",
    distance: "12 min"
  },
  {
    name: "Brickell",
    slug: "brickell",
    description: "Miami's financial district's favorite breakfast destination. Our artisan pancakes and gourmet burgers are perfect for business meetings, weekend brunches, and Brickell residents.",
    distance: "18 min"
  },
  {
    name: "South Beach",
    slug: "south-beach",
    description: "The perfect pre-beach or post-beach meal! Our hearty pancakes and burgers fuel your South Beach adventures and beachside relaxation.",
    distance: "25 min"
  },
  {
    name: "Aventura",
    slug: "aventura",
    description: "North Miami's breakfast destination! Our famous pancakes and burgers are worth the drive from Aventura's upscale shopping centers and business districts.",
    distance: "35 min"
  },
  {
    name: "Coral Gables",
    slug: "coral-gables",
    description: "Serving the City Beautiful with our artisan breakfast creations. Popular with University of Miami students, faculty, and Coral Gables families seeking quality brunch.",
    distance: "25 min"
  },
  {
    name: "Coconut Grove",
    slug: "coconut-grove",
    description: "Bringing our bohemian breakfast vibes to match the Grove's laid-back atmosphere. Perfect for families and visitors exploring this historic waterfront neighborhood.",
    distance: "28 min"
  },
  {
    name: "Little Havana",
    slug: "little-havana",
    description: "Where American breakfast classics meet Miami's cultural heart. Our thoughtful approach respects tradition while celebrating breakfast innovation in this vibrant community.",
    distance: "20 min"
  }
];
