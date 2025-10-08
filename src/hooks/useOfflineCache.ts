'use client';

import { useState, useEffect, useCallback } from 'react';
import { useNetworkStatus } from './useNetworkStatus';

interface CacheOptions {
  key: string;
  ttl?: number; // Time to live in milliseconds
  syncOnReconnect?: boolean;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl?: number;
}

export function useOfflineCache<T>(options: CacheOptions) {
  const { key, ttl = 5 * 60 * 1000, syncOnReconnect = true } = options; // Default 5 minutes TTL
  const { isOnline } = useNetworkStatus();
  const [cachedData, setCachedData] = useState<T | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Load data from cache on mount
  useEffect(() => {
    loadFromCache();
  }, [key]);

  // Sync when coming back online
  useEffect(() => {
    if (isOnline && syncOnReconnect && cachedData && isFromCache) {
      // Trigger sync when reconnecting
      // This would typically trigger a refetch in the consuming component
    }
  }, [isOnline, syncOnReconnect, cachedData, isFromCache]);

  const loadFromCache = useCallback(() => {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (cached) {
        const entry: CacheEntry<T> = JSON.parse(cached);
        
        // Check if cache is still valid
        const now = Date.now();
        const isExpired = entry.ttl && (now - entry.timestamp) > entry.ttl;
        
        if (!isExpired) {
          setCachedData(entry.data);
          setIsFromCache(true);
          setLastSyncTime(new Date(entry.timestamp));
          return entry.data;
        } else {
          // Remove expired cache
          localStorage.removeItem(`cache_${key}`);
        }
      }
    } catch (error) {
      console.error('Error loading from cache:', error);
    }
    return null;
  }, [key]);

  const saveToCache = useCallback((data: T) => {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl
      };
      
      localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
      setCachedData(data);
      setIsFromCache(false);
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Error saving to cache:', error);
      
      // If localStorage is full, try to clear old entries
      try {
        clearOldCacheEntries();
        localStorage.setItem(`cache_${key}`, JSON.stringify({
          data,
          timestamp: Date.now(),
          ttl
        }));
      } catch (retryError) {
        console.error('Failed to save to cache after cleanup:', retryError);
      }
    }
  }, [key, ttl]);

  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(`cache_${key}`);
      setCachedData(null);
      setIsFromCache(false);
      setLastSyncTime(null);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }, [key]);

  const clearOldCacheEntries = useCallback(() => {
    try {
      const now = Date.now();
      const keysToRemove: string[] = [];
      
      // Find expired cache entries
      for (let i = 0; i < localStorage.length; i++) {
        const storageKey = localStorage.key(i);
        if (storageKey?.startsWith('cache_')) {
          try {
            const entry = JSON.parse(localStorage.getItem(storageKey) || '');
            if (entry.ttl && (now - entry.timestamp) > entry.ttl) {
              keysToRemove.push(storageKey);
            }
          } catch (error) {
            // Invalid entry, mark for removal
            keysToRemove.push(storageKey);
          }
        }
      }
      
      // Remove expired entries
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing old cache entries:', error);
    }
  }, []);

  const getCacheInfo = useCallback(() => {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (cached) {
        const entry: CacheEntry<T> = JSON.parse(cached);
        const age = Date.now() - entry.timestamp;
        const isExpired = entry.ttl ? age > entry.ttl : false;
        
        return {
          exists: true,
          age,
          isExpired,
          timestamp: new Date(entry.timestamp)
        };
      }
    } catch (error) {
      console.error('Error getting cache info:', error);
    }
    
    return {
      exists: false,
      age: 0,
      isExpired: false,
      timestamp: null
    };
  }, [key]);

  return {
    cachedData,
    isFromCache,
    lastSyncTime,
    saveToCache,
    loadFromCache,
    clearCache,
    clearOldCacheEntries,
    getCacheInfo,
    isOnline
  };
}

// Hook for managing multiple cache entries
export function useCacheManager() {
  const clearAllCache = useCallback(() => {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('cache_')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing all cache:', error);
    }
  }, []);

  const getCacheSize = useCallback(() => {
    try {
      let totalSize = 0;
      let cacheCount = 0;
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('cache_')) {
          const value = localStorage.getItem(key);
          if (value) {
            totalSize += new Blob([value]).size;
            cacheCount++;
          }
        }
      }
      
      return { totalSize, cacheCount };
    } catch (error) {
      console.error('Error calculating cache size:', error);
      return { totalSize: 0, cacheCount: 0 };
    }
  }, []);

  return {
    clearAllCache,
    getCacheSize
  };
}