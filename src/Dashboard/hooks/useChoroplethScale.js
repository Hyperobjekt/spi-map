import shallow from "zustand/shallow";
import useDashboardStore from "../store";
import useScale from "./useScale";

/**
 * Returns ScaleProps, TickProps, and scale functions for the current choropleth scale
 */
export default function useChoroplethScale() {
  const [choroplethMetric, subgroup, region, year] = useDashboardStore(
    (state) => [
      state.choroplethMetric,
      state.subgroup,
      state.region,
      state.year,
    ],
    shallow
  );
  const context = {
    metric_id: choroplethMetric,
    subgroup_id: subgroup,
    region_id: region,
    year,
    type: "choropleth",
  };
  return useScale(context);
}
