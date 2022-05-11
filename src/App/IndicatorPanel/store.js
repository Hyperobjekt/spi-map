import create from 'zustand';

/**
 * This store contains state for the indicator panels module
 */
export const useIndicatorPanelStore = create((set, get) => ({
  // opened state of the indicators panel
  open: false,
  setOpen: (open) => set({ open }),
  // opened state of customize indicators panel
  customizeOpen: false,
  setCustomizeOpen: (customizeOpen) => set({ customizeOpen }),
  // array of indicator IDs to show in indicator panel
  customizedMetrics: [],
  setCustomizedMetrics: (customizedMetrics) => set({ customizedMetrics }),
  // toggle state that determines if panel shows customized metrics
  enableCustomized: false,
  setEnableCustomized: (enableCustomized) => set({ enableCustomized }),
  // array of indicator IDs that should be expanded
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
