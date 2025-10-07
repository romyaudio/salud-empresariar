import { Transaction, TransactionFormData } from '@/types';
import { generateId } from '@/lib/utils';

export class TransactionModel {
  static create(data: TransactionFormData, userId: string): Transaction {
    const now = new Date().toISOString();
    
    return {
      id: generateId(),
      type: data.type,
      amount: parseFloat(data.amount),
      description: data.description.trim(),
      category: data.category,
      subcategory: data.subcategory?.trim() || undefined,
      date: data.date,
      userId,
      paymentMethod: data.paymentMethod as any,
      reference: data.reference?.trim() || undefined,
      tags: data.tags?.filter(tag => tag.trim()) || [],
      attachments: [],
      createdAt: now,
      updatedAt: now,
    };
  }

  static validate(data: TransactionFormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Amount validation
    const amount = parseFloat(data.amount);
    if (isNaN(amount) || amount <= 0) {
      errors.push('El monto debe ser un número mayor a 0');
    }
    if (amount > 999999999) {
      errors.push('El monto no puede exceder $999,999,999');
    }

    // Description validation
    if (!data.description.trim()) {
      errors.push('La descripción es requerida');
    }
    if (data.description.length > 200) {
      errors.push('La descripción no puede exceder 200 caracteres');
    }

    // Category validation
    if (!data.category.trim()) {
      errors.push('La categoría es requerida');
    }

    // Date validation
    if (!data.date) {
      errors.push('La fecha es requerida');
    } else {
      const date = new Date(data.date);
      const now = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      
      if (date > now) {
        errors.push('La fecha no puede ser futura');
      }
      if (date < oneYearAgo) {
        errors.push('La fecha no puede ser mayor a un año atrás');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static update(transaction: Transaction, updates: Partial<TransactionFormData>): Transaction {
    const updatedTransaction = { ...transaction };
    
    if (updates.amount !== undefined) {
      updatedTransaction.amount = parseFloat(updates.amount);
    }
    if (updates.description !== undefined) {
      updatedTransaction.description = updates.description.trim();
    }
    if (updates.category !== undefined) {
      updatedTransaction.category = updates.category;
    }
    if (updates.subcategory !== undefined) {
      updatedTransaction.subcategory = updates.subcategory?.trim() || undefined;
    }
    if (updates.date !== undefined) {
      updatedTransaction.date = updates.date;
    }
    if (updates.paymentMethod !== undefined) {
      updatedTransaction.paymentMethod = updates.paymentMethod as any;
    }
    if (updates.reference !== undefined) {
      updatedTransaction.reference = updates.reference?.trim() || undefined;
    }
    if (updates.tags !== undefined) {
      updatedTransaction.tags = updates.tags.filter(tag => tag.trim());
    }

    updatedTransaction.updatedAt = new Date().toISOString();
    
    return updatedTransaction;
  }

  static formatAmount(amount: number, currency: string = 'COP'): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }

  static getMonthKey(date: string): string {
    return date.substring(0, 7); // YYYY-MM
  }

  static filterByDateRange(transactions: Transaction[], startDate: string, endDate: string): Transaction[] {
    return transactions.filter(transaction => {
      const transactionDate = transaction.date;
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }

  static groupByCategory(transactions: Transaction[]): Record<string, Transaction[]> {
    return transactions.reduce((groups, transaction) => {
      const category = transaction.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(transaction);
      return groups;
    }, {} as Record<string, Transaction[]>);
  }

  static calculateTotals(transactions: Transaction[]): { income: number; expenses: number; balance: number } {
    const totals = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.income += transaction.amount;
        } else {
          acc.expenses += transaction.amount;
        }
        return acc;
      },
      { income: 0, expenses: 0, balance: 0 }
    );

    totals.balance = totals.income - totals.expenses;
    return totals;
  }
}