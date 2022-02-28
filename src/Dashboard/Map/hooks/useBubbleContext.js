import { useMemo } from "react";
import { useCurrentContext } from "../../hooks";

/**
 * Returns a context object for the bubble based on current dashboard state
 */
export default function useBubbleContext() {
  const { bubbleMetric, subgroup, region, year } = useCurrentContext();
  return useMemo(() => {
    return {
      metric_id: bubbleMetric,
      subgroup_id: subgroup,
      region_id: region,
      year,
      type: "bubble",
    };
  }, [bubbleMetric, subgroup, region, year]);
}
