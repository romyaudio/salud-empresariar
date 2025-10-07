'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import AppLayout from '@/components/layout/AppLayout';

export default function Home() {
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/auth');
  };

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

  return (
    <AppLayout>
      <div className="max-w-md mx-auto">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white">👋</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Bienvenido, {user?.name}!
          </h1>
          <p className="text-gray-600 text-sm">
            Gestiona el presupuesto de tu pequeña empresa
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="text-sm font-medium text-gray-900">Sesión Activa</span>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Usuario:</span>
              <span className="font-medium">{user?.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Email:</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Estado:</span>
              <span className="text-green-600 font-medium">
                {user?.emailVerified ? 'Verificado' : 'Pendiente'}
              </span>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="text-sm font-medium text-gray-900">Autenticación Completada</span>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            El sistema de autenticación con gestión de sesiones está funcionando correctamente.
          </p>
          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>✅ Next.js 14 + TypeScript</span>
            </div>
            <div className="flex justify-between">
              <span>✅ Tailwind CSS Mobile-First</span>
            </div>
            <div className="flex justify-between">
              <span>✅ AWS Amplify Auth</span>
            </div>
            <div className="flex justify-between">
              <span>✅ Gestión de Sesiones</span>
            </div>
            <div className="flex justify-between">
              <span>⏳ Modelos de Datos (Próximo)</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          
          <div className="space-y-3">
            <Button 
              variant="primary" 
              className="w-full"
              onClick={() => router.push('/')}
            >
              📊 Ver Dashboard
            </Button>
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={() => router.push('/income')}
            >
              💰 Registrar Ingreso
            </Button>
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={() => router.push('/expenses')}
            >
              💸 Registrar Gasto
            </Button>
          </div>
        </div>

        {/* Logout */}
        <div className="bg-gray-100 rounded-lg p-4">
          <Button 
            variant="secondary" 
            onClick={handleLogout}
            className="w-full"
          >
            🚪 Cerrar Sesión
          </Button>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-4 mt-6">
          <h4 className="font-medium text-blue-900 mb-2">Próximos Pasos</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Crear modelos de datos con DynamoDB</li>
            <li>• Implementar dashboard principal</li>
            <li>• Desarrollar registro de transacciones</li>
            <li>• Agregar funcionalidades de exportación</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}