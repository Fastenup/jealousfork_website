// Storage interface for featured items and menu synchronization
import { LocalMenuItem } from './squareMenuSync';
import { ContactSubmission, InsertContactSubmission, contactSubmissions, squareMenuItems } from '../shared/schema';
import { db } from './db';
import { eq } from 'drizzle-orm';

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
  updateFeaturedItemStock(localId: number, inStock: boolean): Promise<void>;
  
  // Menu synchronization
  getMenuItems(): Promise<LocalMenuItem[]>;
  updateMenuItems(items: LocalMenuItem[]): Promise<void>;
  syncWithSquare(): Promise<void>;
  
  // Menu sections and categories
  getMenuSections(): Promise<any[]>;
  getMenuCategories(sectionId?: number): Promise<any[]>;
  getSquareMenuItems(categoryId?: number): Promise<any[]>;
  assignItemToCategory(squareId: string, categoryId: number): Promise<void>;
  removeItemFromCategory(squareId: string): Promise<void>;
  getItemCategoryAssignments(): Promise<{ [squareId: string]: number }>;
  initializeDefaultMenuStructure(): Promise<void>;
  
  // Contact form submissions
  createContactSubmission(data: InsertContactSubmission): Promise<ContactSubmission>;
  updateContactSubmissionStatus(id: number, status: 'pending' | 'sent' | 'failed'): Promise<void>;
  
  // Order management
  createOrder(orderData: any): Promise<any>;
  getOrder(orderId: string): Promise<any>;
  updateOrderStatus(orderId: string, status: string): Promise<any>;
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
      inStock: true,
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

  async updateFeaturedItemStock(localId: number, inStock: boolean): Promise<void> {
    const itemIndex = this.featuredItems.findIndex(item => item.localId === localId);
    if (itemIndex >= 0) {
      this.featuredItems[itemIndex].inStock = inStock;
      console.log(`Updated featured item stock for ${localId}: ${inStock}`);
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
  private assignmentsLoaded = false;

  async assignItemToCategory(squareId: string, categoryId: number): Promise<void> {
    // Find the category name from the categoryId
    const categories = await this.getMenuCategories();
    const category = categories.find(cat => cat.id === categoryId);
    
    if (!category) {
      throw new Error(`Category with ID ${categoryId} not found`);
    }
    
    // Store the item-to-category mapping in memory for immediate use
    this.itemCategoryMappings[squareId] = categoryId;
    
    // Also persist to database for permanent storage
    try {
      // Check if the item already exists in the database
      const existingItem = await db.query.squareMenuItems.findFirst({
        where: (items, { eq }) => eq(items.squareId, squareId)
      });

      if (existingItem) {
        // Update existing item with new category
        await db.update(squareMenuItems).set({
          categoryId: categoryId,
          updatedAt: new Date()
        }).where(eq(squareMenuItems.squareId, squareId));
      } else {
        // Create a placeholder entry in the database for this assignment
        // We'll need basic item info, so let's get it from featured items first
        const featuredItem = this.featuredItems.find(item => item.squareId === squareId);
        if (featuredItem) {
          await db.insert(squareMenuItems).values({
            squareId: squareId,
            categoryId: categoryId,
            name: featuredItem.name,
            description: featuredItem.description || '',
            price: featuredItem.price.toString(),
            isAvailable: featuredItem.inStock,
            isFeatured: featuredItem.featured,
            displayOrder: featuredItem.displayOrder || 0
          });
        } else {
          // Create minimal entry for tracking category assignment
          await db.insert(squareMenuItems).values({
            squareId: squareId,
            categoryId: categoryId,
            name: `Square Item ${squareId}`,
            description: 'Assigned via admin panel',
            price: '0.00',
            isAvailable: true,
            isFeatured: false,
            displayOrder: 0
          });
        }
      }
      
      console.log(`Persisted Square item ${squareId} to category ${category.name} (${categoryId}) in database`);
    } catch (error) {
      console.error(`Failed to persist category assignment to database:`, error);
      // Don't throw error - allow in-memory assignment to continue working
    }
    
    // Update featured item category assignment if it exists in featured items
    const itemIndex = this.featuredItems.findIndex(item => item.squareId === squareId);
    if (itemIndex >= 0) {
      this.featuredItems[itemIndex].category = category.name.toLowerCase();
      console.log(`Updated featured item ${squareId} category to ${category.name.toLowerCase()}`);
    }
    
    console.log(`Successfully assigned Square item ${squareId} to category ${category.name} (${categoryId})`);
  }

  async getItemCategoryAssignments(): Promise<{ [squareId: string]: number }> {
    // Load assignments from database only once to initialize in-memory cache
    if (!this.assignmentsLoaded) {
      try {
        const dbAssignments = await db.query.squareMenuItems.findMany({
          columns: {
            squareId: true,
            categoryId: true
          },
          where: (items, { isNotNull }) => isNotNull(items.categoryId)
        });
        
        // Populate in-memory assignments from database
        dbAssignments.forEach(item => {
          if (item.categoryId !== null) {
            this.itemCategoryMappings[item.squareId] = item.categoryId;
          }
        });
        
        this.assignmentsLoaded = true;
        console.log(`Loaded ${dbAssignments.length} category assignments from database`);
      } catch (error) {
        console.error('Failed to load category assignments from database:', error);
        // Continue with empty assignments
      }
    }
    
    return { ...this.itemCategoryMappings };
  }

  async removeItemFromCategory(squareId: string): Promise<void> {
    // Remove from in-memory mappings
    delete this.itemCategoryMappings[squareId];
    
    // Remove from database
    try {
      await db.delete(squareMenuItems).where(eq(squareMenuItems.squareId, squareId));
      console.log(`Removed Square item ${squareId} from category assignment in database`);
    } catch (error) {
      console.error(`Failed to remove category assignment from database:`, error);
    }
    
    // Update featured item if exists
    const itemIndex = this.featuredItems.findIndex(item => item.squareId === squareId);
    if (itemIndex >= 0) {
      this.featuredItems[itemIndex].category = 'uncategorized';
      console.log(`Reset featured item ${squareId} category to uncategorized`);
    }
    
    console.log(`Successfully removed Square item ${squareId} from category assignment`);
  }

  async initializeDefaultMenuStructure(): Promise<void> {
    console.log('Default menu structure initialized');
  }

  // Contact form submissions - now using actual database
  async createContactSubmission(data: InsertContactSubmission): Promise<ContactSubmission> {
    const [submission] = await db.insert(contactSubmissions)
      .values({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        message: data.message
      })
      .returning();
    
    return submission;
  }

  async updateContactSubmissionStatus(id: number, status: 'pending' | 'sent' | 'failed'): Promise<void> {
    await db.update(contactSubmissions)
      .set({
        status: status,
        sentAt: status === 'sent' ? new Date() : null
      })
      .where(eq(contactSubmissions.id, id));
  }

  // Order management - in-memory storage for now
  private orders: any[] = [];

  async createOrder(orderData: any): Promise<any> {
    const order = {
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.push(order);
    console.log(`Created order ${order.orderId} with payment ${order.paymentId}`);
    return order;
  }

  async getOrder(orderId: string): Promise<any> {
    const order = this.orders.find(o => o.orderId === orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }
    return order;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    const orderIndex = this.orders.findIndex(o => o.orderId === orderId);
    if (orderIndex >= 0) {
      this.orders[orderIndex].status = status;
      this.orders[orderIndex].updatedAt = new Date();
      console.log(`Updated order ${orderId} status to ${status}`);
      return this.orders[orderIndex];
    } else {
      throw new Error(`Order ${orderId} not found`);
    }
  }
}

export const storage = new MemoryStorage();