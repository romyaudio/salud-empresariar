'use client';

import { useState, useEffect } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { Category } from '@/types';

interface CategorySelectorProps {
  type: 'income' | 'expense';
  selectedCategory?: string;
  selectedSubcategory?: string;
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
  disabled?: boolean;
  required?: boolean;
}

export function CategorySelector({
  type,
  selectedCategory,
  selectedSubcategory,
  onCategoryChange,
  onSubcategoryChange,
  disabled = false,
  required = false
}: CategorySelectorProps) {
  const { categories, loading } = useCategories();
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([]);

  // Filtrar categorías por tipo
  const filteredCategories = categories.filter(cat => cat.type === type);

  // Actualizar subcategorías cuando cambie la categoría seleccionada
  useEffect(() => {
    if (selectedCategory) {
      const category = filteredCategories.find(cat => cat.name === selectedCategory);
      if (category) {
        setAvailableSubcategories(category.subcategories);
        // Si la subcategoría seleccionada no está en las disponibles, limpiarla
        if (selectedSubcategory && !category.subcategories.includes(selectedSubcategory)) {
          onSubcategoryChange('');
        }
      } else {
        setAvailableSubcategories([]);
        onSubcategoryChange('');
      }
    } else {
      setAvailableSubcategories([]);
      onSubcategoryChange('');
    }
  }, [selectedCategory, filteredCategories, selectedSubcategory, onSubcategoryChange]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onCategoryChange(value);
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onSubcategoryChange(value);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría {required && '*'}
          </label>
          <div className="animate-pulse bg-gray-200 h-10 rounded-md"></div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subcategoría
          </label>
          <div className="animate-pulse bg-gray-200 h-10 rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Selector de Categoría */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Categoría {required && '*'}
        </label>
        <select
          value={selectedCategory || ''}
          onChange={handleCategoryChange}
          disabled={disabled}
          required={required}
          className={`
            w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            ${!selectedCategory && required ? 'border-red-300' : 'border-gray-300'}
          `}
        >
          <option value="">Selecciona una categoría</option>
          {filteredCategories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>
        {!selectedCategory && required && (
          <p className="mt-1 text-sm text-red-600">La categoría es obligatoria</p>
        )}
      </div>

      {/* Selector de Subcategoría */}
      {availableSubcategories.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subcategoría
          </label>
          <select
            value={selectedSubcategory || ''}
            onChange={handleSubcategoryChange}
            disabled={disabled || availableSubcategories.length === 0}
            className={`
              w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500
              ${disabled || availableSubcategories.length === 0 ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            `}
          >
            <option value="">Selecciona una subcategoría (opcional)</option>
            {availableSubcategories.map((subcategory, index) => (
              <option key={index} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Información adicional */}
      {filteredCategories.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <p className="text-sm text-yellow-800">
            No hay categorías de {type === 'expense' ? 'gastos' : 'ingresos'} disponibles.
          </p>
          <p className="text-sm text-yellow-700 mt-1">
            Las categorías se crearán automáticamente cuando sea necesario.
          </p>
        </div>
      )}

      {/* Vista previa de la categoría seleccionada */}
      {selectedCategory && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-center space-x-2">
            {(() => {
              const category = filteredCategories.find(cat => cat.name === selectedCategory);
              return category ? (
                <>
                  <span className="text-lg">{category.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-blue-900">{category.name}</p>
                    {selectedSubcategory && (
                      <p className="text-sm text-blue-700">→ {selectedSubcategory}</p>
                    )}
                  </div>
                  <div
                    className="w-4 h-4 rounded-full ml-auto"
                    style={{ backgroundColor: category.color }}
                  ></div>
                </>
              ) : null;
            })()}
          </div>
        </div>
      )}
    </div>
  );
}