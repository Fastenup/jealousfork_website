import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { storage } from "./storage";
import { createSquareService } from "./squareService";
import { z } from "zod";
import { insertContactSubmissionSchema } from "../shared/schema";
import { BrevoEmailService } from "./brevoService";

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
    squareService = createSquareService();
  } catch (error: any) {
    console.warn('Square service not configured:', error?.message || 'Unknown error');
  }

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
        
        return res.json({
          items: allSquareItems,
          source: 'square-sync',
          count: allSquareItems.length,
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
          
          return res.json({ items, source: 'square-direct', count: items.length });
        }
      } catch (directError) {
        console.log('Direct Square API also failed');
      }
      
      // Final fallback to static menu
      const staticMenu = [
        {
          id: 'static-1',
          name: 'Chocolate Oreo Chip Pancakes',
          description: 'Crushed Oreos, Chocolate Chips, Oreo Whipped Cream, Chocolate Ganache',
          price: 17,
          category: 'pancakes',
          inStock: true
        }
      ];
      res.json({ items: staticMenu, source: 'static' });
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

  // Get specific menu category
  app.get('/api/menu/:category', async (req, res) => {
    try {
      if (!squareService) {
        return res.status(503).json({ 
          error: 'Square API not configured.' 
        });
      }

      const { category } = req.params;
      const allItems = await squareService.getMenuWithInventory();
      const categoryItems = allItems.filter((item: any) => 
        item.category.toLowerCase() === category.toLowerCase()
      );
      
      res.json({ success: true, items: categoryItems, category });
    } catch (error: any) {
      console.error('Category menu API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch category menu',
        message: error?.message || 'Unknown error'
      });
    }
  });

  // Get inventory status for specific items
  app.post('/api/inventory/check', async (req, res) => {
    try {
      if (!squareService) {
        return res.status(503).json({ 
          error: 'Square API not configured.' 
        });
      }

      const { itemIds } = req.body;
      if (!itemIds || !Array.isArray(itemIds)) {
        return res.status(400).json({ error: 'itemIds array required' });
      }

      const inventory = await squareService.getInventoryCounts(itemIds);
      const inventoryStatus = Object.fromEntries(inventory);
      
      res.json({ success: true, inventory: inventoryStatus });
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
      
      // Process payment with Square including order details
      console.log('Processing payment for order:', orderId, 'with token:', orderData.paymentToken.substring(0, 20) + '...');
      const payment = await squareService.createPayment({
        sourceId: orderData.paymentToken,
        amountMoney: {
          amount: Math.round(orderData.total * 100), // Convert to cents
          currency: 'USD',
        },
        idempotencyKey: `${orderId}-payment`,
        referenceId: orderId,
        note: `${orderData.orderType.toUpperCase()} Order - ${orderData.customerInfo.name} - ${orderData.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}`,
        orderRequest: {
          order: {
            locationId: process.env.SQUARE_LOCATION_ID,
            referenceId: orderId,
            source: {
              name: 'Jealous Fork Online Ordering'
            },
            lineItems: orderData.items.map(item => ({
              name: item.name,
              quantity: item.quantity.toString(),
              basePriceMoney: {
                amount: Math.round(item.price * 100),
                currency: 'USD'
              },
              note: item.description || ''
            })),
            serviceCharges: orderData.deliveryFee > 0 ? [{
              name: 'Delivery Fee',
              amountMoney: {
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
              state: 'PROPOSED',
              pickupDetails: orderData.orderType === 'pickup' ? {
                recipient: {
                  displayName: orderData.customerInfo.name,
                  emailAddress: orderData.customerInfo.email,
                  phoneNumber: orderData.customerInfo.phone
                },
                scheduleType: 'ASAP',
                note: 'Order ready for pickup'
              } : undefined,
              shipmentDetails: orderData.orderType === 'delivery' ? {
                recipient: {
                  displayName: orderData.customerInfo.name,
                  emailAddress: orderData.customerInfo.email,
                  phoneNumber: orderData.deliveryInfo?.phone || orderData.customerInfo.phone,
                  address: {
                    addressLine1: orderData.deliveryInfo?.address || '',
                    locality: orderData.deliveryInfo?.city || '',
                    administrativeDistrictLevel1: orderData.deliveryInfo?.state || '',
                    postalCode: orderData.deliveryInfo?.zipCode || ''
                  }
                },
                note: orderData.deliveryInfo?.deliveryNotes || 'Delivery order'
              } : undefined
            }]
          }
        }
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
        await fetch('/api/contact', {
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
        }
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

  // Featured items management endpoints
  app.get('/api/featured-items', async (req, res) => {
    try {
      const { storage } = await import('./storage');
      const items = await storage.getFeaturedItems();
      res.json({ items });
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
      
      res.json({
        success: true,
        item: newFeaturedItem
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to add Square item as featured', message: error.message });
    }
  });

  app.delete('/api/featured-items/:localId', async (req, res) => {
    try {
      const { localId } = req.params;
      const { storage } = await import('./storage');
      
      await storage.removeFeaturedItem(parseInt(localId));
      
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
      
      await storage.updateItemStock(parseInt(localId), inStock);
      
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

  // Square webhook endpoint for payment notifications
  app.post('/api/webhooks/square', (req, res, next) => {
    // Parse raw body for webhook signature verification
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', async () => {
      req.body = data;
      next();
    });
  }, async (req, res) => {
    try {
      const signature = req.headers['x-square-signature'] as string;
      const body = req.body;
      
      // Log webhook for debugging
      console.log('Square webhook received:', {
        signature: signature ? 'present' : 'missing',
        bodyLength: body?.length || 0,
        headers: req.headers
      });

      // For now, acknowledge receipt
      // In production, you'd verify the signature and process events
      res.status(200).json({ message: 'Webhook received' });
    } catch (error) {
      console.error('Webhook processing error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });

  // Square subscription webhook endpoint
  app.post('/api/webhooks/square/subscriptions', (req, res, next) => {
    // Parse raw body for webhook signature verification
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', async () => {
      req.body = data;
      next();
    });
  }, async (req, res) => {
    try {
      const signature = req.headers['x-square-signature'] as string;
      const body = req.body;
      
      // Log subscription webhook for debugging
      console.log('Square subscription webhook received:', {
        signature: signature ? 'present' : 'missing',
        bodyLength: body?.length || 0,
        headers: req.headers
      });

      // Acknowledge receipt for subscription events
      res.status(200).json({ message: 'Subscription webhook received' });
    } catch (error) {
      console.error('Subscription webhook processing error:', error);
      res.status(500).json({ error: 'Subscription webhook processing failed' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
