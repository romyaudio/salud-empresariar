'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSwipeable } from 'react-swipeable';

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  isActive: boolean;
}

interface MobileNavigationProps {
  navigationItems: NavigationItem[];
  onNavigate: (path: string) => void;
}

export function MobileNavigation({ navigationItems, onNavigate }: MobileNavigationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  // Auto-hide navigation on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Swipe handlers for navigation
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const currentIndex = navigationItems.findIndex(item => item.isActive);
      const nextIndex = (currentIndex + 1) % navigationItems.length;
      onNavigate(navigationItems[nextIndex].path);
    },
    onSwipedRight: () => {
      const currentIndex = navigationItems.findIndex(item => item.isActive);
      const prevIndex = currentIndex === 0 ? navigationItems.length - 1 : currentIndex - 1;
      onNavigate(navigationItems[prevIndex].path);
    },
    trackMouse: false,
    trackTouch: true,
    delta: 50, // Minimum swipe distance
  });

  // Haptic feedback for supported devices
  const triggerHapticFeedback = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50); // Light haptic feedback
    }
  };

  const handleNavigation = (path: string) => {
    triggerHapticFeedback();
    onNavigate(path);
  };

  return (
    <>
      {/* Swipe area overlay */}
      <div 
        {...handlers}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ touchAction: 'pan-y' }}
      />
      
      {/* Navigation bar */}
      <nav 
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 transition-transform duration-300 z-50 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)',
          boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Active indicator */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
        
        <div className="flex justify-around py-2">
          {navigationItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center py-2 px-3 transition-all duration-200 relative ${
                item.isActive 
                  ? 'text-blue-600 scale-105' 
                  : 'text-gray-500 hover:text-gray-700 active:scale-95'
              }`}
              style={{
                minWidth: '60px',
                touchAction: 'manipulation' // Prevents zoom on double tap
              }}
            >
              {/* Active indicator dot */}
              {item.isActive && (
                <div className="absolute -top-1 w-1 h-1 bg-blue-600 rounded-full animate-pulse" />
              )}
              
              <div className={`w-6 h-6 mb-1 flex items-center justify-center transition-transform duration-200 ${
                item.isActive ? 'scale-110' : ''
              }`}>
                <span className="text-lg">{item.icon}</span>
              </div>
              
              <span className={`text-xs font-medium transition-all duration-200 ${
                item.isActive ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
              
              {/* Ripple effect on tap */}
              <div className="absolute inset-0 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gray-200 opacity-0 transition-opacity duration-150 active:opacity-30" />
              </div>
            </button>
          ))}
        </div>
        
        {/* Swipe indicator */}
        <div className="flex justify-center py-1">
          <div className="w-8 h-1 bg-gray-300 rounded-full opacity-50" />
        </div>
      </nav>
    </>
  );
}