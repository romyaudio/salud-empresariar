'use client';

import Link from 'next/link';
import { useResponsive } from '@/hooks/useResponsive';

export function LandingHeader() {
  const { isMobile } = useResponsive();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between ${isMobile ? 'py-3' : 'py-4'}`}>
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} bg-white rounded-lg border border-gray-200 flex items-center justify-center p-1`}>
              <img 
                src="/logo.svg" 
                alt="Salud Empresarial Logo" 
                className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} object-contain`}
              />
            </div>
            <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-lg' : 'text-xl'}`}>
              Salud Empresarial
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            {!isMobile && (
              <div className="hidden md:flex items-center space-x-6">
                <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Características
                </a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Precios
                </a>
                <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Contacto
                </a>
              </div>
            )}
            
            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <Link
                href="/auth"
                className={`text-blue-600 hover:text-blue-700 font-medium transition-colors ${
                  isMobile ? 'text-sm' : 'text-base'
                }`}
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/auth"
                className={`bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors ${
                  isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'
                }`}
              >
                Crear Cuenta
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}