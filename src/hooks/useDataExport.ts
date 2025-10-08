'use client';

import { useState, useCallback } from 'react';
import { Transaction } from '@/types';
import { TransactionModel } from '@/lib/models/Transaction';
import { useNativeShare } from './useNativeShare';

export type ExportFormat = 'csv' | 'pdf';
export type ExportPeriod = '7d' | '30d' | '90d' | '1y' | 'all' | 'custom';

interface ExportOptions {
  format: ExportFormat;
  period: ExportPeriod;
  startDate?: string;
  endDate?: string;
  includeCategories?: boolean;
  includePaymentMethods?: boolean;
}

interface ExportData {
  transactions: Transaction[];
  summary: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    transactionCount: number;
  };
}

export function useDataExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const { shareFile, isShareSupported } = useNativeShare();

  const filterTransactionsByPeriod = useCallback((
    transactions: Transaction[], 
    period: ExportPeriod,
    startDate?: string,
    endDate?: string
  ): Transaction[] => {
    if (period === 'all') return transactions;
    
    const now = new Date();
    let filterDate: Date;
    
    if (period === 'custom' && startDate && endDate) {
      return transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
      });
    }
    
    switch (period) {
      case '7d':
        filterDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        filterDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        filterDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        filterDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return transactions;
    }
    
    return transactions.filter(t => new Date(t.date) >= filterDate);
  }, []);

  const prepareExportData = useCallback((
    transactions: Transaction[],
    options: ExportOptions
  ): ExportData => {
    const filteredTransactions = filterTransactionsByPeriod(
      transactions,
      options.period,
      options.startDate,
      options.endDate
    );

    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    const totalExpenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

    return {
      transactions: filteredTransactions,
      summary: {
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        transactionCount: filteredTransactions.length
      }
    };
  }, [filterTransactionsByPeriod]);

  const exportToCSV = useCallback(async (data: ExportData, options: ExportOptions): Promise<string> => {
    // Dynamic import to avoid SSR issues
    const Papa = (await import('papaparse')).default;
    const headers = [
      'Fecha',
      'Tipo',
      'Descripción',
      'Monto',
      'Categoría'
    ];

    if (options.includeCategories) {
      headers.push('Subcategoría');
    }
    
    if (options.includePaymentMethods) {
      headers.push('Método de Pago', 'Referencia');
    }

    const rows = data.transactions.map(transaction => {
      const row = [
        new Date(transaction.date).toLocaleDateString('es-ES'),
        transaction.type === 'income' ? 'Ingreso' : 'Gasto',
        transaction.description,
        TransactionModel.formatAmount(parseFloat(transaction.amount.toString())),
        transaction.category
      ];

      if (options.includeCategories) {
        row.push(transaction.subcategory || '');
      }

      if (options.includePaymentMethods) {
        row.push(transaction.paymentMethod || '');
        row.push(transaction.reference || '');
      }

      return row;
    });

    // Add summary rows
    rows.push([]);
    rows.push(['RESUMEN']);
    rows.push(['Total Ingresos', '', '', TransactionModel.formatAmount(data.summary.totalIncome)]);
    rows.push(['Total Gastos', '', '', TransactionModel.formatAmount(data.summary.totalExpenses)]);
    rows.push(['Balance', '', '', TransactionModel.formatAmount(data.summary.balance)]);
    rows.push(['Total Transacciones', '', '', data.summary.transactionCount.toString()]);

    return Papa.unparse({
      fields: headers,
      data: rows
    });
  }, []);

  const exportToPDF = useCallback(async (data: ExportData, options: ExportOptions): Promise<any> => {
    // Dynamic imports to avoid SSR issues
    const jsPDF = (await import('jspdf')).default;
    const autoTable = (await import('jspdf-autotable')).default;
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Reporte Financiero', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, 20, 30);
    
    const periodText = getPeriodText(options.period, options.startDate, options.endDate);
    doc.text(`Período: ${periodText}`, 20, 40);

    // Summary section
    doc.setFontSize(14);
    doc.text('Resumen', 20, 55);
    
    doc.setFontSize(10);
    doc.text(`Total Ingresos: ${TransactionModel.formatAmount(data.summary.totalIncome)}`, 20, 65);
    doc.text(`Total Gastos: ${TransactionModel.formatAmount(data.summary.totalExpenses)}`, 20, 72);
    doc.text(`Balance: ${TransactionModel.formatAmount(data.summary.balance)}`, 20, 79);
    doc.text(`Total Transacciones: ${data.summary.transactionCount}`, 20, 86);

    // Transactions table
    const tableColumns = [
      'Fecha',
      'Tipo',
      'Descripción',
      'Monto',
      'Categoría'
    ];

    if (options.includeCategories) {
      tableColumns.push('Subcategoría');
    }

    if (options.includePaymentMethods) {
      tableColumns.push('Método', 'Referencia');
    }

    const tableRows = data.transactions.map(transaction => {
      const row = [
        new Date(transaction.date).toLocaleDateString('es-ES'),
        transaction.type === 'income' ? 'Ingreso' : 'Gasto',
        transaction.description,
        TransactionModel.formatAmount(parseFloat(transaction.amount.toString())),
        transaction.category
      ];

      if (options.includeCategories) {
        row.push(transaction.subcategory || '');
      }

      if (options.includePaymentMethods) {
        row.push(transaction.paymentMethod || '');
        row.push(transaction.reference || '');
      }

      return row;
    });

    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 95,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 139, 202] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 95 }
    });

    return doc;
  }, []);

  const exportData = useCallback(async (
    transactions: Transaction[],
    options: ExportOptions & { share?: boolean }
  ): Promise<void> => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      // Simulate progress for better UX
      setExportProgress(25);
      
      const exportData = prepareExportData(transactions, options);
      setExportProgress(50);

      let filename: string;
      let content: string | Blob;

      if (options.format === 'csv') {
        content = await exportToCSV(exportData, options);
        filename = `transacciones_${getPeriodFilename(options.period)}.csv`;
        
        // Create blob
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        
        if (options.share && isShareSupported) {
          // Try to share the file
          const file = new File([blob], filename, { type: 'text/csv' });
          const shared = await shareFile(file, 'Reporte de Transacciones', 'Reporte financiero generado desde Budget Tracker');
          
          if (!shared) {
            // Fallback to download
            downloadFile(blob, filename);
          }
        } else {
          // Direct download
          downloadFile(blob, filename);
        }
      } else {
        const pdf = await exportToPDF(exportData, options);
        filename = `reporte_financiero_${getPeriodFilename(options.period)}.pdf`;
        
        if (options.share && isShareSupported) {
          // Convert PDF to blob and share
          const pdfBlob = pdf.output('blob');
          const file = new File([pdfBlob], filename, { type: 'application/pdf' });
          const shared = await shareFile(file, 'Reporte Financiero', 'Reporte financiero generado desde Budget Tracker');
          
          if (!shared) {
            // Fallback to download
            pdf.save(filename);
          }
        } else {
          // Direct download
          pdf.save(filename);
        }
      }

      setExportProgress(100);
      
      // Trigger haptic feedback on success
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }

    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 1000);
    }
  }, [prepareExportData, exportToCSV, exportToPDF]);

  return {
    exportData,
    isExporting,
    exportProgress,
    isShareSupported
  };
}

// Helper functions
function getPeriodText(period: ExportPeriod, startDate?: string, endDate?: string): string {
  if (period === 'custom' && startDate && endDate) {
    return `${new Date(startDate).toLocaleDateString('es-ES')} - ${new Date(endDate).toLocaleDateString('es-ES')}`;
  }
  
  switch (period) {
    case '7d': return 'Últimos 7 días';
    case '30d': return 'Últimos 30 días';
    case '90d': return 'Últimos 90 días';
    case '1y': return 'Último año';
    case 'all': return 'Todas las transacciones';
    default: return 'Período personalizado';
  }
}

function getPeriodFilename(period: ExportPeriod): string {
  const date = new Date().toISOString().split('T')[0];
  
  switch (period) {
    case '7d': return `7dias_${date}`;
    case '30d': return `30dias_${date}`;
    case '90d': return `90dias_${date}`;
    case '1y': return `1año_${date}`;
    case 'all': return `todas_${date}`;
    default: return `personalizado_${date}`;
  }
}

function downloadFile(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}