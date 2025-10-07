'use client';

import { useState } from 'react';
import { IncomeForm } from '@/components/forms/IncomeForm';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function IncomePage() {
  const router = useRouter();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSuccess = () => {
    setShowSuccessMessage(true);
    
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 py-4 px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="secondary"
              onClick={() => router.back()}
              className="mb-4 text-sm"
            >
              ← Volver
            </Button>
            
            <h1 className="text-2xl font-bold text-gray-900">
              Nuevo Ingreso
            </h1>
            <p className="text-gray-600 mt-1">
              Registra tus ingresos para mantener actualizado tu presupuesto
            </p>
          </div>

          {/* Mensaje de éxito */}
          {showSuccessMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    ¡Ingreso registrado exitosamente!
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    Tu balance ha sido actualizado automáticamente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Formulario */}
          <IncomeForm 
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />

          {/* Información adicional */}
          <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              ¿Qué tipos de ingresos puedo registrar?
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Ventas de productos o servicios</li>
              <li>• Ingresos por consultoría</li>
              <li>• Comisiones recibidas</li>
              <li>• Otros ingresos del negocio</li>
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}