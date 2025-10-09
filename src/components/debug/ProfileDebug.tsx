'use client';

import { useAuthStore } from '@/store/authStore';
import { useProfile } from '@/hooks/useProfile';
import { useEffect, useState } from 'react';

export function ProfileDebug() {
  const { user } = useAuthStore();
  const { userProfile, companyProfile, isLoading } = useProfile();
  const [localStorageData, setLocalStorageData] = useState<any>({});

  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      const data = {
        userProfileById: localStorage.getItem(`budget_tracker_user_profile_${user.id}`),
        userProfileByEmail: user.email ? localStorage.getItem(`budget_tracker_user_profile_${user.email}`) : null,
        companyProfileById: localStorage.getItem(`budget_tracker_company_profile_${user.id}`),
        companyProfileByEmail: user.email ? localStorage.getItem(`budget_tracker_company_profile_${user.email}`) : null,
      };
      setLocalStorageData(data);
    }
  }, [user, userProfile]);

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg max-w-md text-xs z-50">
      <h3 className="font-bold mb-2">🔍 Profile Debug</h3>
      
      <div className="space-y-2">
        <div>
          <strong>User Info:</strong>
          <div>ID: {user.id}</div>
          <div>Email: {user.email}</div>
          <div>Name: {user.name}</div>
        </div>

        <div>
          <strong>Profile State:</strong>
          <div>Loading: {isLoading ? '✅' : '❌'}</div>
          <div>User Profile: {userProfile ? '✅' : '❌'}</div>
          <div>Has Image: {userProfile?.profileImage ? '✅' : '❌'}</div>
          <div>Company Profile: {companyProfile ? '✅' : '❌'}</div>
        </div>

        <div>
          <strong>LocalStorage Keys:</strong>
          <div>By ID: {localStorageData.userProfileById ? '✅' : '❌'}</div>
          <div>By Email: {localStorageData.userProfileByEmail ? '✅' : '❌'}</div>
        </div>

        {userProfile?.profileImage && (
          <div>
            <strong>Image URL:</strong>
            <div className="break-all">
              {userProfile.profileImage.substring(0, 50)}...
            </div>
            <div>Type: {userProfile.profileImage.startsWith('blob:') ? 'Blob (temp)' : 'Permanent'}</div>
          </div>
        )}
      </div>
    </div>
  );
}