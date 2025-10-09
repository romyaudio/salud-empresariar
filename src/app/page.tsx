'use client';

import { useAuthStore } from '@/store/authStore';
import AppLayout from '@/components/layout/AppLayout';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { LandingPage } from '@/components/landing/LandingPage';

export default function Home() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  // Show dashboard for authenticated users
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Dashboard />
      </div>
    </AppLayout>
  );
}