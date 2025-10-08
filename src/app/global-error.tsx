'use client';

import { useEffect } from 'react';
import { ErrorPage } from '@/components/error/ErrorPage';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <ErrorPage
          title="Error crítico"
          message="Ha ocurrido un error crítico en la aplicación. Por favor, recarga la página."
          onRetry={reset}
        />
      </body>
    </html>
  );
}