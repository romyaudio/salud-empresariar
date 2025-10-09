'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { DataService } from '@/lib/services/dataService';

export function DataDebug() {
  const { user } = useAuthStore();
  const [isVisible, setIsVisible] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleClearAllData = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar TODOS los datos de localStorage?')) {
      setIsClearing(true);
      await DataService.clearAllData();
      setIsClearing(false);
      alert('Todos los datos han sido eliminados. Recarga la página.');
    }
  };

  const handleClearUserData = async () => {
    if (!user) return;
    
    if (confirm(`¿Estás seguro de que quieres eliminar los datos del usuario ${user.email}?`)) {
      setIsClearing(true);
      await DataService.clearUserData(user.id);
      setIsClearing(false);
      alert('Datos del usuario eliminados. Recarga la página.');
    }
  };

  const showStorageInfo = () => {
    const transactions = JSON.parse(localStorage.getItem('budget_tracker_transactions') || '[]');
    const categories = JSON.parse(localStorage.getItem('budget_tracker_categories') || '[]');
    const budgets = JSON.parse(localStorage.getItem('budget_tracker_budgets') || '[]');
    
    const userTransactions = transactions.filter((t: any) => t.userId === user?.id);
    const userCategories = categories.filter((c: any) => c.userId === user?.id);
    const userBudgets = budgets.filter((b: any) => b.userId === user?.id);
    
    const allUserIds = Array.from(new Set([
      ...transactions.map((t: any) => t.userId),
      ...categories.map((c: any) => c.userId),
      ...budgets.map((b: any) => b.userId)
    ]));
    
    alert(`
Información de localStorage:
- Total transacciones: ${transactions.length}
- Total categorías: ${categories.length}
- Total presupuestos: ${budgets.length}

Usuario actual (${user?.email}):
- Transacciones: ${userTransactions.length}
- Categorías: ${userCategories.length}
- Presupuestos: ${userBudgets.length}

Usuarios en sistema: ${allUserIds.length}
IDs: ${allUserIds.join(', ')}
    `);
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-orange-500 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg hover:bg-orange-600"
      >
        🔧 Data Debug
      </button>
      
      {isVisible && (
        <div className="absolute bottom-12 left-0 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-80">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-900">Data Debug</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              Usuario: {user.email} ({user.id})
            </div>
            
            <div className="space-y-2">
              <button
                onClick={showStorageInfo}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm"
              >
                Ver Info de Datos
              </button>
              
              <button
                onClick={handleClearUserData}
                disabled={isClearing}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-sm disabled:opacity-50"
              >
                {isClearing ? 'Limpiando...' : 'Limpiar Mis Datos'}
              </button>
              
              <button
                onClick={handleClearAllData}
                disabled={isClearing}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm disabled:opacity-50"
              >
                {isClearing ? 'Limpiando...' : 'Limpiar TODOS los Datos'}
              </button>
            </div>
            
            <div className="text-xs text-gray-500 mt-3">
              Usa esto para probar con usuarios limpios
            </div>
          </div>
        </div>
      )}
    </div>
  );
}