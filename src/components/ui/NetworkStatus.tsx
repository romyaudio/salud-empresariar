'use client';

import { useState } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { TouchOptimizedButton } from './TouchOptimizedButton';

interface NetworkStatusProps {
  showWhenOnline?: boolean;
  className?: string;
}

export function NetworkStatus({ 
  showWhenOnline = false, 
  className = '' 
}: NetworkStatusProps) {
  const { 
    isOnline, 
    isSlowConnection, 
    effectiveType, 
    retryConnection 
  } = useNetworkStatus();
  
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    
    try {
      const success = await retryConnection();
      
      if (success) {
        // Trigger haptic feedback on success
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]);
        }
      }
    } catch (error) {
      console.error('Retry connection failed:', error);
    } finally {
      setIsRetrying(false);
    }
  };

  // Don't show anything if online and showWhenOnline is false
  if (isOnline && !showWhenOnline && !isSlowConnection) {
    return null;
  }

  const getStatusColor = () => {
    if (!isOnline) return 'bg-red-500';
    if (isSlowConnection) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusText = () => {
    if (!isOnline) return 'Sin conexión';
    if (isSlowConnection) return `Conexión lenta (${effectiveType})`;
    return `Conectado (${effectiveType})`;
  };

  const getStatusIcon = () => {
    if (!isOnline) return '📡';
    if (isSlowConnection) return '🐌';
    return '✅';
  };

  return (
    <div className={`
      fixed top-16 left-4 right-4 z-40 
      ${className}
    `}>
      <div className={`
        ${getStatusColor()} text-white px-4 py-2 rounded-lg shadow-lg 
        flex items-center justify-between
        transform transition-all duration-300
      `}>
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getStatusIcon()}</span>
          <span className="text-sm font-medium">{getStatusText()}</span>
        </div>

        {!isOnline && (
          <TouchOptimizedButton
            variant="ghost"
            size="sm"
            onClick={handleRetry}
            loading={isRetrying}
            disabled={isRetrying}
            className="text-white border-white hover:bg-white hover:text-red-500 ml-2"
          >
            {isRetrying ? 'Conectando...' : 'Reintentar'}
          </TouchOptimizedButton>
        )}
      </div>
    </div>
  );
}

// Compact network indicator
export function NetworkIndicator({ className = '' }: { className?: string }) {
  const { isOnline, isSlowConnection } = useNetworkStatus();

  const getIndicatorColor = () => {
    if (!isOnline) return 'bg-red-500';
    if (isSlowConnection) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${getIndicatorColor()}`} />
      <span className="text-xs text-gray-600">
        {!isOnline ? 'Offline' : isSlowConnection ? 'Lento' : 'Online'}
      </span>
    </div>
  );
}