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
}

interface MenuCategory {
  id: number;
  sectionId: number;
  name: string;
  description: string;
}

interface SquareItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
}

export default function MenuCategorizationPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  // Fetch menu sections
  const { data: sectionsData } = useQuery({
    queryKey: ['/api/admin/menu-sections'],
  });

  // Fetch categories for selected section
  const { data: categoriesData } = useQuery({
    queryKey: ['/api/admin/menu-categories', selectedSection],
    enabled: !!selectedSection,
  });

  // Fetch Square menu items
  const { data: menuData } = useQuery({
    queryKey: ['/api/menu'],
  });

  // Assign item to category mutation
  const assignMutation = useMutation({
    mutationFn: async ({ squareId, categoryId }: { squareId: string; categoryId: number }) => {
      return apiRequest('/api/admin/assign-item-category', {
        method: 'POST',
        body: { squareId, categoryId },
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Item assigned to category successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/menu'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to assign item",
        variant: "destructive",
      });
    },
  });

  const sections: MenuSection[] = sectionsData?.sections || [];
  const categories: MenuCategory[] = categoriesData?.categories || [];
  const menuItems: SquareItem[] = menuData?.items || [];

  const handleAssignItem = () => {
    if (!selectedItem || !selectedCategory) {
      toast({
        title: "Error",
        description: "Please select both an item and a category",
        variant: "destructive",
      });
      return;
    }

    assignMutation.mutate({
      squareId: selectedItem,
      categoryId: selectedCategory,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600 mb-4">
        Assign Square catalog items to menu sections and categories for proper organization in customer-facing menus.
      </div>

      {/* Section Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          1. Select Menu Section
        </label>
        <select
          value={selectedSection || ''}
          onChange={(e) => {
            const value = e.target.value ? parseInt(e.target.value) : null;
            setSelectedSection(value);
            setSelectedCategory(null);
          }}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">Choose a menu section...</option>
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.name} - {section.operatingDays} {section.operatingHours}
            </option>
          ))}
        </select>
      </div>

      {/* Category Selection */}
      {selectedSection && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            2. Select Category
          </label>
          <select
            value={selectedCategory || ''}
            onChange={(e) => {
              const value = e.target.value ? parseInt(e.target.value) : null;
              setSelectedCategory(value);
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Choose a category...</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name} - {category.description}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Item Selection */}
      {selectedCategory && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            3. Select Square Item to Categorize
          </label>
          <select
            value={selectedItem || ''}
            onChange={(e) => setSelectedItem(e.target.value || null)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Choose an item...</option>
            {menuItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} - ${item.price} 
                {item.category && ` (currently: ${item.category})`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Action Button */}
      {selectedItem && selectedCategory && (
        <div className="pt-4">
          <button
            onClick={handleAssignItem}
            disabled={assignMutation.isPending}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {assignMutation.isPending ? 'Assigning...' : 'Assign Item to Category'}
          </button>
        </div>
      )}

      {/* Current Assignments Display */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Current Menu Structure & All Square Items</h3>
        <div className="space-y-6">
          {/* Menu Structure */}
          {sections.map((section) => {
            const sectionCategories = categoriesData?.categories?.filter(
              (cat: MenuCategory) => cat.sectionId === section.id
            ) || [];
            
            return (
              <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{section.name}</h4>
                <p className="text-sm text-gray-600 mb-3">
                  {section.operatingDays} • {section.operatingHours}
                </p>
                <div className="space-y-2">
                  {sectionCategories.map((category) => {
                    const categoryItems = menuItems.filter(
                      (item) => item.category?.toLowerCase().includes(category.name.toLowerCase()) ||
                                category.name.toLowerCase().includes(item.category?.toLowerCase() || '')
                    );
                    
                    return (
                      <div key={category.id} className="ml-4">
                        <div className="font-medium text-sm text-gray-800">
                          {category.name} ({categoryItems.length} items)
                        </div>
                        {categoryItems.length > 0 && (
                          <div className="ml-4 text-xs text-gray-600">
                            {categoryItems.map(item => item.name).slice(0, 3).join(', ')}
                            {categoryItems.length > 3 && ` +${categoryItems.length - 3} more`}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* All Square Items for Categorization */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-medium mb-4">All Square API Items Available for Categorization</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-3">
                Total items from Square: {menuItems.length}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {menuItems.map((item) => (
                  <div key={item.id} className="bg-white rounded border border-gray-200 p-3">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-gray-600 truncate">{item.description}</div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm font-medium text-green-600">${item.price}</span>
                      <span className="text-xs text-gray-500">
                        {item.category || 'Uncategorized'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Info (Admin Only) */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Technical Information (Admin Only)</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div>Total Square Items: {menuItems.length}</div>
          <div>Menu Sections: {sections.length}</div>
          <div>Categories: {categories.length}</div>
          <div>Note: Technical details like Square IDs and sync status are hidden from customer-facing pages</div>
        </div>
      </div>
    </div>
  );
}