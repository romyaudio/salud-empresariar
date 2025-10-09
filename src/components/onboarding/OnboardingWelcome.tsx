'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

interface PersonalData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  position?: string;
  bio?: string;
  profileImage?: string;
}

interface CompanyData {
  companyName: string;
  address: string;
  city: string;
  country: string;
  taxId?: string;
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  industry?: string;
  foundedYear?: string;
  logo?: string;
  usePersonalAddress?: boolean;
}

interface OnboardingWelcomeProps {
  personalData: PersonalData;
  companyData: CompanyData;
  onComplete: () => void;
}

export function OnboardingWelcome({ 
  personalData, 
  companyData, 
  onComplete 
}: OnboardingWelcomeProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    setIsLoading(true);
    
    // Simulate final processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onComplete();
  };

  return (
    <div className="p-8 text-center">
      {/* Success Icon */}
      <div className="mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          ¡Perfecto, {personalData.firstName}!
        </h2>
        <p className="text-lg text-gray-600">
          Tu perfil ha sido configurado correctamente
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Personal Info Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-blue-900">
              Información Personal
            </h3>
          </div>
          <div className="space-y-2 text-sm text-blue-800">
            <p><span className="font-medium">Nombre:</span> {personalData.firstName} {personalData.lastName}</p>
            {personalData.position && (
              <p><span className="font-medium">Cargo:</span> {personalData.position}</p>
            )}
            <p><span className="font-medium">Ubicación:</span> {personalData.city}, {personalData.country}</p>
            {personalData.phone && (
              <p><span className="font-medium">Teléfono:</span> {personalData.phone}</p>
            )}
          </div>
        </div>

        {/* Company Info Summary */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-left">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-900">
              Información Empresarial
            </h3>
          </div>
          <div className="space-y-2 text-sm text-green-800">
            <p><span className="font-medium">Empresa:</span> {companyData.companyName}</p>
            {companyData.industry && (
              <p><span className="font-medium">Industria:</span> {companyData.industry}</p>
            )}
            <p><span className="font-medium">Ubicación:</span> {companyData.city}, {companyData.country}</p>
            {companyData.email && (
              <p><span className="font-medium">Email:</span> {companyData.email}</p>
            )}
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-6 text-white mb-8">
        <h3 className="text-xl font-bold mb-2">
          ¡Bienvenido a Salud Empresarial!
        </h3>
        <p className="text-blue-100">
          Estás listo para comenzar a gestionar la salud y bienestar de tu empresa. 
          Podrás acceder a herramientas de seguimiento, reportes y mucho más.
        </p>
      </div>

      {/* Features Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h4 className="font-medium text-gray-900 mb-1">Dashboard</h4>
          <p className="text-sm text-gray-600">Visualiza métricas clave</p>
        </div>
        
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h4 className="font-medium text-gray-900 mb-1">Empleados</h4>
          <p className="text-sm text-gray-600">Gestiona tu equipo</p>
        </div>
        
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 className="font-medium text-gray-900 mb-1">Reportes</h4>
          <p className="text-sm text-gray-600">Análisis detallados</p>
        </div>
      </div>

      {/* Complete Button */}
      <Button
        onClick={handleComplete}
        disabled={isLoading}
        size="lg"
        className="min-w-[200px]"
      >
        {isLoading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Configurando...
          </div>
        ) : (
          'Ir al Dashboard'
        )}
      </Button>
    </div>
  );
}