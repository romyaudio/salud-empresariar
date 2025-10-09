'use client';

import { ReactNode, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { ModeNotification } from '@/components/ui/ModeNotification';
import { MobileNavigation } from '@/components/navigation/MobileNavigation';
import { PullToRefresh } from '@/components/navigation/PullToRefresh';
import { OrientationHandler } from '@/components/ui/OrientationHandler';
import { UserMenu } from '@/components/layout/UserMenu';
import { useMobileGestures } from '@/hooks/useMobileGestures';
import { useResponsive } from '@/hooks/useResponsive';
import { ResponsiveContainer } from '@/components/layout/ResponsiveContainer';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { ErrorNotificationContainer } from '@/components/error/ErrorNotification';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { NetworkStatus, NetworkIndicator } from '@/components/ui/NetworkStatus';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { useProfile } from '@/hooks/useProfile';
import { ProfileDebug } from '@/components/debug/ProfileDebug';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isMobile, isTablet, isDesktop, isLandscape } = useResponsive();
  const { errors, removeError, handleError } = useErrorHandler();
  const { isOnline } = useNetworkStatus();
  const { toasts, removeToast } = useToast();
  const { companyProfile, isLoading: profileLoading } = useProfile();

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
      id: 'profile',
      label: 'Perfil',
      icon: '👤',
      path: '/profile',
      isActive: pathname === '/profile'
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
    <ErrorBoundary onError={(error, errorInfo) => handleError(error, 'App Layout')}>
      <OrientationHandler>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
            <ResponsiveContainer padding={true}>
              <div className={`flex items-center justify-between ${isMobile ? 'py-3' : 'py-4'}`}>
                <div className="flex items-center space-x-3">
                  {/* Company Logo */}
                  {companyProfile?.logo && !profileLoading && companyProfile.logo.trim() !== '' && (
                    <div className={`flex-shrink-0 ${isMobile ? 'w-8 h-8' : 'w-10 h-10'}`}>
                      <img
                        src={companyProfile.logo}
                        alt={`${companyProfile.companyName || 'Company'} Logo`}
                        className="w-full h-full object-contain rounded-md"
                        onError={(e) => {
                          // Hide image if it fails to load
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Company Name or Default Title */}
                  <h1 className={`font-semibold text-gray-900 ${
                    isMobile ? 'text-lg' : isTablet ? 'text-xl' : 'text-xl'
                  }`}>
                    {!profileLoading && companyProfile?.companyName && companyProfile.companyName.trim() !== ''
                      ? companyProfile.companyName 
                      : (isMobile ? 'Budget' : 'Budget Tracker')
                    }
                  </h1>
                  
                  {isRefreshing && (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  {/* User Menu */}
                  {user && <UserMenu isMobile={isMobile} />}
                </div>
              </div>
            </ResponsiveContainer>
          </header>
          
          {/* Main content with pull-to-refresh */}
          <PullToRefresh onRefresh={handleRefresh} disabled={isRefreshing}>
            <main className={`min-h-screen ${
              isMobile ? 'pb-20' : isTablet ? 'pb-22' : 'pb-24'
            } ${isMobile ? 'py-4' : 'py-6'}`}>
              <ResponsiveContainer>
                <ModeNotification />
                <ErrorBoundary onError={(error, errorInfo) => handleError(error, 'Main Content')}>
                  {children}
                </ErrorBoundary>
              </ResponsiveContainer>
            </main>
          </PullToRefresh>
          
          {/* Enhanced Mobile Navigation */}
          <MobileNavigation 
            navigationItems={navigationItems}
            onNavigate={handleNavigation}
          />
          
          {/* Network Status */}
          <NetworkStatus />
          
          {/* Error Notifications */}
          <ErrorNotificationContainer
            errors={errors}
            onRemoveError={removeError}
          />
          
          {/* Toast Notifications */}
          <ToastContainer
            toasts={toasts}
            onRemoveToast={removeToast}
          />
          
          {/* Profile Debug (development only) */}
          {process.env.NODE_ENV === 'development' && <ProfileDebug />}
        </div>
      </OrientationHandler>
    </ErrorBoundary>
  );
}

export default AppLayout;