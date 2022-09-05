import useModalStore from 'App/Modal/store';
import create from 'zustand';

/**
 * This store contains state for the jump to modal module
 */

export const useJumpToModalStore = create((set, get) => ({
  // opened state of the jump to modal
  open: useModalStore.getState().open,
  setOpen: useModalStore.getState().setOpen,
}));

export default useJumpToModalStore;
