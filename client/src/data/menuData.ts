export interface MenuItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  category: 'pancakes' | 'burgers' | 'breakfast';
}

// Featured items from our different menus for the preview section
export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Chocolate Oreo Chip Pancakes",
    slug: "chocolate-oreo-chip-pancakes",
    description: "Crushed Oreos, Chocolate Chips, Oreo Whipped Cream, Chocolate Ganache",
    price: 17,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center",
    category: "pancakes"
  },
  {
    id: 2,
    name: "The Devil's Advocate",
    slug: "devils-advocate-burger",
    description: "Smokehouse Chili, Cheddar Cheese, Hot Hot Shake First, Fried Egg",
    price: 17,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center",
    category: "burgers"
  },
  {
    id: 3,
    name: "Lobster Roll",
    slug: "lobster-roll-featured",
    description: "Brioche, Smoked Paprika Remoulade, Fresh Dill, Old Bay-Truffle Chips",
    price: 34,
    image: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop&crop=center",
    category: "breakfast"
  },
  {
    id: 4,
    name: "Peanut Butter Cup Pancakes",
    slug: "peanut-butter-cup-pancakes-featured",
    description: "Reese's Cups, Nutter Butter Whipped Cream, Peanut Butter Maple Syrup",
    price: 17,
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&crop=center",
    category: "pancakes"
  },
  {
    id: 5,
    name: "Jesse James Burger",
    slug: "jesse-james-burger-featured",
    description: "Applewood Smoked Bacon, Crispy Onions, BBQ Sauce, Cheddar Cheese",
    price: 16,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center",
    category: "burgers"
  },
  {
    id: 6,
    name: "Billionaire Brunch Bites",
    slug: "billionaire-brunch-bites-featured",
    description: "Filet Mignon Tips, \"Donuts\", Cornichon, White Truffle",
    price: 17,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&crop=center",
    category: "breakfast"
  }
];
