import create from 'zustand';

/**
 * This store contains state for the app module
 */

export const useAppStore = create((set, get) => ({
  // opened state of the intro modal
  role: null,
  setRole: (role) => set({ role }),
}));

export default useAppStore;
