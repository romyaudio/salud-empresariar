'use client';

import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { DashboardData } from '@/types';
import { TransactionModel } from '@/lib/models/Transaction';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryBreakdownChartProps {
  data: DashboardData;
  type?: 'all' | 'expense' | 'income';
  className?: string;
}

export function CategoryBreakdownChart({ 
  data, 
  type = 'expense', 
  className = '' 
}: CategoryBreakdownChartProps) {
  const categoryData = data.categoryBreakdown || [];
  
  // Filtrar por tipo si es necesario y tomar top 8 categorías
  const filteredData = categoryData
    .filter(item => item.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);

  const colors = [
    '#EF4444', // Red
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#3B82F6', // Blue
    '#8B5CF6', // Violet
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
  ];

  const chartData = {
    labels: filteredData.map(item => item.category),
    datasets: [
      {
        data: filteredData.map(item => item.amount),
        backgroundColor: colors.slice(0, filteredData.length),
        borderColor: '#ffffff',
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 11,
          },
          generateLabels: function(chart: any) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i];
                const percentage = filteredData[i]?.percentage || 0;
                
                return {
                  text: `${label} (${percentage.toFixed(1)}%)`,
                  fillStyle: dataset.backgroundColor[i],
                  strokeStyle: dataset.borderColor,
                  lineWidth: dataset.borderWidth,
                  pointStyle: 'circle',
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      title: {
        display: true,
        text: type === 'expense' ? 'Gastos por Categoría' : 
              type === 'income' ? 'Ingresos por Categoría' : 
              'Desglose por Categoría',
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
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = TransactionModel.formatAmount(context.parsed);
            const percentage = filteredData[context.dataIndex]?.percentage || 0;
            return `${label}: ${value} (${percentage.toFixed(1)}%)`;
          },
        },
      },
    },
    cutout: '60%',
    animation: {
      animateRotate: true,
      animateScale: true,
    },
  };

  if (filteredData.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🍩</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Sin categorías para mostrar
          </h3>
          <p className="text-gray-500 text-sm">
            Registra transacciones con categorías para ver el desglose
          </p>
        </div>
      </div>
    );
  }

  const totalAmount = filteredData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="h-80 relative">
        <Doughnut data={chartData} options={options} />
        
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-lg font-bold text-gray-900">
              {TransactionModel.formatAmount(totalAmount)}
            </p>
          </div>
        </div>
      </div>

      {/* Top Categories List */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Top Categorías
        </h4>
        <div className="space-y-2">
          {filteredData.slice(0, 3).map((item, index) => (
            <div key={item.category} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index] }}
                ></div>
                <span className="text-sm text-gray-700">{item.category}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-900">
                  {TransactionModel.formatAmount(item.amount)}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}