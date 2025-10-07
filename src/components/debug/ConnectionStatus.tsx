'use client';

import { useEffect, useState } from 'react';
import { getConfigStatus } from '@/lib/amplify';

interface ConnectionStatusProps {
  showDetails?: boolean;
}

export default function ConnectionStatus({ showDetails = false }: ConnectionStatusProps) {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    const configStatus = getConfigStatus();
    setStatus(configStatus);
  }, []);

  if (!status || !showDetails) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-3 h-3 rounded-full ${status.isDemoMode ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
        <span className="font-semibold text-sm">
          {status.isDemoMode ? 'Modo Demo' : 'AWS DynamoDB'}
        </span>
      </div>
      
      {showDetails && (
        <div className="text-xs text-gray-600 space-y-1">
          <div>Pool: {status.userPoolId?.slice(-8)}</div>
          <div>Región: {status.region}</div>
          <div className={status.hasValidConfig ? 'text-green-600' : 'text-red-600'}>
            {status.hasValidConfig ? '✅ Configurado' : '❌ Sin configurar'}
          </div>
        </div>
      )}
    </div>
  );
}