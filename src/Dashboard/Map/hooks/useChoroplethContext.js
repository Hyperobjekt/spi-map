import { useMemo } from "react";
import { useCurrentContext } from "../../hooks";

/**
 * Returns a context object for the choropleth based on current dashboard state
 */
export default function useChoroplethContext(overrides) {
  const { choroplethMetric, subgroup, region, year } = useCurrentContext();
  overrides = overrides || {};

  return useMemo(() => {
    return {
      metric_id: choroplethMetric,
      subgroup_id: subgroup,
      region_id: region,
      year,
      type: "choropleth",
      ...overrides,
    };
  }, [choroplethMetric, subgroup, region, year, overrides]);
}
