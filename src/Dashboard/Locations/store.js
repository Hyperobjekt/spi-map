import create from "zustand";

const areEqual = (a, b) => a.properties.GEOID === b.properties.GEOID;

/**
 * This store contains active selections for the dashboard
 */
export const useLocationStore = create((set, get) => ({
  selected: [],
  addSelected: (selected) =>
    set((state) => {
      const alreadyExists = state.selected.some((f) => areEqual(f, selected));
      if (alreadyExists) return {};
      return { selected: [...state.selected, selected] };
    }),
  removeSelected: (selected) =>
    set((state) => {
      return { selected: state.selected.filter((f) => !areEqual(f, selected)) };
    }),
  isSelected: (feature) => get().selected.some((f) => areEqual(f, feature)),
}));

export default useLocationStore;
