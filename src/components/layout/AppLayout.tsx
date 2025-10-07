'use client';

import { ReactNode } from 'react';
import { useAuthStore } from '@/store/authStore';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 safe-top">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Budget Tracker</h1>
            {user && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
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
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-6 pb-20">
        {children}
      </main>
      
      {/* Mobile navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom">
        <div className="flex justify-around py-2">
          <div className="flex flex-col items-center py-2 px-3 text-primary-600">
            <div className="w-6 h-6 mb-1 flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
            <span className="text-xs">Dashboard</span>
          </div>
          <div className="flex flex-col items-center py-2 px-3 text-gray-500">
            <div className="w-6 h-6 mb-1 flex items-center justify-center">
              <span className="text-lg">💰</span>
            </div>
            <span className="text-xs">Ingresos</span>
          </div>
          <div className="flex flex-col items-center py-2 px-3 text-gray-500">
            <div className="w-6 h-6 mb-1 flex items-center justify-center">
              <span className="text-lg">💸</span>
            </div>
            <span className="text-xs">Gastos</span>
          </div>
          <div className="flex flex-col items-center py-2 px-3 text-gray-500">
            <div className="w-6 h-6 mb-1 flex items-center justify-center">
              <span className="text-lg">📤</span>
            </div>
            <span className="text-xs">Exportar</span>
          </div>
        </div>
      </nav>
    </div>
  );
}