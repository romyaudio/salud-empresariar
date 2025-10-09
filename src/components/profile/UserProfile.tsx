'use client';

import { useState, useEffect } from 'react';
import { PersonalInfoForm } from '@/components/profile/PersonalInfoForm';
import { CompanyInfoForm } from '@/components/profile/CompanyInfoForm';
import { useProfile } from '@/hooks/useProfile';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorNotification } from '@/components/error/ErrorNotification';
import { ClientOnly } from '@/components/ui/ClientOnly';
import { SuccessNotification } from '@/components/ui/SuccessNotification';

interface UserProfileProps {
  activeTab: 'personal' | 'company';
}

export function UserProfile({ activeTab }: UserProfileProps) {
  const {
    userProfile,
    companyProfile,
    isLoading,
    isSaving,
    error,
    updateUserProfile,
    updateCompanyProfile,
    uploadProfileImage,
    uploadCompanyLogo
  } = useProfile();

  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleUserProfileUpdate = async (data: any) => {
    await updateUserProfile(data);
    setSuccessMessage('Tu información personal se ha actualizado correctamente');
    setShowSuccessNotification(true);
  };

  const handleCompanyProfileUpdate = async (data: any) => {
    await updateCompanyProfile(data);
    setSuccessMessage('La información de tu empresa se ha actualizado correctamente');
    setShowSuccessNotification(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <ClientOnly fallback={
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <div className="relative space-y-6">
        {/* Loading Overlay */}
        {isSaving && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 rounded-lg">
            <div className="flex flex-col items-center space-y-3">
              <LoadingSpinner size="lg" />
              <p className="text-sm text-gray-600 font-medium">Guardando cambios...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'personal' && (
          <PersonalInfoForm
            profile={userProfile || undefined}
            onSave={handleUserProfileUpdate}
            onImageUpload={uploadProfileImage}
            isLoading={isLoading}
            isSaving={isSaving}
          />
        )}

        {activeTab === 'company' && (
          <CompanyInfoForm
            profile={companyProfile || undefined}
            onSave={handleCompanyProfileUpdate}
            onImageUpload={uploadCompanyLogo}
            isLoading={isLoading}
            isSaving={isSaving}
          />
        )}

        {/* Success Notification */}
        <SuccessNotification
          show={showSuccessNotification}
          message={successMessage}
          onClose={() => setShowSuccessNotification(false)}
        />
      </div>
    </ClientOnly>
  );
}