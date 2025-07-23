import { useState } from 'react';

export default function SquareDebugging() {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testSquareConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-square', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Square API Debug Tool</h3>
      
      <button
        onClick={testSquareConnection}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Square Connection'}
      </button>

      {testResult && (
        <div className="mt-4 p-4 bg-gray-50 rounded border">
          <h4 className="font-medium mb-2">Test Results:</h4>
          <pre className="text-sm text-gray-700 overflow-auto">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <h4 className="font-medium mb-2">Troubleshooting Steps:</h4>
        <ol className="list-decimal list-inside space-y-1">
          <li>Verify your Square access token is valid and not expired</li>
          <li>Check if you're using production vs sandbox credentials correctly</li>
          <li>Ensure your application has proper permissions in Square dashboard</li>
          <li>Confirm your location ID matches an active Square location</li>
        </ol>
      </div>
    </div>
  );
}