// Core data types based on design document

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  subcategory?: string;
  date: string; // ISO date string
  userId: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields for better tracking
  paymentMethod?: 'cash' | 'card' | 'transfer' | 'check' | 'other';
  reference?: string; // Invoice number, receipt number, etc.
  tags?: string[]; // For additional categorization
  attachments?: string[]; // URLs to receipt images, etc.
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  subcategories: string[];
  userId: string;
  color: string; // Hex color for UI
  icon?: string; // Icon name or emoji
  isDefault: boolean; // System default categories
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UserPreferences {
  currency: string;
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  defaultCategories: string[];
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    dailySummary: boolean;
    weeklyReport: boolean;
    monthlyReport: boolean;
  };
  budgetAlerts: {
    enabled: boolean;
    threshold: number; // Percentage (e.g., 80 for 80%)
  };
}

export interface Budget {
  id: string;
  userId: string;
  name: string;
  category: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  spent: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyData: MonthlyData[];
  categoryBreakdown: CategoryBreakdown[];
  recentTransactions: Transaction[];
  budgetStatus: BudgetStatus[];
}

export interface MonthlyData {
  month: string; // YYYY-MM format
  income: number;
  expenses: number;
  balance: number;
  transactionCount: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  transactionCount: number;
}

export interface BudgetStatus {
  budgetId: string;
  name: string;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  percentage: number;
  remainingAmount: number;
  status: 'on-track' | 'warning' | 'exceeded';
  daysRemaining: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Form types
export interface TransactionFormData {
  type: 'income' | 'expense';
  amount: string;
  description: string;
  category: string;
  subcategory?: string;
  date: string;
  paymentMethod?: string;
  reference?: string;
  tags?: string[];
}

export interface CategoryFormData {
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon?: string;
  subcategories: string[];
}

export interface BudgetFormData {
  name: string;
  category: string;
  amount: string;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: string;
}

// Filter and search types
export interface TransactionFilters {
  type?: 'income' | 'expense' | 'all';
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  paymentMethod?: string;
  search?: string;
}

export interface DateRange {
  start: string;
  end: string;
}

// Export types
export interface ExportOptions {
  format: 'csv' | 'pdf' | 'excel';
  dateRange: DateRange;
  includeCategories: string[];
  includeFields: string[];
}