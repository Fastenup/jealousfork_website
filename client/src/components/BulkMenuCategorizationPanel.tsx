import { useState, useMemo } from 'react';
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
  inStock: boolean;
}

interface Assignment {
  squareId: string;
  categoryId: number;
}

export default function BulkMenuCategorizationPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [targetCategory, setTargetCategory] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all data
  const { data: sectionsData } = useQuery({ queryKey: ['/api/admin/menu-sections'] });
  const { data: categoriesData } = useQuery({ queryKey: ['/api/admin/menu-categories'] });
  const { data: menuData } = useQuery({ queryKey: ['/api/menu'] });
  const { data: assignmentsData } = useQuery({ queryKey: ['/api/admin/item-assignments'] });

  const sections: MenuSection[] = (sectionsData as any)?.sections || [];
  const categories: MenuCategory[] = (categoriesData as any)?.categories || [];
  const menuItems: SquareItem[] = (menuData as any)?.items || [];
  const assignments: { [key: string]: number } = (assignmentsData as any)?.assignments || {};

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    let items = menuItems.filter((item: SquareItem) => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterCategory) {
      items = items.filter((item: SquareItem) => assignments[item.id] === filterCategory);
    }

    return items;
  }, [menuItems, searchTerm, filterCategory, assignments]);

  // Bulk assignment mutation
  const bulkAssignMutation = useMutation({
    mutationFn: async (assignments: Assignment[]) => {
      return apiRequest('/api/admin/bulk-assign-categories', {
        method: 'POST',
        body: { assignments },
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Bulk Assignment Complete",
        description: data.message,
      });
      setSelectedItems([]);
      setTargetCategory(null);
      queryClient.invalidateQueries({ queryKey: ['/api/admin/item-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/menu'] });
    },
    onError: (error: any) => {
      toast({
        title: "Bulk Assignment Failed",
        description: error.message || "Failed to assign items",
        variant: "destructive",
      });
    },
  });

  // Remove assignment mutation
  const removeAssignmentMutation = useMutation({
    mutationFn: async (squareId: string) => {
      return apiRequest(`/api/admin/item-assignments/${squareId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      toast({
        title: "Assignment Removed",
        description: "Item removed from category",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/item-assignments'] });
    },
    onError: (error: any) => {
      toast({
        title: "Remove Failed",
        description: error.message || "Failed to remove assignment",
        variant: "destructive",
      });
    },
  });

  const handleItemSelection = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleSelectAll = () => {
    const allFilteredIds = filteredItems.map((item: SquareItem) => item.id);
    setSelectedItems(allFilteredIds);
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
  };

  const handleBulkAssign = () => {
    if (!targetCategory || selectedItems.length === 0) {
      toast({
        title: "Error",
        description: "Please select items and a target category",
        variant: "destructive",
      });
      return;
    }

    const assignments: Assignment[] = selectedItems.map(squareId => ({
      squareId,
      categoryId: targetCategory,
    }));

    bulkAssignMutation.mutate(assignments);
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((cat: MenuCategory) => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const getSectionName = (sectionId: number) => {
    const section = sections.find((sec: MenuSection) => sec.id === sectionId);
    return section ? section.name : 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Bulk Menu Categorization</h3>
        <p className="text-sm text-blue-700">
          Select multiple items and assign them to categories in bulk. Use filters to find specific items or view current assignments.
        </p>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search Items</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or description..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        {/* Filter by Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
          <select
            value={filterCategory || ''}
            onChange={(e) => setFilterCategory(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">All Items</option>
            <option value="0">Unassigned Items</option>
            {categories.map((category: MenuCategory) => (
              <option key={category.id} value={category.id}>
                {getSectionName(category.sectionId)} → {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Target Category for Assignment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Category</label>
          <select
            value={targetCategory || ''}
            onChange={(e) => setTargetCategory(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">Choose target category...</option>
            {categories.map((category: MenuCategory) => (
              <option key={category.id} value={category.id}>
                {getSectionName(category.sectionId)} → {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selection Controls */}
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <div className="flex gap-3">
          <button
            onClick={handleSelectAll}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Select All ({filteredItems.length})
          </button>
          <button
            onClick={handleClearSelection}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Clear Selection
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {selectedItems.length} items selected
          </span>
          <button
            onClick={handleBulkAssign}
            disabled={!targetCategory || selectedItems.length === 0 || bulkAssignMutation.isPending}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {bulkAssignMutation.isPending ? 'Assigning...' : `Assign ${selectedItems.length} Items`}
          </button>
        </div>
      </div>

      {/* Items Grid */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b bg-gray-50">
          <h4 className="font-medium text-gray-900">
            Square Menu Items ({filteredItems.length})
          </h4>
          <p className="text-sm text-gray-600">
            Select items to assign to categories. Click the X to remove existing assignments.
          </p>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredItems.map((item: SquareItem) => {
              const isSelected = selectedItems.includes(item.id);
              const currentCategoryId = assignments[item.id];
              const currentCategory = currentCategoryId ? getCategoryName(currentCategoryId) : null;

              return (
                <div
                  key={item.id}
                  className={`border rounded-lg p-3 transition-colors ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleItemSelection(item.id, e.target.checked)}
                      className="mt-1"
                    />
                    {currentCategory && (
                      <button
                        onClick={() => removeAssignmentMutation.mutate(item.id)}
                        className="text-red-500 hover:text-red-700 text-xs"
                        title="Remove from category"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="font-medium text-sm text-gray-900 mb-1">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {item.description}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-600">
                      ${item.price}
                    </span>
                    <div className="text-xs">
                      {currentCategory ? (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {currentCategory}
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Unassigned
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-lg font-semibold text-blue-900">{menuItems.length}</div>
          <div className="text-sm text-blue-700">Total Items</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-lg font-semibold text-green-900">{Object.keys(assignments).length}</div>
          <div className="text-sm text-green-700">Assigned</div>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg">
          <div className="text-lg font-semibold text-orange-900">
            {menuItems.length - Object.keys(assignments).length}
          </div>
          <div className="text-sm text-orange-700">Unassigned</div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="text-lg font-semibold text-purple-900">{categories.length}</div>
          <div className="text-sm text-purple-700">Categories</div>
        </div>
      </div>
    </div>
  );
}