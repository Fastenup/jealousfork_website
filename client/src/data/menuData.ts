export interface MenuItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  category: 'pancakes' | 'burgers' | 'breakfast';
}

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Signature Stack",
    slug: "signature-stack",
    description: "Our famous fluffy pancakes with seasonal berries, whipped cream, and pure maple syrup",
    price: 16,
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    category: "pancakes"
  },
  {
    id: 2,
    name: "Jealous Burger",
    slug: "jealous-burger",
    description: "Grass-fed beef patty, aged cheddar, caramelized onions, and our secret sauce on artisan brioche",
    price: 18,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    category: "burgers"
  },
  {
    id: 3,
    name: "Plant-Based Stack",
    slug: "vegan-stack",
    description: "Fluffy vegan pancakes with coconut whipped cream, fresh fruit, and agave syrup",
    price: 15,
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    category: "pancakes"
  },
  {
    id: 4,
    name: "Morning Glory Burger",
    slug: "breakfast-burger",
    description: "Beef patty, fried egg, crispy bacon, hash browns, and hollandaise on a toasted bun",
    price: 19,
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    category: "breakfast"
  },
  {
    id: 5,
    name: "Savory Stack",
    slug: "savory-pancakes",
    description: "Herb-infused pancakes with goat cheese, sun-dried tomatoes, and arugula",
    price: 17,
    image: "https://images.unsplash.com/photo-1574085733277-851d9d856a3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    category: "pancakes"
  },
  {
    id: 6,
    name: "Decadent Dessert Stack",
    slug: "dessert-pancakes",
    description: "Chocolate chip pancakes with vanilla ice cream, chocolate sauce, and candied nuts",
    price: 14,
    image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    category: "pancakes"
  },
  {
    id: 7,
    name: "Classic American Stack",
    slug: "classic-pancakes",
    description: "Traditional buttermilk pancakes served with butter and maple syrup",
    price: 12,
    image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    category: "pancakes"
  },
  {
    id: 8,
    name: "Truffle Burger",
    slug: "truffle-burger",
    description: "Wagyu beef patty with truffle aioli, wild mushrooms, and aged gruyere",
    price: 24,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
    category: "burgers"
  }
];
