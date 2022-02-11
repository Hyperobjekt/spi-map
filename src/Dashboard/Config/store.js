import create from "zustand";
import { loadConfig } from ".";

/**
 * This store contains all configuration for the dashboard. See the README.md
 * for more details about data shape and sample configurations.
 */
export const useConfigStore = create((set, get) => ({
  app: {},
  setApp: (app) => set({ app }),
  /** configuration for metrics in the tool */
  metrics: [],
  setMetrics: (metrics) => set({ metrics }),
  defaultMetric: null,
  setDefaultMetric: (metric) => set({ defaultMetric: metric }),
  /** configuration for subgroups of metrics */
  subgroups: [],
  setSubgroups: (subgroups) => set({ subgroups }),
  /** configuration for regions within the tool */
  regions: [],
  setRegions: (regions) => set({ regions }),
  defaultRegion: null,
  setDefaultRegion: (region) => set({ defaultRegion: region }),
  /** configuration for data sources */
  dataSources: [],
  setDataSources: [],
  /** scale configurations for metrics */
  scales: [],
  setScales: (scales) => set({ scales }),
  /** configuration for all available map layers */
  mapLayers: [],
  setMapLayers: (mapLayers) => set({ mapLayers }),
  /** config helper */
  setConfig: (type, config) => {
    set((state) => ({
      [type]: config,
      loaded: [...state.loaded, type],
    }));
  },
  loadConfig: async (type, url, options = {}) => {
    const config = await loadConfig(url, { type, ...options });
    console.debug(`loaded ${type} config`, config);
    set((state) => ({
      [type]: config,
      loaded: [...state.loaded, type],
    }));
    return { type, config };
  },
  loaded: [],
  setLoaded: (loaded) => set({ loaded }),
  getConfig: (type) => get()[type],
  getAllConfig: () => ({
    app: get().app,
    metrics: get().metrics,
    subgroups: get().subgroups,
    regions: get().regions,
    dataSources: get().dataSources,
    scales: get().scales,
    mapLayers: get().mapLayers,
  }),
  ready: false,
  setReady: (ready) => set({ ready }),
  // BELOW IS APP CONFIGURATION
  /** configuration for available years */
  // years: [],
  // setYears: (years) => set({ years }),
  // defaultYear: null,
  // setDefaultYear: (year) => set({ defaultYear: year }),
  // /** default map viewport */
  // mapBounds: null,
  // setMapBounds: (mapBounds) => set({ mapBounds }),
  // /** an array of colors to use for locations */
  // locationColors: [],
  // setLocationColors: (locationColors) => set({ locationColors }),
  // /** an array of colors to use for choropleth defaults */
  // choroplethColors: [],
  // setChoroplethColors: (choroplethColors) => set({ choroplethColors }),
  // /** a colors to use for bubbles */
  // bubbleColor: "#f00",
  // setBubbleColor: (bubbleColor) => set({ bubbleColor }),
}));

export default useConfigStore;
