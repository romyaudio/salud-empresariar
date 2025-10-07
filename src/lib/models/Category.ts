import { Category, CategoryFormData } from '@/types';
import { generateId } from '@/lib/utils';

export class CategoryModel {
  static create(data: CategoryFormData, userId: string): Category {
    const now = new Date().toISOString();
    
    return {
      id: generateId(),
      name: data.name.trim(),
      type: data.type,
      subcategories: data.subcategories.filter(sub => sub.trim()).map(sub => sub.trim()),
      userId,
      color: data.color,
      icon: data.icon?.trim() || undefined,
      isDefault: false,
      createdAt: now,
      updatedAt: now,
    };
  }

  static validate(data: CategoryFormData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Name validation
    if (!data.name.trim()) {
      errors.push('El nombre de la categoría es requerido');
    }
    if (data.name.length > 50) {
      errors.push('El nombre no puede exceder 50 caracteres');
    }

    // Color validation
    if (!data.color || !/^#[0-9A-F]{6}$/i.test(data.color)) {
      errors.push('Debe seleccionar un color válido');
    }

    // Subcategories validation
    if (data.subcategories.length > 20) {
      errors.push('No puede tener más de 20 subcategorías');
    }

    const validSubcategories = data.subcategories.filter(sub => sub.trim());
    const uniqueSubcategories = new Set(validSubcategories.map(sub => sub.toLowerCase()));
    
    if (validSubcategories.length !== uniqueSubcategories.size) {
      errors.push('Las subcategorías deben ser únicas');
    }

    validSubcategories.forEach(sub => {
      if (sub.length > 30) {
        errors.push('Las subcategorías no pueden exceder 30 caracteres');
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static update(category: Category, updates: Partial<CategoryFormData>): Category {
    const updatedCategory = { ...category };
    
    if (updates.name !== undefined) {
      updatedCategory.name = updates.name.trim();
    }
    if (updates.color !== undefined) {
      updatedCategory.color = updates.color;
    }
    if (updates.icon !== undefined) {
      updatedCategory.icon = updates.icon?.trim() || undefined;
    }
    if (updates.subcategories !== undefined) {
      updatedCategory.subcategories = updates.subcategories
        .filter(sub => sub.trim())
        .map(sub => sub.trim());
    }

    updatedCategory.updatedAt = new Date().toISOString();
    
    return updatedCategory;
  }

  static getDefaultCategories(): Omit<Category, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] {
    return [
      // Income categories
      {
        name: 'Ventas',
        type: 'income',
        subcategories: ['Productos', 'Servicios', 'Consultoría'],
        color: '#10B981',
        icon: '💰',
        isDefault: true,
      },
      {
        name: 'Inversiones',
        type: 'income',
        subcategories: ['Dividendos', 'Intereses', 'Ganancias de capital'],
        color: '#059669',
        icon: '📈',
        isDefault: true,
      },
      {
        name: 'Otros Ingresos',
        type: 'income',
        subcategories: ['Reembolsos', 'Bonificaciones', 'Varios'],
        color: '#34D399',
        icon: '💵',
        isDefault: true,
      },
      
      // Expense categories
      {
        name: 'Operaciones',
        type: 'expense',
        subcategories: ['Alquiler', 'Servicios públicos', 'Internet', 'Teléfono'],
        color: '#EF4444',
        icon: '🏢',
        isDefault: true,
      },
      {
        name: 'Personal',
        type: 'expense',
        subcategories: ['Salarios', 'Beneficios', 'Capacitación'],
        color: '#F59E0B',
        icon: '👥',
        isDefault: true,
      },
      {
        name: 'Marketing',
        type: 'expense',
        subcategories: ['Publicidad', 'Promociones', 'Eventos'],
        color: '#8B5CF6',
        icon: '📢',
        isDefault: true,
      },
      {
        name: 'Tecnología',
        type: 'expense',
        subcategories: ['Software', 'Hardware', 'Mantenimiento'],
        color: '#3B82F6',
        icon: '💻',
        isDefault: true,
      },
      {
        name: 'Transporte',
        type: 'expense',
        subcategories: ['Combustible', 'Mantenimiento', 'Peajes'],
        color: '#6B7280',
        icon: '🚗',
        isDefault: true,
      },
      {
        name: 'Suministros',
        type: 'expense',
        subcategories: ['Oficina', 'Limpieza', 'Materiales'],
        color: '#84CC16',
        icon: '📦',
        isDefault: true,
      },
      {
        name: 'Impuestos',
        type: 'expense',
        subcategories: ['IVA', 'Renta', 'Industria y comercio'],
        color: '#DC2626',
        icon: '🏛️',
        isDefault: true,
      },
      {
        name: 'Otros Gastos',
        type: 'expense',
        subcategories: ['Varios', 'Imprevistos', 'Multas'],
        color: '#6B7280',
        icon: '💸',
        isDefault: true,
      },
    ];
  }

  static createDefaultCategories(userId: string): Category[] {
    const now = new Date().toISOString();
    
    return this.getDefaultCategories().map(categoryData => ({
      ...categoryData,
      id: generateId(),
      userId,
      createdAt: now,
      updatedAt: now,
    }));
  }

  static groupByType(categories: Category[]): { income: Category[]; expense: Category[] } {
    return categories.reduce(
      (groups, category) => {
        groups[category.type].push(category);
        return groups;
      },
      { income: [] as Category[], expense: [] as Category[] }
    );
  }

  static findByName(categories: Category[], name: string, type?: 'income' | 'expense'): Category | undefined {
    return categories.find(category => 
      category.name.toLowerCase() === name.toLowerCase() &&
      (type ? category.type === type : true)
    );
  }

  static getSubcategories(categories: Category[], categoryName: string): string[] {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.subcategories || [];
  }
}