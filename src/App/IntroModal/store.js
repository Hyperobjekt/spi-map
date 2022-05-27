import create from 'zustand';

/**
 * This store contains state for the intro modal module
 */
export const useIntroModalStore = create((set, get) => ({
  // opened state of the intro modal
  open: true,
  setOpen: (open) => set({ open }),
}));

export default useIntroModalStore;
