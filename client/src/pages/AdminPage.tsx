import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLogin from '@/components/AdminLogin';
import FeaturedItemsAdmin from '@/components/FeaturedItemsAdmin';
import SquareStatusIndicator from '@/components/SquareStatusIndicator';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  // Admin password
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'jealous2025';

  const handleAdminLogin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setShowLogin(false);
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    setShowLogin(true);
  };

  // Fetch all Square menu items for verification
  const { data: squareMenu, isLoading: menuLoading } = useQuery({
    queryKey: ['/api/menu'],
    enabled: isAuthenticated
  });

  // Fetch menu synchronization data
  const { data: syncData, isLoading: syncLoading } = useQuery({
    queryKey: ['menu-sync'],
    queryFn: async () => {
      const { syncWithSquare } = await import('@/data/squareMenuMapping');
      return syncWithSquare();
    },
    enabled: isAuthenticated
  });

  // Test Square API connection
  const { data: testResult, isLoading: testLoading } = useQuery({
    queryKey: ['/api/test-square'],
    queryFn: async () => {
      const response = await fetch('/api/test-square', { method: 'POST' });
      return response.json();
    },
    enabled: isAuthenticated,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Jealous Fork Admin</h1>
            <p className="text-gray-600">Restaurant Management Portal</p>
          </div>
          
          {showLogin && (
            <AdminLogin 
              onLogin={handleAdminLogin}
              onCancel={() => window.history.back()}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Jealous Fork Admin Panel</h1>
              <p className="text-sm text-gray-600">Restaurant management and Square API integration</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-green-600 font-medium">✓ Authenticated</div>
              <button
                onClick={handleAdminLogout}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Square API Status & Testing */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Square API Status</h2>
            
            <div className="space-y-4">
              <SquareStatusIndicator />
              
              {testResult && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Connection Test Results</h3>
                  <div className="text-sm space-y-1">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {testResult.success ? 'Connected' : 'Failed'}
                    </div>
                    {testResult.success && testResult.locations && (
                      <div className="mt-2">
                        <div className="font-medium">Location Details:</div>
                        {testResult.locations.map((location: any) => (
                          <div key={location.id} className="text-xs text-gray-600 mt-1">
                            <div><strong>Name:</strong> {location.name}</div>
                            <div><strong>ID:</strong> {location.id}</div>
                            <div><strong>Status:</strong> {location.status}</div>
                            <div><strong>Phone:</strong> {location.phone_number}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {testResult.error && (
                      <div className="text-red-600 text-xs mt-1">{testResult.error}</div>
                    )}
                  </div>
                </div>
              )}
              
              {testLoading && (
                <div className="text-sm text-gray-500">Testing connection...</div>
              )}
            </div>
          </div>

          {/* Square Menu Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Square Menu Items</h2>
            
            {menuLoading ? (
              <div className="text-sm text-gray-500">Loading menu items...</div>
            ) : squareMenu ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <div><strong>Source:</strong> {(squareMenu as any).source}</div>
                  <div><strong>Items Found:</strong> {(squareMenu as any).items?.length || 0}</div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {(squareMenu as any).items && (squareMenu as any).items.length > 0 ? (
                    <div className="space-y-3">
                      {(squareMenu as any).items.map((item: any) => (
                        <div key={item.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm font-medium text-green-600">${item.price}</span>
                            <span className="text-xs text-gray-500">ID: {item.id}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            Category: {item.category} | Stock: {item.inStock ? 'Available' : 'Out of Stock'}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 p-4 text-center border border-gray-200 rounded-lg">
                      No menu items found in Square catalog
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm text-red-600">Failed to load menu items</div>
            )}
          </div>
        </div>

        {/* Featured Items Management */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Items Management</h2>
            <p className="text-gray-600 text-sm mb-6">
              Control which items appear as featured on the homepage. Changes apply immediately.
            </p>
            
            <FeaturedItemsAdmin onClose={() => {}} embedded={true} />
          </div>
        </div>
      </div>
    </div>
  );
}