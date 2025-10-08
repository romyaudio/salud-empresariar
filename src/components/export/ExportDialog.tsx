'use client';

import { useState } from 'react';
import { TouchOptimizedButton } from '@/components/ui/TouchOptimizedButton';
import { TouchOptimizedInput } from '@/components/ui/TouchOptimizedInput';
import { TouchOptimizedSelect } from '@/components/ui/TouchOptimizedSelect';
import { useDataExport, ExportFormat, ExportPeriod } from '@/hooks/useDataExport';
import { useTransactions } from '@/hooks/useTransactions';
import { useResponsive } from '@/hooks/useResponsive';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportDialog({ isOpen, onClose }: ExportDialogProps) {
  const { isMobile } = useResponsive();
  const { transactions } = useTransactions();
  const { exportData, isExporting, exportProgress, isShareSupported } = useDataExport();
  
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [period, setPeriod] = useState<ExportPeriod>('30d');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includeCategories, setIncludeCategories] = useState(true);
  const [includePaymentMethods, setIncludePaymentMethods] = useState(false);
  const [shareFile, setShareFile] = useState(false);
  const [error, setError] = useState('');

  const formatOptions = [
    { value: 'csv', label: '📊 CSV (Excel)' },
    { value: 'pdf', label: '📄 PDF' }
  ];

  const periodOptions = [
    { value: '7d', label: 'Últimos 7 días' },
    { value: '30d', label: 'Últimos 30 días' },
    { value: '90d', label: 'Últimos 90 días' },
    { value: '1y', label: 'Último año' },
    { value: 'all', label: 'Todas las transacciones' },
    { value: 'custom', label: 'Período personalizado' }
  ];

  const handleExport = async (shouldShare: boolean = false) => {
    setError('');
    
    // Validate custom date range
    if (period === 'custom') {
      if (!startDate || !endDate) {
        setError('Selecciona las fechas de inicio y fin');
        return;
      }
      
      if (new Date(startDate) > new Date(endDate)) {
        setError('La fecha de inicio debe ser anterior a la fecha de fin');
        return;
      }
    }

    try {
      await exportData(transactions, {
        format,
        period,
        startDate: period === 'custom' ? startDate : undefined,
        endDate: period === 'custom' ? endDate : undefined,
        includeCategories,
        includePaymentMethods,
        share: shouldShare
      });
      
      // Close dialog after successful export
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Export failed:', error);
      setError('Error al exportar los datos. Inténtalo de nuevo.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${
        isMobile ? 'mx-4' : ''
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Exportar Datos
          </h2>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <TouchOptimizedSelect
            label="Formato de exportación"
            icon="📁"
            value={format}
            onChange={(e) => setFormat(e.target.value as ExportFormat)}
            options={formatOptions}
            disabled={isExporting}
          />

          {/* Period Selection */}
          <TouchOptimizedSelect
            label="Período de tiempo"
            icon="📅"
            value={period}
            onChange={(e) => setPeriod(e.target.value as ExportPeriod)}
            options={periodOptions}
            disabled={isExporting}
          />

          {/* Custom Date Range */}
          {period === 'custom' && (
            <div className="space-y-4">
              <TouchOptimizedInput
                label="Fecha de inicio"
                icon="📅"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isExporting}
                max={new Date().toISOString().split('T')[0]}
              />
              
              <TouchOptimizedInput
                label="Fecha de fin"
                icon="📅"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={isExporting}
                max={new Date().toISOString().split('T')[0]}
                min={startDate}
              />
            </div>
          )}

          {/* Options */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Opciones adicionales</h3>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={includeCategories}
                onChange={(e) => setIncludeCategories(e.target.checked)}
                disabled={isExporting}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Incluir subcategorías</span>
            </label>
            
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={includePaymentMethods}
                onChange={(e) => setIncludePaymentMethods(e.target.checked)}
                disabled={isExporting}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Incluir métodos de pago y referencias</span>
            </label>
            
            {isShareSupported && (
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={shareFile}
                  onChange={(e) => setShareFile(e.target.checked)}
                  disabled={isExporting}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Compartir archivo directamente</span>
              </label>
            )}
          </div>

          {/* Progress Bar */}
          {isExporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Exportando...</span>
                <span className="text-gray-600">{exportProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-xs text-blue-600">
              💡 <strong>Tip:</strong> Los archivos CSV se pueden abrir en Excel. 
              Los archivos PDF incluyen un resumen financiero completo.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-3 p-6 border-t border-gray-200">
          {isShareSupported ? (
            <div className="flex flex-col gap-2">
              <TouchOptimizedButton
                variant="primary"
                size="lg"
                icon="📤"
                onClick={() => handleExport(true)}
                disabled={isExporting}
                loading={isExporting}
                className="w-full"
              >
                {isExporting ? 'Compartiendo...' : 'Compartir'}
              </TouchOptimizedButton>
              
              <TouchOptimizedButton
                variant="secondary"
                size="lg"
                icon={format === 'csv' ? '📊' : '📄'}
                onClick={() => handleExport(false)}
                disabled={isExporting}
                className="w-full"
              >
                Descargar {format.toUpperCase()}
              </TouchOptimizedButton>
            </div>
          ) : (
            <TouchOptimizedButton
              variant="primary"
              size="lg"
              icon={format === 'csv' ? '📊' : '📄'}
              onClick={() => handleExport(false)}
              disabled={isExporting}
              loading={isExporting}
              className="w-full"
            >
              {isExporting ? 'Exportando...' : `Exportar ${format.toUpperCase()}`}
            </TouchOptimizedButton>
          )}
          
          <TouchOptimizedButton
            variant="ghost"
            size="lg"
            onClick={onClose}
            disabled={isExporting}
            className="w-full"
          >
            Cancelar
          </TouchOptimizedButton>
        </div>
      </div>
    </div>
  );
}