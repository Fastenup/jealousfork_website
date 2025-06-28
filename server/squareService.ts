import { Client, Environment } from 'squareup';

interface SquareConfig {
  accessToken: string;
  environment: string;
  applicationId: string;
  locationId: string;
}

export class SquareService {
  private client: Client;
  private locationId: string;

  constructor(config: SquareConfig) {
    const environment = config.environment === 'production' 
      ? Environment.Production 
      : Environment.Sandbox;
    
    this.client = new Client({
      accessToken: config.accessToken,
      environment
    });
    
    this.locationId = config.locationId;
  }

  async createPayment(paymentData: {
    sourceId: string;
    amountMoney: {
      amount: number; // Amount in cents
      currency: string;
    };
    idempotencyKey: string;
    referenceId?: string;
  }) {
    try {
      const { result } = await this.client.paymentsApi.createPayment({
        sourceId: paymentData.sourceId,
        idempotencyKey: paymentData.idempotencyKey,
        amountMoney: paymentData.amountMoney,
        locationId: this.locationId,
        referenceId: paymentData.referenceId,
      });

      return result.payment;
    } catch (error) {
      console.error('Square payment error:', error);
      throw new Error(`Payment failed: ${error.message || 'Unknown error'}`);
    }
  }

  async getPayment(paymentId: string) {
    try {
      const { result } = await this.client.paymentsApi.getPayment(paymentId);
      return result.payment;
    } catch (error) {
      console.error('Get payment error:', error);
      throw new Error(`Failed to retrieve payment: ${error.message || 'Unknown error'}`);
    }
  }

  async createOrder(orderData: {
    lineItems: Array<{
      name: string;
      quantity: string;
      basePriceMoney: {
        amount: number;
        currency: string;
      };
    }>;
  }) {
    try {
      const { result } = await this.client.ordersApi.createOrder({
        order: {
          locationId: this.locationId,
          lineItems: orderData.lineItems.map(item => ({
            name: item.name,
            quantity: item.quantity,
            basePriceMoney: item.basePriceMoney,
          })),
        },
        idempotencyKey: this.generateIdempotencyKey(),
      });

      return result.order;
    } catch (error) {
      console.error('Square order error:', error);
      throw new Error(`Order creation failed: ${error.message || 'Unknown error'}`);
    }
  }

  private generateIdempotencyKey(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Initialize Square service with environment variables
export function createSquareService(): SquareService {
  const config: SquareConfig = {
    accessToken: process.env.SQUARE_ACCESS_TOKEN || '',
    environment: process.env.SQUARE_ENVIRONMENT || 'sandbox',
    applicationId: process.env.SQUARE_APPLICATION_ID || '',
    locationId: process.env.SQUARE_LOCATION_ID || '',
  };

  if (!config.accessToken || !config.applicationId || !config.locationId) {
    throw new Error('Missing required Square configuration. Please set SQUARE_ACCESS_TOKEN, SQUARE_APPLICATION_ID, and SQUARE_LOCATION_ID environment variables.');
  }

  return new SquareService(config);
}