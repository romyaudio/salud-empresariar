'use client';

import { useState, useEffect, useCallback } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  connectionType: string;
  effectiveType: string;
  downlink: number;
  rtt: number;
}

export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>(() => {
    if (typeof window === 'undefined') {
      return {
        isOnline: true,
        isSlowConnection: false,
        connectionType: 'unknown',
        effectiveType: 'unknown',
        downlink: 0,
        rtt: 0
      };
    }

    return getNetworkStatus();
  });

  const updateNetworkStatus = useCallback(() => {
    setNetworkStatus(getNetworkStatus());
  }, []);

  useEffect(() => {
    // Listen for online/offline events
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    // Listen for connection changes (if supported)
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      connection?.addEventListener('change', updateNetworkStatus);
    }

    // Periodic check for connection quality
    const interval = setInterval(() => {
      if (navigator.onLine) {
        checkConnectionQuality();
      }
    }, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        connection?.removeEventListener('change', updateNetworkStatus);
      }
      
      clearInterval(interval);
    };
  }, [updateNetworkStatus]);

  const checkConnectionQuality = useCallback(async () => {
    if (!navigator.onLine) return;

    try {
      const startTime = Date.now();
      const response = await fetch('/api/ping', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      const endTime = Date.now();
      const latency = endTime - startTime;

      // Update connection quality based on latency
      setNetworkStatus(prev => ({
        ...prev,
        isSlowConnection: latency > 2000, // Consider slow if > 2 seconds
        rtt: latency
      }));
    } catch (error) {
      // If ping fails, we might be offline or have a very poor connection
      setNetworkStatus(prev => ({
        ...prev,
        isSlowConnection: true
      }));
    }
  }, []);

  const retryConnection = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/ping', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      if (response.ok) {
        updateNetworkStatus();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }, [updateNetworkStatus]);

  return {
    ...networkStatus,
    retryConnection,
    checkConnectionQuality
  };
}

function getNetworkStatus(): NetworkStatus {
  const isOnline = navigator.onLine;
  
  // Get connection information if available
  const connection = (navigator as any).connection || 
                    (navigator as any).mozConnection || 
                    (navigator as any).webkitConnection;

  let connectionType = 'unknown';
  let effectiveType = 'unknown';
  let downlink = 0;
  let rtt = 0;
  let isSlowConnection = false;

  if (connection) {
    connectionType = connection.type || 'unknown';
    effectiveType = connection.effectiveType || 'unknown';
    downlink = connection.downlink || 0;
    rtt = connection.rtt || 0;
    
    // Determine if connection is slow based on effective type
    isSlowConnection = ['slow-2g', '2g'].includes(effectiveType) || 
                      (downlink > 0 && downlink < 0.5);
  }

  return {
    isOnline,
    isSlowConnection,
    connectionType,
    effectiveType,
    downlink,
    rtt
  };
}