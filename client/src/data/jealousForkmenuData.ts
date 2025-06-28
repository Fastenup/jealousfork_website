export interface JealousForkMenuItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: 'starters' | 'pancakes' | 'sandwiches' | 'salads';
  dietary?: string[];
  image: string;
}

export const jealousForkMenuItems: JealousForkMenuItem[] = [
  // Starters / Para la Mesa / Shareable
  {
    id: 1,
    name: "Hot Maple Flatbread",
    slug: "hot-maple-flatbread",
    description: "Cup & Char Pepperoni, Double Cream Mozzarella, Red Chili-Black Pepper Maple",
    price: 16,
    category: "starters",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 2,
    name: "Double Yolk Egg Jar",
    slug: "double-yolk-egg-jar",
    description: "Bacon, Sweet Potato, Crispy Leeks",
    price: 9,
    category: "starters",
    dietary: ["gluten-free-option"],
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 3,
    name: "Cowboy Breakfast",
    slug: "cowboy-breakfast",
    description: "Smokehouse Chili, Cheddar-Jack, Red Onion, Tomatoes, Fried Egg",
    price: 18,
    category: "starters",
    dietary: ["gluten-free-option"],
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 4,
    name: "Bacon Spindle",
    slug: "bacon-spindle",
    description: "Red Chili-Maple Syrup",
    price: 11,
    category: "starters",
    dietary: ["gluten-free-option"],
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 5,
    name: "Smoked Burrata",
    slug: "smoked-burrata",
    description: "Black Salt, Herb Oil, Cherry Toms, Toasted Ciabatta",
    price: 16,
    category: "starters",
    dietary: ["gluten-free-option"],
    image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 6,
    name: "Hummus & Roasted Flat Bread",
    slug: "hummus-roasted-flatbread",
    description: "Turkish Cheese, Sunflower Seeds, Dried Cranberries, Smoked Paprika",
    price: 15,
    category: "starters",
    dietary: ["vegan", "gluten-free-option"],
    image: "https://images.unsplash.com/photo-1541592106381-b31e8e145f52?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 7,
    name: "Billionaire Brunch Bites",
    slug: "billionaire-brunch-bites",
    description: "Filet Mignon Tips, \"Donuts\", Cornichon, White Truffle",
    price: 17,
    category: "starters",
    dietary: ["gluten-free-option"],
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 8,
    name: "Jealous Fork Salad",
    slug: "jealous-fork-salad",
    description: "Mixed Greens, Vine Ripened Tomatoes, Cucumbers, Parm Reggiano. Add Lobster +$18, Steak +$11, Pulled Pork +$7, Pulled Chicken +$5",
    price: 11,
    category: "salads",
    dietary: ["vegan", "gluten-free-option"],
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center"
  },
  
  // Award Winning Pancakes
  {
    id: 9,
    name: "Pork Banh Mi Pancakes",
    slug: "pork-banh-mi-pancakes",
    description: "Pulled Pork, Red Chilis, Pickled Carrots, Cucumber, Fresh Cilantro, Basil",
    price: 17,
    category: "pancakes",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 10,
    name: "Chicken Thigh High Pancakes",
    slug: "chicken-thigh-high-pancakes",
    description: "Grilled Corn, Cheddar-Jack, Black Bean Salsa, Chipotle Crèma, Fresh Cilantro",
    price: 17,
    category: "pancakes",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 11,
    name: "Viking Telle Pancakes",
    slug: "viking-telle-pancakes",
    description: "\"Everything\", Smoked Salmon, Hollandaise Crèma, Red Onion, Capers, Fresh Dill",
    price: 15,
    category: "pancakes",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 12,
    name: "Chocolate Oreo Chip Pancakes",
    slug: "chocolate-oreo-chip-pancakes",
    description: "Crushed Oreos, Chocolate Chips, Oreo Whipped Cream, Chocolate Ganache",
    price: 17,
    category: "pancakes",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 13,
    name: "Peanut Butter Cup Pancakes",
    slug: "peanut-butter-cup-pancakes",
    description: "Reese's Cups, Nutter Butter Whipped Cream, Peanut Butter Maple Syrup",
    price: 17,
    category: "pancakes",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 14,
    name: "Banana Walnut Pancakes",
    slug: "banana-walnut-pancakes",
    description: "Banana Custard, Smoked Maple Syrup, Walnut Butter",
    price: 16,
    category: "pancakes",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 15,
    name: "Brunch & Still Hungover Pancakes",
    slug: "brunch-still-hungover-pancakes",
    description: "Whipped Ricotta, Coffee Syrup, Crushed Espresso, Crèma Blanca",
    price: 15,
    category: "pancakes",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 16,
    name: "Lemon Curd & Blueberry Pancakes",
    slug: "lemon-curd-blueberry-pancakes",
    description: "Homemade Lemon Curd, Blueberry Syrup, Ricotta Crèma",
    price: 16,
    category: "pancakes",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 17,
    name: "Strawberry Cheesecake Pancakes",
    slug: "strawberry-cheesecake-pancakes",
    description: "Liquid Cheesecake, Fresh Strawberries, Graham Cracker Crumble",
    price: 16,
    category: "pancakes",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 18,
    name: "To Die For Traditional Pancakes",
    slug: "traditional-pancakes",
    description: "Maple Syrup, Whipped Butter",
    price: 14,
    category: "pancakes",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&crop=center"
  },

  // Sandwiches / Buns / Bread
  {
    id: 19,
    name: "Lobster Roll",
    slug: "lobster-roll",
    description: "Brioche, Smoked Paprika Remoulade, Fresh Dill, Old Bay-Truffle Chips",
    price: 34,
    category: "sandwiches",
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 20,
    name: "Steak Sandwich",
    slug: "steak-sandwich",
    description: "Aged White Cheddar, Fresh Horseradish, Spring Greens",
    price: 22,
    category: "sandwiches",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 21,
    name: "The Classic Burger",
    slug: "classic-burger-jf",
    description: "Cheddar Cheese, That Secret Sauce, Tomato, Onion, Spring Greens",
    price: 20,
    category: "sandwiches",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 22,
    name: "Jesse James Burger",
    slug: "jesse-james-burger-jf",
    description: "Applewood Smoked Bacon, Crispy Onions, BBQ Sauce, Cheddar Cheese",
    price: 21,
    category: "sandwiches",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 23,
    name: "BBQ Pulled Pork Sandwich",
    slug: "bbq-pulled-pork-sandwich",
    description: "Napa Slaw, Hot Hot Shake First, Hawaiian Bun",
    price: 22,
    category: "sandwiches",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&crop=center"
  },
  {
    id: 24,
    name: "Pain Perdu (French Toast)",
    slug: "pain-perdu-french-toast",
    description: "Crème Anglaise, Choose Signature Setup",
    price: 16,
    category: "sandwiches",
    image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&h=300&fit=crop&crop=center"
  }
];

export const jealousForkCategories = [
  { id: 'starters', name: 'Starters & Shareable', description: 'Perfect for sharing or starting your meal' },
  { id: 'pancakes', name: 'Award Winning Pancakes', description: 'Our signature pancakes that made us famous' },
  { id: 'sandwiches', name: 'Sandwiches & Burgers', description: 'Hearty sandwiches and gourmet burgers' },
  { id: 'salads', name: 'Fresh Salads', description: 'Fresh, healthy options with premium ingredients' }
];