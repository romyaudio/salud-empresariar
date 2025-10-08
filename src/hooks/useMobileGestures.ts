'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface UseMobileGesturesProps {
  navigationItems: Array<{
    id: string;
    path: string;
    isActive: boolean;
  }>;
  onRefresh?: () => Promise<void>;
  enableSwipeNavigation?: boolean;
  enablePullToRefresh?: boolean;
}

export function useMobileGestures({
  navigationItems,
  onRefresh,
  enableSwipeNavigation = true,
  enablePullToRefresh = true
}: UseMobileGesturesProps) {
  const router = useRouter();

  // Handle keyboard navigation for accessibility
  const handleKeyNavigation = useCallback((event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    
    const currentIndex = navigationItems.findIndex(item => item.isActive);
    let nextIndex = currentIndex;
    
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = currentIndex === 0 ? navigationItems.length - 1 : currentIndex - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = (currentIndex + 1) % navigationItems.length;
        break;
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        nextIndex = navigationItems.length - 1;
        break;
      default:
        return;
    }
    
    if (nextIndex !== currentIndex) {
      router.push(navigationItems[nextIndex].path);
    }
  }, [navigationItems, router]);

  // Handle refresh shortcut
  const handleRefreshShortcut = useCallback(async (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'r' && onRefresh) {
      event.preventDefault();
      await onRefresh();
    }
  }, [onRefresh]);

  // Prevent zoom on double tap for better mobile experience
  const preventZoom = useCallback((event: TouchEvent) => {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }, []);

  // Handle device orientation changes
  const handleOrientationChange = useCallback(() => {
    // Small delay to ensure layout has updated
    setTimeout(() => {
      // Trigger a resize event to help components adapt
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }, []);

  useEffect(() => {
    if (enableSwipeNavigation) {
      document.addEventListener('keydown', handleKeyNavigation);
    }
    
    if (enablePullToRefresh && onRefresh) {
      document.addEventListener('keydown', handleRefreshShortcut);
    }
    
    // Prevent zoom on mobile
    document.addEventListener('touchstart', preventZoom, { passive: false });
    
    // Handle orientation changes
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      document.removeEventListener('keydown', handleKeyNavigation);
      document.removeEventListener('keydown', handleRefreshShortcut);
      document.removeEventListener('touchstart', preventZoom);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [
    enableSwipeNavigation,
    enablePullToRefresh,
    handleKeyNavigation,
    handleRefreshShortcut,
    preventZoom,
    handleOrientationChange
  ]);

  // Utility functions for haptic feedback
  const triggerHapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: 50,
        medium: 100,
        heavy: 200
      };
      navigator.vibrate(patterns[type]);
    }
  }, []);

  // Check if device supports touch
  const isTouchDevice = useCallback(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  // Get device orientation
  const getOrientation = useCallback(() => {
    if (typeof window !== 'undefined') {
      return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    }
    return 'portrait';
  }, []);

  return {
    triggerHapticFeedback,
    isTouchDevice,
    getOrientation
  };
}