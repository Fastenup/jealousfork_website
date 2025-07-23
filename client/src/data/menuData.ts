export interface MenuItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  category: 'pancakes' | 'burgers' | 'breakfast';
  featured: boolean;
  inStock: boolean;
  squareId?: string;
}

// Featured items for homepage preview (exactly 6 items, includes some out-of-stock)
export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Chocolate Oreo Chip Pancakes",
    slug: "chocolate-oreo-chip-pancakes",
    description: "Crushed Oreos, Chocolate Chips, Oreo Whipped Cream, Chocolate Ganache",
    price: 17,
    image: "/Jesse James Burger web_1751726904658.jpg",
    category: "pancakes",
    featured: true,
    inStock: true
  },
  {
    id: 2,
    name: "Jesse James Burger",
    slug: "jesse-james-burger",
    description: "Applewood Smoked Bacon, Crispy Onions, BBQ Sauce, Cheddar Cheese",
    price: 16,
    image: "/Jesse James Burger web_1751726904658.jpg",
    category: "burgers",
    featured: true,
    inStock: false // Out of stock but still featured
  },
  {
    id: 3,
    name: "Peanut Butter Maple Pancakes",
    slug: "peanut-butter-maple-pancakes",
    description: "Reese's Cups, Nutter Butter Whipped Cream, Peanut Butter Maple Syrup",
    price: 17,
    image: "/Peanut Butter Maple Web_1751734772054.jpg",
    category: "pancakes",
    featured: true,
    inStock: true
  },
  {
    id: 4,
    name: "Brunch And Still Hungover",
    slug: "brunch-still-hungover",
    description: "Smoked Salmon, Avocado, Capers, Everything Bagel Seasoning",
    price: 19,
    image: "/Brunch And Still Hungover web_1751726904716.jpg",
    category: "breakfast",
    featured: true,
    inStock: false // Out of stock but still featured
  },
  {
    id: 5,
    name: "Banana Walnut Smoked Maple",
    slug: "banana-walnut-smoked-maple",
    description: "Candied Walnuts, Banana Foster, Smoked Maple Syrup, Cinnamon Butter",
    price: 16,
    image: "/Banana Walnut Smoked Maple Web_1751726904724.jpg",
    category: "pancakes",
    featured: true,
    inStock: true
  },
  {
    id: 6,
    name: "Viking Telle",
    slug: "viking-telle",
    description: "Crispy Pancetta, Poached Eggs, Hollandaise, Truffle Oil",
    price: 22,
    image: "/Viking Telle Web_1751726904731.jpg",
    category: "breakfast",
    featured: true,
    inStock: true
  }
];
