'use client';

import { useState, useEffect } from 'react';
import { isDemoMode } from '@/lib/amplify';

export function ModeNotification() {
  const [isDemo, setIsDemo] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsDemo(isDemoMode());
  }, []);

  if (!isDemo || !isVisible) {
    return null;
  }

  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-blue-800">
            Modo Local Activado
          </h3>
          <div className="mt-1 text-sm text-blue-700">
            <p>
              Tus datos se guardan localmente en tu navegador. 
              Todas las funcionalidades están disponibles y funcionando correctamente.
            </p>
          </div>
          <div className="mt-2">
            <button
              onClick={() => setIsVisible(false)}
              className="text-xs text-blue-600 hover:text-blue-500 underline"
            >
              Entendido, ocultar mensaje
            </button>
          </div>
        </div>
        <div className="ml-3 flex-shrink-0">
          <button
            onClick={() => setIsVisible(false)}
            className="inline-flex text-blue-400 hover:text-blue-600"
          >
            <span className="sr-only">Cerrar</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}