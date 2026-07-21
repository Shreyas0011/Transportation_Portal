// src/store/index.ts
// Central re-export for all Zustand stores.
// Import from here in components: import { useAuthStore, useAppStore } from '../store';

export { useAuthStore } from './useAuthStore';
export type { UserSession } from './useAuthStore';

export { useAppStore } from './useAppStore';
