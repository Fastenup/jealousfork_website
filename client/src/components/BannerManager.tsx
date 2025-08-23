import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ImageManager } from './ImageManager';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Image as ImageIcon, Edit, Save, X } from 'lucide-react';

interface BannerImage {
  id: number;
  name: string;
  description?: string;
  imageUrl: string;
  altText?: string;
  isActive: boolean;
  displayOrder: number;
  usage: string; // 'hero', 'section', 'background', etc.
}

export function BannerManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingBanner, setEditingBanner] = useState<BannerImage | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fetch banner images
  const { data: bannersData, isLoading } = useQuery({
    queryKey: ['/api/admin/banners'],
  });

  const banners: BannerImage[] = (bannersData as any)?.banners || [];

  // Create banner mutation
  const createBannerMutation = useMutation({
    mutationFn: async (data: Partial<BannerImage>) => {
      return apiRequest('/api/admin/banners', { method: 'POST', body: data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/banners'] });
      setShowCreateForm(false);
      toast({ title: "Banner Created", description: "Banner created successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Banner",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update banner mutation
  const updateBannerMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<BannerImage> & { id: number }) => {
      return apiRequest(`/api/admin/banners/${id}`, { method: 'PATCH', body: data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/banners'] });
      setEditingBanner(null);
      toast({ title: "Banner Updated", description: "Banner updated successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Banner",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleImageUpdate = (bannerId: number, imageUrl: string) => {
    updateBannerMutation.mutate({ id: bannerId, imageUrl });
  };

  const BannerForm = ({ banner, onSave, onCancel }: {
    banner?: BannerImage;
    onSave: (data: any) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: banner?.name || '',
      description: banner?.description || '',
      altText: banner?.altText || '',
      usage: banner?.usage || 'hero',
      isActive: banner?.isActive ?? true,
      displayOrder: banner?.displayOrder || 1,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>{banner ? 'Edit Banner' : 'Create New Banner'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="usage">Usage</Label>
                <select
                  id="usage"
                  value={formData.usage}
                  onChange={(e) => setFormData({ ...formData, usage: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="hero">Hero Section</option>
                  <option value="section">Section Background</option>
                  <option value="banner">Page Banner</option>
                  <option value="promotional">Promotional</option>
                  <option value="gallery">Gallery</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="altText">Alt Text (for accessibility)</Label>
              <Input
                id="altText"
                value={formData.altText}
                onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                placeholder="Describe the image for screen readers"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                  min="1"
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading banners...</div>;
  }

  // Group banners by usage
  const bannersByUsage = banners.reduce((acc, banner) => {
    if (!acc[banner.usage]) acc[banner.usage] = [];
    acc[banner.usage].push(banner);
    return acc;
  }, {} as Record<string, BannerImage[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Banner & Photo Management</h3>
          <p className="text-sm text-gray-600">Manage banners, hero images, and promotional photos</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Banner
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{banners.length}</div>
                <div className="text-sm text-gray-600">Total Banners</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {banners.filter(b => b.isActive).length}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {(bannersByUsage.hero || []).length}
                </div>
                <div className="text-sm text-gray-600">Hero Images</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {Object.keys(bannersByUsage).length}
                </div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <BannerForm
          onSave={(data) => createBannerMutation.mutate(data)}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Edit Form */}
      {editingBanner && (
        <BannerForm
          banner={editingBanner}
          onSave={(data) => updateBannerMutation.mutate({ id: editingBanner.id, ...data })}
          onCancel={() => setEditingBanner(null)}
        />
      )}

      {/* Banners by Usage */}
      {Object.entries(bannersByUsage).map(([usage, usageBanners]) => (
        <Card key={usage}>
          <CardHeader>
            <CardTitle className="capitalize">{usage} Images</CardTitle>
            <p className="text-sm text-gray-600">{usageBanners.length} images in this category</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {usageBanners.map((banner) => (
                <Card key={banner.id} className="overflow-hidden">
                  <div className="aspect-video bg-gray-100 relative">
                    <img
                      src={banner.imageUrl}
                      alt={banner.altText || banner.name}
                      className="w-full h-full object-cover"
                    />
                    {!banner.isActive && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-medium">Inactive</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">{banner.name}</h4>
                        {banner.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{banner.description}</p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingBanner(banner)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <ImageManager
                      entityType="location"
                      entityId={banner.id}
                      currentImageUrl={banner.imageUrl}
                      onImageUpdate={(imageUrl) => handleImageUpdate(banner.id, imageUrl)}
                      className="mt-3"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {banners.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">No banners found</div>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Banner
          </Button>
        </div>
      )}
    </div>
  );
}