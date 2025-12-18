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

// Configure exactly 6 featured items for homepage - synced with Square
export const featuredItemsConfig: FeaturedItemConfig[] = [
  {
    id: 1,
    name: "Hot Maple Flatbread",
    slug: "hot-maple-flatbread",
    description: "Cup and char pepperoni, double cream mozzarella, and red chili-black pepper maple",
    price: 16,
    image: "https://items-images-production.s3.us-west-2.amazonaws.com/files/e9d5adcfaf84a1c5408679722db6bdc0919e835e/original.jpeg",
    category: "pancakes",
    featured: true,
    inStock: true,
    squareId: "LPQXTMGM7RNLH5SFCCPOF7XB",
    lastUpdated: "2025-12-18"
  },
  {
    id: 2,
    name: "Chocolate Oreo Chip Pancake",
    slug: "chocolate-oreo-chip-pancake",
    description: "Crushed Oreos, Chocolate Chips, Oreo Whipped Cream, Chocolate Ganache",
    price: 17,
    image: "https://items-images-production.s3.us-west-2.amazonaws.com/files/b1c057b03932f8ab7073e6ee5df72542539b14f5/original.jpeg",
    category: "pancakes",
    featured: true,
    inStock: true,
    squareId: "LBLTJBZWN6YCRHWAZP77K6Y6",
    lastUpdated: "2025-12-18"
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
    lastUpdated: "2025-12-18"
  },
  {
    id: 4,
    name: "Lemon Curd and Blueberry Pancake",
    slug: "lemon-curd-blueberry-pancake",
    description: "Light pancakes topped with fresh blueberries and tangy lemon curd",
    price: 15,
    image: "https://items-images-production.s3.us-west-2.amazonaws.com/files/9113997b920747abdb8652d80cd0d45ebd145057/original.jpeg",
    category: "pancakes",
    featured: true,
    inStock: true,
    squareId: "6U5GVIO5TA4YQBERIBPTKZAO",
    lastUpdated: "2025-12-18"
  },
  {
    id: 5,
    name: "Banana Walnut Pancake",
    slug: "banana-walnut-pancake",
    description: "Caramelized bananas, toasted walnuts, and house-smoked maple syrup",
    price: 17,
    image: "https://items-images-production.s3.us-west-2.amazonaws.com/files/268ec5eda55553d9357c955abe7838952a240717/original.jpeg",
    category: "pancakes",
    featured: true,
    inStock: true,
    squareId: "64EUHLG4LI7LYNJXKQ7HORY7",
    lastUpdated: "2025-12-18"
  },
  {
    id: 6,
    name: "Jesse James Burger",
    slug: "jesse-james-burger",
    description: "Premium beef patty with bacon, aged cheddar, and BBQ sauce",
    price: 18,
    image: "https://items-images-production.s3.us-west-2.amazonaws.com/files/a1bd6a278117dc06f529c12073e57bbcb2ef0868/original.jpeg",
    category: "burgers",
    featured: true,
    inStock: true,
    squareId: "U55RAYK5K5MLS2FI4AEKNVR2",
    lastUpdated: "2025-12-18"
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