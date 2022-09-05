import create from 'zustand';

/**
 * This store contains state for the intro modal module
 */
const open = !JSON.parse(localStorage.getItem('SIGNED_IN'));

export const useModalStore = create((set, get) => ({
  // opened state of the intro modal
  open: open,
  setOpen: (open) => set({ open }),
}));

export default useModalStore;
