import { useCurrentContext } from "../../hooks";
import { useMapLayersConfig } from "../../Config";

/**
 * Returns the map layer configuration for the active bubble.
 */
export default function useBubbleLayerConfig() {
  const { bubbleMetric, subgroup, region, year } = useCurrentContext();
  return useMapLayersConfig({
    metric_id: bubbleMetric,
    subgroup_id: subgroup,
    region_id: region,
    year,
    type: "bubble",
  });
}
