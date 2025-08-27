import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Check,
  Search,
  Star
} from 'lucide-react';

interface PhotoManagerProps {
  type: 'menu-items' | 'banners' | 'gallery';
  title: string;
  description?: string;
}

export function SimplePhotoManager({ type, title, description }: PhotoManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Get items based on type
  const { data, isLoading } = useQuery({
    queryKey: type === 'menu-items' ? ['/api/featured-items'] : 
              type === 'banners' ? ['/api/admin/banners'] :
              ['/api/admin/gallery']
  });

  const items = type === 'menu-items' ? (data as any)?.items || [] :
               type === 'banners' ? (data as any)?.banners || [] :
               (data as any)?.images || [];

  console.log(`${type} data:`, data);

  // Filter items
  const filteredItems = items.filter((item: any) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Simple file upload
  const handleFileUpload = async (file: File, targetItem?: any) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 10MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      // Get upload URL from the backend
      const { uploadURL } = await apiRequest('/api/objects/upload', { method: 'POST' });

      // Upload file directly to object storage
      const uploadResponse = await fetch(uploadURL, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      // Update item image with the uploaded URL
      if (targetItem) {
        await updateItemImage(targetItem, uploadResponse.url);
      }

      toast({
        title: "Upload successful",
        description: "Image uploaded and assigned successfully"
      });

    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Update item image via URL
  const updateItemImage = async (item: any, imageUrl: string) => {
    try {
      const endpoint = type === 'menu-items' ? `/api/featured-items/${item.localId}/image` :
                      type === 'banners' ? `/api/admin/banners/${item.id}` :
                      `/api/admin/gallery/${item.id}`;

      await apiRequest(endpoint, {
        method: 'PATCH',
        body: { imageUrl }
      });

      // Refresh data
      queryClient.invalidateQueries({ 
        queryKey: type === 'menu-items' ? ['/api/featured-items'] : 
                  type === 'banners' ? ['/api/admin/banners'] :
                  ['/api/admin/gallery']
      });

    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Handle URL assignment
  const handleUrlAssignment = async (item: any) => {
    if (!urlInput.trim()) return;
    await updateItemImage(item, urlInput.trim());
    setUrlInput('');
    setShowUrlInput(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-gray-500">Loading {title.toLowerCase()}...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="flex items-center gap-2"
          >
            <LinkIcon className="w-4 h-4" />
            Add URL
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload
          </Button>
        </div>
      </div>

      {/* URL Input */}
      {showUrlInput && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder="https://images.unsplash.com/photo-..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" onClick={() => setShowUrlInput(false)}>Cancel</Button>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              Click "Use URL" next to any item below to assign this image
            </p>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={`Search ${title.toLowerCase()}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item: any) => (
          <Card key={item.localId || item.id} className="overflow-hidden">
            {/* Image Display */}
            <div className="aspect-video bg-gray-100 flex items-center justify-center relative group">
              {(item.image || item.imageUrl) ? (
                <img
                  src={item.image || item.imageUrl}
                  alt={item.name || item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="h-12 w-12 text-gray-400" />
              )}
              
              {/* Upload Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleFileUpload(file, item);
                    };
                    input.click();
                  }}
                  disabled={isUploading}
                >
                  <Upload className="w-3 h-3" />
                </Button>
                
                {showUrlInput && urlInput && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleUrlAssignment(item)}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Item Info */}
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {item.name || item.title}
                  </h4>
                  {item.description && (
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {item.description}
                    </p>
                  )}
                  {item.price && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-green-600">
                        ${item.price}
                      </span>
                      {item.isFeatured && (
                        <Badge variant="secondary" className="text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleFileUpload(file, item);
                    };
                    input.click();
                  }}
                  disabled={isUploading}
                  className="flex-1"
                >
                  Change Image
                </Button>
                
                {showUrlInput && urlInput && (
                  <Button
                    size="sm"
                    onClick={() => handleUrlAssignment(item)}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Use URL
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No items found' : `No ${title.toLowerCase()} yet`}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : `Start by ${type === 'menu-items' ? 'featuring some menu items' : 'adding some images'}`
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={false}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
      />

      {/* Loading Indicator */}
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Uploading image...</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}