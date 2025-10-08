'use client';

import { useState, useCallback, useEffect } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

interface ValidationRules {
  [key: string]: ValidationRule;
}

interface ValidationErrors {
  [key: string]: string | undefined;
}

export function useRealTimeValidation(rules: ValidationRules) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = useCallback((field: string, value: string): string | null => {
    const rule = rules[field];
    if (!rule) return null;

    // Required validation
    if (rule.required && (!value || value.trim() === '')) {
      return 'Este campo es obligatorio';
    }

    // Skip other validations if field is empty and not required
    if (!value || value.trim() === '') {
      return null;
    }

    // Min length validation
    if (rule.minLength && value.length < rule.minLength) {
      return `Debe tener al menos ${rule.minLength} caracteres`;
    }

    // Max length validation
    if (rule.maxLength && value.length > rule.maxLength) {
      return `No puede tener más de ${rule.maxLength} caracteres`;
    }

    // Numeric validations
    if (rule.min !== undefined || rule.max !== undefined) {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        return 'Debe ser un número válido';
      }
      
      if (rule.min !== undefined && numValue < rule.min) {
        return `Debe ser mayor o igual a ${rule.min}`;
      }
      
      if (rule.max !== undefined && numValue > rule.max) {
        return `Debe ser menor o igual a ${rule.max}`;
      }
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      return 'Formato inválido';
    }

    // Custom validation
    if (rule.custom) {
      return rule.custom(value);
    }

    return null;
  }, [rules]);

  const validateFieldWithFeedback = useCallback((field: string, value: string) => {
    const error = validateField(field, value);
    
    setErrors(prev => ({
      ...prev,
      [field]: error || undefined
    }));

    // Trigger haptic feedback for errors on mobile
    if (error && 'vibrate' in navigator) {
      navigator.vibrate(100);
    }

    return !error;
  }, [validateField]);

  const handleFieldChange = useCallback((field: string, value: string) => {
    // Only validate if field has been touched
    if (touched[field]) {
      validateFieldWithFeedback(field, value);
    }
  }, [touched, validateFieldWithFeedback]);

  const handleFieldBlur = useCallback((field: string, value: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateFieldWithFeedback(field, value);
  }, [validateFieldWithFeedback]);

  const validateAll = useCallback((data: { [key: string]: string }) => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(rules).forEach(field => {
      const error = validateField(field, data[field] || '');
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(rules).reduce((acc, field) => ({ ...acc, [field]: true }), {}));

    return isValid;
  }, [rules, validateField]);

  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  return {
    errors,
    touched,
    validateField: validateFieldWithFeedback,
    handleFieldChange,
    handleFieldBlur,
    validateAll,
    clearErrors,
    clearFieldError,
    hasErrors: Object.values(errors).some(error => !!error)
  };
}