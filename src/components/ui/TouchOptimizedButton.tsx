'use client';

import { ButtonHTMLAttributes, ReactNode, useState } from 'react';

interface TouchOptimizedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  loading?: boolean;
  children: ReactNode;
}

export function TouchOptimizedButton({
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  children,
  className = '',
  onClick,
  disabled,
  ...props
}: TouchOptimizedButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleTouchStart = () => {
    setIsPressed(true);
    
    // Trigger haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) return;
    onClick?.(e);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return `
          bg-blue-600 text-white border-blue-600
          hover:bg-blue-700 hover:border-blue-700
          active:bg-blue-800 active:border-blue-800
          disabled:bg-blue-300 disabled:border-blue-300
        `;
      case 'secondary':
        return `
          bg-white text-gray-700 border-gray-300
          hover:bg-gray-50 hover:border-gray-400
          active:bg-gray-100 active:border-gray-500
          disabled:bg-gray-100 disabled:text-gray-400
        `;
      case 'danger':
        return `
          bg-red-600 text-white border-red-600
          hover:bg-red-700 hover:border-red-700
          active:bg-red-800 active:border-red-800
          disabled:bg-red-300 disabled:border-red-300
        `;
      case 'ghost':
        return `
          bg-transparent text-gray-600 border-transparent
          hover:bg-gray-100 hover:text-gray-700
          active:bg-gray-200
          disabled:text-gray-400
        `;
      default:
        return '';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm min-h-[40px]';
      case 'md':
        return 'px-4 py-3 text-base min-h-[48px]';
      case 'lg':
        return 'px-6 py-4 text-lg min-h-[56px]';
      default:
        return '';
    }
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      disabled={disabled || loading}
      className={`
        relative inline-flex items-center justify-center
        font-medium rounded-lg border-2
        transition-all duration-150 ease-in-out
        touch-manipulation
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:cursor-not-allowed disabled:opacity-60
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${isPressed ? 'scale-95' : 'scale-100'}
        ${className}
      `}
      style={{
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none'
      }}
    >
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Content */}
      <div className={`flex items-center space-x-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {icon && (
          <span className="text-lg">{icon}</span>
        )}
        <span>{children}</span>
      </div>

      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-lg overflow-hidden">
        <div 
          className={`absolute inset-0 bg-white transition-opacity duration-150 ${
            isPressed ? 'opacity-20' : 'opacity-0'
          }`} 
        />
      </div>
    </button>
  );
}