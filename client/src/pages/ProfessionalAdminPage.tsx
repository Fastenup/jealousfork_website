import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLogin from '@/components/AdminLogin';
import { LocationManager } from '@/components/LocationManager';
import { FeaturedItemsManager } from '@/components/FeaturedItemsManager';
import { SimplePhotoManager } from '@/components/SimplePhotoManager';
import { FolderUploadManager } from '@/components/FolderUploadManager';
import SquareStatusIndicator from '@/components/SquareStatusIndicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  LogOut,
  Images,
  MapPin,
  Square,
  Users,
  Database,
  Activity,
  AlertCircle,
  Star,
  Layout,
  Grid,
  RefreshCw,
  FolderUp
} from 'lucide-react';
import { ManualSyncButton } from '@/components/ManualSyncButton';

export default function ProfessionalAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_authenticated') === 'true';
  });
  const [showLogin, setShowLogin] = useState(() => {
    return localStorage.getItem('admin_authenticated') !== 'true';
  });

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'jealous2025';

  const handleAdminLogin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setShowLogin(false);
      localStorage.setItem('admin_authenticated', 'true');
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    setShowLogin(true);
    localStorage.removeItem('admin_authenticated');
  };

  // Test Square API connection
  const { data: testResult, isLoading: testLoading } = useQuery({
    queryKey: ['/api/test-square'],
    queryFn: async () => {
      const response = await fetch('/api/test-square', { method: 'POST' });
      return response.json();
    },
    enabled: isAuthenticated,
    refetchInterval: false // Disable automatic polling
  });

  // Fetch featured items count
  const { data: featuredData } = useQuery({
    queryKey: ['/api/featured-items'],
    enabled: isAuthenticated
  });

  // Fetch menu items count
  const { data: menuData } = useQuery({
    queryKey: ['/api/menu'],
    enabled: isAuthenticated
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Settings className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Jealous Fork Admin</h1>
            <p className="text-gray-600">Professional Restaurant Management</p>
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

  const featuredCount = (featuredData as any)?.items?.filter((item: any) => item.featured).length || 0;
  const menuItemsCount = (menuData as any)?.items?.length || 0;
  const menuItemsWithImages = (menuData as any)?.items?.filter((item: any) => item.imageUrl).length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Restaurant Admin</h1>
                <p className="text-sm text-gray-600">Jealous Fork Management Console</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Activity className="w-3 h-3 mr-1" />
                Online
              </Badge>
              <ManualSyncButton />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAdminLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Featured Items</p>
                  <p className="text-2xl font-bold text-gray-900">{featuredCount}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Square className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Menu Items</p>
                  <p className="text-2xl font-bold text-gray-900">{menuItemsCount}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Items with Images</p>
                  <p className="text-2xl font-bold text-gray-900">{menuItemsWithImages}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Images className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Square API</p>
                  <p className={`text-sm font-medium ${testResult?.success ? 'text-green-600' : 'text-red-600'}`}>
                    {testLoading ? 'Checking...' : testResult?.success ? 'Connected' : 'Error'}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  testResult?.success ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {testResult?.success ? (
                    <Square className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Square API Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Square className="w-5 h-5" />
              Square API Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SquareStatusIndicator />
            
            {testResult && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Connection Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant={testResult.success ? "secondary" : "destructive"}>
                      {testResult.success ? 'Connected' : 'Failed'}
                    </Badge>
                    <span className="text-gray-600">
                      Environment: {process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}
                    </span>
                  </div>
                  {testResult.locations && (
                    <div className="text-gray-600">
                      Location: {testResult.locations[0]?.name} ({testResult.locations[0]?.id?.slice(-8)})
                    </div>
                  )}
                  {testResult.error && (
                    <div className="text-red-600">{testResult.error}</div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="folder-upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="folder-upload" className="flex items-center gap-2">
              <FolderUp className="w-4 h-4" />
              Folder Upload
            </TabsTrigger>
            <TabsTrigger value="featured-items" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Featured
            </TabsTrigger>
            <TabsTrigger value="menu-images" className="flex items-center gap-2">
              <Images className="w-4 h-4" />
              Menu Images
            </TabsTrigger>
            <TabsTrigger value="banners" className="flex items-center gap-2">
              <Layout className="w-4 h-4" />
              Banners
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Grid className="w-4 h-4" />
              Gallery
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Locations
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="folder-upload" className="space-y-6">
            <FolderUploadManager />
          </TabsContent>

          <TabsContent value="featured-items" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Featured Items Management</CardTitle>
                <p className="text-sm text-gray-600">
                  Manage featured items on the homepage with real-time Square API stock synchronization.
                </p>
              </CardHeader>
              <CardContent>
                <FeaturedItemsManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu-images" className="space-y-6">
            <SimplePhotoManager 
              type="menu-items"
              title="Menu Item Photos"
              description="Easily upload or add photos to featured menu items"
            />
          </TabsContent>

          <TabsContent value="banners" className="space-y-6">
            <SimplePhotoManager 
              type="banners"
              title="Banner Images"
              description="Manage hero banners and promotional images"
            />
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <SimplePhotoManager 
              type="gallery"
              title="Photo Gallery"
              description="Manage all website photos and uploaded content"
            />
          </TabsContent>

          <TabsContent value="locations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Location Management</CardTitle>
                <p className="text-sm text-gray-600">
                  Manage restaurant locations, contact information, and location-specific images.
                </p>
              </CardHeader>
              <CardContent>
                <LocationManager />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Environment</span>
                      <Badge variant="outline">
                        {process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Database</span>
                      <Badge variant="secondary">PostgreSQL</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Object Storage</span>
                      <Badge variant="secondary">Google Cloud Storage</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Payment Processing</span>
                      <Badge variant="secondary">Square API</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="w-4 h-4 mr-2" />
                    Sync Menu with Square
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="w-4 h-4 mr-2" />
                    Test All Integrations
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}