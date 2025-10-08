'use client';

import { useState, useEffect } from 'react';

interface BreakpointConfig {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

const defaultBreakpoints: BreakpointConfig = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

type BreakpointKey = keyof BreakpointConfig;

interface ResponsiveState {
  width: number;
  height: number;
  breakpoint: BreakpointKey;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
}

export function useResponsive(breakpoints: BreakpointConfig = defaultBreakpoints) {
  const [state, setState] = useState<ResponsiveState>(() => {
    if (typeof window === 'undefined') {
      return {
        width: 0,
        height: 0,
        breakpoint: 'xs' as BreakpointKey,
        isMobile: true,
        isTablet: false,
        isDesktop: false,
        isLandscape: false,
        isPortrait: true
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return {
      width,
      height,
      breakpoint: getCurrentBreakpoint(width, breakpoints),
      isMobile: width < breakpoints.md,
      isTablet: width >= breakpoints.md && width < breakpoints.lg,
      isDesktop: width >= breakpoints.lg,
      isLandscape: width > height,
      isPortrait: height >= width
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setState({
        width,
        height,
        breakpoint: getCurrentBreakpoint(width, breakpoints),
        isMobile: width < breakpoints.md,
        isTablet: width >= breakpoints.md && width < breakpoints.lg,
        isDesktop: width >= breakpoints.lg,
        isLandscape: width > height,
        isPortrait: height >= width
      });
    };

    // Debounce resize events for better performance
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);
    window.addEventListener('orientationchange', () => {
      // Small delay to ensure dimensions have updated after orientation change
      setTimeout(handleResize, 150);
    });

    return () => {
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(timeoutId);
    };
  }, [breakpoints]);

  // Utility functions
  const isBreakpoint = (bp: BreakpointKey): boolean => {
    return state.breakpoint === bp;
  };

  const isBreakpointUp = (bp: BreakpointKey): boolean => {
    return state.width >= breakpoints[bp];
  };

  const isBreakpointDown = (bp: BreakpointKey): boolean => {
    return state.width < breakpoints[bp];
  };

  const isBreakpointBetween = (min: BreakpointKey, max: BreakpointKey): boolean => {
    return state.width >= breakpoints[min] && state.width < breakpoints[max];
  };

  return {
    ...state,
    isBreakpoint,
    isBreakpointUp,
    isBreakpointDown,
    isBreakpointBetween,
    breakpoints
  };
}

function getCurrentBreakpoint(width: number, breakpoints: BreakpointConfig): BreakpointKey {
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
}

// Hook for responsive values
export function useResponsiveValue<T>(values: Partial<Record<BreakpointKey, T>>): T | undefined {
  const { breakpoint, isBreakpointUp } = useResponsive();
  
  // Find the appropriate value based on current breakpoint
  const breakpointOrder: BreakpointKey[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
  
  for (const bp of breakpointOrder) {
    if (values[bp] !== undefined && isBreakpointUp(bp)) {
      return values[bp];
    }
  }
  
  // Fallback to the smallest defined value
  for (const bp of ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as BreakpointKey[]) {
    if (values[bp] !== undefined) {
      return values[bp];
    }
  }
  
  return undefined;
}