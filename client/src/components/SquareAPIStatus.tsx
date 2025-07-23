import { useSquareMenu } from '@/hooks/useSquareMenu';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

export default function SquareAPIStatus() {
  const { data: squareItems, isLoading, error } = useSquareMenu();
  
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
        <Clock className="w-4 h-4 animate-spin" />
        Loading live menu data...
      </div>
    );
  }
  
  if (error || !squareItems || squareItems.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium">
        <AlertCircle className="w-4 h-4" />
        Using static menu (Square API unavailable)
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
      <CheckCircle className="w-4 h-4" />
      Live menu with real-time inventory ({squareItems.length} items)
    </div>
  );
}