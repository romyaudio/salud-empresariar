'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useTransactions } from '@/hooks/useTransactions';
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
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar monto
    if (!formData.amount.trim()) {
      newErrors.amount = 'El monto es obligatorio';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'El monto debe ser un número positivo';
      }
    }

    // Validar descripción
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    } else if (formData.description.trim().length < 3) {
      newErrors.description = 'La descripción debe tener al menos 3 caracteres';
    }

    // Validar fecha
    if (!formData.date) {
      newErrors.date = 'La fecha es obligatoria';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Permitir fecha de hoy
      
      if (selectedDate > today) {
        newErrors.date = 'La fecha no puede ser futura';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en los campos
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

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

      onSuccess?.();
    } catch (error) {
      console.error('Error al registrar ingreso:', error);
      setErrors({
        general: 'Error al registrar el ingreso. Por favor, inténtalo de nuevo.'
      });
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
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Monto *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              $
            </span>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('amount', e.target.value)}
              className={`pl-8 ${errors.amount ? 'border-red-500' : ''}`}
              disabled={isSubmitting}
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>

        {/* Campo de Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción *
          </label>
          <Input
            id="description"
            type="text"
            placeholder="Ej: Venta de productos, Servicios prestados..."
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('description', e.target.value)}
            className={errors.description ? 'border-red-500' : ''}
            disabled={isSubmitting}
            maxLength={100}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {formData.description.length}/100 caracteres
          </p>
        </div>

        {/* Campo de Fecha */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha *
          </label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('date', e.target.value)}
            className={errors.date ? 'border-red-500' : ''}
            disabled={isSubmitting}
            max={new Date().toISOString().split('T')[0]} // No permitir fechas futuras
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
          )}
        </div>

        {/* Error general */}
        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Registrando...
              </div>
            ) : (
              'Registrar Ingreso'
            )}
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancelar
            </Button>
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