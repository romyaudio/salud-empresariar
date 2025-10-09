'use client';

import Link from 'next/link';
import { LandingHeader } from './LandingHeader';
import { useResponsive } from '@/hooks/useResponsive';

export function LandingPage() {
  const { isMobile, isTablet } = useResponsive();

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className={`font-bold text-gray-900 mb-6 ${
              isMobile ? 'text-3xl' : isTablet ? 'text-4xl' : 'text-5xl lg:text-6xl'
            }`}>
              Controla las finanzas de tu{' '}
              <span className="text-blue-600">pequeña empresa</span>
            </h1>
            
            <p className={`text-gray-600 mb-8 max-w-3xl mx-auto ${
              isMobile ? 'text-lg' : 'text-xl'
            }`}>
              Una aplicación móvil-first diseñada específicamente para pequeñas empresas. 
              Registra ingresos y gastos, visualiza tus datos financieros y toma decisiones informadas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/auth"
                className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors ${
                  isMobile ? 'px-6 py-3 text-base w-full sm:w-auto' : 'px-8 py-4 text-lg'
                }`}
              >
                Comenzar Gratis
              </Link>
              <button className={`border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition-colors ${
                isMobile ? 'px-6 py-3 text-base w-full sm:w-auto' : 'px-8 py-4 text-lg'
              }`}>
                Ver Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`font-bold text-gray-900 mb-4 ${
              isMobile ? 'text-2xl' : 'text-3xl lg:text-4xl'
            }`}>
              Todo lo que necesitas para gestionar tu negocio
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Funcionalidades diseñadas específicamente para las necesidades de pequeñas empresas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Registro de Ingresos
              </h3>
              <p className="text-gray-600">
                Registra tus ingresos de manera rápida y sencilla. Mantén un control actualizado de todas tus entradas de dinero.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💸</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Gastos Categorizados
              </h3>
              <p className="text-gray-600">
                Organiza tus gastos por categorías personalizables. Analiza en qué áreas inviertes más dinero.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Reportes Visuales
              </h3>
              <p className="text-gray-600">
                Visualiza tus datos financieros con gráficos claros. Toma decisiones informadas sobre tu negocio.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Móvil-First
              </h3>
              <p className="text-gray-600">
                Diseñado para dispositivos móviles. Registra transacciones desde cualquier lugar y momento.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Datos Seguros
              </h3>
              <p className="text-gray-600">
                Tus datos están protegidos en la nube con AWS. Autenticación segura y respaldos automáticos.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📄</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Exportación de Datos
              </h3>
              <p className="text-gray-600">
                Exporta tus datos financieros en CSV o PDF. Comparte fácilmente con tu contador o para respaldos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-blue-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`font-bold text-white mb-4 ${
            isMobile ? 'text-2xl' : 'text-3xl lg:text-4xl'
          }`}>
            ¿Listo para tomar control de tus finanzas?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Únete a cientos de pequeñas empresas que ya están usando Salud Empresarial para gestionar sus finanzas de manera eficiente.
          </p>
          <Link
            href="/auth"
            className={`bg-white hover:bg-gray-100 text-blue-500 font-semibold rounded-lg transition-colors inline-block ${
              isMobile ? 'px-6 py-3 text-base' : 'px-8 py-4 text-lg'
            }`}
          >
            Comenzar Ahora - Es Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg border border-gray-600 flex items-center justify-center p-1">
                  <img 
                    src="/logo.svg" 
                    alt="Salud Empresarial Logo" 
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold text-white">Salud Empresarial</h3>
              </div>
              <p className="text-gray-400 mb-4">
                La solución de gestión financiera diseñada específicamente para pequeñas empresas. 
                Simple, segura y eficiente.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Producto</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Características</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Precios</a></li>
                <li><a href="/auth" className="text-gray-400 hover:text-white transition-colors">Comenzar</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2">
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Ayuda</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentación</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Salud Empresarial. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}