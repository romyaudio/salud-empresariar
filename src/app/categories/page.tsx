'use client';

import { useState } from 'react';
import { CategoryManager } from '@/components/categories/CategoryManager';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function CategoriesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'expense' | 'income' | 'all'>('expense');

  const tabs = [
    { id: 'expense' as const, label: 'Gastos', icon: '💸', count: 0 },
    { id: 'income' as const, label: 'Ingresos', icon: '💰', count: 0 },
    { id: 'all' as const, label: 'Todas', icon: '📋', count: 0 }
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 py-4 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="secondary"
              onClick={() => router.back()}
              className="mb-4 text-sm"
            >
              ← Volver
            </Button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Gestión de Categorías
                </h1>
                <p className="text-gray-600 mt-1">
                  Organiza tus ingresos y gastos con categorías personalizadas
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                      ${activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <span className="flex items-center space-x-2">
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <CategoryManager 
                type={activeTab}
                showAddNew={true}
              />
            </div>
          </div>

          {/* Información adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tips */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                💡 Consejos para Categorías
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Usa nombres descriptivos y específicos</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Agrupa gastos similares en subcategorías</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Usa colores distintivos para identificar rápidamente</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Las categorías predefinidas no se pueden eliminar</span>
                </li>
              </ul>
            </div>

            {/* Ejemplos */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                📝 Ejemplos de Categorías
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Gastos Comunes:</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'Marketing', color: '#8B5CF6' },
                      { name: 'Personal', color: '#F59E0B' },
                      { name: 'Oficina', color: '#06B6D4' },
                      { name: 'Tecnología', color: '#10B981' }
                    ].map((cat, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: cat.color }}
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Ingresos Típicos:</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'Ventas', color: '#10B981' },
                      { name: 'Servicios', color: '#3B82F6' },
                      { name: 'Comisiones', color: '#8B5CF6' }
                    ].map((cat, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: cat.color }}
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🚀 Acciones Rápidas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button
                variant="primary"
                onClick={() => router.push('/expenses')}
                className="w-full"
              >
                💸 Registrar Gasto
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push('/income')}
                className="w-full"
              >
                💰 Registrar Ingreso
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push('/')}
                className="w-full"
              >
                📊 Ver Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}