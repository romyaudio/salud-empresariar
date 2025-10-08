import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { 
  CREATE_TRANSACTION, 
  UPDATE_TRANSACTION, 
  DELETE_TRANSACTION,
  GET_TRANSACTIONS,
  GET_TRANSACTION,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  GET_CATEGORIES,
  GET_DASHBOARD_DATA,
  CREATE_BUDGET,
  GET_BUDGETS
} from '../graphql/operations';
import { Transaction, Category, Budget, TransactionFormData, CategoryFormData, BudgetFormData, ApiResponse, DashboardData } from '@/types';
import { isDemoMode } from '../amplify';

// Create GraphQL client
const client = generateClient();

export class GraphQLService {
  // Helper method to get current user ID
  private static async getCurrentUserId(): Promise<string> {
    if (isDemoMode()) {
      return 'demo-user';
    }
    
    try {
      const user = await getCurrentUser();
      return user.userId;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw new Error('Usuario no autenticado');
    }
  }

  // Transaction operations
  static async createTransaction(data: TransactionFormData): Promise<ApiResponse<Transaction>> {
    try {
      if (isDemoMode()) {
        // Return mock response in demo mode
        const mockTransaction: Transaction = {
          id: `demo-${Date.now()}`,
          type: data.type,
          amount: parseFloat(data.amount),
          description: data.description,
          category: data.category,
          subcategory: data.subcategory,
          date: data.date,
          userId: 'demo-user',
          paymentMethod: data.paymentMethod as any,
          reference: data.reference,
          tags: data.tags,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        return { success: true, data: mockTransaction };
      }

      console.log('🔍 GraphQL createTransaction - Starting...');
      
      const userId = await this.getCurrentUserId();
      console.log('🔍 Current user ID:', userId);
      
      const variables = {
        type: data.type.toUpperCase(),
        amount: parseFloat(data.amount),
        description: data.description,
        category: data.category,
        subcategory: data.subcategory,
        date: data.date,
        paymentMethod: data.paymentMethod?.toUpperCase(),
        reference: data.reference,
        tags: data.tags,
      };

      console.log('🔍 GraphQL variables:', variables);
      console.log('🔍 GraphQL query:', CREATE_TRANSACTION);

      const response = await client.graphql({
        query: CREATE_TRANSACTION,
        variables,
      }) as any;

      console.log('🔍 GraphQL response:', response);

      if (response.data?.createTransaction) {
        // Convert owner to userId for compatibility
        const transaction = {
          ...response.data.createTransaction,
          userId: response.data.createTransaction.owner
        };
        
        console.log('✅ Transaction created successfully:', transaction);
        
        return { 
          success: true, 
          data: transaction as Transaction 
        };
      } else {
        console.error('❌ No data in GraphQL response:', response);
        return { 
          success: false, 
          error: 'No se recibieron datos de la transacción' 
        };
      }
    } catch (error: any) {
      console.error('❌ GraphQL createTransaction error:', error);
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error stack:', error.stack);
      
      if (error.errors) {
        console.error('❌ GraphQL errors:', error.errors);
      }
      
      let errorMessage = 'Error al crear la transacción';
      
      if (error.errors && error.errors.length > 0) {
        errorMessage = error.errors[0].message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  }

  static async updateTransaction(id: string, data: Partial<TransactionFormData>): Promise<ApiResponse<Transaction>> {
    try {
      if (isDemoMode()) {
        // Return mock response in demo mode
        const mockTransaction: Transaction = {
          id,
          type: data.type || 'income',
          amount: data.amount ? parseFloat(data.amount) : 0,
          description: data.description || '',
          category: data.category || '',
          subcategory: data.subcategory,
          date: data.date || new Date().toISOString().split('T')[0],
          userId: 'demo-user',
          paymentMethod: data.paymentMethod as any,
          reference: data.reference,
          tags: data.tags,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        return { success: true, data: mockTransaction };
      }

      const variables: any = { id };
      
      if (data.type) variables.type = data.type.toUpperCase();
      if (data.amount) variables.amount = parseFloat(data.amount);
      if (data.description) variables.description = data.description;
      if (data.category) variables.category = data.category;
      if (data.subcategory) variables.subcategory = data.subcategory;
      if (data.date) variables.date = data.date;
      if (data.paymentMethod) variables.paymentMethod = data.paymentMethod.toUpperCase();
      if (data.reference) variables.reference = data.reference;
      if (data.tags) variables.tags = data.tags;

      const response = await client.graphql({
        query: UPDATE_TRANSACTION,
        variables,
      }) as any;

      if (response.data?.updateTransaction) {
        return { 
          success: true, 
          data: response.data.updateTransaction as Transaction 
        };
      } else {
        return { 
          success: false, 
          error: 'Error al actualizar la transacción' 
        };
      }
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      return { 
        success: false, 
        error: error.message || 'Error al actualizar la transacción' 
      };
    }
  }

  static async deleteTransaction(id: string): Promise<ApiResponse<boolean>> {
    try {
      if (isDemoMode()) {
        return { success: true, data: true };
      }

      const response = await client.graphql({
        query: DELETE_TRANSACTION,
        variables: { id },
      }) as any;

      if (response.data?.deleteTransaction) {
        return { success: true, data: true };
      } else {
        return { 
          success: false, 
          error: 'Error al eliminar la transacción' 
        };
      }
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      return { 
        success: false, 
        error: error.message || 'Error al eliminar la transacción' 
      };
    }
  }

  static async getTransactions(): Promise<ApiResponse<Transaction[]>> {
    try {
      if (isDemoMode()) {
        // Return mock transactions in demo mode
        const mockTransactions: Transaction[] = [
          {
            id: 'demo-1',
            type: 'income',
            amount: 1500000,
            description: 'Venta de productos',
            category: 'Ingresos',
            date: new Date().toISOString().split('T')[0],
            userId: 'demo-user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'demo-2',
            type: 'expense',
            amount: 500000,
            description: 'Compra de materiales',
            category: 'Gastos Operativos',
            date: new Date().toISOString().split('T')[0],
            userId: 'demo-user',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        
        return { success: true, data: mockTransactions };
      }

      const response = await client.graphql({
        query: GET_TRANSACTIONS,
      }) as any;

      if (response.data?.listTransactions?.items) {
        // Convert owner to userId for compatibility
        const transactions = response.data.listTransactions.items.map((item: any) => ({
          ...item,
          userId: item.owner
        }));
        
        return { 
          success: true, 
          data: transactions as Transaction[] 
        };
      } else {
        return { 
          success: false, 
          error: 'Error al obtener las transacciones' 
        };
      }
    } catch (error: any) {
      console.error('Error getting transactions:', error);
      return { 
        success: false, 
        error: error.message || 'Error al obtener las transacciones' 
      };
    }
  }

  static async getTransaction(id: string): Promise<ApiResponse<Transaction>> {
    try {
      if (isDemoMode()) {
        const mockTransaction: Transaction = {
          id,
          type: 'income',
          amount: 1000000,
          description: 'Transacción demo',
          category: 'Ingresos',
          date: new Date().toISOString().split('T')[0],
          userId: 'demo-user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        return { success: true, data: mockTransaction };
      }

      const response = await client.graphql({
        query: GET_TRANSACTION,
        variables: { id },
      }) as any;

      if (response.data?.getTransaction) {
        return { 
          success: true, 
          data: response.data.getTransaction as Transaction 
        };
      } else {
        return { 
          success: false, 
          error: 'Transacción no encontrada' 
        };
      }
    } catch (error: any) {
      console.error('Error getting transaction:', error);
      return { 
        success: false, 
        error: error.message || 'Error al obtener la transacción' 
      };
    }
  }

  // Category operations
  static async createCategory(data: CategoryFormData): Promise<ApiResponse<Category>> {
    try {
      if (isDemoMode()) {
        const mockCategory: Category = {
          id: `demo-cat-${Date.now()}`,
          name: data.name,
          type: data.type,
          subcategories: data.subcategories,
          userId: 'demo-user',
          color: data.color,
          icon: data.icon,
          isDefault: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        return { success: true, data: mockCategory };
      }

      const response = await client.graphql({
        query: CREATE_CATEGORY,
        variables: {
          name: data.name,
          type: data.type.toUpperCase(),
          subcategories: data.subcategories,
          color: data.color,
          icon: data.icon,
          isDefault: false,
        },
      }) as any;

      if (response.data?.createCategory) {
        return { 
          success: true, 
          data: response.data.createCategory as Category 
        };
      } else {
        return { 
          success: false, 
          error: 'Error al crear la categoría' 
        };
      }
    } catch (error: any) {
      console.error('Error creating category:', error);
      return { 
        success: false, 
        error: error.message || 'Error al crear la categoría' 
      };
    }
  }

  static async getCategories(): Promise<ApiResponse<Category[]>> {
    try {
      if (isDemoMode()) {
        const mockCategories: Category[] = [
          {
            id: 'demo-cat-1',
            name: 'Ingresos',
            type: 'income',
            subcategories: ['Ventas', 'Servicios', 'Otros'],
            userId: 'demo-user',
            color: '#10B981',
            icon: '💰',
            isDefault: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'demo-cat-2',
            name: 'Gastos Operativos',
            type: 'expense',
            subcategories: ['Materiales', 'Servicios', 'Mantenimiento'],
            userId: 'demo-user',
            color: '#EF4444',
            icon: '💸',
            isDefault: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        
        return { success: true, data: mockCategories };
      }

      const response = await client.graphql({
        query: GET_CATEGORIES,
      }) as any;

      if (response.data?.listCategories?.items) {
        // Convert owner to userId for compatibility
        const categories = response.data.listCategories.items.map((item: any) => ({
          ...item,
          userId: item.owner
        }));
        
        return { 
          success: true, 
          data: categories as Category[] 
        };
      } else {
        return { 
          success: false, 
          error: 'Error al obtener las categorías' 
        };
      }
    } catch (error: any) {
      console.error('Error getting categories:', error);
      return { 
        success: false, 
        error: error.message || 'Error al obtener las categorías' 
      };
    }
  }

  // Dashboard operations
  static async getDashboardData(startDate?: string, endDate?: string): Promise<ApiResponse<DashboardData>> {
    try {
      if (isDemoMode()) {
        const mockDashboardData: DashboardData = {
          totalIncome: 3000000,
          totalExpenses: 1200000,
          balance: 1800000,
          monthlyData: [
            {
              month: '2024-01',
              income: 1500000,
              expenses: 600000,
              balance: 900000,
              transactionCount: 15,
            },
            {
              month: '2024-02',
              income: 1500000,
              expenses: 600000,
              balance: 900000,
              transactionCount: 18,
            },
          ],
          categoryBreakdown: [
            {
              category: 'Ingresos',
              amount: 3000000,
              percentage: 100,
              color: '#10B981',
              transactionCount: 20,
            },
            {
              category: 'Gastos Operativos',
              amount: 1200000,
              percentage: 100,
              color: '#EF4444',
              transactionCount: 13,
            },
          ],
          recentTransactions: [],
          budgetStatus: [],
        };
        
        return { success: true, data: mockDashboardData };
      }

      const userId = await this.getCurrentUserId();
      
      const response = await client.graphql({
        query: GET_DASHBOARD_DATA,
        variables: { 
          userId,
          startDate,
          endDate,
        },
      }) as any;

      if (response.data?.getDashboardData) {
        return { 
          success: true, 
          data: response.data.getDashboardData as DashboardData 
        };
      } else {
        return { 
          success: false, 
          error: 'Error al obtener los datos del dashboard' 
        };
      }
    } catch (error: any) {
      console.error('Error getting dashboard data:', error);
      return { 
        success: false, 
        error: error.message || 'Error al obtener los datos del dashboard' 
      };
    }
  }
}