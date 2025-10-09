'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

export function S3Debug() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testS3Config = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/s3/debug');
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      setDebugInfo({
        error: 'Error conectando con API',
        details: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testS3Upload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/s3/test-upload', {
        method: 'POST'
      });
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      setDebugInfo({
        error: 'Error en test de upload',
        details: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">🔧 S3 Debug</h3>
      
      <div className="space-x-2 mb-4">
        <Button 
          onClick={testS3Config}
          disabled={isLoading}
          size="sm"
        >
          {isLoading ? 'Probando...' : 'Test Config'}
        </Button>
        
        <Button 
          onClick={testS3Upload}
          disabled={isLoading}
          size="sm"
        >
          {isLoading ? 'Probando...' : 'Test Upload'}
        </Button>
      </div>

      {debugInfo && (
        <div className="bg-white p-3 rounded border">
          <pre className="text-xs overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}