import { useMemo } from "react";
import useCurrentContext from "./useCurrentContext";

/**
 * Returns a context object for the choropleth based on current dashboard state
 */
export default function useChoroplethContext() {
  const { choroplethMetric, subgroup, region, year } = useCurrentContext();
  return useMemo(() => {
    return {
      metric_id: choroplethMetric,
      subgroup_id: subgroup,
      region_id: region,
      year,
      type: "choropleth",
    };
  }, [choroplethMetric, subgroup, region, year]);
}
