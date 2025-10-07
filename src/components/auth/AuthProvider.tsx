'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { configureAmplify } from '@/lib/amplify';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const checkAuthState = useAuthStore((state) => state.checkAuthState);

  useEffect(() => {
    // Configure Amplify on app start
    configureAmplify();
    
    // Check initial auth state
    checkAuthState();
  }, [checkAuthState]);

  return <>{children}</>;
}