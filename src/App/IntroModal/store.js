import useModalStore from 'App/Modal/store';
import create from 'zustand';
import { STAGE } from './constants';

/**
 * This store contains state for the intro modal module
 */
const open = !JSON.parse(localStorage.getItem('SIGNED_IN'));
useModalStore.getState().setOpen(open);

const stage = STAGE.LOGIN;

export const useIntroModalStore = create((set, get) => ({
  // opened state of the intro modal
  open: useModalStore.getState().open,
  setOpen: useModalStore.getState().setOpen,
  stage,
  setStage: (stage) => set({ stage }),
}));

export default useIntroModalStore;
