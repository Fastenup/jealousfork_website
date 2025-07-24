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
  
  // Menu sections and categories
  getMenuSections(): Promise<any[]>;
  getMenuCategories(sectionId?: number): Promise<any[]>;
  getSquareMenuItems(categoryId?: number): Promise<any[]>;
  assignItemToCategory(squareId: string, categoryId: number): Promise<void>;
  initializeDefaultMenuStructure(): Promise<void>;
}

// In-memory storage implementation
class MemoryStorage implements IStorage {
  private featuredItems: FeaturedItemConfig[] = [
    {
      localId: 1,
      squareId: "LPQXTMGM7RNLH5SFCCPOF7XB",
      name: "Hot Maple Flatbread",
      description: "Cup and char pepperoni, double cream mozzarella, and red chili-black pepper maple",
      category: "flatbreads",
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
    const itemIndex = this.featuredItems.findIndex(i => i.localId === localId);
    if (itemIndex >= 0) {
      this.featuredItems[itemIndex].inStock = inStock;
      console.log(`Updated item ${localId} stock to ${inStock}`);
    } else {
      throw new Error(`Featured item with localId ${localId} not found`);
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

  async getMenuSections(): Promise<any[]> {
    return [
      {
        id: 1,
        name: "Jealous Fork",
        description: "Artisan pancakes and breakfast specialties",
        operatingHours: "9:00 AM - 3:00 PM",
        operatingDays: "Tuesday - Sunday",
        displayOrder: 1,
        isActive: true
      },
      {
        id: 2,
        name: "Jealous Burger",
        description: "Gourmet burgers and dinner items",
        operatingHours: "5:00 PM - 9:00 PM",
        operatingDays: "Friday - Saturday",
        displayOrder: 2,
        isActive: true
      },
      {
        id: 3,
        name: "Beverages",
        description: "Cocktails, coffee, beer and wine",
        operatingHours: "Variable by section",
        operatingDays: "Tuesday - Sunday",
        displayOrder: 3,
        isActive: true
      }
    ];
  }

  async getMenuCategories(sectionId?: number): Promise<any[]> {
    const allCategories = [
      { id: 1, sectionId: 1, name: "Pancakes", description: "Artisan pancake creations", displayOrder: 1 },
      { id: 2, sectionId: 1, name: "Flatbreads", description: "Savory flatbread specialties", displayOrder: 2 },
      { id: 3, sectionId: 2, name: "Burgers", description: "Gourmet burger selections", displayOrder: 1 },
      { id: 4, sectionId: 3, name: "Cocktails", description: "Craft cocktails", displayOrder: 1 },
      { id: 5, sectionId: 3, name: "Coffee", description: "Specialty coffee drinks", displayOrder: 2 },
      { id: 6, sectionId: 3, name: "Beer", description: "Local and craft beers", displayOrder: 3 },
      { id: 7, sectionId: 3, name: "Wine", description: "Curated wine selection", displayOrder: 4 }
    ];
    
    return sectionId ? allCategories.filter(cat => cat.sectionId === sectionId) : allCategories;
  }

  async getSquareMenuItems(categoryId?: number): Promise<any[]> {
    // Return featured items as Square menu items for now
    return this.featuredItems.map(item => ({
      id: item.localId,
      squareId: item.squareId,
      categoryId: categoryId || 1,
      name: item.name,
      description: item.description,
      price: item.price,
      isAvailable: item.inStock,
      isFeatured: item.featured,
      displayOrder: item.displayOrder || 0
    }));
  }

  async assignItemToCategory(squareId: string, categoryId: number): Promise<void> {
    // Find the category name from the categoryId
    const categories = await this.getMenuCategories();
    const category = categories.find(cat => cat.id === categoryId);
    
    if (!category) {
      throw new Error(`Category with ID ${categoryId} not found`);
    }
    
    // Update featured item category assignment if it exists in featured items
    const itemIndex = this.featuredItems.findIndex(item => item.squareId === squareId);
    if (itemIndex >= 0) {
      this.featuredItems[itemIndex].category = category.name.toLowerCase();
      console.log(`Updated featured item ${squareId} category to ${category.name.toLowerCase()}`);
    }
    
    // For comprehensive categorization, we would store this mapping in database
    // For now, just log the assignment
    console.log(`Assigned Square item ${squareId} to category ${category.name} (${categoryId})`);
  }

  async initializeDefaultMenuStructure(): Promise<void> {
    console.log('Default menu structure initialized');
  }
}

export const storage = new MemoryStorage();