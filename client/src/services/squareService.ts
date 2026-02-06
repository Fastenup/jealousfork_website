import { apiRequest } from '@/lib/queryClient';

export interface Modifier {
  id: string;
  name: string;
  price: number;  // In dollars
}

export interface ModifierList {
  id: string;
  name: string;
  selectionType: 'SINGLE' | 'MULTIPLE';
  modifiers: Modifier[];
}

export interface CartItem {
  id: string | number; // Allow both string and number IDs
  name: string;
  price: number;
  quantity: number;
  category?: string; // Make category optional
  description?: string;
  cartLineId?: string; // Unique key for cart identity (itemId + modifier combination)
  modifiers?: Modifier[]; // Selected modifiers for this item
  specialInstructions?: string; // Per-item notes like "no onions"
}

// Helper to generate unique cart line ID based on item + modifiers
export function generateCartLineId(itemId: string | number, modifiers?: Modifier[]): string {
  if (!modifiers || modifiers.length === 0) return String(itemId);
  const sortedModIds = modifiers.map(m => m.id).sort().join('-');
  return `${itemId}-${sortedModIds}`;
}

export interface DeliveryInfo {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  deliveryNotes?: string;
  notes?: string;
}

export interface OrderRequest {
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  deliveryInfo?: DeliveryInfo;
  orderType: 'pickup' | 'delivery';
  paymentToken: string;
  orderNotes?: string; // Order-level notes for both pickup and delivery
}

export interface OrderResponse {
  orderId: string;
  paymentId: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  estimatedReadyTime?: string;
  total: number;
  items?: CartItem[];
  orderType?: 'pickup' | 'delivery';
  customerInfo?: {
    name: string;
    email: string;
    phone: string;
  };
  deliveryInfo?: DeliveryInfo | null;
  subtotal?: number;
  tax?: number;
  deliveryFee?: number;
}

export const squareService = {
  async createOrder(orderData: OrderRequest): Promise<OrderResponse> {
    try {
      console.log('Sending order data:', orderData);
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Order creation failed:', response.status, errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || `HTTP ${response.status}: ${errorText}`);
        } catch (parseError) {
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
      }
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      if (!responseText.trim()) {
        throw new Error('Empty response from server');
      }
      
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError, 'Response:', responseText);
        throw new Error('Invalid JSON response from server');
      }
    } catch (error) {
      console.error('Order creation error:', error);
      throw error;
    }
  },

  async getOrder(orderId: string): Promise<OrderResponse> {
    const response = await fetch(`/api/orders/${orderId}`, {
      credentials: 'include'
    });
    return await response.json();
  },

  async getPaymentMethods() {
    // This will be handled by Square Web Payments SDK on the frontend
    return {
      card: true,
      googlePay: true,
      applePay: true,
      ach: true,
    };
  },
};