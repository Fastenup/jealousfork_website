import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface MenuSection {
  id: number;
  name: string;
  description: string;
  operatingHours: string;
  operatingDays: string;
  displayOrder: number;
  isActive: boolean;
}

interface MenuCategory {
  id: number;
  sectionId: number;
  name: string;
  description: string;
  displayOrder: number;
}

export default function MenuSectionManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [editingSection, setEditingSection] = useState<MenuSection | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [showCreateSection, setShowCreateSection] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState<number | null>(null);

  // Query sections
  const { data: sectionsData, isLoading: sectionsLoading } = useQuery({
    queryKey: ['/api/admin/menu-sections'],
  });

  // Query categories
  const { data: categoriesData } = useQuery({
    queryKey: ['/api/admin/menu-categories'],
  });

  const sections = sectionsData?.sections || [];
  const categories = categoriesData?.categories || [];

  // Create section mutation
  const createSectionMutation = useMutation({
    mutationFn: async (data: Partial<MenuSection>) => {
      return apiRequest('/api/admin/menu-sections', { method: 'POST', body: data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/menu-sections'] });
      setShowCreateSection(false);
      toast({ title: "Section Created", description: "Menu section created successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Section",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update section mutation
  const updateSectionMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<MenuSection> & { id: number }) => {
      return apiRequest(`/api/admin/menu-sections/${id}`, { method: 'PATCH', body: data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/menu-sections'] });
      setEditingSection(null);
      toast({ title: "Section Updated", description: "Menu section updated successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Section",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete section mutation
  const deleteSectionMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/menu-sections/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/menu-sections'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/menu-categories'] });
      toast({ title: "Section Deleted", description: "Menu section and associated categories deleted" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Delete Section",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (data: Partial<MenuCategory>) => {
      return apiRequest('/api/admin/menu-categories', { method: 'POST', body: data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/menu-categories'] });
      setShowCreateCategory(null);
      toast({ title: "Category Created", description: "Menu category created successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Category",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<MenuCategory> & { id: number }) => {
      return apiRequest(`/api/admin/menu-categories/${id}`, { method: 'PATCH', body: data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/menu-categories'] });
      setEditingCategory(null);
      toast({ title: "Category Updated", description: "Menu category updated successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Category",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/admin/menu-categories/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/menu-categories'] });
      toast({ title: "Category Deleted", description: "Menu category deleted successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Delete Category",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateSection = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      operatingHours: formData.get('operatingHours') as string,
      operatingDays: formData.get('operatingDays') as string,
    };
    createSectionMutation.mutate(data);
  };

  const handleUpdateSection = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSection) return;
    
    const formData = new FormData(e.currentTarget);
    const data = {
      id: editingSection.id,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      operatingHours: formData.get('operatingHours') as string,
      operatingDays: formData.get('operatingDays') as string,
    };
    updateSectionMutation.mutate(data);
  };

  const handleCreateCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (showCreateCategory === null) return;
    
    const formData = new FormData(e.currentTarget);
    const data = {
      sectionId: showCreateCategory,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
    };
    createCategoryMutation.mutate(data);
  };

  const handleUpdateCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCategory) return;
    
    const formData = new FormData(e.currentTarget);
    const data = {
      id: editingCategory.id,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
    };
    updateCategoryMutation.mutate(data);
  };

  if (sectionsLoading) {
    return <div className="text-center py-4">Loading sections...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Menu Structure Management</h3>
        <button
          onClick={() => setShowCreateSection(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Section
        </button>
      </div>

      {/* Create Section Form */}
      {showCreateSection && (
        <div className="bg-gray-50 rounded-lg p-4 border">
          <h4 className="font-medium mb-3">Create New Section</h4>
          <form onSubmit={handleCreateSection} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                name="name"
                placeholder="Section Name"
                required
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                name="operatingHours"
                placeholder="Operating Hours (e.g., 9:00 AM - 3:00 PM)"
                required
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                name="operatingDays"
                placeholder="Operating Days (e.g., Tuesday - Sunday)"
                required
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                name="description"
                placeholder="Description"
                className="px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={createSectionMutation.isPending}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {createSectionMutation.isPending ? 'Creating...' : 'Create Section'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateSection(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sections List */}
      <div className="space-y-4">
        {sections.map((section: MenuSection) => {
          const sectionCategories = categories.filter((cat: MenuCategory) => cat.sectionId === section.id);
          
          return (
            <div key={section.id} className="border border-gray-200 rounded-lg p-4">
              {/* Section Header */}
              {editingSection?.id === section.id ? (
                <form onSubmit={handleUpdateSection} className="space-y-3 mb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      name="name"
                      defaultValue={section.name}
                      required
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      name="operatingHours"
                      defaultValue={section.operatingHours}
                      required
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      name="operatingDays"
                      defaultValue={section.operatingDays}
                      required
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      name="description"
                      defaultValue={section.description}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={updateSectionMutation.isPending}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                      {updateSectionMutation.isPending ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingSection(null)}
                      className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900">{section.name}</h4>
                    <p className="text-sm text-gray-600">{section.description}</p>
                    <p className="text-xs text-gray-500">{section.operatingDays} • {section.operatingHours}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingSection(section)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSectionMutation.mutate(section.id)}
                      disabled={deleteSectionMutation.isPending}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}

              {/* Categories */}
              <div className="border-t pt-3">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="text-sm font-medium text-gray-700">Categories ({sectionCategories.length})</h5>
                  <button
                    onClick={() => setShowCreateCategory(section.id)}
                    className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Add Category
                  </button>
                </div>

                {/* Create Category Form */}
                {showCreateCategory === section.id && (
                  <div className="bg-blue-50 rounded p-3 mb-3">
                    <form onSubmit={handleCreateCategory} className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          name="name"
                          placeholder="Category Name"
                          required
                          className="px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                        <input
                          name="description"
                          placeholder="Description"
                          className="px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={createCategoryMutation.isPending}
                          className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                        >
                          {createCategoryMutation.isPending ? 'Creating...' : 'Create'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCreateCategory(null)}
                          className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Categories List */}
                <div className="space-y-2">
                  {sectionCategories.map((category: MenuCategory) => (
                    <div key={category.id} className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
                      {editingCategory?.id === category.id ? (
                        <form onSubmit={handleUpdateCategory} className="flex-1 flex gap-2">
                          <input
                            name="name"
                            defaultValue={category.name}
                            required
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                          />
                          <input
                            name="description"
                            defaultValue={category.description}
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                          />
                          <button
                            type="submit"
                            disabled={updateCategoryMutation.isPending}
                            className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCategory(null)}
                            className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <>
                          <div>
                            <span className="text-sm font-medium">{category.name}</span>
                            {category.description && (
                              <span className="text-xs text-gray-500 ml-2">- {category.description}</span>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => setEditingCategory(category)}
                              className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteCategoryMutation.mutate(category.id)}
                              disabled={deleteCategoryMutation.isPending}
                              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}