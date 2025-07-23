import { SquareClient } from 'square';

interface SquareConfig {
  accessToken: string;
  environment: string;
  applicationId: string;
  locationId: string;
}

export class SquareServiceV2 {
  private config: SquareConfig;
  private client: SquareClient;

  constructor(config: SquareConfig) {
    this.config = config;
    
    // Determine environment from access token
    const environment = config.accessToken.startsWith('sandbox') || config.environment === 'sandbox' 
      ? 'sandbox' 
      : 'production';
    
    try {
      // Try different initialization methods for different Square SDK versions
      this.client = new SquareClient({
        token: config.accessToken,
        environment: environment
      });
      
      console.log('Square client V2 initialized successfully for environment:', environment);
      console.log('Access token starts with:', config.accessToken.substring(0, 20) + '...');
    } catch (error) {
      console.error('Failed to initialize Square client V2:', error);
      throw new Error('Square API initialization failed');
    }
  }

  // Test Square API connection with better error handling
  async testConnection() {
    try {
      console.log('Testing Square API connection V2...');
      console.log('Client instance exists:', !!this.client);
      
      if (!this.client) {
        throw new Error('Square client not initialized');
      }

      // Try to access the locations API
      const locationsApi = this.client.locationsApi;
      console.log('LocationsApi exists:', !!locationsApi);
      
      if (!locationsApi) {
        throw new Error('locationsApi not available on client');
      }

      console.log('Attempting to call listLocations...');
      const response = await locationsApi.listLocations();
      console.log('Raw response:', response);
      
      // Handle different response formats
      let locations;
      if (response.result && response.result.locations) {
        locations = response.result.locations;
      } else if (response.locations) {
        locations = response.locations;
      } else {
        locations = [];
      }
      
      console.log('Processed locations:', locations);
      return locations;
    } catch (error: any) {
      console.error('Square connection test V2 failed:', error);
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack?.split('\n').slice(0, 5)
      });
      
      // Check if it's an authentication error
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        throw new Error('Square API authentication failed - check your access token');
      }
      
      // Check if it's a permissions error
      if (error.message.includes('403') || error.message.includes('Forbidden')) {
        throw new Error('Square API permissions insufficient - check your app permissions');
      }
      
      throw new Error(`Square API connection failed: ${error.message}`);
    }
  }

  // Get catalog items with better error handling
  async getCatalogItems() {
    try {
      console.log('Attempting to fetch catalog items V2...');
      
      if (!this.client || !this.client.catalogApi) {
        throw new Error('Catalog API not available');
      }

      const response = await this.client.catalogApi.listCatalog(
        undefined, // cursor for pagination
        "ITEM"     // types filter
      );
      
      console.log('Catalog response:', response);
      
      let objects;
      if (response.result && response.result.objects) {
        objects = response.result.objects;
      } else if (response.objects) {
        objects = response.objects;
      } else {
        return [];
      }

      return objects.map((item: any) => {
        const itemData = item.itemData;
        const firstVariation = itemData?.variations?.[0];
        const price = firstVariation?.itemVariationData?.priceMoney?.amount || 0;
        
        return {
          id: item.id,
          name: itemData?.name || 'Unknown Item',
          description: itemData?.description || '',
          price: price / 100, // Convert from cents to dollars
          category: itemData?.categoryId || 'uncategorized',
          inStock: true
        };
      });
    } catch (error: any) {
      console.error('Failed to fetch catalog items V2:', error);
      throw new Error(`Failed to fetch catalog: ${error.message}`);
    }
  }
}

// Create Square service instance using environment variables
export function createSquareServiceV2() {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  const applicationId = process.env.SQUARE_APPLICATION_ID;
  const locationId = process.env.SQUARE_LOCATION_ID;

  if (!accessToken || !applicationId || !locationId) {
    console.warn('Square API credentials missing. Required: SQUARE_ACCESS_TOKEN, SQUARE_APPLICATION_ID, SQUARE_LOCATION_ID');
    return null;
  }

  try {
    return new SquareServiceV2({
      accessToken,
      applicationId,
      locationId,
      environment: accessToken.startsWith('sandbox') ? 'sandbox' : 'production'
    });
  } catch (error) {
    console.error('Failed to create Square service V2:', error);
    return null;
  }
}