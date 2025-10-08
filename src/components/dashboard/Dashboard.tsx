'use client';

import { useDashboard } from '@/hooks/useDashboard';
import { useAuthStore } from '@/store/authStore';
import { TransactionModel } from '@/lib/models/Transaction';
import { IncomeExpenseChart } from '@/components/charts/IncomeExpenseChart';
import { CategoryBreakdownChart } from '@/components/charts/CategoryBreakdownChart';

interface DashboardProps {
  className?: string;
}

export function Dashboard({ className = '' }: DashboardProps) {
  const { user } = useAuthStore();
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
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <h3 className="text-red-800 font-medium mb-2">Error al cargar el dashboard</h3>
        <p className="text-red-600 text-sm mb-3">{error}</p>
        <button
          onClick={refetch}
          className="text-red-600 hover:text-red-700 text-sm underline"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  const { totalIncome, totalExpenses, balance, recentTransactions } = dashboardData || {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    recentTransactions: []
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Resumen financiero de tu empresa
          </p>
        </div>
        
        {/* Period Selector */}
        <div className="mt-4 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
            <option value="1y">Último año</option>
            <option value="all">Todo el tiempo</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Balance Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                balance >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className="text-lg">
                  {balance >= 0 ? '💰' : '⚠️'}
                </span>
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">Balance Total</p>
              <p className={`text-2xl font-bold ${
                balance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {TransactionModel.formatAmount(balance)}
              </p>
            </div>
          </div>
        </div>

        {/* Income Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-lg">📈</span>
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">Ingresos</p>
              <p className="text-2xl font-bold text-green-600">
                {TransactionModel.formatAmount(totalIncome)}
              </p>
            </div>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-lg">📉</span>
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-600">Gastos</p>
              <p className="text-2xl font-bold text-red-600">
                {TransactionModel.formatAmount(totalExpenses)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      {dashboardData && (dashboardData.monthlyData.length > 0 || dashboardData.categoryBreakdown.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income vs Expense Chart */}
          <IncomeExpenseChart data={dashboardData} />
          
          {/* Category Breakdown Chart */}
          <CategoryBreakdownChart data={dashboardData} type="expense" />
        </div>
      )}

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Transacciones Recientes
            </h2>
            <span className="text-sm text-gray-500">
              {recentTransactions.length} transacciones
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {recentTransactions.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                No hay transacciones
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Comienza registrando tu primer ingreso o gasto
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  onClick={() => window.location.href = '/income'}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                >
                  💰 Registrar Ingreso
                </button>
                <button
                  onClick={() => window.location.href = '/expenses'}
                  className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                >
                  💸 Registrar Gasto
                </button>
              </div>
            </div>
          ) : (
            recentTransactions.slice(0, 10).map((transaction) => (
              <div key={transaction.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <span className="text-sm">
                        {transaction.type === 'income' ? '💰' : '💸'}
                      </span>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.description}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span>{transaction.category}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(transaction.date).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {TransactionModel.formatAmount(transaction.amount)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => window.location.href = '/income'}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mb-2">💰</span>
            <span className="text-sm font-medium text-gray-700">Ingreso</span>
          </button>
          <button
            onClick={() => window.location.href = '/expenses'}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mb-2">💸</span>
            <span className="text-sm font-medium text-gray-700">Gasto</span>
          </button>
          <button
            onClick={() => window.location.href = '/categories'}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mb-2">📋</span>
            <span className="text-sm font-medium text-gray-700">Categorías</span>
          </button>
          <button
            onClick={refetch}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mb-2">🔄</span>
            <span className="text-sm font-medium text-gray-700">Actualizar</span>
          </button>
        </div>
      </div>
    </div>
  );
}