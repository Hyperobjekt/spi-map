import create from 'zustand';

/**
 * This store contains state for the jump to modal module
 */

export const useJumpToModalStore = create((set, get) => ({
  open: false,
  setOpen: (open) => set({ open }),
}));

export default useJumpToModalStore;
