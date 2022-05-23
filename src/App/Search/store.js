import create from 'zustand';

export const useSearchStore = create((set, get) => ({
  modalOpened: false,
  setModalOpened: (modalOpened) => set({ modalOpened }),
}));

export default useSearchStore;
