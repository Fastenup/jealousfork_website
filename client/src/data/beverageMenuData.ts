export interface BeverageItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number | string;
  category: 'cocktails' | 'coffee' | 'beer' | 'wine';
  type?: string;
  glassBottle?: { glass?: number; bottle?: number };
  image: string;
}

export const beverageMenuItems: BeverageItem[] = [
  // Cocktails - In The Ether
  {
    id: 1,
    name: "Blueberry Kir Royale",
    slug: "blueberry-kir-royale",
    description: "Sparkling wine cocktail with blueberry notes",
    price: 12,
    category: "cocktails",
    type: "In The Ether",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 2,
    name: "Pineapple Orange Mimosa",
    slug: "pineapple-orange-mimosa",
    description: "Tropical twist on the classic mimosa",
    price: 12,
    category: "cocktails",
    type: "In The Ether",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 3,
    name: "Mixed Berry Sangria",
    slug: "mixed-berry-sangria",
    description: "White or Red Wine base with mixed berries",
    price: 12,
    category: "cocktails",
    type: "In The Ether",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&crop=center"
  },

  // Sake Cocktails
  {
    id: 4,
    name: "Old School Tokyo",
    slug: "old-school-tokyo",
    description: "Toasted Oak Sake, Orange Bitters, Tobacco",
    price: 12,
    category: "cocktails",
    type: "Sake Cocktails",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 5,
    name: "Femme Fatale",
    slug: "femme-fatale",
    description: "Sake, Cucumber, Jalapeño, Lime",
    price: 12,
    category: "cocktails",
    type: "Sake Cocktails",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 6,
    name: "Espresso Cloud Martini",
    slug: "espresso-cloud-martini",
    description: "Espresso Sake, Chocolate, Crèma Blanca",
    price: 12,
    category: "cocktails",
    type: "Sake Cocktails",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 7,
    name: "Nomu Mule",
    slug: "nomu-mule",
    description: "Sake, Fresh Lime, Ginger",
    price: 12,
    category: "cocktails",
    type: "Sake Cocktails",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 8,
    name: "French 75 Martini",
    slug: "french-75-martini",
    description: "Gin Sake, Raspberry, Juniper, Lemon Zest",
    price: 12,
    category: "cocktails",
    type: "Sake Cocktails",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 9,
    name: "Pomegranate Mojito",
    slug: "pomegranate-mojito",
    description: "Sake, Pomegranate Nectar, Fresh Mint",
    price: 12,
    category: "cocktails",
    type: "Sake Cocktails",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 10,
    name: "Bali Lemonade",
    slug: "bali-lemonade",
    description: "Sake, Tamarind, Fresh Mint",
    price: 12,
    category: "cocktails",
    type: "Sake Cocktails",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 11,
    name: "Michelada",
    slug: "michelada",
    description: "Lager, Chamoy, Tajin, Watermelon Chili Lolli",
    price: 12,
    category: "cocktails",
    type: "Sake Cocktails",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 12,
    name: "Bloody Mary",
    slug: "bloody-mary",
    description: "Sake, Tomato Juice, Queen Olives",
    price: 12,
    category: "cocktails",
    type: "Sake Cocktails",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 13,
    name: "Lychee Martini",
    slug: "lychee-martini",
    description: "Sake, Elderflower, Black Pepper",
    price: 12,
    category: "cocktails",
    type: "Sake Cocktails",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&crop=center"
  },

  // Coffee & Specialty Drinks
  {
    id: 14,
    name: "Sweet Potato Cappuccino",
    slug: "sweet-potato-cappuccino",
    description: "Unique seasonal cappuccino with sweet potato flavor",
    price: 7,
    category: "coffee",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 15,
    name: "Banana Matcha Tea Latte",
    slug: "banana-matcha-latte",
    description: "Creamy matcha latte with banana notes",
    price: 7,
    category: "coffee",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 16,
    name: "Salted Caramel Affogato",
    slug: "salted-caramel-affogato",
    description: "Espresso poured over vanilla gelato with salted caramel",
    price: 7,
    category: "coffee",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 17,
    name: "Jamaican Ginger Tea",
    slug: "jamaican-ginger-tea",
    description: "Spicy and warming ginger tea blend",
    price: 7,
    category: "coffee",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 18,
    name: "Strawberry Basil Fizz",
    slug: "strawberry-basil-fizz",
    description: "Refreshing non-alcoholic beverage with fresh herbs",
    price: 7,
    category: "coffee",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 19,
    name: "Espresso + Custard",
    slug: "espresso-custard",
    description: "Rich espresso with house-made custard",
    price: 7,
    category: "coffee",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 20,
    name: "Chai Tea Latte",
    slug: "chai-tea-latte",
    description: "Spiced tea latte with steamed milk",
    price: 7,
    category: "coffee",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 21,
    name: "Dirty Chai",
    slug: "dirty-chai",
    description: "Chai tea latte with a shot of espresso",
    price: 7,
    category: "coffee",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 22,
    name: "The Kitchen's Fancy Water",
    slug: "fancy-water",
    description: "Orange Bitters, Lime, Simple, 2 Straws (32oz)",
    price: 11,
    category: "coffee",
    image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&crop=center"
  },

  // Beer
  {
    id: 23,
    name: "Orange Blossom Honey Pilsner",
    slug: "orange-blossom-honey-pilsner",
    description: "Crisp, refreshing & lightly hopped",
    price: 6.50,
    category: "beer",
    type: "Pilsner & Lager",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 24,
    name: "26° Thirst Control Pils",
    slug: "thirst-control-pils",
    description: "Crisp, refreshing & lightly hopped",
    price: 8.75,
    category: "beer",
    type: "Pilsner & Lager",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 25,
    name: "Ransack the Universe IPA",
    slug: "ransack-universe-ipa",
    description: "Floral, earthy, citrusy, piney & fully hopped",
    price: 8.50,
    category: "beer",
    type: "IPA",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 26,
    name: "Ghost in the Machine Double Hazy IPA",
    slug: "ghost-machine-double-hazy",
    description: "Floral, earthy, citrusy, piney & fully hopped",
    price: 11.00,
    category: "beer",
    type: "IPA",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&crop=center"
  },

  // Wine
  {
    id: 27,
    name: "Cava Brut Jaume Serra Cristalino",
    slug: "cava-brut-cristalino",
    description: "Spanish sparkling wine",
    price: "Glass: $9 | Bottle: $45",
    category: "wine",
    type: "Sparkling & White",
    glassBottle: { glass: 9.00, bottle: 45.00 },
    image: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 28,
    name: "Sauvignon Blanc Angeline Vineyards",
    slug: "sauvignon-blanc-angeline",
    description: "Crisp white wine with citrus notes",
    price: "Glass: $10 | Bottle: $50",
    category: "wine",
    type: "Sparkling & White",
    glassBottle: { glass: 10.00, bottle: 50.00 },
    image: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 29,
    name: "Malbec Trapiche Oak Cask",
    slug: "malbec-trapiche-oak",
    description: "Full-bodied red wine with oak notes",
    price: "Glass: $10.50 | Bottle: $49",
    category: "wine",
    type: "Red",
    glassBottle: { glass: 10.50, bottle: 49.00 },
    image: "https://images.unsplash.com/photo-1506377247377-4bc5b9f2cd5c?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 30,
    name: "Pinot Noir Angeline",
    slug: "pinot-noir-angeline",
    description: "Light to medium-bodied red wine",
    price: "Glass: $14 | Bottle: $66",
    category: "wine",
    type: "Red",
    glassBottle: { glass: 14.00, bottle: 66.00 },
    image: "https://images.unsplash.com/photo-1506377247377-4bc5b9f2cd5c?w=400&h=300&fit=crop&crop=center"
  }
];

export const beverageCategories = [
  { id: 'cocktails', name: 'Signature Cocktails', description: 'Unique sake-based cocktails and classic favorites' },
  { id: 'coffee', name: 'Coffee & Specialty Drinks', description: 'Artisan coffee drinks and specialty beverages' },
  { id: 'beer', name: 'Craft Beer', description: 'Carefully curated selection of craft beers' },
  { id: 'wine', name: 'Wine Selection', description: 'Quality wines by the glass or bottle' }
];