'use client';

import { TransactionList } from '@/components/transactions/TransactionList';
import { AppLayout } from '@/components/layout/AppLayout';
import { ExportButton } from '@/components/export/ExportButton';
import { useResponsive } from '@/hooks/useResponsive';

export default function TransactionsPage() {
  const { isMobile } = useResponsive();
  
  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
                Todas las Transacciones
              </h1>
              <p className="text-gray-600 mt-2">
                Visualiza, filtra y gestiona todas tus transacciones financieras
              </p>
            </div>
            
            {/* Export Button */}
            <ExportButton 
              variant="primary"
              size={isMobile ? 'md' : 'lg'}
            />
          </div>
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