'use client';

import { useState } from 'react';
import { TouchOptimizedButton } from '@/components/ui/TouchOptimizedButton';
import { TouchOptimizedInput } from '@/components/ui/TouchOptimizedInput';
import { useTransactions } from '@/hooks/useTransactions';
import { useRealTimeValidation } from '@/hooks/useRealTimeValidation';
import { Transaction } from '@/types';

interface IncomeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormData {
  amount: string;
  description: string;
  date: string;
}

interface FormErrors {
  amount?: string;
  description?: string;
  date?: string;
  general?: string;
}

export function IncomeForm({ onSuccess, onCancel }: IncomeFormProps) {
  const { createTransaction, loading: isLoading } = useTransactions();
  
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0], // Fecha actual por defecto
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string>('');

  // Real-time validation
  const {
    errors,
    handleFieldChange,
    handleFieldBlur,
    validateAll,
    clearErrors
  } = useRealTimeValidation({
    amount: {
      required: true,
      min: 0.01,
      custom: (value) => {
        const num = parseFloat(value);
        if (isNaN(num)) return 'Debe ser un número válido';
        if (num <= 0) return 'El monto debe ser positivo';
        return null;
      }
    },
    description: {
      required: true,
      minLength: 3,
      maxLength: 100
    },
    date: {
      required: true,
      custom: (value) => {
        if (!value) return 'La fecha es obligatoria';
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (selectedDate > today) return 'La fecha no puede ser futura';
        return null;
      }
    }
  });

  // Manejar cambios en los campos
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Real-time validation
    handleFieldChange(field, value);
    
    // Clear general error when user starts typing
    if (generalError) {
      setGeneralError('');
    }
  };

  // Manejar blur de los campos
  const handleInputBlur = (field: keyof FormData, value: string) => {
    handleFieldBlur(field, value);
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAll({
      amount: formData.amount,
      description: formData.description,
      date: formData.date
    })) {
      return;
    }

    setIsSubmitting(true);
    setGeneralError('');

    try {
      const transactionData = {
        type: 'income' as const,
        amount: formData.amount,
        description: formData.description.trim(),
        category: 'Ingresos', // Categoría por defecto para ingresos
        date: formData.date
      };

      const result = await createTransaction(transactionData);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al crear la transacción');
      }
      
      // Limpiar formulario después del éxito
      setFormData({
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      
      clearErrors();
      onSuccess?.();
    } catch (error) {
      console.error('Error al registrar ingreso:', error);
      setGeneralError('Error al registrar el ingreso. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Registrar Ingreso
        </h2>
        <p className="text-sm text-gray-600">
          Registra un nuevo ingreso para mantener actualizado tu balance
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo de Monto */}
        <TouchOptimizedInput
          label="Monto *"
          icon="💰"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={formData.amount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('amount', e.target.value)}
          onBlur={() => handleInputBlur('amount', formData.amount)}
          error={errors.amount}
          disabled={isSubmitting}
          inputMode="decimal"
        />

        {/* Campo de Descripción */}
        <div>
          <TouchOptimizedInput
            label="Descripción *"
            icon="📝"
            type="text"
            placeholder="Ej: Venta de productos, Servicios prestados..."
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('description', e.target.value)}
            onBlur={() => handleInputBlur('description', formData.description)}
            error={errors.description}
            disabled={isSubmitting}
            maxLength={100}
          />
          <p className="mt-1 text-xs text-gray-500">
            {formData.description.length}/100 caracteres
          </p>
        </div>

        {/* Campo de Fecha */}
        <TouchOptimizedInput
          label="Fecha *"
          icon="📅"
          type="date"
          value={formData.date}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('date', e.target.value)}
          onBlur={() => handleInputBlur('date', formData.date)}
          error={errors.date}
          disabled={isSubmitting}
          max={new Date().toISOString().split('T')[0]} // No permitir fechas futuras
        />

        {/* Error general */}
        {generalError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{generalError}</p>
          </div>
        )}

        {/* Botones */}
        <div className="flex flex-col gap-3 pt-4">
          <TouchOptimizedButton
            type="submit"
            variant="primary"
            size="lg"
            icon="💰"
            loading={isSubmitting || isLoading}
            disabled={isSubmitting || isLoading}
            className="w-full bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Ingreso'}
          </TouchOptimizedButton>
          
          {onCancel && (
            <TouchOptimizedButton
              type="button"
              variant="secondary"
              size="lg"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full"
            >
              Cancelar
            </TouchOptimizedButton>
          )}
        </div>
      </form>

      {/* Información adicional */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-xs text-blue-600">
          💡 <strong>Tip:</strong> Los ingresos se sumarán automáticamente a tu balance total.
          Asegúrate de ingresar el monto correcto.
        </p>
      </div>
    </div>
  );
}