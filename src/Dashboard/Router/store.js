import create from "zustand";

// maps dashboard state value names to query param names
const DEFAULT_VARMAP = {
  choroplethMetric: "c",
  bubbleMetric: "b",
  subgroup: "s",
  region: "r",
  year: "y",
  zoom: "z",
  latitude: "lat",
  longitude: "lon",
  locations: "l",
};

/**
 * This store contains route state
 */
export const useRouteStore = create((set) => ({
  // an object that maps state values to query param names
  varMap: DEFAULT_VARMAP,
  setVarMap: (varMap) => set({ varMap }),
  // an object that contains all query param values
  queryParams: {},
  setQueryParams: (queryParams) => set({ queryParams }),
}));

export default useRouteStore;
