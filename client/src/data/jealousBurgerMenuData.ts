export interface JealousBurgerMenuItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: 'apps' | 'burgers' | 'fries' | 'desserts';
  image: string;
}

export const jealousBurgerMenuItems: JealousBurgerMenuItem[] = [
  // Apps
  {
    id: 1,
    name: "Hummus & Roasted Flat Bread",
    slug: "hummus-roasted-flatbread-jb",
    description: "Turkish White Cheese, Sunflower Seeds, Dried Cranberries, Smoked Paprika",
    price: 15,
    category: "apps",
    image: "https://images.unsplash.com/photo-1541592106381-b31e8e145f52?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 2,
    name: "Smoked Burrata",
    slug: "smoked-burrata-jb",
    description: "Black Salt, Herb Oil, Cherry Toms, Toasted Ciabatta",
    price: 16,
    category: "apps",
    image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 3,
    name: "Jalapeño Poppers",
    slug: "jalapeno-poppers",
    description: "Cream Cheese, Raspberry Coulis, Tarragon Ranch",
    price: 14,
    category: "apps",
    image: "https://images.unsplash.com/photo-1599919734942-7d7d1fa5bdd5?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 4,
    name: "House Salad",
    slug: "house-salad-jb",
    description: "Mixed Greens, Vine Ripened Tomatoes, Cucumbers, Parm Reggiano. Add Lobster +$18, Steak +$11, Pork Belly +$7, Pulled Chicken +$5",
    price: 11,
    category: "apps",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center"
  },

  // Fries
  {
    id: 5,
    name: "Classic French Fries",
    slug: "classic-french-fries",
    description: "Perfectly seasoned and crispy",
    price: 5,
    category: "fries",
    image: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 6,
    name: "Truffle Fries",
    slug: "truffle-fries",
    description: "Hand-cut fries with truffle oil and parmesan",
    price: 7,
    category: "fries",
    image: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 7,
    name: "Sweet Potato Fries",
    slug: "sweet-potato-fries",
    description: "Crispy sweet potato fries with special seasoning",
    price: 7,
    category: "fries",
    image: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=400&h=300&fit=crop&crop=center"
  },

  // Burgers
  {
    id: 8,
    name: "The Classic",
    slug: "the-classic-jb",
    description: "Cheddar Cheese, That Secret Sauce, Tomato, Onion, Spring Greens",
    price: 13,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 9,
    name: "Jesse James",
    slug: "jesse-james-jb",
    description: "Applewood Smoked Bacon, Crispy Onions, BBQ Sauce, Cheddar Cheese",
    price: 16,
    category: "burgers",
    image: "/images/food/jesse-james-burger.jpg"
  },
  {
    id: 10,
    name: "La La Land",
    slug: "la-la-land",
    description: "Guac, Tomato, Cilantro, Sunflower Seeds, Dried Cranberries, White Cheddar, Spring Greens",
    price: 16,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 11,
    name: "The Devil's Advocate",
    slug: "devils-advocate",
    description: "Smokehouse Chili, Cheddar Cheese, Hot Hot Shake First, Fried Egg",
    price: 17,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 12,
    name: "Lé French",
    slug: "le-french",
    description: "Brie Cheese, Caramelized Onions, Framboise, Spring Greens",
    price: 17,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 13,
    name: "The OG JB",
    slug: "the-og-jb",
    description: "Pickled Onions, Smoked Gouda, Tomato-Poblano Jam",
    price: 17,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 14,
    name: "Billie Holiday",
    slug: "billie-holiday",
    description: "Maytag Blue Cheese, Caramelized Onions, Spring Greens",
    price: 16,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 15,
    name: "Que Bola Meng",
    slug: "que-bola-meng",
    description: "Guava & Queso, Caramelized Onions, Papitas",
    price: 16,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 16,
    name: "VEGburger",
    slug: "vegburger",
    description: "Black Bean-Chipotle Patty, Aged White Cheddar, Tomato, Onion, Spring Greens",
    price: 16,
    category: "burgers",
    image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop&crop=center"
  },

  // Desserts
  {
    id: 17,
    name: "Double Fudge Chocolate Chip Brownie & Vanilla Ice Cream",
    slug: "double-fudge-brownie",
    description: "Get Fancy and add a topping for $2: Crushed Oreo, Reese's Pieces, Nutter Butter Cookies or Applewood Smoked Bacon Bits",
    price: 11,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 18,
    name: "Key Lime Pie",
    slug: "key-lime-pie",
    description: "Homemade Whipped Cream",
    price: 11,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 19,
    name: "Stout Float",
    slug: "stout-float",
    description: "Like a Root Beer Float but with a stout beer. Must be 21+",
    price: 14,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1551024739-2bd62a500392?w=400&h=300&fit=crop&crop=center"
  }
];

export const jealousBurgerCategories = [
  { id: 'apps', name: 'Appetizers', description: 'Start your evening right' },
  { id: 'fries', name: 'Fries', description: 'Perfect sides for any burger' },
  { id: 'burgers', name: 'Gourmet Burgers', description: 'Our signature evening burgers' },
  { id: 'desserts', name: 'Desserts', description: 'Sweet endings to your meal' }
];