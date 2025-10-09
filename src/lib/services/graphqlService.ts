import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import {
  LIST_TRANSACTIONS_AMPLIFY,
  CREATE_TRANSACTION_AMPLIFY,
  UPDATE_TRANSACTION_AMPLIFY,
  DELETE_TRANSACTION_AMPLIFY
} from '../graphql/amplify-operations';
import { Transaction, Category, TransactionFormData, ApiResponse } from '@/types';
import { isDemoMode } from '../amplify';

// Create GraphQL client
const client = generateClient();

export class GraphQLService {
  // Helper method to get current user ID
  private static async getCurrentUserId(): Promise<string> {
    try {
      const user = await getCurrentUser();
      return user.userId;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw new Error('Usuario no autenticado');
    }
  }

  static async createTransaction(data: TransactionFormData): Promise<ApiResponse<Transaction>> {
    try {
      console.log('🔍 GraphQL createTransaction - Starting...');

      const userId = await this.getCurrentUserId();
      console.log('🔍 User authenticated, creating transaction...');

      const transactionInput = {
        type: data.type.toUpperCase() as 'INCOME' | 'EXPENSE',
        amount: parseFloat(data.amount),
        description: data.description,
        category: data.category,
        subcategory: data.subcategory || undefined,
        date: data.date,
        paymentMethod: data.paymentMethod?.toUpperCase() as 'CASH' | 'CARD' | 'TRANSFER' | 'CHECK' | 'OTHER' | undefined,
        reference: data.reference || undefined,
        tags: data.tags || [],
        attachments: [],
      };

      const response = await client.graphql({
        query: CREATE_TRANSACTION_AMPLIFY,
        variables: { input: transactionInput },
      }) as any;

      if (response.data?.createTransaction) {
        const responseData = response.data.createTransaction;
        const transaction: Transaction = {
          id: responseData.id,
          type: responseData.type.toLowerCase() as 'income' | 'expense',
          amount: responseData.amount,
          description: responseData.description,
          category: responseData.category,
          subcategory: responseData.subcategory || undefined,
          date: responseData.date,
          userId: responseData.owner || userId,
          paymentMethod: responseData.paymentMethod?.toLowerCase() as any,
          reference: responseData.reference || undefined,
          tags: responseData.tags || [],
          attachments: responseData.attachments || [],
          createdAt: responseData.createdAt,
          updatedAt: responseData.updatedAt,
        };

        return { success: true, data: transaction };
      } else {
        return { success: false, error: 'No se recibieron datos de la transacción' };
      }
    } catch (error: any) {
      console.error('❌ GraphQL createTransaction error:', error);
      return { success: false, error: error.message || 'Error al crear la transacción' };
    }
  }

  static async getTransactions(): Promise<ApiResponse<Transaction[]>> {
    try {
      console.log('🔍 GraphQL getTransactions - Starting...');

      const response = await client.graphql({
        query: LIST_TRANSACTIONS_AMPLIFY,
      }) as any;

      if (response.data?.listTransactions) {
        const items = response.data.listTransactions.items || [];
        
        const transactions: Transaction[] = items.map((item: any) => ({
          id: item.id,
          type: item.type.toLowerCase() as 'income' | 'expense',
          amount: item.amount,
          description: item.description,
          category: item.category,
          subcategory: item.subcategory || undefined,
          date: item.date,
          userId: item.owner || 'unknown',
          paymentMethod: item.paymentMethod?.toLowerCase() as any,
          reference: item.reference || undefined,
          tags: item.tags || [],
          attachments: item.attachments || [],
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));

        console.log('✅ Transactions loaded:', transactions.length);
        return { success: true, data: transactions };
      } else {
        console.log('ℹ️ No transactions found, returning empty array');
        return { success: true, data: [] };
      }
    } catch (error: any) {
      console.error('❌ Error getting transactions:', error);
      return { success: false, error: error.message || 'Error al obtener las transacciones' };
    }
  }

  static async updateTransaction(id: string, data: Partial<TransactionFormData>): Promise<ApiResponse<Transaction>> {
    try {
      const variables: any = { 
        id,
        input: {}
      };

      if (data.type) variables.input.type = data.type.toUpperCase();
      if (data.amount) variables.input.amount = parseFloat(data.amount);
      if (data.description) variables.input.description = data.description;
      if (data.category) variables.input.category = data.category;
      if (data.subcategory) variables.input.subcategory = data.subcategory;
      if (data.date) variables.input.date = data.date;
      if (data.paymentMethod) variables.input.paymentMethod = data.paymentMethod.toUpperCase();
      if (data.reference) variables.input.reference = data.reference;
      if (data.tags) variables.input.tags = data.tags;

      const response = await client.graphql({
        query: UPDATE_TRANSACTION_AMPLIFY,
        variables,
      }) as any;

      if (response.data?.updateTransaction) {
        const responseData = response.data.updateTransaction;
        const transaction: Transaction = {
          id: responseData.id,
          type: responseData.type.toLowerCase() as 'income' | 'expense',
          amount: responseData.amount,
          description: responseData.description,
          category: responseData.category,
          subcategory: responseData.subcategory || undefined,
          date: responseData.date,
          userId: responseData.owner || 'unknown',
          paymentMethod: responseData.paymentMethod?.toLowerCase() as any,
          reference: responseData.reference || undefined,
          tags: responseData.tags || [],
          attachments: responseData.attachments || [],
          createdAt: responseData.createdAt,
          updatedAt: responseData.updatedAt,
        };
        return { success: true, data: transaction };
      } else {
        return { success: false, error: 'Error al actualizar la transacción' };
      }
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      return { success: false, error: error.message || 'Error al actualizar la transacción' };
    }
  }

  static async deleteTransaction(id: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await client.graphql({
        query: DELETE_TRANSACTION_AMPLIFY,
        variables: { id },
      }) as any;

      if (response.data?.deleteTransaction) {
        return { success: true, data: true };
      } else {
        return { success: false, error: 'Error al eliminar la transacción' };
      }
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      return { success: false, error: error.message || 'Error al eliminar la transacción' };
    }
  }
}