// Storage interface for featured items and menu synchronization
import { LocalMenuItem } from './squareMenuSync';

export interface FeaturedItemConfig {
  localId: number;
  squareId?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  featured: boolean;
  inStock: boolean;
  lastSync?: string;
  displayOrder?: number;
}

export interface IStorage {
  // Featured items management
  getFeaturedItems(): Promise<FeaturedItemConfig[]>;
  setFeaturedItems(items: FeaturedItemConfig[]): Promise<void>;
  addFeaturedItem(item: FeaturedItemConfig): Promise<void>;
  removeFeaturedItem(localId: number): Promise<void>;
  updateItemStock(localId: number, inStock: boolean): Promise<void>;
  
  // Menu synchronization
  getMenuItems(): Promise<LocalMenuItem[]>;
  updateMenuItems(items: LocalMenuItem[]): Promise<void>;
  syncWithSquare(): Promise<void>;
}

// In-memory storage implementation
class MemoryStorage implements IStorage {
  private featuredItems: FeaturedItemConfig[] = [
    {
      localId: 1,
      squareId: "LPQXTMGM7RNLH5SFCCPOF7XB",
      name: "Hot Maple Flatbread",
      description: "Cup and char pepperoni, double cream mozzarella, and red chili-black pepper maple",
      category: "flatbread",
      price: 16,
      image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80",
      featured: true,
      inStock: true,
      displayOrder: 1
    },
    {
      localId: 2,
      squareId: undefined,
      name: "Chocolate Oreo Chip Pancakes",
      description: "Crushed Oreos, Chocolate Chips, Oreo Whipped Cream, Chocolate Ganache",
      category: "pancakes",
      price: 17,
      image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80",
      featured: true,
      inStock: true,
      displayOrder: 2
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
      inStock: true,
      displayOrder: 3
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
      inStock: true,
      displayOrder: 4
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
      inStock: false,
      displayOrder: 5
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
      inStock: true,
      displayOrder: 6
    }
  ];

  private menuItems: LocalMenuItem[] = [];

  async getFeaturedItems(): Promise<FeaturedItemConfig[]> {
    return [...this.featuredItems];
  }

  async setFeaturedItems(items: FeaturedItemConfig[]): Promise<void> {
    this.featuredItems = [...items];
  }

  async addFeaturedItem(item: FeaturedItemConfig): Promise<void> {
    const maxOrder = Math.max(...this.featuredItems.map(i => i.displayOrder || 0), 0);
    this.featuredItems.push({
      ...item,
      displayOrder: maxOrder + 1
    });
  }

  async removeFeaturedItem(localId: number): Promise<void> {
    this.featuredItems = this.featuredItems.filter(item => item.localId !== localId);
  }

  async updateItemStock(localId: number, inStock: boolean): Promise<void> {
    const item = this.featuredItems.find(i => i.localId === localId);
    if (item) {
      item.inStock = inStock;
    }
  }

  async getMenuItems(): Promise<LocalMenuItem[]> {
    return [...this.menuItems];
  }

  async updateMenuItems(items: LocalMenuItem[]): Promise<void> {
    this.menuItems = [...items];
  }

  async syncWithSquare(): Promise<void> {
    // Sync logic will be handled by the Square service
  }
}

export const storage = new MemoryStorage();