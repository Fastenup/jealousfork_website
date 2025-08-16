import { apiRequest } from '@/lib/queryClient';

export interface CartItem {
  id: string | number; // Allow both string and number IDs
  name: string;
  price: number;
  quantity: number;
  category?: string; // Make category optional
  description?: string;
}

export interface DeliveryInfo {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  deliveryNotes?: string;
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
}

export interface OrderResponse {
  orderId: string;
  paymentId: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  estimatedReadyTime?: string;
  total: number;
}

export const squareService = {
  async createOrder(orderData: OrderRequest): Promise<OrderResponse> {
    const response = await apiRequest('POST', '/api/orders', orderData);
    return await response.json();
  },

  async getOrder(orderId: string): Promise<OrderResponse> {
    const response = await apiRequest('GET', `/api/orders/${orderId}`);
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