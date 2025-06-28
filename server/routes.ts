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
