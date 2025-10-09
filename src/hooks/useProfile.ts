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

// Enhanced storage helper that saves with both user ID and email
const saveToStorageWithBackup = (baseKey: string, userId: string, email: string | undefined, data: any) => {
  // Save with user ID (primary)
  saveToStorage(`${baseKey}_${userId}`, data);
  
  // Save with email as backup (if available)
  if (email) {
    saveToStorage(`${baseKey}_${email}`, data);
  }
  
  console.log('💾 Saved profile data with keys:', {
    primary: `${baseKey}_${userId}`,
    backup: email ? `${baseKey}_${email}` : 'none'
  });
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

        console.log('🔍 Loading profile for user:', { 
          userId: user.id, 
          email: user.email,
          name: user.name 
        });

        // Load from localStorage with user ID
        const userProfileKey = `${USER_PROFILE_KEY}_${user.id}`;
        const companyProfileKey = `${COMPANY_PROFILE_KEY}_${user.id}`;
        
        let storedUserProfile = loadFromStorage(userProfileKey);
        let storedCompanyProfile = loadFromStorage(companyProfileKey);

        console.log('📊 Profile data found:', {
          userProfile: !!storedUserProfile,
          hasProfileImage: !!storedUserProfile?.profileImage,
          profileImageUrl: storedUserProfile?.profileImage?.substring(0, 50) + '...',
          companyProfile: !!storedCompanyProfile
        });

        // If no data found with user ID, try with email as backup
        if (!storedUserProfile && user.email) {
          console.log('🔄 Trying backup key with email:', user.email);
          const emailUserProfileKey = `${USER_PROFILE_KEY}_${user.email}`;
          const emailCompanyProfileKey = `${COMPANY_PROFILE_KEY}_${user.email}`;
          
          storedUserProfile = loadFromStorage(emailUserProfileKey);
          storedCompanyProfile = loadFromStorage(emailCompanyProfileKey);
          
          if (storedUserProfile) {
            console.log('✅ Found profile data using email key');
            // Migrate data to user ID key for future use
            saveToStorage(userProfileKey, storedUserProfile);
            saveToStorage(companyProfileKey, storedCompanyProfile);
            console.log('🔄 Migrated profile data to user ID key');
          }
        }

        // If no stored data, create default profiles with user info
        if (!storedUserProfile) {
          const userName = user.name || user.email?.split('@')[0] || 'Usuario';
          const nameParts = userName.split(' ');
          storedUserProfile = {
            ...getDefaultUserProfile(user.id),
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
          };
          saveToStorageWithBackup(USER_PROFILE_KEY, user.id, user.email, storedUserProfile);
        }

        if (!storedCompanyProfile) {
          storedCompanyProfile = getDefaultCompanyProfile(user.id);
          saveToStorageWithBackup(COMPANY_PROFILE_KEY, user.id, user.email, storedCompanyProfile);
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
      saveToStorageWithBackup(USER_PROFILE_KEY, user.id, user.email, updatedProfile);

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
      saveToStorageWithBackup(COMPANY_PROFILE_KEY, user.id, user.email, updatedProfile);

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
        saveToStorageWithBackup(USER_PROFILE_KEY, user.id, user.email, updatedProfile);

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
        saveToStorageWithBackup(COMPANY_PROFILE_KEY, user.id, user.email, updatedProfile);

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