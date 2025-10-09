'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
      return;
    }

    // Check if user needs onboarding (but not if they're already on onboarding page)
    if (user && isAuthenticated && !user.onboardingCompleted && pathname !== '/onboarding') {
      router.push('/onboarding');
      return;
    }

    // If user completed onboarding but is on onboarding page, redirect to dashboard
    if (user && isAuthenticated && user.onboardingCompleted && pathname === '/onboarding') {
      router.push('/');
      return;
    }
  }, [user, isAuthenticated, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to auth page
  }

  // If user needs onboarding and not on onboarding page, don't render content
  if (user && !user.onboardingCompleted && pathname !== '/onboarding') {
    return null; // Will redirect to onboarding
  }

  return <>{children}</>;
}