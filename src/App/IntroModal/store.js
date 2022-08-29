import create from 'zustand';
import { STAGE } from './constants';

/**
 * This store contains state for the intro modal module
 */
const open = !JSON.parse(localStorage.getItem('SIGNED_IN'));
const stage = STAGE.LOGIN;

export const useIntroModalStore = create((set, get) => ({
  // opened state of the intro modal
  open: open,
  setOpen: (open) => set({ open }),
  stage: stage,
  setStage: (stage) => set({ stage }),
}));

export default useIntroModalStore;
