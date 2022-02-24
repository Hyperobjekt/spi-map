import create from "zustand";

/**
 * This store contains active selections for the dashboard
 */
export const useDashboardStore = create((set) => ({
  /** current choropleth metric */
  choroplethMetric: null,
  setChoroplethMetric: (choroplethMetric) => set({ choroplethMetric }),
  /** current bubble metric */
  bubbleMetric: null,
  setBubbleMetric: (bubbleMetric) => set({ bubbleMetric }),
  /** current subgroup selection */
  subgroup: null,
  setSubgroup: (subgroup) => set({ subgroup }),
  /** current region selection */
  region: null,
  setRegion: (region) => set({ region }),
  /** current year selection */
  year: null,
  setYear: (year) => set({ year }),
  /** [x,y] coords of the mouse for positioning tooltips */
  hoverCoords: [0, 0],
  setHoverCoords: (hoverCoords) => set({ hoverCoords }),
  /** automatically switch to different geographies when true */
  autoSwitchRegion: true,
  setAutoSwitchRegion: (autoSwitchRegion) => set({ autoSwitchRegion }),
  /** updates the store with values in the provided config */
  setDefaultsFromConfig: (config) => {
    const updates = {};
    const appConfig = config.app;
    updates["year"] = appConfig.default_year || appConfig.years?.[0];
    updates["region"] = appConfig.default_region || config.regions?.[0]?.id;
    updates["subgroup"] =
      appConfig.default_subgroup || config.subgroups?.[0]?.id;
    updates["choroplethMetric"] = appConfig.default_choropleth_metric;
    updates["bubbleMetric"] = appConfig.default_bubble_metric;
    set(updates);
  },
  /** expose setter for extending store values */
  set: set,
}));

export default useDashboardStore;
