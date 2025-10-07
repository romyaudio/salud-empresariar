import { useState, useEffect } from 'react';
import { Transaction, TransactionFormData, TransactionFilters, ApiResponse } from '@/types';
import { DataService } from '@/lib/services/dataService';
import { TransactionModel } from '@/lib/models/Transaction';
import { useAuthStore } from '@/store/authStore';

export function useTransactions(filters?: TransactionFilters) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const fetchTransactions = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await DataService.getTransactions(user.id, filters);
      
      if (response.success && response.data) {
        setTransactions(response.data);
      } else {
        setError(response.error || 'Error al cargar las transacciones');
      }
    } catch (err) {
      setError('Error al cargar las transacciones');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (data: TransactionFormData): Promise<ApiResponse<Transaction>> => {
    if (!user) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    const validation = TransactionModel.validate(data);
    if (!validation.isValid) {
      return { success: false, error: validation.errors.join(', ') };
    }

    try {
      const transaction = TransactionModel.create(data, user.id);
      const response = await DataService.createTransaction(transaction);
      
      if (response.success) {
        await fetchTransactions(); // Refresh the list
      }
      
      return response;
    } catch (err) {
      console.error('Error creating transaction:', err);
      return { success: false, error: 'Error al crear la transacción' };
    }
  };

  const updateTransaction = async (id: string, data: Partial<TransactionFormData>): Promise<ApiResponse<Transaction>> => {
    try {
      const currentTransaction = transactions.find(t => t.id === id);
      if (!currentTransaction) {
        return { success: false, error: 'Transacción no encontrada' };
      }

      const updatedTransaction = TransactionModel.update(currentTransaction, data);
      const response = await DataService.updateTransaction(id, updatedTransaction);
      
      if (response.success) {
        await fetchTransactions(); // Refresh the list
      }
      
      return response;
    } catch (err) {
      console.error('Error updating transaction:', err);
      return { success: false, error: 'Error al actualizar la transacción' };
    }
  };

  const deleteTransaction = async (id: string): Promise<ApiResponse<boolean>> => {
    try {
      const response = await DataService.deleteTransaction(id);
      
      if (response.success) {
        await fetchTransactions(); // Refresh the list
      }
      
      return response;
    } catch (err) {
      console.error('Error deleting transaction:', err);
      return { success: false, error: 'Error al eliminar la transacción' };
    }
  };

  const getTransactionById = (id: string): Transaction | undefined => {
    return transactions.find(t => t.id === id);
  };

  const getTotalsByType = () => {
    return TransactionModel.calculateTotals(transactions);
  };

  const getTransactionsByCategory = () => {
    return TransactionModel.groupByCategory(transactions);
  };

  const getTransactionsByDateRange = (startDate: string, endDate: string) => {
    return TransactionModel.filterByDateRange(transactions, startDate, endDate);
  };

  useEffect(() => {
    fetchTransactions();
  }, [user, JSON.stringify(filters)]);

  return {
    transactions,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTransactionById,
    getTotalsByType,
    getTransactionsByCategory,
    getTransactionsByDateRange,
    refetch: fetchTransactions,
  };
}