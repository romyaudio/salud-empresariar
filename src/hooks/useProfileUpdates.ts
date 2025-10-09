'use client';

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/useToast';

export function useProfileUpdates() {
  const [isUpdating, setIsUpdating] = useState(false);
  const { addToast } = useToast();

  const handleUpdate = useCallback(async (
    updateFn: () => Promise<void>,
    successMessage: string = '✅ Cambios guardados correctamente',
    errorMessage: string = '❌ Error al guardar los cambios'
  ) => {
    setIsUpdating(true);
    
    try {
      await updateFn();
      
      // Add success toast with animation
      addToast(successMessage, 'success');
      
      // Add a small delay to show the update visually
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('Update error:', error);
      addToast(errorMessage, 'error');
    } finally {
      setIsUpdating(false);
    }
  }, [addToast]);

  return {
    isUpdating,
    handleUpdate
  };
}