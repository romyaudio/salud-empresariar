'use client';

import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useCategories } from '@/hooks/useCategories';
import { Category } from '@/types';

interface CategoryManagerProps {
  onCategorySelect?: (category: Category) => void;
  selectedCategory?: Category | null;
  type?: 'income' | 'expense' | 'all';
  showAddNew?: boolean;
}

export function CategoryManager({ 
  onCategorySelect, 
  selectedCategory, 
  type = 'all',
  showAddNew = true 
}: CategoryManagerProps) {
  const { categories, loading, createCategory, updateCategory, deleteCategory } = useCategories();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategoryData, setNewCategoryData] = useState({
    name: '',
    type: 'expense' as 'income' | 'expense',
    color: '#EF4444',
    icon: '💸',
    subcategories: [] as string[],
    newSubcategory: ''
  });

  // Filtrar categorías por tipo
  const filteredCategories = categories.filter(cat => {
    if (type === 'all') return true;
    return cat.type === type;
  });

  // Categorías predefinidas para gastos
  const defaultExpenseCategories = [
    {
      name: 'Gastos Operativos',
      color: '#EF4444',
      icon: '💸',
      subcategories: ['Materiales', 'Servicios', 'Mantenimiento', 'Transporte']
    },
    {
      name: 'Personal',
      color: '#F59E0B',
      icon: '👥',
      subcategories: ['Salarios', 'Beneficios', 'Capacitación', 'Bonificaciones']
    },
    {
      name: 'Marketing',
      color: '#8B5CF6',
      icon: '📢',
      subcategories: ['Publicidad', 'Redes Sociales', 'Eventos', 'Material Promocional']
    },
    {
      name: 'Oficina',
      color: '#06B6D4',
      icon: '🏢',
      subcategories: ['Alquiler', 'Servicios Públicos', 'Suministros', 'Equipos']
    },
    {
      name: 'Tecnología',
      color: '#10B981',
      icon: '💻',
      subcategories: ['Software', 'Hardware', 'Hosting', 'Licencias']
    },
    {
      name: 'Otros Gastos',
      color: '#6B7280',
      icon: '📋',
      subcategories: ['Varios', 'Imprevistos', 'Otros']
    }
  ];

  // Crear categorías predefinidas si no existen
  useEffect(() => {
    const createDefaultCategories = async () => {
      if (categories.length === 0 && !loading) {
        for (const defaultCat of defaultExpenseCategories) {
          await createCategory({
            name: defaultCat.name,
            type: 'expense',
            color: defaultCat.color,
            icon: defaultCat.icon,
            subcategories: defaultCat.subcategories
          });
        }
      }
    };

    createDefaultCategories();
  }, [categories.length, loading, createCategory]);

  const handleAddCategory = async () => {
    if (!newCategoryData.name.trim()) return;

    const result = await createCategory({
      name: newCategoryData.name,
      type: newCategoryData.type,
      color: newCategoryData.color,
      icon: newCategoryData.icon,
      subcategories: newCategoryData.subcategories
    });

    if (result.success) {
      setNewCategoryData({
        name: '',
        type: 'expense',
        color: '#EF4444',
        icon: '💸',
        subcategories: [],
        newSubcategory: ''
      });
      setShowAddForm(false);
    }
  };

  const handleAddSubcategory = () => {
    if (!newCategoryData.newSubcategory.trim()) return;
    
    setNewCategoryData(prev => ({
      ...prev,
      subcategories: [...prev.subcategories, prev.newSubcategory.trim()],
      newSubcategory: ''
    }));
  };

  const handleRemoveSubcategory = (index: number) => {
    setNewCategoryData(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index)
    }));
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryData({
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon || '💸',
      subcategories: [...category.subcategories],
      newSubcategory: ''
    });
    setShowAddForm(true);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !newCategoryData.name.trim()) return;

    const result = await updateCategory(editingCategory.id, {
      name: newCategoryData.name,
      color: newCategoryData.color,
      icon: newCategoryData.icon,
      subcategories: newCategoryData.subcategories
    });

    if (result.success) {
      setEditingCategory(null);
      setNewCategoryData({
        name: '',
        type: 'expense',
        color: '#EF4444',
        icon: '💸',
        subcategories: [],
        newSubcategory: ''
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      await deleteCategory(categoryId);
    }
  };

  const handleCategoryClick = (category: Category) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Cargando categorías...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Categorías {type === 'expense' ? 'de Gastos' : type === 'income' ? 'de Ingresos' : ''}
        </h3>
        {showAddNew && (
          <Button
            variant="secondary"
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-sm"
          >
            {showAddForm ? 'Cancelar' : '+ Nueva Categoría'}
          </Button>
        )}
      </div>

      {/* Add/Edit Category Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h4 className="font-medium text-gray-900">
            {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <Input
                value={newCategoryData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setNewCategoryData(prev => ({ ...prev, name: e.target.value }))
                }
                placeholder="Ej: Marketing Digital"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={newCategoryData.type}
                onChange={(e) => 
                  setNewCategoryData(prev => ({ ...prev, type: e.target.value as 'income' | 'expense' }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={editingCategory !== null}
              >
                <option value="expense">Gasto</option>
                <option value="income">Ingreso</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={newCategoryData.color}
                  onChange={(e) => 
                    setNewCategoryData(prev => ({ ...prev, color: e.target.value }))
                  }
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <Input
                  value={newCategoryData.color}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setNewCategoryData(prev => ({ ...prev, color: e.target.value }))
                  }
                  placeholder="#EF4444"
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icono
              </label>
              <Input
                value={newCategoryData.icon}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setNewCategoryData(prev => ({ ...prev, icon: e.target.value }))
                }
                placeholder="💸"
                maxLength={2}
              />
            </div>
          </div>

          {/* Subcategorías */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategorías
            </label>
            
            <div className="flex space-x-2 mb-2">
              <Input
                value={newCategoryData.newSubcategory}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setNewCategoryData(prev => ({ ...prev, newSubcategory: e.target.value }))
                }
                placeholder="Nueva subcategoría"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubcategory();
                  }
                }}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddSubcategory}
                className="whitespace-nowrap"
              >
                Agregar
              </Button>
            </div>

            {newCategoryData.subcategories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {newCategoryData.subcategories.map((sub, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-700"
                  >
                    {sub}
                    <button
                      type="button"
                      onClick={() => handleRemoveSubcategory(index)}
                      className="ml-1 text-gray-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
              disabled={!newCategoryData.name.trim()}
            >
              {editingCategory ? 'Actualizar' : 'Crear'} Categoría
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddForm(false);
                setEditingCategory(null);
                setNewCategoryData({
                  name: '',
                  type: 'expense',
                  color: '#EF4444',
                  icon: '💸',
                  subcategories: [],
                  newSubcategory: ''
                });
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className={`
              p-4 rounded-lg border-2 cursor-pointer transition-all
              ${selectedCategory?.id === category.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300 bg-white'
              }
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium text-gray-900">{category.name}</span>
              </div>
              
              {!category.isDefault && (
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCategory(category);
                    }}
                    className="text-gray-400 hover:text-blue-500 text-sm"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(category.id);
                    }}
                    className="text-gray-400 hover:text-red-500 text-sm"
                  >
                    🗑️
                  </button>
                </div>
              )}
            </div>

            <div
              className="w-full h-2 rounded-full mb-2"
              style={{ backgroundColor: category.color }}
            ></div>

            {category.subcategories.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {category.subcategories.slice(0, 3).map((sub, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                  >
                    {sub}
                  </span>
                ))}
                {category.subcategories.length > 3 && (
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                    +{category.subcategories.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No hay categorías disponibles.</p>
          {showAddNew && (
            <p className="text-sm mt-2">Crea tu primera categoría usando el botón de arriba.</p>
          )}
        </div>
      )}
    </div>
  );
}