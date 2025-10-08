'use client';

import { useEffect } from 'react';
import { ErrorPage } from '@/components/error/ErrorPage';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App Error:', error);
  }, [error]);

  return (
    <ErrorPage
      title="Error de la aplicación"
      message="Ha ocurrido un error inesperado en la aplicación."
      onRetry={reset}
    />
  );
}