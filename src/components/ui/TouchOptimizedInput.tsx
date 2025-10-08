'use client';

import { forwardRef, InputHTMLAttributes, useState, useEffect } from 'react';

interface TouchOptimizedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const TouchOptimizedInput = forwardRef<HTMLInputElement, TouchOptimizedInputProps>(
  ({ label, error, icon, className = '', onFocus, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    useEffect(() => {
      setHasValue(!!props.value || !!props.defaultValue);
    }, [props.value, props.defaultValue]);

    const handleFocus = () => {
      setIsFocused(true);
      onFocus?.();
      
      // Trigger haptic feedback on focus
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    };

    const handleBlur = () => {
      setIsFocused(false);
      onBlur?.();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    return (
      <div className="relative">
        {/* Floating label */}
        {label && (
          <label
            className={`absolute left-3 transition-all duration-200 pointer-events-none ${
              isFocused || hasValue
                ? 'top-2 text-xs text-blue-600 font-medium'
                : 'top-4 text-base text-gray-500'
            } ${icon ? 'left-10' : 'left-3'}`}
          >
            {label}
          </label>
        )}

        {/* Icon */}
        {icon && (
          <div className="absolute left-3 top-4 text-gray-400 pointer-events-none">
            <span className="text-lg">{icon}</span>
          </div>
        )}

        {/* Input field */}
        <input
          ref={ref}
          {...props}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            w-full px-3 py-4 border-2 rounded-lg transition-all duration-200
            text-base leading-tight
            ${icon ? 'pl-10' : 'pl-3'}
            ${label ? 'pt-6 pb-2' : 'py-4'}
            ${isFocused 
              ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50' 
              : error 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 bg-white hover:border-gray-400'
            }
            ${error ? 'border-red-500' : ''}
            focus:outline-none
            touch-manipulation
            ${className}
          `}
          style={{
            fontSize: '16px', // Prevents zoom on iOS
            minHeight: '56px', // Touch-friendly height
            WebkitAppearance: 'none', // Remove iOS styling
            WebkitTapHighlightColor: 'transparent' // Remove tap highlight
          }}
        />

        {/* Error message */}
        {error && (
          <div className="mt-2 flex items-center space-x-1">
            <span className="text-red-500 text-sm">⚠️</span>
            <span className="text-red-600 text-sm">{error}</span>
          </div>
        )}

        {/* Focus indicator */}
        <div
          className={`absolute bottom-0 left-0 h-0.5 bg-blue-500 transition-all duration-200 ${
            isFocused ? 'w-full' : 'w-0'
          }`}
        />
      </div>
    );
  }
);

TouchOptimizedInput.displayName = 'TouchOptimizedInput';