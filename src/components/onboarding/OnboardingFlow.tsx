'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { OnboardingPersonalInfo } from './OnboardingPersonalInfo';
import { OnboardingCompanyInfo } from './OnboardingCompanyInfo';
import { OnboardingWelcome } from './OnboardingWelcome';
import { useToast } from '@/hooks/useToast';

export type OnboardingStep = 'personal' | 'company' | 'welcome' | 'complete';

interface OnboardingData {
  personal: {
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    position?: string;
    bio?: string;
    profileImage?: string;
  };
  company: {
    companyName: string;
    address: string;
    city: string;
    country: string;
    taxId?: string;
    phone?: string;
    email?: string;
    website?: string;
    description?: string;
    industry?: string;
    foundedYear?: string;
    logo?: string;
    usePersonalAddress?: boolean;
  };
}

export function OnboardingFlow() {
  const router = useRouter();
  const { user, completeOnboarding } = useAuthStore();
  const { addToast } = useToast();
  
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('personal');
  
  // Initialize with user data from registration
  const initializePersonalData = () => {
    if (!user) return {
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      city: '',
      country: ''
    };

    // Extract name from user.name or email
    const fullName = user.name || user.email?.split('@')[0] || '';
    const nameParts = fullName.split(' ');
    
    return {
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: user.email,
      phone: '',
      address: '',
      city: '',
      country: ''
    };
  };

  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    personal: initializePersonalData(),
    company: {
      companyName: '',
      address: '',
      city: '',
      country: ''
    }
  });

  const updatePersonalData = (data: OnboardingData['personal']) => {
    setOnboardingData(prev => ({
      ...prev,
      personal: data
    }));
  };

  const updateCompanyData = (data: OnboardingData['company']) => {
    setOnboardingData(prev => ({
      ...prev,
      company: data
    }));
  };

  const handlePersonalComplete = (data: OnboardingData['personal']) => {
    updatePersonalData(data);
    setCurrentStep('company');
  };

  const handleCompanyComplete = (data: OnboardingData['company']) => {
    updateCompanyData(data);
    setCurrentStep('welcome');
  };

  const handleWelcomeComplete = () => {
    if (!user) {
      addToast('Error: Usuario no autenticado', 'error');
      return;
    }

    try {
      // Save data with user-specific keys (same format as useProfile)
      const userProfileData = {
        id: user.id,
        firstName: onboardingData.personal.firstName,
        lastName: onboardingData.personal.lastName,
        phone: onboardingData.personal.phone || null,
        position: onboardingData.personal.position || null,
        profileImage: onboardingData.personal.profileImage || '',
        bio: onboardingData.personal.bio || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const companyProfileData = {
        id: user.id,
        companyName: onboardingData.company.companyName,
        taxId: onboardingData.company.taxId || null,
        address: onboardingData.company.address || null,
        city: onboardingData.company.city || null,
        country: onboardingData.company.country || null,
        phone: onboardingData.company.phone || null,
        email: onboardingData.company.email || user.email,
        website: onboardingData.company.website || null,
        logo: onboardingData.company.logo || null,
        description: onboardingData.company.description || null,
        industry: onboardingData.company.industry || null,
        foundedYear: onboardingData.company.foundedYear ? parseInt(onboardingData.company.foundedYear) : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save with the same keys that useProfile uses
      localStorage.setItem(`budget_tracker_user_profile_${user.id}`, JSON.stringify(userProfileData));
      localStorage.setItem(`budget_tracker_company_profile_${user.id}`, JSON.stringify(companyProfileData));
      
      // Mark onboarding as completed
      completeOnboarding();
      
      // Show success message
      addToast('¡Bienvenido! Tu perfil ha sido configurado correctamente', 'success', 5000);
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/');
      }, 2000);
      
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      addToast('Error al guardar la información. Inténtalo de nuevo.', 'error');
    }
  };

  const getStepNumber = (step: OnboardingStep): number => {
    switch (step) {
      case 'personal': return 1;
      case 'company': return 2;
      case 'welcome': return 3;
      default: return 1;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/logo.svg" 
              alt="Salud Empresarial Logo" 
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido a Salud Empresarial!
          </h1>
          <p className="text-gray-600">
            Configuremos tu perfil para comenzar
          </p>
        </div>

        {/* Progress Bar */}
        {currentStep !== 'welcome' && (
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              {[1, 2].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      getStepNumber(currentStep) >= step
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 2 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        getStepNumber(currentStep) > step
                          ? 'bg-blue-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-2 space-x-8">
              <span className={`text-sm ${getStepNumber(currentStep) >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                Información Personal
              </span>
              <span className={`text-sm ${getStepNumber(currentStep) >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                Información Empresarial
              </span>
            </div>
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white shadow-lg rounded-lg">
          {currentStep === 'personal' && (
            <OnboardingPersonalInfo
              data={onboardingData.personal}
              onComplete={handlePersonalComplete}
            />
          )}
          
          {currentStep === 'company' && (
            <OnboardingCompanyInfo
              data={onboardingData.company}
              personalData={onboardingData.personal}
              onComplete={handleCompanyComplete}
              onBack={() => setCurrentStep('personal')}
            />
          )}
          
          {currentStep === 'welcome' && (
            <OnboardingWelcome
              personalData={onboardingData.personal}
              companyData={onboardingData.company}
              onComplete={handleWelcomeComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}