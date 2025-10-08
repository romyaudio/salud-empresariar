'use client';

import { TransactionList } from '@/components/transactions/TransactionList';
import { AppLayout } from '@/components/layout/AppLayout';

export default function TransactionsPage() {
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Todas las Transacciones
          </h1>
          <p className="text-gray-600 mt-2">
            Visualiza, filtra y gestiona todas tus transacciones financieras
          </p>
        </div>

        {/* Full Transaction List */}
        <TransactionList 
          limit={20} 
          showFilters={true}
        />
      </div>
    </AppLayout>
  );
}