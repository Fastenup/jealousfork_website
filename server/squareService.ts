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
      this.client = new SquareClient({
        accessToken: config.accessToken,
        environment: environment
      });
      console.log('Square client initialized successfully for environment:', environment);
    } catch (error) {
      console.error('Failed to initialize Square client:', error);
      throw new Error('Square API initialization failed');
    }
  }

  // Test Square API connection
  async testConnection() {
    try {
      console.log('Testing Square API connection...');
      const { result } = await this.client.locationsApi.listLocations();
      console.log('Square locations response:', result);
      return result.locations || [];
    } catch (error: any) {
      console.error('Square connection test failed:', error);
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
            inventoryMap.set(quantity.catalogObjectId, {
              available: parseInt(quantity.quantity || '0'),
              inStock: parseInt(quantity.quantity || '0') > 0
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

      return catalogItems.map((item: any) => ({
        ...item,
        inStock: inventory.get(item.squareId)?.inStock ?? true,
        available: inventory.get(item.squareId)?.available ?? null
      }));
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
      // TODO: Implement actual Square payment processing once API keys are provided
      // For now, simulate successful payment for testing
      console.log('Processing payment:', paymentData);
      
      return {
        id: `sqpmt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: 'COMPLETED',
        amountMoney: paymentData.amountMoney,
        sourceType: 'CARD',
        referenceId: paymentData.referenceId,
      };
    } catch (error: any) {
      console.error('Square payment error:', error);
      throw new Error(`Payment failed: ${error?.message || 'Unknown error'}`);
    }
  }

  async getPayment(paymentId: string) {
    try {
      // TODO: Implement actual Square payment retrieval once API keys are provided
      return {
        id: paymentId,
        status: 'COMPLETED',
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