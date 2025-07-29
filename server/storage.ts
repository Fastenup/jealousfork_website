// Storage interface for featured items and menu synchronization
import { LocalMenuItem } from './squareMenuSync';
import { ContactSubmission, InsertContactSubmission } from '../shared/schema';

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
  
  // Contact form submissions
  createContactSubmission(data: InsertContactSubmission): Promise<ContactSubmission>;
  updateContactSubmissionStatus(id: number, status: 'pending' | 'sent' | 'failed'): Promise<void>;
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

  private menuSections: any[] = [
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

  async getMenuSections(): Promise<any[]> {
    return [...this.menuSections];
  }

  async createMenuSection(section: any): Promise<any> {
    const maxId = Math.max(...this.menuSections.map(s => s.id), 0);
    const newSection = {
      ...section,
      id: maxId + 1,
      displayOrder: this.menuSections.length + 1,
      isActive: true
    };
    this.menuSections.push(newSection);
    return newSection;
  }

  async updateMenuSection(id: number, updates: any): Promise<any> {
    const sectionIndex = this.menuSections.findIndex(s => s.id === id);
    if (sectionIndex >= 0) {
      this.menuSections[sectionIndex] = { ...this.menuSections[sectionIndex], ...updates };
      return this.menuSections[sectionIndex];
    }
    throw new Error(`Menu section with id ${id} not found`);
  }

  async deleteMenuSection(id: number): Promise<void> {
    const sectionIndex = this.menuSections.findIndex(s => s.id === id);
    if (sectionIndex >= 0) {
      this.menuSections.splice(sectionIndex, 1);
      // Also remove associated categories
      this.menuCategories = this.menuCategories.filter(cat => cat.sectionId !== id);
    } else {
      throw new Error(`Menu section with id ${id} not found`);
    }
  }

  private menuCategories: any[] = [
    { id: 1, sectionId: 1, name: "Pancakes", description: "Artisan pancake creations", displayOrder: 1 },
    { id: 2, sectionId: 1, name: "Flatbreads", description: "Savory flatbread specialties", displayOrder: 2 },
    { id: 3, sectionId: 2, name: "Burgers", description: "Gourmet burger selections", displayOrder: 1 },
    { id: 4, sectionId: 3, name: "Cocktails", description: "Craft cocktails", displayOrder: 1 },
    { id: 5, sectionId: 3, name: "Coffee", description: "Specialty coffee drinks", displayOrder: 2 },
    { id: 6, sectionId: 3, name: "Beer", description: "Local and craft beers", displayOrder: 3 },
    { id: 7, sectionId: 3, name: "Wine", description: "Curated wine selection", displayOrder: 4 }
  ];

  async getMenuCategories(sectionId?: number): Promise<any[]> {
    return sectionId ? this.menuCategories.filter(cat => cat.sectionId === sectionId) : [...this.menuCategories];
  }

  async createMenuCategory(category: any): Promise<any> {
    const maxId = Math.max(...this.menuCategories.map(c => c.id), 0);
    const newCategory = {
      ...category,
      id: maxId + 1,
      displayOrder: this.menuCategories.filter(c => c.sectionId === category.sectionId).length + 1
    };
    this.menuCategories.push(newCategory);
    return newCategory;
  }

  async updateMenuCategory(id: number, updates: any): Promise<any> {
    const categoryIndex = this.menuCategories.findIndex(c => c.id === id);
    if (categoryIndex >= 0) {
      this.menuCategories[categoryIndex] = { ...this.menuCategories[categoryIndex], ...updates };
      return this.menuCategories[categoryIndex];
    }
    throw new Error(`Menu category with id ${id} not found`);
  }

  async deleteMenuCategory(id: number): Promise<void> {
    const categoryIndex = this.menuCategories.findIndex(c => c.id === id);
    if (categoryIndex >= 0) {
      this.menuCategories.splice(categoryIndex, 1);
    } else {
      throw new Error(`Menu category with id ${id} not found`);
    }
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

  // Store item-to-category mappings
  private itemCategoryMappings: { [squareId: string]: number } = {};

  async assignItemToCategory(squareId: string, categoryId: number): Promise<void> {
    // Find the category name from the categoryId
    const categories = await this.getMenuCategories();
    const category = categories.find(cat => cat.id === categoryId);
    
    if (!category) {
      throw new Error(`Category with ID ${categoryId} not found`);
    }
    
    // Store the item-to-category mapping
    this.itemCategoryMappings[squareId] = categoryId;
    
    // Update featured item category assignment if it exists in featured items
    const itemIndex = this.featuredItems.findIndex(item => item.squareId === squareId);
    if (itemIndex >= 0) {
      this.featuredItems[itemIndex].category = category.name.toLowerCase();
      console.log(`Updated featured item ${squareId} category to ${category.name.toLowerCase()}`);
    }
    
    console.log(`Successfully assigned Square item ${squareId} to category ${category.name} (${categoryId})`);
  }

  async getItemCategoryAssignments(): Promise<{ [squareId: string]: number }> {
    return { ...this.itemCategoryMappings };
  }

  async initializeDefaultMenuStructure(): Promise<void> {
    console.log('Default menu structure initialized');
  }

  // Contact form submissions (in-memory for now)
  private contactSubmissions: ContactSubmission[] = [];
  private nextContactSubmissionId = 1;

  async createContactSubmission(data: InsertContactSubmission): Promise<ContactSubmission> {
    const submission: ContactSubmission = {
      id: this.nextContactSubmissionId++,
      ...data,
      status: 'pending',
      sentAt: null,
      createdAt: new Date()
    };
    
    this.contactSubmissions.push(submission);
    return submission;
  }

  async updateContactSubmissionStatus(id: number, status: 'pending' | 'sent' | 'failed'): Promise<void> {
    const submission = this.contactSubmissions.find(s => s.id === id);
    if (submission) {
      submission.status = status;
      if (status === 'sent') {
        submission.sentAt = new Date();
      }
    }
  }
}

export const storage = new MemoryStorage();