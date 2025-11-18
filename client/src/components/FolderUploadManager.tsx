import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  FolderUp,
  RefreshCw,
  CheckCircle2,
  XCircle,
  FileImage,
  Info,
  Play,
  Book
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface UploadStatus {
  count: number;
  files: Array<{
    filename: string;
    size: number;
    mapping: {
      filename: string;
      type: string;
      target?: string;
      productId?: number;
      slug?: string;
    };
  }>;
}

interface NamingGuide {
  title: string;
  patterns: Array<{
    pattern: string;
    description: string;
    example: string;
    destination: string;
    validIds?: string;
    validSlugs?: string[];
  }>;
  products: Array<{
    id: number;
    slug: string;
    patterns: string[];
  }>;
}

export function FolderUploadManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResults, setLastResults] = useState<any>(null);

  // Fetch upload folder status
  const { data: uploadStatus, isLoading: statusLoading, refetch: refetchStatus } = useQuery<UploadStatus>({
    queryKey: ['/api/images/upload-status'],
    refetchInterval: 5000 // Auto-refresh every 5 seconds
  });

  // Fetch naming guide
  const { data: namingGuide } = useQuery<NamingGuide>({
    queryKey: ['/api/images/naming-guide']
  });

  // Process images mutation
  const processMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('/api/images/scan', { method: 'POST' });
    },
    onSuccess: (data) => {
      setLastResults(data);
      refetchStatus();
      queryClient.invalidateQueries({ queryKey: ['/api/featured-items'] });

      toast({
        title: "Processing Complete",
        description: `Processed ${data.processed} images, ${data.failed} failed`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Processing Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleScan = async () => {
    setIsProcessing(true);
    try {
      await processMutation.mutateAsync();
    } finally {
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'hero': return 'bg-purple-100 text-purple-800';
      case 'banner': return 'bg-blue-100 text-blue-800';
      case 'interior': return 'bg-green-100 text-green-800';
      case 'product-id':
      case 'product-slug': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'hero': return 'Hero Image';
      case 'banner': return 'Banner';
      case 'interior': return 'Interior';
      case 'product-id': return 'Product (by ID)';
      case 'product-slug': return 'Product (by slug)';
      default: return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FolderUp className="h-5 w-5" />
                Folder Upload System
              </CardTitle>
              <CardDescription>
                Drop images in <code className="text-xs bg-gray-100 px-2 py-1 rounded">/public/images/upload/</code> and they'll be auto-assigned
              </CardDescription>
            </div>
            <Button
              onClick={() => refetchStatus()}
              variant="outline"
              size="sm"
              disabled={statusLoading}
            >
              <RefreshCw className={`h-4 w-4 ${statusLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Upload Folder Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Files Ready to Process</span>
            <Badge variant={uploadStatus?.count ? "default" : "secondary"}>
              {uploadStatus?.count || 0} files
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {uploadStatus?.count === 0 ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                No files in upload folder. Add images to <code className="text-xs bg-gray-100 px-1 rounded">/public/images/upload/</code> to get started.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              {uploadStatus?.files.map((file, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                  <FileImage className="h-5 w-5 text-gray-400 mt-1" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm truncate">{file.filename}</span>
                      <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getTypeColor(file.mapping.type)}`}>
                        {getTypeLabel(file.mapping.type)}
                      </Badge>
                      {file.mapping.type !== 'unknown' && (
                        <span className="text-xs text-gray-600">
                          → {file.mapping.target || file.mapping.slug}
                        </span>
                      )}
                      {file.mapping.type === 'unknown' && (
                        <span className="text-xs text-red-600 flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          Invalid naming pattern
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <Button
                onClick={handleScan}
                disabled={isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Process All Images
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Last Processing Results */}
      {lastResults && (
        <Card>
          <CardHeader>
            <CardTitle>Last Processing Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-semibold">{lastResults.processed} processed</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold">{lastResults.failed} failed</span>
                </div>
              </div>

              {lastResults.results.map((result: any, index: number) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                >
                  <div className="flex items-start gap-2">
                    {result.success ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-sm">{result.filename}</div>
                      <div className="text-xs text-gray-600 mt-1">{result.message}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Naming Convention Guide */}
      {namingGuide && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Naming Convention Guide
            </CardTitle>
            <CardDescription>
              Follow these patterns to automatically assign images to pages and products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {/* Landing Page Patterns */}
              <AccordionItem value="landing">
                <AccordionTrigger>Landing Page Images</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {namingGuide.patterns
                      .filter(p => ['hero-', 'banner-', 'interior-'].some(t => p.pattern.startsWith(t)))
                      .map((pattern, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="font-mono text-sm font-semibold text-blue-600 mb-1">
                            {pattern.pattern}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">{pattern.description}</div>
                          <div className="text-xs bg-gray-100 p-2 rounded">
                            Example: <span className="font-mono">{pattern.example}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Product Patterns */}
              <AccordionItem value="products">
                <AccordionTrigger>Product Images</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 mb-4">
                    {namingGuide.patterns
                      .filter(p => p.pattern.includes('product-') || p.pattern === '{slug}.jpg')
                      .map((pattern, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="font-mono text-sm font-semibold text-orange-600 mb-1">
                            {pattern.pattern}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">{pattern.description}</div>
                          <div className="text-xs bg-gray-100 p-2 rounded">
                            Example: <span className="font-mono">{pattern.example}</span>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Product Reference Table */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-sm mb-3">Product Reference</h4>
                    <div className="space-y-2">
                      {namingGuide.products.map((product) => (
                        <div key={product.id} className="text-xs bg-gray-50 p-2 rounded">
                          <div className="font-semibold mb-1">
                            #{product.id}: {product.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {product.patterns.map((pattern, idx) => (
                              <code key={idx} className="bg-white px-2 py-1 rounded border">
                                {pattern}
                              </code>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Full documentation:</strong> See <code className="text-xs bg-gray-100 px-1 rounded">IMAGE_NAMING_GUIDE.md</code> in the project root for complete details and examples.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
