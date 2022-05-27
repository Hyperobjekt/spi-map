import create from 'zustand';

/**
 * This store contains state for the intro modal module
 */

// date thirty days ago
const thresholdDate = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
// date stored in local storage
const firstVisitDate = new Date(localStorage.getItem('spi.firstVisit')) || false;
// if local storage is unset or date is older than thirty days
const open = firstVisitDate ? firstVisitDate < thresholdDate : true;

export const useIntroModalStore = create((set, get) => ({
  // opened state of the intro modal
  open: open,
  setOpen: (open) => set({ open }),
}));

export default useIntroModalStore;
