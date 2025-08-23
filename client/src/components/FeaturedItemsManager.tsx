import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Star, Search, DollarSign, Package } from 'lucide-react';

interface MenuItem {
  id: number;
  localId: number;
  squareId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  category?: string;
  stockLevel?: number;
}

export function FeaturedItemsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch featured items
  const { data: featuredData, isLoading } = useQuery({
    queryKey: ['/api/featured-items'],
  });

  const featuredItems: MenuItem[] = (featuredData as any)?.items || [];

  // Fetch all menu items for selection
  const { data: allMenuData } = useQuery({
    queryKey: ['/api/menu'],
  });

  const allMenuItems: MenuItem[] = (allMenuData as any)?.items || [];

  // Filter items for search
  const filteredItems = allMenuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle featured status
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ itemId, featured }: { itemId: number; featured: boolean }) => {
      return apiRequest(`/api/featured-items/${itemId}`, {
        method: featured ? 'POST' : 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/featured-items'] });
      queryClient.invalidateQueries({ queryKey: ['/api/menu'] });
      toast({
        title: "Featured Status Updated",
        description: "Item featured status has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Featured Status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle stock status
  const toggleStockMutation = useMutation({
    mutationFn: async ({ itemId, inStock }: { itemId: number; inStock: boolean }) => {
      return apiRequest(`/api/featured-items/${itemId}/stock`, {
        method: 'PATCH',
        body: { inStock },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/featured-items'] });
      queryClient.invalidateQueries({ queryKey: ['/api/menu'] });
      toast({
        title: "Stock Status Updated",
        description: "Item stock status has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Stock Status",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleToggleFeatured = (item: MenuItem) => {
    toggleFeaturedMutation.mutate({
      itemId: item.localId,
      featured: !item.isFeatured
    });
  };

  const handleToggleStock = (item: MenuItem) => {
    toggleStockMutation.mutate({
      itemId: item.localId,
      inStock: !item.isAvailable
    });
  };

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading featured items...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Featured Items Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{featuredItems.filter(item => item.isFeatured).length}</div>
                <div className="text-sm text-gray-600">Featured Items</div>
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
                  {featuredItems.filter(item => item.isFeatured && item.isAvailable).length}
                </div>
                <div className="text-sm text-gray-600">In Stock</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{allMenuItems.length}</div>
                <div className="text-sm text-gray-600">Total Items</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Featured Items */}
      <Card>
        <CardHeader>
          <CardTitle>Current Featured Items</CardTitle>
          <p className="text-sm text-gray-600">These items appear on the homepage and are promoted to customers</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredItems.filter(item => item.isFeatured).map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                    <span className="text-lg font-bold text-green-600">${item.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={item.isAvailable}
                        onCheckedChange={() => handleToggleStock(item)}
                        disabled={toggleStockMutation.isPending}
                      />
                      <span className="text-sm text-gray-600">
                        {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleFeatured(item)}
                      disabled={toggleFeaturedMutation.isPending}
                    >
                      Remove
                    </Button>
                  </div>
                  
                  {item.squareId && (
                    <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded text-center">
                      Square: {item.squareId.slice(-8)}
                      {typeof item.stockLevel !== 'undefined' && (
                        <span className="ml-2">Stock: {item.stockLevel}</span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {featuredItems.filter(item => item.isFeatured).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No featured items yet. Select items below to feature them.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Featured Items */}
      <Card>
        <CardHeader>
          <CardTitle>Add Featured Items</CardTitle>
          <p className="text-sm text-gray-600">Search and select items to feature on the homepage</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search menu items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.filter(item => !item.isFeatured).map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                    <span className="text-lg font-bold text-green-600">${item.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant={item.isAvailable ? "secondary" : "destructive"}>
                      {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => handleToggleFeatured(item)}
                      disabled={toggleFeaturedMutation.isPending}
                    >
                      <Star className="h-4 w-4 mr-1" />
                      Feature
                    </Button>
                  </div>
                  
                  {item.squareId && (
                    <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded text-center">
                      Square: {item.squareId.slice(-8)}
                      {typeof item.stockLevel !== 'undefined' && (
                        <span className="ml-2">Stock: {item.stockLevel}</span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredItems.filter(item => !item.isFeatured).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No items match your search' : 'All items are already featured'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}