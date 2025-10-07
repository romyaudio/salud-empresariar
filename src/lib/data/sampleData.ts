import { Transaction, Category, Budget } from '@/types';
import { generateId } from '@/lib/utils';

export function generateSampleData(userId: string) {
  const now = new Date();
  const currentMonth = now.toISOString().substring(0, 7);
  
  // Sample categories
  const sampleCategories: Category[] = [
    {
      id: generateId(),
      name: 'Ventas',
      type: 'income',
      subcategories: ['Productos', 'Servicios', 'Consultoría'],
      userId,
      color: '#10B981',
      icon: '💰',
      isDefault: true,
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      name: 'Inversiones',
      type: 'income',
      subcategories: ['Dividendos', 'Intereses'],
      userId,
      color: '#059669',
      icon: '📈',
      isDefault: true,
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      name: 'Operaciones',
      type: 'expense',
      subcategories: ['Alquiler', 'Servicios públicos', 'Internet'],
      userId,
      color: '#EF4444',
      icon: '🏢',
      isDefault: true,
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      name: 'Personal',
      type: 'expense',
      subcategories: ['Salarios', 'Beneficios'],
      userId,
      color: '#F59E0B',
      icon: '👥',
      isDefault: true,
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      name: 'Marketing',
      type: 'expense',
      subcategories: ['Publicidad', 'Promociones'],
      userId,
      color: '#8B5CF6',
      icon: '📢',
      isDefault: true,
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Sample transactions for the last 3 months
  const sampleTransactions: Transaction[] = [];
  
  // Generate transactions for each month
  for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
    const monthDate = new Date(now);
    monthDate.setMonth(monthDate.getMonth() - monthOffset);
    const monthStr = monthDate.toISOString().substring(0, 7);
    
    // Income transactions
    const incomeTransactions = [
      {
        id: generateId(),
        type: 'income' as const,
        amount: 5000000 + Math.random() * 2000000, // 5-7M COP
        description: 'Venta de productos principales',
        category: 'Ventas',
        subcategory: 'Productos',
        date: `${monthStr}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        userId,
        paymentMethod: 'transfer' as const,
        reference: `INV-${monthStr.replace('-', '')}-001`,
        tags: ['productos', 'venta-principal'],
        attachments: [],
        createdAt: new Date(monthDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(monthDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        type: 'income' as const,
        amount: 2500000 + Math.random() * 1000000, // 2.5-3.5M COP
        description: 'Servicios de consultoría',
        category: 'Ventas',
        subcategory: 'Consultoría',
        date: `${monthStr}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        userId,
        paymentMethod: 'transfer' as const,
        reference: `CONS-${monthStr.replace('-', '')}-001`,
        tags: ['consultoria', 'servicios'],
        attachments: [],
        createdAt: new Date(monthDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(monthDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        type: 'income' as const,
        amount: 500000 + Math.random() * 300000, // 500K-800K COP
        description: 'Intereses bancarios',
        category: 'Inversiones',
        subcategory: 'Intereses',
        date: `${monthStr}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        userId,
        paymentMethod: 'transfer' as const,
        reference: `INT-${monthStr.replace('-', '')}-001`,
        tags: ['intereses', 'banco'],
        attachments: [],
        createdAt: new Date(monthDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(monthDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    // Expense transactions
    const expenseTransactions = [
      {
        id: generateId(),
        type: 'expense' as const,
        amount: 1200000, // 1.2M COP
        description: 'Alquiler oficina',
        category: 'Operaciones',
        subcategory: 'Alquiler',
        date: `${monthStr}-01`,
        userId,
        paymentMethod: 'transfer' as const,
        reference: `ALQ-${monthStr.replace('-', '')}-001`,
        tags: ['alquiler', 'oficina'],
        attachments: [],
        createdAt: new Date(monthDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(monthDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        type: 'expense' as const,
        amount: 300000 + Math.random() * 100000, // 300K-400K COP
        description: 'Servicios públicos',
        category: 'Operaciones',
        subcategory: 'Servicios públicos',
        date: `${monthStr}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        userId,
        paymentMethod: 'transfer' as const,
        reference: `SP-${monthStr.replace('-', '')}-001`,
        tags: ['servicios-publicos', 'luz', 'agua'],
        attachments: [],
        createdAt: new Date(monthDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(monthDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        type: 'expense' as const,
        amount: 2000000 + Math.random() * 500000, // 2-2.5M COP
        description: 'Salarios empleados',
        category: 'Personal',
        subcategory: 'Salarios',
        date: `${monthStr}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        userId,
        paymentMethod: 'transfer' as const,
        reference: `SAL-${monthStr.replace('-', '')}-001`,
        tags: ['salarios', 'nomina'],
        attachments: [],
        createdAt: new Date(monthDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(monthDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: generateId(),
        type: 'expense' as const,
        amount: 800000 + Math.random() * 400000, // 800K-1.2M COP
        description: 'Campaña publicitaria digital',
        category: 'Marketing',
        subcategory: 'Publicidad',
        date: `${monthStr}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        userId,
        paymentMethod: 'card' as const,
        reference: `PUB-${monthStr.replace('-', '')}-001`,
        tags: ['publicidad', 'digital', 'facebook', 'google'],
        attachments: [],
        createdAt: new Date(monthDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(monthDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    sampleTransactions.push(...incomeTransactions, ...expenseTransactions);
  }

  // Sample budgets
  const sampleBudgets: Budget[] = [
    {
      id: generateId(),
      userId,
      name: 'Presupuesto Marketing Mensual',
      category: 'Marketing',
      amount: 1500000, // 1.5M COP
      period: 'monthly',
      startDate: currentMonth + '-01',
      endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0],
      spent: 800000, // Will be calculated from transactions
      isActive: true,
      createdAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      userId,
      name: 'Presupuesto Operaciones Mensual',
      category: 'Operaciones',
      amount: 2000000, // 2M COP
      period: 'monthly',
      startDate: currentMonth + '-01',
      endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0],
      spent: 1500000, // Will be calculated from transactions
      isActive: true,
      createdAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateId(),
      userId,
      name: 'Presupuesto Personal Mensual',
      category: 'Personal',
      amount: 3000000, // 3M COP
      period: 'monthly',
      startDate: currentMonth + '-01',
      endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0],
      spent: 2200000, // Will be calculated from transactions
      isActive: true,
      createdAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  return {
    categories: sampleCategories,
    transactions: sampleTransactions,
    budgets: sampleBudgets,
  };
}

export function loadSampleDataForUser(userId: string) {
  if (typeof window === 'undefined') return;
  
  const sampleData = generateSampleData(userId);
  
  // Load sample data into localStorage
  const existingTransactions = JSON.parse(localStorage.getItem('budget_tracker_transactions') || '[]');
  const existingCategories = JSON.parse(localStorage.getItem('budget_tracker_categories') || '[]');
  const existingBudgets = JSON.parse(localStorage.getItem('budget_tracker_budgets') || '[]');
  
  // Only add sample data if user doesn't have any data yet
  const userHasTransactions = existingTransactions.some((t: Transaction) => t.userId === userId);
  const userHasCategories = existingCategories.some((c: Category) => c.userId === userId);
  const userHasBudgets = existingBudgets.some((b: Budget) => b.userId === userId);
  
  if (!userHasTransactions) {
    localStorage.setItem('budget_tracker_transactions', JSON.stringify([...existingTransactions, ...sampleData.transactions]));
  }
  
  if (!userHasCategories) {
    localStorage.setItem('budget_tracker_categories', JSON.stringify([...existingCategories, ...sampleData.categories]));
  }
  
  if (!userHasBudgets) {
    localStorage.setItem('budget_tracker_budgets', JSON.stringify([...existingBudgets, ...sampleData.budgets]));
  }
}