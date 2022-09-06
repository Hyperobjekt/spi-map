import create from 'zustand';
import { STAGE } from './constants';

const open = !JSON.parse(localStorage.getItem('SIGNED_IN'));
const stage = STAGE.LOGIN;

export const useIntroModalStore = create((set, get) => ({
  open,
  setOpen: (open) => set({ open }),
  stage,
  setStage: (stage) => set({ stage }),
}));

export default useIntroModalStore;
