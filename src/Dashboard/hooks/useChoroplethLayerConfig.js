import { useMapLayersConfig } from "../Config";
import useCurrentContext from "./useCurrentContext";

/**
 * Returns the map layer configuration for the active choropleth.
 */
export default function useChoroplethLayerConfig() {
  const { choroplethMetric, subgroup, region, year } = useCurrentContext();
  return useMapLayersConfig({
    metric_id: choroplethMetric,
    subgroup_id: subgroup,
    region_id: region,
    year,
    type: "choropleth",
  });
}
