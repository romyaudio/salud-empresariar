'use client';

import { useEffect, useState, ReactNode } from 'react';

interface OrientationHandlerProps {
  children: ReactNode;
  showOrientationMessage?: boolean;
}

export function OrientationHandler({ 
  children, 
  showOrientationMessage = true 
}: OrientationHandlerProps) {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const handleOrientationChange = () => {
      const newOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
      
      if (newOrientation !== orientation) {
        setOrientation(newOrientation);
        
        if (showOrientationMessage) {
          setShowMessage(true);
          setTimeout(() => setShowMessage(false), 2000);
        }
        
        // Trigger haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(100);
        }
        
        // Dispatch custom event for other components to listen
        window.dispatchEvent(new CustomEvent('orientationChanged', {
          detail: { orientation: newOrientation }
        }));
      }
    };

    // Initial check
    handleOrientationChange();

    // Listen for resize events (covers orientation changes)
    window.addEventListener('resize', handleOrientationChange);
    
    // Also listen for the orientationchange event if available
    if ('onorientationchange' in window) {
      window.addEventListener('orientationchange', () => {
        // Small delay to ensure dimensions have updated
        setTimeout(handleOrientationChange, 100);
      });
    }

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      if ('onorientationchange' in window) {
        window.removeEventListener('orientationchange', handleOrientationChange);
      }
    };
  }, [orientation, showOrientationMessage]);

  return (
    <>
      {children}
      
      {/* Orientation change notification */}
      {showMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-out">
          <div className="bg-black/80 text-white px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <span className="text-lg">
                {orientation === 'portrait' ? '📱' : '📺'}
              </span>
              <span className="text-sm font-medium">
                {orientation === 'portrait' ? 'Modo vertical' : 'Modo horizontal'}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}