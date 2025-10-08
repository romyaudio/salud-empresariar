'use client';

import { useState, useEffect } from 'react';
import { TouchOptimizedButton } from '@/components/ui/TouchOptimizedButton';

export interface ErrorDetails {
  id: string;
  title: string;
  message: string;
  type: 'network' | 'validation' | 'auth' | 'server' | 'unknown';
  timestamp: Date;
  retryable?: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
}

interface ErrorNotificationProps {
  error: ErrorDetails;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function ErrorNotification({ 
  error, 
  onClose, 
  autoClose = false, 
  autoCloseDelay = 5000 
}: ErrorNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose && !error.retryable) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, error.retryable]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      error.onDismiss?.();
      onClose();
    }, 300);
  };

  const handleRetry = () => {
    error.onRetry?.();
    handleClose();
  };

  const getErrorIcon = () => {
    switch (error.type) {
      case 'network':
        return '📡';
      case 'validation':
        return '⚠️';
      case 'auth':
        return '🔒';
      case 'server':
        return '🔧';
      default:
        return '❌';
    }
  };

  const getErrorColor = () => {
    switch (error.type) {
      case 'network':
        return 'border-orange-200 bg-orange-50';
      case 'validation':
        return 'border-yellow-200 bg-yellow-50';
      case 'auth':
        return 'border-purple-200 bg-purple-50';
      case 'server':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-red-200 bg-red-50';
    }
  };

  const getTextColor = () => {
    switch (error.type) {
      case 'network':
        return 'text-orange-800';
      case 'validation':
        return 'text-yellow-800';
      case 'auth':
        return 'text-purple-800';
      case 'server':
        return 'text-blue-800';
      default:
        return 'text-red-800';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`rounded-lg shadow-lg border-2 p-4 ${getErrorColor()}`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <span className="text-2xl">{getErrorIcon()}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-semibold ${getTextColor()}`}>
              {error.title}
            </h4>
            <p className={`text-sm mt-1 ${getTextColor()}`}>
              {error.message}
            </p>
            
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-500">
                {error.timestamp.toLocaleTimeString('es-ES')}
              </span>
              
              <div className="flex space-x-2">
                {error.retryable && (
                  <TouchOptimizedButton
                    variant="ghost"
                    size="sm"
                    onClick={handleRetry}
                    className="text-xs px-2 py-1"
                  >
                    Reintentar
                  </TouchOptimizedButton>
                )}
                
                <button
                  onClick={handleClose}
                  className={`text-lg leading-none hover:opacity-70 ${getTextColor()}`}
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Container for multiple error notifications
interface ErrorNotificationContainerProps {
  errors: ErrorDetails[];
  onRemoveError: (id: string) => void;
}

export function ErrorNotificationContainer({ 
  errors, 
  onRemoveError 
}: ErrorNotificationContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {errors.map((error, index) => (
        <div
          key={error.id}
          style={{ transform: `translateY(${index * 10}px)` }}
        >
          <ErrorNotification
            error={error}
            onClose={() => onRemoveError(error.id)}
            autoClose={!error.retryable}
          />
        </div>
      ))}
    </div>
  );
}