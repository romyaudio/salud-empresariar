import { useState, useEffect } from 'react';
import { DashboardData, ApiResponse } from '@/types';
import { DataService } from '@/lib/services/dataService';
import { useAuthStore } from '@/store/authStore';

type PeriodType = '7d' | '30d' | '90d' | '1y' | 'all';

export function useDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('30d');
  const { user } = useAuthStore();

  const fetchDashboardData = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await DataService.getDashboardData(user.id);
      
      if (response.success && response.data) {
        setDashboardData(response.data);
      } else {
        setError(response.error || 'Error al cargar los datos del dashboard');
      }
    } catch (err) {
      setError('Error al cargar los datos del dashboard');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentMonthData = () => {
    if (!dashboardData?.monthlyData.length) return null;
    
    const currentMonth = new Date().toISOString().substring(0, 7);
    return dashboardData.monthlyData.find(data => data.month === currentMonth) || null;
  };

  const getPreviousMonthData = () => {
    if (!dashboardData?.monthlyData.length) return null;
    
    const previousMonth = new Date();
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    const previousMonthKey = previousMonth.toISOString().substring(0, 7);
    
    return dashboardData.monthlyData.find(data => data.month === previousMonthKey) || null;
  };

  const getMonthlyGrowth = () => {
    const current = getCurrentMonthData();
    const previous = getPreviousMonthData();
    
    if (!current || !previous) return null;
    
    const incomeGrowth = previous.income > 0 
      ? ((current.income - previous.income) / previous.income) * 100 
      : 0;
      
    const expenseGrowth = previous.expenses > 0 
      ? ((current.expenses - previous.expenses) / previous.expenses) * 100 
      : 0;

    return {
      income: Math.round(incomeGrowth * 100) / 100,
      expenses: Math.round(expenseGrowth * 100) / 100,
    };
  };

  const getTopCategories = (limit: number = 5) => {
    if (!dashboardData?.categoryBreakdown.length) return [];
    
    return dashboardData.categoryBreakdown
      .sort((a, b) => b.amount - a.amount)
      .slice(0, limit);
  };

  const getBudgetAlerts = () => {
    if (!dashboardData?.budgetStatus.length) return [];
    
    return dashboardData.budgetStatus.filter(budget => 
      budget.status === 'warning' || budget.status === 'exceeded'
    );
  };

  const getFinancialHealth = () => {
    if (!dashboardData) return null;
    
    const { totalIncome, totalExpenses } = dashboardData;
    
    if (totalIncome === 0) return { status: 'no-data', message: 'Sin datos suficientes' };
    
    const expenseRatio = (totalExpenses / totalIncome) * 100;
    
    if (expenseRatio <= 50) {
      return { status: 'excellent', message: 'Excelente salud financiera' };
    } else if (expenseRatio <= 70) {
      return { status: 'good', message: 'Buena salud financiera' };
    } else if (expenseRatio <= 90) {
      return { status: 'warning', message: 'Salud financiera regular' };
    } else {
      return { status: 'poor', message: 'Salud financiera preocupante' };
    }
  };

  const getSavingsRate = () => {
    if (!dashboardData || dashboardData.totalIncome === 0) return 0;
    
    const savings = dashboardData.balance;
    return (savings / dashboardData.totalIncome) * 100;
  };

  const getExpensesByCategory = () => {
    if (!dashboardData?.categoryBreakdown.length) return [];
    
    return dashboardData.categoryBreakdown
      .filter(category => category.amount > 0)
      .sort((a, b) => b.percentage - a.percentage);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user, selectedPeriod]);

  return {
    dashboardData,
    loading,
    error,
    selectedPeriod,
    setSelectedPeriod,
    getCurrentMonthData,
    getPreviousMonthData,
    getMonthlyGrowth,
    getTopCategories,
    getBudgetAlerts,
    getFinancialHealth,
    getSavingsRate,
    getExpensesByCategory,
    refetch: fetchDashboardData,
  };
}