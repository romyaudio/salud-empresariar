import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCurrentUser, signOut, AuthUser } from 'aws-amplify/auth';

export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User) => void;
  logout: () => Promise<void>;
  checkAuthState: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),

      setLoading: (isLoading) => set({ isLoading }),

      login: (user) => {
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        });
        
        // Load sample data for demo users
        if (typeof window !== 'undefined' && user.id.includes('demo')) {
          import('@/lib/data/sampleData').then(({ loadSampleDataForUser }) => {
            loadSampleDataForUser(user.id);
          });
        }
      },

      logout: async () => {
        try {
          await signOut();
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        } catch (error) {
          console.error('Error signing out:', error);
        }
      },

      checkAuthState: async () => {
        try {
          set({ isLoading: true });
          const currentUser = await getCurrentUser();
          
          if (currentUser) {
            const user: User = {
              id: currentUser.userId,
              email: currentUser.signInDetails?.loginId || '',
              name: currentUser.username,
              emailVerified: true, // Amplify handles verification
            };
            
            set({ 
              user, 
              isAuthenticated: true, 
              isLoading: false 
            });
          } else {
            set({ 
              user: null, 
              isAuthenticated: false, 
              isLoading: false 
            });
          }
        } catch (error) {
          console.error('Error checking auth state:', error);
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);