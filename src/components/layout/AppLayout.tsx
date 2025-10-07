'use client';

import { ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/',
      isActive: pathname === '/'
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
      id: 'export',
      label: 'Exportar',
      icon: '📤',
      path: '/export',
      isActive: pathname === '/export'
    }
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 safe-top">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Budget Tracker</h1>
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
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-6 pb-20">
        {children}
      </main>
      
      {/* Mobile navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom">
        <div className="flex justify-around py-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center py-2 px-3 transition-colors ${
                item.isActive 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="w-6 h-6 mb-1 flex items-center justify-center">
                <span className="text-lg">{item.icon}</span>
              </div>
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}