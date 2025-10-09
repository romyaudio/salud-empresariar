import { Transaction, Category, Budget, User, ApiResponse, PaginatedResponse, TransactionFilters, TransactionFormData } from '@/types';
import { TransactionModel } from '@/lib/models/Transaction';
import { CategoryModel } from '@/lib/models/Category';
import { BudgetModel } from '@/lib/models/Budget';
import { GraphQLService } from './graphqlService';
import { loadSampleDataForUser } from '../data/sampleData';

// Local storage keys
const STORAGE_KEYS = {
  TRANSACTIONS: 'budget_tracker_transactions',
  CATEGORIES: 'budget_tracker_categories',
  BUDGETS: 'budget_tracker_budgets',
  USER_DATA: 'budget_tracker_user_data',
} as const;

export class DataService {
  // Utility methods for local storage
  private static getFromStorage<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return [];
    }
  }

  private static saveToStorage<T>(key: string, data: T[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
    }
  }

  // Transaction methods
  static async getTransactions(userId: string, filters?: TransactionFilters): Promise<ApiResponse<Transaction[]>> {
    try {
      console.log('🔍 Getting transactions from GraphQL for user:', userId);
      
      // Try GraphQL first
      const result = await GraphQLService.getTransactions();
      if (!result.success) {
        console.error('❌ GraphQL failed:', result.error);
        return result;
      }
      
      let transactions = result.data || [];
      
      // No sample data loading - use real database only

      // Apply filters
      if (filters) {
        if (filters.type && filters.type !== 'all') {
          transactions = transactions.filter(t => t.type === filters.type);
        }
        if (filters.category) {
          transactions = transactions.filter(t => t.category === filters.category);
        }
        if (filters.dateFrom) {
          transactions = transactions.filter(t => t.date >= filters.dateFrom!);
        }
        if (filters.dateTo) {
          transactions = transactions.filter(t => t.date <= filters.dateTo!);
        }
        if (filters.amountMin !== undefined) {
          transactions = transactions.filter(t => t.amount >= filters.amountMin!);
        }
        if (filters.amountMax !== undefined) {
          transactions = transactions.filter(t => t.amount <= filters.amountMax!);
        }
        if (filters.paymentMethod) {
          transactions = transactions.filter(t => t.paymentMethod === filters.paymentMethod);
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          transactions = transactions.filter(t => 
            t.description.toLowerCase().includes(searchLower) ||
            t.category.toLowerCase().includes(searchLower) ||
            (t.subcategory && t.subcategory.toLowerCase().includes(searchLower)) ||
            (t.reference && t.reference.toLowerCase().includes(searchLower))
          );
        }
      }

      // Sort by date (newest first)
      transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return { success: true, data: transactions };
    } catch (error) {
      console.error('Error getting transactions:', error);
      return { success: false, error: 'Error al obtener las transacciones' };
    }
  }

  static async createTransaction(transaction: Transaction): Promise<ApiResponse<Transaction>> {
    try {
      console.log('🔍 Creating transaction via GraphQL');
      const transactionData = {
        type: transaction.type,
        amount: transaction.amount.toString(),
        description: transaction.description,
        category: transaction.category,
        subcategory: transaction.subcategory,
        date: transaction.date,
        paymentMethod: transaction.paymentMethod,
        reference: transaction.reference,
        tags: transaction.tags,
      };
      return await GraphQLService.createTransaction(transactionData);
    } catch (error) {
      console.error('❌ Error creating transaction:', error);
      return { success: false, error: 'Error al crear la transacción' };
    }
  }

  static async updateTransaction(id: string, updates: Partial<Transaction>): Promise<ApiResponse<Transaction>> {
    try {
      console.log('🔍 Updating transaction via GraphQL');
      const transactionData: any = {};
      if (updates.type) transactionData.type = updates.type;
      if (updates.amount) transactionData.amount = updates.amount.toString();
      if (updates.description) transactionData.description = updates.description;
      if (updates.category) transactionData.category = updates.category;
      if (updates.subcategory) transactionData.subcategory = updates.subcategory;
      if (updates.date) transactionData.date = updates.date;
      if (updates.paymentMethod) transactionData.paymentMethod = updates.paymentMethod;
      if (updates.reference) transactionData.reference = updates.reference;
      if (updates.tags) transactionData.tags = updates.tags;
      
      return await GraphQLService.updateTransaction(id, transactionData);
    } catch (error) {
      console.error('Error updating transaction:', error);
      return { success: false, error: 'Error al actualizar la transacción' };
    }
  }

  static async deleteTransaction(id: string): Promise<ApiResponse<boolean>> {
    try {
      console.log('🔍 Deleting transaction via GraphQL');
      return await GraphQLService.deleteTransaction(id);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      return { success: false, error: 'Error al eliminar la transacción' };
    }
  }

  // Category methods
  static async getCategories(userId: string): Promise<ApiResponse<Category[]>> {
    try {
      // Always use localStorage for categories for now (simpler and more reliable)
      let categories = this.getFromStorage<Category>(STORAGE_KEYS.CATEGORIES)
        .filter(c => c.userId === userId);

      // If no categories exist, load sample data (includes categories) - but only once per user
      if (categories.length === 0) {
        const hasLoadedSampleData = localStorage.getItem(`sample_data_loaded_${userId}`) === 'true';
        if (!hasLoadedSampleData) {
          console.log('🔍 Loading sample data for categories for user:', userId);
          loadSampleDataForUser(userId);
          localStorage.setItem(`sample_data_loaded_${userId}`, 'true');
          categories = this.getFromStorage<Category>(STORAGE_KEYS.CATEGORIES)
            .filter(c => c.userId === userId);
        } else {
          // If sample data was already loaded but no categories found, create default ones
          console.log('🔍 Creating default categories for user:', userId);
          categories = CategoryModel.createDefaultCategories(userId);
          const allCategories = this.getFromStorage<Category>(STORAGE_KEYS.CATEGORIES);
          allCategories.push(...categories);
          this.saveToStorage(STORAGE_KEYS.CATEGORIES, allCategories);
        }
      }

      // Sort by type and name
      categories.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'income' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });

      return { success: true, data: categories };
    } catch (error) {
      console.error('Error getting categories:', error);
      return { success: false, error: 'Error al obtener las categorías' };
    }
  }

  static async createCategory(category: Category): Promise<ApiResponse<Category>> {
    try {
      const categories = this.getFromStorage<Category>(STORAGE_KEYS.CATEGORIES);
      
      // Check for duplicate names
      const existingCategory = categories.find(c => 
        c.userId === category.userId && 
        c.name.toLowerCase() === category.name.toLowerCase() &&
        c.type === category.type
      );
      
      if (existingCategory) {
        return { success: false, error: 'Ya existe una categoría con ese nombre' };
      }

      categories.push(category);
      this.saveToStorage(STORAGE_KEYS.CATEGORIES, categories);

      return { success: true, data: category };
    } catch (error) {
      console.error('Error creating category:', error);
      return { success: false, error: 'Error al crear la categoría' };
    }
  }

  static async updateCategory(id: string, updates: Partial<Category>): Promise<ApiResponse<Category>> {
    try {
      const categories = this.getFromStorage<Category>(STORAGE_KEYS.CATEGORIES);
      const index = categories.findIndex(c => c.id === id);
      
      if (index === -1) {
        return { success: false, error: 'Categoría no encontrada' };
      }

      // Check for duplicate names if name is being updated
      if (updates.name) {
        const existingCategory = categories.find(c => 
          c.id !== id &&
          c.userId === categories[index].userId && 
          c.name.toLowerCase() === updates.name!.toLowerCase() &&
          c.type === (updates.type || categories[index].type)
        );
        
        if (existingCategory) {
          return { success: false, error: 'Ya existe una categoría con ese nombre' };
        }
      }

      categories[index] = { ...categories[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveToStorage(STORAGE_KEYS.CATEGORIES, categories);

      return { success: true, data: categories[index] };
    } catch (error) {
      console.error('Error updating category:', error);
      return { success: false, error: 'Error al actualizar la categoría' };
    }
  }

  static async deleteCategory(id: string): Promise<ApiResponse<boolean>> {
    try {
      const categories = this.getFromStorage<Category>(STORAGE_KEYS.CATEGORIES);
      const category = categories.find(c => c.id === id);
      
      if (!category) {
        return { success: false, error: 'Categoría no encontrada' };
      }

      // Check if category is being used in transactions
      const transactions = this.getFromStorage<Transaction>(STORAGE_KEYS.TRANSACTIONS);
      const isUsed = transactions.some(t => t.category === category.name);
      
      if (isUsed) {
        return { success: false, error: 'No se puede eliminar una categoría que tiene transacciones asociadas' };
      }

      const filteredCategories = categories.filter(c => c.id !== id);
      this.saveToStorage(STORAGE_KEYS.CATEGORIES, filteredCategories);

      return { success: true, data: true };
    } catch (error) {
      console.error('Error deleting category:', error);
      return { success: false, error: 'Error al eliminar la categoría' };
    }
  }

  // Budget methods
  static async getBudgets(userId: string): Promise<ApiResponse<Budget[]>> {
    try {
      // Always use localStorage for budgets for now (simpler and more reliable)
      const budgets = this.getFromStorage<Budget>(STORAGE_KEYS.BUDGETS)
        .filter(b => b.userId === userId);

      // Update spent amounts based on current transactions
      const transactions = this.getFromStorage<Transaction>(STORAGE_KEYS.TRANSACTIONS)
        .filter(t => t.userId === userId);

      const updatedBudgets = budgets.map(budget => 
        BudgetModel.updateSpentAmount(budget, transactions)
      );

      // Save updated budgets
      const allBudgets = this.getFromStorage<Budget>(STORAGE_KEYS.BUDGETS);
      updatedBudgets.forEach(updatedBudget => {
        const index = allBudgets.findIndex(b => b.id === updatedBudget.id);
        if (index !== -1) {
          allBudgets[index] = updatedBudget;
        }
      });
      this.saveToStorage(STORAGE_KEYS.BUDGETS, allBudgets);

      // Sort by creation date (newest first)
      updatedBudgets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return { success: true, data: updatedBudgets };
    } catch (error) {
      console.error('Error getting budgets:', error);
      return { success: false, error: 'Error al obtener los presupuestos' };
    }
  }

  static async createBudget(budget: Budget): Promise<ApiResponse<Budget>> {
    try {
      const budgets = this.getFromStorage<Budget>(STORAGE_KEYS.BUDGETS);
      budgets.push(budget);
      this.saveToStorage(STORAGE_KEYS.BUDGETS, budgets);

      return { success: true, data: budget };
    } catch (error) {
      console.error('Error creating budget:', error);
      return { success: false, error: 'Error al crear el presupuesto' };
    }
  }

  static async updateBudget(id: string, updates: Partial<Budget>): Promise<ApiResponse<Budget>> {
    try {
      const budgets = this.getFromStorage<Budget>(STORAGE_KEYS.BUDGETS);
      const index = budgets.findIndex(b => b.id === id);
      
      if (index === -1) {
        return { success: false, error: 'Presupuesto no encontrado' };
      }

      budgets[index] = { ...budgets[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveToStorage(STORAGE_KEYS.BUDGETS, budgets);

      return { success: true, data: budgets[index] };
    } catch (error) {
      console.error('Error updating budget:', error);
      return { success: false, error: 'Error al actualizar el presupuesto' };
    }
  }

  static async deleteBudget(id: string): Promise<ApiResponse<boolean>> {
    try {
      const budgets = this.getFromStorage<Budget>(STORAGE_KEYS.BUDGETS);
      const filteredBudgets = budgets.filter(b => b.id !== id);
      
      if (budgets.length === filteredBudgets.length) {
        return { success: false, error: 'Presupuesto no encontrado' };
      }

      this.saveToStorage(STORAGE_KEYS.BUDGETS, filteredBudgets);
      return { success: true, data: true };
    } catch (error) {
      console.error('Error deleting budget:', error);
      return { success: false, error: 'Error al eliminar el presupuesto' };
    }
  }

  // Dashboard data
  static async getDashboardData(userId: string): Promise<ApiResponse<any>> {
    try {
      console.log('🔍 DataService.getDashboardData - Starting for user:', userId);
      
      const transactionsResponse = await this.getTransactions(userId);
      console.log('🔍 Transactions response:', transactionsResponse.success ? 'Success' : 'Failed', transactionsResponse.error);
      
      const categoriesResponse = await this.getCategories(userId);
      console.log('🔍 Categories response:', categoriesResponse.success ? 'Success' : 'Failed', categoriesResponse.error);
      
      const budgetsResponse = await this.getBudgets(userId);
      console.log('🔍 Budgets response:', budgetsResponse.success ? 'Success' : 'Failed', budgetsResponse.error);

      if (!transactionsResponse.success) {
        console.error('❌ Failed to get transactions:', transactionsResponse.error);
        return { success: false, error: `Error al obtener transacciones: ${transactionsResponse.error}` };
      }
      
      if (!categoriesResponse.success) {
        console.error('❌ Failed to get categories:', categoriesResponse.error);
        return { success: false, error: `Error al obtener categorías: ${categoriesResponse.error}` };
      }
      
      if (!budgetsResponse.success) {
        console.error('❌ Failed to get budgets:', budgetsResponse.error);
        return { success: false, error: `Error al obtener presupuestos: ${budgetsResponse.error}` };
      }

      const transactions = transactionsResponse.data || [];
      const categories = categoriesResponse.data || [];
      const budgets = budgetsResponse.data || [];

      console.log('🔍 Dashboard data counts:', {
        transactions: transactions.length,
        categories: categories.length,
        budgets: budgets.length
      });

      // Calculate totals (handle empty transactions)
      const totals = transactions.length > 0 
        ? TransactionModel.calculateTotals(transactions)
        : { income: 0, expenses: 0, balance: 0 };

      console.log('🔍 Calculated totals:', totals);

      // Get recent transactions (last 10)
      const recentTransactions = transactions.slice(0, 10);

      // Calculate monthly data (last 12 months) - handle empty transactions
      const monthlyData = transactions.length > 0 
        ? this.calculateMonthlyData(transactions)
        : [];

      // Calculate category breakdown - handle empty transactions
      const categoryBreakdown = transactions.length > 0 
        ? this.calculateCategoryBreakdown(transactions, categories)
        : [];

      // Calculate budget status - handle empty budgets
      const budgetStatus = budgets.length > 0 
        ? BudgetModel.getActiveBudgets(budgets).map(budget => 
            BudgetModel.calculateStatus(budget)
          )
        : [];

      const dashboardData = {
        totalIncome: totals.income,
        totalExpenses: totals.expenses,
        balance: totals.balance,
        monthlyData,
        categoryBreakdown,
        recentTransactions,
        budgetStatus,
      };

      console.log('✅ Dashboard data created successfully:', dashboardData);
      return { success: true, data: dashboardData };
    } catch (error) {
      console.error('❌ DataService.getDashboardData - Catch error:', error);
      console.error('❌ Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      
      // Return a safe fallback dashboard data instead of failing
      const fallbackDashboardData = {
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        monthlyData: [],
        categoryBreakdown: [],
        recentTransactions: [],
        budgetStatus: [],
      };
      
      console.log('🔄 Returning fallback dashboard data');
      return { success: true, data: fallbackDashboardData };
    }
  }

  private static calculateMonthlyData(transactions: Transaction[]) {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    const monthlyMap = new Map();
    
    transactions.forEach(transaction => {
      const monthKey = TransactionModel.getMonthKey(transaction.date);
      
      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, {
          month: monthKey,
          income: 0,
          expenses: 0,
          balance: 0,
          transactionCount: 0,
        });
      }
      
      const monthData = monthlyMap.get(monthKey);
      monthData.transactionCount++;
      
      if (transaction.type === 'income') {
        monthData.income += transaction.amount;
      } else {
        monthData.expenses += transaction.amount;
      }
      
      monthData.balance = monthData.income - monthData.expenses;
    });

    return Array.from(monthlyMap.values())
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 12);
  }

  private static calculateCategoryBreakdown(transactions: Transaction[], categories: Category[]) {
    if (!transactions || transactions.length === 0) {
      return [];
    }

    const categoryMap = new Map();
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    transactions.forEach(transaction => {
      const category = transaction.category;
      
      if (!categoryMap.has(category)) {
        const categoryData = categories.find(c => c.name === category);
        categoryMap.set(category, {
          category,
          amount: 0,
          percentage: 0,
          color: categoryData?.color || '#6B7280',
          transactionCount: 0,
        });
      }
      
      const categoryData = categoryMap.get(category);
      categoryData.amount += transaction.amount;
      categoryData.transactionCount++;
    });

    // Calculate percentages
    categoryMap.forEach(categoryData => {
      categoryData.percentage = totalAmount > 0 ? (categoryData.amount / totalAmount) * 100 : 0;
    });

    return Array.from(categoryMap.values())
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10); // Top 10 categories
  }

  // Utility methods
  static async clearAllData(): Promise<void> {
    if (typeof window === 'undefined') return;
    
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Also clear sample data flags
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('sample_data_loaded_')) {
        localStorage.removeItem(key);
      }
    });
  }

  static async clearUserData(userId: string): Promise<void> {
    if (typeof window === 'undefined') return;
    
    console.log('🗑️ Clearing data for user:', userId);
    
    // Remove user's transactions
    const transactions = this.getFromStorage<Transaction>(STORAGE_KEYS.TRANSACTIONS);
    const filteredTransactions = transactions.filter(t => t.userId !== userId);
    this.saveToStorage(STORAGE_KEYS.TRANSACTIONS, filteredTransactions);
    
    // Remove user's categories
    const categories = this.getFromStorage<Category>(STORAGE_KEYS.CATEGORIES);
    const filteredCategories = categories.filter(c => c.userId !== userId);
    this.saveToStorage(STORAGE_KEYS.CATEGORIES, filteredCategories);
    
    // Remove user's budgets
    const budgets = this.getFromStorage<Budget>(STORAGE_KEYS.BUDGETS);
    const filteredBudgets = budgets.filter(b => b.userId !== userId);
    this.saveToStorage(STORAGE_KEYS.BUDGETS, filteredBudgets);
    
    // Remove sample data flag for this user
    localStorage.removeItem(`sample_data_loaded_${userId}`);
    
    console.log('✅ User data cleared for:', userId);
  }

  static async exportData(userId: string): Promise<ApiResponse<any>> {
    try {
      const transactions = await this.getTransactions(userId);
      const categories = await this.getCategories(userId);
      const budgets = await this.getBudgets(userId);

      const exportData = {
        transactions: transactions.data || [],
        categories: categories.data || [],
        budgets: budgets.data || [],
        exportedAt: new Date().toISOString(),
      };

      return { success: true, data: exportData };
    } catch (error) {
      console.error('Error exporting data:', error);
      return { success: false, error: 'Error al exportar los datos' };
    }
  }
}