import useDashboardStore from "../store";
import shallow from "zustand/shallow";
import { useMemo } from "react";

export default function useCurrentContext() {
  const [bubbleMetric, choroplethMetric, subgroup, region, year] =
    useDashboardStore(
      (state) => [
        state.bubbleMetric,
        state.choroplethMetric,
        state.subgroup,
        state.region,
        state.year,
      ],
      shallow
    );
  return useMemo(() => {
    return {
      bubbleMetric,
      choroplethMetric,
      subgroup,
      region,
      year,
    };
  }, [bubbleMetric, choroplethMetric, subgroup, region, year]);
}
