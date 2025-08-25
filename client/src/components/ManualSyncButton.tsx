import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ManualSyncButtonProps {
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

export function ManualSyncButton({ 
  variant = 'outline', 
  size = 'sm',
  className = '' 
}: ManualSyncButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleManualSync = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/square/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Sync Completed",
          description: "Square data has been refreshed successfully",
        });
        
        // Trigger a page reload to show updated data
        window.location.reload();
      } else {
        throw new Error(result.error || 'Sync failed');
      }
    } catch (error: any) {
      toast({
        title: "Sync Failed",
        description: error.message || 'Failed to sync with Square API',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleManualSync}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className}`}
    >
      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
      {isLoading ? 'Syncing...' : 'Sync Now'}
    </Button>
  );
}