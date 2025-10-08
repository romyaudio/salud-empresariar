'use client';

import { useState, useCallback } from 'react';
import { ErrorDetails } from '@/components/error/ErrorNotification';

export type ErrorType = 'network' | 'validation' | 'auth' | 'server' | 'unknown';

interface CreateErrorOptions {
  title?: string;
  message: string;
  type?: ErrorType;
  retryable?: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function useErrorHandler() {
  const [errors, setErrors] = useState<ErrorDetails[]>([]);

  const addError = useCallback((options: CreateErrorOptions): string => {
    const id = Math.random().toString(36).substr(2, 9);
    
    const error: ErrorDetails = {
      id,
      title: options.title || getDefaultTitle(options.type || 'unknown'),
      message: options.message,
      type: options.type || 'unknown',
      timestamp: new Date(),
      retryable: options.retryable || false,
      onRetry: options.onRetry,
      onDismiss: options.onDismiss
    };

    setErrors(prev => [...prev, error]);

    // Auto-remove non-retryable errors after delay
    if (!error.retryable) {
      setTimeout(() => {
        removeError(id);
      }, 5000);
    }

    return id;
  }, []);

  const removeError = useCallback((id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
  }, []);

  // Convenience methods for different error types
  const handleNetworkError = useCallback((
    message: string = 'Error de conexión. Verifica tu conexión a internet.',
    onRetry?: () => void
  ) => {
    return addError({
      title: 'Error de Conexión',
      message,
      type: 'network',
      retryable: !!onRetry,
      onRetry
    });
  }, [addError]);

  const handleValidationError = useCallback((
    message: string,
    field?: string
  ) => {
    const title = field ? `Error en ${field}` : 'Error de Validación';
    return addError({
      title,
      message,
      type: 'validation',
      retryable: false
    });
  }, [addError]);

  const handleAuthError = useCallback((
    message: string = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
    onRetry?: () => void
  ) => {
    return addError({
      title: 'Error de Autenticación',
      message,
      type: 'auth',
      retryable: !!onRetry,
      onRetry
    });
  }, [addError]);

  const handleServerError = useCallback((
    message: string = 'Error del servidor. Inténtalo de nuevo más tarde.',
    onRetry?: () => void
  ) => {
    return addError({
      title: 'Error del Servidor',
      message,
      type: 'server',
      retryable: !!onRetry,
      onRetry
    });
  }, [addError]);

  const handleUnknownError = useCallback((
    error: Error,
    onRetry?: () => void
  ) => {
    return addError({
      title: 'Error Inesperado',
      message: error.message || 'Ha ocurrido un error inesperado.',
      type: 'unknown',
      retryable: !!onRetry,
      onRetry
    });
  }, [addError]);

  // Handle different types of errors automatically
  const handleError = useCallback((
    error: unknown,
    context?: string,
    onRetry?: () => void
  ) => {
    if (error instanceof Error) {
      // Network errors
      if (error.name === 'NetworkError' || error.message.includes('fetch')) {
        return handleNetworkError(
          `${context ? `${context}: ` : ''}Error de conexión`,
          onRetry
        );
      }

      // Auth errors
      if (error.message.includes('Unauthorized') || error.message.includes('401')) {
        return handleAuthError(undefined, onRetry);
      }

      // Server errors
      if (error.message.includes('500') || error.message.includes('Server Error')) {
        return handleServerError(
          `${context ? `${context}: ` : ''}Error del servidor`,
          onRetry
        );
      }

      // Validation errors
      if (error.message.includes('validation') || error.message.includes('invalid')) {
        return handleValidationError(
          `${context ? `${context}: ` : ''}${error.message}`
        );
      }

      // Unknown errors
      return handleUnknownError(error, onRetry);
    }

    // Handle string errors
    if (typeof error === 'string') {
      return addError({
        message: `${context ? `${context}: ` : ''}${error}`,
        type: 'unknown',
        retryable: !!onRetry,
        onRetry
      });
    }

    // Handle unknown error types
    return addError({
      message: `${context ? `${context}: ` : ''}Error desconocido`,
      type: 'unknown',
      retryable: !!onRetry,
      onRetry
    });
  }, [addError, handleNetworkError, handleAuthError, handleServerError, handleValidationError, handleUnknownError]);

  return {
    errors,
    addError,
    removeError,
    clearAllErrors,
    handleError,
    handleNetworkError,
    handleValidationError,
    handleAuthError,
    handleServerError,
    handleUnknownError
  };
}

function getDefaultTitle(type: ErrorType): string {
  switch (type) {
    case 'network':
      return 'Error de Conexión';
    case 'validation':
      return 'Error de Validación';
    case 'auth':
      return 'Error de Autenticación';
    case 'server':
      return 'Error del Servidor';
    default:
      return 'Error';
  }
}