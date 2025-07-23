// Mapping between local menu items and Square catalog items
// This ensures our curated menu descriptions stay consistent while syncing with Square

export interface SquareMenuMapping {
  localId: number;
  squareId?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  featured: boolean;
  inStock: boolean;
  lastSquareSync?: string;
}

// Map our featured items to Square catalog items
export const menuItemMappings: SquareMenuMapping[] = [
  {
    localId: 1,
    squareId: "LPQXTMGM7RNLH5SFCCPOF7XB", // From Square API response
    name: "Hot Maple Flatbread",
    description: "Cup and char pepperoni, double cream mozzarella, and red chili-black pepper maple",
    category: "flatbread",
    price: 16,
    image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80",
    featured: true,
    inStock: true
  },
  {
    localId: 2,
    squareId: undefined, // Will be auto-mapped based on name matching
    name: "Chocolate Oreo Chip Pancakes",
    description: "Crushed Oreos, Chocolate Chips, Oreo Whipped Cream, Chocolate Ganache",
    category: "pancakes",
    price: 17,
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80",
    featured: true,
    inStock: true
  },
  {
    localId: 3,
    squareId: undefined,
    name: "Peanut Butter Maple Pancakes",
    description: "Fluffy pancakes with creamy peanut butter and pure maple syrup drizzle",
    category: "pancakes",
    price: 16,
    image: "https://images.unsplash.com/photo-1528722744605-dc661d2ed2b0?auto=format&fit=crop&w=800&q=80",
    featured: true,
    inStock: true
  },
  {
    localId: 4,
    squareId: undefined,
    name: "Lemon Curd Blueberry Pancakes",
    description: "Light pancakes topped with fresh blueberries and tangy lemon curd",
    category: "pancakes",
    price: 15,
    image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=800&q=80",
    featured: true,
    inStock: true
  },
  {
    localId: 5,
    squareId: undefined,
    name: "Banana Walnut Smoked Maple",
    description: "Caramelized bananas, toasted walnuts, and house-smoked maple syrup",
    category: "pancakes",
    price: 17,
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=80",
    featured: true,
    inStock: false
  },
  {
    localId: 6,
    squareId: undefined,
    name: "Jesse James Burger",
    description: "Premium beef patty with bacon, aged cheddar, and BBQ sauce",
    category: "burgers",
    price: 18,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    featured: true,
    inStock: true
  }
];

// Function to sync local items with Square catalog
export async function syncWithSquare(): Promise<{ 
  synced: SquareMenuMapping[], 
  unmatched: any[], 
  errors: string[] 
}> {
  try {
    const response = await fetch('/api/menu');
    const data = await response.json();
    
    if (!data.items) {
      throw new Error('No menu items found in Square catalog');
    }
    
    const synced: SquareMenuMapping[] = [];
    const unmatched: any[] = [];
    const errors: string[] = [];
    
    // Update mappings with Square data
    for (const mapping of menuItemMappings) {
      let squareItem = null;
      
      // First try to find by Square ID
      if (mapping.squareId) {
        squareItem = data.items.find((item: any) => item.id === mapping.squareId);
      }
      
      // If not found by ID, try to match by name
      if (!squareItem) {
        squareItem = data.items.find((item: any) => 
          item.name.toLowerCase().includes(mapping.name.toLowerCase()) ||
          mapping.name.toLowerCase().includes(item.name.toLowerCase())
        );
      }
      
      if (squareItem) {
        synced.push({
          ...mapping,
          squareId: squareItem.id,
          price: squareItem.price, // Use Square price
          inStock: squareItem.inStock,
          lastSquareSync: new Date().toISOString()
        });
      } else {
        synced.push(mapping); // Keep local data if no Square match
        errors.push(`No Square match found for: ${mapping.name}`);
      }
    }
    
    // Find unmatched Square items
    for (const item of data.items) {
      const isMatched = synced.some(mapping => mapping.squareId === item.id);
      if (!isMatched) {
        unmatched.push(item);
      }
    }
    
    return { synced, unmatched, errors };
    
  } catch (error: any) {
    return { 
      synced: menuItemMappings, 
      unmatched: [], 
      errors: [`Sync failed: ${error.message}`] 
    };
  }
}