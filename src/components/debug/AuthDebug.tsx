'use client';

import { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';

export default function AuthDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    try {
      // Get Amplify configuration
      const config = Amplify.getConfig();
      
      setDebugInfo({
        isDemoMode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
        hasAmplifyConfig: !!config,
        authConfig: config.Auth,
        userPoolId: config.Auth?.Cognito?.userPoolId,
        userPoolClientId: config.Auth?.Cognito?.userPoolClientId,
        // region: config.Auth?.Cognito?.region, // Not available in this config structure
        envVars: {
          NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE,
          NEXT_PUBLIC_USER_POOL_ID: process.env.NEXT_PUBLIC_USER_POOL_ID,
          NODE_ENV: process.env.NODE_ENV,
        }
      });
    } catch (error) {
      console.error('Error getting Amplify config:', error);
      setDebugInfo({ error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50 text-xs">
      <h3 className="font-bold mb-2">🔍 Auth Debug Info</h3>
      
      {debugInfo ? (
        <div className="space-y-2">
          <div className={`flex items-center gap-2 ${debugInfo.isDemoMode ? 'text-yellow-600' : 'text-green-600'}`}>
            <div className={`w-2 h-2 rounded-full ${debugInfo.isDemoMode ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
            <span>{debugInfo.isDemoMode ? 'Demo Mode' : 'AWS Mode'}</span>
          </div>
          
          <div>
            <strong>Amplify Config:</strong> {debugInfo.hasAmplifyConfig ? '✅' : '❌'}
          </div>
          
          {debugInfo.userPoolId && (
            <div>
              <strong>User Pool:</strong> {debugInfo.userPoolId.slice(-8)}
            </div>
          )}
          
          <div>
            <strong>Region:</strong> us-east-1
          </div>
          
          <details className="mt-2">
            <summary className="cursor-pointer text-blue-600">Ver detalles</summary>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        </div>
      ) : (
        <div>Cargando...</div>
      )}
    </div>
  );
}