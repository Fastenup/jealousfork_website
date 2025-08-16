import { SquareClient } from 'square';

interface SquareConfig {
  accessToken: string;
  applicationId: string;
  locationId: string;
  environment?: 'sandbox' | 'production';
}

export class SquareServiceFixed {
  private config: SquareConfig;
  private client: SquareClient;

  constructor(config: SquareConfig) {
    this.config = config;
    
    // Determine environment from access token
    const environment = config.accessToken.startsWith('sandbox') || config.environment === 'sandbox' 
      ? 'sandbox' 
      : 'production';
    
    try {
      this.client = new SquareClient({
        environment: environment,
        accessToken: config.accessToken
      });
      console.log('Square client initialized successfully for environment:', environment);
    } catch (error) {
      console.error('Failed to initialize Square client:', error);
      throw new Error('Square API initialization failed');
    }
  }

  async createOrder(orderData: {
    idempotencyKey: string;
    order: {
      locationId: string;
      referenceId: string;
      source: {
        name: string;
      };
      lineItems: any[];
      serviceCharges?: any[];
      taxes?: any[];
      fulfillments: any[];
    };
  }) {
    try {
      console.log('Creating Square order with details...');
      
      const accessToken = process.env.SQUARE_ACCESS_TOKEN;
      if (!accessToken) {
        throw new Error('Square access token not configured');
      }

      const environment = accessToken.startsWith('sandbox') ? 'sandbox' : 'production';
      const baseUrl = environment === 'sandbox' 
        ? 'https://connect.squareupsandbox.com' 
        : 'https://connect.squareup.com';

      const requestBody = {
        idempotency_key: orderData.idempotencyKey,
        order: {
          ...orderData.order,
          location_id: orderData.order.locationId, // Square expects location_id, not locationId
        }
      };
      
      // Remove the camelCase version to avoid confusion
      delete requestBody.order.locationId;

      console.log('Sending order request to Square API:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${baseUrl}/v2/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Square-Version': '2024-06-04',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Square orders API error:', responseData);
        throw new Error(responseData.errors?.[0]?.detail || 'Order creation failed');
      }

      console.log('Square order created successfully:', responseData.order?.id);
      return responseData;
    } catch (error: any) {
      console.error('Square order creation error:', error);
      throw new Error(`Order creation failed: ${error?.message || 'Unknown error'}`);
    }
  }

  async createPayment(paymentData: {
    sourceId: string;
    amountMoney: {
      amount: number;
      currency: string;
    };
    idempotencyKey: string;
    referenceId?: string;
    orderId?: string;
    note?: string;
  }) {
    try {
      console.log('Processing Square payment with production API...');
      
      const accessToken = process.env.SQUARE_ACCESS_TOKEN;
      const locationId = process.env.SQUARE_LOCATION_ID;
      
      if (!accessToken || !locationId) {
        throw new Error('Square credentials not configured');
      }

      const environment = accessToken.startsWith('sandbox') ? 'sandbox' : 'production';
      const baseUrl = environment === 'sandbox' 
        ? 'https://connect.squareupsandbox.com' 
        : 'https://connect.squareup.com';

      const requestBody = {
        source_id: paymentData.sourceId,
        amount_money: paymentData.amountMoney,
        idempotency_key: paymentData.idempotencyKey,
        location_id: locationId,
        ...(paymentData.referenceId && { reference_id: paymentData.referenceId }),
        ...(paymentData.orderId && { order_id: paymentData.orderId }),
        ...(paymentData.note && { note: paymentData.note })
      };

      console.log('Sending payment request to Square API:', { 
        ...requestBody, 
        source_id: '[REDACTED]' 
      });

      const response = await fetch(`${baseUrl}/v2/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Square-Version': '2024-06-04',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Square payment API error:', responseData);
        throw new Error(responseData.errors?.[0]?.detail || 'Payment processing failed');
      }

      const payment = responseData.payment;
      console.log('Payment processed successfully:', payment.id);

      return {
        id: payment.id,
        status: payment.status,
        amountMoney: payment.amount_money,
        sourceType: payment.source_type,
        referenceId: payment.reference_id,
        receiptNumber: payment.receipt_number,
        receiptUrl: payment.receipt_url
      };
    } catch (error: any) {
      console.error('Square payment error:', error);
      throw new Error(`Payment failed: ${error?.message || 'Unknown error'}`);
    }
  }

  // Keep other methods from original service that work
  async getCatalogItems() {
    try {
      console.log('Attempting to fetch catalog items...');
      const { result } = await this.client.catalogApi.listCatalog(
        undefined,
        "ITEM"
      );
      
      if (!result.objects) {
        return [];
      }

      return result.objects.map((item: any) => {
        const itemData = item.itemData;
        const firstVariation = itemData?.variations?.[0];
        const price = firstVariation?.itemVariationData?.priceMoney?.amount || 0;
        
        return {
          id: item.id,
          name: itemData?.name || 'Unknown Item',
          description: itemData?.description || '',
          price: price / 100,
          category: itemData?.categoryId || 'uncategorized',
          inStock: true,
          image: itemData?.imageUrl || null,
          squareId: item.id,
          variations: itemData?.variations?.map((v: any) => ({
            id: v.id,
            name: v.itemVariationData?.name,
            price: (v.itemVariationData?.priceMoney?.amount || 0) / 100,
            sku: v.itemVariationData?.sku,
          })) || []
        };
      });
    } catch (error: any) {
      console.error('Square catalog error:', error);
      throw new Error(`Failed to fetch catalog: ${error?.message || 'Unknown error'}`);
    }
  }

  async getInventoryCounts(catalogObjectIds: string[]) {
    if (!catalogObjectIds || catalogObjectIds.length === 0) {
      return new Map();
    }

    try {
      const { result } = await this.client.inventoryApi.batchRetrieveInventoryCounts({
        catalogObjectIds: catalogObjectIds,
        locationIds: [this.config.locationId]
      });

      const inventoryMap = new Map();
      
      if (result.counts) {
        result.counts.forEach((count: any) => {
          if (count.catalogObjectId) {
            const rawQuantity = count.quantity;
            const quantity = parseFloat(rawQuantity || '0');
            const isTracked = rawQuantity !== undefined && rawQuantity !== null && rawQuantity !== '';
            const inStock = !isTracked || quantity > 0;
            
            inventoryMap.set(count.catalogObjectId, {
              available: isTracked ? quantity : null,
              inStock: inStock,
              isTracked: isTracked,
              rawQuantity: rawQuantity
            });
          }
        });
      }

      return inventoryMap;
    } catch (error: any) {
      console.error('Square inventory error:', error);
      return new Map();
    }
  }
}

export function createSquareServiceFixed() {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  const applicationId = process.env.SQUARE_APPLICATION_ID;
  const locationId = process.env.SQUARE_LOCATION_ID;

  if (!accessToken || !applicationId || !locationId) {
    throw new Error('Square API credentials not configured. Please check SQUARE_ACCESS_TOKEN, SQUARE_APPLICATION_ID, and SQUARE_LOCATION_ID environment variables.');
  }

  return new SquareServiceFixed({
    accessToken,
    applicationId,
    locationId,
  });
}