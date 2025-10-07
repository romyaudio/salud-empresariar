// Core data types based on design document

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  subcategory?: string;
  date: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  subcategories: string[];
  userId: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  currency: string;
  dateFormat: string;
  defaultCategories: string[];
}

export interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyData: MonthlyData[];
  categoryBreakdown: CategoryBreakdown[];
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}