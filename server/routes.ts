import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { createSquareServiceFixed } from "./squareServiceFixed";
import { z } from "zod";
import { serverCache, CACHE_KEYS } from "./cache";
import { ipTracker } from "./ipTracker";
import { insertContactSubmissionSchema, restaurantLocations, squareMenuItems } from "../shared/schema";
import { BrevoEmailService } from "./brevoService";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Order request validation schema
const orderRequestSchema = z.object({
  items: z.array(z.object({
    id: z.union([z.string(), z.number()]), // Allow both string and number IDs
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
    category: z.string().optional(), // Make category optional since cart items might not have it
    description: z.string().optional(),
  })),
  subtotal: z.number(),
  tax: z.number(),
  deliveryFee: z.number(),
  total: z.number(),
  customerInfo: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
  }),
  deliveryInfo: z.object({
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    phone: z.string(),
    deliveryNotes: z.string().optional(),
  }).optional(),
  orderType: z.enum(['pickup', 'delivery']),
  paymentToken: z.string(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  let squareService: any;

  try {
    squareService = createSquareServiceFixed();
  } catch (error: any) {
    console.warn('Square service not configured:', error?.message || 'Unknown error');
  }

  // Debug endpoint to check dist directory contents (helps diagnose deployment issues)
  app.get('/api/debug/files', async (req, res) => {
    try {
      const cwd = process.cwd();
      const distPath = path.resolve(cwd, 'dist');
      const distPublicPath = path.resolve(cwd, 'dist', 'public');

      const result: any = {
        cwd,
        nodeEnv: process.env.NODE_ENV,
        distExists: fs.existsSync(distPath),
        distPublicExists: fs.existsSync(distPublicPath),
        distContents: [],
        distPublicContents: [],
        indexHtmlExists: false,
        indexHtmlPath: path.resolve(distPublicPath, 'index.html')
      };

      if (result.distExists) {
        result.distContents = fs.readdirSync(distPath);
      }

      if (result.distPublicExists) {
        result.distPublicContents = fs.readdirSync(distPublicPath);
        result.indexHtmlExists = fs.existsSync(path.resolve(distPublicPath, 'index.html'));
      }

      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to check files',
        message: error.message
      });
    }
  });

  // Test Square API images
  app.get('/api/test-square-images', async (req, res) => {
    try {
      const { testSquareImages } = await import('./squareImageTest');
      const result = await testSquareImages();
      res.json({
        success: true,
        ...result
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message,
        details: error.toString()
      });
    }
  });

  // Removed duplicate /api/menu endpoint - using better implementation below at line ~257

  // Manual Square sync trigger (on-demand)
  app.post('/api/square/sync', async (req, res) => {
    try {
      const { triggerManualSync } = await import('./squareScheduler');
      const result = await triggerManualSync();
      res.json({
        success: true,
        message: 'Manual sync completed',
        ...result
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Test Square API connection with direct API call
  app.post('/api/test-square', async (req, res) => {
    try {
      // Try direct API call first
      const { testSquareAPIDirect } = await import('./squareTest');
      const directResult = await testSquareAPIDirect();
      
      res.json({
        success: true,
        message: 'Square API connection successful (direct)',
        ...directResult,
        lastSync: new Date().toISOString()
      });
    } catch (directError: any) {
      console.error('Direct Square test failed:', directError);
      
      // Fallback to SDK test
      try {
        if (!squareService) {
          return res.json({ 
            success: false, 
            error: 'Square service not available',
            details: 'Service not initialized - check credentials',
            directError: directError.message
          });
        }

        const locations = await squareService.testConnection();
        res.json({
          success: true,
          message: 'Square API connection successful (SDK fallback)',
          locations: locations?.slice(0, 2),
          lastSync: new Date().toISOString(),
          environment: process.env.SQUARE_ACCESS_TOKEN?.startsWith('sandbox') ? 'sandbox' : 'production',
          directError: directError.message
        });
      } catch (sdkError: any) {
        console.error('Square test error:', sdkError);
        res.json({
          success: false,
          error: sdkError.message,
          details: sdkError.toString(),
          directError: directError.message,
          lastAttempt: new Date().toISOString()
        });
      }
    }
  });

  // Get Square API sync status
  app.get('/api/square-status', async (req, res) => {
    try {
      const status = {
        serviceAvailable: !!squareService,
        environment: process.env.SQUARE_ACCESS_TOKEN?.startsWith('sandbox') ? 'sandbox' : 'production',
        lastCheck: new Date().toISOString(),
        syncFrequency: 'Real-time API calls (no caching)',
        credentialsConfigured: !!(process.env.SQUARE_ACCESS_TOKEN && process.env.SQUARE_APPLICATION_ID && process.env.SQUARE_LOCATION_ID)
      };

      // Test direct API call to get actual status
      try {
        const { testSquareAPIDirect } = await import('./squareTest');
        const result = await testSquareAPIDirect();
        status.apiWorking = true;
        status.locationCount = result.locations?.length || 0;
        status.method = 'Direct API';
      } catch (error: any) {
        // Fallback to SDK test
        if (squareService) {
          try {
            const testResult = await squareService.testConnection();
            status.apiWorking = true;
            status.locationCount = testResult?.length || 0;
            status.method = 'SDK';
          } catch (sdkError: any) {
            status.apiWorking = false;
            status.lastError = sdkError.message;
            status.method = 'Failed';
          }
        } else {
          status.apiWorking = false;
          status.lastError = error.message;
          status.method = 'Direct API Failed';
        }
      }

      res.json(status);
    } catch (error: any) {
      res.status(500).json({
        error: 'Failed to check Square status',
        message: error.message
      });
    }
  });

  // Get all menu items with Square API integration and sync
  app.get('/api/menu', async (req, res) => {
    try {
      const { SquareMenuSyncService } = await import('./squareMenuSync');
      const { storage } = await import('./storage');
      
      // Inventory logic: blank/null = in stock (unlimited), 0/negative = out of stock (tracked/depleted)
      
      // Get current featured items for reference
      const featuredItems = await storage.getFeaturedItems();
      
      // Try Square sync service
      try {
        const syncService = new SquareMenuSyncService();
        const allSquareItems = await syncService.fetchSquareMenuItems();
        
        // Sync featured items with latest Square data
        const localItems = featuredItems.map(item => ({
          localId: item.localId,
          squareId: item.squareId,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          image: item.image,
          featured: item.featured,
          inStock: item.inStock,
          lastSync: item.lastSync
        }));

        const syncResult = await syncService.syncMenuItems(localItems);
        
        // Update storage with synced data
        const updatedFeatured = syncResult.syncedItems.map(item => ({
          localId: item.localId,
          squareId: item.squareId,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category,
          image: item.image,
          featured: item.featured,
          inStock: item.inStock,
          lastSync: item.lastSync,
          displayOrder: featuredItems.find(f => f.localId === item.localId)?.displayOrder || 0
        }));

        await storage.setFeaturedItems(updatedFeatured);
        
        // Add featured status to Square items
        const itemsWithFeaturedStatus = allSquareItems.map((item: any) => ({
          ...item,
          isFeatured: featuredItems.some(featured => 
            featured.squareId === item.id || featured.squareId === item.squareId
          ),
          localId: featuredItems.find(featured => 
            featured.squareId === item.id || featured.squareId === item.squareId
          )?.localId || item.id
        }));

        return res.json({
          success: true,
          items: itemsWithFeaturedStatus,
          source: 'square-sync',
          count: itemsWithFeaturedStatus.length,
          featuredSynced: syncResult.syncedItems.length
        });
      } catch (syncError) {
        console.log('Square sync failed, trying direct API:', syncError);
      }
      
      // Fallback to direct Square API call
      try {
        const accessToken = process.env.SQUARE_ACCESS_TOKEN;
        const environment = accessToken?.startsWith('sandbox') ? 'sandbox' : 'production';
        const baseUrl = environment === 'sandbox' 
          ? 'https://connect.squareupsandbox.com' 
          : 'https://connect.squareup.com';
        
        const response = await fetch(`${baseUrl}/v2/catalog/list?types=ITEM`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Square-Version': '2024-06-04',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const items = data.objects?.map((item: any) => {
            const itemData = item.item_data;
            const firstVariation = itemData?.variations?.[0];
            const price = firstVariation?.item_variation_data?.price_money?.amount || 0;
            
            return {
              id: item.id,
              name: itemData?.name || 'Unknown Item',
              description: itemData?.description || '',
              price: price / 100,
              category: itemData?.category_id || 'uncategorized',
              inStock: true
            };
          }) || [];
          
          // Add featured status to items
          const itemsWithFeaturedStatus = items.map((item: any) => ({
            ...item,
            isFeatured: featuredItems.some(featured => 
              featured.squareId === item.id || featured.squareId === item.squareId
            ),
            localId: featuredItems.find(featured => 
              featured.squareId === item.id || featured.squareId === item.squareId
            )?.localId || item.id,
            isAvailable: true, // Default to available
            stockLevel: null
          }));
          
          return res.json({ 
            success: true, 
            items: itemsWithFeaturedStatus, 
            source: 'square-direct', 
            count: itemsWithFeaturedStatus.length 
          });
        }
      } catch (directError) {
        console.log('Direct Square API also failed');
      }
      
      // Final fallback to static menu from featured items
      const staticMenu = [
        {
          id: 'static-1',
          name: 'Chocolate Oreo Chip Pancakes',
          description: 'Crushed Oreos, Chocolate Chips, Oreo Whipped Cream, Chocolate Ganache',
          price: 17,
          category: 'pancakes',
          inStock: true
        },
        {
          id: 'static-2',
          name: 'Jesse James Burger',
          description: 'Applewood Smoked Bacon, Crispy Onions, BBQ Sauce, Cheddar Cheese',
          price: 16,
          category: 'burgers',
          inStock: true
        },
        {
          id: 'static-3',
          name: 'Peanut Butter Maple Pancakes',
          description: 'Reese\'s Cups, Nutter Butter Whipped Cream, Peanut Butter Maple Syrup',
          price: 17,
          category: 'pancakes',
          inStock: true
        },
        {
          id: 'static-4',
          name: 'Brunch Still Hungover',
          description: 'House Buttermilk Pancakes, Applewood Bacon, Two Eggs Your Way',
          price: 15,
          category: 'breakfast',
          inStock: true
        },
        {
          id: 'static-5',
          name: 'Banana Walnut Smoked Maple',
          description: 'Fresh Bananas, Toasted Walnuts, Smoked Maple Syrup',
          price: 16,
          category: 'pancakes',
          inStock: true
        },
        {
          id: 'static-6',
          name: 'Viking Telle',
          description: 'Nutella, Strawberries, Banana, Whipped Cream',
          price: 16,
          category: 'pancakes',
          inStock: true
        }
      ];
      console.log('Serving static fallback menu - Square API unavailable');
      res.json({
        success: true,
        items: staticMenu,
        source: 'static-fallback',
        count: staticMenu.length
      });
    } catch (error: any) {
      console.error('Menu fetch error:', error);
      res.status(500).json({
        error: 'Failed to fetch menu',
        message: error.message
      });
    }
  });

  // Admin routes for menu sections management
  app.get('/api/admin/menu-sections', async (req, res) => {
    try {
      const sections = await storage.getMenuSections();
      res.json({ sections });
    } catch (error: any) {
      console.error('Error fetching menu sections:', error);
      res.status(500).json({ error: 'Failed to fetch menu sections' });
    }
  });

  app.post('/api/admin/menu-sections', async (req, res) => {
    try {
      const newSection = await storage.createMenuSection(req.body);
      res.json({ section: newSection, success: true });
    } catch (error: any) {
      console.error('Error creating menu section:', error);
      res.status(500).json({ error: 'Failed to create menu section', message: error.message });
    }
  });

  app.patch('/api/admin/menu-sections/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedSection = await storage.updateMenuSection(id, req.body);
      res.json({ section: updatedSection, success: true });
    } catch (error: any) {
      console.error('Error updating menu section:', error);
      res.status(500).json({ error: 'Failed to update menu section', message: error.message });
    }
  });

  app.delete('/api/admin/menu-sections/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMenuSection(id);
      res.json({ success: true, message: 'Menu section deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting menu section:', error);
      res.status(500).json({ error: 'Failed to delete menu section', message: error.message });
    }
  });

  // Admin routes for menu categories management
  app.get('/api/admin/menu-categories/:sectionId?', async (req, res) => {
    try {
      const sectionId = req.params.sectionId ? parseInt(req.params.sectionId) : undefined;
      const categories = await storage.getMenuCategories(sectionId);
      res.json({ categories });
    } catch (error: any) {
      console.error('Error fetching menu categories:', error);
      res.status(500).json({ error: 'Failed to fetch menu categories' });
    }
  });

  app.post('/api/admin/menu-categories', async (req, res) => {
    try {
      const newCategory = await storage.createMenuCategory(req.body);
      res.json({ category: newCategory, success: true });
    } catch (error: any) {
      console.error('Error creating menu category:', error);
      res.status(500).json({ error: 'Failed to create menu category', message: error.message });
    }
  });

  app.patch('/api/admin/menu-categories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedCategory = await storage.updateMenuCategory(id, req.body);
      res.json({ category: updatedCategory, success: true });
    } catch (error: any) {
      console.error('Error updating menu category:', error);
      res.status(500).json({ error: 'Failed to update menu category', message: error.message });
    }
  });

  app.delete('/api/admin/menu-categories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMenuCategory(id);
      res.json({ success: true, message: 'Menu category deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting menu category:', error);
      res.status(500).json({ error: 'Failed to delete menu category', message: error.message });
    }
  });

  app.post('/api/admin/assign-item-category', async (req, res) => {
    try {
      const { squareId, categoryId } = req.body;
      if (!squareId || !categoryId) {
        return res.status(400).json({ error: 'Missing squareId or categoryId' });
      }
      
      await storage.assignItemToCategory(squareId, categoryId);
      
      // Return success with updated assignments
      const assignments = await storage.getItemCategoryAssignments();
      res.json({ 
        success: true, 
        message: 'Item assigned to category successfully',
        assignments 
      });
    } catch (error: any) {
      console.error('Error assigning item to category:', error);
      res.status(500).json({ 
        error: 'Failed to assign item to category',
        message: error.message 
      });
    }
  });

  // Get item-category assignments
  app.get('/api/admin/item-assignments', async (req, res) => {
    try {
      const assignments = await storage.getItemCategoryAssignments();
      res.json({ success: true, assignments });
    } catch (error: any) {
      console.error('Error fetching item assignments:', error);
      res.status(500).json({ error: 'Failed to fetch item assignments' });
    }
  });

  // Bulk assign items to categories
  app.post('/api/admin/bulk-assign-categories', async (req, res) => {
    try {
      const { assignments } = req.body;
      if (!assignments || !Array.isArray(assignments)) {
        return res.status(400).json({ error: 'Invalid assignments array' });
      }

      const results = [];
      for (const { squareId, categoryId } of assignments) {
        try {
          await storage.assignItemToCategory(squareId, categoryId);
          results.push({ squareId, categoryId, success: true });
        } catch (error: any) {
          results.push({ squareId, categoryId, success: false, error: error.message });
        }
      }

      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;

      res.json({
        success: true,
        message: `Processed ${assignments.length} assignments: ${successCount} successful, ${failCount} failed`,
        results,
        assignments: await storage.getItemCategoryAssignments()
      });
    } catch (error: any) {
      console.error('Error in bulk assign:', error);
      res.status(500).json({ error: 'Failed to process bulk assignments' });
    }
  });

  // Remove item from category
  app.delete('/api/admin/item-assignments/:squareId', async (req, res) => {
    try {
      const { squareId } = req.params;
      await storage.removeItemFromCategory(squareId);
      res.json({ 
        success: true, 
        message: 'Item removed from category',
        assignments: await storage.getItemCategoryAssignments()
      });
    } catch (error: any) {
      console.error('Error removing item assignment:', error);
      res.status(500).json({ error: 'Failed to remove item assignment' });
    }
  });

  // Get specific menu category (IP-LIMITED + CACHED)
  app.get('/api/menu/:category', async (req, res) => {
    try {
      const { category } = req.params;
      const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
      const cacheKey = `${CACHE_KEYS.MENU_CATEGORY}${category}`;
      
      // Check cache first - avoid Square API call
      const cachedData = serverCache.get(cacheKey);
      if (cachedData) {
        console.log(`Serving cached category ${category} to IP ${clientIP.split('.').slice(0, 2).join('.')}.* - no API call`);
        return res.json({
          ...cachedData,
          source: 'cached',
          ipLimited: true
        });
      }

      // Only pull fresh data if IP tracking allows it
      if (!ipTracker.shouldPullFreshData(clientIP)) {
        return res.status(503).json({ 
          error: 'Category menu temporarily unavailable. Store may be closed or too many recent requests.',
          ipLimited: true,
          category
        });
      }

      if (!squareService) {
        return res.status(503).json({ 
          error: 'Square API not configured.' 
        });
      }

      console.log(`IP-approved fresh API call for category ${category} from ${clientIP.split('.').slice(0, 2).join('.')}.* `);
      const allItems = await squareService.getCatalogItems();
      const categoryItems = allItems.filter((item: any) => 
        item.category.toLowerCase() === category.toLowerCase()
      );
      
      const responseData = { 
        success: true, 
        items: categoryItems, 
        category,
        source: 'square_api_fresh',
        ipLimited: true
      };
      
      // Cache for 4 hours
      serverCache.set(cacheKey, responseData, 240);
      
      res.json(responseData);
    } catch (error: any) {
      console.error('Category menu API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch category menu',
        message: error?.message || 'Unknown error'
      });
    }
  });

  // Get inventory status for specific items (IP-LIMITED + CACHED)
  app.post('/api/inventory/check', async (req, res) => {
    try {
      const { itemIds } = req.body;
      const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
      
      if (!itemIds || !Array.isArray(itemIds)) {
        return res.status(400).json({ error: 'itemIds array required' });
      }

      const cacheKey = `${CACHE_KEYS.SQUARE_INVENTORY}${itemIds.sort().join(',')}`;
      
      // Check cache first - avoid Square API call
      const cachedInventory = serverCache.get(cacheKey);
      if (cachedInventory) {
        console.log(`Serving cached inventory for ${itemIds.length} items to IP ${clientIP.split('.').slice(0, 2).join('.')}.* - no API call`);
        return res.json({
          ...cachedInventory,
          source: 'cached',
          ipLimited: true
        });
      }

      // Only pull fresh data if IP tracking allows it
      if (!ipTracker.shouldPullFreshData(clientIP)) {
        return res.status(503).json({ 
          error: 'Inventory temporarily unavailable. Store may be closed or too many recent requests.',
          ipLimited: true
        });
      }

      if (!squareService) {
        return res.status(503).json({ 
          error: 'Square API not configured.' 
        });
      }

      console.log(`IP-approved fresh inventory call for ${itemIds.length} items from ${clientIP.split('.').slice(0, 2).join('.')}.* `);
      const inventory = await squareService.getInventoryCounts(itemIds);
      const inventoryStatus = Object.fromEntries(inventory);
      
      const responseData = { 
        success: true, 
        inventory: inventoryStatus,
        source: 'square_api_fresh',
        ipLimited: true
      };
      
      // Cache inventory for 30 minutes
      serverCache.set(cacheKey, responseData, 30);
      
      res.json(responseData);
    } catch (error: any) {
      console.error('Inventory check API error:', error);
      res.status(500).json({ 
        error: 'Failed to check inventory',
        message: error?.message || 'Unknown error'
      });
    }
  });

  // Create order endpoint
  app.post('/api/orders', async (req, res) => {
    try {
      if (!squareService) {
        return res.status(503).json({ 
          error: 'Payment processing not available. Square API keys not configured.' 
        });
      }

      const orderData = orderRequestSchema.parse(req.body);
      
      // Generate unique order ID
      const orderId = `JF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Step 1: Create order in Square with detailed line items and fulfillment
      console.log('Creating Square order with line items for:', orderId);
      const squareOrder = await squareService.createOrder({
        idempotencyKey: `${orderId}-order`,
        order: {
          locationId: process.env.SQUARE_LOCATION_ID,
          reference_id: orderId,
          source: {
            name: 'Jealous Fork Online Ordering'
          },
          line_items: orderData.items.map(item => ({
            name: item.name,
            quantity: item.quantity.toString(),
            base_price_money: {
              amount: Math.round(item.price * 100),
              currency: 'USD'
            },
            note: item.description || '',
            // Add modifiers for kitchen routing - helps categorize items
            modifiers: item.category ? [{
              name: `Kitchen: ${item.category}`,
              base_price_money: {
                amount: 0,
                currency: 'USD'
              }
            }] : []
          })),
          service_charges: orderData.deliveryFee > 0 ? [{
            name: 'Delivery Fee',
            amount_money: {
              amount: Math.round(orderData.deliveryFee * 100),
              currency: 'USD'
            }
          }] : [],
          taxes: [{
            name: 'Sales Tax',
            percentage: '7.5'
          }],
          fulfillments: [{
            type: orderData.orderType === 'pickup' ? 'PICKUP' : 'SHIPMENT',
            state: 'RESERVED', // Use RESERVED instead of PROPOSED for active kitchen orders
            pickup_details: orderData.orderType === 'pickup' ? {
              recipient: {
                display_name: orderData.customerInfo.name,
                email_address: orderData.customerInfo.email,
                phone_number: orderData.customerInfo.phone
              },
              schedule_type: 'ASAP',
              note: 'Order ready for pickup'
            } : undefined,
            shipment_details: orderData.orderType === 'delivery' ? {
              recipient: {
                display_name: orderData.customerInfo.name,
                email_address: orderData.customerInfo.email,
                phone_number: orderData.deliveryInfo?.phone || orderData.customerInfo.phone,
                address: {
                  address_line_1: orderData.deliveryInfo?.address || '',
                  locality: orderData.deliveryInfo?.city || '',
                  administrative_district_level_1: orderData.deliveryInfo?.state || '',
                  postal_code: orderData.deliveryInfo?.zipCode || ''
                }
              },
              note: orderData.deliveryInfo?.deliveryNotes || 'Delivery order'
            } : undefined
          }]
        }
      });

      if (!squareOrder || !squareOrder.order || !squareOrder.order.id) {
        return res.status(400).json({ 
          error: 'Failed to create order in Square. Please try again.' 
        });
      }

      console.log('Square order created successfully:', squareOrder.order.id);

      // Step 2: Process payment with reference to the created order
      console.log('Processing payment for Square order:', squareOrder.order.id, 'with token:', orderData.paymentToken.substring(0, 20) + '...');
      const payment = await squareService.createPayment({
        sourceId: orderData.paymentToken,
        amountMoney: {
          amount: Math.round(orderData.total * 100), // Convert to cents
          currency: 'USD',
        },
        idempotencyKey: `${orderId}-payment`,
        referenceId: orderId,
        orderId: squareOrder.order.id,
        note: `${orderData.orderType.toUpperCase()} Order - ${orderData.customerInfo.name} - ${orderData.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}`
      });

      if (!payment || payment.status !== 'COMPLETED') {
        return res.status(400).json({ 
          error: 'Payment processing failed. Please try again.' 
        });
      }

      // Calculate estimated ready time
      const estimatedReadyTime = new Date();
      if (orderData.orderType === 'pickup') {
        estimatedReadyTime.setMinutes(estimatedReadyTime.getMinutes() + 20);
      } else {
        estimatedReadyTime.setMinutes(estimatedReadyTime.getMinutes() + 50);
      }

      // Save order to storage
      const order = await storage.createOrder({
        orderId,
        paymentId: payment.id || null,
        status: 'confirmed',
        orderType: orderData.orderType,
        subtotal: orderData.subtotal.toString(),
        tax: orderData.tax.toString(),
        deliveryFee: orderData.deliveryFee.toString(),
        total: orderData.total.toString(),
        customerName: orderData.customerInfo.name,
        customerEmail: orderData.customerInfo.email,
        customerPhone: orderData.customerInfo.phone,
        deliveryAddress: orderData.deliveryInfo?.address || null,
        deliveryCity: orderData.deliveryInfo?.city || null,
        deliveryState: orderData.deliveryInfo?.state || null,
        deliveryZipCode: orderData.deliveryInfo?.zipCode || null,
        deliveryPhone: orderData.deliveryInfo?.phone || null,
        deliveryNotes: orderData.deliveryInfo?.deliveryNotes ?? null,
        items: orderData.items,
        estimatedReadyTime,
      });

      // Send confirmation email to customer
      try {
        await fetch(`http://localhost:${process.env.PORT || 5000}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: orderData.customerInfo.name.split(' ')[0],
            lastName: orderData.customerInfo.name.split(' ').slice(1).join(' ') || '',
            email: orderData.customerInfo.email,
            phone: orderData.customerInfo.phone,
            message: `Order Confirmation - ${orderId}\n\nThank you for your order!\n\nOrder Details:\n${orderData.items.map(item => `• ${item.quantity}x ${item.name} - $${item.price.toFixed(2)}`).join('\n')}\n\nSubtotal: $${orderData.subtotal.toFixed(2)}\nTax: $${orderData.tax.toFixed(2)}\n${orderData.deliveryFee > 0 ? `Delivery Fee: $${orderData.deliveryFee.toFixed(2)}\n` : ''}Total: $${orderData.total.toFixed(2)}\n\nOrder Type: ${orderData.orderType.toUpperCase()}\nEstimated Ready Time: ${estimatedReadyTime.toLocaleString()}\n\n${orderData.orderType === 'pickup' ? 'Pickup Location:\n14417 SW 42nd St\nMiami, FL 33175\n(305) 699-1430' : `Delivery Address:\n${orderData.deliveryInfo?.address}\n${orderData.deliveryInfo?.city}, ${orderData.deliveryInfo?.state} ${orderData.deliveryInfo?.zipCode}`}\n\nWe'll notify you when your order is ready!`
          })
        });
        console.log('Confirmation email sent to:', orderData.customerInfo.email);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }

      res.json({
        orderId: order.orderId,
        paymentId: order.paymentId,
        status: order.status,
        estimatedReadyTime: order.estimatedReadyTime?.toISOString(),
        total: parseFloat(order.total),
        items: order.items,
        orderType: order.orderType,
        customerInfo: {
          name: order.customerName,
          email: order.customerEmail,
          phone: order.customerPhone
        },
        squareOrderId: squareOrder.order.id
      });
    } catch (error: any) {
      console.error('Order creation error:', error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          error: 'Invalid order data provided.' 
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to process order. Please try again.' 
      });
    }
  });

  // Get order endpoint
  app.get('/api/orders/:orderId', async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ 
          error: 'Order not found.' 
        });
      }

      res.json({
        orderId: order.orderId,
        paymentId: order.paymentId,
        status: order.status,
        estimatedReadyTime: order.estimatedReadyTime?.toISOString(),
        total: parseFloat(order.total),
        items: order.items,
        orderType: order.orderType,
        customerInfo: {
          name: order.customerName,
          email: order.customerEmail,
          phone: order.customerPhone
        },
        deliveryInfo: order.orderType === 'delivery' ? {
          address: order.deliveryAddress,
          city: order.deliveryCity,
          state: order.deliveryState,
          zipCode: order.deliveryZipCode,
          phone: order.deliveryPhone,
          notes: order.deliveryNotes
        } : null,
        subtotal: parseFloat(order.subtotal),
        tax: parseFloat(order.tax),
        deliveryFee: parseFloat(order.deliveryFee)
      });
    } catch (error: any) {
      console.error('Get order error:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve order.' 
      });
    }
  });

  // Update order status endpoint (for restaurant staff)
  app.patch('/api/orders/:orderId/status', async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      
      if (!['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ 
          error: 'Invalid status provided.' 
        });
      }

      const updatedOrder = await storage.updateOrderStatus(orderId, status);
      
      if (!updatedOrder) {
        return res.status(404).json({ 
          error: 'Order not found.' 
        });
      }

      res.json({
        orderId: updatedOrder.orderId,
        status: updatedOrder.status,
      });
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({ 
        error: 'Failed to update order status.' 
      });
    }
  });

  // Serve sitemap.xml
  app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'sitemap.xml'));
  });

  // Serve robots.txt
  app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'robots.txt'));
  });

  // Menu items endpoint (comprehensive menu data for admin)
  app.get('/api/menu-items', async (req, res) => {
    try {
      // Get both local featured items and full Square menu
      const [featuredItems, allMenuData] = await Promise.all([
        storage.getFeaturedItems(),
        (async () => {
          try {
            const { SquareMenuSyncService } = await import('./squareMenuSync');
            const syncService = new SquareMenuSyncService();
            return await syncService.fetchSquareMenuItems();
          } catch (error) {
            console.log('Square menu fetch failed, using empty array');
            return [];
          }
        })()
      ]);

      // Combine and format menu items with featured status
      const allItems = allMenuData.map(item => ({
        id: item.id,
        localId: item.localId || parseInt(item.id),
        squareId: item.id,
        name: item.name,
        description: item.description || '',
        price: item.price || 0,
        category: item.category || 'uncategorized',
        imageUrl: item.imageUrl || null,
        isAvailable: item.inStock !== false,
        isFeatured: featuredItems.some(f => f.squareId === item.id),
        stockLevel: item.stockLevel
      }));

      res.json({ items: allItems });
    } catch (error: any) {
      console.error('Error fetching menu items:', error);
      res.status(500).json({ 
        error: 'Failed to fetch menu items',
        items: []
      });
    }
  });

  // Featured items management endpoints (CACHED - no Square API calls)
  app.get('/api/featured-items', async (req, res) => {
    try {
      // Check cache first
      const cachedFeatured = serverCache.get(CACHE_KEYS.FEATURED_ITEMS);
      if (cachedFeatured) {
        console.log('Serving cached featured items');
        return res.json(cachedFeatured);
      }

      const { storage } = await import('./storage');
      let items = await storage.getFeaturedItems();
      
      // For now, just return items as-is with default stock status
      // Square sync will be handled through the separate sync endpoint
      items = items.map(item => ({
        ...item,
        inStock: item.inStock ?? true, // Keep existing stock status or default to true
        isAvailable: item.inStock ?? true
      }));
      
      const responseData = { items };
      
      // Cache featured items for 2 hours
      serverCache.set(CACHE_KEYS.FEATURED_ITEMS, responseData, 120);
      
      res.json(responseData);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch featured items', message: error.message });
    }
  });

  app.post('/api/featured-items/sync', async (req, res) => {
    try {
      const { SquareMenuSyncService } = await import('./squareMenuSync');
      const { storage } = await import('./storage');
      
      const syncService = new SquareMenuSyncService();
      const featuredItems = await storage.getFeaturedItems();
      
      // Convert featured items to LocalMenuItem format for sync
      const localItems = featuredItems.map(item => ({
        localId: item.localId,
        squareId: item.squareId,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        featured: item.featured,
        inStock: item.inStock,
        lastSync: item.lastSync
      }));

      const syncResult = await syncService.syncMenuItems(localItems);
      
      // Update featured items with sync results
      const updatedFeatured = syncResult.syncedItems.map(item => ({
        localId: item.localId,
        squareId: item.squareId,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        featured: item.featured,
        inStock: item.inStock,
        lastSync: item.lastSync,
        displayOrder: featuredItems.find(f => f.localId === item.localId)?.displayOrder || 0
      }));

      await storage.setFeaturedItems(updatedFeatured);

      // Invalidate featured items cache after sync
      serverCache.invalidate(CACHE_KEYS.FEATURED_ITEMS);

      res.json({
        success: true,
        syncedItems: syncResult.syncedItems,
        availableItems: syncResult.availableSquareItems,
        errors: syncResult.errors
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to sync featured items', message: error.message });
    }
  });

  app.post('/api/featured-items/add-square-item', async (req, res) => {
    try {
      const { squareId, localId } = req.body;
      const { SquareMenuSyncService } = await import('./squareMenuSync');
      const { storage } = await import('./storage');
      
      if (!squareId || !localId) {
        return res.status(400).json({ error: 'squareId and localId are required' });
      }

      const syncService = new SquareMenuSyncService();
      const allSquareItems = await syncService.fetchSquareMenuItems();
      const squareItem = allSquareItems.find(item => item.id === squareId);
      
      if (!squareItem) {
        return res.status(404).json({ error: 'Square item not found' });
      }

      const featuredItems = await storage.getFeaturedItems();
      
      // Check if we already have 6 featured items
      const currentFeatured = featuredItems.filter(item => item.featured);
      if (currentFeatured.length >= 6) {
        return res.status(400).json({ error: 'Maximum 6 featured items allowed' });
      }

      // Create new featured item from Square item
      const newFeaturedItem = {
        localId,
        squareId: squareItem.id,
        name: squareItem.name,
        description: squareItem.description,
        price: squareItem.price,
        category: squareItem.category,
        image: squareItem.imageUrl || `https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80`,
        featured: true,
        inStock: squareItem.inStock,
        displayOrder: currentFeatured.length + 1
      };

      await storage.addFeaturedItem(newFeaturedItem);
      
      // Invalidate featured items cache when adding new items
      serverCache.invalidate(CACHE_KEYS.FEATURED_ITEMS);
      
      res.json({
        success: true,
        item: newFeaturedItem
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to add Square item as featured', message: error.message });
    }
  });

  // Add POST endpoint for toggling featured status
  app.post('/api/featured-items/:localId', async (req, res) => {
    try {
      const { localId } = req.params;
      const { squareId, name, description, price, category, imageUrl } = req.body;
      const { storage } = await import('./storage');
      
      // Create new featured item
      const newFeaturedItem = {
        localId: parseInt(localId),
        squareId: squareId || null,
        name: name || 'Unknown Item',
        description: description || '',
        price: parseFloat(price) || 0,
        category: category || 'uncategorized',
        image: imageUrl || 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
        featured: true,
        inStock: true,
        displayOrder: (await storage.getFeaturedItems()).length + 1
      };
      
      await storage.addFeaturedItem(newFeaturedItem);
      
      // Invalidate featured items cache when adding new items
      serverCache.invalidate(CACHE_KEYS.FEATURED_ITEMS);
      
      res.json({ success: true, item: newFeaturedItem });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to add featured item', message: error.message });
    }
  });

  // Update featured item stock status
  app.patch('/api/featured-items/:localId/stock', async (req, res) => {
    try {
      const { localId } = req.params;
      const { inStock } = req.body;
      const { storage } = await import('./storage');
      
      await storage.updateFeaturedItemStock(parseInt(localId), inStock);
      
      // Invalidate featured items cache when updating stock
      serverCache.invalidate(CACHE_KEYS.FEATURED_ITEMS);
      
      res.json({ success: true, message: 'Stock status updated successfully' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to update stock status', message: error.message });
    }
  });

  // Update featured item image
  app.patch('/api/featured-items/:localId/image', async (req, res) => {
    try {
      const { localId } = req.params;
      const { imageUrl } = req.body;
      const { storage } = await import('./storage');
      
      await storage.updateFeaturedItemImage(parseInt(localId), imageUrl);
      
      // Invalidate featured items cache when updating image
      serverCache.invalidate(CACHE_KEYS.FEATURED_ITEMS);
      
      res.json({ success: true, message: 'Image updated successfully' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to update image', message: error.message });
    }
  });

  app.delete('/api/featured-items/:localId', async (req, res) => {
    try {
      const { localId } = req.params;
      const { storage } = await import('./storage');
      
      await storage.removeFeaturedItem(parseInt(localId));
      
      // Invalidate featured items cache when removing items
      serverCache.invalidate(CACHE_KEYS.FEATURED_ITEMS);
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to remove featured item', message: error.message });
    }
  });

  app.patch('/api/featured-items/:localId/stock', async (req, res) => {
    try {
      const { localId } = req.params;
      const { inStock } = req.body;
      const { storage } = await import('./storage');
      
      // Update local stock status
      await storage.updateItemStock(parseInt(localId), inStock);
      
      // Also try to sync with Square if available
      if (squareService) {
        try {
          const featuredItems = await storage.getFeaturedItems();
          const item = featuredItems.find(item => item.localId === parseInt(localId));
          if (item?.squareId) {
            // Note: Square inventory management requires different permissions
            // For now we just update local status
            console.log(`Stock updated for Square item ${item.squareId}: ${inStock}`);
          }
        } catch (squareError) {
          console.error('Square inventory sync failed:', squareError);
        }
      }
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to update item stock', message: error.message });
    }
  });

  // Get all Square images available for assignment
  app.get('/api/square-images', async (req, res) => {
    try {
      const accessToken = process.env.SQUARE_ACCESS_TOKEN;
      const baseUrl = accessToken?.startsWith('sandbox') 
        ? 'https://connect.squareupsandbox.com' 
        : 'https://connect.squareup.com';

      const response = await fetch(`${baseUrl}/v2/catalog/list?types=IMAGE`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Square-Version': '2024-06-04',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Square API error: ${response.status}`);
      }

      const data = await response.json();
      const images = (data.objects || []).map((img: any) => ({
        id: img.id,
        name: img.image_data?.name || 'Unnamed Image',
        url: img.image_data?.url,
        createdAt: img.created_at
      })).filter((img: any) => img.url);

      res.json({
        success: true,
        images,
        count: images.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  // Contact form submission endpoint
  app.post('/api/contact', async (req, res) => {
    try {
      // Validate request body
      const contactData = insertContactSubmissionSchema.parse(req.body);
      
      // Save to database
      const submission = await storage.createContactSubmission(contactData);
      
      // Initialize Brevo email service
      let emailResult = { success: false, error: 'Email service not configured' };
      
      try {
        const brevoService = new BrevoEmailService();
        emailResult = await brevoService.sendContactEmail(contactData);
      } catch (emailError: any) {
        console.warn('Brevo email service not available:', emailError.message);
        emailResult = { success: false, error: emailError.message };
      }
      
      // Update submission status
      await storage.updateContactSubmissionStatus(
        submission.id, 
        emailResult.success ? 'sent' : 'failed'
      );
      
      if (emailResult.success) {
        res.json({
          success: true,
          message: 'Message sent successfully! We\'ll get back to you soon.',
          submissionId: submission.id
        });
      } else {
        // Still return success to user but log the email failure
        console.error('Email sending failed but form was saved:', emailResult.error);
        res.json({
          success: true,
          message: 'Message received! We\'ll get back to you soon.',
          submissionId: submission.id,
          emailStatus: 'pending'
        });
      }
    } catch (error: any) {
      console.error('Contact form submission error:', error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          error: 'Invalid form data',
          details: error.errors
        });
      }
      
      res.status(500).json({
        success: false,
        error: 'Failed to process contact form submission'
      });
    }
  });

  // Test Brevo connection endpoint
  app.get('/api/test-brevo', async (req, res) => {
    try {
      const brevoService = new BrevoEmailService();
      const result = await brevoService.testConnection();
      res.json(result);
    } catch (error: any) {
      res.json({
        success: false,
        error: error.message
      });
    }
  });

  // Test webhook endpoint to verify it's working
  app.get('/api/webhooks/square/test', async (req, res) => {
    res.status(200).json({ 
      message: 'Webhook endpoint is working',
      timestamp: new Date().toISOString(),
      endpoint: '/api/webhooks/square'
    });
  });

  // Webhook deduplication cache - stores event IDs to prevent duplicate processing
  const processedWebhooks = new Set();
  const WEBHOOK_CACHE_MAX_SIZE = 10000;
  const WEBHOOK_RATE_LIMIT = {
    windowMs: 60000, // 1 minute
    maxRequests: 100, // Max 100 webhooks per minute
    requests: new Map() // IP -> {count, resetTime}
  };

  // Square webhook endpoint for payment notifications with rate limiting and deduplication
  app.post('/api/webhooks/square', async (req, res) => {
    try {
      // Rate limiting by IP
      const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
      const now = Date.now();
      const clientLimit = WEBHOOK_RATE_LIMIT.requests.get(clientIp) || { count: 0, resetTime: now + WEBHOOK_RATE_LIMIT.windowMs };
      
      if (now > clientLimit.resetTime) {
        clientLimit.count = 0;
        clientLimit.resetTime = now + WEBHOOK_RATE_LIMIT.windowMs;
      }
      
      if (clientLimit.count >= WEBHOOK_RATE_LIMIT.maxRequests) {
        console.log(`Webhook rate limit exceeded for IP: ${clientIp}`);
        return res.status(200).json({ message: 'Rate limited but acknowledged' });
      }
      
      clientLimit.count++;
      WEBHOOK_RATE_LIMIT.requests.set(clientIp, clientLimit);

      // Deduplication - check if we've already processed this event
      const eventId = req.body?.event_id;
      if (eventId && processedWebhooks.has(eventId)) {
        console.log(`Duplicate webhook ignored: ${eventId}`);
        return res.status(200).json({ message: 'Duplicate webhook ignored' });
      }

      // Immediately acknowledge receipt to Square to prevent retries
      res.status(200).json({ message: 'Webhook received successfully' });
      
      // Add to processed webhooks cache
      if (eventId) {
        processedWebhooks.add(eventId);
        
        // Clean up cache if it gets too large
        if (processedWebhooks.size > WEBHOOK_CACHE_MAX_SIZE) {
          const firstItems = Array.from(processedWebhooks).slice(0, 1000);
          firstItems.forEach(id => processedWebhooks.delete(id));
        }
      }

      // Minimal logging for monitoring (reduced verbosity)
      console.log(`Webhook: ${req.body?.type || 'unknown'} ${eventId ? `(${eventId.slice(-8)})` : ''} - ${req.body?.data?.type || 'no-data'}`);

      // Skip processing historical/old events to reduce load
      const eventTime = req.body?.created_at;
      if (eventTime) {
        const eventDate = new Date(eventTime);
        const hoursSinceEvent = (now - eventDate.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceEvent > 24) {
          console.log(`Skipping old webhook event (${hoursSinceEvent.toFixed(1)}h old)`);
          return;
        }
      }

      // Process only recent webhook events asynchronously
      setImmediate(() => {
        try {
          if (req.body?.data && req.body?.type) {
            // Only process critical events to reduce load
            const criticalEvents = ['payment.created', 'payment.completed'];
            
            // HEAVILY LIMIT both order.updated and payment.updated events (major cost saver)
            if (req.body.type === 'order.updated' || req.body.type === 'payment.updated') {
              const entityId = req.body.data?.id;
              const eventType = req.body.type;
              const cacheKey = `${eventType}_${entityId}`;
              const lastProcessed = serverCache.get(cacheKey);
              const now = Date.now();
              
              // Apply same aggressive 15-minute rate limiting to both event types
              if (lastProcessed && (now - lastProcessed) < 15 * 60 * 1000) {
                console.log(`Skipping ${eventType} for ${entityId} - processed ${Math.round((now - lastProcessed) / 1000 / 60)}min ago`);
                return; // Skip processing
              }
              
              // Cache this processing time for 15 minutes
              serverCache.set(cacheKey, now, 15 * 60);
              console.log(`Processing rate-limited ${eventType}: ${entityId}`);
              // Add minimal processing here if needed
            } else if (criticalEvents.includes(req.body.type)) {
              console.log(`Processing critical event: ${req.body.type} ${req.body.data.id}`);
              // Add actual critical event processing here if needed
            }
          }
        } catch (processingError) {
          console.error('Async webhook processing error:', processingError);
        }
      });

    } catch (error) {
      console.error('Webhook processing error:', error);
      res.status(200).json({ message: 'Webhook received' }); // Still return 200 to prevent retries
    }
  });

  // Square subscription webhook endpoint with rate limiting
  app.post('/api/webhooks/square/subscriptions', async (req, res) => {
    try {
      // Apply same rate limiting as main webhook
      const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
      const now = Date.now();
      const clientLimit = WEBHOOK_RATE_LIMIT.requests.get(clientIp) || { count: 0, resetTime: now + WEBHOOK_RATE_LIMIT.windowMs };
      
      if (now > clientLimit.resetTime) {
        clientLimit.count = 0;
        clientLimit.resetTime = now + WEBHOOK_RATE_LIMIT.windowMs;
      }
      
      if (clientLimit.count >= WEBHOOK_RATE_LIMIT.maxRequests) {
        console.log(`Subscription webhook rate limit exceeded for IP: ${clientIp}`);
        return res.status(200).json({ message: 'Rate limited but acknowledged' });
      }
      
      clientLimit.count++;
      WEBHOOK_RATE_LIMIT.requests.set(clientIp, clientLimit);

      // Immediately acknowledge receipt to Square to prevent retries
      res.status(200).json({ message: 'Subscription webhook received successfully' });
      
      // Minimal logging
      console.log(`Subscription webhook: ${req.body?.type || 'unknown'}`);

    } catch (error) {
      console.error('Subscription webhook processing error:', error);
      res.status(200).json({ message: 'Subscription webhook received' }); // Still return 200 to prevent retries
    }
  });

  // Object Storage Routes
  const objectStorageService = new ObjectStorageService();

  // Get upload URL for object entities
  app.post('/api/objects/upload', async (req, res) => {
    try {
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error: any) {
      console.error('Error getting upload URL:', error);
      res.status(500).json({ error: 'Failed to get upload URL' });
    }
  });

  // Serve private objects
  app.get('/objects/:objectPath(*)', async (req, res) => {
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error: any) {
      console.error('Error serving object:', error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Admin Routes for Image Management

  // File Watcher Routes - Auto-process images from upload folder
  app.get('/api/images/naming-guide', async (req, res) => {
    try {
      const { getNamingGuide } = await import('./fileWatcher');
      const guide = getNamingGuide();
      res.json(guide);
    } catch (error: any) {
      console.error('Error getting naming guide:', error);
      res.status(500).json({ error: 'Failed to get naming guide' });
    }
  });

  app.get('/api/images/upload-status', async (req, res) => {
    try {
      const { getUploadFolderStatus } = await import('./fileWatcher');
      const status = getUploadFolderStatus();
      res.json(status);
    } catch (error: any) {
      console.error('Error getting upload folder status:', error);
      res.status(500).json({ error: 'Failed to get upload folder status' });
    }
  });

  app.post('/api/images/scan', async (req, res) => {
    try {
      const { scanAndProcessImages } = await import('./fileWatcher');
      const results = await scanAndProcessImages();
      res.json(results);
    } catch (error: any) {
      console.error('Error scanning images:', error);
      res.status(500).json({ error: 'Failed to scan images', message: error.message });
    }
  });

  app.post('/api/images/process/:filename', async (req, res) => {
    try {
      const { processImage } = await import('./fileWatcher');
      const result = await processImage(req.params.filename);
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      console.error('Error processing image:', error);
      res.status(500).json({ error: 'Failed to process image', message: error.message });
    }
  });

  // Get all locations
  app.get('/api/admin/locations', async (req, res) => {
    try {
      const locations = await db.select().from(restaurantLocations);
      res.json({ locations });
    } catch (error: any) {
      console.error('Error fetching locations:', error);
      res.status(500).json({ error: 'Failed to fetch locations' });
    }
  });

  // Create location
  app.post('/api/admin/locations', async (req, res) => {
    try {
      const [location] = await db.insert(restaurantLocations).values(req.body).returning();
      res.json(location);
    } catch (error: any) {
      console.error('Error creating location:', error);
      res.status(500).json({ error: 'Failed to create location' });
    }
  });

  // Update location
  app.patch('/api/admin/locations/:id', async (req, res) => {
    try {
      const locationId = parseInt(req.params.id);
      const [location] = await db.update(restaurantLocations)
        .set(req.body)
        .where(eq(restaurantLocations.id, locationId))
        .returning();
      res.json(location);
    } catch (error: any) {
      console.error('Error updating location:', error);
      res.status(500).json({ error: 'Failed to update location' });
    }
  });

  // Update location image
  app.patch('/api/admin/locations/:id/image', async (req, res) => {
    try {
      const locationId = parseInt(req.params.id);
      const { imageUrl } = req.body;
      
      // Normalize the object path and set ACL policy
      const normalizedPath = objectStorageService.normalizeObjectEntityPath(imageUrl);
      if (normalizedPath.startsWith('/objects/')) {
        await objectStorageService.trySetObjectEntityAclPolicy(imageUrl, {
          owner: 'admin',
          visibility: 'public',
        });
      }

      const [location] = await db.update(restaurantLocations)
        .set({ imageUrl: normalizedPath })
        .where(eq(restaurantLocations.id, locationId))
        .returning();
      
      res.json({ imageUrl: normalizedPath });
    } catch (error: any) {
      console.error('Error updating location image:', error);
      res.status(500).json({ error: 'Failed to update location image' });
    }
  });

  // Remove location image
  app.delete('/api/admin/locations/:id/image', async (req, res) => {
    try {
      const locationId = parseInt(req.params.id);
      await db.update(restaurantLocations)
        .set({ imageUrl: null })
        .where(eq(restaurantLocations.id, locationId));
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error removing location image:', error);
      res.status(500).json({ error: 'Failed to remove location image' });
    }
  });

  // Update menu item image
  app.patch('/api/admin/menu-items/:id/image', async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const { imageUrl } = req.body;
      
      // Normalize the object path and set ACL policy
      const normalizedPath = objectStorageService.normalizeObjectEntityPath(imageUrl);
      if (normalizedPath.startsWith('/objects/')) {
        await objectStorageService.trySetObjectEntityAclPolicy(imageUrl, {
          owner: 'admin',
          visibility: 'public',
        });
      }

      const [menuItem] = await db.update(squareMenuItems)
        .set({ imageUrl: normalizedPath })
        .where(eq(squareMenuItems.id, itemId))
        .returning();
      
      res.json({ imageUrl: normalizedPath });
    } catch (error: any) {
      console.error('Error updating menu item image:', error);
      res.status(500).json({ error: 'Failed to update menu item image' });
    }
  });

  // Remove menu item image
  app.delete('/api/admin/menu-items/:id/image', async (req, res) => {
    try {
      const itemId = parseInt(req.params.id);
      await db.update(squareMenuItems)
        .set({ imageUrl: null })
        .where(eq(squareMenuItems.id, itemId));
      res.json({ success: true });
    } catch (error: any) {
      console.error('Error removing menu item image:', error);
      res.status(500).json({ error: 'Failed to remove menu item image' });
    }
  });

  // Banner management routes (placeholder for now - using locations table as example)
  app.get('/api/admin/banners', async (req, res) => {
    try {
      // For now, return empty array - in real implementation would have dedicated banners table
      const banners = [
        {
          id: 1,
          name: 'Hero Banner',
          description: 'Main homepage hero image',
          imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=1000',
          altText: 'Delicious pancakes with berries',
          isActive: true,
          displayOrder: 1,
          usage: 'hero'
        },
        {
          id: 2,
          name: 'About Section Background',
          description: 'Background image for about section',
          imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800',
          altText: 'Restaurant interior',
          isActive: true,
          displayOrder: 2,
          usage: 'section'
        }
      ];
      res.json({ banners });
    } catch (error: any) {
      console.error('Error fetching banners:', error);
      res.status(500).json({ error: 'Failed to fetch banners' });
    }
  });

  // IP tracking statistics endpoint for monitoring API usage optimization
  app.get('/api/admin/ip-stats', async (req, res) => {
    try {
      const stats = ipTracker.getStats();
      const cacheStats = serverCache.getStats();
      
      res.json({
        success: true,
        ipTracking: {
          ...stats,
          storeOpen: ipTracker.isStoreOpen()
        },
        cache: cacheStats,
        message: 'IP-based Square API limiting is active - only new IPs after 1hr cooldown + store open hours trigger fresh API calls'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'Failed to get IP tracking stats',
        message: error.message
      });
    }
  });

  // Simple photo management endpoints
  app.get('/api/admin/banners', async (req, res) => {
    try {
      const { storage } = await import('./storage');
      const banners = await storage.getBanners();
      res.json({ banners });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch banners', message: error.message });
    }
  });

  app.patch('/api/admin/banners/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { imageUrl } = req.body;
      const { storage } = await import('./storage');
      
      await storage.updateBanner(parseInt(id), imageUrl);
      res.json({ success: true, message: 'Banner updated successfully' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to update banner', message: error.message });
    }
  });

  app.get('/api/admin/gallery', async (req, res) => {
    try {
      const { storage } = await import('./storage');
      const images = await storage.getGalleryImages();
      res.json({ images });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch gallery', message: error.message });
    }
  });

  app.post('/api/admin/gallery', async (req, res) => {
    try {
      const { imageUrl, title } = req.body;
      const { storage } = await import('./storage');
      
      await storage.addGalleryImage({ imageUrl, title });
      res.json({ success: true, message: 'Image added to gallery' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to add image', message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
