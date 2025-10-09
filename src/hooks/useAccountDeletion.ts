'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/useToast';
import { deleteUser } from 'aws-amplify/auth';

interface DeleteAccountData {
  reason: string;
  feedback: string;
  alternativeConsidered: boolean;
}

export function useAccountDeletion() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { addToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteAccount = async (data: DeleteAccountData) => {
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    setIsDeleting(true);
    try {
      // 1. Log the deletion reason for analytics (optional)
      console.log('Account deletion:', {
        userId: user.id,
        reason: data.reason,
        feedback: data.feedback,
        alternativeConsidered: data.alternativeConsidered,
        timestamp: new Date().toISOString()
      });

      // 2. Delete all user data from localStorage
      const keysToDelete = [
        `budget_tracker_user_profile_${user.id}`,
        `budget_tracker_company_profile_${user.id}`,
        `budget_tracker_transactions`,
        `budget_tracker_categories`,
        `budget_tracker_budgets`,
        `budget_tracker_user_data`,
        `onboarding_${user.id}`,
        `sample_data_loaded_${user.id}`
      ];

      // Clear user-specific data
      keysToDelete.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn(`Failed to remove ${key}:`, error);
        }
      });

      // Clear auth storage
      try {
        localStorage.removeItem('auth-storage');
      } catch (error) {
        console.warn('Failed to remove auth storage:', error);
      }

      // 3. Delete user account from AWS Cognito
      // This will also trigger deletion of associated data in DynamoDB
      // due to the owner-based authorization in the GraphQL schema
      await deleteUser();

      // 4. Log out and clear any remaining state
      await logout();
      
      // 5. Show success message
      addToast('Tu cuenta ha sido eliminada exitosamente', 'success', 5000);
      
      // 6. Redirect to home page
      router.push('/');
      
      return { success: true };
      
    } catch (error: any) {
      console.error('Error deleting account:', error);
      
      let errorMessage = 'Error al eliminar la cuenta. Inténtalo de nuevo.';
      
      if (error.name === 'NotAuthorizedException') {
        errorMessage = 'Error de autorización. Por favor, inicia sesión de nuevo.';
      } else if (error.name === 'InvalidParameterException') {
        errorMessage = 'Error en los parámetros. Contacta soporte.';
      } else if (error.name === 'UserNotFoundException') {
        errorMessage = 'Usuario no encontrado. La cuenta puede ya estar eliminada.';
      } else if (error.name === 'TooManyRequestsException') {
        errorMessage = 'Demasiados intentos. Espera un momento antes de intentar de nuevo.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      addToast(errorMessage, 'error');
      throw error;
      
    } finally {
      setIsDeleting(false);
    }
  };

  const clearUserData = (userId: string) => {
    // Helper function to clear all user data without deleting the account
    const keysToDelete = [
      `budget_tracker_user_profile_${userId}`,
      `budget_tracker_company_profile_${userId}`,
      `budget_tracker_transactions`,
      `budget_tracker_categories`,
      `budget_tracker_budgets`,
      `budget_tracker_user_data`,
      `onboarding_${userId}`,
      `sample_data_loaded_${userId}`
    ];

    keysToDelete.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn(`Failed to remove ${key}:`, error);
      }
    });
  };

  return {
    deleteAccount,
    clearUserData,
    isDeleting
  };
}