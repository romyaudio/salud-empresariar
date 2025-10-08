'use client';

import { forwardRef, SelectHTMLAttributes, useState } from 'react';

interface Option {
  value: string;
  label: string;
  icon?: string;
}

interface TouchOptimizedSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  icon?: string;
  options: Option[];
  placeholder?: string;
}

export const TouchOptimizedSelect = forwardRef<HTMLSelectElement, TouchOptimizedSelectProps>(
  ({ label, error, icon, options, placeholder, className = '', ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!props.value || !!props.defaultValue);

    const handleFocus = () => {
      setIsFocused(true);
      
      // Trigger haptic feedback on focus
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    return (
      <div className="relative">
        {/* Floating label */}
        {label && (
          <label
            className={`absolute left-3 transition-all duration-200 pointer-events-none z-10 ${
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
          <div className="absolute left-3 top-4 text-gray-400 pointer-events-none z-10">
            <span className="text-lg">{icon}</span>
          </div>
        )}

        {/* Select field */}
        <select
          ref={ref}
          {...props}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`
            w-full px-3 py-4 border-2 rounded-lg transition-all duration-200
            text-base leading-tight appearance-none bg-white
            ${icon ? 'pl-10' : 'pl-3'}
            ${label ? 'pt-6 pb-2' : 'py-4'}
            pr-10
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
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            className={`w-5 h-5 transition-colors duration-200 ${
              isFocused ? 'text-blue-500' : 'text-gray-400'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

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

TouchOptimizedSelect.displayName = 'TouchOptimizedSelect';