// Quick test to see Square image data
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const BASE_URL = 'https://connect.squareup.com';

async function testImages() {
  console.log('Testing Square image connections...');
  
  // Get items first
  const itemsResp = await fetch(`${BASE_URL}/v2/catalog/list?types=ITEM&limit=5`, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Square-Version': '2024-06-04'
    }
  });
  const itemsData = await itemsResp.json();
  
  console.log('Sample items:');
  itemsData.objects?.slice(0, 3).forEach(item => {
    console.log(`- ${item.item_data.name}`);
    console.log(`  Image IDs: ${JSON.stringify(item.item_data.image_ids || [])}`);
  });
  
  // Get images
  const imagesResp = await fetch(`${BASE_URL}/v2/catalog/list?types=IMAGE&limit=5`, {
    headers: {
      'Authorization': `Bearer ${TOKEN}`,
      'Square-Version': '2024-06-04'
    }
  });
  const imagesData = await imagesResp.json();
  
  console.log('\nAvailable images:');
  imagesData.objects?.forEach(img => {
    console.log(`- ID: ${img.id}`);
    console.log(`  Name: ${img.image_data.name}`);
    console.log(`  URL: ${img.image_data.url}`);
  });
}

testImages().catch(console.error);