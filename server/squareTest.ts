// Direct Square API test without SDK
export async function testSquareAPIDirect() {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  const locationId = process.env.SQUARE_LOCATION_ID;
  
  if (!accessToken || !locationId) {
    throw new Error('Missing Square credentials');
  }
  
  const environment = accessToken.startsWith('sandbox') ? 'sandbox' : 'production';
  const baseUrl = environment === 'sandbox' 
    ? 'https://connect.squareupsandbox.com' 
    : 'https://connect.squareup.com';
  
  try {
    console.log('Testing direct Square API call...');
    console.log('Environment:', environment);
    console.log('Base URL:', baseUrl);
    console.log('Token prefix:', accessToken.substring(0, 20) + '...');
    
    // Test locations endpoint
    const response = await fetch(`${baseUrl}/v2/locations`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Square-Version': '2024-06-04',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Locations data:', data);
    
    return {
      success: true,
      environment,
      locations: data.locations || []
    };
    
  } catch (error: any) {
    console.error('Direct API test failed:', error);
    throw new Error(`Direct API test failed: ${error.message}`);
  }
}