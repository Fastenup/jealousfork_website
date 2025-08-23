import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ImageManager } from './ImageManager';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, MapPin, Phone, Clock, Edit, Save, X } from 'lucide-react';

interface Location {
  id: number;
  name: string;
  slug: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone?: string;
  imageUrl?: string;
  heroImageUrl?: string;
  isActive: boolean;
  isMainLocation: boolean;
  operatingHours?: any;
  displayOrder: number;
}

export function LocationManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fetch locations
  const { data: locationsData, isLoading } = useQuery({
    queryKey: ['/api/admin/locations'],
  });

  const locations: Location[] = (locationsData as any)?.locations || [];

  // Create location mutation
  const createLocationMutation = useMutation({
    mutationFn: async (data: Partial<Location>) => {
      return apiRequest('/api/admin/locations', { method: 'POST', body: data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/locations'] });
      setShowCreateForm(false);
      toast({ title: "Location Created", description: "Location created successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Location",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update location mutation
  const updateLocationMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Location> & { id: number }) => {
      return apiRequest(`/api/admin/locations/${id}`, { method: 'PATCH', body: data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/locations'] });
      setEditingLocation(null);
      toast({ title: "Location Updated", description: "Location updated successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Location",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleImageUpdate = (locationId: number, imageUrl: string, type: 'main' | 'hero' = 'main') => {
    const updateData = type === 'main' ? { imageUrl } : { heroImageUrl: imageUrl };
    updateLocationMutation.mutate({ id: locationId, ...updateData });
  };

  const LocationForm = ({ location, onSave, onCancel }: {
    location?: Location;
    onSave: (data: any) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState({
      name: location?.name || '',
      slug: location?.slug || '',
      description: location?.description || '',
      address: location?.address || '',
      city: location?.city || '',
      state: location?.state || '',
      zipCode: location?.zipCode || '',
      phone: location?.phone || '',
      isActive: location?.isActive ?? true,
      isMainLocation: location?.isMainLocation ?? false,
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>{location ? 'Edit Location' : 'Create New Location'}</CardTitle>
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
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                Active
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isMainLocation}
                  onChange={(e) => setFormData({ ...formData, isMainLocation: e.target.checked })}
                />
                Main Location
              </label>
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
    return <div className="text-sm text-gray-500">Loading locations...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Location Management</h3>
          <p className="text-sm text-gray-600">Manage restaurant locations and their images</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Location
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <LocationForm
          onSave={(data) => createLocationMutation.mutate(data)}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Edit Form */}
      {editingLocation && (
        <LocationForm
          location={editingLocation}
          onSave={(data) => updateLocationMutation.mutate({ id: editingLocation.id, ...data })}
          onCancel={() => setEditingLocation(null)}
        />
      )}

      {/* Locations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {locations.map((location) => (
          <Card key={location.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{location.name}</CardTitle>
                  <div className="flex gap-2 mt-1">
                    {location.isMainLocation && (
                      <Badge variant="default">Main Location</Badge>
                    )}
                    {!location.isActive && (
                      <Badge variant="destructive">Inactive</Badge>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingLocation(location)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {location.description && (
                <p className="text-sm text-gray-600">{location.description}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {location.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{location.address}</span>
                  </div>
                )}
                {location.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{location.phone}</span>
                  </div>
                )}
              </div>

              {/* Main Image */}
              <div>
                <Label className="text-sm font-medium">Main Image</Label>
                <ImageManager
                  entityType="location"
                  entityId={location.id}
                  currentImageUrl={location.imageUrl}
                  onImageUpdate={(imageUrl) => handleImageUpdate(location.id, imageUrl, 'main')}
                />
              </div>

              {/* Hero Image */}
              <div>
                <Label className="text-sm font-medium">Hero Image</Label>
                <ImageManager
                  entityType="location"
                  entityId={location.id}
                  currentImageUrl={location.heroImageUrl}
                  onImageUpdate={(imageUrl) => handleImageUpdate(location.id, imageUrl, 'hero')}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {locations.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">No locations found</div>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Location
          </Button>
        </div>
      )}
    </div>
  );
}