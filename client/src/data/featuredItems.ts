// Featured Items Management System
// Control which items appear on the homepage

export interface FeaturedItemConfig {
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
  lastUpdated?: string;
}

// Configure exactly 6 featured items for homepage
export const featuredItemsConfig: FeaturedItemConfig[] = [
  {
    id: 1,
    name: "Chocolate Oreo Chip Pancakes",
    slug: "chocolate-oreo-chip-pancakes",
    description: "Crushed Oreos, Chocolate Chips, Oreo Whipped Cream, Chocolate Ganache",
    price: 17,
    image: "/Oreo Chocolate Chip Web_1751734772045.jpg",
    category: "pancakes",
    featured: true,
    inStock: true,
    lastUpdated: "2025-01-23"
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
    inStock: false, // Manually set as out of stock for testing
    lastUpdated: "2025-01-23"
  },
  {
    id: 3,
    name: "Peanut Butter Cup Pancake",
    slug: "peanut-butter-cup-pancake",
    description: "Reese's cups, nutter butter whipped cream, and peanut butter maple syrup",
    price: 17,
    image: "https://items-images-production.s3.us-west-2.amazonaws.com/files/623e30505496c45b6eef8d9133208c466c34fa22/original.jpeg",
    category: "pancakes",
    featured: true,
    inStock: true,
    squareId: "X3LFZ5CDB6UFLWTD6725QFB2",
    lastUpdated: "2025-01-23"
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
    inStock: false, // Manually set as out of stock for testing
    lastUpdated: "2025-01-23"
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
    inStock: true,
    lastUpdated: "2025-01-23"
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
    inStock: true,
    lastUpdated: "2025-01-23"
  }
];

// Helper functions for featured item management
// Updated to work with Square API synchronization
export async function getFeaturedItems() {
  try {
    const response = await fetch('/api/featured-items');
    const data = await response.json();
    return data.items?.filter((item: any) => item.featured) || [];
  } catch (error) {
    console.error('Failed to fetch featured items:', error);
    // Fallback to static config
    return featuredItemsConfig.filter(item => item.featured);
  }
}

// Synchronous version for components that need immediate data
export function getFeaturedItemsSync(): FeaturedItemConfig[] {
  return featuredItemsConfig.filter(item => item.featured).slice(0, 6);
}

export function setItemFeatured(itemId: number, featured: boolean): void {
  const item = featuredItemsConfig.find(item => item.id === itemId);
  if (item) {
    item.featured = featured;
    item.lastUpdated = new Date().toISOString().split('T')[0];
  }
}

export function setItemStock(itemId: number, inStock: boolean): void {
  const item = featuredItemsConfig.find(item => item.id === itemId);
  if (item) {
    item.inStock = inStock;
    item.lastUpdated = new Date().toISOString().split('T')[0];
  }
}

export function updateItemFromSquare(itemId: number, squareData: any): void {
  const item = featuredItemsConfig.find(item => item.id === itemId);
  if (item) {
    if (squareData.price) item.price = squareData.price;
    if (squareData.inStock !== undefined) item.inStock = squareData.inStock;
    if (squareData.squareId) item.squareId = squareData.squareId;
    item.lastUpdated = new Date().toISOString().split('T')[0];
  }
}