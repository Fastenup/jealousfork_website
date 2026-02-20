export interface LocalArea {
  name: string;
  slug: string;
  description: string;
  distance?: string;
}

export const localAreas: LocalArea[] = [
  {
    name: "Kendall",
    slug: "kendall",
    description: "Located in the heart of Kendall at 14417 SW 42nd St, Jealous Fork is your neighborhood's favorite breakfast and brunch destination. We serve award-winning artisan pancakes, fluffy Japanese-style stacks, and gourmet burgers that have made us famous across Miami. Whether you're searching for the best pancakes near you or a perfect brunch spot in Kendall, we're right here in your community.",
    distance: "5 min"
  },
  {
    name: "West Kendall",
    slug: "west-kendall",
    description: "West Kendall's premier breakfast and brunch destination is just minutes away. Our award-winning artisan pancakes and gourmet burgers bring families together. From fluffy pancakes to Instagram-worthy breakfast creations, Jealous Fork delivers an exceptional dining experience worth the short drive from West Kendall.",
    distance: "15 min"
  },
  {
    name: "Edgewater",
    slug: "edgewater",
    description: "Bringing Miami's best artisan pancakes and brunch to Edgewater residents. Our award-winning breakfast creations are well worth the drive from this vibrant waterfront neighborhood.",
    distance: "20 min"
  },
  {
    name: "Midtown Miami",
    slug: "midtown-miami", 
    description: "A must-visit brunch destination for Midtown Miami residents and Design District shoppers. Our artisan pancakes and gourmet burgers are worth the short drive from Midtown.",
    distance: "18 min"
  },
  {
    name: "Wynwood",
    slug: "wynwood",
    description: "The perfect brunch destination after exploring Wynwood's world-famous street art. Our Instagram-worthy pancakes complement the district's creative energy and artistic spirit.",
    distance: "20 min"
  },
  {
    name: "Design District",
    slug: "design-district",
    description: "Where luxury meets comfort food. Our artistic pancake presentations and gourmet burgers complement the Design District's sophisticated shopping and gallery atmosphere.",
    distance: "18 min"
  },
  {
    name: "Upper East Side",
    slug: "upper-east-side",
    description: "Serving Miami's trendy Upper East Side with our signature breakfast and brunch offerings. Our artisan pancakes and gourmet burgers are a favorite among UES foodies.",
    distance: "22 min"
  },
  {
    name: "Downtown Miami",
    slug: "downtown-miami",
    description: "Bringing artisan quality to Miami's business district. Our famous pancakes and burgers fuel downtown professionals, residents, and tourists exploring the urban core.",
    distance: "15 min"
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
    description: "Looking for the best breakfast in South Beach? Jealous Fork is just 25 minutes from Ocean Drive and worth every minute. Fuel your South Beach adventures with our award-winning artisan pancakes — perfect before hitting the beach or after a night on Lincoln Road. 4.7★ Google | 4.6★ Yelp | Featured on Telemundo. Book on Resy or order delivery to your South Beach hotel!",
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
  },
    {
    name: "Kendale Lakes",
    slug: "kendale-lakes",
    description: "Bringing Miami's original artisan pancake experience to Kendale Lakes families and residents. Our Instagram-worthy breakfast creations are worth the drive from this vibrant community.",
    distance: "30 min"
  },
  {
    name: "Tamiami",
    slug: "tamiami",
    description: "Serving the diverse Tamiami corridor with our signature breakfast and brunch offerings. From artisan pancakes to gourmet burgers, we bring quality dining to West Miami-Dade.",
    distance: "28 min"
  },
  {
    name: "Westwood Lakes",
    slug: "westwood-lakes",
    description: "The perfect brunch destination for Westwood Lakes residents seeking exceptional breakfast cuisine. Our artisan pancakes and craft beverages make any morning special.",
    distance: "26 min"
  },
  {
    name: "Olympia Heights",
    slug: "olympia-heights",
    description: "Bringing our award-winning breakfast experience to the Olympia Heights community. From our food truck origins to fine dining, we serve quality that brings families together.",
    distance: "24 min"
  },
  {
    name: "Westchester",
    slug: "westchester",
    description: "Serving the established Westchester community with our signature artisan pancakes and gourmet burgers. A family-friendly destination for this well-established Miami neighborhood.",
    distance: "22 min"
  },
  {
    name: "Sunset",
    slug: "sunset",
    description: "Bringing our Instagram-worthy breakfast creations to the diverse Sunset area. Our artisan pancakes and craft beverages make every morning memorable for local families.",
    distance: "25 min"
  },
  {
    name: "Fontainebleau",
    slug: "fontainebleau",
    description: "The perfect brunch spot for Fontainebleau residents seeking exceptional breakfast cuisine. From our famous pancakes to gourmet burgers, we deliver quality worth the journey.",
    distance: "28 min"
  },
  {
    name: "Sweetwater",
    slug: "sweetwater",
    description: "Serving the growing Sweetwater community with Miami's original artisan pancake experience. Our breakfast and brunch offerings bring families together over exceptional food.",
    distance: "35 min"
  },
  {
    name: "Doral",
    slug: "doral",
    description: "Doral's favorite brunch spot is just 38 minutes away! Jealous Fork brings Miami's most Instagram-worthy pancakes to the City of Doral. Featured on Telemundo National, our artisan creations like the Chocolate Oreo Chip Pancake and Hot Maple Flatbread have earned us 4.7★ on Google. Perfect for Doral families, Doral business professionals, and anyone craving the best breakfast near Doral Golf Resort, CityPlace Doral, or Downtown Doral.",
    distance: "38 min"
  },
  {
    name: "The Hammocks",
    slug: "the-hammocks",
    description: "A family dining destination for The Hammocks community. Our Instagram-worthy pancakes and gourmet burgers make weekend brunch special for this thriving suburban area.",
    distance: "40 min"
  },
  {
    name: "The Crossings",
    slug: "the-crossings",
    description: "Bringing Miami's original artisan pancake restaurant experience to The Crossings. Our exceptional breakfast and brunch offerings are worth the drive for discerning families.",
    distance: "42 min"
  },
  {
    name: "Dadeland",
    slug: "dadeland",
    description: "Just minutes from Dadeland Mall, Jealous Fork is the perfect breakfast and brunch stop for Dadeland shoppers and residents. Award-winning artisan pancakes and gourmet burgers — a perfect complement to a day of shopping.",
    distance: "15 min"
  },
  {
    name: "Hialeah",
    slug: "hialeah",
    description: "Bringing Miami's best artisan pancakes and brunch to Hialeah residents. Our creative breakfast creations and gourmet burgers are worth the drive from Hialeah — a family-friendly destination for all ages.",
    distance: "30 min"
  },
  {
    name: "Flagami",
    slug: "flagami",
    description: "Serving the Flagami community with award-winning artisan pancakes and gourmet burgers. Just a short drive from Flagami to the best breakfast experience in Miami.",
    distance: "15 min"
  },
  {
    name: "Miami Lakes",
    slug: "miami-lakes",
    description: "Miami Lakes' favorite breakfast destination is just a drive away. Jealous Fork serves artisan pancakes, fluffy breakfast stacks, and gourmet burgers that make the trip from Miami Lakes well worthwhile.",
    distance: "35 min"
  },
  {
    name: "Town and Country",
    slug: "town-and-country",
    description: "Conveniently located near Town and Country, Jealous Fork is your go-to breakfast and brunch spot. Our artisan pancakes and gourmet burgers are just minutes away from the Town and Country area.",
    distance: "10 min"
  },
  {
    name: "South Miami",
    slug: "south-miami",
    description: "South Miami's premier breakfast and brunch destination is just a quick drive away. Jealous Fork serves award-winning artisan pancakes and creative brunch dishes loved by South Miami families and UM students.",
    distance: "20 min"
  },
  {
    name: "Pinecrest",
    slug: "pinecrest",
    description: "Pinecrest families love Jealous Fork's artisan pancakes and brunch. Just a short drive from Pinecrest, our award-winning breakfast creations and dog-friendly patio make us the perfect weekend destination.",
    distance: "20 min"
  },
  {
    name: "Cutler Bay",
    slug: "cutler-bay",
    description: "Bringing Miami's original artisan pancake experience to Cutler Bay. Our award-winning pancakes, creative breakfast dishes, and Friday-Saturday gourmet burgers are worth the drive from Cutler Bay.",
    distance: "30 min"
  }
];
