'use client';

import { useState } from 'react';
import { TouchOptimizedButton } from '@/components/ui/TouchOptimizedButton';
import { TouchOptimizedInput } from '@/components/ui/TouchOptimizedInput';
import { TouchOptimizedSelect } from '@/components/ui/TouchOptimizedSelect';
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
        <TouchOptimizedInput
          label="Monto *"
          icon="💸"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={formData.amount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('amount', e.target.value)}
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
            placeholder="Ej: Compra de materiales, Pago de servicios..."
            value={formData.description}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('description', e.target.value)}
            error={errors.description}
            disabled={isSubmitting}
            maxLength={100}
          />
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
        <TouchOptimizedInput
          label="Fecha *"
          icon="📅"
          type="date"
          value={formData.date}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('date', e.target.value)}
          error={errors.date}
          disabled={isSubmitting}
          max={new Date().toISOString().split('T')[0]} // No permitir fechas futuras
        />

        {/* Método de Pago (Opcional) */}
        <TouchOptimizedSelect
          label="Método de Pago"
          icon="💳"
          value={formData.paymentMethod}
          onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
          disabled={isSubmitting}
          options={paymentMethods}
          placeholder="Seleccionar método (opcional)"
        />

        {/* Referencia (Opcional) */}
        <div>
          <TouchOptimizedInput
            label="Referencia"
            icon="🧾"
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
        <div className="flex flex-col gap-3 pt-4">
          <TouchOptimizedButton
            type="submit"
            variant="primary"
            size="lg"
            icon="💸"
            loading={isSubmitting || isLoading}
            disabled={isSubmitting || isLoading}
            className="w-full bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700"
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Gasto'}
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
      <div className="mt-6 p-4 bg-red-50 rounded-md">
        <p className="text-xs text-red-600">
          💡 <strong>Tip:</strong> Los gastos se restarán automáticamente de tu balance total.
          Asegúrate de seleccionar la categoría correcta para un mejor seguimiento.
        </p>
      </div>
    </div>
  );
}