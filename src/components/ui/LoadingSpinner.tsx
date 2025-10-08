'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  className = '' 
}: LoadingSpinnerProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4 border-2';
      case 'md':
        return 'w-6 h-6 border-2';
      case 'lg':
        return 'w-8 h-8 border-3';
      case 'xl':
        return 'w-12 h-12 border-4';
      default:
        return 'w-6 h-6 border-2';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'border-blue-500 border-t-transparent';
      case 'secondary':
        return 'border-gray-500 border-t-transparent';
      case 'white':
        return 'border-white border-t-transparent';
      case 'gray':
        return 'border-gray-300 border-t-transparent';
      default:
        return 'border-blue-500 border-t-transparent';
    }
  };

  return (
    <div
      className={`
        ${getSizeClasses()} 
        ${getColorClasses()} 
        rounded-full animate-spin 
        ${className}
      `}
      role="status"
      aria-label="Cargando"
    />
  );
}

// Loading overlay component
interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function LoadingOverlay({ 
  isVisible, 
  message = 'Cargando...', 
  size = 'lg',
  className = '' 
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className={`
      fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 
      ${className}
    `}>
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size={size} />
          <p className="text-gray-700 text-center">{message}</p>
        </div>
      </div>
    </div>
  );
}

// Skeleton loader component
interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  animate?: boolean;
}

export function Skeleton({ 
  width = '100%', 
  height = '1rem', 
  className = '',
  animate = true 
}: SkeletonProps) {
  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`
        bg-gray-200 rounded 
        ${animate ? 'animate-pulse' : ''} 
        ${className}
      `}
      style={{ width: widthStyle, height: heightStyle }}
      role="status"
      aria-label="Cargando contenido"
    />
  );
}

// Card skeleton
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="animate-pulse space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton width={40} height={40} className="rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton height={16} width="75%" />
            <Skeleton height={12} width="50%" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton height={12} />
          <Skeleton height={12} width="80%" />
        </div>
      </div>
    </div>
  );
}

// List skeleton
export function ListSkeleton({ 
  items = 3, 
  className = '' 
}: { 
  items?: number; 
  className?: string; 
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}