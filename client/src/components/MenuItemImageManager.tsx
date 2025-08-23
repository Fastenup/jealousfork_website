import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ImageManager } from './ImageManager';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface MenuItem {
  id: number;
  squareId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  category?: string;
}

export function MenuItemImageManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  // Fetch menu items
  const { data: menuData, isLoading } = useQuery({
    queryKey: ['/api/menu'],
  });

  const menuItems: MenuItem[] = (menuData as any)?.items || [];

  // Filter items based on search and featured status
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFeatured = !showFeaturedOnly || item.isFeatured;
    return matchesSearch && matchesFeatured;
  });

  const handleImageUpdate = (itemId: number, imageUrl: string) => {
    // Update local state if needed
    queryClient.invalidateQueries({ queryKey: ['/api/menu'] });
  };

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading menu items...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Menu Item Images</h3>
          <p className="text-sm text-gray-600">Manage images for all menu items</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
          <Button
            variant={showFeaturedOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Featured Only
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{menuItems.length}</div>
                <div className="text-sm text-gray-600">Total Items</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Badge className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {menuItems.filter(item => item.isFeatured).length}
                </div>
                <div className="text-sm text-gray-600">Featured</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Badge className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {menuItems.filter(item => item.imageUrl).length}
                </div>
                <div className="text-sm text-gray-600">With Images</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base truncate">{item.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                </div>
                <div className="flex flex-col items-end gap-1 ml-3">
                  <span className="text-lg font-bold text-green-600">${item.price}</span>
                  <div className="flex gap-1">
                    {item.isFeatured && (
                      <Badge variant="secondary" className="text-xs">Featured</Badge>
                    )}
                    {!item.isAvailable && (
                      <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <ImageManager
                entityType="menu-item"
                entityId={item.id}
                currentImageUrl={item.imageUrl}
                onImageUpdate={(imageUrl) => handleImageUpdate(item.id, imageUrl)}
              />
              
              {item.squareId && (
                <div className="mt-3 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded text-center">
                  Square ID: {item.squareId.slice(-8)}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">No menu items found</div>
          <div className="text-sm text-gray-400">
            {searchTerm ? 'Try adjusting your search terms' : 'No items match your current filters'}
          </div>
        </div>
      )}
    </div>
  );
}