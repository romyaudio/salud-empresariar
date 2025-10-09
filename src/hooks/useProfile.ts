'use client';

import { useState, useEffect } from 'react';
import { UserProfile, CompanyProfile, UserProfileFormData, CompanyProfileFormData } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { AmplifyStorageService } from '@/lib/services/amplifyStorageService';
// GraphQL operations (commented out until S3 and database are configured)
// import { 
//   UPDATE_USER_PROFILE,
//   CREATE_COMPANY_PROFILE,
//   UPDATE_COMPANY_PROFILE 
// } from '@/lib/graphql/operations';

// Storage keys
const USER_PROFILE_KEY = 'budget_tracker_user_profile';
const COMPANY_PROFILE_KEY = 'budget_tracker_company_profile';

// Default data for new users
const getDefaultUserProfile = (userId: string): UserProfile => ({
  id: userId,
  firstName: '',
  lastName: '',
  phone: '',
  position: '',
  profileImage: '',
  bio: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

const getDefaultCompanyProfile = (userId: string): CompanyProfile => ({
  id: userId,
  companyName: '',
  taxId: '',
  address: '',
  city: '',
  country: '',
  phone: '',
  email: '',
  website: '',
  logo: '',
  description: '',
  industry: '',
  foundedYear: undefined,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// Storage helpers
const saveToStorage = (key: string, data: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

const loadFromStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

export function useProfile() {
  const { user } = useAuthStore();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Listen for profile updates from other components
  useEffect(() => {
    if (!user || !isHydrated) return;

    const handleUserProfileUpdate = (event: CustomEvent) => {
      const { userId, profile } = event.detail;
      if (userId === user.id) {
        setUserProfile(profile);
      }
    };

    const handleCompanyProfileUpdate = (event: CustomEvent) => {
      const { userId, profile } = event.detail;
      if (userId === user.id) {
        setCompanyProfile(profile);
      }
    };

    window.addEventListener('userProfileUpdated', handleUserProfileUpdate as EventListener);
    window.addEventListener('companyProfileUpdated', handleCompanyProfileUpdate as EventListener);

    return () => {
      window.removeEventListener('userProfileUpdated', handleUserProfileUpdate as EventListener);
      window.removeEventListener('companyProfileUpdated', handleCompanyProfileUpdate as EventListener);
    };
  }, [user, isHydrated]);

  // Load profile data
  useEffect(() => {
    const loadProfiles = async () => {
      if (!user || !isHydrated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Load from localStorage
        let storedUserProfile = loadFromStorage(`${USER_PROFILE_KEY}_${user.id}`);
        let storedCompanyProfile = loadFromStorage(`${COMPANY_PROFILE_KEY}_${user.id}`);

        // If no stored data, create default profiles with user info
        if (!storedUserProfile) {
          const userName = user.name || user.email?.split('@')[0] || 'Usuario';
          const nameParts = userName.split(' ');
          storedUserProfile = {
            ...getDefaultUserProfile(user.id),
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
          };
          saveToStorage(`${USER_PROFILE_KEY}_${user.id}`, storedUserProfile);
        }

        if (!storedCompanyProfile) {
          storedCompanyProfile = getDefaultCompanyProfile(user.id);
          saveToStorage(`${COMPANY_PROFILE_KEY}_${user.id}`, storedCompanyProfile);
        }

        // Simulate a small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 300));

        setUserProfile(storedUserProfile);
        setCompanyProfile(storedCompanyProfile);
      } catch (err) {
        setError('Error al cargar el perfil');
        console.error('Error loading profiles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfiles();
  }, [user, isHydrated]);

  const updateUserProfile = async (data: UserProfileFormData): Promise<void> => {
    if (!user || !userProfile) throw new Error('Usuario no autenticado o perfil no cargado');

    try {
      setIsSaving(true);
      setError(null);
      
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));

      // Update local state and storage
      const updatedProfile: UserProfile = {
        ...userProfile,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || null,
        position: data.position || null,
        bio: data.bio || null,
        profileImage: data.profileImage || userProfile.profileImage,
        updatedAt: new Date().toISOString()
      };

      setUserProfile(updatedProfile);
      saveToStorage(`${USER_PROFILE_KEY}_${user.id}`, updatedProfile);

      // Notify other components about the profile update
      window.dispatchEvent(new CustomEvent('userProfileUpdated', { 
        detail: { userId: user.id, profile: updatedProfile } 
      }));

    } catch (err) {
      setError('Error al actualizar el perfil personal');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const updateCompanyProfile = async (data: CompanyProfileFormData): Promise<void> => {
    if (!user || !userProfile) throw new Error('Usuario no autenticado o perfil no cargado');

    try {
      setIsSaving(true);
      setError(null);
      
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));

      const companyData = {
        companyName: data.companyName,
        taxId: data.taxId || null,
        address: data.address || null,
        city: data.city || null,
        country: data.country || null,
        phone: data.phone || null,
        email: data.email || null,
        website: data.website || null,
        logo: data.logo || companyProfile?.logo || null,
        description: data.description || null,
        industry: data.industry || null,
        foundedYear: data.foundedYear ? parseInt(data.foundedYear) : null
      };

      // Update local state and storage (GraphQL integration will be added later)
      const updatedProfile: CompanyProfile = {
        ...companyProfile!,
        ...companyData,
        id: companyProfile?.id || user.id,
        updatedAt: new Date().toISOString()
      };
      
      setCompanyProfile(updatedProfile);
      saveToStorage(`${COMPANY_PROFILE_KEY}_${user.id}`, updatedProfile);

      // Notify other components about the company profile update
      window.dispatchEvent(new CustomEvent('companyProfileUpdated', { 
        detail: { userId: user.id, profile: updatedProfile } 
      }));

    } catch (err) {
      setError('Error al actualizar el perfil empresarial');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const uploadProfileImage = async (file: File): Promise<string> => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      setIsSaving(true);
      setError(null);
      
      // Use AmplifyStorageService to handle upload
      const imageUrl = await AmplifyStorageService.uploadProfileImage(file, user.id);

      // Update profile with new image
      if (userProfile) {
        const updatedProfile = {
          ...userProfile,
          profileImage: imageUrl,
          updatedAt: new Date().toISOString()
        };
        
        setUserProfile(updatedProfile);
        saveToStorage(`${USER_PROFILE_KEY}_${user.id}`, updatedProfile);

        // Notify other components about the profile image update
        window.dispatchEvent(new CustomEvent('userProfileUpdated', { 
          detail: { userId: user.id, profile: updatedProfile } 
        }));
      }

      return imageUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen de perfil');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const uploadCompanyLogo = async (file: File): Promise<string> => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      setIsSaving(true);
      setError(null);
      
      // Use AmplifyStorageService to handle upload
      const logoUrl = await AmplifyStorageService.uploadCompanyLogo(file, user.id);

      // Update company profile with new logo
      if (companyProfile) {
        const updatedProfile = {
          ...companyProfile,
          logo: logoUrl,
          updatedAt: new Date().toISOString()
        };
        
        setCompanyProfile(updatedProfile);
        saveToStorage(`${COMPANY_PROFILE_KEY}_${user.id}`, updatedProfile);

        // Notify other components about the company logo update
        window.dispatchEvent(new CustomEvent('companyProfileUpdated', { 
          detail: { userId: user.id, profile: updatedProfile } 
        }));
      }

      return logoUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir el logo de la empresa');
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    userProfile,
    companyProfile,
    isLoading,
    isSaving,
    error,
    updateUserProfile,
    updateCompanyProfile,
    uploadProfileImage,
    uploadCompanyLogo
  };
}