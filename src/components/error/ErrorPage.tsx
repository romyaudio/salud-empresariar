'use client';

import { TouchOptimizedButton } from '@/components/ui/TouchOptimizedButton';
import { useResponsive } from '@/hooks/useResponsive';

interface ErrorPageProps {
  title?: string;
  message?: string;
  statusCode?: number;
  showRetry?: boolean;
  showHome?: boolean;
  onRetry?: () => void;
  onHome?: () => void;
}

export function ErrorPage({
  title,
  message,
  statusCode,
  showRetry = true,
  showHome = true,
  onRetry,
  onHome
}: ErrorPageProps) {
  const { isMobile } = useResponsive();

  const getDefaultContent = () => {
    switch (statusCode) {
      case 404:
        return {
          title: 'Página no encontrada',
          message: 'La página que buscas no existe o ha sido movida.',
          icon: '🔍'
        };
      case 403:
        return {
          title: 'Acceso denegado',
          message: 'No tienes permisos para acceder a esta página.',
          icon: '🔒'
        };
      case 500:
        return {
          title: 'Error del servidor',
          message: 'Ha ocurrido un error interno. Inténtalo de nuevo más tarde.',
          icon: '🔧'
        };
      default:
        return {
          title: 'Algo salió mal',
          message: 'Ha ocurrido un error inesperado.',
          icon: '⚠️'
        };
    }
  };

  const defaultContent = getDefaultContent();
  const displayTitle = title || defaultContent.title;
  const displayMessage = message || defaultContent.message;

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleHome = () => {
    if (onHome) {
      onHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className={`max-w-md w-full bg-white rounded-lg shadow-lg text-center ${
        isMobile ? 'p-6' : 'p-8'
      }`}>
        {/* Error Icon */}
        <div className={`bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 ${
          isMobile ? 'w-16 h-16' : 'w-20 h-20'
        }`}>
          <span className={isMobile ? 'text-3xl' : 'text-4xl'}>
            {defaultContent.icon}
          </span>
        </div>

        {/* Status Code */}
        {statusCode && (
          <div className="mb-4">
            <span className={`font-bold text-gray-400 ${
              isMobile ? 'text-4xl' : 'text-6xl'
            }`}>
              {statusCode}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className={`font-semibold text-gray-900 mb-4 ${
          isMobile ? 'text-xl' : 'text-2xl'
        }`}>
          {displayTitle}
        </h1>

        {/* Message */}
        <p className={`text-gray-600 mb-8 ${
          isMobile ? 'text-sm' : 'text-base'
        }`}>
          {displayMessage}
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          {showRetry && (
            <TouchOptimizedButton
              variant="primary"
              size={isMobile ? 'md' : 'lg'}
              icon="🔄"
              onClick={handleRetry}
              className="w-full"
            >
              Intentar de nuevo
            </TouchOptimizedButton>
          )}

          {showHome && (
            <TouchOptimizedButton
              variant="secondary"
              size={isMobile ? 'md' : 'lg'}
              icon="🏠"
              onClick={handleHome}
              className="w-full"
            >
              Ir al inicio
            </TouchOptimizedButton>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Si el problema persiste, contacta soporte técnico
          </p>
        </div>
      </div>
    </div>
  );
}

// Specific error page components
export function NotFoundPage() {
  return <ErrorPage statusCode={404} />;
}

export function ForbiddenPage() {
  return <ErrorPage statusCode={403} showRetry={false} />;
}

export function ServerErrorPage() {
  return <ErrorPage statusCode={500} />;
}

export function NetworkErrorPage({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorPage
      title="Sin conexión"
      message="No se puede conectar al servidor. Verifica tu conexión a internet."
      onRetry={onRetry}
      showHome={false}
    />
  );
}