import create from 'zustand';

export const useSearchStore = create((set) => ({
  modalOpened: false,
  setModalOpened: (modalOpened) => set({ modalOpened }),
  recentLocations: [],
  setRecentLocations: (recentLocations) => set({ recentLocations }),
}));

export default useSearchStore;
