'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { CategorySelector } from '@/components/categories/CategorySelector';
import { useTransactions } from '@/hooks/useTransactions';
import { Transaction } from '@/types';

interface ExpenseFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormData {
  amount: string;
  description: string;
  category: string;
  subcategory: string;
  date: string;
  paymentMethod: string;
  reference: string;
}

interface FormErrors {
  amount?: string;
  description?: string;
  category?: string;
  date?: string;
  general?: string;
}

export function ExpenseForm({ onSuccess, onCancel }: ExpenseFormProps) {
  const { createTransaction, loading: isLoading } = useTransactions();
  
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    description: '',
    category: '',
    subcategory: '',
    date: new Date().toISOString().split('T')[0], // Fecha actual por defecto
    paymentMethod: '',
    reference: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Opciones de métodos de pago
  const paymentMethods = [
    { value: '', label: 'Seleccionar método (opcional)' },
    { value: 'cash', label: '💵 Efectivo' },
    { value: 'card', label: '💳 Tarjeta' },
    { value: 'transfer', label: '🏦 Transferencia' },
    { value: 'check', label: '📝 Cheque' },
    { value: 'other', label: '📋 Otro' }
  ];

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

    // Validar categoría
    if (!formData.category.trim()) {
      newErrors.category = 'La categoría es obligatoria';
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
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Manejar cambio de categoría
  const handleCategoryChange = (category: string) => {
    handleInputChange('category', category);
  };

  // Manejar cambio de subcategoría
  const handleSubcategoryChange = (subcategory: string) => {
    handleInputChange('subcategory', subcategory);
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
        type: 'expense' as const,
        amount: formData.amount,
        description: formData.description.trim(),
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        date: formData.date,
        paymentMethod: formData.paymentMethod || undefined,
        reference: formData.reference.trim() || undefined
      };

      const result = await createTransaction(transactionData);
      
      if (!result.success) {
        throw new Error(result.error || 'Error al crear la transacción');
      }
      
      // Limpiar formulario después del éxito
      setFormData({
        amount: '',
        description: '',
        category: '',
        subcategory: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: '',
        reference: ''
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error al registrar gasto:', error);
      setErrors({
        general: 'Error al registrar el gasto. Por favor, inténtalo de nuevo.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Registrar Gasto
        </h2>
        <p className="text-sm text-gray-600">
          Registra un nuevo gasto y mantén control de tus finanzas
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
            placeholder="Ej: Compra de materiales, Pago de servicios..."
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

        {/* Selector de Categoría */}
        <div>
          <CategorySelector
            type="expense"
            selectedCategory={formData.category}
            selectedSubcategory={formData.subcategory}
            onCategoryChange={handleCategoryChange}
            onSubcategoryChange={handleSubcategoryChange}
            disabled={isSubmitting}
            required={true}
          />
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
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

        {/* Método de Pago (Opcional) */}
        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
            Método de Pago
          </label>
          <select
            id="paymentMethod"
            value={formData.paymentMethod}
            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {paymentMethods.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>

        {/* Referencia (Opcional) */}
        <div>
          <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
            Referencia
          </label>
          <Input
            id="reference"
            type="text"
            placeholder="Ej: Factura #123, Recibo #456..."
            value={formData.reference}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('reference', e.target.value)}
            disabled={isSubmitting}
            maxLength={50}
          />
          <p className="mt-1 text-xs text-gray-500">
            Número de factura, recibo u otra referencia (opcional)
          </p>
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
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Registrando...
              </div>
            ) : (
              'Registrar Gasto'
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
      <div className="mt-6 p-4 bg-red-50 rounded-md">
        <p className="text-xs text-red-600">
          💡 <strong>Tip:</strong> Los gastos se restarán automáticamente de tu balance total.
          Asegúrate de seleccionar la categoría correcta para un mejor seguimiento.
        </p>
      </div>
    </div>
  );
}