import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Image as ImageIcon, 
  ExternalLink, 
  MapPin, 
  Star, 
  Package 
} from 'lucide-react';

interface ImageUsage {
  id: string;
  url: string;
  name: string;
  type: 'menu-item' | 'location' | 'banner' | 'hero' | 'stock';
  usage: string;
  isActive: boolean;
  source?: string;
}

export function CurrentImagesGallery() {
  // Fetch menu items with images
  const { data: menuData } = useQuery({
    queryKey: ['/api/menu'],
  });

  // Fetch locations with images
  const { data: locationsData } = useQuery({
    queryKey: ['/api/admin/locations'],
  });

  // Fetch banner images
  const { data: bannersData } = useQuery({
    queryKey: ['/api/admin/banners'],
  });

  const menuItems = (menuData as any)?.items || [];
  const locations = (locationsData as any)?.locations || [];
  const banners = (bannersData as any)?.banners || [];

  // Collect all images currently in use
  const allImages: ImageUsage[] = [
    // Menu item images
    ...menuItems
      .filter((item: any) => item.imageUrl)
      .map((item: any) => ({
        id: `menu-${item.id}`,
        url: item.imageUrl,
        name: item.name,
        type: 'menu-item' as const,
        usage: `Menu Item${item.isFeatured ? ' (Featured)' : ''}`,
        isActive: item.inStock !== false && item.isAvailable !== false,
        source: item.squareId ? 'Square API' : 'Manual'
      })),

    // Location images
    ...locations
      .filter((location: any) => location.imageUrl)
      .map((location: any) => ({
        id: `location-${location.id}`,
        url: location.imageUrl,
        name: location.name,
        type: 'location' as const,
        usage: 'Location Image',
        isActive: location.isActive,
        source: 'Manual'
      })),

    // Location hero images
    ...locations
      .filter((location: any) => location.heroImageUrl)
      .map((location: any) => ({
        id: `location-hero-${location.id}`,
        url: location.heroImageUrl,
        name: `${location.name} Hero`,
        type: 'hero' as const,
        usage: 'Location Hero',
        isActive: location.isActive,
        source: 'Manual'
      })),

    // Banner images
    ...banners.map((banner: any) => ({
      id: `banner-${banner.id}`,
      url: banner.imageUrl,
      name: banner.name,
      type: 'banner' as const,
      usage: `Banner (${banner.usage})`,
      isActive: banner.isActive,
      source: 'Manual'
    })),

    // Stock images being used (hardcoded ones from the website)
    {
      id: 'hero-main',
      url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=1000',
      name: 'Main Hero Image',
      type: 'hero' as const,
      usage: 'Homepage Hero',
      isActive: true,
      source: 'Unsplash'
    },
    {
      id: 'about-chef',
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800',
      name: 'Chef Portrait',
      type: 'stock' as const,
      usage: 'About Section',
      isActive: true,
      source: 'Unsplash'
    },
    {
      id: 'restaurant-interior',
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800',
      name: 'Restaurant Interior',
      type: 'stock' as const,
      usage: 'Background Image',
      isActive: true,
      source: 'Unsplash'
    }
  ];

  // Group images by type
  const imagesByType = allImages.reduce((acc, image) => {
    if (!acc[image.type]) acc[image.type] = [];
    acc[image.type].push(image);
    return acc;
  }, {} as Record<string, ImageUsage[]>);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'menu-item': return <Package className="h-4 w-4" />;
      case 'location': return <MapPin className="h-4 w-4" />;
      case 'banner': return <ImageIcon className="h-4 w-4" />;
      case 'hero': return <Star className="h-4 w-4" />;
      case 'stock': return <ImageIcon className="h-4 w-4" />;
      default: return <ImageIcon className="h-4 w-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'menu-item': return 'bg-blue-100 text-blue-800';
      case 'location': return 'bg-green-100 text-green-800';
      case 'banner': return 'bg-purple-100 text-purple-800';
      case 'hero': return 'bg-yellow-100 text-yellow-800';
      case 'stock': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{allImages.length}</div>
                <div className="text-sm text-gray-600">Total Images</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {(imagesByType['menu-item'] || []).length}
                </div>
                <div className="text-sm text-gray-600">Menu Items</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {(imagesByType['hero'] || []).length + (imagesByType['banner'] || []).length}
                </div>
                <div className="text-sm text-gray-600">Banners & Heroes</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <ExternalLink className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {allImages.filter(img => img.source === 'Unsplash').length}
                </div>
                <div className="text-sm text-gray-600">Stock Photos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Images by Type */}
      {Object.entries(imagesByType).map(([type, images]) => (
        <Card key={type}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 capitalize">
              {getTypeIcon(type)}
              {type.replace('-', ' ')} Images
            </CardTitle>
            <p className="text-sm text-gray-600">{images.length} images in this category</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-100 relative overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {!image.isActive && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">Inactive</span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <Badge className={getTypeBadgeColor(image.type)}>
                        {image.type.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => window.open(image.url, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <h4 className="font-medium text-gray-900 text-sm truncate mb-1">{image.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{image.usage}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {image.source}
                      </Badge>
                      <Badge variant={image.isActive ? "secondary" : "destructive"} className="text-xs">
                        {image.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {allImages.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <div className="text-gray-500 mb-2">No images found</div>
          <div className="text-sm text-gray-400">Upload some images to get started</div>
        </div>
      )}
    </div>
  );
}