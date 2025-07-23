import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { storage } from "./storage";
import { createSquareService } from "./squareService";
import { z } from "zod";

// Order request validation schema
const orderRequestSchema = z.object({
  items: z.array(z.object({
    id: z.number(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
    category: z.string(),
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

  // Get dynamic menu from Square Catalog API
  app.get('/api/menu', async (req, res) => {
    try {
      if (!squareService) {
        return res.status(503).json({ 
          error: 'Square API not configured. Using static menu data.' 
        });
      }

      const menuItems = await squareService.getMenuWithInventory();
      res.json({ success: true, items: menuItems });
    } catch (error: any) {
      console.error('Menu API error:', error);
      res.status(500).json({ 
        error: 'Failed to fetch menu',
        message: error?.message || 'Unknown error'
      });
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
      
      // Process payment with Square
      const payment = await squareService.createPayment({
        sourceId: orderData.paymentToken,
        amountMoney: {
          amount: Math.round(orderData.total * 100), // Convert to cents
          currency: 'USD',
        },
        idempotencyKey: `${orderId}-payment`,
        referenceId: orderId,
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

      res.json({
        orderId: order.orderId,
        paymentId: order.paymentId,
        status: order.status,
        estimatedReadyTime: order.estimatedReadyTime?.toISOString(),
        total: parseFloat(order.total),
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

  const httpServer = createServer(app);
  return httpServer;
}
