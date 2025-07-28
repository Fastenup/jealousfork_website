// Test Square API for image data
export async function testSquareImages() {
  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  const baseUrl = accessToken?.startsWith('sandbox') 
    ? 'https://connect.squareupsandbox.com' 
    : 'https://connect.squareup.com';

  try {
    // First, get catalog items
    console.log('Fetching catalog items...');
    const itemsResponse = await fetch(`${baseUrl}/v2/catalog/list?types=ITEM`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Square-Version': '2024-06-04',
        'Content-Type': 'application/json'
      }
    });

    if (!itemsResponse.ok) {
      throw new Error(`Items API error: ${itemsResponse.status}`);
    }

    const itemsData = await itemsResponse.json();
    console.log('Items found:', itemsData.objects?.length || 0);

    // Check for image IDs in items
    const itemsWithImages = (itemsData.objects || []).filter((item: any) => 
      item.item_data?.image_ids && item.item_data.image_ids.length > 0
    );

    console.log('Items with image IDs:', itemsWithImages.length);
    
    if (itemsWithImages.length > 0) {
      console.log('Sample item with images:', {
        name: itemsWithImages[0].item_data.name,
        imageIds: itemsWithImages[0].item_data.image_ids
      });
    }

    // Now fetch all image objects
    console.log('\nFetching image catalog...');
    const imagesResponse = await fetch(`${baseUrl}/v2/catalog/list?types=IMAGE`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Square-Version': '2024-06-04',
        'Content-Type': 'application/json'
      }
    });

    if (!imagesResponse.ok) {
      throw new Error(`Images API error: ${imagesResponse.status}`);
    }

    const imagesData = await imagesResponse.json();
    console.log('Image objects found:', imagesData.objects?.length || 0);

    if (imagesData.objects && imagesData.objects.length > 0) {
      console.log('Sample image object:', {
        id: imagesData.objects[0].id,
        imageData: imagesData.objects[0].image_data
      });

      // Check if any images have URLs
      const imagesWithUrls = imagesData.objects.filter((img: any) => 
        img.image_data?.url
      );
      
      console.log('Images with URLs:', imagesWithUrls.length);
      
      if (imagesWithUrls.length > 0) {
        console.log('Sample image URL:', imagesWithUrls[0].image_data.url);
      }
    }

    return {
      totalItems: itemsData.objects?.length || 0,
      itemsWithImages: itemsWithImages.length,
      totalImages: imagesData.objects?.length || 0,
      sampleImageData: imagesData.objects?.[0] || null,
      itemsData: itemsData.objects || [],
      imagesData: imagesData.objects || []
    };

  } catch (error) {
    console.error('Square image test error:', error);
    throw error;
  }
}