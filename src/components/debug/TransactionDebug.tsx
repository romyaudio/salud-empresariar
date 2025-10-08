'use client';

import { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { useAuthStore } from '@/store/authStore';
import { isDemoMode, isUsingRealAWS, getConfigStatus } from '@/lib/amplify';
import Button from '@/components/ui/Button';

export function TransactionDebug() {
  const { createTransaction, loading } = useTransactions();
  const { user } = useAuthStore();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [testResult, setTestResult] = useState<any>(null);

  const runDiagnostics = () => {
    const info = {
      isDemoMode: isDemoMode(),
      isUsingRealAWS: isUsingRealAWS(),
      configStatus: getConfigStatus(),
      user: user ? {
        id: user.id,
        email: user.email,
        isAuthenticated: true
      } : null,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE,
        NEXT_PUBLIC_AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION,
        NEXT_PUBLIC_USER_POOL_ID: process.env.NEXT_PUBLIC_USER_POOL_ID,
        NEXT_PUBLIC_GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
      }
    };
    
    setDebugInfo(info);
    console.log('🔍 Debug Info:', info);
  };

  const testCreateTransaction = async () => {
    setTestResult({ status: 'testing', message: 'Probando crear transacción...' });
    
    try {
      const testData = {
        type: 'income' as const,
        amount: '1000',
        description: 'Test transaction from debug',
        category: 'Ingresos',
        date: new Date().toISOString().split('T')[0]
      };

      console.log('🧪 Testing transaction creation with data:', testData);
      
      const result = await createTransaction(testData);
      
      console.log('🧪 Transaction creation result:', result);
      
      setTestResult({
        status: result.success ? 'success' : 'error',
        message: result.success ? 'Transacción creada exitosamente' : result.error,
        data: result.data,
        fullResult: result
      });
    } catch (error: any) {
      console.error('🧪 Transaction creation error:', error);
      setTestResult({
        status: 'error',
        message: error.message || 'Error desconocido',
        error: error
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        🔍 Debug de Transacciones
      </h3>
      
      <div className="space-y-3">
        <Button onClick={runDiagnostics} className="w-full">
          Ejecutar Diagnósticos
        </Button>
        
        <Button 
          onClick={testCreateTransaction} 
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {loading ? 'Probando...' : 'Probar Crear Transacción'}
        </Button>
      </div>

      {debugInfo && (
        <div className="bg-gray-50 rounded-md p-4">
          <h4 className="font-medium text-gray-900 mb-2">Información del Sistema:</h4>
          <pre className="text-xs text-gray-700 overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}

      {testResult && (
        <div className={`rounded-md p-4 ${
          testResult.status === 'success' ? 'bg-green-50 border border-green-200' :
          testResult.status === 'error' ? 'bg-red-50 border border-red-200' :
          'bg-blue-50 border border-blue-200'
        }`}>
          <h4 className={`font-medium mb-2 ${
            testResult.status === 'success' ? 'text-green-900' :
            testResult.status === 'error' ? 'text-red-900' :
            'text-blue-900'
          }`}>
            Resultado de la Prueba:
          </h4>
          <p className={`text-sm mb-2 ${
            testResult.status === 'success' ? 'text-green-700' :
            testResult.status === 'error' ? 'text-red-700' :
            'text-blue-700'
          }`}>
            {testResult.message}
          </p>
          {testResult.fullResult && (
            <pre className="text-xs text-gray-700 overflow-auto bg-white p-2 rounded border">
              {JSON.stringify(testResult.fullResult, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}