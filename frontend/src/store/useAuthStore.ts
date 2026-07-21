// src/store/useAuthStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserSession {
  email: string;
  name: string;
  role: 'Transport Head' | 'Parent' | 'Driver' | 'Super Admin';
  studentId?: string;
  employeeId?: string;
}

interface AuthState {
  user: UserSession | null;
  token: string | null;

  // Actions
  login: (user: UserSession, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: (user, token) => {
        set({ user, token });
      },

      logout: () => {
        set({ user: null, token: null });
      },

      isAuthenticated: () => {
        const { user, token } = get();
        return !!user && !!token;
      },
    }),
    {
      name: 'transport_auth',        // localStorage key
      partialize: (state) => ({      // only persist user + token
        user: state.user,
        token: state.token,
      }),
    }
  )
);
