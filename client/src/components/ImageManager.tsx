import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ObjectUploader } from './ObjectUploader';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface ImageManagerProps {
  entityType: 'menu-item' | 'location';
  entityId: number;
  currentImageUrl?: string;
  onImageUpdate: (imageUrl: string) => void;
  className?: string;
}

export function ImageManager({ 
  entityType, 
  entityId, 
  currentImageUrl, 
  onImageUpdate,
  className = '' 
}: ImageManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  // Update image mutation
  const updateImageMutation = useMutation({
    mutationFn: async ({ imageUrl }: { imageUrl: string }) => {
      const endpoint = entityType === 'menu-item' 
        ? `/api/admin/menu-items/${entityId}/image`
        : `/api/admin/locations/${entityId}/image`;
      return apiRequest(endpoint, { 
        method: 'PATCH', 
        body: { imageUrl } 
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/${entityType}s`] });
      onImageUpdate(data.imageUrl);
      toast({
        title: "Image Updated",
        description: "Image has been successfully updated",
      });
      setIsUploading(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Image",
        description: error.message,
        variant: "destructive",
      });
      setIsUploading(false);
    },
  });

  // Remove image mutation
  const removeImageMutation = useMutation({
    mutationFn: async () => {
      const endpoint = entityType === 'menu-item' 
        ? `/api/admin/menu-items/${entityId}/image`
        : `/api/admin/locations/${entityId}/image`;
      return apiRequest(endpoint, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/${entityType}s`] });
      onImageUpdate('');
      toast({
        title: "Image Removed",
        description: "Image has been successfully removed",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Remove Image",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGetUploadParameters = async () => {
    const response = await fetch('/api/objects/upload', { method: 'POST' });
    const data = await response.json();
    return {
      method: 'PUT' as const,
      url: data.uploadURL,
    };
  };

  const handleUploadComplete = async (result: { successful: { uploadURL: string }[] }) => {
    if (result.successful && result.successful.length > 0) {
      const uploadedFile = result.successful[0];
      if (uploadedFile.uploadURL) {
        setIsUploading(true);
        updateImageMutation.mutate({ imageUrl: uploadedFile.uploadURL });
      }
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">Image</h4>
        {currentImageUrl && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => removeImageMutation.mutate()}
            disabled={removeImageMutation.isPending}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {currentImageUrl ? (
        <div className="relative group">
          <img
            src={currentImageUrl}
            alt={`${entityType} image`}
            className="w-full h-32 object-cover rounded-lg border border-gray-200"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all flex items-center justify-center">
            <ObjectUploader
              maxNumberOfFiles={1}
              maxFileSize={5242880} // 5MB
              onGetUploadParameters={handleGetUploadParameters}
              onComplete={handleUploadComplete}
              buttonClassName="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-900 hover:bg-gray-100"
            >
              <Upload className="h-4 w-4 mr-2" />
              Replace
            </ObjectUploader>
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <div className="text-sm text-gray-600 mb-4">No image uploaded</div>
          <ObjectUploader
            maxNumberOfFiles={1}
            maxFileSize={5242880} // 5MB
            onGetUploadParameters={handleGetUploadParameters}
            onComplete={handleUploadComplete}
            buttonClassName="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Image
          </ObjectUploader>
        </div>
      )}

      {(isUploading || updateImageMutation.isPending || removeImageMutation.isPending) && (
        <div className="text-sm text-gray-500">Processing...</div>
      )}
    </div>
  );
}