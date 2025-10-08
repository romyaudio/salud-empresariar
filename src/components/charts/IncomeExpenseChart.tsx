'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { DashboardData } from '@/types';
import { TransactionModel } from '@/lib/models/Transaction';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface IncomeExpenseChartProps {
  data: DashboardData;
  className?: string;
}

export function IncomeExpenseChart({ data, className = '' }: IncomeExpenseChartProps) {
  const monthlyData = data.monthlyData || [];
  
  // Ordenar por fecha y tomar los últimos 6 meses
  const sortedData = monthlyData
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6);

  const labels = sortedData.map(item => {
    const [year, month] = item.month.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
  });

  const incomeData = sortedData.map(item => item.income);
  const expenseData = sortedData.map(item => item.expenses);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Ingresos',
        data: incomeData,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
      {
        label: 'Gastos',
        data: expenseData,
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#EF4444',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: 'Ingresos vs Gastos (Últimos 6 meses)',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            const label = context.dataset.label || '';
            const value = TransactionModel.formatAmount(context.parsed.y);
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 11,
          },
          callback: function(value: any) {
            return TransactionModel.formatAmount(value).replace('COP', '').trim();
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  if (sortedData.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Sin datos para mostrar
          </h3>
          <p className="text-gray-500 text-sm">
            Registra algunas transacciones para ver el gráfico de tendencias
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="h-80">
        <Line data={chartData} options={options} />
      </div>
      
      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-sm text-gray-600">Promedio Ingresos</p>
          <p className="text-lg font-semibold text-green-600">
            {TransactionModel.formatAmount(
              incomeData.length > 0 ? incomeData.reduce((a, b) => a + b, 0) / incomeData.length : 0
            )}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Promedio Gastos</p>
          <p className="text-lg font-semibold text-red-600">
            {TransactionModel.formatAmount(
              expenseData.length > 0 ? expenseData.reduce((a, b) => a + b, 0) / expenseData.length : 0
            )}
          </p>
        </div>
      </div>
    </div>
  );
}