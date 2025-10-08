'use client';

import { ReactNode, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { ModeNotification } from '@/components/ui/ModeNotification';
import { MobileNavigation } from '@/components/navigation/MobileNavigation';
import { PullToRefresh } from '@/components/navigation/PullToRefresh';
import { OrientationHandler } from '@/components/ui/OrientationHandler';
import { useMobileGestures } from '@/hooks/useMobileGestures';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/',
      isActive: pathname === '/'
    },
    {
      id: 'transactions',
      label: 'Transacciones',
      icon: '📋',
      path: '/transactions',
      isActive: pathname === '/transactions'
    },
    {
      id: 'income',
      label: 'Ingresos',
      icon: '💰',
      path: '/income',
      isActive: pathname === '/income'
    },
    {
      id: 'expenses',
      label: 'Gastos',
      icon: '💸',
      path: '/expenses',
      isActive: pathname === '/expenses'
    },
    {
      id: 'categories',
      label: 'Categorías',
      icon: '🏷️',
      path: '/categories',
      isActive: pathname === '/categories'
    }
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // Trigger a page refresh or data refetch
      window.location.reload();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Initialize mobile gestures
  const { triggerHapticFeedback, isTouchDevice, getOrientation } = useMobileGestures({
    navigationItems,
    onRefresh: handleRefresh,
    enableSwipeNavigation: true,
    enablePullToRefresh: true
  });

  return (
    <OrientationHandler>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h1 className="text-xl font-semibold text-gray-900">Budget Tracker</h1>
                {isRefreshing && (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                )}
              </div>
              {user && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 hidden sm:block">
                    {user.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>
        
        {/* Main content with pull-to-refresh */}
        <PullToRefresh onRefresh={handleRefresh} disabled={isRefreshing}>
          <main className="container mx-auto px-4 py-6 pb-24 min-h-screen">
            <ModeNotification />
            {children}
          </main>
        </PullToRefresh>
        
        {/* Enhanced Mobile Navigation */}
        <MobileNavigation 
          navigationItems={navigationItems}
          onNavigate={handleNavigation}
        />
      </div>
    </OrientationHandler>
  );
}

export default AppLayout;