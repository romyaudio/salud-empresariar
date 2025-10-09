'use client';

import { useDashboard } from '@/hooks/useDashboard';
import { useAuthStore } from '@/store/authStore';
import { useResponsive } from '@/hooks/useResponsive';
import { TransactionModel } from '@/lib/models/Transaction';
import { IncomeExpenseChart } from '@/components/charts/IncomeExpenseChart';
import { CategoryBreakdownChart } from '@/components/charts/CategoryBreakdownChart';
import { TransactionList } from '@/components/transactions/TransactionList';
import { ResponsiveContainer, ResponsiveGrid, ResponsiveStack } from '@/components/layout/ResponsiveContainer';
import { ExportButton } from '@/components/export/ExportButton';
import { DatabaseConnectionDebug } from '@/components/debug/DatabaseConnectionDebug';

interface DashboardProps {
  className?: string;
}

export function Dashboard({ className = '' }: DashboardProps) {
  const { user } = useAuthStore();
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const { 
    dashboardData, 
    loading, 
    error, 
    selectedPeriod, 
    setSelectedPeriod,
    refetch 
  } = useDashboard();

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
            ))}
          </div>
          <div className="bg-gray-200 h-64 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-red-800 font-medium mb-2">Error al cargar el dashboard</h3>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            
            <div className="bg-red-100 border border-red-200 rounded p-3 mb-4">
              <h4 className="text-red-800 font-medium text-sm mb-2">Posibles soluciones:</h4>
              <ul className="text-red-700 text-sm space-y-1">
                <li>• Verifica tu conexión a internet</li>
                <li>• Revisa la configuración de AWS Amplify</li>
                <li>• Comprueba las variables de entorno</li>
                <li>• Usa el botón Debug para más información</li>
              </ul>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={refetch}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Intentar de nuevo
              </button>
              <button
                onClick={() => window.location.href = '/profile'}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Ir al perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { totalIncome, totalExpenses, balance, recentTransactions } = dashboardData || {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    recentTransactions: []
  };

  // Check if this is a new user with no data
  const isNewUser = dashboardData && 
    totalIncome === 0 && 
    totalExpenses === 0 && 
    recentTransactions.length === 0;

  return (
    <ResponsiveContainer className={`space-y-6 ${className}`}>
      {/* Header */}
      <ResponsiveStack 
        direction={{ xs: 'col', sm: 'row' }}
        justify="between"
        align={isMobile ? 'start' : 'center'}
        gap={4}
      >
        <div>
          <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
            Dashboard
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Resumen financiero de tu empresa
          </p>
        </div>
        
        {/* Controls */}
        <ResponsiveStack 
          direction={{ xs: 'col', sm: 'row' }}
          gap={3}
          className={isMobile ? 'w-full' : 'w-auto'}
        >
          {/* Period Selector */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className={`block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
              isMobile ? 'w-full' : 'w-auto'
            }`}
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
            <option value="1y">Último año</option>
            <option value="all">Todo el tiempo</option>
          </select>
          
          {/* Export Button */}
          <ExportButton 
            variant="secondary"
            size={isMobile ? 'md' : 'sm'}
            showLabel={!isMobile}
          />
        </ResponsiveStack>
      </ResponsiveStack>

      {/* Summary Cards */}
      <ResponsiveGrid 
        cols={{ xs: 1, sm: 2, md: 3 }}
        gap={4}
      >
        {/* Balance Card */}
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${isMobile ? 'p-4' : 'p-6'}`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`${isMobile ? 'w-10 h-10' : 'w-8 h-8'} rounded-full flex items-center justify-center ${
                balance >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className={isMobile ? 'text-xl' : 'text-lg'}>
                  {balance >= 0 ? '💰' : '⚠️'}
                </span>
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">Balance Total</p>
              <p className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'} ${
                balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {TransactionModel.formatAmount(balance)}
              </p>
            </div>
          </div>
        </div>

        {/* Income Card */}
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${isMobile ? 'p-4' : 'p-6'}`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`${isMobile ? 'w-10 h-10' : 'w-8 h-8'} bg-green-100 rounded-full flex items-center justify-center`}>
                <span className={isMobile ? 'text-xl' : 'text-lg'}>📈</span>
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">Ingresos</p>
              <p className={`font-bold text-green-600 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                {TransactionModel.formatAmount(totalIncome)}
              </p>
            </div>
          </div>
        </div>

        {/* Expenses Card */}
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${isMobile ? 'p-4' : 'p-6'}`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`${isMobile ? 'w-10 h-10' : 'w-8 h-8'} bg-red-100 rounded-full flex items-center justify-center`}>
                <span className={isMobile ? 'text-xl' : 'text-lg'}>📉</span>
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">Gastos</p>
              <p className={`font-bold text-red-600 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                {TransactionModel.formatAmount(totalExpenses)}
              </p>
            </div>
          </div>
        </div>
      </ResponsiveGrid>

      {/* Welcome Message for New Users */}
      {isNewUser && (
        <div className={`bg-blue-50 border border-blue-200 rounded-lg ${isMobile ? 'p-4' : 'p-6'}`}>
          <div className="text-center">
            <div className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
              <span className={isMobile ? 'text-2xl' : 'text-3xl'}>🎉</span>
            </div>
            <h3 className={`font-semibold text-blue-900 mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
              ¡Bienvenido a Budget Tracker!
            </h3>
            <p className="text-blue-700 text-sm mb-4">
              Comienza registrando tu primera transacción para ver tus datos financieros aquí.
            </p>
            <ResponsiveGrid 
              cols={{ xs: 2, sm: 2 }}
              gap={3}
              className="max-w-sm mx-auto"
            >
              <button
                onClick={() => window.location.href = '/income'}
                className={`bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors ${
                  isMobile ? 'py-2 px-3 text-sm' : 'py-3 px-4'
                }`}
              >
                💰 Agregar Ingreso
              </button>
              <button
                onClick={() => window.location.href = '/expenses'}
                className={`bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors ${
                  isMobile ? 'py-2 px-3 text-sm' : 'py-3 px-4'
                }`}
              >
                💸 Agregar Gasto
              </button>
            </ResponsiveGrid>
          </div>
        </div>
      )}

      {/* Charts Section */}
      {dashboardData && !isNewUser && (dashboardData.monthlyData.length > 0 || dashboardData.categoryBreakdown.length > 0) && (
        <ResponsiveGrid 
          cols={{ xs: 1, lg: 2 }}
          gap={6}
        >
          {/* Income vs Expense Chart */}
          <IncomeExpenseChart data={dashboardData} />
          
          {/* Category Breakdown Chart */}
          <CategoryBreakdownChart data={dashboardData} type="expense" />
        </ResponsiveGrid>
      )}

      {/* Recent Transactions with Full Functionality */}
      <TransactionList 
        limit={5} 
        showFilters={false}
        title="Transacciones Recientes"
        showViewAllLink={true}
        className="mt-6"
      />

      {/* Quick Actions */}
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${isMobile ? 'p-4' : 'p-6'}`}>
        <h2 className={`font-semibold text-gray-900 mb-4 ${isMobile ? 'text-base' : 'text-lg'}`}>
          Acciones Rápidas
        </h2>
        <ResponsiveGrid 
          cols={{ xs: 2, md: 4 }}
          gap={3}
        >
          <button
            onClick={() => window.location.href = '/income'}
            className={`flex flex-col items-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation ${
              isMobile ? 'p-3' : 'p-4'
            }`}
          >
            <span className={`mb-2 ${isMobile ? 'text-xl' : 'text-2xl'}`}>💰</span>
            <span className={`font-medium text-gray-700 ${isMobile ? 'text-xs' : 'text-sm'}`}>Ingreso</span>
          </button>
          <button
            onClick={() => window.location.href = '/expenses'}
            className={`flex flex-col items-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation ${
              isMobile ? 'p-3' : 'p-4'
            }`}
          >
            <span className={`mb-2 ${isMobile ? 'text-xl' : 'text-2xl'}`}>💸</span>
            <span className={`font-medium text-gray-700 ${isMobile ? 'text-xs' : 'text-sm'}`}>Gasto</span>
          </button>
          <button
            onClick={() => window.location.href = '/categories'}
            className={`flex flex-col items-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation ${
              isMobile ? 'p-3' : 'p-4'
            }`}
          >
            <span className={`mb-2 ${isMobile ? 'text-xl' : 'text-2xl'}`}>📋</span>
            <span className={`font-medium text-gray-700 ${isMobile ? 'text-xs' : 'text-sm'}`}>Categorías</span>
          </button>
          <button
            onClick={refetch}
            className={`flex flex-col items-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors touch-manipulation ${
              isMobile ? 'p-3' : 'p-4'
            }`}
          >
            <span className={`mb-2 ${isMobile ? 'text-xl' : 'text-2xl'}`}>🔄</span>
            <span className={`font-medium text-gray-700 ${isMobile ? 'text-xs' : 'text-sm'}`}>Actualizar</span>
          </button>
        </ResponsiveGrid>
      </div>
      
      {/* Database Connection Debug - Remove in production */}
      <DatabaseConnectionDebug />
    </ResponsiveContainer>
  );
}