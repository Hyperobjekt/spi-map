import create from "zustand";

/**
 * Contains expanded state for the indicator panel
 */
export const useIndicatorPanelStore = create((set, get) => ({
  open: false,
  setOpen: (open) => set({ open }),
  expanded: [],
  setExpanded: (expanded) => set({ expanded }),
  addExpanded: (id) =>
    set((state) => {
      const alreadyExists = state.expanded.includes(id);
      if (alreadyExists) return {};
      return { expanded: [...state.expanded, id] };
    }),
  removeExpanded: (id) =>
    set((state) => {
      return { expanded: state.expanded.filter((entry) => entry !== id) };
    }),
  toggleExpanded: (id) => {
    const alreadyExists = get().expanded.includes(id);
    if (alreadyExists) return get().removeExpanded(id);
    return get().addExpanded(id);
  },
}));

export default useIndicatorPanelStore;
