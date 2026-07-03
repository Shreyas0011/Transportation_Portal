// src/store/useAppStore.ts
import { create } from 'zustand';

type Role = 'Transport Head' | 'Parent' | 'Driver' | 'Super Admin';

// Default tab per role
const defaultTabForRole: Record<Role, string> = {
  'Transport Head': 'overview',
  'Parent': 'child-info',
  'Driver': 'my-schedule',
  'Super Admin': 'users',
};

interface AppState {
  activeTab: string;

  // Actions
  setActiveTab: (tab: string) => void;
  resetTabForRole: (role: Role) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: 'overview',

  setActiveTab: (tab) => set({ activeTab: tab }),

  resetTabForRole: (role) =>
    set({ activeTab: defaultTabForRole[role] ?? 'overview' }),
}));

export { defaultTabForRole };
