'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  disabled?: boolean;
  threshold?: number;
  className?: string;
}

export function PullToRefresh({ 
  children, 
  onRefresh, 
  disabled = false, 
  threshold = 80,
  className = ''
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canPull, setCanPull] = useState(false);
  const startY = useRef(0);
  const currentY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: TouchEvent) => {
    if (disabled || isRefreshing) return;
    
    // Only allow pull-to-refresh when at the top of the page
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      setCanPull(true);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!canPull || disabled || isRefreshing) return;
    
    currentY.current = e.touches[0].clientY;
    const distance = currentY.current - startY.current;
    
    if (distance > 0 && window.scrollY === 0) {
      // Prevent default scrolling when pulling down
      e.preventDefault();
      
      // Apply resistance to the pull (diminishing returns)
      const resistedDistance = Math.min(distance * 0.5, threshold * 1.5);
      setPullDistance(resistedDistance);
    }
  };

  const handleTouchEnd = async () => {
    if (!canPull || disabled || isRefreshing) return;
    
    setCanPull(false);
    
    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      
      // Trigger haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }
      
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [canPull, pullDistance, threshold, disabled, isRefreshing]);

  const getRefreshIndicatorStyle = () => {
    const progress = Math.min(pullDistance / threshold, 1);
    const opacity = Math.min(progress * 2, 1);
    const scale = 0.5 + (progress * 0.5);
    const rotation = progress * 360;
    
    return {
      opacity,
      transform: `scale(${scale}) rotate(${rotation}deg)`,
      transition: isRefreshing ? 'transform 0.2s ease' : 'none'
    };
  };

  const shouldShowIndicator = pullDistance > 10 || isRefreshing;
  const isReadyToRefresh = pullDistance >= threshold;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Pull-to-refresh indicator */}
      {shouldShowIndicator && (
        <div 
          className="absolute top-0 left-0 right-0 flex justify-center items-center z-10"
          style={{
            transform: `translateY(${Math.max(pullDistance - 40, 0)}px)`,
            transition: pullDistance === 0 ? 'transform 0.3s ease-out' : 'none'
          }}
        >
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isReadyToRefresh 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}
            style={getRefreshIndicatorStyle()}
          >
            {isRefreshing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="text-sm">
                {isReadyToRefresh ? '↻' : '↓'}
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Content */}
      <div 
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: pullDistance === 0 ? 'transform 0.3s ease-out' : 'none'
        }}
      >
        {children}
      </div>
      
      {/* Refresh message */}
      {shouldShowIndicator && (
        <div 
          className="absolute top-10 left-0 right-0 flex justify-center z-10"
          style={{
            transform: `translateY(${Math.max(pullDistance - 40, 0)}px)`,
            transition: pullDistance === 0 ? 'transform 0.3s ease-out' : 'none'
          }}
        >
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
            <span className="text-xs text-gray-600">
              {isRefreshing 
                ? 'Actualizando...' 
                : isReadyToRefresh 
                  ? 'Suelta para actualizar' 
                  : 'Desliza hacia abajo'
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
}