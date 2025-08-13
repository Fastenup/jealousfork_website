import { SquareClient } from 'square';

// Create Square service instance using environment variables
export function createSquareService() {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  const applicationId = process.env.SQUARE_APPLICATION_ID;
  const locationId = process.env.SQUARE_LOCATION_ID;

  if (!accessToken || !applicationId || !locationId) {
    console.warn('Square API credentials missing. Required: SQUARE_ACCESS_TOKEN, SQUARE_APPLICATION_ID, SQUARE_LOCATION_ID');
    return null;
  }

  try {
    return new SquareService({
      accessToken,
      applicationId,
      locationId,
      environment: accessToken.startsWith('sandbox') ? 'sandbox' : 'production'
    });
  } catch (error) {
    console.error('Failed to create Square service:', error);
    return null;
  }
}

interface SquareConfig {
  accessToken: string;
  environment: string;
  applicationId: string;
  locationId: string;
}

export class SquareService {
  private config: SquareConfig;
  private client: SquareClient;

  constructor(config: SquareConfig) {
    this.config = config;
    
    // Determine environment from access token
    const environment = config.accessToken.startsWith('sandbox') || config.environment === 'sandbox' 
      ? 'sandbox' 
      : 'production';
    
    try {
      // Use the correct property names for Square SDK v40+
      this.client = new SquareClient({
        accessToken: config.accessToken,
        environment: environment,
        customUrl: environment === 'sandbox' ? 'https://connect.squareupsandbox.com' : 'https://connect.squareup.com'
      });
      console.log('Square client initialized successfully for environment:', environment);
      console.log('Client methods available:', Object.keys(this.client));
    } catch (error) {
      console.error('Failed to initialize Square client:', error);
      throw new Error('Square API initialization failed');
    }
  }

  // Test Square API connection
  async testConnection() {
    try {
      console.log('Testing Square API connection...');
      console.log('Client instance:', !!this.client);
      console.log('LocationsApi:', !!this.client?.locationsApi);
      
      if (!this.client || !this.client.locationsApi) {
        throw new Error('Square client or locationsApi not properly initialized');
      }
      
      const response = await this.client.locationsApi.listLocations();
      console.log('Square locations response:', response);
      
      // Handle both old and new SDK response formats
      const locations = response.result?.locations || response.locations || [];
      return locations;
    } catch (error: any) {
      console.error('Square connection test failed:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw new Error(`Square API connection failed: ${error.message}`);
    }
  }

  // Get all menu items from Square Catalog
  async getCatalogItems() {
    try {
      console.log('Attempting to fetch catalog items...');
      const { result } = await this.client.catalogApi.listCatalog(
        undefined, // cursor for pagination
        "ITEM"     // types filter
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
          price: price / 100, // Convert from cents to dollars
          category: itemData?.categoryId || 'uncategorized',
          inStock: true, // We'll implement inventory checking separately
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

  // Get inventory counts for items
  async getInventoryCounts(catalogItemIds: string[]) {
    try {
      if (catalogItemIds.length === 0) {
        return new Map();
      }
      
      const { result } = await this.client.inventoryApi.batchRetrieveInventoryQuantities({
        catalogObjectIds: catalogItemIds,
        locationIds: [this.config.locationId]
      });

      const inventoryMap = new Map();
      
      if (result.quantities) {
        result.quantities.forEach((quantity: any) => {
          if (quantity.catalogObjectId) {
            const rawQuantity = quantity.quantity;
            const isTracked = rawQuantity !== null && rawQuantity !== undefined && rawQuantity !== '';
            const numericQuantity = parseInt(rawQuantity || '0');
            
            inventoryMap.set(quantity.catalogObjectId, {
              available: isTracked ? numericQuantity : null, // null means unlimited/untracked
              // Logic: blank/null = in stock (unlimited), 0 or negative = out of stock
              inStock: !isTracked || numericQuantity > 0,
              isTracked: isTracked,
              rawQuantity: rawQuantity // Keep raw value for debugging
            });
          }
        });
      }

      return inventoryMap;
    } catch (error: any) {
      console.error('Square inventory error:', error);
      // Return empty map if inventory API fails - items will show as in stock
      return new Map();
    }
  }

  // Get menu items with real-time inventory
  async getMenuWithInventory() {
    try {
      const catalogItems = await this.getCatalogItems();
      const catalogIds = catalogItems.map(item => item.squareId);
      const inventory = await this.getInventoryCounts(catalogIds);

      return catalogItems.map((item: any) => {
        const inventoryData = inventory.get(item.squareId);
        return {
          ...item,
          inStock: inventoryData?.inStock ?? true,
          available: inventoryData?.available ?? null,
          isTracked: inventoryData?.isTracked ?? false,
          rawQuantity: inventoryData?.rawQuantity ?? null
        };
      });
    } catch (error: any) {
      console.error('Error getting menu with inventory:', error);
      throw error;
    }
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
        ...(paymentData.referenceId && { reference_id: paymentData.referenceId })
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

  async getPayment(paymentId: string) {
    try {
      const accessToken = process.env.SQUARE_ACCESS_TOKEN;
      
      if (!accessToken) {
        throw new Error('Square access token not configured');
      }

      const environment = accessToken.startsWith('sandbox') ? 'sandbox' : 'production';
      const baseUrl = environment === 'sandbox' 
        ? 'https://connect.squareupsandbox.com' 
        : 'https://connect.squareup.com';

      const response = await fetch(`${baseUrl}/v2/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Square-Version': '2024-06-04',
          'Content-Type': 'application/json'
        }
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.errors?.[0]?.detail || 'Failed to retrieve payment');
      }

      const payment = responseData.payment;
      return {
        id: payment.id,
        status: payment.status,
        amountMoney: payment.amount_money,
        sourceType: payment.source_type,
        receiptNumber: payment.receipt_number,
        receiptUrl: payment.receipt_url
      };
    } catch (error: any) {
      console.error('Get payment error:', error);
      throw new Error(`Failed to retrieve payment: ${error?.message || 'Unknown error'}`);
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
      // TODO: Implement actual Square order creation once API keys are provided
      return {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        lineItems: orderData.lineItems,
      };
    } catch (error: any) {
      console.error('Square order error:', error);
      throw new Error(`Order creation failed: ${error?.message || 'Unknown error'}`);
    }
  }

  private generateIdempotencyKey(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export default SquareService
export default SquareService;