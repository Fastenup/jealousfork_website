import { useState, useEffect } from 'react';

interface SquareStatus {
  serviceAvailable: boolean;
  apiWorking?: boolean;
  environment: string;
  lastCheck: string;
  syncFrequency: string;
  credentialsConfigured: boolean;
  locationCount?: number;
  lastError?: string;
}

export default function SquareStatusIndicator() {
  const [status, setStatus] = useState<SquareStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/square-status');
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error('Failed to check Square status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
    // Removed automatic polling - only check once on mount
  }, []);

  if (loading) {
    return (
      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600">
        <div className="w-2 h-2 bg-gray-400 rounded-full mr-2 animate-pulse"></div>
        Checking Square API...
      </div>
    );
  }

  if (!status) {
    return null;
  }

  const getStatusColor = () => {
    if (!status.credentialsConfigured) return 'bg-red-100 text-red-800';
    if (!status.serviceAvailable) return 'bg-yellow-100 text-yellow-800';
    if (status.apiWorking) return 'bg-green-100 text-green-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusText = () => {
    if (!status.credentialsConfigured) return 'Square Not Configured';
    if (!status.serviceAvailable) return 'Square Service Unavailable';
    if (status.apiWorking) return `Square API Connected (${status.environment}) - ${status.method || 'Direct'}`;
    return 'Square API Error';
  };

  const getStatusDot = () => {
    if (!status.credentialsConfigured) return 'bg-red-500';
    if (!status.serviceAvailable) return 'bg-yellow-500';
    if (status.apiWorking) return 'bg-green-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-2">
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getStatusColor()}`}>
        <div className={`w-2 h-2 rounded-full mr-2 ${getStatusDot()}`}></div>
        {getStatusText()}
      </div>
      
      <div className="text-xs text-gray-500 space-y-1">
        <div>Sync: {status.syncFrequency}</div>
        <div>Last Check: {new Date(status.lastCheck).toLocaleTimeString()}</div>
        {status.locationCount && <div>Locations: {status.locationCount}</div>}
        {status.method && <div>Method: {status.method}</div>}
        {status.lastError && (
          <div className="text-red-600 mt-1">Error: {status.lastError}</div>
        )}
      </div>
    </div>
  );
}