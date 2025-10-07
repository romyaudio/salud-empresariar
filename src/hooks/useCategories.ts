import { useState, useEffect } from 'react';
import { Category, CategoryFormData, ApiResponse } from '@/types';
import { DataService } from '@/lib/services/dataService';
import { CategoryModel } from '@/lib/models/Category';
import { useAuthStore } from '@/store/authStore';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const fetchCategories = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await DataService.getCategories(user.id);
      
      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        setError(response.error || 'Error al cargar las categorías');
      }
    } catch (err) {
      setError('Error al cargar las categorías');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (data: CategoryFormData): Promise<ApiResponse<Category>> => {
    if (!user) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    const validation = CategoryModel.validate(data);
    if (!validation.isValid) {
      return { success: false, error: validation.errors.join(', ') };
    }

    try {
      const category = CategoryModel.create(data, user.id);
      const response = await DataService.createCategory(category);
      
      if (response.success) {
        await fetchCategories(); // Refresh the list
      }
      
      return response;
    } catch (err) {
      console.error('Error creating category:', err);
      return { success: false, error: 'Error al crear la categoría' };
    }
  };

  const updateCategory = async (id: string, data: Partial<CategoryFormData>): Promise<ApiResponse<Category>> => {
    try {
      const currentCategory = categories.find(c => c.id === id);
      if (!currentCategory) {
        return { success: false, error: 'Categoría no encontrada' };
      }

      const updatedCategory = CategoryModel.update(currentCategory, data);
      const response = await DataService.updateCategory(id, updatedCategory);
      
      if (response.success) {
        await fetchCategories(); // Refresh the list
      }
      
      return response;
    } catch (err) {
      console.error('Error updating category:', err);
      return { success: false, error: 'Error al actualizar la categoría' };
    }
  };

  const deleteCategory = async (id: string): Promise<ApiResponse<boolean>> => {
    try {
      const response = await DataService.deleteCategory(id);
      
      if (response.success) {
        await fetchCategories(); // Refresh the list
      }
      
      return response;
    } catch (err) {
      console.error('Error deleting category:', err);
      return { success: false, error: 'Error al eliminar la categoría' };
    }
  };

  const getCategoryById = (id: string): Category | undefined => {
    return categories.find(c => c.id === id);
  };

  const getCategoryByName = (name: string, type?: 'income' | 'expense'): Category | undefined => {
    return CategoryModel.findByName(categories, name, type);
  };

  const getCategoriesByType = (type: 'income' | 'expense'): Category[] => {
    return categories.filter(c => c.type === type);
  };

  const getIncomeCategories = (): Category[] => {
    return getCategoriesByType('income');
  };

  const getExpenseCategories = (): Category[] => {
    return getCategoriesByType('expense');
  };

  const getSubcategories = (categoryName: string): string[] => {
    return CategoryModel.getSubcategories(categories, categoryName);
  };

  const getDefaultCategories = () => {
    return CategoryModel.getDefaultCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, [user]);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getCategoryByName,
    getCategoriesByType,
    getIncomeCategories,
    getExpenseCategories,
    getSubcategories,
    getDefaultCategories,
    refetch: fetchCategories,
  };
}