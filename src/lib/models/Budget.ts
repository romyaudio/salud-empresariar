import { Budget, BudgetFormData, BudgetStatus, Transaction } from '@/types';
import { generateId } from '@/lib/utils';

export class BudgetModel {
  static create(data: BudgetFormData, userId: string): Budget {
    const now = new Date().toISOString();
    const startDate = new Date(data.startDate);
    const endDate = this.calculateEndDate(startDate, data.period);
    
    return {
      id: generateId(),
      userId,
      name: data.name.trim(),
      category: data.category,
      amount: parseFloat(data.amount),
      period: data.period,
      startDate: data.startDate,
      endDate: endDate.toISOString().split('T')[0],
      spent: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
  }

  static validate(data: BudgetFormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Name validation
    if (!data.name.trim()) {
      errors.push('El nombre del presupuesto es requerido');
    }
    if (data.name.length > 100) {
      errors.push('El nombre no puede exceder 100 caracteres');
    }

    // Amount validation
    const amount = parseFloat(data.amount);
    if (isNaN(amount) || amount <= 0) {
      errors.push('El monto debe ser un número mayor a 0');
    }
    if (amount > 999999999) {
      errors.push('El monto no puede exceder $999,999,999');
    }

    // Category validation
    if (!data.category.trim()) {
      errors.push('La categoría es requerida');
    }

    // Date validation
    if (!data.startDate) {
      errors.push('La fecha de inicio es requerida');
    } else {
      const startDate = new Date(data.startDate);
      const now = new Date();
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(now.getFullYear() + 1);
      
      if (startDate > oneYearFromNow) {
        errors.push('La fecha de inicio no puede ser mayor a un año en el futuro');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static calculateEndDate(startDate: Date, period: 'weekly' | 'monthly' | 'yearly'): Date {
    const endDate = new Date(startDate);
    
    switch (period) {
      case 'weekly':
        endDate.setDate(endDate.getDate() + 7);
        break;
      case 'monthly':
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'yearly':
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }
    
    return endDate;
  }

  static updateSpentAmount(budget: Budget, transactions: Transaction[]): Budget {
    const budgetTransactions = transactions.filter(transaction => 
      transaction.type === 'expense' &&
      transaction.category === budget.category &&
      transaction.date >= budget.startDate &&
      transaction.date <= budget.endDate
    );

    const spent = budgetTransactions.reduce((total, transaction) => total + transaction.amount, 0);

    return {
      ...budget,
      spent,
      updatedAt: new Date().toISOString(),
    };
  }

  static calculateStatus(budget: Budget): BudgetStatus {
    const percentage = (budget.spent / budget.amount) * 100;
    const remainingAmount = budget.amount - budget.spent;
    
    let status: 'on-track' | 'warning' | 'exceeded';
    if (percentage >= 100) {
      status = 'exceeded';
    } else if (percentage >= 80) {
      status = 'warning';
    } else {
      status = 'on-track';
    }

    const endDate = new Date(budget.endDate);
    const now = new Date();
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    return {
      budgetId: budget.id,
      name: budget.name,
      category: budget.category,
      budgetAmount: budget.amount,
      spentAmount: budget.spent,
      percentage: Math.round(percentage * 100) / 100,
      remainingAmount,
      status,
      daysRemaining,
    };
  }

  static isActive(budget: Budget): boolean {
    if (!budget.isActive) return false;
    
    const now = new Date();
    const endDate = new Date(budget.endDate);
    
    return now <= endDate;
  }

  static getActiveBudgets(budgets: Budget[]): Budget[] {
    return budgets.filter(budget => this.isActive(budget));
  }

  static getBudgetsByCategory(budgets: Budget[], category: string): Budget[] {
    return budgets.filter(budget => budget.category === category);
  }

  static renewBudget(budget: Budget): Budget {
    const now = new Date();
    const newStartDate = now.toISOString().split('T')[0];
    const newEndDate = this.calculateEndDate(now, budget.period);

    return {
      ...budget,
      id: generateId(),
      startDate: newStartDate,
      endDate: newEndDate.toISOString().split('T')[0],
      spent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  static formatPeriod(period: 'weekly' | 'monthly' | 'yearly'): string {
    const periods = {
      weekly: 'Semanal',
      monthly: 'Mensual',
      yearly: 'Anual',
    };
    
    return periods[period];
  }

  static getStatusColor(status: 'on-track' | 'warning' | 'exceeded'): string {
    const colors = {
      'on-track': '#10B981',
      'warning': '#F59E0B',
      'exceeded': '#EF4444',
    };
    
    return colors[status];
  }

  static getStatusText(status: 'on-track' | 'warning' | 'exceeded'): string {
    const texts = {
      'on-track': 'En progreso',
      'warning': 'Cerca del límite',
      'exceeded': 'Excedido',
    };
    
    return texts[status];
  }
}